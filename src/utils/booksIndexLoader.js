/**
 * Utilitário para carregar metadados de livros do index.json global
 * Permite carregamento dinâmico em vez de manter registros estáticos
 */

let cachedIndex = null;
let cacheTimestamp = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

/**
 * Carrega o index.json global de livros processados
 * @returns {Promise<Object>} Objeto com metadados de todos os livros
 */
export async function loadBooksIndex() {
  const now = Date.now();
  
  // Retornar cache se ainda válido
  if (cachedIndex && cacheTimestamp && (now - cacheTimestamp) < CACHE_DURATION) {
    return cachedIndex;
  }
  
  try {
    const response = await fetch('/formulas/index.json');
    if (!response.ok) {
      throw new Error(`Failed to load books index: ${response.status}`);
    }
    
    const index = await response.json();
    cachedIndex = index;
    cacheTimestamp = now;
    
    return index;
  } catch (error) {
    console.error('Error loading books index:', error);
    // Retornar objeto vazio em caso de erro
    return {};
  }
}

/**
 * Obtém metadados de um livro específico pelo nome
 * @param {string} bookName - Nome do livro (diretório)
 * @returns {Promise<Object|null>} Metadados do livro ou null se não encontrado
 */
export async function getBookMetadata(bookName) {
  const index = await loadBooksIndex();
  return index[bookName] || null;
}

/**
 * Obtém lista de todos os livros disponíveis
 * @returns {Promise<Array<string>>} Array com nomes dos livros
 */
export async function getAvailableBooks() {
  const index = await loadBooksIndex();
  return Object.keys(index);
}

/**
 * Formata a fonte completa da fórmula baseada em metadados dinâmicos
 * @param {Object} formula - Objeto da fórmula
 * @param {string} bookName - Nome do livro
 * @returns {Promise<string>} String formatada com fonte da fórmula
 */
export async function formatFormulaSource(formula, bookName) {
  const metadata = await getBookMetadata(bookName);
  const parts = [];
  
  if (metadata) {
    parts.push(`${metadata.title} - ${metadata.author}`);
    if (metadata.publisher && metadata.publisher !== 'Unknown') {
      parts.push(metadata.publisher);
    }
    if (metadata.edition && metadata.edition !== 'Unknown') {
      parts.push(`${metadata.edition}ª Ed.`);
    }
    if (metadata.year && metadata.year !== 'Unknown') {
      parts.push(metadata.year);
    }
  } else {
    // Fallback para dados do próprio objeto se metadata não disponível
    if (formula.bookTitle) {
      parts.push(formula.bookTitle);
    }
    if (formula.author) {
      parts.push(formula.author);
    }
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
 * Invalida o cache forçando recarregamento
 */
export function invalidateCache() {
  cachedIndex = null;
  cacheTimestamp = null;
}
