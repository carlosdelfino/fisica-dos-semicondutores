import React, { useState, useEffect, useRef } from 'react';
import FormulaGraphPanel from '../FormulaGraphPanel';
import { useTranslation } from '../../contexts/LanguageContext';

/**
 * Gráfico do Princípio da Incerteza de Heisenberg
 * Visualiza Δx Δp ≥ ℏ/2
 * Mostra a relação de compromisso entre precisão de posição e momento
 */
const HeisenbergUncertaintyGraph = ({ formula, onClose }) => {
  const { t } = useTranslation();
  const canvasRef = useRef(null);
  const [positionUncertainty, setPositionUncertainty] = useState(1); // Å
  const [momentumUncertainty, setMomentumUncertainty] = useState(5.27); // ×10^-25 kg·m/s
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationProgress, setAnimationProgress] = useState(0);
  const [showWavePacket, setShowWavePacket] = useState(true);

  // Constante de Planck reduzida em unidades apropriadas
  const hbar = 1.054e-34; // J·s
  const hbar_eV = 6.582e-16; // eV·s

  useEffect(() => {
    // Calcular incerteza no momento a partir da posição usando Δp ≥ ℏ/2Δx
    // Convertendo Å para metros
    const deltaX = positionUncertainty * 1e-10;
    const deltaP_min = hbar / (2 * deltaX);
    // Converter para kg·m/s e escalar para visualização
    setMomentumUncertainty(deltaP_min * 1e25);
  }, [positionUncertainty]);

  useEffect(() => {
    drawGraph();
  }, [positionUncertainty, momentumUncertainty, animationProgress, showWavePacket]);

  useEffect(() => {
    if (isAnimating) {
      const interval = setInterval(() => {
        setAnimationProgress(prev => {
          if (prev >= 1) {
            setIsAnimating(false);
            return 1;
          }
          return prev + 0.02;
        });
      }, 20);
      return () => clearInterval(interval);
    }
  }, [isAnimating]);

  const drawGraph = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Limpar canvas
    ctx.clearRect(0, 0, width, height);

    // Desenhar eixos
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(60, height - 50);
    ctx.lineTo(width - 30, height - 50); // Eixo X (Δx)
    ctx.moveTo(60, height - 50);
    ctx.lineTo(60, 30); // Eixo Y (Δp)
    ctx.stroke();

    // Labels dos eixos
    ctx.fillStyle = '#333';
    ctx.font = '14px Arial';
    ctx.fillText('Δx (Å)', width / 2 - 30, height - 15);
    ctx.save();
    ctx.translate(20, height / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('Δp (×10⁻²⁵ kg·m/s)', 0, 0);
    ctx.restore();

    // Desenhar curva de incerteza mínima Δp = ℏ/(2Δx)
    ctx.strokeStyle = '#2563eb';
    ctx.lineWidth = 3;
    ctx.beginPath();
    
    const minX = 0.1;
    const maxX = 5;
    const maxP = hbar / (2 * minX * 1e-10) * 1e25;
    const minP = hbar / (2 * maxX * 1e-10) * 1e25;

    for (let i = 0; i <= 100 * animationProgress; i++) {
      const x = minX + (maxX - minX) * (i / 100);
      const deltaX = x * 1e-10;
      const deltaP = hbar / (2 * deltaX) * 1e25;
      
      const plotX = 60 + (x - minX) / (maxX - minX) * (width - 90);
      const plotY = height - 50 - (deltaP - minP) / (maxP - minP) * (height - 80);
      
      if (i === 0) {
        ctx.moveTo(plotX, plotY);
      } else {
        ctx.lineTo(plotX, plotY);
      }
    }
    ctx.stroke();

    // Área permitida (acima da curva)
    ctx.fillStyle = 'rgba(37, 99, 235, 0.1)';
    ctx.beginPath();
    ctx.moveTo(60, 30);
    for (let i = 0; i <= 100; i++) {
      const x = minX + (maxX - minX) * (i / 100);
      const deltaX = x * 1e-10;
      const deltaP = hbar / (2 * deltaX) * 1e25;
      
      const plotX = 60 + (x - minX) / (maxX - minX) * (width - 90);
      const plotY = height - 50 - (deltaP - minP) / (maxP - minP) * (height - 80);
      
      if (i === 0) {
        ctx.lineTo(plotX, plotY);
      } else {
        ctx.lineTo(plotX, plotY);
      }
    }
    ctx.lineTo(width - 30, 30);
    ctx.closePath();
    ctx.fill();

    // Desenhar ponto atual
    const currentX = 60 + (positionUncertainty - minX) / (maxX - minX) * (width - 90);
    const currentY = height - 50 - (momentumUncertainty - minP) / (maxP - minP) * (height - 80);
    
    ctx.fillStyle = '#dc2626';
    ctx.beginPath();
    ctx.arc(currentX, currentY, 8, 0, 2 * Math.PI);
    ctx.fill();

    // Desenhar linha tracejada para o ponto atual
    ctx.strokeStyle = '#dc2626';
    ctx.setLineDash([5, 5]);
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(currentX, height - 50);
    ctx.lineTo(currentX, currentY);
    ctx.lineTo(60, currentY);
    ctx.stroke();
    ctx.setLineDash([]);

    // Labels dos valores atuais
    ctx.fillStyle = '#dc2626';
    ctx.font = '12px Arial';
    ctx.fillText(`Δx = ${positionUncertainty.toFixed(2)} Å`, currentX + 10, currentY - 10);
    ctx.fillText(`Δp = ${momentumUncertainty.toFixed(2)} ×10⁻²⁵`, 70, currentY - 5);

    // Desenhar pacote de onda se habilitado
    if (showWavePacket) {
      drawWavePacket(ctx, width, height);
    }
  };

  const drawWavePacket = (ctx, width, height) => {
    const packetY = 100;
    const packetWidth = 300;
    const packetX = width / 2 - packetWidth / 2;
    
    ctx.strokeStyle = '#059669';
    ctx.lineWidth = 2;
    ctx.beginPath();
    
    const sigma = positionUncertainty * 20;
    const amplitude = 30;
    
    for (let i = 0; i <= packetWidth; i++) {
      const x = i - packetWidth / 2;
      const gaussian = Math.exp(-(x * x) / (2 * sigma * sigma));
      const wave = Math.cos(0.1 * x) * gaussian;
      const y = packetY + wave * amplitude;
      
      if (i === 0) {
        ctx.moveTo(packetX + i, y);
      } else {
        ctx.lineTo(packetX + i, y);
      }
    }
    ctx.stroke();

    // Label do pacote de onda
    ctx.fillStyle = '#059669';
    ctx.font = '12px Arial';
    ctx.fillText('Função de onda ψ(x)', width / 2 - 50, packetY - 40);
    ctx.fillText(`Largura ∝ Δx = ${positionUncertainty.toFixed(2)} Å`, width / 2 - 80, packetY + amplitude + 20);
  };

  const handlePositionChange = (e) => {
    setPositionUncertainty(parseFloat(e.target.value));
  };

  const handleAnimation = () => {
    setAnimationProgress(0);
    setIsAnimating(true);
  };

  return (
    <FormulaGraphPanel 
      graphId="HeisenbergUncertaintyGraph" 
      formula={formula} 
      onClose={onClose}
    >
      <div className="heisenberg-uncertainty-graph">
        <div className="graph-canvas-container">
          <canvas 
            ref={canvasRef} 
            width={600} 
            height={400}
            className="graph-canvas"
          />
        </div>

        <div className="graph-controls">
          <div className="control-group">
            <label>
              Incerteza de Posição Δx (Å):
              <input 
                type="range" 
                min="0.1" 
                max="5" 
                step="0.1"
                value={positionUncertainty}
                onChange={handlePositionChange}
              />
              <span className="value-display">{positionUncertainty.toFixed(2)} Å</span>
            </label>
          </div>

          <div className="control-group">
            <label>
              Incerteza de Momento Δp: {momentumUncertainty.toFixed(2)} ×10⁻²⁵ kg·m/s
            </label>
          </div>

          <div className="control-group">
            <label>
              <input 
                type="checkbox"
                checked={showWavePacket}
                onChange={(e) => setShowWavePacket(e.target.checked)}
              />
              Mostrar Pacote de Onda
            </label>
          </div>

          <button 
            className="animate-button"
            onClick={handleAnimation}
          >
            {isAnimating ? 'Animando...' : 'Reproduzir Animação'}
          </button>
        </div>

        <div className="graph-explanation">
          <h4>Explicação</h4>
          <p>
            Este gráfico ilustra o Princípio da Incerteza de Heisenberg: Δx Δp ≥ ℏ/2.
            Não é possível conhecer simultaneamente a posição e o momento de uma partícula
            com precisão arbitrária.
          </p>
          <p>
            A curva azul representa o limite mínimo de incerteza. Qualquer ponto
            abaixo desta curva violaria o princípio da incerteza e é fisicamente impossível.
            A área azul acima da curva representa as combinações permitidas.
          </p>
          <p>
            Quando a posição é conhecida com maior precisão (Δx menor), o momento
            torna-se menos preciso (Δp maior), e vice-versa. Esta é uma consequência
            fundamental da natureza ondulatória das partículas.
          </p>
        </div>
      </div>
    </FormulaGraphPanel>
  );
};

export default HeisenbergUncertaintyGraph;
