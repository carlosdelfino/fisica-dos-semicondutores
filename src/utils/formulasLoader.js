import { log_event } from '../physics/formulas.js';

/**
 * Carrega fórmulas dos arquivos JSON organizados por capítulo
 * Mapeia capítulos para categorias do menu existentes
 */

const CHAPTER_CATEGORIES = {
  '1': 'fundamentals',
  '2': 'fundamentals', 
  '3': 'quantumStatistics',
  '4': 'quantumStatistics',
  '5': 'devices',
  '6': 'devices',
  '7': 'devices',
  '8': 'devices',
  '9': 'devices',
  '10': 'devices',
  '11': 'devices',
  '12': 'devices',
  '13': 'devices',
  '14': 'devices'
};

const CHAPTER_TITLES = {
  '1': 'Atomic Structure and Quantum Mechanics',
  '2': 'Energy Bands and Current Carriers',
  '3': 'Intrinsic and Extrinsic Semiconductors',
  '4': 'Carrier Processes (Drift, Diffusion, G/R)',
  '5': 'The PN Junction Diode',
  '6': 'Fabrication Technology',
  '7': 'Limitations to Ideal Diode Theory',
  '8': 'Bipolar Transistors I',
  '9': 'Bipolar Transistors II',
  '10': 'Junction Field-Effect Transistors',
  '11': 'Metal-Semiconductor Junctions',
  '12': 'Metal-Oxide-Silicon Systems',
  '13': 'MOSFET',
  '14': 'Optoelectronics'
};

/**
 * Carrega todos os arquivos de fórmulas de um capítulo
 */
export async function loadChapterFormulas(chapter) {
  try {
    log_event('START', `Carregando fórmulas do capítulo ${chapter}`);
    
    // Tenta carregar o arquivo principal do capítulo
    const mainFile = `/formulas/Semiconductor Devices - Kanaan Kano/Semiconductor Devices - Kanaan Kano-${chapter}.json`;
    const response = await fetch(mainFile);
    
    if (!response.ok) {
      log_event('ERROR', `Falha ao carregar capítulo ${chapter}`, { status: response.status });
      return null;
    }
    
    const data = await response.json();
    log_event('SUCCESS', `Capítulo ${chapter} carregado`, { questions: data.questions?.length });
    return data;
  } catch (error) {
    log_event('ERROR', `Erro ao carregar capítulo ${chapter}`, { error: error.message });
    return null;
  }
}

/**
 * Carrega todos os capítulos disponíveis
 */
export async function loadAllChapters() {
  try {
    log_event('START', 'Carregando todos os capítulos');
    const chapters = [];
    
    for (let i = 1; i <= 14; i++) {
      const chapterData = await loadChapterFormulas(i);
      if (chapterData) {
        chapters.push({
          number: i,
          title: CHAPTER_TITLES[i] || `Chapter ${i}`,
          category: CHAPTER_CATEGORIES[i] || 'reference',
          data: chapterData
        });
      }
    }
    
    log_event('SUCCESS', 'Todos os capítulos carregados', { total: chapters.length });
    return chapters;
  } catch (error) {
    log_event('ERROR', 'Erro ao carregar capítulos', { error: error.message });
    return [];
  }
}

/**
 * Extrai todas as fórmulas de um capítulo
 */
export function extractFormulas(chapterData) {
  if (!chapterData || !chapterData.questions) return [];
  
  const formulas = [];
  chapterData.questions.forEach((question, qIndex) => {
    if (question.formulas) {
      question.formulas.forEach((formula, fIndex) => {
        formulas.push({
          id: `ch${chapterData.chapter}-q${qIndex}-f${fIndex}`,
          question: question.text,
          questionNumber: question.number,
          ...formula
        });
      });
    }
  });
  
  return formulas;
}

/**
 * Agrupa fórmulas por conceitos
 */
export function groupFormulasByConcept(formulas) {
  const grouped = {};
  
  formulas.forEach(formula => {
    if (formula.concepts) {
      formula.concepts.forEach(concept => {
        if (!grouped[concept]) {
          grouped[concept] = [];
        }
        grouped[concept].push(formula);
      });
    }
  });
  
  return grouped;
}

/**
 * Busca fórmulas por termo
 */
export function searchFormulas(formulas, searchTerm) {
  const term = searchTerm.toLowerCase();
  
  return formulas.filter(formula => {
    return (
      formula.genericFormula?.toLowerCase().includes(term) ||
      formula.description?.toLowerCase().includes(term) ||
      formula.concepts?.some(c => c.toLowerCase().includes(term)) ||
      formula.symbols?.some(s => s.symbol?.toLowerCase().includes(term))
    );
  });
}

/**
 * Mapeia fórmulas para componentes de visualização existentes
 */
export function mapFormulaToVisualization(formula) {
  const formulaLower = formula.genericFormula?.toLowerCase() || '';
  
  // Mapeamento baseado em palavras-chave na fórmula
  if (formulaLower.includes('fermi') || formulaLower.includes('e^(e-ef)')) {
    return 'fermi';
  }
  if (formulaLower.includes('density of states') || formulaLower.includes('gc(e)') || formulaLower.includes('gv(e)')) {
    return 'dos';
  }
  if (formulaLower.includes('ni') || formulaLower.includes('intrinsic')) {
    return 'arrhenius';
  }
  if (formulaLower.includes('band') || formulaLower.includes('ec') || formulaLower.includes('ev')) {
    return 'overview';
  }
  if (formulaLower.includes('k-space') || formulaLower.includes('e(k)')) {
    return 'kspace';
  }
  if (formulaLower.includes('effective mass') || formulaLower.includes('m*')) {
    return 'effmass';
  }
  
  return null;
}
