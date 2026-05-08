import { useState, useMemo } from 'react';
import EducationalGraph from './EducationalGraph.jsx';
import { TeX } from './Math.jsx';
import { fermiDirac, log_event } from '../physics/formulas.js';

/**
 * Gráfico educacional interativo para a distribuição de Fermi-Dirac
 * Permite explorar como a temperatura e o nível de Fermi afetam a ocupação
 */
export default function FermiDiracEducational() {
  const [EF, setEF] = useState(0);
  const [T, setT] = useState(300);
  const [showMaxwell, setShowMaxwell] = useState(false);

  // Gerar dados para o gráfico
  const graphData = useMemo(() => {
    const points = [];
    const kT = 0.02585 * (T / 300); // kT em eV
    
    for (let E = -0.5; E <= 0.5; E += 0.01) {
      const fd = fermiDirac(E, EF, T);
      points.push({ x: E, y: fd });
    }
    
    return { points, kT };
  }, [EF, T]);

  const handleFormulaClick = () => {
    log_event('DATA', 'Fórmula Fermi-Dirac clicada', { EF, T });
  };

  return (
    <EducationalGraph
      title="📊 Distribuição de Fermi-Dirac"
      formula={
        <div>
          <TeX math="f(E) = \dfrac{1}{1 + \exp\!\left(\dfrac{E - E_F}{k_B T}\right)}" block />
          <p className="formula-note">
            Probabilidade de ocupação de um estado de energia E
          </p>
        </div>
      }
      description="Explore como a temperatura e o nível de Fermi afetam a probabilidade de ocupação dos estados quânticos. Observe a transição suave em E = EF (50% de ocupação)."
      onFormulaClick={handleFormulaClick}
    >
      <div className="fermi-educational-container">
        {/* Controles interativos */}
        <div className="fermi-controls">
          <div className="control-group">
            <label>Nível de Fermi (E_F):</label>
            <input
              type="range"
              min="-0.3"
              max="0.3"
              step="0.01"
              value={EF}
              onChange={(e) => setEF(parseFloat(e.target.value))}
            />
            <span className="control-value">{EF.toFixed(3)} eV</span>
          </div>
          
          <div className="control-group">
            <label>Temperatura (T):</label>
            <input
              type="range"
              min="50"
              max="600"
              step="10"
              value={T}
              onChange={(e) => setT(parseFloat(e.target.value))}
            />
            <span className="control-value">{T} K</span>
          </div>

          <div className="control-group">
            <label>
              <input
                type="checkbox"
                checked={showMaxwell}
                onChange={(e) => setShowMaxwell(e.target.checked)}
              />
              Mostrar aproximação Maxwell-Boltzmann
            </label>
          </div>
        </div>

        {/* Gráfico SVG */}
        <div className="fermi-graph">
          <svg viewBox="0 0 600 400" className="fermi-svg">
            {/* Eixos */}
            <line x1="50" y1="350" x2="550" y2="350" stroke="#94a3b8" strokeWidth="2" />
            <line x1="50" y1="50" x2="50" y2="350" stroke="#94a3b8" strokeWidth="2" />
            
            {/* Labels dos eixos */}
            <text x="300" y="390" fill="#e2e8f0" textAnchor="middle">Energia E (eV)</text>
            <text x="20" y="200" fill="#e2e8f0" textAnchor="middle" transform="rotate(-90 20 200)">Probabilidade f(E)</text>
            
            {/* Linha de referência EF */}
            <line 
              x1={50 + (EF + 0.5) * 500} 
              y1="50" 
              x2={50 + (EF + 0.5) * 500} 
              y2="350" 
              stroke="#facc15" 
              strokeWidth="2" 
              strokeDasharray="5,5"
            />
            <text 
              x={50 + (EF + 0.5) * 500 + 5} 
              y="70" 
              fill="#facc15" 
              fontSize="12"
            >E_F</text>

            {/* Curva Fermi-Dirac */}
            <path
              d={graphData.points.map((p, i) => 
                `${i === 0 ? 'M' : 'L'} ${50 + (p.x + 0.5) * 500} ${350 - p.y * 300}`
              ).join(' ')}
              fill="none"
              stroke="#22d3ee"
              strokeWidth="3"
            />

            {/* Aproximação Maxwell-Boltzmann (se ativada) */}
            {showMaxwell && (
              <path
                d={graphData.points.filter(p => p.x > EF + 0.05).map((p, i) => {
                  const mb = Math.exp(-(p.x - EF) / (0.02585 * T / 300));
                  return `${i === 0 ? 'M' : 'L'} ${50 + (p.x + 0.5) * 500} ${350 - mb * 300}`;
                }).join(' ')}
                fill="none"
                stroke="#f97316"
                strokeWidth="2"
                strokeDasharray="5,5"
              />
            )}
          </svg>
        </div>

        {/* Informações educacionais */}
        <div className="fermi-info">
          <div className="info-card">
            <h4>📌 kT = {graphData.kT.toFixed(4)} eV</h4>
            <p>Energia térmica. Determina a largura da transição.</p>
          </div>
          
          <div className="info-card">
            <h4>📌 Em E = E_F</h4>
            <p>f(E) = 0.5 (50% de probabilidade de ocupação)</p>
          </div>

          <div className="info-card">
            <h4>📌 Baixa temperatura</h4>
            <p>Transição mais abrupta (degrau)</p>
          </div>

          <div className="info-card">
            <h4>📌 Alta temperatura</h4>
            <p>Transição mais suave</p>
          </div>

          {showMaxwell && (
            <div className="info-card highlight">
              <h4>📊 Aproximação Maxwell-Boltzmann</h4>
              <p>Válida quando E - E_F ≫ kT (estados raramente ocupados)</p>
            </div>
          )}
        </div>
      </div>
    </EducationalGraph>
  );
}
