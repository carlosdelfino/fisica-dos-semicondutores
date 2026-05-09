import React, { useState, useEffect, useRef } from 'react';
import FormulaGraphPanel from '../FormulaGraphPanel';
import { useTranslation } from '../../contexts/LanguageContext';

/**
 * Gráfico de Energia do Fóton
 * Visualiza a relação E = hν = hc/λ
 * Mostra como a energia do fóton varia com a frequência e comprimento de onda
 */
const PhotonEnergyGraph = ({ formula, onClose }) => {
  const { t } = useTranslation();
  const canvasRef = useRef(null);
  const [frequency, setFrequency] = useState(5e14); // Hz
  const [wavelength, setWavelength] = useState(600); // nm
  const [energy, setEnergy] = useState(2.07); // eV
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationProgress, setAnimationProgress] = useState(0);

  // Constantes físicas
  const h = 6.626e-34; // Constante de Planck (J·s)
  const c = 3e8; // Velocidade da luz (m/s)
  const eV = 1.602e-19; // Conversão J para eV

  useEffect(() => {
    // Calcular energia a partir da frequência
    const energyJ = h * frequency;
    const energyEV = energyJ / eV;
    setEnergy(energyEV);
  }, [frequency]);

  useEffect(() => {
    // Calcular comprimento de onda a partir da frequência
    const wavelengthM = c / frequency;
    const wavelengthNM = wavelengthM * 1e9;
    setWavelength(wavelengthNM);
  }, [frequency]);

  useEffect(() => {
    drawGraph();
  }, [frequency, wavelength, energy, animationProgress]);

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
    ctx.lineTo(width - 30, height - 50); // Eixo X
    ctx.moveTo(60, height - 50);
    ctx.lineTo(60, 30); // Eixo Y
    ctx.stroke();

    // Labels dos eixos
    ctx.fillStyle = '#333';
    ctx.font = '14px Arial';
    ctx.fillText('Frequência (Hz)', width / 2 - 50, height - 15);
    ctx.save();
    ctx.translate(20, height / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('Energia (eV)', 0, 0);
    ctx.restore();

    // Desenhar curva E = hν
    ctx.strokeStyle = '#2563eb';
    ctx.lineWidth = 3;
    ctx.beginPath();
    
    const minFreq = 1e14;
    const maxFreq = 1e15;
    const minEnergy = (h * minFreq) / eV;
    const maxEnergy = (h * maxFreq) / eV;

    for (let i = 0; i <= 100 * animationProgress; i++) {
      const freq = minFreq + (maxFreq - minFreq) * (i / 100);
      const energyVal = (h * freq) / eV;
      
      const x = 60 + (freq - minFreq) / (maxFreq - minFreq) * (width - 90);
      const y = height - 50 - (energyVal - minEnergy) / (maxEnergy - minEnergy) * (height - 80);
      
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.stroke();

    // Desenhar ponto atual
    const currentX = 60 + (frequency - minFreq) / (maxFreq - minFreq) * (width - 90);
    const currentY = height - 50 - (energy - minEnergy) / (maxEnergy - minEnergy) * (height - 80);
    
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
    ctx.fillText(`ν = ${frequency.toExponential(2)} Hz`, currentX + 10, currentY - 10);
    ctx.fillText(`E = ${energy.toFixed(2)} eV`, 70, currentY - 5);
    ctx.fillText(`λ = ${wavelength.toFixed(1)} nm`, currentX + 10, height - 60);

    // Desenhar espectro visível
    drawSpectrum(ctx, width, height);
  };

  const drawSpectrum = (ctx, width, height) => {
    const spectrumY = height - 30;
    const spectrumHeight = 15;
    const spectrumWidth = width - 90;
    const startX = 60;

    // Gradiente do espectro visível
    const gradient = ctx.createLinearGradient(startX, spectrumY, startX + spectrumWidth, spectrumY);
    gradient.addColorStop(0, '#8b00ff'); // Violeta
    gradient.addColorStop(0.2, '#0000ff'); // Azul
    gradient.addColorStop(0.4, '#00ff00'); // Verde
    gradient.addColorStop(0.6, '#ffff00'); // Amarelo
    gradient.addColorStop(0.8, '#ff7f00'); // Laranja
    gradient.addColorStop(1, '#ff0000'); // Vermelho

    ctx.fillStyle = gradient;
    ctx.fillRect(startX, spectrumY, spectrumWidth, spectrumHeight);

    // Marcador de posição atual no espectro
    const minFreq = 1e14;
    const maxFreq = 1e15;
    const markerX = startX + (frequency - minFreq) / (maxFreq - minFreq) * spectrumWidth;
    
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.moveTo(markerX, spectrumY - 5);
    ctx.lineTo(markerX - 5, spectrumY - 15);
    ctx.lineTo(markerX + 5, spectrumY - 15);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#333';
    ctx.font = '10px Arial';
    ctx.fillText('Espectro Visível', startX, spectrumY - 20);
  };

  const handleFrequencyChange = (e) => {
    setFrequency(parseFloat(e.target.value));
  };

  const handleAnimation = () => {
    setAnimationProgress(0);
    setIsAnimating(true);
  };

  return (
    <FormulaGraphPanel 
      graphId="PhotonEnergyGraph" 
      formula={formula} 
      onClose={onClose}
    >
      <div className="photon-energy-graph">
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
              Frequência (Hz):
              <input 
                type="range" 
                min="1e14" 
                max="1e15" 
                step="1e13"
                value={frequency}
                onChange={handleFrequencyChange}
              />
              <span className="value-display">{frequency.toExponential(2)} Hz</span>
            </label>
          </div>

          <div className="control-group">
            <label>
              Comprimento de Onda: {wavelength.toFixed(1)} nm
            </label>
          </div>

          <div className="control-group">
            <label>
              Energia: {energy.toFixed(2)} eV
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
            Este gráfico mostra a relação entre a energia de um fóton e sua frequência,
            conforme a equação E = hν, onde h é a constante de Planck.
            Quanto maior a frequência, maior a energia do fóton.
          </p>
          <p>
            O comprimento de onda λ está relacionado à frequência por λ = c/ν,
            onde c é a velocidade da luz. Por isso, frequências maiores correspondem
            a comprimentos de onda menores (luz azul/violeta) e energias maiores.
          </p>
        </div>
      </div>
    </FormulaGraphPanel>
  );
};

export default PhotonEnergyGraph;
