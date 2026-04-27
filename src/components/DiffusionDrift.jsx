import { useMemo, useState } from 'react';
import { TeX } from './Math.jsx';

/**
 * Visualiza a competição entre corrente de DIFUSÃO (gradiente de concentração)
 * e corrente de DERIVA (drift, devido ao campo elétrico) na junção PN.
 * Em equilíbrio termodinâmico: J_n,diff + J_n,drift = 0  e  J_p,diff + J_p,drift = 0.
 */
export default function DiffusionDrift() {
  const [Va, setVa]       = useState(0.0);   // bias 0 = equilíbrio
  const [steep, setSteep] = useState(2.0);   // largura efetiva do gradiente
  const [t, setT]         = useState(300);

  // amostra um perfil idealizado: n(x) suave entre patamares P e N
  const data = useMemo(() => {
    const N = 81;
    const xs = new Array(N).fill(0).map((_, i) => -3 + (i / (N - 1)) * 6);
    // n(x) cresce de ni²/Na (P) para Nd (N) — usamos perfil tanh.
    const tanh = xs.map((x) => Math.tanh(x * steep));
    const n = tanh.map((th) => 0.5 + 0.5 * th);
    const p = tanh.map((th) => 0.5 - 0.5 * th);
    // Em equilíbrio o campo embutido cresce onde dn/dx é grande
    const dndx = n.map((_, i) => {
      if (i === 0) return n[1] - n[0];
      if (i === N - 1) return n[N - 1] - n[N - 2];
      return (n[i + 1] - n[i - 1]) / 2;
    });
    const Emag = dndx.map((d, i) => -d / Math.max(n[i], 0.05));
    return { xs, n, p, Emag };
  }, [steep]);

  const W = 720, H = 320, pad = 40;
  const xScale = (x) => pad + ((x + 3) / 6) * (W - 2 * pad);
  const yScale = (v) => pad + (1 - v) * (H - 2 * pad - 60);

  return (
    <div className="diagram-card">
      <h3>🌊 Difusão × Deriva (Drift)</h3>

      <div className="effmass-controls">
        <label>
          <span>T (K) = {t}</span>
          <input type="range" min={100} max={500} step={5} value={t}
                 onChange={(e) => setT(+e.target.value)} />
        </label>
        <label>
          <span>Inclinação do gradiente = {steep.toFixed(1)}</span>
          <input type="range" min={0.5} max={5} step={0.1} value={steep}
                 onChange={(e) => setSteep(+e.target.value)} />
        </label>
        <label>
          <span>V<sub>a</sub> = {Va.toFixed(2)} V (visualização)</span>
          <input type="range" min={-1} max={0.6} step={0.02} value={Va}
                 onChange={(e) => setVa(+e.target.value)} />
        </label>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxHeight: 380 }}>
        {/* eixos */}
        <line x1={pad} y1={H - pad - 40} x2={W - pad} y2={H - pad - 40} stroke="#475569" />
        <line x1={pad} y1={pad} x2={pad} y2={H - pad - 40} stroke="#475569" />
        <text x={pad - 6} y={pad + 10} fill="#94a3b8" fontSize="11" textAnchor="end">conc.</text>
        <text x={W - pad} y={H - pad - 26} fill="#94a3b8" fontSize="11" textAnchor="end">x</text>

        {/* P (esquerda) e N (direita) */}
        <text x={pad + 10}      y={pad + 12} fill="#a855f7" fontSize="13">Lado P</text>
        <text x={W - pad - 60}  y={pad + 12} fill="#22c55e" fontSize="13">Lado N</text>

        {/* perfis n(x) e p(x) */}
        <polyline fill="none" stroke="#0ea5e9" strokeWidth="2.5"
          points={data.xs.map((x, i) => `${xScale(x)},${yScale(data.n[i])}`).join(' ')} />
        <polyline fill="none" stroke="#ef4444" strokeWidth="2.5"
          points={data.xs.map((x, i) => `${xScale(x)},${yScale(data.p[i])}`).join(' ')} />

        <text x={W - pad - 30} y={yScale(0.92)} fill="#0ea5e9" fontSize="12">n(x)</text>
        <text x={pad + 30}     y={yScale(0.92)} fill="#ef4444" fontSize="12">p(x)</text>

        {/* setas de difusão (gradiente -> elétrons sobem para o P; lacunas descem para o N) */}
        <g stroke="#0ea5e9" strokeWidth="1.5" markerEnd="url(#arr-blue)">
          {[0.25, 0.5, 0.75].map((f, i) => (
            <line key={i}
              x1={xScale(-2.4 + 0.6 * i)} y1={yScale(0.4)}
              x2={xScale(-1.6 + 0.6 * i)} y2={yScale(0.45)} />
          ))}
        </g>
        <g stroke="#ef4444" strokeWidth="1.5" markerEnd="url(#arr-red)">
          {[0.25, 0.5, 0.75].map((f, i) => (
            <line key={i}
              x1={xScale(2.4 - 0.6 * i)} y1={yScale(0.4)}
              x2={xScale(1.6 - 0.6 * i)} y2={yScale(0.45)} />
          ))}
        </g>

        {/* setas de drift (campo embutido empurra elétrons de volta ao N) */}
        <g stroke="#facc15" strokeWidth="1.5" markerEnd="url(#arr-yel)">
          {[0.25, 0.5, 0.75].map((f, i) => (
            <line key={i}
              x1={xScale(-1.0 + 0.6 * i)} y1={H - pad - 80}
              x2={xScale(-0.2 + 0.6 * i)} y2={H - pad - 80} />
          ))}
        </g>
        <text x={W / 2 - 70} y={H - pad - 90} fill="#facc15" fontSize="12">
          Campo embutido E(x) → drift
        </text>

        {/* legenda de equilíbrio */}
        <text x={pad} y={H - pad - 8} fill="#cbd5e1" fontSize="12">
          Equilíbrio: <tspan fill="#0ea5e9">J_n,dif</tspan> + <tspan fill="#facc15">J_n,drift</tspan>
          {' '} = 0  e  <tspan fill="#ef4444">J_p,dif</tspan> + <tspan fill="#facc15">J_p,drift</tspan> = 0
        </text>

        <defs>
          <marker id="arr-blue" markerWidth="10" markerHeight="10" refX="6" refY="3" orient="auto">
            <path d="M0,0 L6,3 L0,6 Z" fill="#0ea5e9" />
          </marker>
          <marker id="arr-red" markerWidth="10" markerHeight="10" refX="6" refY="3" orient="auto">
            <path d="M0,0 L6,3 L0,6 Z" fill="#ef4444" />
          </marker>
          <marker id="arr-yel" markerWidth="10" markerHeight="10" refX="6" refY="3" orient="auto">
            <path d="M0,0 L6,3 L0,6 Z" fill="#facc15" />
          </marker>
        </defs>
      </svg>

      <div className="formula-derivation" style={{ marginTop: 6 }}>
        <p style={{ marginTop: 0 }}><b>Fórmulas-chave:</b></p>
        <TeX block math={String.raw`J_n = q n \mu_n E + q D_n \dfrac{dn}{dx}`} />
        <TeX block math={String.raw`J_p = q p \mu_p E - q D_p \dfrac{dp}{dx}`} />
        <TeX block math={String.raw`\text{Equilíbrio: } J_n = 0 \Rightarrow E = -\dfrac{D_n}{\mu_n}\dfrac{1}{n}\dfrac{dn}{dx} = -\dfrac{kT}{q}\dfrac{1}{n}\dfrac{dn}{dx}`} />
      </div>

      <p style={{ color: '#94a3b8', fontSize: 13, marginTop: 8 }}>
        Em <b>equilíbrio</b>, os dois mecanismos se cancelam <i>localmente para cada espécie</i>.
        Quando uma tensão externa V<sub>a</sub> é aplicada o equilíbrio quebra: a corrente líquida
        passa a ser dominada pela difusão de minoritários através da depleção (corrente de injeção
        do diodo de Shockley).
      </p>
    </div>
  );
}
