import { useState } from 'react';
import { TeX } from './Math.jsx';
import { MODULOS, TAB_LABELS } from '../physics/questoes.js';
import { useTranslation } from '../contexts/LanguageContext.jsx';

/**
 * Apresenta as questões em modo flashcard com sub-abas por MÓDULO.
 *   - Intro à Física dos Semi.   (9 questões)
 *   - Componentes PN             (8 questões)
 *   - Futuros: BJT, MOSFET, ...
 */
export default function Questoes({ onNavigate }) {
  const { t } = useTranslation();
  const [moduloId, setModuloId] = useState(MODULOS[0].id);
  const [revealed, setRevealed] = useState({});
  const [scored,   setScored]   = useState({});
  const [mode,     setMode]     = useState('one');
  const [current,  setCurrent]  = useState(0);

  const modulo = MODULOS.find((m) => m.id === moduloId) || MODULOS[0];
  const questoes = modulo.questoes;
  const total = questoes.length;

  const stats = {
    ok: questoes.filter((q) => scored[q.id] === 'ok').length,
    no: questoes.filter((q) => scored[q.id] === 'no').length,
  };

  const toggleReveal = (id) => setRevealed((s) => ({ ...s, [id]: !s[id] }));
  const setScore = (id, v) => setScored((s) => ({ ...s, [id]: s[id] === v ? null : v }));
  const resetAll = () => { setRevealed({}); setScored({}); setCurrent(0); };
  const switchModulo = (id) => { setModuloId(id); setCurrent(0); };

  const renderCard = (q, i) => {
    const open = !!revealed[q.id];
    const sc = scored[q.id];
    return (
      <article key={q.id} className={`question-card ${sc === 'ok' ? 'ok' : sc === 'no' ? 'no' : ''}`}>
        <header className="question-header">
          <span className="question-num">Q{i + 1}</span>
          <h4>{q.question}</h4>
        </header>

        {!open ? (
          <div className="question-prompt">
            <p style={{ color: '#94a3b8', fontSize: 13, marginTop: 6 }}>
              <b>{t('questions.card.prompt1')}</b><br />
              <b>{t('questions.card.prompt2')}</b><br />
              <b>{t('questions.card.prompt3')}</b>
            </p>
            <button className="question-btn-primary" onClick={() => toggleReveal(q.id)}>
              {t('questions.card.show')}
            </button>
          </div>
        ) : (
          <div className="question-answer">
            <div className="answer-summary">
              <b>{t('questions.card.modelAnswer')} </b>{q.shortAnswer}
            </div>

            <div className="answer-keys">
              <b>{t('questions.card.keyPoints')}</b>
              <ul>
                {q.keyPoints.map((kp, j) => <li key={j}>{kp}</li>)}
              </ul>
            </div>

            {q.formulas && q.formulas.length > 0 && (
              <div className="answer-formulas">
                {q.formulas.map((f, j) => (
                  <div key={j} className="concept-formula-item">
                    <TeX block math={f} />
                  </div>
                ))}
              </div>
            )}

            {q.tabs && q.tabs.length > 0 && (
              <div className="concept-tabs" style={{ marginTop: 8 }}>
                <b>{t('questions.card.demos')} </b>
                {q.tabs.map((tb) => (
                  <button key={tb} className="concept-tab-btn"
                          onClick={() => onNavigate?.(tb)}>
                    → {t(`menu.items.${tb}`) !== `menu.items.${tb}` ? t(`menu.items.${tb}`) : (TAB_LABELS[tb] || tb)}
                  </button>
                ))}
              </div>
            )}

            <div className="question-score">
              <span style={{ color: '#cbd5e1', fontSize: 13 }}>{t('questions.card.score')}</span>
              <button className={`score-btn ok ${sc === 'ok' ? 'active' : ''}`}
                      onClick={() => setScore(q.id, 'ok')}>
                {t('questions.card.scoreOk')}
              </button>
              <button className={`score-btn no ${sc === 'no' ? 'active' : ''}`}
                      onClick={() => setScore(q.id, 'no')}>
                {t('questions.card.scoreNo')}
              </button>
              <button className="score-btn" onClick={() => toggleReveal(q.id)}>
                {t('questions.card.hide')}
              </button>
            </div>
          </div>
        )}
      </article>
    );
  };

  return (
    <div className="diagram-card">
      <h3>{t('questions.title')}</h3>

      {/* Sub-abas por MÓDULO */}
      <nav className="sub-tabs">
        {MODULOS.map((m) => (
          <button key={m.id}
                  className={`sub-tab ${moduloId === m.id ? 'active' : ''}`}
                  onClick={() => switchModulo(m.id)}>
            {m.icon} {m.shortLabel || m.label}
          </button>
        ))}
      </nav>
      <p style={{ color: '#94a3b8', fontSize: 13, marginTop: 0 }}>{modulo.description}</p>

      {/* Barra de controle */}
      <div className="questions-toolbar">
        <div className="questions-mode">
          <button className={`mode-btn ${mode === 'one' ? 'active' : ''}`}
                  onClick={() => setMode('one')}>
            {t('questions.modeOne')}
          </button>
          <button className={`mode-btn ${mode === 'all' ? 'active' : ''}`}
                  onClick={() => setMode('all')}>
            {t('questions.modeAll')} ({total})
          </button>
        </div>

        <div className="questions-stats">
          <span style={{ color: '#22c55e' }}>✅ {stats.ok}</span>
          <span style={{ color: '#ef4444' }}>❌ {stats.no}</span>
          <span style={{ color: '#94a3b8' }}>· {total - stats.ok - stats.no} {t('questions.stats.pending')}</span>
          <button className="mode-btn" onClick={resetAll} title={t('questions.stats.resetTitle')}>
            {t('questions.stats.reset')}
          </button>
        </div>
      </div>

      {mode === 'one' ? (
        <>
          <div className="questions-progress">
            <span>{t('questions.progress', { current: current + 1, total })}</span>
            <div className="progress-bar">
              <div className="progress-fill"
                   style={{ width: `${((current + 1) / total) * 100}%` }} />
            </div>
          </div>

          {renderCard(questoes[Math.min(current, total - 1)], Math.min(current, total - 1))}

          <div className="questions-nav">
            <button className="nav-btn" disabled={current === 0}
                    onClick={() => setCurrent((c) => Math.max(0, c - 1))}>
              {t('questions.nav.previous')}
            </button>
            <button className="nav-btn primary"
                    disabled={current >= total - 1}
                    onClick={() => setCurrent((c) => Math.min(total - 1, c + 1))}>
              {t('questions.nav.next')}
            </button>
          </div>
        </>
      ) : (
        <div className="questions-list">
          {questoes.map((q, i) => renderCard(q, i))}
        </div>
      )}

      <div style={{ background: 'rgba(2,6,23,0.6)', padding: 14, borderRadius: 8,
                    marginTop: 16, fontSize: 13, color: '#cbd5e1' }}>
        <p style={{ margin: 0 }}>
          <b>{t('questions.usage.title')}</b> {t('questions.usage.body')} <b>{t('menu.items.conceptsQ')}</b>.
        </p>
      </div>
    </div>
  );
}
