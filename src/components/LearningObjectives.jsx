import { useTranslation } from '../contexts/LanguageContext.jsx';

/**
 * Roteiro de estudo: 8 perguntas que o aluno deve ser capaz de responder
 * após interagir com o sistema, cada uma com botão "Ir para a aba" que
 * conduz ao componente correspondente.
 */
const OBJECTIVE_IDS = ['q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'q7', 'q8'];
const OBJECTIVE_TABS = {
  q1: ['allowed', 'kp', 'atomband'],
  q2: ['atomband'],
  q3: ['kspace', 'effmass'],
  q4: ['particles', 'lattice'],
  q5: ['kspace'],
  q6: ['mis'],
  q7: ['dos'],
  q8: ['fermi']
};

export default function LearningObjectives({ onNavigate, completed = {} }) {
  const { t } = useTranslation();

  return (
    <div className="diagram-card">
      <h3>{t('learningObjectives.title')}</h3>
      <p style={{ color: '#94a3b8', fontSize: 13, marginTop: 0 }}>
        {t('learningObjectives.intro')}
      </p>

      <ol className="objectives-list">
        {OBJECTIVE_IDS.map((id, i) => {
          const hints = t(`learningObjectives.items.${id}.hints`);
          const hintsArray = Array.isArray(hints) ? hints : [];
          const tabs = OBJECTIVE_TABS[id] || [];
          return (
            <li key={id} className={`objective-item ${completed[id] ? 'done' : ''}`}>
              <div className="objective-header">
                <span className="objective-num">{i + 1}</span>
                <h4>{t(`learningObjectives.items.${id}.title`)}</h4>
              </div>
              <ul className="objective-hints">
                {hintsArray.map((h, j) => (
                  <li key={j}>{h}</li>
                ))}
              </ul>
              <div className="objective-actions">
                {tabs.map((tab) => (
                  <button key={tab} className="objective-btn"
                          onClick={() => onNavigate?.(tab)}>
                    → {t(`menu.items.${tab}`)}
                  </button>
                ))}
              </div>
            </li>
          );
        })}
      </ol>

      <div style={{ background: 'rgba(2,6,23,0.6)', padding: 14, borderRadius: 8,
                    marginTop: 16, fontSize: 13, color: '#cbd5e1' }}>
        <p style={{ margin: 0 }}>
          <b>{t('learningObjectives.selfAssessment')}</b> {t('learningObjectives.selfAssessmentBody')}
        </p>
      </div>
    </div>
  );
}
