import { useMemo } from 'react';
import { MATERIALS } from '../physics/materials.js';

/**
 * Diagrama de bandas (E vs posição) com banda de condução, valência,
 * gap, nível de Fermi, níveis doadores/aceitadores e portadores animados.
 *
 * Props:
 *  - state: {material, T, type, ND, NA, EF, Ec, Ev, Eg, ni, n, p}
 */
export default function BandDiagram({ state }) {
  const { material, T, type, ND, NA, EF, Ec, Ev, Eg } = state;
  const mat = MATERIALS[material];

  const W = 760, H = 460;
  const M = { l: 80, r: 200, t: 40, b: 60 };
  const innerW = W - M.l - M.r;
  const innerH = H - M.t - M.b;

  // Mapeia energia em eV para coordenada y. Domínio: [-Eg/2 - 0.4, Eg/2 + 0.4]
  const Emin = -Eg / 2 - 0.4;
  const Emax =  Eg / 2 + 0.4;
  const y = (E) => M.t + ((Emax - E) / (Emax - Emin)) * innerH;

  const yEc = y(Ec);
  const yEv = y(Ev);
  const yEF = y(EF);
  const yMid = y(0);

  // níveis de impureza
  const Ed = Ec - mat.dopants.donor.dE;
  const Ea = Ev + mat.dopants.acceptor.dE;
  const yEd = y(Ed);
  const yEa = y(Ea);

  // Densidade de portadores ilustrativa: número de pontos a desenhar
  // log10 escala visual entre 5 e 30 partículas
  const nDots = useMemo(() => {
    const map = (val) => {
      if (val <= 0) return 0;
      const lg = Math.log10(val);
      return Math.max(2, Math.min(40, Math.round((lg - 6) * 4)));
    };
    return { e: map(state.n), h: map(state.p) };
  }, [state.n, state.p]);

  const electrons = useMemo(
    () => Array.from({ length: nDots.e }, (_, i) => ({
      x: M.l + 20 + ((i * 37) % (innerW - 40)),
      delay: (i * 0.13) % 1.6,
    })),
    [nDots.e, innerW]
  );
  const holes = useMemo(
    () => Array.from({ length: nDots.h }, (_, i) => ({
      x: M.l + 30 + ((i * 41) % (innerW - 40)),
      delay: (i * 0.17) % 1.6,
    })),
    [nDots.h, innerW]
  );

  // núcleos ionizados (D+ ou A-) na faixa do dopante
  const ionizedDonors = type === 'n'
    ? Array.from({ length: Math.min(20, Math.max(4, Math.round(Math.log10(ND) - 13) * 3)) },
      (_, i) => M.l + 20 + ((i * 53) % (innerW - 40)))
    : [];
  const ionizedAcceptors = type === 'p'
    ? Array.from({ length: Math.min(20, Math.max(4, Math.round(Math.log10(NA) - 13) * 3)) },
      (_, i) => M.l + 25 + ((i * 47) % (innerW - 40)))
    : [];

  return (
    <div className="diagram-card">
      <h3>Diagrama de Bandas — {mat.name} {type === 'n' ? '(tipo-n com P)' : type === 'p' ? '(tipo-p com B)' : '(intrínseco)'}</h3>
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Diagrama de bandas de energia" className="band-svg">
        <defs>
          <linearGradient id="cb-grad" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0.05" />
          </linearGradient>
          <linearGradient id="vb-grad" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#ef4444" stopOpacity="0.05" />
            <stop offset="100%" stopColor="#ef4444" stopOpacity="0.55" />
          </linearGradient>
          <radialGradient id="electron-grad">
            <stop offset="0%" stopColor="#bae6fd" />
            <stop offset="100%" stopColor="#0284c7" />
          </radialGradient>
          <radialGradient id="hole-grad">
            <stop offset="0%" stopColor="#fecaca" />
            <stop offset="100%" stopColor="#b91c1c" />
          </radialGradient>
          <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto">
            <path d="M0,0 L10,5 L0,10 z" fill="#facc15" />
          </marker>
        </defs>

        {/* Eixo Y */}
        <line x1={M.l} y1={M.t} x2={M.l} y2={H - M.b} stroke="#475569" />
        <text x={M.l - 50} y={M.t + 14} fill="#94a3b8" fontSize="12">E (eV)</text>
        {[Emin, Ev, 0, Ec, Emax].map((E, i) => (
          <g key={i}>
            <line x1={M.l - 4} y1={y(E)} x2={M.l} y2={y(E)} stroke="#64748b" />
            <text x={M.l - 8} y={y(E) + 4} fill="#94a3b8" fontSize="10" textAnchor="end">
              {E.toFixed(2)}
            </text>
          </g>
        ))}

        {/* Banda de condução (área acima de Ec) */}
        <rect x={M.l} y={M.t} width={innerW} height={yEc - M.t} fill="url(#cb-grad)" />
        {/* Banda de valência (área abaixo de Ev) */}
        <rect x={M.l} y={yEv} width={innerW} height={H - M.b - yEv} fill="url(#vb-grad)" />

        {/* Linhas Ec, Ev */}
        <line x1={M.l} y1={yEc} x2={M.l + innerW} y2={yEc} stroke="#0ea5e9" strokeWidth="2" />
        <line x1={M.l} y1={yEv} x2={M.l + innerW} y2={yEv} stroke="#ef4444" strokeWidth="2" />
        <text x={M.l + innerW + 8} y={yEc + 4} fill="#0ea5e9" fontSize="12">E_c = {Ec.toFixed(3)} eV</text>
        <text x={M.l + innerW + 8} y={yEv + 4} fill="#ef4444" fontSize="12">E_v = {Ev.toFixed(3)} eV</text>

        {/* Banda proibida (gap) */}
        <line x1={M.l + innerW + 60} y1={yEc} x2={M.l + innerW + 60} y2={yEv} stroke="#facc15" strokeDasharray="4 3" />
        <text x={M.l + innerW + 70} y={(yEc + yEv) / 2} fill="#facc15" fontSize="12">
          Eg = {Eg.toFixed(3)} eV
        </text>

        {/* Nível de Fermi */}
        <line x1={M.l} y1={yEF} x2={M.l + innerW} y2={yEF}
              stroke="#fbbf24" strokeWidth="2" strokeDasharray="6 4" />
        <text x={M.l + innerW + 8} y={yEF + 4} fill="#fbbf24" fontSize="12">
          E_F = {EF.toFixed(3)} eV
        </text>

        {/* Linha midgap (referência) */}
        <line x1={M.l} y1={yMid} x2={M.l + innerW} y2={yMid}
              stroke="#475569" strokeDasharray="2 4" opacity="0.5" />
        <text x={M.l + innerW + 8} y={yMid + 4} fill="#64748b" fontSize="10">midgap</text>

        {/* Nível doador (apenas tipo-n) */}
        {type === 'n' && (
          <>
            <line x1={M.l + 30} y1={yEd} x2={M.l + innerW - 30} y2={yEd}
                  stroke="#22c55e" strokeWidth="1.5" strokeDasharray="3 3" />
            <text x={M.l + innerW + 8} y={yEd + 4} fill="#22c55e" fontSize="11">
              E_d (P): Ec − {(mat.dopants.donor.dE * 1000).toFixed(0)} meV
            </text>
            {ionizedDonors.map((px, i) => (
              <g key={`d-${i}`}>
                <circle cx={px} cy={yEd} r="3.5" fill="#22c55e" />
                <text x={px} y={yEd - 6} fontSize="8" fill="#86efac" textAnchor="middle">D⁺</text>
              </g>
            ))}
          </>
        )}

        {/* Nível aceitador (apenas tipo-p) */}
        {type === 'p' && (
          <>
            <line x1={M.l + 30} y1={yEa} x2={M.l + innerW - 30} y2={yEa}
                  stroke="#a855f7" strokeWidth="1.5" strokeDasharray="3 3" />
            <text x={M.l + innerW + 8} y={yEa + 4} fill="#a855f7" fontSize="11">
              E_a (B): Ev + {(mat.dopants.acceptor.dE * 1000).toFixed(0)} meV
            </text>
            {ionizedAcceptors.map((px, i) => (
              <g key={`a-${i}`}>
                <circle cx={px} cy={yEa} r="3.5" fill="#a855f7" />
                <text x={px} y={yEa + 12} fontSize="8" fill="#d8b4fe" textAnchor="middle">A⁻</text>
              </g>
            ))}
          </>
        )}

        {/* Elétrons na BC */}
        {electrons.map((e, i) => (
          <circle key={`e-${i}`} cx={e.x} cy={M.t + 18} r="5"
                  fill="url(#electron-grad)" stroke="#0369a1" strokeWidth="0.6">
            <animate attributeName="cy"
                     values={`${M.t + 12};${yEc - 8};${M.t + 12}`}
                     dur={`${2.4 + e.delay}s`} repeatCount="indefinite" />
            <animate attributeName="opacity"
                     values="0.85;0.3;0.85"
                     dur={`${2.4 + e.delay}s`} repeatCount="indefinite" />
          </circle>
        ))}

        {/* Lacunas na BV */}
        {holes.map((hh, i) => (
          <circle key={`h-${i}`} cx={hh.x} cy={H - M.b - 18} r="5"
                  fill="url(#hole-grad)" stroke="#7f1d1d" strokeWidth="0.6">
            <animate attributeName="cy"
                     values={`${H - M.b - 18};${yEv + 8};${H - M.b - 18}`}
                     dur={`${2.6 + hh.delay}s`} repeatCount="indefinite" />
            <animate attributeName="opacity"
                     values="0.85;0.3;0.85"
                     dur={`${2.6 + hh.delay}s`} repeatCount="indefinite" />
          </circle>
        ))}

        {/* Setas de geração térmica */}
        {[0.3, 0.55, 0.8].map((f, i) => (
          <g key={`gen-${i}`} opacity="0.5">
            <line x1={M.l + innerW * f} y1={yEv - 2}
                  x2={M.l + innerW * f} y2={yEc + 2}
                  stroke="#facc15" strokeWidth="1" markerEnd="url(#arrow)" />
          </g>
        ))}

        {/* Rótulos das bandas */}
        <text x={M.l + 12} y={M.t + 18} fill="#bae6fd" fontSize="13" fontWeight="600">
          Banda de Condução
        </text>
        <text x={M.l + 12} y={H - M.b - 8} fill="#fecaca" fontSize="13" fontWeight="600">
          Banda de Valência
        </text>

        {/* Rodapé com T */}
        <text x={M.l} y={H - 10} fill="#94a3b8" fontSize="11">
          T = {T} K · n = {state.n.toExponential(2)} cm⁻³ · p = {state.p.toExponential(2)} cm⁻³ · ni = {state.ni.toExponential(2)} cm⁻³
        </text>
      </svg>
      <p className="diagram-caption">
        Elétrons (azul) na banda de condução e lacunas (vermelho) na banda de valência. Setas amarelas indicam
        excitação térmica através do gap. {type === 'n' && 'Cada D⁺ representa um doador (P) ionizado, contribuindo um elétron extra para a BC.'}
        {type === 'p' && 'Cada A⁻ representa um aceitador (B) ionizado, capturando um elétron e gerando lacuna na BV.'}
      </p>
    </div>
  );
}
