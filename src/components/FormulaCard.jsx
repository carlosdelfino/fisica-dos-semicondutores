import { TeX } from './Math.jsx';

export default function FormulaCard({ title, formula, description, derivation, color = 'cyan' }) {
  return (
    <div className={`formula-card formula-${color}`}>
      <h3>{title}</h3>
      <div className="formula-body">
        <TeX math={formula} block />
      </div>
      {description && <p className="formula-desc">{description}</p>}
      {derivation && (
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
