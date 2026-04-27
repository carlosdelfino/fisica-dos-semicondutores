import { useMemo, useState } from 'react';
import { TeX } from './Math.jsx';
import { Vt, einsteinDiffusivity } from '../physics/junctionPN.js';

/**
 * Mostra a relação de Einstein D/μ = kT/q válida em qualquer regime
 * (equilíbrio ou não), e por que ela aparece naturalmente do mesmo
 * tempo de espalhamento térmico τ.
 */
export default function EinsteinRelation() {
  const [T, setT]   = useState(300);
  const [mu, setMu] = useState(1350); // cm²/(V·s) — elétrons em Si

  const VT = Vt(T);
  const D  = einsteinDiffusivity(mu, T);

  // amostra D vs T para alguns μ fixos
  const data = useMemo(() => {
    const Ts = new Array(81).fill(0).map((_, i) => 100 + i * 5); // 100..500 K
    const series = [
      { mu: 480,  color: '#a855f7', label: 'lacunas Si (μ ≈ 480)' },
      { mu: 1350, color: '#0ea5e9', label: 'elétrons Si (μ ≈ 1350)' },
      { mu: 8500, color: '#22c55e', label: 'elétrons GaAs (μ ≈ 8500)' },
    ];
    return { Ts, series };
  }, []);

  const W = 720, H = 320, pad = 50;
  const xScale = (T) => pad + ((T - 100) / 400) * (W - 2 * pad);
  const allD = data.series.flatMap((s) => data.Ts.map((Ti) => s.mu * Vt(Ti)));
  const Dmax = Math.max(...allD);
  const yScale = (D) => H - pad - 40 - (D / Dmax) * (H - 2 * pad - 60);

  return (
    <div className="diagram-card">
      <h3>🔗 Relação de Einstein</h3>

      <div className="effmass-controls">
        <label>
          <span>T (K) = {T}</span>
          <input type="range" min={100} max={500} step={5} value={T}
                 onChange={(e) => setT(+e.target.value)} />
        </label>
        <label>
          <span>μ = {mu} cm²/(V·s)</span>
          <input type="range" min={50} max={9000} step={50} value={mu}
                 onChange={(e) => setMu(+e.target.value)} />
        </label>
      </div>

      <div className="carrier-grid" style={{ marginTop: 8 }}>
        <div className="carrier-cell">
          <span className="carrier-label">V<sub>T</sub> = kT/q</span>
          <span className="carrier-val">{(VT * 1000).toFixed(2)} mV</span>
        </div>
        <div className="carrier-cell">
          <span className="carrier-label">D = μ · V<sub>T</sub></span>
          <span className="carrier-val">{D.toFixed(1)} cm²/s</span>
        </div>
        <div className="carrier-cell">
          <span className="carrier-label">D/μ</span>
          <span className="carrier-val">{(D / mu * 1000).toFixed(2)} mV</span>
        </div>
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxHeight: 360 }}>
        <line x1={pad} y1={H - pad - 40} x2={W - pad} y2={H - pad - 40} stroke="#475569" />
        <line x1={pad} y1={pad} x2={pad} y2={H - pad - 40} stroke="#475569" />
        <text x={pad - 6} y={pad + 10} fill="#94a3b8" fontSize="11" textAnchor="end">D [cm²/s]</text>
        <text x={W - pad} y={H - pad - 26} fill="#94a3b8" fontSize="11" textAnchor="end">T (K)</text>

        {/* eixo X ticks */}
        {[100, 200, 300, 400, 500].map((Ti) => (
          <g key={Ti}>
            <line x1={xScale(Ti)} y1={H - pad - 40} x2={xScale(Ti)} y2={H - pad - 36} stroke="#94a3b8" />
            <text x={xScale(Ti)} y={H - pad - 24} fill="#94a3b8" fontSize="10" textAnchor="middle">{Ti}</text>
          </g>
        ))}

        {data.series.map((s) => (
          <g key={s.label}>
            <polyline fill="none" stroke={s.color} strokeWidth="2"
              points={data.Ts.map((Ti) => `${xScale(Ti)},${yScale(s.mu * Vt(Ti))}`).join(' ')} />
          </g>
        ))}

        {/* legenda */}
        {data.series.map((s, i) => (
          <g key={'lg' + s.label}>
            <rect x={W - pad - 200} y={pad + 10 + i * 18} width={14} height={3} fill={s.color} />
            <text x={W - pad - 180} y={pad + 14 + i * 18} fill={s.color} fontSize="11">{s.label}</text>
          </g>
        ))}

        {/* marca o T atual */}
        <line x1={xScale(T)} y1={pad} x2={xScale(T)} y2={H - pad - 40}
              stroke="#facc15" strokeDasharray="3 3" />
        <circle cx={xScale(T)} cy={yScale(D)} r="4" fill="#facc15" />
      </svg>

      <div className="formula-derivation" style={{ marginTop: 6 }}>
        <p style={{ marginTop: 0 }}><b>Forma fundamental (Einstein, 1905):</b></p>
        <TeX block math={String.raw`\boxed{\;\dfrac{D}{\mu} = \dfrac{kT}{q} \equiv V_T\;}`} />
        <p>Equivalentemente, para elétrons e lacunas separadamente:</p>
        <TeX block math={String.raw`D_n = \mu_n \dfrac{kT}{q},\qquad D_p = \mu_p \dfrac{kT}{q}`} />
        <p><b>Por que vale fora do equilíbrio?</b></p>
        <ul style={{ color: '#cbd5e1', fontSize: 13 }}>
          <li>Tanto μ quanto D são calculados a partir do mesmo tempo médio de espalhamento térmico τ.</li>
          <li>μ = q τ / m* e D = (1/3) v<sub>th</sub>² τ; a razão dá kT/q porque (1/2) m* v<sub>th</sub>² = (3/2) kT.</li>
          <li>A presença de campo externo ou gradiente <i>não muda</i> o tempo entre colisões — só a distribuição direcional.</li>
          <li>Por isso a relação se preserva mesmo com J ≠ 0 (mesmo no diodo polarizado, no BJT em operação, etc.).</li>
        </ul>
        <p style={{ background: 'rgba(34,211,238,0.08)', padding: 10, borderRadius: 6 }}>
          <b>Mnemônico:</b> <i>"Dee over mu equals kay-tee over Q"</i> — em inglês a frase rima e gruda
          na memória. Em português costuma-se decorar como "<i>D sobre μ é V<sub>T</sub></i>".
        </p>
      </div>
    </div>
  );
}
