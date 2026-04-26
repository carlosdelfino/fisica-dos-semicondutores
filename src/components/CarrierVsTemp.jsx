import { useMemo } from 'react';
import { intrinsicCarrier, carrierConcentrations } from '../physics/formulas.js';

/**
 * Plot ln(n) vs 1000/T mostrando as 3 regiões clássicas:
 * - freeze-out (baixa T, dopantes não ionizados)
 * - extrínseca (n ≈ ND)
 * - intrínseca (n ≈ ni domina)
 *
 * Aproximação simplificada: dopantes assumidos completamente ionizados acima de T_freeze,
 * o que captura a transição extrínseca→intrínseca corretamente.
 */
export default function CarrierVsTemp({ material, ND, NA, currentT }) {
  const W = 760, H = 380;
  const M = { l: 70, r: 30, t: 30, b: 60 };
  const innerW = W - M.l - M.r;
  const innerH = H - M.t - M.b;

  // varredura de T entre 50 K e 1000 K
  const Tmin = 50, Tmax = 1000;
  const N = 200;

  const data = useMemo(() => {
    const pts = [];
    for (let i = 0; i <= N; i++) {
      const T = Tmin + (i / N) * (Tmax - Tmin);
      const ni = intrinsicCarrier(material, T);
      const { n, p } = carrierConcentrations(material, T, ND, NA);
      pts.push({ T, invT: 1000 / T, ni, n, p });
    }
    return pts;
  }, [material, ND, NA]);

  // limites do plot
  const xmin = 1000 / Tmax; // 1
  const xmax = 1000 / Tmin; // 20
  const allY = data.flatMap((d) => [Math.log10(Math.max(d.n, 1)), Math.log10(Math.max(d.p, 1)), Math.log10(Math.max(d.ni, 1))]);
  const ymin = Math.max(0, Math.floor(Math.min(...allY)) - 1);
  const ymax = Math.ceil(Math.max(...allY)) + 1;

  const xScale = (x) => M.l + ((x - xmin) / (xmax - xmin)) * innerW;
  const yScale = (y) => M.t + ((ymax - y) / (ymax - ymin)) * innerH;

  const path = (key) =>
    data
      .map((d, i) => {
        const v = Math.max(d[key], 1);
        return `${i === 0 ? 'M' : 'L'} ${xScale(d.invT).toFixed(1)} ${yScale(Math.log10(v)).toFixed(1)}`;
      })
      .join(' ');

  // marcador do T atual
  const xCur = xScale(1000 / currentT);

  return (
    <div className="diagram-card">
      <h3>n, p, n_i vs 1/T (Diagrama de Arrhenius)</h3>
      <svg viewBox={`0 0 ${W} ${H}`} className="arr-svg" role="img"
           aria-label="Concentração de portadores em função de 1000/T">
        {/* eixos */}
        <line x1={M.l} y1={M.t + innerH} x2={M.l + innerW} y2={M.t + innerH} stroke="#475569" />
        <line x1={M.l} y1={M.t} x2={M.l} y2={M.t + innerH} stroke="#475569" />

        {/* grade Y (decadas) */}
        {Array.from({ length: ymax - ymin + 1 }).map((_, i) => {
          const y = ymin + i;
          return (
            <g key={i}>
              <line x1={M.l} y1={yScale(y)} x2={M.l + innerW} y2={yScale(y)}
                    stroke="#1e293b" strokeDasharray="2 4" />
              <text x={M.l - 6} y={yScale(y) + 3} fill="#94a3b8" fontSize="10" textAnchor="end">
                10^{y}
              </text>
            </g>
          );
        })}
        {/* grade X */}
        {[1, 2, 3, 5, 10, 15, 20].filter((x) => x >= xmin && x <= xmax).map((x, i) => (
          <g key={i}>
            <line x1={xScale(x)} y1={M.t} x2={xScale(x)} y2={M.t + innerH}
                  stroke="#1e293b" strokeDasharray="2 4" />
            <text x={xScale(x)} y={M.t + innerH + 14} fill="#94a3b8" fontSize="10" textAnchor="middle">
              {x}
            </text>
            <text x={xScale(x)} y={M.t + innerH + 28} fill="#64748b" fontSize="9" textAnchor="middle">
              T = {(1000 / x).toFixed(0)} K
            </text>
          </g>
        ))}

        {/* faixa extrínseca: nivel constante log10(|ND-NA|) */}
        {(ND > 0 || NA > 0) && (
          <line x1={M.l} y1={yScale(Math.log10(Math.abs(ND - NA) || 1))}
                x2={M.l + innerW} y2={yScale(Math.log10(Math.abs(ND - NA) || 1))}
                stroke="#fbbf24" strokeWidth="1" strokeDasharray="6 4" opacity="0.6" />
        )}

        {/* curvas */}
        <path d={path('ni')} fill="none" stroke="#94a3b8" strokeWidth="2" strokeDasharray="4 3" />
        <path d={path('n')}  fill="none" stroke="#22d3ee" strokeWidth="2.5" />
        <path d={path('p')}  fill="none" stroke="#f472b6" strokeWidth="2.5" />

        {/* marcador T atual */}
        <line x1={xCur} y1={M.t} x2={xCur} y2={M.t + innerH}
              stroke="#facc15" strokeWidth="1" />
        <text x={xCur + 4} y={M.t + 12} fill="#facc15" fontSize="10">
          T = {currentT} K
        </text>

        <text x={M.l + innerW / 2} y={H - 8} fill="#cbd5e1" fontSize="12" textAnchor="middle">
          1000 / T (K⁻¹)
        </text>
        <text x={20} y={M.t + innerH / 2} fill="#cbd5e1" fontSize="12"
              transform={`rotate(-90 20 ${M.t + innerH / 2})`} textAnchor="middle">
          Concentração (cm⁻³)
        </text>

        {/* legenda */}
        <g transform={`translate(${M.l + innerW - 180}, ${M.t + 8})`}>
          <rect x="0" y="0" width="170" height="62" rx="4" fill="#0f172a" stroke="#334155" />
          <line x1="8" y1="14" x2="28" y2="14" stroke="#22d3ee" strokeWidth="2.5" />
          <text x="32" y="18" fill="#bae6fd" fontSize="11">n (elétrons)</text>
          <line x1="8" y1="30" x2="28" y2="30" stroke="#f472b6" strokeWidth="2.5" />
          <text x="32" y="34" fill="#fbcfe8" fontSize="11">p (lacunas)</text>
          <line x1="8" y1="46" x2="28" y2="46" stroke="#94a3b8" strokeWidth="2" strokeDasharray="4 3" />
          <text x="32" y="50" fill="#cbd5e1" fontSize="11">n_i (intrínseco)</text>
        </g>
      </svg>
      <p className="diagram-caption">
        À <b>esquerda</b> (T alto, 1/T pequeno) o material é <b>intrínseco</b>: n ≈ p ≈ n_i e cresce exponencialmente com T.
        Na <b>região central</b> (T moderado) é <b>extrínseco</b>: n ≈ N_D − N_A (ou p, no caso tipo-p) ≈ constante.
        À <b>direita</b> (T baixo) entra-se em <b>freeze-out</b>: dopantes recapturam seus portadores e n cai.
      </p>
    </div>
  );
}
