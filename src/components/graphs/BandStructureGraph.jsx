import React, { useState, useEffect, useRef } from 'react';
import FormulaGraphPanel from '../FormulaGraphPanel';
import { useTranslation } from '../../contexts/LanguageContext';

/**
 * Gráfico de Estrutura de Bandas
 * Visualiza bandas de energia, bandgap e níveis de Fermi
 * Mostra diferença entre semicondutores diretos e indiretos
 */
const BandStructureGraph = ({ formula, onClose }) => {
  const { t } = useTranslation();
  const canvasRef = useRef(null);
  const [material, setMaterial] = useState('Si'); // Si, GaAs, Ge
  const [temperature, setTemperature] = useState(300); // K
  const [doping, setDoping] = useState('intrinsic'); // intrinsic, n-type, p-type
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationProgress, setAnimationProgress] = useState(0);

  // Propriedades dos materiais (bandgap em eV)
  const materialProperties = {
    Si: { bandgap: 1.12, type: 'indirect', name: 'Silício', effectiveMass: { electron: 0.26, hole: 0.39 } },
    GaAs: { bandgap: 1.42, type: 'direct', name: 'Arseneto de Gálio', effectiveMass: { electron: 0.067, hole: 0.45 } },
    Ge: { bandgap: 0.66, type: 'indirect', name: 'Germânio', effectiveMass: { electron: 0.12, hole: 0.28 } }
  };

  // Variação do bandgap com temperatura (fórmula de Varshni)
  const calculateBandgap = (material, temp) => {
    const props = materialProperties[material];
    const Eg0 = props.bandgap;
    const alpha = material === 'Si' ? 4.73e-4 : material === 'GaAs' ? 5.41e-4 : 4.77e-4;
    const beta = material === 'Si' ? 636 : material === 'GaAs' ? 204 : 235;
    
    return Eg0 - (alpha * temp * temp) / (temp + beta);
  };

  useEffect(() => {
    drawGraph();
  }, [material, temperature, doping, animationProgress]);

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

    const currentBandgap = calculateBandgap(material, temperature);
    const props = materialProperties[material];

    // Desenhar eixos (Espaço-k)
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(60, height - 50);
    ctx.lineTo(width - 30, height - 50); // Eixo X (k)
    ctx.moveTo(60, height - 50);
    ctx.lineTo(60, 30); // Eixo Y (Energia)
    ctx.stroke();

    // Labels dos eixos
    ctx.fillStyle = '#333';
    ctx.font = '14px Arial';
    ctx.fillText('Vetor de onda k', width / 2 - 50, height - 15);
    ctx.save();
    ctx.translate(20, height / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('Energia (eV)', 0, 0);
    ctx.restore();

    // Desenhar bandas de valência e condução
    drawEnergyBands(ctx, width, height, currentBandgap, props.type);

    // Desenhar nível de Fermi
    drawFermiLevel(ctx, width, height, currentBandgap, doping);

    // Desenhar informações do material
    drawMaterialInfo(ctx, width, height, currentBandgap, props);

    // Animação de transição de elétron
    if (animationProgress > 0) {
      drawElectronTransition(ctx, width, height, currentBandgap, props.type);
    }
  };

  const drawEnergyBands = (ctx, width, height, bandgap, type) => {
    const centerX = width / 2;
    const centerY = height / 2;
    const bandHeight = 100;

    // Banda de valência (inferior)
    ctx.fillStyle = 'rgba(37, 99, 235, 0.2)';
    ctx.strokeStyle = '#2563eb';
    ctx.lineWidth = 3;

    ctx.beginPath();
    ctx.moveTo(60, centerY + 50);
    // Curva parabólica para banda de valência
    for (let i = 0; i <= 100; i++) {
      const x = 60 + (i / 100) * (width - 90);
      const normalizedX = (i - 50) / 50;
      const y = centerY + 50 + 20 * normalizedX * normalizedX;
      ctx.lineTo(x, y);
    }
    ctx.lineTo(width - 30, centerY + 50);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Banda de condução (superior)
    ctx.fillStyle = 'rgba(220, 38, 38, 0.2)';
    ctx.strokeStyle = '#dc2626';

    ctx.beginPath();
    ctx.moveTo(60, centerY - bandGapToPixels(bandgap));
    
    if (type === 'direct') {
      // Gap direto: mínimo e máximo no mesmo k
      for (let i = 0; i <= 100; i++) {
        const x = 60 + (i / 100) * (width - 90);
        const normalizedX = (i - 50) / 50;
        const y = centerY - bandGapToPixels(bandgap) - 20 * normalizedX * normalizedX;
        ctx.lineTo(x, y);
      }
    } else {
      // Gap indireto: mínimo deslocado em k
      for (let i = 0; i <= 100; i++) {
        const x = 60 + (i / 100) * (width - 90);
        const normalizedX = (i - 50) / 50;
        // Mínimo deslocado para k ≠ 0
        const shift = i < 50 ? 0 : 30;
        const y = centerY - bandGapToPixels(bandgap) - shift - 20 * normalizedX * normalizedX;
        ctx.lineTo(x, y);
      }
    }
    
    ctx.lineTo(width - 30, centerY - bandGapToPixels(bandgap));
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Labels das bandas
    ctx.fillStyle = '#2563eb';
    ctx.font = '14px Arial';
    ctx.fillText('Banda de Valência (VB)', 70, centerY + 80);

    ctx.fillStyle = '#dc2626';
    ctx.fillText('Banda de Condução (CB)', 70, centerY - bandGapToPixels(bandgap) - 30);

    // Label do bandgap
    ctx.fillStyle = '#333';
    ctx.font = '12px Arial';
    ctx.fillText(`Eg = ${bandgap.toFixed(3)} eV`, centerX - 30, centerY - bandGapToPixels(bandgap) / 2);
  };

  const bandGapToPixels = (bandgap) => {
    return bandgap * 60; // Escala: 1 eV = 60 pixels
  };

  const drawFermiLevel = (ctx, width, height, bandgap, dopingType) => {
    const centerY = height / 2;
    const bandgapPixels = bandGapToPixels(bandgap);
    
    let fermiY;
    if (dopingType === 'intrinsic') {
      fermiY = centerY - bandgapPixels / 2;
    } else if (dopingType === 'n-type') {
      fermiY = centerY - bandgapPixels * 0.3;
    } else { // p-type
      fermiY = centerY - bandgapPixels * 0.7;
    }

    // Linha do nível de Fermi
    ctx.strokeStyle = '#059669';
    ctx.lineWidth = 2;
    ctx.setLineDash([10, 5]);
    ctx.beginPath();
    ctx.moveTo(60, fermiY);
    ctx.lineTo(width - 30, fermiY);
    ctx.stroke();
    ctx.setLineDash([]);

    // Label
    ctx.fillStyle = '#059669';
    ctx.font = '12px Arial';
    ctx.fillText('Nível de Fermi (Ef)', width - 150, fermiY - 10);
  };

  const drawMaterialInfo = (ctx, width, height, bandgap, props) => {
    ctx.fillStyle = '#333';
    ctx.font = '12px Arial';
    
    const infoX = 60;
    const infoY = 30;
    const lineHeight = 18;

    ctx.fillText(`Material: ${props.name}`, infoX, infoY);
    ctx.fillText(`Tipo: ${props.type === 'direct' ? 'Direto' : 'Indireto'}`, infoX, infoY + lineHeight);
    ctx.fillText(`Bandgap: ${bandgap.toFixed(3)} eV`, infoX, infoY + 2 * lineHeight);
    ctx.fillText(`Temperatura: ${temperature} K`, infoX, infoY + 3 * lineHeight);
    ctx.fillText(`Dopagem: ${dopingType === 'intrinsic' ? 'Intrínseco' : dopingType === 'n-type' ? 'Tipo-n' : 'Tipo-p'}`, infoX, infoY + 4 * lineHeight);
  };

  const drawElectronTransition = (ctx, width, height, bandgap, type) => {
    const centerX = width / 2;
    const centerY = height / 2;
    
    // Posição inicial (banda de valência)
    const startX = centerX;
    const startY = centerY + 50;
    
    // Posição final (banda de condução)
    const endX = type === 'direct' ? centerX : centerX + 50;
    const endY = centerY - bandGapToPixels(bandgap);
    
    // Posição atual baseada no progresso da animação
    const currentX = startX + (endX - startX) * animationProgress;
    const currentY = startY + (endY - startY) * animationProgress;
    
    // Desenhar elétron
    ctx.fillStyle = '#f59e0b';
    ctx.beginPath();
    ctx.arc(currentX, currentY, 8, 0, 2 * Math.PI);
    ctx.fill();

    // Desenhar fóton (seta)
    if (type === 'direct') {
      ctx.strokeStyle = '#8b5cf6';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(endX, endY);
      ctx.stroke();
      
      // Cabeça da seta
      ctx.beginPath();
      ctx.moveTo(endX - 10, endY + 10);
      ctx.lineTo(endX, endY);
      ctx.lineTo(endX - 10, endY - 10);
      ctx.stroke();
      
      ctx.fillStyle = '#8b5cf6';
      ctx.font = '12px Arial';
      ctx.fillText('fóton (hν)', endX + 10, endY);
    } else {
      // Para gap indireto, desenhar fóton e fônon
      ctx.strokeStyle = '#8b5cf6';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(startX, endY);
      ctx.stroke();
      
      ctx.beginPath();
      ctx.moveTo(startX, endY);
      ctx.lineTo(endX, endY);
      ctx.stroke();
      
      ctx.fillStyle = '#8b5cf6';
      ctx.font = '12px Arial';
      ctx.fillText('fóton', startX + 10, startY - 20);
      
      ctx.fillStyle = '#ec4899';
      ctx.fillText('fônon', endX + 10, endY + 20);
    }
  };

  const handleMaterialChange = (e) => {
    setMaterial(e.target.value);
  };

  const handleTemperatureChange = (e) => {
    setTemperature(parseFloat(e.target.value));
  };

  const handleDopingChange = (e) => {
    setDoping(e.target.value);
  };

  const handleAnimation = () => {
    setAnimationProgress(0);
    setIsAnimating(true);
  };

  return (
    <FormulaGraphPanel 
      graphId="BandStructureGraph" 
      formula={formula} 
      onClose={onClose}
    >
      <div className="band-structure-graph">
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
              Material:
              <select value={material} onChange={handleMaterialChange}>
                <option value="Si">Silício (Si)</option>
                <option value="GaAs">Arseneto de Gálio (GaAs)</option>
                <option value="Ge">Germânio (Ge)</option>
              </select>
            </label>
          </div>

          <div className="control-group">
            <label>
              Temperatura (K):
              <input 
                type="range" 
                min="0" 
                max="600" 
                step="10"
                value={temperature}
                onChange={handleTemperatureChange}
              />
              <span className="value-display">{temperature} K</span>
            </label>
          </div>

          <div className="control-group">
            <label>
              Dopagem:
              <select value={doping} onChange={handleDopingChange}>
                <option value="intrinsic">Intrínseco</option>
                <option value="n-type">Tipo-n</option>
                <option value="p-type">Tipo-p</option>
              </select>
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
            Este diagrama mostra a estrutura de bandas de energia de semicondutores.
            A banda de valência (azul) contém os estados ocupados por elétrons em baixas energias,
            enquanto a banda de condução (vermelho) contém estados vazios que podem ser ocupados.
          </p>
          <p>
            O bandgap (Eg) é a diferença de energia entre o topo da banda de valência e a base da banda de condução.
            Semicondutores diretos (como GaAs) têm o mínimo da banda de condução alinhado com o máximo da banda de valência,
            facilitando transições radiativas (emissão de luz). Semicondutores indiretos (como Si) têm o mínimo deslocado,
            requerendo fônons para transições.
          </p>
          <p>
            O nível de Fermi (verde tracejado) indica a energia química dos elétrons.
            Em semicondutores intrínsecos está no meio do gap, mas pode ser deslocado pela dopagem.
          </p>
        </div>
      </div>
    </FormulaGraphPanel>
  );
};

export default BandStructureGraph;
