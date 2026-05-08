/**
 * Sistema de Taxonomia Dinâmica para Fórmulas
 * 
 * Este sistema categoriza automaticamente as fórmulas com base em seus conceitos e descrições,
 * permitindo uma organização dinâmica em três categorias principais:
 * - Física Quântica
 * - Mecânica Quântica  
 * - Física dos Semicondutores
 */

export const TAXONOMY_CATEGORIES = {
  QUANTUM_PHYSICS: {
    id: 'quantum-physics',
    name: 'Física Quântica',
    nameEn: 'Quantum Physics',
    nameAr: 'الفيزياء الكمومية',
    nameHi: 'क्वांटम भौतिकी',
    nameZh: '量子物理',
    icon: '⚛️',
    concepts: [
      'energia do fóton',
      'fóton',
      'efeito fotoelétrico',
      'equivalência massa-energia',
      'relatividade',
      'velocidade da luz',
      'constante de planck',
      'radiação eletromagnética',
      'quantum',
      'quântica'
    ],
    description: 'Conceitos fundamentais da física quântica, incluindo a natureza da luz, fótons e radiação eletromagnética.',
    graphPanels: ['PhotonEnergyGraph', 'PhotoelectricEffectGraph', 'MassEnergyEquivalenceGraph']
  },
  QUANTUM_MECHANICS: {
    id: 'quantum-mechanics',
    name: 'Mecânica Quântica',
    nameEn: 'Quantum Mechanics',
    nameAr: 'ميكانيكا الكم',
    nameHi: 'क्वांटम मैकेनिक्स',
    nameZh: '量子力学',
    icon: '🔬',
    concepts: [
      'princípio da incerteza',
      'incerteza de heisenberg',
      'equação de schrödinger',
      'função de onda',
      'dualidade onda-partícula',
      'comprimento de onda de de broglie',
      'quantização de energia',
      'números quânticos',
      'densidade de estados',
      'estado quântico',
      'partícula em uma caixa',
      'poço de potencial',
      'mecânica quântica'
    ],
    description: 'Princípios fundamentais da mecânica quântica, incluindo equação de Schrödinger, princípio da incerteza e dualidade onda-partícula.',
    graphPanels: [
      'HeisenbergUncertaintyGraph',
      'SchrodingerEquationGraph',
      'DeBroglieWavelengthGraph',
      'WaveFunctionGraph',
      'DensityOfStatesGraph',
      'QuantumWellGraph'
    ]
  },
  SEMICONDUCTOR_PHYSICS: {
    id: 'semiconductor-physics',
    name: 'Física dos Semicondutores',
    nameEn: 'Semiconductor Physics',
    nameAr: 'فيزياء أشباه الموصلات',
    nameHi: 'सेमीकंडक्टर भौतिकी',
    nameZh: '半导体物理',
    icon: '⚡',
    concepts: [
      'semicondutor',
      'bandas de energia',
      'bandgap',
      'densidade de portadores',
      'portadores intrínsecos',
      'portadores extrínsecos',
      'dopagem',
      'nível de fermi',
      'massa efetiva',
      'junção pn',
      'dispositivos semicondutores',
      'transistor',
      'diodo',
      'mobility',
      'condutividade',
      'banda de condução',
      'banda de valência'
    ],
    description: 'Física de semicondutores, incluindo bandas de energia, portadores de carga, dopagem e dispositivos.',
    graphPanels: [
      'BandStructureGraph',
      'CarrierDensityGraph',
      'FermiLevelGraph',
      'EffectiveMassGraph',
      'PNJunctionGraph',
      'CarrierTransportGraph',
      'DopingGraph'
    ]
  }
};

/**
 * Mapeamento de fórmulas para painéis de gráficos
 * Cada fórmula pode ter um ou mais painéis de visualização associados
 */
export const FORMULA_TO_GRAPH_MAP = {
  // Fórmulas de Física Quântica
  'E = hv': ['PhotonEnergyGraph'],
  'E = hf': ['PhotonEnergyGraph'],
  'E = mc^2': ['MassEnergyEquivalenceGraph'],
  'λ = hc/E': ['PhotonEnergyGraph'],
  
  // Fórmulas de Mecânica Quântica
  'Δp Δx ≥ ℏ/2': ['HeisenbergUncertaintyGraph'],
  'ΔE Δt ≥ ℏ/2': ['HeisenbergUncertaintyGraph'],
  'λ = h/p': ['DeBroglieWavelengthGraph'],
  'p = mv': ['DeBroglieWavelengthGraph'],
  'E = h²n²/(8mL²)': ['QuantumWellGraph'],
  'g(E) = (4π(2m)^(3/2))/ℏ³ √E': ['DensityOfStatesGraph'],
  
  // Fórmulas de Semicondutores
  'n_i² = N_c N_v e^(-E_g/kT)': ['CarrierDensityGraph'],
  'n + N_A = p + N_D': ['DopingGraph'],
  'E_g(T)': ['BandStructureGraph'],
  'm* ∝ (d²E/dk²)^(-1)': ['EffectiveMassGraph'],
  'J = Σ q v_d': ['CarrierTransportGraph']
};

/**
 * Categoriza uma fórmula com base em seus conceitos e descrição
 * @param {Object} formula - Objeto de fórmula com concepts e description
 * @returns {Array} - Array de categorias às quais a fórmula pertence
 */
export function categorizeFormula(formula) {
  const categories = [];
  const { concepts = [], description = '' } = formula;
  
  // Combina conceitos e descrição em um texto único para análise
  const textToAnalyze = [
    ...concepts,
    description
  ].join(' ').toLowerCase();
  
  // Verifica cada categoria
  Object.values(TAXONOMY_CATEGORIES).forEach(category => {
    const matchingConcepts = category.concepts.filter(concept => 
      textToAnalyze.includes(concept.toLowerCase())
    );
    
    if (matchingConcepts.length > 0) {
      categories.push({
        ...category,
        matchScore: matchingConcepts.length,
        matchedConcepts: matchingConcepts
      });
    }
  });
  
  // Ordena por score de matching (maior score primeiro)
  return categories.sort((a, b) => b.matchScore - a.matchScore);
}

/**
 * Identifica quais painéis de gráficos são relevantes para uma fórmula
 * @param {Object} formula - Objeto de fórmula
 * @returns {Array} - Array de painéis de gráficos recomendados
 */
export function getGraphPanelsForFormula(formula) {
  const { genericFormula = '', originalFormula = '' } = formula;
  const graphPanels = new Set();
  
  // Verifica mapeamento direto
  Object.keys(FORMULA_TO_GRAPH_MAP).forEach(key => {
    if (genericFormula.includes(key) || originalFormula.includes(key)) {
      FORMULA_TO_GRAPH_MAP[key].forEach(panel => graphPanels.add(panel));
    }
  });
  
  // Verifica categorias da fórmula
  const categories = categorizeFormula(formula);
  categories.forEach(category => {
    category.graphPanels.forEach(panel => graphPanels.add(panel));
  });
  
  return Array.from(graphPanels);
}

/**
 * Constrói taxonomia completa a partir de uma lista de fórmulas
 * @param {Array} formulas - Array de objetos de fórmula
 * @returns {Object} - Objeto de taxonomia organizada por categoria
 */
export function buildTaxonomy(formulas) {
  const taxonomy = {};
  
  // Inicializa estrutura de taxonomia
  Object.values(TAXONOMY_CATEGORIES).forEach(category => {
    taxonomy[category.id] = {
      ...category,
      formulas: [],
      formulaCount: 0
    };
  });
  
  // Categoriza cada fórmula
  formulas.forEach(formula => {
    const categories = categorizeFormula(formula);
    
    categories.forEach(category => {
      if (taxonomy[category.id]) {
        taxonomy[category.id].formulas.push({
          ...formula,
          matchScore: category.matchScore,
          matchedConcepts: category.matchedConcepts,
          graphPanels: getGraphPanelsForFormula(formula)
        });
      }
    });
  });
  
  // Ordena fórmulas por match score e atualiza contagem
  Object.keys(taxonomy).forEach(categoryId => {
    taxonomy[categoryId].formulas.sort((a, b) => b.matchScore - a.matchScore);
    taxonomy[categoryId].formulaCount = taxonomy[categoryId].formulas.length;
  });
  
  return taxonomy;
}

/**
 * Busca fórmulas por categoria e conceito
 * @param {string} categoryId - ID da categoria
 * @param {string} concept - Conceito específico para filtrar
 * @param {Object} taxonomy - Objeto de taxonomia
 * @returns {Array} - Array de fórmulas filtradas
 */
export function searchFormulasByCategory(categoryId, concept, taxonomy) {
  if (!taxonomy[categoryId]) return [];
  
  if (!concept) {
    return taxonomy[categoryId].formulas;
  }
  
  return taxonomy[categoryId].formulas.filter(formula => {
    const { concepts = [], description = '' } = formula;
    const text = [...concepts, description].join(' ').toLowerCase();
    return text.includes(concept.toLowerCase());
  });
}

/**
 * Obtém painéis de gráficos disponíveis para uma categoria
 * @param {string} categoryId - ID da categoria
 * @returns {Array} - Array de painéis de gráficos
 */
export function getGraphPanelsForCategory(categoryId) {
  const category = Object.values(TAXONOMY_CATEGORIES).find(cat => cat.id === categoryId);
  return category ? category.graphPanels : [];
}

/**
 * Verifica se uma fórmula tem visualização gráfica disponível
 * @param {Object} formula - Objeto de fórmula
 * @returns {boolean} - True se tiver visualização disponível
 */
export function hasGraphVisualization(formula) {
  const graphPanels = getGraphPanelsForFormula(formula);
  return graphPanels.length > 0;
}
