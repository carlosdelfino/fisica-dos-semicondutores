import { useNavigate } from 'react-router-dom';
import { log_event } from '../physics/formulas.js';

/**
 * Componente de navegação cruzada para fórmulas relacionadas
 * Permite navegar entre visualizações e fórmulas correspondentes
 */
export default function FormulaNavigation({ 
  currentPanel, 
  relatedFormulas = [], 
  showEducational = true 
}) {
  const navigate = useNavigate();

  const handleNavigateToFormulas = () => {
    log_event('DATA', 'Navegando para painel de fórmulas', { from: currentPanel });
    navigate('/formulas');
  };

  const handleNavigateToEducational = (eduComponent) => {
    log_event('DATA', 'Navegando para gráfico educacional', { component: eduComponent });
    // Navega para o painel atual com parâmetro para mostrar componente educacional
    navigate(`/${currentPanel}?edu=${eduComponent}`);
  };

  return (
    <div className="formula-navigation">
      <div className="nav-header">
        <h4>🔗 Fórmulas Relacionadas</h4>
      </div>
      
      <div className="nav-content">
        <button 
          className="nav-btn primary-nav"
          onClick={handleNavigateToFormulas}
        >
          📐 Ver Todas as Fórmulas
        </button>

        {showEducational && (
          <div className="educational-nav">
            <span className="nav-label">📊 Gráficos Educacionais:</span>
            <div className="edu-buttons">
              <button 
                className="nav-btn edu-nav"
                onClick={() => handleNavigateToEducational('fermi-dirac')}
              >
                Fermi-Dirac
              </button>
              <button 
                className="nav-btn edu-nav"
                onClick={() => handleNavigateToEducational('dos')}
              >
                Densidade de Estados
              </button>
              <button 
                className="nav-btn edu-nav"
                onClick={() => handleNavigateToEducational('carrier-concentration')}
              >
                Concentração de Portadores
              </button>
            </div>
          </div>
        )}

        {relatedFormulas.length > 0 && (
          <div className="related-formulas">
            <span className="nav-label">Fórmulas específicas:</span>
            <div className="formula-tags">
              {relatedFormulas.map((formula, index) => (
                <button 
                  key={index}
                  className="formula-tag"
                  onClick={() => navigate(`/formulas?search=${formula}`)}
                >
                  {formula}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
