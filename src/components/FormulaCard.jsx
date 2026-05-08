import { TeX } from './Math.jsx';

export default function FormulaCard({ title, formula, description, derivation, color = 'cyan', compact = false }) {
  return (
    <div className={`formula-card formula-${color} ${compact ? 'compact' : ''}`}>
      {!compact && <h3>{title}</h3>}
      <div className="formula-body">
        <TeX math={formula} block={compact ? false : true} />
      </div>
      {!compact && description && <p className="formula-desc">{description}</p>}
      {!compact && derivation && (
        <details>
          <summary>Derivação</summary>
          <div className="formula-derivation">
            {derivation.map((step, i) => (
              <div key={i} className="derivation-step">
                {step.text && <p>{step.text}</p>}
                {step.tex && <TeX math={step.tex} block />}
              </div>
            ))}
          </div>
        </details>
      )}
    </div>
  );
}
