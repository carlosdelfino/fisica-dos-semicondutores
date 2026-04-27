import { useMemo, useState } from 'react';
import { TeX } from './Math.jsx';
import { k_B_eV } from '../physics/constants.js';
import { Nc, Nv } from '../physics/formulas.js';
import { joyceDixon, degeneracyType } from '../physics/junctionPN.js';
import { bandgap } from '../physics/materials.js';

/**
 * Visualiza a transição entre material não-degenerado (Boltzmann válido) e
 * degenerado (Fermi-Dirac integral necessária). Mostra a posição do nível
 * de Fermi em relação a Ec/Ev em função da dopagem N_d (ou N_a).
 */
export default function DegenerateNonDegenerate() {
  const [mat, setMat]   = useState('Si');
  const [type, setType] = useState('n');
  const [Nlog, setNlog] = useState(17);
  const [T, setT]       = useState(300);

  const N    = Math.pow(10, Nlog);
  const NcV  = Nc(mat, T);
  const NvV  = Nv(mat, T);
  const Eg   = bandgap(mat, T);
  const kT   = k_B_eV * T;

  // η_n = (E_F - E_c)/kT calculado por Joyce-Dixon (válido em ambos os regimes)
  const eta_n = type === 'n' ? joyceDixon(N / NcV) : null;
  const eta_p = type === 'p' ? joyceDixon(N / NvV) : null;

  // Posição de E_F em eV relativa ao midgap (Ec = +Eg/2, Ev = -Eg/2)
  const Ec = +Eg / 2;
  const Ev = -Eg / 2;
  const EF = type === 'n' ? Ec + eta_n * kT : Ev - eta_p * kT;

  const dist = type === 'n' ? Ec - EF : EF - Ev;
  const regime = degeneracyType(dist, T);

  // Boltzmann previsão
  const n_boltz = type === 'n'
    ? NcV * Math.exp(-(Ec - EF) / kT)
    : NvV * Math.exp(-(EF - Ev) / kT);

  // gráfico: posição do EF vs log10(N)
  const data = useMemo(() => {
    const Ns = new Array(81).fill(0).map((_, i) => 14 + (i / 80) * 6);
    const series = Ns.map((logN) => {
      const Nx = Math.pow(10, logN);
      if (type === 'n') {
        const eta = joyceDixon(Nx / NcV);
        return { logN, EF: Ec + eta * kT };
      } else {
        const eta = joyceDixon(Nx / NvV);
        return { logN, EF: Ev - eta * kT };
      }
    });
    return series;
  }, [type, NcV, NvV, kT, Ec, Ev]);

  const W = 720, H = 380, pad = 50;
  const xScale = (logN) => pad + ((logN - 14) / 6) * (W - 2 * pad);
  const Erange = Math.max(0.4, Eg);
  const yScale = (E) => H/2 - (E / Erange) * (H/2 - pad);

  return (
    <div className="diagram-card">
      <h3>🪙 Material Degenerado × Não-Degenerado</h3>

      <div className="effmass-controls">
        <label>
          <span>Material</span>
          <select value={mat} onChange={(e) => setMat(e.target.value)}>
            <option value="Si">Si</option>
            <option value="Ge">Ge</option>
            <option value="GaAs">GaAs</option>
          </select>
        </label>
        <label>
          <span>Tipo</span>
          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="n">tipo-N (doadores)</option>
            <option value="p">tipo-P (aceitadores)</option>
          </select>
        </label>
        <label>
          <span>N = {N.toExponential(1)} cm⁻³</span>
          <input type="range" min={14} max={20} step={0.1} value={Nlog}
                 onChange={(e) => setNlog(+e.target.value)} />
        </label>
        <label>
          <span>T (K) = {T}</span>
          <input type="range" min={100} max={500} step={5} value={T}
                 onChange={(e) => setT(+e.target.value)} />
        </label>
      </div>

      <div className="carrier-grid" style={{ marginTop: 8 }}>
        <div className="carrier-cell">
          <span className="carrier-label">{type === 'n' ? 'N_c' : 'N_v'}</span>
          <span className="carrier-val">{(type === 'n' ? NcV : NvV).toExponential(2)} cm⁻³</span>
        </div>
        <div className="carrier-cell">
          <span className="carrier-label">{type === 'n' ? 'E_c − E_F' : 'E_F − E_v'}</span>
          <span className="carrier-val">{(dist * 1000).toFixed(1)} meV</span>
        </div>
        <div className="carrier-cell">
          <span className="carrier-label">3 kT</span>
          <span className="carrier-val">{(3 * kT * 1000).toFixed(1)} meV</span>
        </div>
        <div className="carrier-cell">
          <span className="carrier-label">Regime</span>
          <span className="carrier-val" style={{
            color: regime === 'degenerate' ? '#ef4444'
                : regime === 'borderline' ? '#fbbf24' : '#22c55e' }}>
            {regime === 'non-degenerate' ? 'Não-degenerado' :
             regime === 'borderline' ? 'Limítrofe' : 'Degenerado'}
          </span>
        </div>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxHeight: 440 }}>
        {/* Faixas Ec, Ev */}
        <rect x={pad} y={yScale(Ec) - 1} width={W - 2 * pad} height={2} fill="#0ea5e9" />
        <text x={pad + 4} y={yScale(Ec) - 4} fill="#0ea5e9" fontSize="11">E_c (BC)</text>
        <rect x={pad} y={yScale(Ev) - 1} width={W - 2 * pad} height={2} fill="#ef4444" />
        <text x={pad + 4} y={yScale(Ev) + 14} fill="#ef4444" fontSize="11">E_v (BV)</text>

        {/* faixa não-degenerada (3 kT) */}
        <rect x={pad} y={yScale(Ec - 3 * kT)} width={W - 2 * pad}
              height={yScale(Ec) - yScale(Ec - 3 * kT)}
              fill="rgba(34,197,94,0.10)" />
        <rect x={pad} y={yScale(Ev)} width={W - 2 * pad}
              height={yScale(Ev + 3 * kT) - yScale(Ev)}
              fill="rgba(34,197,94,0.10)" />

        {/* curva EF(N) */}
        <polyline fill="none" stroke="#facc15" strokeWidth="2"
          points={data.map((d) => `${xScale(d.logN)},${yScale(d.EF)}`).join(' ')} />

        {/* ponto atual */}
        <circle cx={xScale(Nlog)} cy={yScale(EF)} r="6" fill="#facc15" />
        <text x={xScale(Nlog) + 8} y={yScale(EF) - 6} fill="#facc15" fontSize="12">
          E_F atual = {EF.toFixed(3)} eV
        </text>

        {/* eixos */}
        <text x={pad - 6} y={pad + 10} fill="#94a3b8" fontSize="11" textAnchor="end">E [eV]</text>
        <text x={W - pad} y={H - 8} fill="#94a3b8" fontSize="11" textAnchor="end">log₁₀ N (cm⁻³)</text>
        {[14, 16, 18, 20].map((lN) => (
          <g key={lN}>
            <line x1={xScale(lN)} y1={H/2 - 4} x2={xScale(lN)} y2={H/2 + 4} stroke="#94a3b8" />
            <text x={xScale(lN)} y={H - 26} fill="#94a3b8" fontSize="10" textAnchor="middle">{lN}</text>
          </g>
        ))}
      </svg>

      <div className="formula-derivation" style={{ marginTop: 6 }}>
        <p style={{ marginTop: 0 }}><b>Estatísticas — qual usar?</b></p>
        <TeX block math={String.raw`\text{Não-degenerado: } n = N_c\,e^{-(E_c - E_F)/kT}\quad(\text{Boltzmann})`} />
        <TeX block math={String.raw`\text{Degenerado: } n = N_c\,\dfrac{2}{\sqrt{\pi}}\,F_{1/2}\!\left(\dfrac{E_F-E_c}{kT}\right)\quad(\text{Fermi-Dirac integral})`} />
        <p>
          Critério prático: <b>se E<sub>F</sub> está pelo menos 3 kT abaixo de E<sub>c</sub></b>
          (ou 3 kT acima de E<sub>v</sub>), Boltzmann acerta dentro de ~5%.
          Acima disso (faixa amarela no gráfico) é <i>limítrofe</i>; quando E<sub>F</sub>
          entra na BC ou na BV é <i>degenerado</i>.
        </p>
        <p>
          <b>Material degenerado tipo-N (n+):</b> E<sub>F</sub> &gt; E<sub>c</sub>. Comporta-se como metal
          (densidade de elétrons gigantesca). Usado em <b>contatos ôhmicos</b> e em <b>regiões de emissor</b>
          de transistores de alta corrente. <b>Tipo-P degenerado (p+):</b> E<sub>F</sub> &lt; E<sub>v</sub>,
          típico em <b>contatos a anodo</b> de tiristores e LEDs.
        </p>
        {type === 'n' && (
          <p style={{ color: '#94a3b8', fontSize: 13 }}>
            Boltzmann previria n = {n_boltz.toExponential(2)} cm⁻³; o valor "real" usando
            Joyce-Dixon é N = {N.toExponential(2)} cm⁻³. A razão (Boltzmann / real) =
            {' '}{(n_boltz / N).toFixed(2)} mostra o erro da aproximação para esta dopagem.
          </p>
        )}
      </div>
    </div>
  );
}
