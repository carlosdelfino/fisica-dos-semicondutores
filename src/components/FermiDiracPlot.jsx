import { useMemo } from 'react';
import { fermiDirac, maxwellBoltzmann } from '../physics/formulas.js';
import { k_B_eV } from '../physics/constants.js';

/**
 * Plot interativo de f(E) Fermi-Dirac com aproximação Maxwell-Boltzmann.
 * Eixo X: f(E) [0,1], Eixo Y: E (eV) verticalizado para alinhar com diagrama de bandas.
 *
 * Props: { T, EF, Ec, Ev, Eg }
 */
export default function FermiDiracPlot({ T, EF, Ec, Ev, Eg }) {
  const W = 460, H = 460;
  const M = { l: 60, r: 30, t: 30, b: 50 };
  const innerW = W - M.l - M.r;
  const innerH = H - M.t - M.b;

  // domínio de energia centrado em torno de EF, abrangendo as bandas
  const Emin = Math.min(Ev - 0.4, EF - 0.5);
  const Emax = Math.max(Ec + 0.4, EF + 0.5);

  const N = 240;
  const points = useMemo(() => {
    const pts = [];
    for (let i = 0; i <= N; i++) {
      const E = Emin + (i / N) * (Emax - Emin);
      const f = fermiDirac(E, EF, T);
      const fmb = maxwellBoltzmann(E, EF, T);
      const oneMinusF = 1 - f;
      pts.push({ E, f, fmb: Math.min(fmb, 1), oneMinusF });
    }
    return pts;
  }, [Emin, Emax, EF, T]);

  const xScale = (f) => M.l + f * innerW;
  const yScale = (E) => M.t + ((Emax - E) / (Emax - Emin)) * innerH;

  const pathFD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${xScale(p.f).toFixed(1)} ${yScale(p.E).toFixed(1)}`).join(' ');
  const pathMB = points
    .filter((p) => p.fmb <= 1.05)
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${xScale(Math.min(p.fmb, 1)).toFixed(1)} ${yScale(p.E).toFixed(1)}`)
    .join(' ');

  // região onde MB é boa aproximação: |E - EF| > 3 kT  →  destacar
  const margin = 3 * k_B_eV * Math.max(T, 1);
  const yMBhigh = yScale(EF + margin);
  const yMBlow  = yScale(EF - margin);

  return (
    <div className="diagram-card">
      <h3>Distribuição de Fermi-Dirac × Maxwell-Boltzmann</h3>
      <svg viewBox={`0 0 ${W} ${H}`} className="fd-svg" role="img"
           aria-label="Gráfico Fermi-Dirac vs Maxwell-Boltzmann">
        {/* faixa de validade MB */}
        <rect x={M.l} y={M.t} width={innerW} height={Math.max(0, yMBhigh - M.t)}
              fill="#22c55e" opacity="0.06" />
        <rect x={M.l} y={yMBlow} width={innerW} height={Math.max(0, M.t + innerH - yMBlow)}
              fill="#22c55e" opacity="0.06" />

        {/* eixos */}
        <line x1={M.l} y1={M.t} x2={M.l} y2={M.t + innerH} stroke="#475569" />
        <line x1={M.l} y1={M.t + innerH} x2={M.l + innerW} y2={M.t + innerH} stroke="#475569" />

        {/* grades verticais 0..1 */}
        {[0, 0.25, 0.5, 0.75, 1].map((f, i) => (
          <g key={i}>
            <line x1={xScale(f)} y1={M.t} x2={xScale(f)} y2={M.t + innerH}
                  stroke="#1e293b" strokeDasharray="2 4" />
            <text x={xScale(f)} y={M.t + innerH + 16} fill="#94a3b8" fontSize="10" textAnchor="middle">
              {f.toFixed(2)}
            </text>
          </g>
        ))}
        <text x={M.l + innerW / 2} y={H - 8} fill="#cbd5e1" fontSize="12" textAnchor="middle">
          f(E) — probabilidade de ocupação
        </text>

        {/* eixo Y energia */}
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

        {/* faixa proibida (gap) */}
        <rect x={M.l} y={yScale(Ec)} width={innerW} height={yScale(Ev) - yScale(Ec)}
              fill="#facc15" opacity="0.05" />
        <line x1={M.l} y1={yScale(Ec)} x2={M.l + innerW} y2={yScale(Ec)} stroke="#0ea5e9" strokeWidth="1.2" />
        <line x1={M.l} y1={yScale(Ev)} x2={M.l + innerW} y2={yScale(Ev)} stroke="#ef4444" strokeWidth="1.2" />
        <text x={M.l + innerW - 5} y={yScale(Ec) - 4} fill="#0ea5e9" fontSize="11" textAnchor="end">E_c</text>
        <text x={M.l + innerW - 5} y={yScale(Ev) + 12} fill="#ef4444" fontSize="11" textAnchor="end">E_v</text>

        {/* nível de Fermi */}
        <line x1={M.l} y1={yScale(EF)} x2={M.l + innerW} y2={yScale(EF)}
              stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="5 4" />
        <text x={M.l + 4} y={yScale(EF) - 3} fill="#fbbf24" fontSize="11">E_F</text>

        {/* curva Fermi-Dirac */}
        <path d={pathFD} fill="none" stroke="#22d3ee" strokeWidth="2.5" />
        {/* curva Maxwell-Boltzmann */}
        <path d={pathMB} fill="none" stroke="#f472b6" strokeWidth="2"
              strokeDasharray="6 4" />

        {/* ponto destacado em E=EF */}
        <circle cx={xScale(0.5)} cy={yScale(EF)} r="4" fill="#fbbf24" />
        <text x={xScale(0.5) + 8} y={yScale(EF) - 6} fill="#fbbf24" fontSize="10">
          f(E_F) = 1/2
        </text>

        {/* legenda */}
        <g transform={`translate(${M.l + 10}, ${M.t + 10})`}>
          <rect x="0" y="0" width="180" height="56" rx="4"
                fill="#0f172a" stroke="#334155" />
          <line x1="8" y1="18" x2="28" y2="18" stroke="#22d3ee" strokeWidth="2.5" />
          <text x="34" y="22" fill="#e2e8f0" fontSize="11">Fermi-Dirac f(E)</text>
          <line x1="8" y1="36" x2="28" y2="36" stroke="#f472b6" strokeWidth="2" strokeDasharray="6 4" />
          <text x="34" y="40" fill="#e2e8f0" fontSize="11">Maxwell-Boltzmann</text>
          <text x="8" y="52" fill="#86efac" fontSize="9">faixa verde: |E−EF| &gt; 3kT</text>
        </g>
      </svg>
      <p className="diagram-caption">
        Em <b>T = 0 K</b> a curva é um degrau perfeito em E_F. Conforme T aumenta, a transição se suaviza
        sobre uma faixa de ~k_BT ≈ {(k_B_eV * T * 1000).toFixed(2)} meV. A aproximação de Maxwell-Boltzmann
        (rosa tracejado) coincide com a Fermi-Dirac apenas onde |E − E_F| ≫ k_BT (faixa verde).
      </p>
    </div>
  );
}
