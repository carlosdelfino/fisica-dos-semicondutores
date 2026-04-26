import { TeX } from './Math.jsx';

const fmt = (v, d = 3) => (v === 0 ? '0' : v.toExponential(d));

export default function CarrierPanel({ state }) {
  const { material, T, Eg, Ec, Ev, EF, n, p, ni, Nc, Nv, type, ND, NA } = state;
  return (
    <div className="diagram-card carrier-panel">
      <h3>Valores numéricos calculados</h3>
      <div className="kv-grid">
        <div><span>Material</span><b>{material}</b></div>
        <div><span>T</span><b>{T} K</b></div>
        <div><span><TeX math="E_g" /></span><b>{Eg.toFixed(3)} eV</b></div>
        <div><span><TeX math="E_c" /></span><b>{Ec.toFixed(3)} eV</b></div>
        <div><span><TeX math="E_v" /></span><b>{Ev.toFixed(3)} eV</b></div>
        <div><span><TeX math="E_F" /></span><b>{EF.toFixed(3)} eV</b></div>
        <div><span><TeX math="N_c" /></span><b>{fmt(Nc, 2)} cm⁻³</b></div>
        <div><span><TeX math="N_v" /></span><b>{fmt(Nv, 2)} cm⁻³</b></div>
        <div><span><TeX math="n_i" /></span><b>{fmt(ni, 2)} cm⁻³</b></div>
        <div><span><TeX math="n" /></span><b>{fmt(n, 2)} cm⁻³</b></div>
        <div><span><TeX math="p" /></span><b>{fmt(p, 2)} cm⁻³</b></div>
        <div><span><TeX math="n \cdot p" /></span><b>{fmt(n * p, 2)} cm⁻⁶</b></div>
        {type === 'n' && <div><span><TeX math="N_D" /></span><b>{fmt(ND, 2)} cm⁻³</b></div>}
        {type === 'p' && <div><span><TeX math="N_A" /></span><b>{fmt(NA, 2)} cm⁻³</b></div>}
      </div>
      <p className="hint">
        Observe que <TeX math="n \cdot p = n_i^2" /> é mantido (lei de ação de massas) qualquer que seja a dopagem,
        desde que o semicondutor permaneça <i>não-degenerado</i> (E_F a pelo menos 3kT das bordas das bandas).
      </p>
    </div>
  );
}
