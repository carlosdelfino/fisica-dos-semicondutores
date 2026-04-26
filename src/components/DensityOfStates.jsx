import { useMemo } from 'react';
import { dosConduction, dosValence, fermiDirac } from '../physics/formulas.js';
import { MATERIALS } from '../physics/materials.js';

/**
 * Plota g(E), f(E), e n(E) = g_c(E) f(E), p(E) = g_v(E)(1-f(E)).
 * Layout: 3 painéis lado a lado.
 */
export default function DensityOfStates({ material, T, EF, Ec, Ev, Eg }) {
  const W = 760, H = 420;
  const M = { l: 60, r: 30, t: 30, b: 50 };
  const innerW = W - M.l - M.r;
  const innerH = H - M.t - M.b;

  const mat = MATERIALS[material];
  const Emin = Ev - 0.4;
  const Emax = Ec + 0.4;
  const N = 220;

  const data = useMemo(() => {
    const pts = [];
    let maxG = 0;
    let maxN = 0;
    for (let i = 0; i <= N; i++) {
      const E = Emin + (i / N) * (Emax - Emin);
      const gc = dosConduction(E, Ec, mat.mn_eff);
      const gv = dosValence(E, Ev, mat.mp_eff);
      const f  = fermiDirac(E, EF, T);
      const nE = gc * f;
      const pE = gv * (1 - f);
      const g = gc + gv;
      maxG = Math.max(maxG, g);
      maxN = Math.max(maxN, nE, pE);
      pts.push({ E, gc, gv, g, f, nE, pE });
    }
    return { pts, maxG: maxG || 1, maxN: maxN || 1 };
  }, [Emin, Emax, EF, T, Ec, Ev, mat]);

  // tres faixas X dentro do innerW
  const panelW = innerW / 3;
  const xPanel = (panel, val, max) => M.l + panel * panelW + (val / max) * (panelW * 0.85);
  const yScale = (E) => M.t + ((Emax - E) / (Emax - Emin)) * innerH;

  const buildPath = (key, panel, max) =>
    data.pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${xPanel(panel, p[key], max).toFixed(1)} ${yScale(p.E).toFixed(1)}`).join(' ');

  // Áreas para n(E) e p(E)
  const buildArea = (key, panel, max) => {
    const top = data.pts.map((p) => `${xPanel(panel, p[key], max).toFixed(1)} ${yScale(p.E).toFixed(1)}`);
    const x0 = xPanel(panel, 0, max).toFixed(1);
    return `M ${x0} ${yScale(Emin).toFixed(1)} L ` + top.join(' L ') + ` L ${x0} ${yScale(Emax).toFixed(1)} Z`;
  };

  return (
    <div className="diagram-card">
      <h3>Estatística Quântica nas Bandas — g(E), f(E) e portadores</h3>
      <svg viewBox={`0 0 ${W} ${H}`} className="dos-svg" role="img"
           aria-label="Densidade de estados, distribuição de Fermi e concentração de portadores">

        {/* eixos verticais (Y comum) */}
        {[0, 1, 2, 3].map((i) => (
          <line key={i} x1={M.l + i * panelW} y1={M.t}
                x2={M.l + i * panelW} y2={M.t + innerH}
                stroke="#1e293b" />
        ))}
        <line x1={M.l} y1={M.t + innerH} x2={M.l + innerW} y2={M.t + innerH} stroke="#475569" />

        {/* faixas Ec, Ev em todos painéis */}
        {[0, 1, 2].map((p) => (
          <g key={p}>
            <line x1={M.l + p * panelW} y1={yScale(Ec)} x2={M.l + (p + 1) * panelW} y2={yScale(Ec)}
                  stroke="#0ea5e9" strokeWidth="1" strokeDasharray="2 3" opacity="0.7" />
            <line x1={M.l + p * panelW} y1={yScale(Ev)} x2={M.l + (p + 1) * panelW} y2={yScale(Ev)}
                  stroke="#ef4444" strokeWidth="1" strokeDasharray="2 3" opacity="0.7" />
            <line x1={M.l + p * panelW} y1={yScale(EF)} x2={M.l + (p + 1) * panelW} y2={yScale(EF)}
                  stroke="#fbbf24" strokeWidth="1" strokeDasharray="4 3" opacity="0.7" />
          </g>
        ))}

        {/* Painel 1: g(E) DOS */}
        <text x={M.l + 0 * panelW + panelW / 2} y={M.t - 10}
              fill="#cbd5e1" fontSize="12" textAnchor="middle">g(E) — Densidade de Estados</text>
        <path d={buildPath('gc', 0, data.maxG)} fill="none" stroke="#0ea5e9" strokeWidth="2" />
        <path d={buildPath('gv', 0, data.maxG)} fill="none" stroke="#ef4444" strokeWidth="2" />

        {/* Painel 2: f(E) */}
        <text x={M.l + 1 * panelW + panelW / 2} y={M.t - 10}
              fill="#cbd5e1" fontSize="12" textAnchor="middle">f(E) — Fermi-Dirac</text>
        <path d={buildPath('f', 1, 1)} fill="none" stroke="#22d3ee" strokeWidth="2" />
        {/* (1-f) também */}
        <path d={data.pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${xPanel(1, 1 - p.f, 1).toFixed(1)} ${yScale(p.E).toFixed(1)}`).join(' ')}
              fill="none" stroke="#f472b6" strokeWidth="1.5" strokeDasharray="5 3" />

        {/* Painel 3: n(E) e p(E) */}
        <text x={M.l + 2 * panelW + panelW / 2} y={M.t - 10}
              fill="#cbd5e1" fontSize="12" textAnchor="middle">
          n(E) = g_c·f &nbsp;|&nbsp; p(E) = g_v·(1−f)
        </text>
        <path d={buildArea('nE', 2, data.maxN)} fill="#0ea5e9" opacity="0.45" />
        <path d={buildArea('pE', 2, data.maxN)} fill="#ef4444" opacity="0.45" />
        <path d={buildPath('nE', 2, data.maxN)} fill="none" stroke="#0ea5e9" strokeWidth="1.5" />
        <path d={buildPath('pE', 2, data.maxN)} fill="none" stroke="#ef4444" strokeWidth="1.5" />

        {/* Eixo Y energia (esquerda) */}
        {[Emin, Ev, EF, Ec, Emax].map((E, i) => (
          <g key={i}>
            <line x1={M.l - 4} y1={yScale(E)} x2={M.l} y2={yScale(E)} stroke="#64748b" />
            <text x={M.l - 6} y={yScale(E) + 3} fill="#94a3b8" fontSize="10" textAnchor="end">
              {E.toFixed(2)}
            </text>
          </g>
        ))}
        <text x={20} y={M.t + innerH / 2} fill="#cbd5e1" fontSize="12"
              transform={`rotate(-90 20 ${M.t + innerH / 2})`} textAnchor="middle">
          Energia (eV)
        </text>

        {/* Rótulos de bandas */}
        <text x={M.l + 4} y={yScale(Ec) - 3} fill="#0ea5e9" fontSize="10">E_c</text>
        <text x={M.l + 4} y={yScale(Ev) + 12} fill="#ef4444" fontSize="10">E_v</text>
        <text x={M.l + 4} y={yScale(EF) - 3} fill="#fbbf24" fontSize="10">E_F</text>

        {/* Legenda do painel 1 */}
        <g transform={`translate(${M.l + 6}, ${M.t + innerH - 60})`}>
          <line x1="0" y1="6" x2="20" y2="6" stroke="#0ea5e9" strokeWidth="2" />
          <text x="24" y="10" fill="#bae6fd" fontSize="10">g_c(E) ∝ √(E−E_c)</text>
          <line x1="0" y1="22" x2="20" y2="22" stroke="#ef4444" strokeWidth="2" />
          <text x="24" y="26" fill="#fecaca" fontSize="10">g_v(E) ∝ √(E_v−E)</text>
        </g>
      </svg>
      <p className="diagram-caption">
        A concentração total de elétrons é a integral n = ∫_E_c^∞ g_c(E) f(E) dE; a de lacunas é p = ∫_-∞^E_v g_v(E) (1 − f(E)) dE.
        As áreas coloridas no terceiro painel mostram o produto g(E)·f(E), revelando que apenas as caudas das bandas
        próximas a E_c e E_v efetivamente contribuem aos portadores.
      </p>
    </div>
  );
}
