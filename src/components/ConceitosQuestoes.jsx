import { useState } from 'react';
import { TeX } from './Math.jsx';
import { MODULOS, TAB_LABELS } from '../physics/questoes.js';

/**
 * Apresenta cada questão do módulo selecionado com explicação didática completa,
 * key-points estruturados e fórmulas relacionadas. Sub-abas por MÓDULO.
 */
export default function ConceitosQuestoes({ onNavigate }) {
  const [moduloId, setModuloId] = useState(MODULOS[0].id);
  const modulo = MODULOS.find((m) => m.id === moduloId) || MODULOS[0];

  return (
    <div className="diagram-card">
      <h3>📖 Conceitos das Questões — guia de estudo</h3>

      <nav className="sub-tabs">
        {MODULOS.map((m) => (
          <button key={m.id}
                  className={`sub-tab ${moduloId === m.id ? 'active' : ''}`}
                  onClick={() => setModuloId(m.id)}>
            {m.icon} {m.shortLabel || m.label}
          </button>
        ))}
      </nav>

      <p style={{ color: '#94a3b8', fontSize: 13, marginTop: 0 }}>
        <b>{modulo.label}</b> — {modulo.description} As <b>{modulo.questoes.length} questões</b>
        {' '}deste módulo são as exigências mínimas para dominá-lo. Após estudar, vá para a aba
        <b> ❓ Questões</b> para se auto-testar.
      </p>

      <ol className="concepts-list">
        {modulo.questoes.map((q, i) => (
          <li key={q.id} className={`concept-item depth-${q.depth}`}>
            <div className="concept-header">
              <span className="concept-num">{i + 1}</span>
              <h4>{q.question}</h4>
              <span className={`concept-badge ${q.depth}`}>
                {q.depth === 'conceitual' ? '🧠 Conceitual' : '🧮 Matemático'}
              </span>
            </div>

            <div className="concept-summary">
              <b>Resposta-modelo: </b>
              {q.shortAnswer}
            </div>

            <div className="concept-keys">
              <b>Pontos-chave para estruturar a resposta:</b>
              <ul>
                {q.keyPoints.map((kp, j) => (
                  <li key={j}>{kp}</li>
                ))}
              </ul>
            </div>

            {q.formulas && q.formulas.length > 0 && (
              <div className="concept-formulas">
                <b>Fórmulas relacionadas:</b>
                {q.formulas.map((f, j) => (
                  <div key={j} className="concept-formula-item">
                    <TeX block math={f} />
                  </div>
                ))}
              </div>
            )}

            {q.tabs && q.tabs.length > 0 && (
              <div className="concept-tabs">
                <b>Veja interativamente em: </b>
                {q.tabs.map((t) => (
                  <button key={t} className="concept-tab-btn"
                          onClick={() => onNavigate?.(t)}>
                    → {TAB_LABELS[t] || t}
                  </button>
                ))}
              </div>
            )}
          </li>
        ))}
      </ol>

      <div style={{ background: 'rgba(2,6,23,0.6)', padding: 14, borderRadius: 8,
                    marginTop: 16, fontSize: 13, color: '#cbd5e1' }}>
        <p style={{ margin: 0 }}>
          <b>Dica de estudo:</b> formule cada resposta primeiro <i>com suas próprias palavras</i>,
          depois compare com a "Resposta-modelo" acima. Use os <b>pontos-chave</b> como roteiro
          para uma resposta dissertativa completa. Se algum ponto parecer obscuro,
          clique nos botões <i>"Veja interativamente em…"</i>.
        </p>
      </div>
    </div>
  );
}
