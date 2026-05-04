import { MATERIALS } from '../physics/materials.js';
import { useTranslation } from '../contexts/LanguageContext.jsx';

export default function Controls({
  material, setMaterial,
  type, setType,
  T, setT,
  ND, setND,
  NA, setNA,
  EFOverride, setEFOverride,
}) {
  const { t } = useTranslation();
  return (
    <div className="controls">
      <div className="control-group">
        <label>{t('controls.material')}</label>
        <select value={material} onChange={(e) => setMaterial(e.target.value)}>
          {Object.entries(MATERIALS).map(([k, v]) => (
            <option key={k} value={k}>{v.name}</option>
          ))}
        </select>
      </div>

      <div className="control-group">
        <label>{t('controls.dopingType')}</label>
        <div className="radio-row">
          {[
            { v: 'intrinsic', l: t('controls.intrinsic'), c: '#94a3b8' },
            { v: 'n', l: t('controls.ntype'),     c: '#22c55e' },
            { v: 'p', l: t('controls.ptype'),     c: '#a855f7' },
          ].map((opt) => (
            <label key={opt.v} className={`radio-btn ${type === opt.v ? 'active' : ''}`}
                   style={{ '--accent': opt.c }}>
              <input type="radio" name="type" value={opt.v}
                     checked={type === opt.v}
                     onChange={() => setType(opt.v)} />
              {opt.l}
            </label>
          ))}
        </div>
      </div>

      <div className="control-group">
        <label>{t('controls.temperature')}: <b>{T} K</b> ({(T - 273.15).toFixed(0)} °C)</label>
        <input type="range" min="10" max="1000" step="5"
               value={T} onChange={(e) => setT(Number(e.target.value))} />
      </div>

      {type === 'n' && (
        <div className="control-group">
          <label>{t('controls.donorConcentration')}: <b>{ND.toExponential(1)} cm⁻³</b></label>
          <input type="range" min="13" max="19" step="0.1"
                 value={Math.log10(ND)}
                 onChange={(e) => setND(Math.pow(10, Number(e.target.value)))} />
        </div>
      )}

      {type === 'p' && (
        <div className="control-group">
          <label>{t('controls.acceptorConcentration')}: <b>{NA.toExponential(1)} cm⁻³</b></label>
          <input type="range" min="13" max="19" step="0.1"
                 value={Math.log10(NA)}
                 onChange={(e) => setNA(Math.pow(10, Number(e.target.value)))} />
        </div>
      )}

      <div className="control-group">
        <label>
          <input type="checkbox" checked={EFOverride.enabled}
                 onChange={(e) => setEFOverride({ ...EFOverride, enabled: e.target.checked })} />
          {' '}{t('controls.manualFermi')}: <b>{EFOverride.value.toFixed(3)}</b>
        </label>
        <input type="range" min="-1" max="1" step="0.01"
               disabled={!EFOverride.enabled}
               value={EFOverride.value}
               onChange={(e) => setEFOverride({ ...EFOverride, value: Number(e.target.value) })} />
      </div>
    </div>
  );
}
