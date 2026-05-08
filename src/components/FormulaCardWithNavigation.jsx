import FormulaCard from './FormulaCard.jsx';
import { mapFormulaToVisualization } from '../utils/formulasLoader.js';
import { log_event } from '../physics/formulas.js';

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
 * Componente de card de fórmula com navegação para visualizações
 * Permite ligação cruzada entre fórmulas e painéis de visualização
 */
export default function FormulaCardWithNavigation({ formula, onNavigate, onSelect, compact = false, bookName = '' }) {
  const vizRoute = mapFormulaToVisualization(formula);

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

      {bookName && !compact && (
        <div className="formula-source-preview">
          <small>
            📖 {formatFormulaSource(formula, bookName)}
          </small>
        </div>
      )}
    </div>
  );
}
