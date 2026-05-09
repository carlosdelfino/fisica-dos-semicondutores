import FormulaCard from './FormulaCard.jsx';
import { mapFormulaToVisualization } from '../utils/formulasLoader.js';
import { log_event } from '../physics/formulas.js';
import { formatFormulaSource as formatFormulaSourceDynamic } from '../utils/booksIndexLoader.js';
import { useState, useEffect } from 'react';

/**
 * Componente de card de fórmula com navegação para visualizações
 * Permite ligação cruzada entre fórmulas e painéis de visualização
 */
export default function FormulaCardWithNavigation({ formula, onNavigate, onSelect, compact = false, bookName = '' }) {
  const [sourceText, setSourceText] = useState('');
  const vizRoute = mapFormulaToVisualization(formula);

  useEffect(() => {
    // Carregar fonte de forma assíncrona
    formatFormulaSourceDynamic(formula, bookName).then(setSourceText).catch(() => {
      // Fallback para formatação estática em caso de erro
      const parts = [];
      
      if (formula.bookTitle) {
        parts.push(formula.bookTitle);
      }
      if (formula.author) {
        parts.push(formula.author);
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
      
      setSourceText(parts.length > 0 ? parts.join(' • ') : 'Fonte não disponível');
    });
  }, [formula, bookName]);

  const handleNavigate = () => {
    if (onNavigate) {
      onNavigate(formula);
    }
  };

  const handleSelect = () => {
    if (onSelect) {
      onSelect(formula);
      log_event('DATA', 'Fórmula selecionada', { id: formula.id });
    }
  };

  return (
    <div className={`formula-card-with-nav ${compact ? 'compact' : ''}`}>
      <FormulaCard
        title={formula.questionNumber || formula.id}
        color="cyan"
        formula={formula.genericFormula || formula.originalFormula}
        description={formula.description}
        compact={compact}
      />
      
      <div className="formula-nav-actions">
        {vizRoute && (
          <button 
            className="formula-nav-btn visualize-btn"
            onClick={handleNavigate}
            title="Ver visualização interativa"
          >
            📊 Visualizar
          </button>
        )}
        <button 
          className="formula-nav-btn select-btn"
          onClick={handleSelect}
          title="Selecionar fórmula"
        >
          📌 Selecionar
        </button>
      </div>

      {formula.symbols && formula.symbols.length > 0 && !compact && (
        <div className="formula-symbols-preview">
          <strong>Símbolos:</strong> {formula.symbols.map(s => s.symbol).join(', ')}
        </div>
      )}

      {formula.concepts && formula.concepts.length > 0 && !compact && (
        <div className="formula-concepts-preview">
          <strong>Conceitos:</strong> {formula.concepts.join(', ')}
        </div>
      )}

      {bookName && !compact && sourceText && (
        <div className="formula-source-preview">
          <small>
            📖 {sourceText}
          </small>
        </div>
      )}
    </div>
  );
}
