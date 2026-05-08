import { useState } from 'react';
import { log_event } from '../physics/formulas.js';

/**
 * Componente base para gráficos educacionais interativos
 * Fornece estrutura comum para visualizações de fórmulas
 */
export default function EducationalGraph({ 
  title, 
  formula, 
  description, 
  children, 
  onFormulaClick,
  showControls = true 
}) {
  const [showDerivation, setShowDerivation] = useState(false);

  const handleFormulaClick = () => {
    if (onFormulaClick) {
      onFormulaClick();
      log_event('DATA', 'Fórmula clicada no gráfico', { title });
    }
  };

  return (
    <div className="educational-graph">
      <div className="graph-header">
        <h3>{title}</h3>
        {formula && (
          <button 
            className="formula-toggle-btn"
            onClick={() => setShowDerivation(!showDerivation)}
          >
            {showDerivation ? '📖 Ocultar Fórmula' : '📐 Ver Fórmula'}
          </button>
        )}
      </div>

      {description && (
        <p className="graph-description">{description}</p>
      )}

      {formula && showDerivation && (
        <div className="graph-formula" onClick={handleFormulaClick}>
          <div className="formula-content">
            {formula}
          </div>
        </div>
      )}

      <div className="graph-content">
        {children}
      </div>

      {showControls && (
        <div className="graph-controls">
          {/* Controles específicos serão fornecidos pelos componentes filhos */}
        </div>
      )}
    </div>
  );
}
