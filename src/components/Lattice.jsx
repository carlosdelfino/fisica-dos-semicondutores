import { useMemo } from 'react';

/**
 * Rede 2D simplificada de Si (4 ligações covalentes por átomo).
 * Renderiza dopantes em posições escolhidas (P para tipo-n, B para tipo-p).
 *
 * Props:
 *  - type: 'intrinsic' | 'n' | 'p'
 *  - rows, cols
 */
export default function Lattice({ type, rows = 5, cols = 7 }) {
  const W = 760, H = 380;
  const cellW = (W - 80) / (cols - 1);
  const cellH = (H - 80) / (rows - 1);
  const offX = 40, offY = 40;

  // Posições de dopantes
  const dopants = useMemo(() => {
    if (type === 'intrinsic') return [];
    const list = [];
    // distribuir 2 dopantes
    const positions = [
      [Math.floor(rows / 2), Math.floor(cols / 2)],
      [Math.floor(rows / 2) - 1, Math.floor(cols / 2) + 2],
    ];
    positions.forEach(([r, c]) => list.push({ r, c }));
    return list;
  }, [type, rows, cols]);

  const isDopant = (r, c) => dopants.some((d) => d.r === r && d.c === c);

  const symbol = type === 'n' ? 'P' : type === 'p' ? 'B' : 'Si';
  const dopantColor = type === 'n' ? '#22c55e' : '#a855f7';

  return (
    <div className="diagram-card">
      <h3>Rede Cristalina do Silício {type !== 'intrinsic' && `+ ${type === 'n' ? 'Fósforo (5 elétrons de valência)' : 'Boro (3 elétrons de valência)'}`}</h3>
      <svg viewBox={`0 0 ${W} ${H}`} className="lattice-svg" role="img"
           aria-label="Rede cristalina 2D do silício">
        <defs>
          <radialGradient id="si-grad">
            <stop offset="0%" stopColor="#fef3c7" />
            <stop offset="100%" stopColor="#d97706" />
          </radialGradient>
          <radialGradient id="dopant-grad-n">
            <stop offset="0%" stopColor="#bbf7d0" />
            <stop offset="100%" stopColor="#15803d" />
          </radialGradient>
          <radialGradient id="dopant-grad-p">
            <stop offset="0%" stopColor="#e9d5ff" />
            <stop offset="100%" stopColor="#7e22ce" />
          </radialGradient>
        </defs>

        {/* Ligações */}
        {Array.from({ length: rows }).flatMap((_, r) =>
          Array.from({ length: cols }).flatMap((_, c) => {
            const x = offX + c * cellW;
            const y = offY + r * cellH;
            const lines = [];
            if (c < cols - 1) {
              lines.push(<line key={`h-${r}-${c}`} x1={x} y1={y}
                               x2={x + cellW} y2={y} stroke="#64748b" strokeWidth="1.5" />);
              lines.push(<line key={`h2-${r}-${c}`} x1={x} y1={y + 4}
                               x2={x + cellW} y2={y + 4} stroke="#64748b" strokeWidth="1" opacity="0.6" />);
            }
            if (r < rows - 1) {
              lines.push(<line key={`v-${r}-${c}`} x1={x} y1={y}
                               x2={x} y2={y + cellH} stroke="#64748b" strokeWidth="1.5" />);
              lines.push(<line key={`v2-${r}-${c}`} x1={x + 4} y1={y}
                               x2={x + 4} y2={y + cellH} stroke="#64748b" strokeWidth="1" opacity="0.6" />);
            }
            return lines;
          })
        )}

        {/* Átomos */}
        {Array.from({ length: rows }).flatMap((_, r) =>
          Array.from({ length: cols }).map((_, c) => {
            const x = offX + c * cellW;
            const y = offY + r * cellH;
            const dop = isDopant(r, c);
            return (
              <g key={`a-${r}-${c}`}>
                <circle cx={x} cy={y} r="18"
                        fill={dop ? `url(#dopant-grad-${type})` : 'url(#si-grad)'}
                        stroke={dop ? dopantColor : '#92400e'} strokeWidth="2" />
                <text x={x} y={y + 4} fontSize="13" fontWeight="700"
                      fill="#1e1b4b" textAnchor="middle">
                  {dop ? symbol : 'Si'}
                </text>
              </g>
            );
          })
        )}

        {/* Elétron extra (tipo-n) ou lacuna (tipo-p) */}
        {dopants.map((d, i) => {
          const x = offX + d.c * cellW;
          const y = offY + d.r * cellH;
          if (type === 'n') {
            return (
              <g key={`free-${i}`}>
                <circle cx={x + 28} cy={y - 22} r="5" fill="#0ea5e9" stroke="#0c4a6e">
                  <animate attributeName="cx" values={`${x + 28};${x + 90};${x + 28}`}
                           dur="3s" repeatCount="indefinite" />
                  <animate attributeName="cy" values={`${y - 22};${y - 60};${y - 22}`}
                           dur="3s" repeatCount="indefinite" />
                </circle>
                <text x={x + 28} y={y - 30} fontSize="9" fill="#7dd3fc" textAnchor="middle">e⁻</text>
              </g>
            );
          }
          if (type === 'p') {
            return (
              <g key={`hole-${i}`}>
                <circle cx={x + 28} cy={y + 28} r="5" fill="none"
                        stroke="#ef4444" strokeWidth="2" strokeDasharray="2 2">
                  <animate attributeName="cx" values={`${x + 28};${x + 90};${x + 28}`}
                           dur="3.5s" repeatCount="indefinite" />
                </circle>
                <text x={x + 28} y={y + 46} fontSize="9" fill="#fca5a5" textAnchor="middle">h⁺</text>
              </g>
            );
          }
          return null;
        })}

        {/* Legenda */}
        <g transform="translate(20, 10)">
          <text fill="#cbd5e1" fontSize="11">
            {type === 'intrinsic' && 'Cristal puro: 4 ligações covalentes por átomo de Si, sem portadores livres a 0 K.'}
            {type === 'n' && 'P possui 5 elétrons de valência: 4 formam ligações, 1 fica fracamente ligado e ioniza-se à temperatura ambiente.'}
            {type === 'p' && 'B possui 3 elétrons de valência: faltam ligações ⇒ surge um estado vazio (lacuna) que aceita elétrons da BV.'}
          </text>
        </g>
      </svg>
      <p className="diagram-caption">
        Visualização esquemática 2D da estrutura tetraédrica do Si. Linhas duplas representam ligações covalentes
        compartilhando dois elétrons.
      </p>
    </div>
  );
}
