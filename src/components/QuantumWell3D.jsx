import { useMemo, useState } from 'react';
import { TeX } from './Math.jsx';

/**
 * Derivação visual da densidade de estados g(E) usando o modelo do
 * POÇO DE POTENCIAL INFINITO 3D (caixa de aresta L).
 *
 *   Schrödinger 3D dentro da caixa:
 *      ψ(x,y,z) = (2/L)^(3/2) sin(nx π x/L) sin(ny π y/L) sin(nz π z/L)
 *      E = (ℏ²π²)/(2 m L²) · (nx² + ny² + nz²)   com nx,ny,nz = 1,2,3,…
 *
 * No espaço-k: kx = nx π/L → estados ocupam um reticulado cúbico de
 * espaçamento π/L. Densidade no octante positivo: V/π³ estados por
 * unidade de volume em k.
 *
 * Volume de uma "casca" de raio k: dV_k = 4π k² dk → no octante: (1/8)·(4π k²)dk.
 * Multiplicando por 2 (spin) e dividindo por (π/L)³ para contar estados:
 *     dN = 2 · (1/8) · 4π k² dk · (L/π)³  =  V k² dk / π²
 *     g(E) dE = (1/V) dN  →  g(E) = (1/π²) k² (dk/dE)
 *
 * Com E = ℏ²k²/(2m) → k = √(2mE)/ℏ → g(E) = (1/(2π²))(2m/ℏ²)^(3/2) √E.
 */
export default function QuantumWell3D() {
  const [nMax, setNMax] = useState(5);     // mostrar quantas camadas n no plot 3D
  const [kRadius, setKRadius] = useState(3); // raio da esfera de Fermi (em unidades de π/L)

  const W = 760, H = 480;

  // Pontos no espaço k (octante positivo) com nx, ny, nz = 1..nMax
  const dots = useMemo(() => {
    const list = [];
    for (let nx = 1; nx <= nMax; nx++) {
      for (let ny = 1; ny <= nMax; ny++) {
        for (let nz = 1; nz <= nMax; nz++) {
          const r = Math.sqrt(nx * nx + ny * ny + nz * nz);
          list.push({ nx, ny, nz, r });
        }
      }
    }
    return list;
  }, [nMax]);

  // Projeção isométrica simples: (x,y,z) → (px, py)
  const project = (x, y, z) => {
    const ox = 200;
    const oy = 280;
    const cosA = Math.cos(Math.PI / 6);
    const sinA = Math.sin(Math.PI / 6);
    const scale = 28;
    const px = ox + (x - y) * cosA * scale;
    const py = oy - z * scale + (x + y) * sinA * scale;
    return { px, py };
  };

  // contagem de estados dentro da esfera de raio kRadius
  const countInside = dots.filter((d) => d.r <= kRadius).length * 2; // ×2 spin

  // valor previsto pela fórmula contínua:
  // N(k) = (1/8) · (4/3 π k³) · 2 / (π/L)³ · 1/L³ ... simplificando para L=1:
  //   no octante o número de estados = (V/(2π²)) · (k³/3)·2 = k³/(3π²)·V
  // com V = 1 e k em unidades de π/L (i.e., kx = nx) o volume da esfera no octante é (1/8)(4/3 π R³)
  // onde R está em unidades de π/L. Então N_continuous = (4/3)π R³ /(8) · 2 = π R³/3
  const Ncont = (Math.PI * kRadius ** 3) / 3;

  // g(E) curve em unidades arbitrárias
  const dosPath = useMemo(() => {
    const N = 100;
    const Emax = 25;
    const pts = [];
    for (let i = 1; i <= N; i++) {
      const E = (i / N) * Emax;
      const g = Math.sqrt(E); // ∝ √E
      const x = 460 + (E / Emax) * 260;
      const y = 360 - (g / Math.sqrt(Emax)) * 230;
      pts.push(`${i === 1 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`);
    }
    return pts.join(' ');
  }, []);

  return (
    <div className="diagram-card">
      <h3>Densidade de Estados a partir do Poço Infinito 3D</h3>

      <div className="effmass-controls">
        <div className="control-group">
          <label>Camadas exibidas n_max: <b>{nMax}</b></label>
          <input type="range" min="2" max="8" step="1"
                 value={nMax} onChange={(e) => setNMax(Number(e.target.value))} />
        </div>
        <div className="control-group">
          <label>Raio k da esfera de Fermi: <b>{kRadius.toFixed(1)} π/L</b></label>
          <input type="range" min="1" max="6" step="0.1"
                 value={kRadius} onChange={(e) => setKRadius(Number(e.target.value))} />
          <small style={{ color: '#94a3b8', fontSize: 11 }}>
            Estados contados (×2 spin): <b style={{ color: '#22d3ee' }}>{countInside}</b> &nbsp;·&nbsp;
            previsão contínua πR³/3 ×2 ≈ <b style={{ color: '#fbbf24' }}>{(2 * Ncont).toFixed(1)}</b>
          </small>
        </div>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="qw-svg" role="img"
           aria-label="Espaço k discreto e densidade de estados">

        {/* === Painel esquerdo: reticulado k-space === */}
        <text x={200} y={20} fill="#cbd5e1" fontSize="13" textAnchor="middle" fontWeight="600">
          Estados discretos no espaço-k (octante positivo)
        </text>

        {/* eixos */}
        {(() => {
          const o = project(0, 0, 0);
          const ax = project(nMax + 0.5, 0, 0);
          const ay = project(0, nMax + 0.5, 0);
          const az = project(0, 0, nMax + 0.5);
          return (
            <g>
              <line x1={o.px} y1={o.py} x2={ax.px} y2={ax.py}
                    stroke="#475569" strokeWidth="1.5" markerEnd="url(#arr-qw)" />
              <line x1={o.px} y1={o.py} x2={ay.px} y2={ay.py}
                    stroke="#475569" strokeWidth="1.5" markerEnd="url(#arr-qw)" />
              <line x1={o.px} y1={o.py} x2={az.px} y2={az.py}
                    stroke="#475569" strokeWidth="1.5" markerEnd="url(#arr-qw)" />
              <text x={ax.px + 6} y={ax.py + 4} fill="#94a3b8" fontSize="11">k_x</text>
              <text x={ay.px + 6} y={ay.py + 4} fill="#94a3b8" fontSize="11">k_y</text>
              <text x={az.px + 4} y={az.py - 4} fill="#94a3b8" fontSize="11">k_z</text>
            </g>
          );
        })()}

        {/* esfera projetada (elipse) com raio k */}
        {(() => {
          const o = project(0, 0, 0);
          const cosA = Math.cos(Math.PI / 6);
          const sinA = Math.sin(Math.PI / 6);
          const scale = 28;
          const rxe = kRadius * cosA * scale * 1.0;
          const rye = kRadius * scale * 0.95;
          return (
            <ellipse cx={o.px + kRadius * scale * 0.3}
                     cy={o.py - kRadius * scale * 0.3}
                     rx={rxe} ry={rye}
                     fill="#22d3ee" opacity="0.10"
                     stroke="#22d3ee" strokeWidth="1.2" strokeDasharray="3 3" />
          );
        })()}

        {/* pontos */}
        {dots.map((d, i) => {
          const { px, py } = project(d.nx, d.ny, d.nz);
          const inside = d.r <= kRadius;
          return (
            <circle key={i} cx={px} cy={py} r={inside ? 4 : 3}
                    fill={inside ? '#22d3ee' : '#475569'}
                    stroke={inside ? '#0e7490' : 'none'} strokeWidth="0.8"
                    opacity={inside ? 0.95 : 0.55} />
          );
        })}

        {/* fórmula da energia */}
        <foreignObject x={20} y={400} width={400} height={70}>
          <div xmlns="http://www.w3.org/1999/xhtml" style={{ color: '#cbd5e1', fontSize: '12px' }}>
            <TeX block math={String.raw`E_{n_x,n_y,n_z} = \dfrac{\hbar^2 \pi^2}{2 m L^2}(n_x^2 + n_y^2 + n_z^2)`} />
          </div>
        </foreignObject>

        {/* === Painel direito: g(E) curve === */}
        <text x={590} y={20} fill="#cbd5e1" fontSize="13" textAnchor="middle" fontWeight="600">
          Densidade de estados g(E) ∝ √E
        </text>

        {/* eixos */}
        <line x1={460} y1={360} x2={720} y2={360} stroke="#475569" />
        <line x1={460} y1={130} x2={460} y2={360} stroke="#475569" />
        <text x={590} y={H - 20} fill="#cbd5e1" fontSize="11" textAnchor="middle">E (un. arb.)</text>
        <text x={445} y={245} fill="#cbd5e1" fontSize="11"
              transform="rotate(-90 445 245)" textAnchor="middle">g(E)</text>

        {/* curva √E */}
        <path d={dosPath} fill="none" stroke="#22d3ee" strokeWidth="2.5" />

        {/* faixa colorida sob a curva até E correspondente a kRadius */}
        {(() => {
          const Emax = 25;
          const Ecut = Math.min(kRadius * kRadius, Emax);
          const N = 60;
          const pts = [];
          pts.push(`M 460 360`);
          for (let i = 1; i <= N; i++) {
            const E = (i / N) * Ecut;
            const g = Math.sqrt(E);
            const x = 460 + (E / Emax) * 260;
            const y = 360 - (g / Math.sqrt(Emax)) * 230;
            pts.push(`L ${x.toFixed(1)} ${y.toFixed(1)}`);
          }
          const xCut = 460 + (Ecut / Emax) * 260;
          pts.push(`L ${xCut.toFixed(1)} 360 Z`);
          return <path d={pts.join(' ')} fill="#22d3ee" opacity="0.20" />;
        })()}

        {/* linha de referência E correspondente ao raio k atual */}
        {(() => {
          const Emax = 25;
          const E = Math.min(kRadius * kRadius, Emax);
          const x = 460 + (E / Emax) * 260;
          return (
            <g>
              <line x1={x} y1={130} x2={x} y2={360} stroke="#facc15"
                    strokeWidth="1.2" strokeDasharray="4 3" />
              <text x={x + 4} y={140} fill="#facc15" fontSize="10">
                E ∝ k² = {E.toFixed(1)}
              </text>
            </g>
          );
        })()}

        {/* fórmula de g(E) */}
        <foreignObject x={440} y={380} width={310} height={90}>
          <div xmlns="http://www.w3.org/1999/xhtml" style={{ color: '#cbd5e1', fontSize: '11px' }}>
            <TeX block math={String.raw`g(E) = \dfrac{1}{2\pi^2}\!\left(\dfrac{2m}{\hbar^2}\right)^{3/2}\!\sqrt{E}`} />
          </div>
        </foreignObject>

        <defs>
          <marker id="arr-qw" viewBox="0 0 10 10" refX="9" refY="5"
                  markerWidth="5" markerHeight="5" orient="auto">
            <path d="M0,0 L10,5 L0,10 z" fill="#475569" />
          </marker>
        </defs>
      </svg>

      <p className="diagram-caption">
        No <b>poço infinito 3D</b>, as condições de contorno ψ = 0 nas paredes da caixa de aresta L
        forçam (k_x, k_y, k_z) a assumir apenas valores discretos n_x π/L, n_y π/L, n_z π/L. Cada estado
        permitido corresponde a um <b>ponto</b> em um reticulado cúbico no espaço-k. À medida que aumentamos
        o raio k da esfera, contamos o número de estados <b>dentro</b> dela. Esta contagem combinada com
        E = ℏ²k²/(2m) dá origem à dependência <b>√E</b> da densidade de estados — o resultado que usamos em
        toda a aba <i>Densidade de Estados</i>. Para a banda de condução de um semicondutor, basta
        substituir m por m*_n e a origem de energia por E_c.
      </p>
    </div>
  );
}
