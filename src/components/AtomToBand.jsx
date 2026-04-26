import { useState, useMemo } from 'react';

/**
 * Mostra como os níveis discretos de energia de átomos isolados se desdobram
 * em bandas de energia permitidas conforme N átomos se aproximam para formar
 * um cristal. É a justificativa física da existência das bandas.
 *
 *   r → ∞ : todos os átomos isolados → níveis 1s, 2s, 2p, 3s, 3p degenerados
 *   r → r₀ : superposição de funções de onda → cada nível desdobra-se em N
 *           sub-níveis muito próximos, formando uma "banda".
 *
 * A largura da banda cresce ~ exp(-r/r₀) e os níveis externos (3s, 3p) se
 * desdobram primeiro porque suas funções de onda têm maior alcance.
 */
export default function AtomToBand() {
  const [r, setR] = useState(0.5); // separação interatômica relativa (1 = isolado, 0 = cristal)
  const [N, setN] = useState(8);   // número de átomos

  const W = 760, H = 480;
  const M = { l: 80, t: 30, r: 200, b: 60 };
  const innerW = W - M.l - M.r;
  const innerH = H - M.t - M.b;

  // Níveis atômicos típicos (eV abaixo do vácuo, valores ilustrativos para Si)
  // Os mais externos (3s, 3p) dão origem à BV e BC.
  const levels = [
    { id: '1s', E: -1839, color: '#475569', name: '1s', tightness: 0.05 }, // núcleo
    { id: '2s', E: -154,  color: '#64748b', name: '2s', tightness: 0.08 },
    { id: '2p', E: -107,  color: '#64748b', name: '2p', tightness: 0.10 },
    { id: '3s', E: -14.0, color: '#ef4444', name: '3s (BV)', tightness: 0.55 },
    { id: '3p', E: -8.0,  color: '#0ea5e9', name: '3p (BC)', tightness: 0.70 },
  ];

  // Eixo Y: energia em escala mista (log-like) para acomodar -1800 e -8 simultaneamente
  // Mapeamos ranges arbitrariamente para visualização clara
  const yMap = (E) => {
    // mapeamento por faixas
    if (E < -500)  return M.t + innerH * 0.85 + (E + 1839) / 4000 * 20; // núcleo
    if (E < -50)   return M.t + innerH * 0.65 + (E + 154) / 100 * (innerH * 0.10);
    if (E < -20)   return M.t + innerH * 0.50 + (E + 50)  / 50  * (innerH * 0.08);
    return M.t + innerH * 0.10 + (E + 8) / 6 * (innerH * 0.30);
  };

  // r vai de 0 (cristal compacto) a 1 (isolado).
  // Largura da banda em função de r e da "tightness" do nível
  // bandwidth ∝ tightness * (1 - r)^2  → 0 quando isolado
  const splitData = useMemo(() => {
    return levels.map((lv) => {
      const isolation = Math.max(r, 0.001);
      const overlap = Math.exp(-isolation * (8 - lv.tightness * 10)); // overlap exponencial
      const bandwidth = lv.tightness * 8 * (1 - isolation) ** 1.5; // largura em eV
      // calculamos N níveis distribuídos uniformemente entre E - bw/2 e E + bw/2
      const sublevels = [];
      for (let i = 0; i < N; i++) {
        const frac = N === 1 ? 0.5 : i / (N - 1);
        const dE = (frac - 0.5) * bandwidth;
        sublevels.push(lv.E + dE);
      }
      return { ...lv, bandwidth, sublevels, overlap };
    });
  }, [r, N]);

  // posição x para a separação (linha vertical)
  const xR = M.l + (1 - r) * innerW * 0.85; // posição do "snapshot" atual

  return (
    <div className="diagram-card">
      <h3>Átomos isolados → Cristal: como as bandas surgem</h3>

      <div className="effmass-controls">
        <div className="control-group">
          <label>Separação interatômica r/r₀: <b>{r.toFixed(2)}</b></label>
          <input type="range" min="0" max="1" step="0.01"
                 value={r} onChange={(e) => setR(Number(e.target.value))} />
          <small style={{ color: '#94a3b8', fontSize: 11 }}>
            r = 1: átomos isolados &nbsp;|&nbsp; r = 0: cristal compacto
          </small>
        </div>
        <div className="control-group">
          <label>Número de átomos N: <b>{N}</b></label>
          <input type="range" min="2" max="40" step="1"
                 value={N} onChange={(e) => setN(Number(e.target.value))} />
          <small style={{ color: '#94a3b8', fontSize: 11 }}>
            Em um cristal real N ~ 10²³, formando um continuum aparente.
          </small>
        </div>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="atb-svg" role="img"
           aria-label="Separação dos níveis atômicos em bandas de energia">
        {/* Eixo Y (energia) */}
        <line x1={M.l} y1={M.t} x2={M.l} y2={M.t + innerH} stroke="#475569" />
        <text x={M.l - 50} y={M.t + 14} fill="#cbd5e1" fontSize="12">E (eV)</text>

        {/* Eixo X (1-r) */}
        <line x1={M.l} y1={M.t + innerH} x2={M.l + innerW} y2={M.t + innerH} stroke="#475569" />
        <text x={M.l + innerW / 2} y={H - 12} fill="#cbd5e1" fontSize="12" textAnchor="middle">
          ← maior aproximação (cristal) ────────── separação interatômica r ────────── átomos isolados →
        </text>

        {/* Linha vertical da posição atual */}
        <line x1={xR} y1={M.t} x2={xR} y2={M.t + innerH}
              stroke="#facc15" strokeWidth="2" strokeDasharray="4 3" opacity="0.7" />
        <text x={xR + 4} y={M.t + 14} fill="#facc15" fontSize="11">r atual</text>

        {/* Para cada nível, desenhar a "trompete" mostrando como o nível se abre em banda */}
        {splitData.map((lv) => {
          const yC = yMap(lv.E);
          // contorno superior e inferior da banda em função da separação
          const N_PROBE = 60;
          const upper = [];
          const lower = [];
          for (let i = 0; i <= N_PROBE; i++) {
            const rProbe = i / N_PROBE; // 0 a 1
            const bw = lv.tightness * 8 * (1 - rProbe) ** 1.5;
            const x = M.l + (1 - rProbe) * innerW * 0.85;
            // Mapear bw em eV para deslocamento y (use o mesmo yMap)
            const yU = yMap(lv.E + bw / 2);
            const yL = yMap(lv.E - bw / 2);
            upper.push(`${x.toFixed(1)},${yU.toFixed(1)}`);
            lower.push(`${x.toFixed(1)},${yL.toFixed(1)}`);
          }
          // Banda permitida (área)
          const path = `M ${upper.join(' L ')} L ${lower.reverse().join(' L ')} Z`;

          return (
            <g key={lv.id}>
              <path d={path} fill={lv.color} opacity="0.18" />
              {/* linha central (energia atômica) */}
              <line x1={M.l + innerW * 0.85} y1={yC}
                    x2={M.l + innerW * 0.85 + 60} y2={yC}
                    stroke={lv.color} strokeWidth="2" />
              <text x={M.l + innerW * 0.85 + 66} y={yC + 4}
                    fill={lv.color} fontSize="11" fontWeight="600">
                {lv.name}
              </text>

              {/* sub-níveis discretos na posição r atual */}
              {lv.sublevels.map((E, i) => (
                <line key={i}
                      x1={xR - 24} y1={yMap(E)}
                      x2={xR + 24} y2={yMap(E)}
                      stroke={lv.color} strokeWidth="1.2" opacity="0.85" />
              ))}

              {/* anotação da largura da banda */}
              {lv.bandwidth > 0.05 && (
                <text x={xR + 30} y={yMap(lv.E) + 3}
                      fill={lv.color} fontSize="9">
                  Δ = {lv.bandwidth.toFixed(2)} eV
                </text>
              )}
            </g>
          );
        })}

        {/* Banda proibida em destaque entre 3s e 3p */}
        {(() => {
          const bv = splitData.find((l) => l.id === '3s');
          const bc = splitData.find((l) => l.id === '3p');
          if (!bv || !bc) return null;
          const yTopBV = yMap(bv.E + bv.bandwidth / 2);
          const yBotBC = yMap(bc.E - bc.bandwidth / 2);
          const gap = (bc.E - bc.bandwidth / 2) - (bv.E + bv.bandwidth / 2);
          if (gap <= 0.1) return null;
          return (
            <g>
              <rect x={xR - 30} y={yBotBC} width={60} height={yTopBV - yBotBC}
                    fill="url(#hatch-gap)" opacity="0.5" />
              <text x={xR + 35} y={(yTopBV + yBotBC) / 2 + 3}
                    fill="#fbbf24" fontSize="10">
                Eg ≈ {gap.toFixed(2)} eV
              </text>
            </g>
          );
        })()}

        {/* Anotações didáticas */}
        <text x={M.l + 8} y={M.t + 18} fill="#cbd5e1" fontSize="11">
          {r > 0.85
            ? 'Átomos isolados: níveis discretos degenerados.'
            : r > 0.4
              ? 'Funções de onda começam a se sobrepor → níveis se desdobram.'
              : 'Cristal: N níveis quase contínuos formam uma banda permitida.'}
        </text>

        {/* Pictograma de átomos */}
        <g transform={`translate(${M.l + innerW * 0.85 + 110}, ${M.t + innerH - 60})`}>
          <text x="0" y="-6" fill="#94a3b8" fontSize="10">átomo isolado</text>
          <circle cx="14" cy="14" r="12" fill="none" stroke="#fbbf24" strokeWidth="1.5" />
          <circle cx="14" cy="14" r="6"  fill="none" stroke="#fbbf24" strokeWidth="1" opacity="0.6" />
          <circle cx="14" cy="14" r="3"  fill="#fbbf24" />
        </g>
        <g transform={`translate(${M.l + 30}, ${M.t + innerH - 60})`}>
          <text x="0" y="-6" fill="#94a3b8" fontSize="10">cristal compacto</text>
          {[0, 1, 2, 3].map((i) => (
            <g key={i} transform={`translate(${i * 22}, 0)`}>
              <circle cx="10" cy="14" r="8" fill="none" stroke="#fbbf24" strokeWidth="1" />
              <circle cx="10" cy="14" r="3" fill="#fbbf24" />
            </g>
          ))}
        </g>

        <defs>
          <pattern id="hatch-gap" patternUnits="userSpaceOnUse" width="6" height="6">
            <rect width="6" height="6" fill="#1e293b" />
            <path d="M0,6 l6,-6" stroke="#fbbf24" strokeWidth="0.6" />
          </pattern>
        </defs>
      </svg>

      <p className="diagram-caption">
        Quando N átomos se aproximam, o <b>princípio de exclusão de Pauli</b> impede que dois elétrons
        ocupem o mesmo estado quântico. Os níveis discretos de cada átomo precisam então
        se separar em N sub-níveis distintos, formando uma <b>banda de energia permitida</b>
        com largura típica de alguns eV. Os níveis internos (1s, 2s, 2p) quase não se desdobram
        porque suas funções de onda estão localizadas perto do núcleo. Os níveis externos (3s, 3p)
        têm grande sobreposição e formam respectivamente a <b>BV</b> (3s + parte de 3p) e a <b>BC</b>
        (parte superior de 3p). Entre elas surge a <b>banda proibida</b> de largura E_g ≈ 1.12 eV (Si).
      </p>
    </div>
  );
}
