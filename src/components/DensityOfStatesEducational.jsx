import { useState, useMemo } from 'react';
import EducationalGraph from './EducationalGraph.jsx';
import { TeX } from './Math.jsx';
import { dosConduction, dosValence, log_event } from '../physics/formulas.js';

/**
 * Gráfico educacional interativo para a densidade de estados
 * Permite explorar como a massa efetiva afeta a densidade de estados
 */
export default function DensityOfStatesEducational() {
  const [mn_eff, setMn_eff] = useState(1.0);
  const [mp_eff, setMp_eff] = useState(1.0);
  const [Ec, setEc] = useState(0);
  const [Ev, setEv] = useState(-1.12);

  // Gerar dados para o gráfico
  const graphData = useMemo(() => {
    const points = [];
    const pointsC = [];
    const pointsV = [];
    
    for (let E = -2; E <= 2; E += 0.02) {
      const gC = dosConduction(E, Ec, mn_eff);
      const gV = dosValence(E, Ev, mp_eff);
      
      points.push({ x: E, yC: gC, yV: gV });
      pointsC.push({ x: E, y: gC });
      pointsV.push({ x: E, y: gV });
    }
    
    return { points, pointsC, pointsV };
  }, [mn_eff, mp_eff, Ec, Ev]);

  const handleFormulaClick = () => {
    log_event('DATA', 'Fórmula densidade de estados clicada', { mn_eff, mp_eff });
  };

  return (
    <EducationalGraph
      title="📊 Densidade de Estados (DOS)"
      formula={
        <div>
          <TeX math="g_c(E) = \dfrac{1}{2\pi^2}\!\left(\dfrac{2 m_n^*}{\hbar^2}\right)^{3/2}\!\sqrt{E - E_c}" block />
          <TeX math="g_v(E) = \dfrac{1}{2\pi^2}\!\left(\dfrac{2 m_p^*}{\hbar^2}\right)^{3/2}\!\sqrt{E_v - E}" block />
          <p className="formula-note">
            Número de estados quânticos por unidade de volume e energia
          </p>
        </div>
      }
      description="Explore como a massa efetiva dos elétrons e lacunas afeta a densidade de estados nas bandas de condução e valência. Observe a dependência √E típica de sistemas 3D."
      onFormulaClick={handleFormulaClick}
    >
      <div className="dos-educational-container">
        {/* Controles interativos */}
        <div className="dos-controls">
          <div className="control-group">
            <label>Massa efetiva elétrons (m*_n):</label>
            <input
              type="range"
              min="0.1"
              max="3.0"
              step="0.1"
              value={mn_eff}
              onChange={(e) => setMn_eff(parseFloat(e.target.value))}
            />
            <span className="control-value">{mn_eff.toFixed(1)} m₀</span>
          </div>
          
          <div className="control-group">
            <label>Massa efetiva lacunas (m*_p):</label>
            <input
              type="range"
              min="0.1"
              max="3.0"
              step="0.1"
              value={mp_eff}
              onChange={(e) => setMp_eff(parseFloat(e.target.value))}
            />
            <span className="control-value">{mp_eff.toFixed(1)} m₀</span>
          </div>

          <div className="control-group">
            <label>Energia banda condução (E_c):</label>
            <input
              type="range"
              min="-0.5"
              max="0.5"
              step="0.01"
              value={Ec}
              onChange={(e) => setEc(parseFloat(e.target.value))}
            />
            <span className="control-value">{Ec.toFixed(2)} eV</span>
          </div>

          <div className="control-group">
            <label>Energia banda valência (E_v):</label>
            <input
              type="range"
              min="-2"
              max="0"
              step="0.01"
              value={Ev}
              onChange={(e) => setEv(parseFloat(e.target.value))}
            />
            <span className="control-value">{Ev.toFixed(2)} eV</span>
          </div>
        </div>

        {/* Gráfico SVG */}
        <div className="dos-graph">
          <svg viewBox="0 0 600 400" className="dos-svg">
            {/* Eixos */}
            <line x1="50" y1="350" x2="550" y2="350" stroke="#94a3b8" strokeWidth="2" />
            <line x1="50" y1="50" x2="50" y2="350" stroke="#94a3b8" strokeWidth="2" />
            
            {/* Labels dos eixos */}
            <text x="300" y="390" fill="#e2e8f0" textAnchor="middle">Energia E (eV)</text>
            <text x="20" y="200" fill="#e2e8f0" textAnchor="middle" transform="rotate(-90 20 200)">g(E) [estados/eV·cm³]</text>
            
            {/* Linhas de referência Ec e Ev */}
            <line 
              x1={50 + (Ec + 2) * 125} 
              y1="50" 
              x2={50 + (Ec + 2) * 125} 
              y2="350" 
              stroke="#22c55e" 
              strokeWidth="2" 
              strokeDasharray="5,5"
            />
            <text 
              x={50 + (Ec + 2) * 125 + 5} 
              y="70" 
              fill="#22c55e" 
              fontSize="12"
            >E_c</text>

            <line 
              x1={50 + (Ev + 2) * 125} 
              y1="50" 
              x2={50 + (Ev + 2) * 125} 
              y2="350" 
              stroke="#ef4444" 
              strokeWidth="2" 
              strokeDasharray="5,5"
            />
            <text 
              x={50 + (Ev + 2) * 125 + 5} 
              y="70" 
              fill="#ef4444" 
              fontSize="12"
            >E_v</text>

            {/* Curva densidade de estados condução */}
            <path
              d={graphData.pointsC.map((p, i) => {
                const x = 50 + (p.x + 2) * 125;
                const y = 350 - Math.min(p.y * 50, 280);
                return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
              }).join(' ')}
              fill="none"
              stroke="#22c55e"
              strokeWidth="3"
            />

            {/* Curva densidade de estados valência */}
            <path
              d={graphData.pointsV.map((p, i) => {
                const x = 50 + (p.x + 2) * 125;
                const y = 350 - Math.min(p.y * 50, 280);
                return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
              }).join(' ')}
              fill="none"
              stroke="#ef4444"
              strokeWidth="3"
            />
          </svg>
        </div>

        {/* Informações educacionais */}
        <div className="dos-info">
          <div className="info-card">
            <h4>📌 Dependência √E</h4>
            <p>Em 3D, g(E) ∝ √(E - E_c) para E ≥ E_c</p>
          </div>
          
          <div className="info-card">
            <h4>📌 Massa efetiva</h4>
            <p>g(E) ∝ (m*)^(3/2) - massa maior → mais estados</p>
          </div>

          <div className="info-card">
            <h4>📌 Banda de condução</h4>
            <p>Estados disponíveis para elétrons (verde)</p>
          </div>

          <div className="info-card">
            <h4>📌 Banda de valência</h4>
            <p>Estados disponíveis para lacunas (vermelho)</p>
          </div>
        </div>
      </div>
    </EducationalGraph>
  );
}
