import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import KaTeX from 'katex';
import 'katex/dist/katex.min.css';

/**
 * Mapeamento de livros para autores e títulos completos
 */
const BOOK_METADATA = {
  'Semiconductor physics and devices - Basic - Donald A. Neamen': {
    title: 'Semiconductor Physics and Devices - Basic',
    author: 'Donald A. Neamen'
  },
  'Semiconductor Devices - Kanaan Kano': {
    title: 'Semiconductor Devices',
    author: 'Kanaan Kano'
  }
};

/**
 * Função para formatar a fonte completa da fórmula
 */
function formatFormulaSource(formula, bookName) {
  const metadata = BOOK_METADATA[bookName];
  const parts = [];
  
  if (metadata) {
    parts.push(`${metadata.title} - ${metadata.author}`);
  }
  
  if (formula.chapter) {
    parts.push(`Cap. ${formula.chapter}`);
  }
  
  if (formula.section) {
    parts.push(`Seção: ${formula.section}`);
  }
  
  if (formula.page) {
    parts.push(`p. ${formula.page}`);
  }
  
  if (formula.source === 'question' && formula.questionNumber) {
    parts.push(`Q${formula.questionNumber}`);
  } else if (formula.source === 'answer' && formula.questionNumber) {
    parts.push(`A${formula.questionNumber}`);
  }
  
  return parts.length > 0 ? parts.join(' • ') : 'Fonte não disponível';
}

/**
 * Componente base para painéis de gráficos educacionais de fórmulas
 * 
 * Este componente fornece a estrutura básica para visualização de fórmulas
 * com gráficos interativos, incluindo navegação bidirecional entre fórmulas e gráficos.
 */
const FormulaGraphPanel = ({ 
  graphId, 
  formula, 
  onClose, 
  showFormulaDetails = true,
  bookName = ''
}) => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const [showDetails, setShowDetails] = useState(showFormulaDetails);
  const [animationPhase, setAnimationPhase] = useState(0);

  useEffect(() => {
    // Animação de entrada
    const interval = setInterval(() => {
      setAnimationPhase(prev => Math.min(prev + 1, 3));
    }, 300);
    return () => clearInterval(interval);
  }, []);

  const handleBackToFormula = () => {
    if (formula) {
      // Navega de volta para a fórmula
      navigate('/exercises', { 
        state: { 
          selectedFormula: formula,
          fromGraph: graphId 
        } 
      });
    } else {
      onClose();
    }
  };

  const renderLatex = (latex) => {
    if (typeof latex === 'string') {
      try {
        return <span dangerouslySetInnerHTML={{ __html: KaTeX.renderToString(latex) }} />;
      } catch (e) {
        return <span>{latex}</span>;
      }
    }
    return null;
  };

  return (
    <div className="formula-graph-panel">
      <div className="graph-header">
        <button 
          className="back-button"
          onClick={handleBackToFormula}
          title={t('common.back')}
        >
          ← {t('common.back')}
        </button>
        <h2 className="graph-title">
          {t(`graphs.${graphId}.title`) || `Graph: ${graphId}`}
        </h2>
        <button 
          className="close-button"
          onClick={onClose}
          title={t('common.close')}
        >
          ×
        </button>
      </div>

      <div className="graph-content">
        <div className="graph-visualization">
          {/* O gráfico específico será renderizado aqui */}
          <div className="graph-placeholder">
            <p>Gráfico para: {graphId}</p>
            {formula && (
              <div className="formula-preview">
                {renderLatex(formula.genericFormula)}
              </div>
            )}
          </div>
        </div>

        {showDetails && formula && (
          <div className="formula-details-panel">
            <div className="details-header">
              <h3>{t('graphs.details')}</h3>
              <button 
                className="toggle-details"
                onClick={() => setShowDetails(!showDetails)}
              >
                {showDetails ? '▼' : '▶'}
              </button>
            </div>
            
            <div className="details-content">
              <div className="formula-display">
                <h4>{t('graphs.formula')}</h4>
                <div className="formula-original">
                  {renderLatex(formula.originalFormula)}
                </div>
                <div className="formula-generic">
                  {renderLatex(formula.genericFormula)}
                </div>
              </div>

              {formula.description && (
                <div className="formula-description">
                  <h4>{t('graphs.description')}</h4>
                  <p>{formula.description}</p>
                </div>
              )}

              {formula.concepts && formula.concepts.length > 0 && (
                <div className="formula-concepts">
                  <h4>{t('graphs.concepts')}</h4>
                  <div className="concepts-list">
                    {formula.concepts.map((concept, index) => (
                      <span key={index} className="concept-tag">
                        {concept}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {formula.symbols && formula.symbols.length > 0 && (
                <div className="formula-symbols">
                  <h4>{t('graphs.symbols')}</h4>
                  <div className="symbols-table">
                    <table>
                      <thead>
                        <tr>
                          <th>{t('graphs.symbol')}</th>
                          <th>{t('graphs.description')}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {formula.symbols.map((symbol, index) => (
                          <tr key={index}>
                            <td className="symbol-math">
                              {renderLatex(symbol.symbol)}
                            </td>
                            <td>{symbol.description}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              <div className="formula-source">
                <small>
                  📖 {formatFormulaSource(formula, bookName)}
                </small>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="graph-controls">
        <button 
          className="control-button"
          onClick={() => setShowDetails(!showDetails)}
        >
          {showDetails ? t('graphs.hideDetails') : t('graphs.showDetails')}
        </button>
        <button 
          className="control-button"
          onClick={() => {
            // Reiniciar animação
            setAnimationPhase(0);
          }}
        >
          {t('graphs.replayAnimation')}
        </button>
      </div>
    </div>
  );
};

export default FormulaGraphPanel;
