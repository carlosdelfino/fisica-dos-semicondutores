import { useMemo } from 'react';
import { MATERIALS } from '../physics/materials.js';

/**
 * Diagrama E vs k (espaço-k recíproco) com bandas parabólicas:
 *  - Banda de valência: máximo em k = 0 (Γ), curvatura ∝ 1/m*_p
 *  - Banda de condução: mínimo em k = kCB_min (Γ se direto, X/L se indireto)
 *
 * Demonstra:
 *  - Massa efetiva como inverso da curvatura: 1/m* = (1/ℏ²) d²E/dk²
 *  - Gap direto vs indireto e os respectivos processos de transição
 */
export default function KSpaceDiagram({ material, T, Eg, Ec, Ev, mnScale = 1, mpScale = 1 }) {
  const W = 760, H = 480;
  const M = { l: 70, r: 30, t: 30, b: 60 };
  const innerW = W - M.l - M.r;
  const innerH = H - M.t - M.b;

  const mat = MATERIALS[material];
  const mn = mat.mn_eff * mnScale;
  const mp = mat.mp_eff * mpScale;
  const kCB = mat.kCB_min;
  const isDirect = mat.gap_type === 'direct';

  // domínio de k em unidades de π/a → [-1.2, 1.2]
  const kmin = -1.2, kmax = 1.2;
  // domínio de E (eV)
  const Emin = Ev - 1.5;
  const Emax = Ec + 1.5;

  // Curvatura parabólica em unidades arbitrárias mas consistentes:
  // E_BC(k) = Ec + A_n * (k - kCB)² ;  A_n ∝ 1/m*_n
  // E_BV(k) = Ev - A_p * k²        ;  A_p ∝ 1/m*_p
  const A_n = 1.6 / mn;
  const A_p = 1.6 / mp;

  const yScale = (E) => M.t + ((Emax - E) / (Emax - Emin)) * innerH;
  const xScale = (k) => M.l + ((k - kmin) / (kmax - kmin)) * innerW;

  const N = 220;
  const cbPath = useMemo(() => {
    const pts = [];
    for (let i = 0; i <= N; i++) {
      const k = kmin + (i / N) * (kmax - kmin);
      const E = Ec + A_n * (k - kCB) ** 2;
      pts.push(`${i === 0 ? 'M' : 'L'} ${xScale(k).toFixed(1)} ${yScale(E).toFixed(1)}`);
    }
    // segunda parábola simétrica para indireto (em -kCB)
    if (!isDirect) {
      pts.push('M' + xScale(-kCB).toFixed(1) + ' ' + yScale(Ec).toFixed(1));
      for (let i = 0; i <= N; i++) {
        const k = kmin + (i / N) * (kmax - kmin);
        const E = Ec + A_n * (k + kCB) ** 2;
        pts.push(`L ${xScale(k).toFixed(1)} ${yScale(E).toFixed(1)}`);
      }
    }
    return pts.join(' ');
  }, [Ec, A_n, kCB, isDirect]);

  const vbPath = useMemo(() => {
    const pts = [];
    for (let i = 0; i <= N; i++) {
      const k = kmin + (i / N) * (kmax - kmin);
      const E = Ev - A_p * k * k;
      pts.push(`${i === 0 ? 'M' : 'L'} ${xScale(k).toFixed(1)} ${yScale(E).toFixed(1)}`);
    }
    return pts.join(' ');
  }, [Ev, A_p]);

  // Posições para as transições
  const xVBmax = xScale(0);
  const yVBmax = yScale(Ev);
  const xCBmin_pos = xScale(kCB);
  const yCBmin = yScale(Ec);
  const xCBmin_neg = xScale(-kCB);

  return (
    <div className="diagram-card">
      <h3>Diagrama E × k — {mat.name} ({isDirect ? 'gap DIRETO' : 'gap INDIRETO'})</h3>
      <svg viewBox={`0 0 ${W} ${H}`} className="kspace-svg" role="img"
           aria-label="Diagrama E versus k mostrando bandas e tipo de gap">
        <defs>
          <marker id="arr-photon" viewBox="0 0 10 10" refX="9" refY="5"
                  markerWidth="6" markerHeight="6" orient="auto">
            <path d="M0,0 L10,5 L0,10 z" fill="#facc15" />
          </marker>
          <marker id="arr-phonon" viewBox="0 0 10 10" refX="9" refY="5"
                  markerWidth="6" markerHeight="6" orient="auto">
            <path d="M0,0 L10,5 L0,10 z" fill="#f472b6" />
          </marker>
        </defs>

        {/* eixos */}
        <line x1={M.l} y1={M.t + innerH} x2={M.l + innerW} y2={M.t + innerH} stroke="#475569" />
        <line x1={M.l} y1={M.t} x2={M.l} y2={M.t + innerH} stroke="#475569" />

        {/* eixo k = 0 (Γ) */}
        <line x1={xScale(0)} y1={M.t} x2={xScale(0)} y2={M.t + innerH}
              stroke="#1e293b" strokeDasharray="2 4" />
        {/* zonas de Brillouin (k = ±1) */}
        <line x1={xScale(1)} y1={M.t} x2={xScale(1)} y2={M.t + innerH}
              stroke="#334155" strokeDasharray="3 4" />
        <line x1={xScale(-1)} y1={M.t} x2={xScale(-1)} y2={M.t + innerH}
              stroke="#334155" strokeDasharray="3 4" />

        {/* Faixa proibida (gap) — área amarela entre Ev e Ec */}
        <rect x={M.l} y={yScale(Ec)} width={innerW} height={yScale(Ev) - yScale(Ec)}
              fill="#facc15" opacity="0.06" />
        <line x1={M.l} y1={yScale(Ec)} x2={M.l + innerW} y2={yScale(Ec)}
              stroke="#0ea5e9" strokeWidth="1" strokeDasharray="2 4" />
        <line x1={M.l} y1={yScale(Ev)} x2={M.l + innerW} y2={yScale(Ev)}
              stroke="#ef4444" strokeWidth="1" strokeDasharray="2 4" />

        {/* faixas permitidas (esquemáticas) acima e abaixo */}
        <rect x={M.l} y={M.t} width={innerW} height={yScale(Ec) - M.t}
              fill="#0ea5e9" opacity="0.04" />
        <rect x={M.l} y={yScale(Ev)} width={innerW} height={M.t + innerH - yScale(Ev)}
              fill="#ef4444" opacity="0.04" />

        {/* Curvas das bandas */}
        <path d={vbPath} fill="none" stroke="#ef4444" strokeWidth="2.5" />
        <path d={cbPath} fill="none" stroke="#0ea5e9" strokeWidth="2.5" />

        {/* Transição: direta ou indireta */}
        {isDirect ? (
          <>
            <line x1={xVBmax} y1={yVBmax} x2={xCBmin_pos} y2={yCBmin}
                  stroke="#facc15" strokeWidth="2.5" markerEnd="url(#arr-photon)" />
            <text x={xVBmax + 8} y={(yVBmax + yCBmin) / 2}
                  fill="#facc15" fontSize="11">hν (fóton)</text>
          </>
        ) : (
          <>
            {/* Transição indireta: precisa de fóton + fônon (Δk) */}
            <line x1={xVBmax} y1={yVBmax} x2={xVBmax} y2={yScale(Ec - 0.05)}
                  stroke="#facc15" strokeWidth="2" markerEnd="url(#arr-photon)" />
            <line x1={xVBmax} y1={yScale(Ec - 0.05)} x2={xCBmin_pos - 4} y2={yCBmin}
                  stroke="#f472b6" strokeWidth="2" strokeDasharray="4 3"
                  markerEnd="url(#arr-phonon)" />
            <text x={xVBmax + 6} y={yScale(Ec - 0.05) - 6}
                  fill="#facc15" fontSize="11">hν</text>
            <text x={(xVBmax + xCBmin_pos) / 2 - 8} y={yCBmin - 8}
                  fill="#f472b6" fontSize="11">+ fônon (Δk)</text>
          </>
        )}

        {/* Marcadores dos extremos das bandas */}
        <circle cx={xVBmax} cy={yVBmax} r="4" fill="#ef4444" />
        <text x={xVBmax + 6} y={yVBmax + 14} fill="#fca5a5" fontSize="11">
          BV máx (Γ)
        </text>
        <circle cx={xCBmin_pos} cy={yCBmin} r="4" fill="#0ea5e9" />
        <text x={xCBmin_pos + 6} y={yCBmin - 6} fill="#7dd3fc" fontSize="11">
          BC mín {isDirect ? '(Γ)' : kCB === 1 ? '(L)' : '(X)'}
        </text>
        {!isDirect && (
          <circle cx={xCBmin_neg} cy={yCBmin} r="4" fill="#0ea5e9" opacity="0.6" />
        )}

        {/* Eixo k */}
        {[-1, -kCB, 0, kCB, 1].filter((v, i, a) => a.indexOf(v) === i).map((k, i) => (
          <g key={i}>
            <line x1={xScale(k)} y1={M.t + innerH} x2={xScale(k)} y2={M.t + innerH + 4}
                  stroke="#64748b" />
            <text x={xScale(k)} y={M.t + innerH + 16} fill="#94a3b8" fontSize="10"
                  textAnchor="middle">
              {k === 0 ? 'Γ' : k === 1 ? 'X' : k === -1 ? '−X' :
               kCB === 1 ? (k > 0 ? 'L' : '−L') : k.toFixed(2)}
            </text>
          </g>
        ))}
        <text x={M.l + innerW / 2} y={H - 8} fill="#cbd5e1" fontSize="12"
              textAnchor="middle">k (em unidades de π/a)</text>

        {/* Eixo E */}
        {[Emin, Ev, 0, Ec, Emax].map((E, i) => (
          <g key={i}>
            <line x1={M.l - 4} y1={yScale(E)} x2={M.l} y2={yScale(E)} stroke="#64748b" />
            <text x={M.l - 6} y={yScale(E) + 3} fill="#94a3b8" fontSize="10"
                  textAnchor="end">{E.toFixed(2)}</text>
          </g>
        ))}
        <text x={20} y={M.t + innerH / 2} fill="#cbd5e1" fontSize="12"
              transform={`rotate(-90 20 ${M.t + innerH / 2})`} textAnchor="middle">
          Energia E (eV)
        </text>

        {/* Caixa informativa */}
        <g transform={`translate(${M.l + innerW - 230}, ${M.t + 10})`}>
          <rect x="0" y="0" width="220" height="80" rx="6" fill="#0f172a" stroke="#334155" />
          <text x="10" y="18" fill="#fbbf24" fontSize="12" fontWeight="600">
            Massa efetiva ↔ curvatura
          </text>
          <text x="10" y="36" fill="#bae6fd" fontSize="11">
            m*_n / m₀ = {mn.toFixed(3)}
          </text>
          <text x="10" y="52" fill="#fecaca" fontSize="11">
            m*_p / m₀ = {mp.toFixed(3)}
          </text>
          <text x="10" y="70" fill="#cbd5e1" fontSize="10">
            menor m* ⇒ banda mais aberta
          </text>
        </g>
      </svg>
      <p className="diagram-caption">
        A <b>massa efetiva</b> aparece como o inverso da curvatura das bandas:
        <code style={{ marginLeft: 6 }}>1/m* = (1/ℏ²) · d²E/dk²</code>.
        Bandas estreitas (pouca curvatura) ⇒ <i>m* grande</i> ⇒ portadores "pesados".
        Bandas abertas (muita curvatura) ⇒ <i>m* pequena</i> ⇒ portadores "leves".
        {isDirect
          ? ' Em GaAs (gap direto) o mínimo da BC e o máximo da BV ocorrem no mesmo k (Γ): basta um fóton para excitar um elétron.'
          : ' Em Si/Ge (gap indireto) o mínimo da BC está deslocado em k: a transição precisa de fóton (energia) + fônon (momento Δk).'}
      </p>
    </div>
  );
}
