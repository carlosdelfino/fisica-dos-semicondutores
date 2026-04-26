import { useState } from 'react';
import { TeX } from './Math.jsx';

/**
 * Demonstração interativa do conceito de massa efetiva.
 *
 *   F = m* · a   (segunda lei de Newton no cristal)
 *   1/m* = (1/ℏ²) · d²E/dk²
 *
 * O usuário aplica uma força F e ajusta m*; o sistema mostra a aceleração
 * resultante de duas partículas (livre, m₀) e (no cristal, m*) reagindo
 * ao mesmo F.
 */
export default function EffectiveMassDemo() {
  const [mStar, setMStar] = useState(0.26); // em unidades de m_0 (média Si)
  const [force, setForce] = useState(1.0);  // força arbitrária
  const [carrier, setCarrier] = useState('electron');

  // Acelerações relativas (m_0 livre = referência)
  const aFree   = force / 1.0;
  const aCryst  = force / Math.max(mStar, 0.01);

  const W = 760, H = 420;

  // Plot E(k) parabólica para diferentes m*
  const M = { l: 60, r: 30, t: 30, b: 60 };
  const innerW = (W - M.l - M.r) / 2 - 10;
  const innerH = H - M.t - M.b;
  const kmin = -1, kmax = 1;
  const Emin = 0, Emax = 1.2;

  // E(k) = ℏ²k²/(2m*)  → em unidades arbitrárias E = k²/m*
  const buildPath = (m, x0) => {
    const N = 100;
    const pts = [];
    for (let i = 0; i <= N; i++) {
      const k = kmin + (i / N) * (kmax - kmin);
      const E = (k * k) / Math.max(m, 0.01);
      const px = x0 + ((k - kmin) / (kmax - kmin)) * innerW;
      const py = M.t + ((Emax - E) / (Emax - Emin)) * innerH;
      pts.push(`${i === 0 ? 'M' : 'L'} ${px.toFixed(1)} ${py.toFixed(1)}`);
    }
    return pts.join(' ');
  };

  // Caixas onde as partículas se movem
  const trackY = M.t + innerH + 40;
  const trackLen = innerW;

  // Posição das esferas em função do tempo (animação SVG)
  // Acelerações normalizadas para visualização
  const aNorm = (a) => Math.min(1, a / 5);

  return (
    <div className="diagram-card">
      <h3>Massa Efetiva — relação entre força e aceleração no cristal</h3>

      <div className="effmass-controls">
        <div className="control-group">
          <label>Tipo de portador</label>
          <div className="radio-row">
            <label className={`radio-btn ${carrier === 'electron' ? 'active' : ''}`}
                   style={{ '--accent': '#0ea5e9' }}>
              <input type="radio" checked={carrier === 'electron'}
                     onChange={() => setCarrier('electron')} />
              elétron
            </label>
            <label className={`radio-btn ${carrier === 'hole' ? 'active' : ''}`}
                   style={{ '--accent': '#ef4444' }}>
              <input type="radio" checked={carrier === 'hole'}
                     onChange={() => setCarrier('hole')} />
              lacuna
            </label>
          </div>
        </div>

        <div className="control-group">
          <label>m* / m₀: <b>{mStar.toFixed(3)}</b></label>
          <input type="range" min="0.02" max="2" step="0.01"
                 value={mStar} onChange={(e) => setMStar(Number(e.target.value))} />
        </div>

        <div className="control-group">
          <label>Força F (un. arbitrárias): <b>{force.toFixed(2)}</b></label>
          <input type="range" min="0.1" max="3" step="0.05"
                 value={force} onChange={(e) => setForce(Number(e.target.value))} />
        </div>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="effmass-svg" role="img"
           aria-label="Demonstração de massa efetiva">
        {/* Painel esquerdo: parábolas E(k) */}
        <text x={M.l + innerW / 2} y={M.t - 10}
              fill="#cbd5e1" fontSize="12" textAnchor="middle">
          E(k) — curvatura ∝ 1/m*
        </text>
        <line x1={M.l} y1={M.t + innerH} x2={M.l + innerW} y2={M.t + innerH} stroke="#475569" />
        <line x1={M.l + innerW / 2} y1={M.t} x2={M.l + innerW / 2} y2={M.t + innerH}
              stroke="#1e293b" strokeDasharray="2 4" />

        {/* parábola elétron livre (m=1, referência) */}
        <path d={buildPath(1.0, M.l)} fill="none" stroke="#94a3b8"
              strokeWidth="1.5" strokeDasharray="5 4" />
        {/* parábola com m* atual */}
        <path d={buildPath(mStar, M.l)} fill="none"
              stroke={carrier === 'electron' ? '#0ea5e9' : '#ef4444'}
              strokeWidth="2.5" />

        <text x={M.l + 6} y={M.t + 14} fill="#94a3b8" fontSize="10">— elétron livre m₀</text>
        <text x={M.l + 6} y={M.t + 28}
              fill={carrier === 'electron' ? '#7dd3fc' : '#fca5a5'} fontSize="10">
          — no cristal m* = {mStar.toFixed(2)} m₀
        </text>
        <text x={M.l + innerW / 2 + 4} y={M.t + innerH - 6} fill="#94a3b8" fontSize="10">k</text>
        <text x={M.l + 4} y={M.t + 8} fill="#94a3b8" fontSize="10">E</text>

        {/* Painel direito: pista de aceleração */}
        <text x={M.l + innerW + 20 + innerW / 2} y={M.t - 10}
              fill="#cbd5e1" fontSize="12" textAnchor="middle">
          F = m* · a → comparativo de acelerações
        </text>

        {/* pista 1: elétron livre */}
        <line x1={M.l + innerW + 20} y1={trackY - 30}
              x2={M.l + innerW + 20 + trackLen} y2={trackY - 30}
              stroke="#475569" strokeWidth="2" />
        <text x={M.l + innerW + 24} y={trackY - 36} fill="#94a3b8" fontSize="10">
          livre (m₀) → a = F = {aFree.toFixed(2)}
        </text>
        <circle cx={M.l + innerW + 30} cy={trackY - 30} r="9"
                fill="#94a3b8" stroke="#475569" strokeWidth="2">
          <animate attributeName="cx"
                   values={`${M.l + innerW + 30};${M.l + innerW + 20 + trackLen - 12};${M.l + innerW + 30}`}
                   dur={`${Math.max(0.6, 4 / Math.max(aFree, 0.1))}s`}
                   repeatCount="indefinite" />
        </circle>
        <line x1={M.l + innerW + 22} y1={trackY - 50}
              x2={M.l + innerW + 22 + 30 * aNorm(aFree)} y2={trackY - 50}
              stroke="#facc15" strokeWidth="2" markerEnd="url(#arr-mass)" />

        {/* pista 2: no cristal */}
        <line x1={M.l + innerW + 20} y1={trackY + 30}
              x2={M.l + innerW + 20 + trackLen} y2={trackY + 30}
              stroke="#475569" strokeWidth="2" />
        <text x={M.l + innerW + 24} y={trackY + 24}
              fill={carrier === 'electron' ? '#7dd3fc' : '#fca5a5'} fontSize="10">
          cristal (m*) → a = F/m* = {aCryst.toFixed(2)}
        </text>
        <circle cx={M.l + innerW + 30} cy={trackY + 30} r="9"
                fill={carrier === 'electron' ? '#0ea5e9' : '#ef4444'}
                stroke={carrier === 'electron' ? '#0c4a6e' : '#7f1d1d'} strokeWidth="2">
          <animate attributeName="cx"
                   values={`${M.l + innerW + 30};${M.l + innerW + 20 + trackLen - 12};${M.l + innerW + 30}`}
                   dur={`${Math.max(0.3, 4 / Math.max(aCryst, 0.1))}s`}
                   repeatCount="indefinite" />
        </circle>
        <line x1={M.l + innerW + 22} y1={trackY + 50}
              x2={M.l + innerW + 22 + 30 * aNorm(aCryst)} y2={trackY + 50}
              stroke="#facc15" strokeWidth="2" markerEnd="url(#arr-mass)" />

        <defs>
          <marker id="arr-mass" viewBox="0 0 10 10" refX="9" refY="5"
                  markerWidth="6" markerHeight="6" orient="auto">
            <path d="M0,0 L10,5 L0,10 z" fill="#facc15" />
          </marker>
        </defs>

        {/* fórmulas */}
        <foreignObject x={M.l + innerW + 20} y={trackY + 70} width={innerW} height={70}>
          <div xmlns="http://www.w3.org/1999/xhtml" style={{ color: '#cbd5e1', fontSize: '12px' }}>
            <TeX math={String.raw`F = m^*\,a \;\Longleftrightarrow\; a = \dfrac{F}{m^*} = \dfrac{1}{\hbar^2}\dfrac{d^2 E}{dk^2}\,F`} block />
          </div>
        </foreignObject>
      </svg>

      <p className="diagram-caption">
        A <b>massa efetiva m*</b> "absorve" todas as forças internas do cristal (potencial periódico dos núcleos
        e demais elétrons), permitindo tratar o portador como uma partícula livre obedecendo F = m*·a. Quando m* &lt; m₀
        (ex.: GaAs com m*_n ≈ 0.067 m₀), o elétron acelera <i>muito mais</i> que um elétron livre sob a mesma força.
        Para a <b>lacuna</b>, m*_p é definida positiva mesmo descrevendo um estado vazio: ela responde a campos
        elétricos como uma carga +q com massa m*_p.
      </p>
    </div>
  );
}
