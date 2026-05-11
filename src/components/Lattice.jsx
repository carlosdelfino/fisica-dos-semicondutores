import { useMemo } from 'react';
import { MATERIALS } from '../physics/materials.js';

/**
 * Rede 2D simplificada de semicondutores (4 ligações covalentes por átomo).
 * Renderiza dopantes em posições escolhidas conforme o material e tipo.
 *
 * Props:
 *  - material: 'Si' | 'Ge' | 'GaAs' | 'GaN' | 'SiC'
 *  - type: 'intrinsic' | 'n' | 'p'
 *  - rows, cols
 */
// Estruturas atômicas/moleculares por material.
// Para compostos (GaAs, SiC), os dois átomos alternam em padrão de tabuleiro.
const LATTICE_SITES = {
  Si:   { A: { symbol: 'Si', grad: 'si-grad',   stroke: '#92400e' }, B: null },
  Ge:   { A: { symbol: 'Ge', grad: 'ge-grad',   stroke: '#4338ca' }, B: null },
  GaAs: { A: { symbol: 'Ga', grad: 'ga-grad',   stroke: '#9f1239' },
          B: { symbol: 'As', grad: 'as-grad',   stroke: '#365314' } },
  GaN:  { A: { symbol: 'Ga', grad: 'ga-grad',   stroke: '#9f1239' },
          B: { symbol: 'N',  grad: 'n-grad',    stroke: '#1e3a8a' } },
  SiC:  { A: { symbol: 'Si', grad: 'si-grad',   stroke: '#92400e' },
          B: { symbol: 'C',  grad: 'c-grad',    stroke: '#1f2937' } },
};

// Em qual sítio (paridade r+c) o dopante substitui o átomo da rede.
// 0 = sítio A (par); 1 = sítio B (ímpar).
const DOPANT_SITE = {
  Si:   { n: 0, p: 0 },
  Ge:   { n: 0, p: 0 },
  GaAs: { n: 0, p: 0 }, // Si (em sítio Ga) e Zn (em sítio Ga)
  GaN:  { n: 0, p: 0 }, // Si (em sítio Ga) e Mg (em sítio Ga)
  SiC:  { n: 1, p: 0 }, // N em sítio do C; Al em sítio do Si
};

export default function Lattice({ material = 'Si', type, rows = 5, cols = 7 }) {
  const mat = MATERIALS[material] || MATERIALS.Si;
  const sites = LATTICE_SITES[material] || LATTICE_SITES.Si;
  const isCompound = !!sites.B;
  const W = 760, H = 380;
  const cellW = (W - 80) / (cols - 1);
  const cellH = (H - 80) / (rows - 1);
  const offX = 40, offY = 40;

  // Posições de dopantes (no sítio correto de acordo com o material)
  const dopants = useMemo(() => {
    if (type === 'intrinsic') return [];
    const targetParity = DOPANT_SITE[material]?.[type] ?? 0;
    const candidates = [
      [Math.floor(rows / 2), Math.floor(cols / 2)],
      [Math.floor(rows / 2) - 1, Math.floor(cols / 2) + 2],
    ];
    return candidates.map(([r, c]) => {
      // Ajusta coluna para garantir paridade correta (sítio do dopante)
      if (((r + c) % 2) !== targetParity) c += 1;
      return { r, c };
    });
  }, [type, rows, cols, material]);

  const isDopant = (r, c) => dopants.some((d) => d.r === r && d.c === c);

  // Ligações com elétron faltante (uma por dopante aceitador).
  // Cada ligação é identificada pelo átomo (r,c) proprietário e a direção
  // 'right' (com vizinho à direita) ou 'down' (com vizinho abaixo).
  const deficientBonds = useMemo(() => {
    if (type !== 'p') return [];
    return dopants.map((d) => {
      if (d.c < cols - 1) return { r: d.r, c: d.c, dir: 'right' };
      if (d.r < rows - 1) return { r: d.r, c: d.c, dir: 'down' };
      if (d.c > 0)        return { r: d.r, c: d.c - 1, dir: 'right' };
      return { r: d.r - 1, c: d.c, dir: 'down' };
    });
  }, [type, dopants, rows, cols]);
  const isDeficient = (r, c, dir) => deficientBonds.some((b) => b.r === r && b.c === c && b.dir === dir);
  // No lado da ligação em que falta o elétron (mais próximo do dopante aceitador)
  const deficientNearDopant = (r, c, dir) => {
    const b = deficientBonds.find((b) => b.r === r && b.c === c && b.dir === dir);
    if (!b) return false;
    // Se o dopante é o próprio (r,c), falta elétron no lado próximo dele (1/3);
    // senão (dopante é o vizinho do outro lado), falta elétron a 2/3.
    return dopants.some((d) => d.r === r && d.c === c);
  };

  // Símbolo/aparência do átomo da rede na posição (r,c)
  const siteAt = (r, c) => (isCompound && (r + c) % 2 === 1 ? sites.B : sites.A);
  const dopantSymbol = type === 'n' ? mat.dopants?.donor?.symbol || 'P' : type === 'p' ? mat.dopants?.acceptor?.symbol || 'B' : '';
  const dopantColor = type === 'n' ? '#22c55e' : '#a855f7';
  const ATOM_R = 16; // raio reduzido em ~10% (de 18 para 16)

  return (
    <div className="diagram-card">
      <h3>Rede Cristalina do {mat.name} {type !== 'intrinsic' && `+ ${type === 'n' ? mat.dopants.donor.name : mat.dopants.acceptor.name}`}</h3>
      <svg viewBox={`0 0 ${W} ${H}`} className="lattice-svg" role="img"
           aria-label={`Rede cristalina 2D do ${mat.name}`}>
        <defs>
          <radialGradient id="si-grad">
            <stop offset="0%" stopColor="#fef3c7" />
            <stop offset="100%" stopColor="#d97706" />
          </radialGradient>
          <radialGradient id="ge-grad">
            <stop offset="0%" stopColor="#e0e7ff" />
            <stop offset="100%" stopColor="#4338ca" />
          </radialGradient>
          <radialGradient id="ga-grad">
            <stop offset="0%" stopColor="#ffe4e6" />
            <stop offset="100%" stopColor="#be123c" />
          </radialGradient>
          <radialGradient id="as-grad">
            <stop offset="0%" stopColor="#ecfccb" />
            <stop offset="100%" stopColor="#4d7c0f" />
          </radialGradient>
          <radialGradient id="c-grad">
            <stop offset="0%" stopColor="#e5e7eb" />
            <stop offset="100%" stopColor="#111827" />
          </radialGradient>
          <radialGradient id="n-grad">
            <stop offset="0%" stopColor="#dbeafe" />
            <stop offset="100%" stopColor="#1e3a8a" />
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

        {/* Ligações covalentes: linha + par de elétrons compartilhados (2 pontos). */}
        {/* Em uma ligação adjacente a um dopante aceitador, falta 1 elétron (lacuna). */}
        {Array.from({ length: rows }).flatMap((_, r) =>
          Array.from({ length: cols }).flatMap((_, c) => {
            const x = offX + c * cellW;
            const y = offY + r * cellH;
            const items = [];
            // Ligação horizontal (vizinho à direita)
            if (c < cols - 1) {
              const def = isDeficient(r, c, 'right');
              const nearOwner = deficientNearDopant(r, c, 'right');
              const e1x = x + cellW / 3;
              const e2x = x + (2 * cellW) / 3;
              items.push(<line key={`h-${r}-${c}`} x1={x} y1={y}
                               x2={x + cellW} y2={y} stroke="#64748b" strokeWidth="1.5" />);
              // Elétron 1 (lado do átomo (r,c))
              if (!(def && nearOwner)) {
                items.push(<circle key={`eh1-${r}-${c}`} cx={e1x} cy={y} r="2.6"
                                   fill="#0ea5e9" stroke="#0c4a6e" strokeWidth="0.5" />);
              }
              // Elétron 2 (lado do vizinho)
              if (!(def && !nearOwner)) {
                items.push(<circle key={`eh2-${r}-${c}`} cx={e2x} cy={y} r="2.6"
                                   fill="#0ea5e9" stroke="#0c4a6e" strokeWidth="0.5" />);
              }
              // Marca da lacuna onde falta elétron
              if (def) {
                const hx = nearOwner ? e1x : e2x;
                items.push(<circle key={`hh-${r}-${c}`} cx={hx} cy={y} r="3.2"
                                   fill="none" stroke="#ef4444" strokeWidth="1.2"
                                   strokeDasharray="2 1.5" />);
              }
            }
            // Ligação vertical (vizinho abaixo)
            if (r < rows - 1) {
              const def = isDeficient(r, c, 'down');
              const nearOwner = deficientNearDopant(r, c, 'down');
              const e1y = y + cellH / 3;
              const e2y = y + (2 * cellH) / 3;
              items.push(<line key={`v-${r}-${c}`} x1={x} y1={y}
                               x2={x} y2={y + cellH} stroke="#64748b" strokeWidth="1.5" />);
              if (!(def && nearOwner)) {
                items.push(<circle key={`ev1-${r}-${c}`} cx={x} cy={e1y} r="2.6"
                                   fill="#0ea5e9" stroke="#0c4a6e" strokeWidth="0.5" />);
              }
              if (!(def && !nearOwner)) {
                items.push(<circle key={`ev2-${r}-${c}`} cx={x} cy={e2y} r="2.6"
                                   fill="#0ea5e9" stroke="#0c4a6e" strokeWidth="0.5" />);
              }
              if (def) {
                const hy = nearOwner ? e1y : e2y;
                items.push(<circle key={`hv-${r}-${c}`} cx={x} cy={hy} r="3.2"
                                   fill="none" stroke="#ef4444" strokeWidth="1.2"
                                   strokeDasharray="2 1.5" />);
              }
            }
            return items;
          })
        )}

        {/* Átomos */}
        {Array.from({ length: rows }).flatMap((_, r) =>
          Array.from({ length: cols }).map((_, c) => {
            const x = offX + c * cellW;
            const y = offY + r * cellH;
            const dop = isDopant(r, c);
            const site = siteAt(r, c);
            return (
              <g key={`a-${r}-${c}`}>
                <circle cx={x} cy={y} r={ATOM_R}
                        fill={dop ? `url(#dopant-grad-${type})` : `url(#${site.grad})`}
                        stroke={dop ? dopantColor : site.stroke} strokeWidth="2" />
                <text x={x} y={y + 4} fontSize="13" fontWeight="700"
                      fill="#1e1b4b" textAnchor="middle">
                  {dop ? dopantSymbol : site.symbol}
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
            {type === 'intrinsic' && `Cristal puro de ${mat.name}: 4 ligações covalentes por átomo, sem portadores livres a 0 K.`}
            {type === 'n' && `${dopantSymbol} é dopante doador: fornece elétron extra que ioniza-se à temperatura ambiente.`}
            {type === 'p' && `${dopantSymbol} é dopante aceitador: cria lacuna que aceita elétrons da banda de valência.`}
          </text>
        </g>
      </svg>
      <p className="diagram-caption">
        Cada ligação covalente do {mat.name} é mostrada como linha com <b style={{color:'#0ea5e9'}}>dois pontos azuis</b> (par de elétrons compartilhados).
        Em um dopante <b style={{color:'#22c55e'}}>doador</b> (tipo-n) sobra um elétron livre; em um <b style={{color:'#a855f7'}}>aceitador</b> (tipo-p) uma ligação fica com apenas um elétron, evidenciando a <b style={{color:'#ef4444'}}>lacuna</b> (círculo tracejado vermelho).
      </p>
    </div>
  );
}
