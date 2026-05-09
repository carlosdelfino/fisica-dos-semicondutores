import React, { useState, useEffect, useRef } from 'react';
import FormulaGraphPanel from '../FormulaGraphPanel';
import { useTranslation } from '../../contexts/LanguageContext';

/**
 * Gráfico de Densidade de Estados
 * Visualiza g(E) = (4π(2m)^(3/2))/ℏ³ √E
 * Mostra como a densidade de estados varia com a energia
 */
const DensityOfStatesGraph = ({ formula, onClose }) => {
  const { t } = useTranslation();
  const canvasRef = useRef(null);
  const [energy, setEnergy] = useState(1); // eV
  const [densityOfStates, setDensityOfStates] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationProgress, setAnimationProgress] = useState(0);
  const [show3D, setShow3D] = useState(false);

  // Constantes
  const hbar = 1.054e-34; // J·s
  const m_e = 9.109e-31; // kg (massa do elétron)
  const eV = 1.602e-19; // J

  useEffect(() => {
    // Calcular densidade de estados
    const energyJ = energy * eV;
    const dos = (4 * Math.PI * Math.pow(2 * m_e, 1.5)) / Math.pow(hbar, 3) * Math.sqrt(energyJ);
    // Escalar para visualização
    setDensityOfStates(dos * 1e-22);
  }, [energy]);

  useEffect(() => {
    drawGraph();
  }, [energy, densityOfStates, animationProgress, show3D]);

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
    ctx.lineTo(width - 30, height - 50); // Eixo X (Energia)
    ctx.moveTo(60, height - 50);
    ctx.lineTo(60, 30); // Eixo Y (DOS)
    ctx.stroke();

    // Labels dos eixos
    ctx.fillStyle = '#333';
    ctx.font = '14px Arial';
    ctx.fillText('Energia (eV)', width / 2 - 40, height - 15);
    ctx.save();
    ctx.translate(20, height / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('Densidade de Estados (×10²²)', 0, 0);
    ctx.restore();

    if (show3D) {
      draw3DVisualization(ctx, width, height);
    } else {
      draw2DCurve(ctx, width, height);
    }

    // Desenhar ponto atual
    const minE = 0;
    const maxE = 3;
    const maxDOS = calculateDOS(maxE);
    
    const currentX = 60 + (energy - minE) / (maxE - minE) * (width - 90);
    const currentY = height - 50 - (densityOfStates) / maxDOS * (height - 80);
    
    ctx.fillStyle = '#dc2626';
    ctx.beginPath();
    ctx.arc(currentX, currentY, 8, 0, 2 * Math.PI);
    ctx.fill();

    // Desenhar linha tracejada
    ctx.strokeStyle = '#dc2626';
    ctx.setLineDash([5, 5]);
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(currentX, height - 50);
    ctx.lineTo(currentX, currentY);
    ctx.lineTo(60, currentY);
    ctx.stroke();
    ctx.setLineDash([]);

    // Labels
    ctx.fillStyle = '#dc2626';
    ctx.font = '12px Arial';
    ctx.fillText(`E = ${energy.toFixed(2)} eV`, currentX + 10, currentY - 10);
    ctx.fillText(`g(E) = ${densityOfStates.toFixed(2)} ×10²²`, 70, currentY - 5);
  };

  const calculateDOS = (e) => {
    const energyJ = e * eV;
    const dos = (4 * Math.PI * Math.pow(2 * m_e, 1.5)) / Math.pow(hbar, 3) * Math.sqrt(energyJ);
    return dos * 1e-22;
  };

  const draw2DCurve = (ctx, width, height) => {
    // Desenhar curva g(E) ∝ √E
    ctx.strokeStyle = '#2563eb';
    ctx.lineWidth = 3;
    ctx.beginPath();
    
    const minE = 0;
    const maxE = 3;
    const maxDOS = calculateDOS(maxE);

    for (let i = 0; i <= 100 * animationProgress; i++) {
      const e = minE + (maxE - minE) * (i / 100);
      const dos = calculateDOS(e);
      
      const x = 60 + (e - minE) / (maxE - minE) * (width - 90);
      const y = height - 50 - dos / maxDOS * (height - 80);
      
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.stroke();

    // Preencher área sob a curva
    ctx.fillStyle = 'rgba(37, 99, 235, 0.1)';
    ctx.beginPath();
    ctx.moveTo(60, height - 50);
    for (let i = 0; i <= 100; i++) {
      const e = minE + (maxE - minE) * (i / 100);
      const dos = calculateDOS(e);
      
      const x = 60 + (e - minE) / (maxE - minE) * (width - 90);
      const y = height - 50 - dos / maxDOS * (height - 80);
      
      ctx.lineTo(x, y);
    }
    ctx.lineTo(width - 30, height - 50);
    ctx.closePath();
    ctx.fill();
  };

  const draw3DVisualization = (ctx, width, height) => {
    // Desenhar representação 3D simplificada do espaço-k
    const centerX = width / 2 + 50;
    const centerY = height / 2;
    const radius = 80 + energy * 20;

    // Esfera de Fermi
    ctx.strokeStyle = '#2563eb';
    ctx.lineWidth = 2;
    
    // Círculo principal
    ctx.beginPath();
    ctx.ellipse(centerX, centerY, radius, radius * 0.6, 0, 0, 2 * Math.PI);
    ctx.stroke();

    // Círculo vertical (efeito 3D)
    ctx.beginPath();
    ctx.ellipse(centerX, centerY, radius * 0.3, radius * 0.6, 0, 0, 2 * Math.PI);
    ctx.stroke();

    // Círculo horizontal (efeito 3D)
    ctx.beginPath();
    ctx.ellipse(centerX, centerY, radius, radius * 0.2, 0, 0, 2 * Math.PI);
    ctx.stroke();

    // Pontos representando estados k
    const numPoints = Math.floor(energy * 50);
    ctx.fillStyle = '#059669';
    for (let i = 0; i < numPoints; i++) {
      const angle = (i / numPoints) * 2 * Math.PI;
      const r = Math.random() * radius;
      const x = centerX + r * Math.cos(angle);
      const y = centerY + r * 0.6 * Math.sin(angle);
      
      ctx.beginPath();
      ctx.arc(x, y, 2, 0, 2 * Math.PI);
      ctx.fill();
    }

    // Label
    ctx.fillStyle = '#333';
    ctx.font = '12px Arial';
    ctx.fillText('Espaço-k (esfera de Fermi)', centerX - 60, centerY + radius + 30);
    ctx.fillText(`Raio ∝ √E = ${Math.sqrt(energy).toFixed(2)}`, centerX - 50, centerY + radius + 50);
  };

  const handleEnergyChange = (e) => {
    setEnergy(parseFloat(e.target.value));
  };

  const handleAnimation = () => {
    setAnimationProgress(0);
    setIsAnimating(true);
  };

  return (
    <FormulaGraphPanel 
      graphId="DensityOfStatesGraph" 
      formula={formula} 
      onClose={onClose}
    >
      <div className="density-of-states-graph">
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
              Energia (eV):
              <input 
                type="range" 
                min="0.1" 
                max="3" 
                step="0.1"
                value={energy}
                onChange={handleEnergyChange}
              />
              <span className="value-display">{energy.toFixed(2)} eV</span>
            </label>
          </div>

          <div className="control-group">
            <label>
              Densidade de Estados: {densityOfStates.toFixed(2)} ×10²²
            </label>
          </div>

          <div className="control-group">
            <label>
              <input 
                type="checkbox"
                checked={show3D}
                onChange={(e) => setShow3D(e.target.checked)}
              />
              Visualização 3D (Espaço-k)
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
            A densidade de estados g(E) indica quantos estados quânticos estão disponíveis
            para partículas em uma determinada energia. Em 3D, g(E) ∝ √E, o que significa
            que a densidade de estados aumenta com a raiz quadrada da energia.
          </p>
          <p>
            No espaço-k, os estados disponíveis formam uma esfera (esfera de Fermi).
            O raio desta esfera é proporcional a √E, e o número de estados dentro da esfera
            cresce com o volume, que é proporcional a E^(3/2).
          </p>
          <p>
            Esta relação é fundamental para entender como os elétrons se distribuem
            nos semicondutores e como as propriedades eletrônicas dependem da energia.
          </p>
        </div>
      </div>
    </FormulaGraphPanel>
  );
};

export default DensityOfStatesGraph;
