import { useState } from 'react';
import DepletionLayer from './DepletionLayer.jsx';
import DiffusionDrift from './DiffusionDrift.jsx';
import NonUniformDoping from './NonUniformDoping.jsx';
import EinsteinRelation from './EinsteinRelation.jsx';
import DegenerateNonDegenerate from './DegenerateNonDegenerate.jsx';

/**
 * Aba mestre de junção PN: agrupa em sub-abas os cinco tópicos principais
 * do capítulo "Introdução aos Componentes PN".
 */
const SUBS = [
  { id: 'depletion',   label: '🔻 Depleção' },
  { id: 'diffusion',   label: '🌊 Difusão × Drift' },
  { id: 'nonuniform',  label: '📈 Dopagem Não-Uniforme' },
  { id: 'einstein',    label: '🔗 Relação de Einstein' },
  { id: 'degenerate',  label: '🪙 Degenerado × Não-deg.' },
];

export default function JunctionPN() {
  const [sub, setSub] = useState('depletion');

  return (
    <div className="diagram-card">
      <h3>⚡ Junção PN — simulações interativas</h3>
      <p style={{ color: '#94a3b8', fontSize: 13, marginTop: 0 }}>
        Explore as cinco facetas da junção PN: formação da camada de depleção, equilíbrio
        entre difusão e drift, campo embutido em dopagem não-uniforme, relação de Einstein
        e o limite degenerado. Cada sub-aba tem controles próprios (N<sub>a</sub>, N<sub>d</sub>,
        T, V<sub>a</sub>).
      </p>

      <nav className="sub-tabs">
        {SUBS.map((s) => (
          <button key={s.id}
                  className={`sub-tab ${sub === s.id ? 'active' : ''}`}
                  onClick={() => setSub(s.id)}>
            {s.label}
          </button>
        ))}
      </nav>

      {sub === 'depletion'   && <DepletionLayer />}
      {sub === 'diffusion'   && <DiffusionDrift />}
      {sub === 'nonuniform'  && <NonUniformDoping />}
      {sub === 'einstein'    && <EinsteinRelation />}
      {sub === 'degenerate'  && <DegenerateNonDegenerate />}
    </div>
  );
}
