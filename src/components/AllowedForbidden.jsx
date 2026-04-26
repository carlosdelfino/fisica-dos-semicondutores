import { useState } from 'react';

/**
 * Visualização didática das bandas permitidas e proibidas em escala completa
 * (núcleo → bandas internas → 3p, 3s → 4ª banda etc.) mostrando claramente
 * os conceitos de "allowed energy band" e "forbidden energy band".
 */
export default function AllowedForbidden() {
  const [hover, setHover] = useState(null);

  const W = 760, H = 460;

  // Estrutura típica de um cristal semicondutor (esquemático, baseado em Si)
  // Largura proporcional à densidade de estados típica.
  const bands = [
    { id: 'core',  E: [-12, -10], type: 'allowed',   label: 'Banda 1s (núcleo)',     fill: '🟦', color: '#0c4a6e' },
    { id: 'g1',    E: [-10,  -7], type: 'forbidden', label: 'Gap 1',                  color: '#facc15' },
    { id: 'b2s',   E: [-7,   -4], type: 'allowed',   label: 'Banda 2s/2p',            color: '#0369a1' },
    { id: 'g2',    E: [-4,   -2], type: 'forbidden', label: 'Gap 2',                  color: '#facc15' },
    { id: 'bv',    E: [-2,    0], type: 'allowed',   label: 'Banda de Valência (BV)', color: '#dc2626', highlight: true },
    { id: 'gap',   E: [ 0, 1.12], type: 'forbidden', label: 'Banda Proibida (Eg)',    color: '#fbbf24', highlight: true },
    { id: 'bc',    E: [1.12, 5],  type: 'allowed',   label: 'Banda de Condução (BC)', color: '#0ea5e9', highlight: true },
    { id: 'g3',    E: [5,    7],  type: 'forbidden', label: 'Gap superior',           color: '#facc15' },
    { id: 'b4',    E: [7,    11], type: 'allowed',   label: 'Bandas superiores',      color: '#22d3ee' },
  ];

  const Emin = -13, Emax = 12;
  const M = { l: 80, t: 30, b: 50, r: 20 };
  const innerH = H - M.t - M.b;
  const yScale = (E) => M.t + ((Emax - E) / (Emax - Emin)) * innerH;

  // largura da banda = densidade de estados ilustrativa
  const bandX = M.l + 100;
  const bandW = 220;

  return (
    <div className="diagram-card">
      <h3>Bandas Permitidas vs Bandas Proibidas — visão completa do cristal</h3>
      <svg viewBox={`0 0 ${W} ${H}`} className="ab-svg" role="img"
           aria-label="Bandas permitidas e proibidas">
        {/* eixo E */}
        <line x1={M.l} y1={M.t} x2={M.l} y2={H - M.b} stroke="#475569" />
        <text x={M.l - 50} y={M.t + 14} fill="#cbd5e1" fontSize="12">E (eV)</text>
        {[-12, -8, -4, 0, 4, 8, 12].map((E) => (
          <g key={E}>
            <line x1={M.l - 4} y1={yScale(E)} x2={M.l} y2={yScale(E)} stroke="#64748b" />
            <text x={M.l - 8} y={yScale(E) + 4} fill="#94a3b8" fontSize="10" textAnchor="end">
              {E}
            </text>
          </g>
        ))}

        {/* Faixas */}
        {bands.map((b) => {
          const y1 = yScale(b.E[1]);
          const y2 = yScale(b.E[0]);
          const isAllowed = b.type === 'allowed';
          const opacity = b.highlight ? 0.45 : 0.25;
          return (
            <g key={b.id}
               onMouseEnter={() => setHover(b.id)}
               onMouseLeave={() => setHover(null)}
               style={{ cursor: 'pointer' }}>
              {isAllowed ? (
                <rect x={bandX} y={y1} width={bandW} height={y2 - y1}
                      fill={b.color} opacity={hover === b.id ? 0.75 : opacity}
                      stroke={b.color} strokeWidth={b.highlight ? 1.5 : 0.8} />
              ) : (
                <g>
                  <rect x={bandX} y={y1} width={bandW} height={y2 - y1}
                        fill="url(#hatch)" opacity={hover === b.id ? 0.6 : 0.35} />
                  <rect x={bandX} y={y1} width={bandW} height={y2 - y1}
                        fill="none" stroke={b.color} strokeWidth="1"
                        strokeDasharray="4 3" />
                </g>
              )}
              {/* preenchimento de elétrons (apenas em bandas abaixo de Ev) */}
              {isAllowed && b.E[1] <= 0 && (
                Array.from({ length: 8 }).map((_, i) => (
                  <circle key={i}
                          cx={bandX + 20 + (i * 25) % (bandW - 40)}
                          cy={y1 + 6 + ((i * 13) % (y2 - y1 - 12))}
                          r="2.5" fill="#7dd3fc" />
                ))
              )}
              {/* Banda de valência preenchida */}
              {b.id === 'bv' && (
                Array.from({ length: 14 }).map((_, i) => (
                  <circle key={i}
                          cx={bandX + 15 + (i * 15) % (bandW - 30)}
                          cy={y1 + 4 + ((i * 9) % (y2 - y1 - 8))}
                          r="2.5" fill="#fca5a5" />
                ))
              )}
              {/* Banda de condução praticamente vazia, com poucos elétrons térmicos */}
              {b.id === 'bc' && (
                Array.from({ length: 3 }).map((_, i) => (
                  <circle key={i}
                          cx={bandX + 30 + i * 70}
                          cy={y1 + 8}
                          r="3" fill="#0ea5e9" />
                ))
              )}

              {/* rótulo */}
              <text x={bandX + bandW + 12} y={(y1 + y2) / 2 + 4}
                    fill={b.color} fontSize="11" fontWeight={b.highlight ? 700 : 400}>
                {b.label}
                {b.id === 'gap' && ` = ${(b.E[1] - b.E[0]).toFixed(2)} eV`}
              </text>
            </g>
          );
        })}

        {/* Pattern para banda proibida */}
        <defs>
          <pattern id="hatch" patternUnits="userSpaceOnUse" width="6" height="6">
            <rect width="6" height="6" fill="#1e293b" />
            <path d="M0,6 l6,-6 M-1,1 l2,-2 M5,7 l2,-2"
                  stroke="#facc15" strokeWidth="0.6" opacity="0.7" />
          </pattern>
        </defs>

        {/* anotações laterais com setas */}
        <g transform="translate(550, 50)">
          <text x="0" y="0" fill="#7dd3fc" fontSize="12" fontWeight="600">
            Banda Permitida
          </text>
          <text x="0" y="16" fill="#cbd5e1" fontSize="11">
            estados quânticos que o
          </text>
          <text x="0" y="30" fill="#cbd5e1" fontSize="11">
            elétron pode ocupar
          </text>
        </g>
        <g transform="translate(550, 120)">
          <text x="0" y="0" fill="#fbbf24" fontSize="12" fontWeight="600">
            Banda Proibida
          </text>
          <text x="0" y="16" fill="#cbd5e1" fontSize="11">
            sem estados (k complexo
          </text>
          <text x="0" y="30" fill="#cbd5e1" fontSize="11">
            no Kronig-Penney)
          </text>
        </g>

        {/* legenda */}
        <g transform={`translate(${M.l}, ${H - 30})`}>
          <rect x="0" y="0" width="14" height="10" fill="#0ea5e9" opacity="0.45" />
          <text x="20" y="9" fill="#bae6fd" fontSize="11">banda permitida</text>
          <rect x="180" y="0" width="14" height="10" fill="url(#hatch)" />
          <text x="200" y="9" fill="#fde68a" fontSize="11">banda proibida (gap)</text>
          <circle cx="356" cy="5" r="3" fill="#fca5a5" />
          <text x="364" y="9" fill="#fecaca" fontSize="11">elétrons</text>
          <circle cx="430" cy="5" r="3" fill="#0ea5e9" />
          <text x="438" y="9" fill="#7dd3fc" fontSize="11">elétron térmico em BC</text>
        </g>
      </svg>
      <p className="diagram-caption">
        Em um cristal real, os níveis discretos de átomos isolados se desdobram em <b>bandas permitidas</b>
        separadas por <b>bandas proibidas</b>. Apenas a banda de valência (BV) e a banda de condução (BC)
        determinam as propriedades elétricas do semicondutor. A 0 K, BV está totalmente cheia e BC totalmente
        vazia: o material seria isolante. Excitação térmica acima de 0 K promove elétrons à BC, deixando
        lacunas em BV.
      </p>
    </div>
  );
}
