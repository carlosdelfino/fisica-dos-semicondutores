import { useMemo, useState } from 'react';
import { TeX } from './Math.jsx';

/**
 * Modelo de Kronig-Penney (limite delta).
 *
 * Equação central:
 *    P · sin(αa) / (αa) + cos(αa) = cos(ka)
 *
 * com α = √(2mE)/ℏ. Em unidades adimensionais:
 *    x = αa = √(E/E₀),  E₀ = ℏ²/(2ma²)
 *    LHS(x) = P · sin(x)/x + cos(x)
 *
 * Onde |LHS| ≤ 1 → existe k real → BANDA PERMITIDA.
 * Onde |LHS| > 1 → k complexo → BANDA PROIBIDA (gap).
 *
 * Animação demonstra como bandas e gaps emergem da periodicidade do potencial.
 */
export default function KronigPenneyDiagram() {
  const [P, setP] = useState(2.5); // força do potencial barreira (mVₒb·a / ℏ²)

  const W = 760, H = 520;
  const split = 380; // largura do painel esquerdo

  // Painel 1: potencial V(x) periódico (rectangular)
  const periods = 4;
  const aWidth = (split - 60) / periods;
  const wellW = aWidth * 0.7;
  const barrW = aWidth - wellW;

  // Painel 2: LHS(E) — região onde |LHS|≤1 = banda
  const xMax = 14; // αa range
  const N = 600;
  const lhsPts = useMemo(() => {
    const pts = [];
    for (let i = 1; i <= N; i++) {
      const x = (i / N) * xMax;
      const lhs = P * Math.sin(x) / x + Math.cos(x);
      pts.push({ x, lhs });
    }
    return pts;
  }, [P]);

  // Identificar bandas permitidas (intervalos onde |lhs|<=1)
  const bands = useMemo(() => {
    const result = [];
    let inBand = false;
    let start = 0;
    for (const p of lhsPts) {
      if (Math.abs(p.lhs) <= 1) {
        if (!inBand) { start = p.x; inBand = true; }
      } else {
        if (inBand) { result.push([start, p.x]); inBand = false; }
      }
    }
    if (inBand) result.push([start, xMax]);
    return result;
  }, [lhsPts]);

  // Layout do gráfico LHS
  const M = { l: 50, t: 280, r: 20, b: 60 };
  const innerW = split - M.l - M.r;
  const innerH = H - M.t - M.b;
  const xScale = (x) => M.l + (x / xMax) * innerW;
  const yMin = -3, yMax = 3;
  const yScale = (y) => M.t + ((yMax - y) / (yMax - yMin)) * innerH;

  const lhsPath = lhsPts
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${xScale(p.x).toFixed(1)} ${yScale(Math.max(Math.min(p.lhs, yMax), yMin)).toFixed(1)}`)
    .join(' ');

  // Painel 3: bandas resultantes (E vs k)
  const rM = { l: split + 30, r: 30, t: 30, b: 60 };
  const rW = W - rM.l - rM.r;
  const rH = H - rM.t - rM.b;
  // mapear E (em unidades de E₀, E = x²) e k em [-π/a, π/a] (mostramos 0..π reduzido)
  const kPath = useMemo(() => {
    // para cada x onde |lhs|≤1, calcular k = arccos(lhs)/a
    return lhsPts
      .filter((p) => Math.abs(p.lhs) <= 1)
      .map((p) => {
        const E = p.x * p.x;       // E/E₀
        const k = Math.acos(p.lhs); // ka in [0, π]
        return { E, k };
      });
  }, [lhsPts]);

  const Emax = xMax * xMax;
  const xR = (k) => rM.l + (k / Math.PI) * (rW * 0.5) + rW * 0.5; // centro ≈ 0
  const xRneg = (k) => rM.l + rW * 0.5 - (k / Math.PI) * (rW * 0.5);
  const yR = (E) => rM.t + ((Emax - E) / Emax) * rH;

  return (
    <div className="diagram-card">
      <h3>Modelo de Kronig-Penney — origem das bandas permitidas e proibidas</h3>

      <div className="effmass-controls">
        <div className="control-group" style={{ maxWidth: 320 }}>
          <label>Força do potencial P: <b>{P.toFixed(2)}</b></label>
          <input type="range" min="0.1" max="10" step="0.1"
                 value={P} onChange={(e) => setP(Number(e.target.value))} />
          <small style={{ color: '#94a3b8', fontSize: 11 }}>
            P = m·V₀·b·a/ℏ². P = 0 ⇒ elétron livre · P → ∞ ⇒ poços isolados
          </small>
        </div>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="kp-svg" role="img"
           aria-label="Modelo de Kronig-Penney">
        {/* ===================== Painel 1: V(x) ===================== */}
        <text x={split / 2} y={20} fill="#cbd5e1" fontSize="13"
              textAnchor="middle" fontWeight="600">
          Potencial periódico V(x) — rede 1D (modelo Kronig-Penney)
        </text>
        <line x1={30} y1={180} x2={split - 20} y2={180} stroke="#475569" />
        {/* poços e barreiras */}
        {Array.from({ length: periods }).map((_, i) => {
          const x0 = 30 + i * aWidth;
          return (
            <g key={i}>
              {/* poço (V=0) */}
              <line x1={x0} y1={180} x2={x0 + wellW} y2={180}
                    stroke="#22d3ee" strokeWidth="3" />
              {/* barreira (V=V0) */}
              <rect x={x0 + wellW} y={80} width={barrW} height={100}
                    fill="#fbbf24" opacity="0.25" stroke="#fbbf24" strokeWidth="1.5" />
              <line x1={x0 + wellW} y1={80} x2={x0 + wellW + barrW} y2={80}
                    stroke="#fbbf24" strokeWidth="3" />
              {/* período */}
              {i === 0 && (
                <>
                  <line x1={x0} y1={210} x2={x0 + aWidth} y2={210}
                        stroke="#94a3b8" strokeWidth="1" markerEnd="url(#arr-kp-r)" markerStart="url(#arr-kp-l)" />
                  <text x={x0 + aWidth / 2} y={225} fill="#94a3b8" fontSize="11"
                        textAnchor="middle">a + b = a (período)</text>
                </>
              )}
            </g>
          );
        })}
        <text x={30} y={75} fill="#fbbf24" fontSize="11">V₀</text>
        <text x={30} y={195} fill="#22d3ee" fontSize="11">0</text>
        <text x={split - 30} y={175} fill="#94a3b8" fontSize="11" textAnchor="end">x</text>

        {/* função de onda esquemática (Bloch) */}
        <path d={(() => {
          const pts = [];
          for (let xi = 30; xi <= split - 20; xi += 2) {
            const phase = (xi - 30) * 0.15;
            const env = 1; // envelope
            const ψ = 18 * env * Math.sin(phase) * Math.cos((xi - 30) * 0.04);
            pts.push(`${xi},${130 + ψ}`);
          }
          return 'M ' + pts.join(' L ');
        })()} fill="none" stroke="#a78bfa" strokeWidth="1.5" opacity="0.8" />
        <text x={split - 30} y={120} fill="#a78bfa" fontSize="11" textAnchor="end">
          ψ(x) = u(x)·e^(ikx)  — Bloch
        </text>

        {/* ===================== Painel 2: LHS(αa) ===================== */}
        <text x={split / 2} y={M.t - 10} fill="#cbd5e1" fontSize="13"
              textAnchor="middle" fontWeight="600">
          P·sin(αa)/(αa) + cos(αa) — bandas onde |LHS| ≤ 1
        </text>

        {/* faixa permitida [-1, 1] */}
        <rect x={M.l} y={yScale(1)} width={innerW} height={yScale(-1) - yScale(1)}
              fill="#22c55e" opacity="0.10" />
        <line x1={M.l} y1={yScale(1)} x2={M.l + innerW} y2={yScale(1)}
              stroke="#22c55e" strokeDasharray="4 3" />
        <line x1={M.l} y1={yScale(-1)} x2={M.l + innerW} y2={yScale(-1)}
              stroke="#22c55e" strokeDasharray="4 3" />
        <text x={M.l + 4} y={yScale(1) - 2} fill="#86efac" fontSize="10">+1</text>
        <text x={M.l + 4} y={yScale(-1) + 12} fill="#86efac" fontSize="10">−1</text>

        {/* eixo x */}
        <line x1={M.l} y1={yScale(0)} x2={M.l + innerW} y2={yScale(0)} stroke="#475569" />
        <line x1={M.l} y1={M.t} x2={M.l} y2={M.t + innerH} stroke="#475569" />

        {/* faixas verticais das bandas */}
        {bands.map(([s, e], i) => (
          <rect key={i} x={xScale(s)} y={M.t} width={xScale(e) - xScale(s)} height={innerH}
                fill="#22c55e" opacity="0.07" />
        ))}

        {/* curva LHS */}
        <path d={lhsPath} fill="none" stroke="#22d3ee" strokeWidth="2" />

        {/* ticks αa */}
        {[Math.PI, 2 * Math.PI, 3 * Math.PI, 4 * Math.PI].map((tk, i) => (
          <g key={i}>
            <line x1={xScale(tk)} y1={M.t + innerH} x2={xScale(tk)} y2={M.t + innerH + 4}
                  stroke="#64748b" />
            <text x={xScale(tk)} y={M.t + innerH + 16} fill="#94a3b8" fontSize="10"
                  textAnchor="middle">{i + 1}π</text>
          </g>
        ))}
        <text x={M.l + innerW / 2} y={H - 10} fill="#cbd5e1" fontSize="11"
              textAnchor="middle">αa = √(E/E₀)</text>

        {/* ===================== Painel 3: bandas E vs k ===================== */}
        <text x={rM.l + rW / 2} y={rM.t - 10} fill="#cbd5e1" fontSize="13"
              textAnchor="middle" fontWeight="600">
          Bandas resultantes E(k) — 1ª zona de Brillouin
        </text>

        {/* Faixa indicando bandas permitidas em E */}
        {bands.map(([s, e], i) => {
          const E1 = s * s;
          const E2 = e * e;
          return (
            <rect key={`b-${i}`}
                  x={rM.l} y={yR(E2)}
                  width={rW} height={yR(E1) - yR(E2)}
                  fill="#22c55e" opacity="0.10" />
          );
        })}
        {/* gaps em vermelho/amarelo */}
        {bands.length > 1 && bands.slice(1).map(([s], i) => {
          const Eprev = bands[i][1] * bands[i][1];
          const Ecur = s * s;
          return (
            <g key={`g-${i}`}>
              <rect x={rM.l} y={yR(Ecur)} width={rW} height={yR(Eprev) - yR(Ecur)}
                    fill="#ef4444" opacity="0.08" />
              <text x={rM.l + 6} y={(yR(Ecur) + yR(Eprev)) / 2} fill="#fca5a5" fontSize="10">
                gap
              </text>
            </g>
          );
        })}

        {/* eixo k */}
        <line x1={rM.l} y1={rM.t + rH} x2={rM.l + rW} y2={rM.t + rH} stroke="#475569" />
        <line x1={rM.l + rW / 2} y1={rM.t} x2={rM.l + rW / 2} y2={rM.t + rH}
              stroke="#1e293b" strokeDasharray="2 4" />

        {/* k = ±π/a no eixo */}
        <text x={rM.l} y={rM.t + rH + 16} fill="#94a3b8" fontSize="10">−π/a</text>
        <text x={rM.l + rW / 2} y={rM.t + rH + 16} fill="#94a3b8" fontSize="10"
              textAnchor="middle">0</text>
        <text x={rM.l + rW} y={rM.t + rH + 16} fill="#94a3b8" fontSize="10"
              textAnchor="end">+π/a</text>

        {/* Curvas E(k) — para cada banda, plotar (k, E) e (-k, E) */}
        {bands.map(([s, e], iBand) => {
          // pontos dessa banda
          const inBand = kPath.filter((p) => p.E >= s * s - 0.01 && p.E <= e * e + 0.01);
          if (inBand.length < 2) return null;
          const pos = inBand.map((p, i) => `${i === 0 ? 'M' : 'L'} ${xR(p.k).toFixed(1)} ${yR(p.E).toFixed(1)}`).join(' ');
          const neg = inBand.map((p, i) => `${i === 0 ? 'M' : 'L'} ${xRneg(p.k).toFixed(1)} ${yR(p.E).toFixed(1)}`).join(' ');
          const colors = ['#22d3ee', '#a78bfa', '#fbbf24', '#f472b6', '#34d399', '#fb923c'];
          const c = colors[iBand % colors.length];
          return (
            <g key={`band-${iBand}`}>
              <path d={pos} fill="none" stroke={c} strokeWidth="2" />
              <path d={neg} fill="none" stroke={c} strokeWidth="2" />
            </g>
          );
        })}

        <text x={rM.l + rW / 2} y={H - 10} fill="#cbd5e1" fontSize="11"
              textAnchor="middle">k</text>
        <text x={rM.l - 8} y={rM.t + rH / 2} fill="#cbd5e1" fontSize="11"
              transform={`rotate(-90 ${rM.l - 8} ${rM.t + rH / 2})`} textAnchor="middle">
          E (un. de E₀)
        </text>

        <defs>
          <marker id="arr-kp-l" viewBox="0 0 10 10" refX="1" refY="5"
                  markerWidth="5" markerHeight="5" orient="auto">
            <path d="M10,0 L0,5 L10,10 z" fill="#94a3b8" />
          </marker>
          <marker id="arr-kp-r" viewBox="0 0 10 10" refX="9" refY="5"
                  markerWidth="5" markerHeight="5" orient="auto">
            <path d="M0,0 L10,5 L0,10 z" fill="#94a3b8" />
          </marker>
        </defs>
      </svg>

      <div style={{ background: 'rgba(2,6,23,0.6)', padding: 12, borderRadius: 6, marginTop: 8 }}>
        <TeX block math={String.raw`\boxed{\;P\,\dfrac{\sin(\alpha a)}{\alpha a} + \cos(\alpha a) = \cos(k a)\;}\quad\text{com}\quad \alpha = \dfrac{\sqrt{2mE}}{\hbar},\quad P = \dfrac{m a V_0 b}{\hbar^2}`} />
      </div>

      <p className="diagram-caption">
        O modelo de <b>Kronig-Penney</b> resolve a equação de Schrödinger para um potencial periódico
        de poços e barreiras. O membro esquerdo da equação é uma função apenas de E; ele <b>oscila</b>
        e atravessa repetidamente a faixa [−1, +1]. Para que k seja real (i.e., onda de Bloch propagante)
        é necessário |LHS| ≤ 1 → estas faixas formam as <b>bandas permitidas</b>. Onde |LHS| &gt; 1,
        k torna-se complexo e a onda decai exponencialmente: são as <b>bandas proibidas (gaps)</b>.
        Aumentando P (potencial mais forte) os gaps se alargam e as bandas se estreitam,
        reproduzindo o limite de átomos isolados.
      </p>
    </div>
  );
}
