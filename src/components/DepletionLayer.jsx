import { useMemo, useState } from 'react';
import { TeX } from './Math.jsx';
import {
  builtInVoltage,
  depletionWidth,
  depletionSplit,
  maxElectricField,
  electricFieldProfile,
  potentialProfile,
  junctionCapacitance,
} from '../physics/junctionPN.js';

/**
 * Visualiza camada de depleção, campo elétrico e potencial de uma junção PN
 * abrupta. Permite ajustar Na, Nd, V_a (polarização) e T.
 */
export default function DepletionLayer() {
  const [mat, setMat]   = useState('Si');
  const [T, setT]       = useState(300);
  const [Na, setNa]     = useState(1e16);
  const [Nd, setNd]     = useState(1e16);
  const [Va, setVa]     = useState(0);

  const W    = depletionWidth(mat, T, Na, Nd, Va);
  const Vbi  = builtInVoltage(mat, T, Na, Nd);
  const Emax = maxElectricField(mat, T, Na, Nd, Va);
  const Cj   = junctionCapacitance(mat, T, Na, Nd, Va);
  const { xn, xp } = depletionSplit(W, Na, Nd);

  // amostragem para gráficos
  const data = useMemo(() => {
    const N = 121;
    const margin = 0.4 * W;
    const xMin = -(xp + margin);
    const xMax =  (xn + margin);
    const xs = new Array(N).fill(0).map((_, i) => xMin + (i / (N - 1)) * (xMax - xMin));
    const Es = xs.map((x) => electricFieldProfile(mat, T, Na, Nd, Va, x));
    const Vs = xs.map((x) => potentialProfile(mat, T, Na, Nd, Va, x));
    return { xs, Es, Vs, xMin, xMax };
  }, [mat, T, Na, Nd, Va, W, xn, xp]);

  // SVG dimensions
  const Wpx = 720, Hpx = 380, pad = 40;
  const xScale = (x) => pad + ((x - data.xMin) / (data.xMax - data.xMin)) * (Wpx - 2 * pad);

  // E plot scaling
  const EabsMax = Math.max(1, ...data.Es.map((v) => Math.abs(v)));
  const yE = (E) => 220 - (E / EabsMax) * 80;
  // V plot scaling
  const VMax = Math.max(1e-6, ...data.Vs);
  const yV = (V) => 360 - (V / VMax) * 80;

  // Carriers (sketch)
  const fmt = (x, units) => {
    if (!isFinite(x)) return '∞';
    if (x === 0) return '0';
    const abs = Math.abs(x);
    if (abs >= 1e3 || abs < 1e-2) return x.toExponential(2) + ' ' + units;
    return x.toFixed(3) + ' ' + units;
  };

  return (
    <div className="diagram-card">
      <h3>🔻 Camada de Depleção (Junção PN abrupta)</h3>

      {/* Controles */}
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
          <span>T (K) = {T}</span>
          <input type="range" min={100} max={500} step={5} value={T}
                 onChange={(e) => setT(+e.target.value)} />
        </label>
        <label>
          <span>N<sub>a</sub> = {Na.toExponential(1)} cm⁻³</span>
          <input type="range" min={14} max={19} step={0.1} value={Math.log10(Na)}
                 onChange={(e) => setNa(Math.pow(10, +e.target.value))} />
        </label>
        <label>
          <span>N<sub>d</sub> = {Nd.toExponential(1)} cm⁻³</span>
          <input type="range" min={14} max={19} step={0.1} value={Math.log10(Nd)}
                 onChange={(e) => setNd(Math.pow(10, +e.target.value))} />
        </label>
        <label>
          <span>V<sub>a</sub> = {Va.toFixed(2)} V</span>
          <input type="range" min={-2} max={0.6} step={0.02} value={Va}
                 onChange={(e) => setVa(+e.target.value)} />
        </label>
      </div>

      {/* Resultados */}
      <div className="carrier-grid" style={{ marginTop: 8 }}>
        <div className="carrier-cell">
          <span className="carrier-label">V<sub>bi</sub></span>
          <span className="carrier-val">{Vbi.toFixed(3)} V</span>
        </div>
        <div className="carrier-cell">
          <span className="carrier-label">W</span>
          <span className="carrier-val">{fmt(W * 1e4, 'µm')}</span>
        </div>
        <div className="carrier-cell">
          <span className="carrier-label">|E<sub>max</sub>|</span>
          <span className="carrier-val">{fmt(Emax, 'V/cm')}</span>
        </div>
        <div className="carrier-cell">
          <span className="carrier-label">C<sub>j</sub></span>
          <span className="carrier-val">{fmt(Cj * 1e9, 'nF/cm²')}</span>
        </div>
      </div>

      {/* SVG: estrutura espacial + E(x) + V(x) */}
      <svg viewBox={`0 0 ${Wpx} ${Hpx}`} width="100%" style={{ maxHeight: 440 }}>
        {/* fundo P / N */}
        <rect x={pad} y={20} width={xScale(0) - pad} height={80}
              fill="rgba(168,85,247,0.18)" />
        <rect x={xScale(0)} y={20} width={Wpx - pad - xScale(0)} height={80}
              fill="rgba(34,197,94,0.18)" />
        <text x={pad + 10} y={36} fill="#a855f7" fontSize="13">Lado P (N<tspan baselineShift="sub">a</tspan>)</text>
        <text x={Wpx - pad - 80} y={36} fill="#22c55e" fontSize="13">Lado N (N<tspan baselineShift="sub">d</tspan>)</text>

        {/* região de depleção */}
        <rect x={xScale(-xp)} y={20} width={xScale(xn) - xScale(-xp)} height={80}
              fill="rgba(250,204,21,0.18)" stroke="#facc15" strokeDasharray="3 2" />
        <text x={(xScale(-xp) + xScale(xn)) / 2 - 30} y={56} fill="#facc15" fontSize="12">
          Depleção W = {fmt(W * 1e4, 'µm')}
        </text>

        {/* íons fixos */}
        {Array.from({ length: 8 }).map((_, i) => {
          const xi = -xp + ((i + 0.5) / 8) * xp;
          return (
            <text key={'A' + i} x={xScale(xi)} y={86}
                  textAnchor="middle" fill="#a855f7" fontSize="14">⊖</text>
          );
        })}
        {Array.from({ length: 8 }).map((_, i) => {
          const xi = ((i + 0.5) / 8) * xn;
          return (
            <text key={'D' + i} x={xScale(xi)} y={86}
                  textAnchor="middle" fill="#22c55e" fontSize="14">⊕</text>
          );
        })}

        {/* eixo x na metalúrgica */}
        <line x1={xScale(0)} y1={20} x2={xScale(0)} y2={Hpx - 10}
              stroke="#94a3b8" strokeDasharray="2 3" />
        <text x={xScale(0) + 4} y={18} fill="#94a3b8" fontSize="11">x = 0 (metalúrgica)</text>

        {/* gráfico E(x) */}
        <g>
          <line x1={pad} y1={220} x2={Wpx - pad} y2={220} stroke="#475569" />
          <text x={pad - 4} y={140} fill="#0ea5e9" fontSize="11" textAnchor="end">+E</text>
          <text x={pad - 4} y={304} fill="#0ea5e9" fontSize="11" textAnchor="end">−E</text>
          <text x={pad + 6} y={134} fill="#0ea5e9" fontSize="13">E(x)</text>
          <polyline
            fill="none" stroke="#0ea5e9" strokeWidth="2"
            points={data.xs.map((x, i) => `${xScale(x)},${yE(data.Es[i])}`).join(' ')}
          />
        </g>

        {/* gráfico V(x) */}
        <g>
          <line x1={pad} y1={360} x2={Wpx - pad} y2={360} stroke="#475569" />
          <text x={pad + 6} y={296} fill="#fbbf24" fontSize="13">φ(x)</text>
          <text x={Wpx - pad - 60} y={yV(VMax) - 4} fill="#fbbf24" fontSize="11">
            φ = V<tspan baselineShift="sub">bi</tspan>−V<tspan baselineShift="sub">a</tspan>
          </text>
          <polyline
            fill="none" stroke="#fbbf24" strokeWidth="2"
            points={data.xs.map((x, i) => `${xScale(x)},${yV(data.Vs[i])}`).join(' ')}
          />
        </g>
      </svg>

      <div className="formula-derivation" style={{ marginTop: 6 }}>
        <p style={{ marginTop: 0 }}><b>Fórmulas (junção abrupta):</b></p>
        <TeX block math={String.raw`V_{bi} = \dfrac{kT}{q}\ln\!\dfrac{N_a N_d}{n_i^2}`} />
        <TeX block math={String.raw`W = \sqrt{\dfrac{2\varepsilon_s (V_{bi}-V_a)}{q}\!\left(\dfrac{N_a+N_d}{N_a N_d}\right)}`} />
        <TeX block math={String.raw`|E_{max}| = \dfrac{2(V_{bi}-V_a)}{W} = \dfrac{q N_a x_p}{\varepsilon_s} = \dfrac{q N_d x_n}{\varepsilon_s}`} />
        <TeX block math={String.raw`C_j = \dfrac{\varepsilon_s}{W} \;\propto\; (V_{bi}-V_a)^{-1/2}`} />
      </div>

      <p style={{ color: '#94a3b8', fontSize: 13, marginTop: 8 }}>
        <b>Como ler:</b> as cargas espaciais (íons fixos ⊕ no lado N e ⊖ no lado P) geram um campo
        elétrico triangular que aponta <i>de N para P</i> (sinal negativo na convenção mostrada). O potencial
        sobe parabolicamente do lado P ao N. Em <b>polarização direta</b> V<sub>a</sub>&gt;0 a barreira diminui,
        W encolhe e a corrente de difusão cresce exponencialmente; em <b>reversa</b> V<sub>a</sub>&lt;0,
        W se alarga e quase nenhum portador majoritário consegue cruzar.
      </p>
    </div>
  );
}
