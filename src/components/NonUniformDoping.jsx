import { useMemo, useState } from 'react';
import { TeX } from './Math.jsx';
import { builtInFieldFromGradient, Vt } from '../physics/junctionPN.js';

/**
 * Demonstra que mesmo SEM junção PN, um semicondutor com dopagem não-uniforme
 * apresenta campo elétrico interno em equilíbrio.
 *   E(x) = -(kT/q) · (1/N(x)) · dN(x)/dx
 *
 * O usuário escolhe o perfil de dopagem (linear/exponencial/gauss) e vê o
 * campo embutido resultante e a inclinação correspondente das bandas.
 */
export default function NonUniformDoping() {
  const [profile, setProfile] = useState('exp'); // 'linear' | 'exp' | 'gauss'
  const [N1, setN1]           = useState(1e15);
  const [N2, setN2]           = useState(1e18);
  const [T,  setT]            = useState(300);

  const data = useMemo(() => {
    const N = 121;
    const xs = new Array(N).fill(0).map((_, i) => i / (N - 1)); // 0..1 (µm)
    let Nx;
    if (profile === 'linear') {
      Nx = xs.map((x) => N1 + (N2 - N1) * x);
    } else if (profile === 'exp') {
      const r = Math.log(N2 / N1);
      Nx = xs.map((x) => N1 * Math.exp(r * x));
    } else {
      Nx = xs.map((x) => N1 + (N2 - N1) * Math.exp(-Math.pow((x - 0.5) / 0.18, 2)));
    }
    // converte para cm^-1 no eixo x: assumimos comprimento de 1 µm = 1e-4 cm
    const xs_cm = xs.map((x) => x * 1e-4);
    const Ex    = builtInFieldFromGradient(Nx, xs_cm, T); // V/cm
    // potencial relativo  φ(x) = -∫ E dx   (numérico)
    const phi = new Array(N).fill(0);
    for (let i = 1; i < N; i++) {
      phi[i] = phi[i - 1] - 0.5 * (Ex[i] + Ex[i - 1]) * (xs_cm[i] - xs_cm[i - 1]);
    }
    return { xs, Nx, Ex, phi };
  }, [profile, N1, N2, T]);

  const W = 720, H = 380, pad = 40;
  const xScale = (x) => pad + x * (W - 2 * pad);
  const Nlog = data.Nx.map((n) => Math.log10(Math.max(n, 1)));
  const NlogMin = Math.min(...Nlog), NlogMax = Math.max(...Nlog);
  const yN = (logN) => 110 - ((logN - NlogMin) / Math.max(0.1, NlogMax - NlogMin)) * 80;
  const Eabs = Math.max(1, ...data.Ex.map(Math.abs));
  const yE = (E) => 220 - (E / Eabs) * 60;
  const phiAbs = Math.max(1e-3, ...data.phi.map(Math.abs));
  const yPhi = (p) => 340 - (p / phiAbs) * 70;

  return (
    <div className="diagram-card">
      <h3>📈 Campo Embutido em Material Não-Uniformemente Dopado (equilíbrio)</h3>

      <div className="effmass-controls">
        <label>
          <span>Perfil</span>
          <select value={profile} onChange={(e) => setProfile(e.target.value)}>
            <option value="linear">Linear</option>
            <option value="exp">Exponencial</option>
            <option value="gauss">Gaussiano</option>
          </select>
        </label>
        <label>
          <span>N(0) = {N1.toExponential(1)} cm⁻³</span>
          <input type="range" min={14} max={19} step={0.1} value={Math.log10(N1)}
                 onChange={(e) => setN1(Math.pow(10, +e.target.value))} />
        </label>
        <label>
          <span>N(L) = {N2.toExponential(1)} cm⁻³</span>
          <input type="range" min={14} max={19} step={0.1} value={Math.log10(N2)}
                 onChange={(e) => setN2(Math.pow(10, +e.target.value))} />
        </label>
        <label>
          <span>T (K) = {T}</span>
          <input type="range" min={100} max={500} step={5} value={T}
                 onChange={(e) => setT(+e.target.value)} />
        </label>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxHeight: 440 }}>
        {/* faixas */}
        <rect x={pad} y={20} width={W - 2 * pad} height={1} fill="#475569" />

        {/* N(x) (log) */}
        <text x={pad + 6} y={36} fill="#22c55e" fontSize="13">log₁₀ N(x)</text>
        <polyline fill="none" stroke="#22c55e" strokeWidth="2"
          points={data.xs.map((x, i) => `${xScale(x)},${yN(Nlog[i])}`).join(' ')} />

        {/* E(x) */}
        <line x1={pad} y1={220} x2={W - pad} y2={220} stroke="#475569" />
        <text x={pad + 6} y={156} fill="#0ea5e9" fontSize="13">E(x) [V/cm]</text>
        <polyline fill="none" stroke="#0ea5e9" strokeWidth="2"
          points={data.xs.map((x, i) => `${xScale(x)},${yE(data.Ex[i])}`).join(' ')} />

        {/* φ(x) ↔ E_F constante mas Ec, Ev inclinados */}
        <line x1={pad} y1={340} x2={W - pad} y2={340} stroke="#475569" />
        <text x={pad + 6} y={272} fill="#fbbf24" fontSize="13">φ(x) = (E_F − E_i)/q</text>
        <polyline fill="none" stroke="#fbbf24" strokeWidth="2"
          points={data.xs.map((x, i) => `${xScale(x)},${yPhi(data.phi[i])}`).join(' ')} />

        <text x={pad} y={H - 8} fill="#94a3b8" fontSize="11">x = 0</text>
        <text x={W - pad - 30} y={H - 8} fill="#94a3b8" fontSize="11">x = L (1 µm)</text>
      </svg>

      <div className="formula-derivation" style={{ marginTop: 6 }}>
        <p style={{ marginTop: 0 }}>
          <b>Origem do campo:</b> impondo J<sub>n</sub> = 0 (equilíbrio):
        </p>
        <TeX block math={String.raw`q n \mu_n E + q D_n \dfrac{dn}{dx} = 0 \;\Rightarrow\; E(x) = -\dfrac{kT}{q}\dfrac{1}{n(x)}\dfrac{dn}{dx}`} />
        <p>
          Equivalente: o nível de Fermi E<sub>F</sub> é constante, mas E<sub>c</sub>(x) e E<sub>v</sub>(x)
          se inclinam para acomodar n(x) ≈ N<sub>d</sub>(x). A inclinação das bandas é o campo:
        </p>
        <TeX block math={String.raw`E(x) = -\dfrac{1}{q}\dfrac{dE_F}{dx} + \dfrac{1}{q}\dfrac{dE_c}{dx} = \dfrac{1}{q}\dfrac{dE_c}{dx}\quad(\text{equil.}\Rightarrow E_F \text{ cte})`} />
        <p>
          <b>Mensagem-chave:</b> uniformidade da concentração não é equivalente a uniformidade da
          dopagem. <i>Sempre que há gradiente</i> de N(x) há campo elétrico interno mesmo sem fontes externas
          — princípio que cria a depleção da junção PN, o BJT graded-base e a célula solar com BSF.
        </p>
      </div>
    </div>
  );
}
