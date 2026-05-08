import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TeX } from './Math.jsx';
import { buildTaxonomy, getGraphPanelsForFormula, hasGraphVisualization, TAXONOMY_CATEGORIES } from '../physics/formulaTaxonomy';

/**
 * Algoritmo cognitivo para filtrar conteúdo relevante
 * Calcula pontuação de relevância baseada em:
 * - Quantidade de fórmulas enriquecidas
 * - Presença de descrições didáticas
 * - Quantidade de conceitos explicados
 * - Presença de símbolos detalhados
 */
function calculateRelevanceScore(data) {
  let score = 0;
  let reasons = [];

  // Verificar fórmulas em perguntas
  if (data.questions && data.questions.length > 0) {
    const questionsWithFormulas = data.questions.filter(q => 
      q.formulas && q.formulas.length > 0
    );
    const enrichedFormulas = questionsWithFormulas.reduce((acc, q) => {
      return acc + q.formulas.filter(f => 
        f.description && f.concepts && f.symbols
      ).length;
    }, 0);

    if (enrichedFormulas > 0) {
      score += enrichedFormulas * 10;
      reasons.push(`${enrichedFormulas} fórmulas enriquecidas em perguntas`);
    }

    if (questionsWithFormulas.length > 0) {
      score += questionsWithFormulas.length * 5;
      reasons.push(`${questionsWithFormulas.length} perguntas com fórmulas`);
    }
  }

  // Verificar fórmulas em respostas
  if (data.answers && data.answers.length > 0) {
    const answersWithFormulas = data.answers.filter(a => 
      a.formulas && a.formulas.length > 0
    );
    const enrichedFormulas = answersWithFormulas.reduce((acc, a) => {
      return acc + a.formulas.filter(f => 
        f.description && f.concepts && f.symbols
      ).length;
    }, 0);

    if (enrichedFormulas > 0) {
      score += enrichedFormulas * 10;
      reasons.push(`${enrichedFormulas} fórmulas enriquecidas em respostas`);
    }

    if (answersWithFormulas.length > 0) {
      score += answersWithFormulas.length * 3;
      reasons.push(`${answersWithFormulas.length} respostas com fórmulas`);
    }
  }

  // Verificar fórmulas independentes
  if (data.standaloneFormulas && data.standaloneFormulas.length > 0) {
    const enrichedFormulas = data.standaloneFormulas.filter(f => 
      f.description && f.concepts && f.symbols
    ).length;

    if (enrichedFormulas > 0) {
      score += enrichedFormulas * 15;
      reasons.push(`${enrichedFormulas} fórmulas independentes enriquecidas`);
    }

    score += data.standaloneFormulas.length * 5;
    reasons.push(`${data.standaloneFormulas.length} fórmulas independentes`);
  }

  // Penalidade para arquivos com perguntas/respostas sem fórmulas
  if (data.questions && data.questions.length > 0) {
    const questionsWithoutFormulas = data.questions.filter(q => 
      !q.formulas || q.formulas.length === 0
    ).length;
    if (questionsWithoutFormulas === data.questions.length) {
      score -= 20;
      reasons.push('Perguntas sem fórmulas (penalidade)');
    }
  }

  return { score, reasons };
}

/**
 * Filtra arquivos relevantes baseado em pontuação de relevância
 */
function filterRelevantFiles(filesData, threshold = 10) {
  const scoredFiles = filesData.map(file => ({
    ...file,
    relevance: calculateRelevanceScore(file.data)
  }));

  const relevantFiles = scoredFiles.filter(file => file.relevance.score >= threshold);
  const filteredOut = scoredFiles.filter(file => file.relevance.score < threshold);

  return {
    relevant: relevantFiles.sort((a, b) => b.relevance.score - a.relevance.score),
    filteredOut: filteredOut.sort((a, b) => b.relevance.score - a.relevance.score)
  };
}

/**
 * Mescla dados de múltiplos arquivos do mesmo capítulo
 */
function mergeChapterFiles(filesData) {
  const merged = {
    chapter: filesData[0]?.data?.chapter || '',
    section: filesData[0]?.data?.section || '',
    questions: [],
    answers: [],
    standaloneFormulas: [],
    processedPages: []
  };

  filesData.forEach(fileData => {
    if (fileData.data.questions) {
      merged.questions.push(...fileData.data.questions);
    }
    if (fileData.data.answers) {
      merged.answers.push(...fileData.data.answers);
    }
    if (fileData.data.standaloneFormulas) {
      merged.standaloneFormulas.push(...fileData.data.standaloneFormulas);
    }
    if (fileData.data.processedPages) {
      merged.processedPages.push(...fileData.data.processedPages);
    }
  });

  return merged;
}

/**
 * Painel dinâmico de exercícios que carrega dados JSON da pasta public/formulas
 * organizados por livro e permite seleção por capítulo com filtragem inteligente.
 */
export default function ExercisesPanel() {
  const [subTab, setSubTab] = useState('exercises');
  const [selectedBook, setSelectedBook] = useState('');
  const [selectedChapter, setSelectedChapter] = useState('');
  const [chapterData, setChapterData] = useState(null);
  const [availableBooks, setAvailableBooks] = useState([]);
  const [availableChapters, setAvailableChapters] = useState([]);
  const [chapterFiles, setChapterFiles] = useState({});
  const [chapterTitles, setChapterTitles] = useState({});
  const [loadingBooks, setLoadingBooks] = useState(true);
  const [loadingChapter, setLoadingChapter] = useState(false);
  const [taxonomy, setTaxonomy] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('quantum-physics');
  const [allFormulas, setAllFormulas] = useState([]);

  // Lista de livros conhecidos (subpastas em public/formulas) com metadados
  const KNOWN_BOOKS = [
    'Semiconductor physics and devices - Basic - Donald A. Neamen',
    'Semiconductor Devices - Kanaan Kano'
  ];

  // Mapeamento de livros para autores e títulos completos
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

  // Função para formatar a fonte completa da fórmula
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

  // Carregar lista de livros disponíveis e verificar conteúdo
  useEffect(() => {
    const loadBooks = async () => {
      setLoadingBooks(true);
      try {
        const validBooks = [];
        
        for (const book of KNOWN_BOOKS) {
          try {
            // Verificar se o livro tem arquivos JSON válidos
            const possiblePatterns = [
              ...Array.from({ length: 20 }, (_, i) => `${book}-${i + 1}.json`),
              `${book}-metadata.json`,
              `${book}-index.json`,
            ];

            let hasValidContent = false;
            for (const fileName of possiblePatterns) {
              try {
                const response = await fetch(`/formulas/${book}/${fileName}`);
                if (response.ok) {
                  const data = await response.json();
                  // Verificar se tem algum conteúdo relevante
                  const { score } = calculateRelevanceScore(data);
                  if (score > 0) {
                    hasValidContent = true;
                    break;
                  }
                }
              } catch (e) {
                // Arquivo não existe, continuar
              }
            }

            if (hasValidContent) {
              validBooks.push(book);
            }
          } catch (e) {
            // Continuar tentando outros livros
          }
        }
        
        setAvailableBooks(validBooks);
        
        if (validBooks.length > 0) {
          setSelectedBook(validBooks[0]);
        }
      } catch (error) {
        console.error('Erro ao carregar livros:', error);
      } finally {
        setLoadingBooks(false);
      }
    };

    loadBooks();
  }, []);

  // Carregar todos os arquivos JSON do livro selecionado
  useEffect(() => {
    const loadFiles = async () => {
      if (!selectedBook) return;
      
      try {
        const possiblePatterns = [
          ...Array.from({ length: 30 }, (_, i) => `${selectedBook}-${i + 1}.json`),
          `${selectedBook}-metadata.json`,
          `${selectedBook}-index.json`,
        ];

        const filesByChapter = {};
        const chaptersSet = new Set();
        const titlesByChapter = {};

        for (const fileName of possiblePatterns) {
          try {
            const response = await fetch(`/formulas/${selectedBook}/${fileName}`);
            if (response.ok) {
              const data = await response.json();
              
              // Extrair número do capítulo do nome do arquivo
              const chapterMatch = fileName.match(/-(\d+)\.json/);
              if (chapterMatch) {
                const chapterNum = chapterMatch[1];
                chaptersSet.add(chapterNum);
                
                if (!filesByChapter[chapterNum]) {
                  filesByChapter[chapterNum] = [];
                }
                filesByChapter[chapterNum].push({ fileName, data });
                
                // Extrair título do capítulo se disponível
                if (data.chapter && !titlesByChapter[chapterNum]) {
                  titlesByChapter[chapterNum] = data.chapter;
                }
              }
            }
          } catch (e) {
            // Arquivo não existe, continuar
          }
        }

        setChapterFiles(filesByChapter);
        setChapterTitles(titlesByChapter);
        setAvailableChapters(Array.from(chaptersSet).sort((a, b) => parseInt(a) - parseInt(b)));
      } catch (error) {
        console.error('Erro ao carregar arquivos:', error);
        setChapterFiles({});
        setAvailableChapters([]);
      }
    };

    loadFiles();
  }, [selectedBook]);

  // Carregar dados do capítulo selecionado
  useEffect(() => {
    if (!selectedChapter || !chapterFiles[selectedChapter]) {
      setChapterData(null);
      return;
    }
    
    setLoadingChapter(true);
    try {
      const filesData = chapterFiles[selectedChapter];
      const mergedData = mergeChapterFiles(filesData);
      setChapterData(mergedData);
    } catch (error) {
      console.error('Erro ao carregar dados do capítulo:', error);
      setChapterData(null);
    } finally {
      setLoadingChapter(false);
    }
  }, [selectedChapter, chapterFiles]);

  // Carregar todas as fórmulas e construir taxonomia
  useEffect(() => {
    const loadAllFormulas = async () => {
      if (!selectedBook) return;
      
      try {
        const allFormulasList = [];
        
        // Carregar todos os capítulos disponíveis
        for (const chapterNum of availableChapters) {
          if (chapterFiles[chapterNum]) {
            const mergedData = mergeChapterFiles(chapterFiles[chapterNum]);
            
            // Extrair fórmulas de perguntas
            if (mergedData.questions) {
              mergedData.questions.forEach(q => {
                if (q.formulas) {
                  q.formulas.forEach(f => {
                    allFormulasList.push({
                      ...f,
                      source: 'question',
                      questionNumber: q.number,
                      questionText: q.text,
                      chapter: chapterNum
                    });
                  });
                }
              });
            }
            
            // Extrair fórmulas de respostas
            if (mergedData.answers) {
              mergedData.answers.forEach(a => {
                if (a.formulas) {
                  a.formulas.forEach(f => {
                    allFormulasList.push({
                      ...f,
                      source: 'answer',
                      questionNumber: a.questionNumber,
                      answerText: a.text,
                      chapter: chapterNum
                    });
                  });
                }
              });
            }
            
            // Extrair fórmulas independentes
            if (mergedData.standaloneFormulas) {
              mergedData.standaloneFormulas.forEach(f => {
                allFormulasList.push({
                  ...f,
                  source: 'standalone',
                  chapter: chapterNum
                });
              });
            }
          }
        }
        
        setAllFormulas(allFormulasList);
        
        // Construir taxonomia
        const taxonomyData = buildTaxonomy(allFormulasList);
        setTaxonomy(taxonomyData);
      } catch (error) {
        console.error('Erro ao carregar fórmulas para taxonomia:', error);
      }
    };

    if (availableChapters.length > 0) {
      loadAllFormulas();
    }
  }, [selectedBook, availableChapters, chapterFiles]);

  return (
    <div className="exercises-panel">
      <h2>📝 Exercícios e Fórmulas</h2>

      <div className="sub-tabs">
        <button className={`sub-tab ${subTab === 'exercises' ? 'active' : ''}`} onClick={() => setSubTab('exercises')}>
          📝 Exercícios
        </button>
        <button className={`sub-tab ${subTab === 'taxonomy' ? 'active' : ''}`} onClick={() => setSubTab('taxonomy')}>
          🔬 Taxonomia
        </button>
        <button className={`sub-tab ${subTab === 'symbols' ? 'active' : ''}`} onClick={() => setSubTab('symbols')}>
          📚 Símbolos
        </button>
      </div>

      {subTab === 'exercises' && (
        <>
          {loadingBooks ? (
            <div className="loading-container">
              <div className="spinner"></div>
              <p>Carregando livros...</p>
            </div>
          ) : (
            <>
              <div className="control-group">
                <label htmlFor="book-select">Selecione o Livro:</label>
                <select
                  id="book-select"
                  value={selectedBook}
                  onChange={(e) => {
                    setSelectedBook(e.target.value);
                    setSelectedChapter('');
                    setChapterData(null);
                  }}
                  className="book-select"
                >
                  {availableBooks.length === 0 && <option value="">Nenhum livro com conteúdo</option>}
                  {availableBooks.map(book => (
                    <option key={book} value={book}>
                      {book}
                    </option>
                  ))}
                </select>
              </div>

              {loadingChapter ? (
                <div className="loading-container">
                  <div className="spinner"></div>
                  <p>Carregando capítulo...</p>
                </div>
              ) : selectedBook && availableChapters.length > 0 ? (
                <>
                  <div className="control-group">
                    <label htmlFor="chapter-select">Selecione o Capítulo:</label>
                    <select
                      id="chapter-select"
                      value={selectedChapter}
                      onChange={(e) => setSelectedChapter(e.target.value)}
                      className="chapter-select"
                    >
                      <option value="">Selecione um capítulo</option>
                      {availableChapters.map(chapter => {
                        const fileCount = chapterFiles[chapter]?.length || 0;
                        const chapterTitle = chapterTitles[chapter] || `Capítulo ${chapter}`;
                        return (
                          <option key={chapter} value={chapter}>
                            {chapterTitle} ({fileCount} arquivo{fileCount !== 1 ? 's' : ''})
                          </option>
                        );
                      })}
                    </select>
                  </div>

                  {chapterData ? (
                    <>
                      <div className="relevance-info">
                        <p>📊 {chapterData.questions?.length || 0} questões, {chapterData.answers?.length || 0} respostas, {chapterData.standaloneFormulas?.length || 0} fórmulas</p>
                      </div>
                      <FormulaContent data={chapterData} selectedBook={selectedBook} formatFormulaSource={formatFormulaSource} />
                    </>
                  ) : selectedChapter ? (
                    <p>Nenhum conteúdo encontrado para este capítulo.</p>
                  ) : (
                    <p>Selecione um capítulo para ver o conteúdo.</p>
                  )}
                </>
              ) : selectedBook ? (
                <p>Nenhum capítulo disponível para este livro.</p>
              ) : null}
            </>
          )}
        </>
      )}

      {subTab === 'taxonomy' && <TaxonomyContent taxonomy={taxonomy} selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} formatFormulaSource={formatFormulaSource} selectedBook={selectedBook} />}
      {subTab === 'symbols' && <SymbolsContent />}
    </div>
  );
}

function TaxonomyContent({ taxonomy, selectedCategory, setSelectedCategory, formatFormulaSource, selectedBook }) {
  const [selectedFormula, setSelectedFormula] = useState(null);
  const [showGraph, setShowGraph] = useState(false);
  const [graphId, setGraphId] = useState(null);

  if (!taxonomy) {
    return (
      <div className="taxonomy-content">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Carregando taxonomia de fórmulas...</p>
        </div>
      </div>
    );
  }

  const categories = Object.values(TAXONOMY_CATEGORIES);
  const currentCategory = taxonomy[selectedCategory];

  const handleViewGraph = (formula) => {
    const graphPanels = getGraphPanelsForFormula(formula);
    if (graphPanels.length > 0) {
      setSelectedFormula(formula);
      setGraphId(graphPanels[0]);
      setShowGraph(true);
    }
  };

  const handleCloseGraph = () => {
    setShowGraph(false);
    setGraphId(null);
  };

  return (
    <div className="taxonomy-content">
      <h3>🔬 Taxonomia Dinâmica de Fórmulas</h3>
      <p className="taxonomy-description">
        As fórmulas são categorizadas automaticamente com base em seus conceitos e descrições
        em três categorias principais: Física Quântica, Mecânica Quântica e Física dos Semicondutores.
      </p>

      <div className="category-tabs">
        {categories.map(category => (
          <button
            key={category.id}
            className={`category-tab ${selectedCategory === category.id ? 'active' : ''}`}
            onClick={() => setSelectedCategory(category.id)}
          >
            {category.icon} {category.name}
            {taxonomy[category.id] && (
              <span className="formula-count">({taxonomy[category.id].formulaCount})</span>
            )}
          </button>
        ))}
      </div>

      {currentCategory ? (
        <div className="category-content">
          <div className="category-header">
            <h4>{currentCategory.icon} {currentCategory.name}</h4>
            <p className="category-description">{currentCategory.description}</p>
          </div>

          {currentCategory.formulaCount === 0 ? (
            <p className="no-formulas">Nenhuma fórmula encontrada nesta categoria.</p>
          ) : (
            <div className="formulas-list">
              {currentCategory.formulas.map((formula, index) => (
                <div key={index} className="formula-card">
                  <div className="formula-header">
                    <h5>Fórmula {index + 1}</h5>
                    {hasGraphVisualization(formula) && (
                      <button
                        className="view-graph-button"
                        onClick={() => handleViewGraph(formula)}
                        title="Ver gráfico"
                      >
                        📊 Ver Gráfico
                      </button>
                    )}
                  </div>

                  <div className="formula-math">
                    <TeX math={formula.genericFormula} />
                  </div>

                  {formula.description && (
                    <p className="formula-description">{formula.description}</p>
                  )}

                  {formula.concepts && formula.concepts.length > 0 && (
                    <div className="formula-concepts">
                      <strong>Conceitos:</strong>
                      <div className="concepts-list">
                        {formula.concepts.map((concept, idx) => (
                          <span key={idx} className="concept-tag">
                            {concept}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {formula.matchedConcepts && formula.matchedConcepts.length > 0 && (
                    <div className="matched-concepts">
                      <small>Conceitos correspondentes: {formula.matchedConcepts.join(', ')}</small>
                    </div>
                  )}

                  {formula.graphPanels && formula.graphPanels.length > 0 && (
                    <div className="available-graphs">
                      <strong>Gráficos disponíveis:</strong>
                      <div className="graph-list">
                        {formula.graphPanels.map((panel, idx) => (
                          <span key={idx} className="graph-tag">
                            {panel}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="formula-source">
                    <small>
                      📖 {formatFormulaSource(formula, selectedBook)}
                    </small>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <p className="no-category">Selecione uma categoria para ver as fórmulas.</p>
      )}

      {showGraph && graphId && selectedFormula && (
        <div className="graph-modal">
          <div className="graph-modal-content">
            <button className="close-modal-button" onClick={handleCloseGraph}>
              × Fechar
            </button>
            <FormulaGraphPanelRenderer 
              graphId={graphId} 
              formula={selectedFormula} 
              onClose={handleCloseGraph}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function FormulaGraphPanelRenderer({ graphId, formula, onClose }) {
  // Componente para renderizar o gráfico específico
  // Por enquanto, renderiza um placeholder
  const graphComponents = {
    'PhotonEnergyGraph': null,
    'HeisenbergUncertaintyGraph': null,
    'DensityOfStatesGraph': null,
    'BandStructureGraph': null
  };

  const GraphComponent = graphComponents[graphId];

  if (GraphComponent) {
    return <GraphComponent formula={formula} onClose={onClose} />;
  }

  // Placeholder até que os componentes de gráficos sejam importados
  return (
    <div className="graph-placeholder">
      <h3>📊 {graphId}</h3>
      <p>Gráfico para a fórmula:</p>
      <div className="formula-preview">
        <TeX math={formula.genericFormula} />
      </div>
      <p className="graph-note">
        O componente de gráfico completo será implementado em uma próxima etapa.
        Este é um placeholder demonstrativo.
      </p>
      <button className="back-to-formula-button" onClick={onClose}>
        ← Voltar para Fórmula
      </button>
    </div>
  );
}

function SymbolsContent() {
  const [filter, setFilter] = useState('all');

  const symbols = [
    { symbol: 'E', name: 'Energia', category: 'Energia', description: 'Energia de um elétron ou lacuna. Unidade: elétron-volt (eV) ou joules (J).' },
    { symbol: 'Ec', name: 'Energia da Banda de Condução', category: 'Energia', description: 'Energia mínima da banda de condução. Elétrons livres ocupam níveis acima de Ec.' },
    { symbol: 'Ev', name: 'Energia da Banda de Valência', category: 'Energia', description: 'Energia máxima da banda de valência. Lacunas ocupam níveis abaixo de Ev.' },
    { symbol: 'Ef', name: 'Nível de Fermi', category: 'Energia', description: 'Nível de energia onde a probabilidade de ocupação é 50%. Determina a distribuição de portadores.' },
    { symbol: 'Eg', name: 'Gap de Banda (Bandgap)', category: 'Energia', description: 'Diferença de energia entre Ec e Ev. Determina se o material é condutor, semicondutor ou isolante.' },
    { symbol: 'Ed', name: 'Nível Doador', category: 'Energia', description: 'Nível de energia de impurezas doadoras (tipo-n). Fica logo abaixo de Ec.' },
    { symbol: 'Ea', name: 'Nível Aceitador', category: 'Energia', description: 'Nível de energia de impurezas aceitadoras (tipo-p). Fica logo acima de Ev.' },
    { symbol: 'Ei', name: 'Nível Intrínseco', category: 'Energia', description: 'Nível de Fermi em material intrínseco. Fica aproximadamente no meio do gap.' },
    { symbol: 'k', name: 'Constante de Boltzmann', category: 'Constantes', description: 'k = 8.617×10⁻⁵ eV/K ou 1.38×10⁻²³ J/K. Relaciona energia com temperatura.' },
    { symbol: 'n', name: 'Concentração de Elétrons', category: 'Portadores', description: 'Número de elétrons livres por cm³ na banda de condução.' },
    { symbol: 'p', name: 'Concentração de Lacunas', category: 'Portadores', description: 'Número de lacunas por cm³ na banda de valência.' },
    { symbol: 'ni', name: 'Concentração Intrínseca', category: 'Portadores', description: 'Concentração de portadores em material intrínseco (sem dopagem). n·p = ni².' },
    { symbol: 'ND', name: 'Concentração de Doadores', category: 'Dopagem', description: 'Concentração de átomos doadores (tipo-n) por cm³. Ex: fósforo em silício.' },
    { symbol: 'NA', name: 'Concentração de Aceitadores', category: 'Dopagem', description: 'Concentração de átomos aceitadores (tipo-p) por cm³. Ex: boro em silício.' },
    { symbol: 'n+', name: 'Tipo-n Altamente Dopado', category: 'Dopagem', description: 'Região tipo-n com dopagem muito alta (ND > 10¹⁹ cm⁻³).' },
    { symbol: 'p+', name: 'Tipo-p Altamente Dopado', category: 'Dopagem', description: 'Região tipo-p com dopagem muito alta (NA > 10¹⁹ cm⁻³).' },
    { symbol: 'T', name: 'Temperatura', category: 'Temperatura', description: 'Temperatura absoluta em Kelvin. Afeta a concentração intrínseca e a ionização de dopantes.' },
    { symbol: 'Tfreeze-out', name: 'Temperatura de Freeze-out', category: 'Temperatura', description: 'Temperatura abaixo da qual dopantes não estão totalmente ionizados.' },
    { symbol: 'm*', name: 'Massa Efetiva', category: 'Massa Efetiva', description: 'Massa efetiva de um portador em um cristal. Diferente da massa do elétron livre (m₀).' },
    { symbol: 'me*', name: 'Massa Efetiva do Elétron', category: 'Massa Efetiva', description: 'Massa efetiva de elétrons na banda de condução. Tipicamente 0.26m₀ para Si.' },
    { symbol: 'mh*', name: 'Massa Efetiva da Lacuna', category: 'Massa Efetiva', description: 'Massa efetiva de lacunas na banda de valência. Tipicamente 0.49m₀ para Si.' },
    { symbol: 'm₀', name: 'Massa do Elétron Livre', category: 'Constantes', description: 'm₀ = 9.109×10⁻³¹ kg. Massa do elétron no vácuo.' },
    { symbol: 'q', name: 'Carga do Elétron', category: 'Constantes', description: 'q = 1.602×10⁻¹⁹ C. Magnitude da carga elementar.' },
    { symbol: 'h', name: 'Constante de Planck', category: 'Constantes', description: 'h = 6.626×10⁻³⁴ J·s. Constante fundamental da mecânica quântica.' },
    { symbol: 'ħ', name: 'Constante de Planck Reduzida', category: 'Constantes', description: 'ħ = h/2π = 1.055×10⁻³⁴ J·s. Usada em mecânica quântica.' },
    { symbol: 'Ψ, ψ', name: 'Função de Onda', category: 'Mecânica Quântica', description: 'Função de onda quântica. Ψ (maiúsculo) para sistemas de múltiplas partículas, ψ (minúsculo) para partícula única. |ψ|² dá a densidade de probabilidade.' },
    { symbol: 'μn', name: 'Mobilidade de Elétrons', category: 'Transporte', description: 'Mobilidade de elétrons no material. μn = qτn/mn*. Unidade: cm²/(V·s).' },
    { symbol: 'μp', name: 'Mobilidade de Lacunas', category: 'Transporte', description: 'Mobilidade de lacunas no material. μp = qτp/mp*. Unidade: cm²/(V·s).' },
    { symbol: 'τn', name: 'Tempo de Vida do Elétron', category: 'Transporte', description: 'Tempo médio antes que um elétron se recombine com uma lacuna.' },
    { symbol: 'τp', name: 'Tempo de Vida da Lacuna', category: 'Transporte', description: 'Tempo médio antes que uma lacuna se recombine com um elétron.' },
    { symbol: 'Dn', name: 'Coeficiente de Difusão de Elétrons', category: 'Transporte', description: 'Dn = μn·kT/q. Descreve difusão de elétrons. Unidade: cm²/s.' },
    { symbol: 'Dp', name: 'Coeficiente de Difusão de Lacunas', category: 'Transporte', description: 'Dp = μp·kT/q. Descreve difusão de lacunas. Unidade: cm²/s.' },
    { symbol: 'Ln', name: 'Comprimento de Difusão de Elétrons', category: 'Transporte', description: 'Ln = √(Dn·τn). Distância média que elétrons difundem antes de se recombinarem.' },
    { symbol: 'Lp', name: 'Comprimento de Difusão de Lacunas', category: 'Transporte', description: 'Lp = √(Dp·τp). Distância média que lacunas difundem antes de se recombinarem.' },
    { symbol: 'σ', name: 'Condutividade', category: 'Transporte', description: 'σ = q(μn·n + μp·p). Mede a capacidade de conduzir corrente. Unidade: S/cm.' },
    { symbol: 'ρ', name: 'Resistividade', category: 'Transporte', description: 'ρ = 1/σ. Inverso da condutividade. Unidade: Ω·cm.' },
    { symbol: 'ε', name: 'Permissividade', category: 'Constantes', description: 'ε = ε₀·εr. Capacidade de um material de polarizar sob campo elétrico.' },
    { symbol: 'ε₀', name: 'Permissividade do Vácuo', category: 'Constantes', description: 'ε₀ = 8.854×10⁻¹⁴ F/cm. Permissividade do vácuo.' },
    { symbol: 'εr', name: 'Permissividade Relativa', category: 'Constantes', description: 'Permissividade relativa do material (constante dielétrica). εr(Si) ≈ 11.7.' },
    { symbol: 'Vbi', name: 'Potencial de Barreira', category: 'Junção PN', description: 'Potencial interno de uma junção PN. Vbi = (kT/q)·ln(ND·NA/ni²).' },
    { symbol: 'W', name: 'Largura da Região de Depleção', category: 'Junção PN', description: 'Largura total da região de carga espacial na junção PN.' },
    { symbol: 'xn', name: 'Largura da Região de Depleção (lado n)', category: 'Junção PN', description: 'Extensão da região de depleção no lado tipo-n.' },
    { symbol: 'xp', name: 'Largura da Região de Depleção (lado p)', category: 'Junção PN', description: 'Extensão da região de depleção no lado tipo-p.' },
    { symbol: 'k', name: 'Vetor de Onda', category: 'Espaço-k', description: 'Vetor de onda no espaço recíproco. k = 2π/λ. Relacionado ao momento do elétron.' },
    { symbol: 'Γ', name: 'Ponto Gamma', category: 'Espaço-k', description: 'Ponto central da zona de Brillouin (k = 0). Importante para estrutura de bandas.' },
    { symbol: 'X', name: 'Ponto X', category: 'Espaço-k', description: 'Ponto na borda da zona de Brillouin na direção [100]. Si tem mínimo indireto em X.' },
    { symbol: 'L', name: 'Ponto L', category: 'Espaço-k', description: 'Ponto na borda da zona de Brillouin na direção [111]. GaAs tem mínimo direto em Γ.' },
    { symbol: 'Φ', name: 'Função Trabalho', category: 'Energia', description: 'Energia necessária para remover um elétron do material. Unidade: eV.' },
    { symbol: 'χ', name: 'Afinidade Eletrônica', category: 'Energia', description: 'Energia liberada quando um elétron do vácuo entra na banda de condução.' },
    { symbol: 'J', name: 'Densidade de Corrente', category: 'Transporte', description: 'Corrente por unidade de área. J = σ·E. Unidade: A/cm².' },
    { symbol: 'E', name: 'Campo Elétrico', category: 'Transporte', description: 'Campo elétrico aplicado. E = V/d. Unidade: V/cm.' },
    { symbol: 'V', name: 'Tensão', category: 'Transporte', description: 'Diferença de potencial elétrico. Unidade: V (volts).' },
  ];

  const categories = ['all', 'Energia', 'Portadores', 'Dopagem', 'Temperatura', 'Massa Efetiva', 'Constantes', 'Mecânica Quântica', 'Transporte', 'Junção PN', 'Espaço-k'];

  const filteredSymbols = filter === 'all' 
    ? symbols 
    : symbols.filter(s => s.category === filter);

  return (
    <div className="symbols-content-wrapper">
      <h3>📚 Símbolos</h3>
      <p className="symbols-intro">
        Guia completo dos símbolos, letras e notações utilizados na Física dos Semicondutores.
        Cada símbolo é fundamental para entender o comportamento de dispositivos eletrônicos.
      </p>

      <div className="filter-buttons">
        {categories.map(cat => (
          <button
            key={cat}
            className={`filter-btn ${filter === cat ? 'active' : ''}`}
            onClick={() => setFilter(cat)}
          >
            {cat === 'all' ? '📋 Todos' : cat}
          </button>
        ))}
      </div>

      <div className="symbols-grid">
        {filteredSymbols.map((item, index) => (
          <div key={index} className="symbol-card">
            <div className="symbol-header">
              <span className="symbol-math">{item.symbol}</span>
              <span className="symbol-category">{item.category}</span>
            </div>
            <h4 className="symbol-name">{item.name}</h4>
            <p className="symbol-description">{item.description}</p>
          </div>
        ))}
      </div>

      <div className="symbols-footer">
        <h3>💡 Dicas de Estudo</h3>
        <ul>
          <li>**Memorize os fundamentais**: Ec, Ev, Ef, Eg, n, p, ni são os mais usados.</li>
          <li>**Entenda as relações**: n·p = ni² (lei de ação de massas) é essencial.</li>
          <li>**Pratique com valores**: Calcule n, p, Ef para diferentes materiais e temperaturas.</li>
          <li>**Visualize os diagramas**: Associe cada símbolo com sua posição no diagrama de bandas.</li>
        </ul>
      </div>
    </div>
  );
}

function FormulaContent({ data, selectedBook, formatFormulaSource }) {
  const navigate = useNavigate();

  const navigateToGraph = (formula) => {
    if (formula.graphVisualization?.hasGraph && formula.graphVisualization?.graphType) {
      const graphType = formula.graphVisualization.graphType;
      navigate(`/${graphType}`);
    }
  };

  const renderTaxonomy = (formula) => {
    if (!formula.taxonomy) return null;
    
    const { category, subcategory, domain } = formula.taxonomy;
    return (
      <div className="formula-taxonomy">
        <strong>Taxonomia:</strong>
        <div className="taxonomy-tags">
          {category && <span className="taxonomy-tag category">{category}</span>}
          {subcategory && <span className="taxonomy-tag subcategory">{subcategory}</span>}
          {domain && <span className="taxonomy-tag domain">{domain}</span>}
        </div>
      </div>
    );
  };

  const renderKeywords = (formula) => {
    if (!formula.keywords || formula.keywords.length === 0) return null;
    
    return (
      <div className="formula-keywords">
        <strong>Palavras-chave:</strong>
        <div className="keywords-list">
          {formula.keywords.map((keyword, index) => (
            <span key={index} className="keyword-tag">{keyword}</span>
          ))}
        </div>
      </div>
    );
  };

  const renderGraphButton = (formula) => {
    if (!formula.graphVisualization?.hasGraph) return null;
    
    return (
      <button 
        className="graph-nav-button"
        onClick={() => navigateToGraph(formula)}
        title={`Ver gráfico: ${formula.graphVisualization.graphType}`}
      >
        📊 Ver Gráfico
      </button>
    );
  };

  const renderRelatedFormulas = (formula) => {
    if (!formula.relatedFormulas || formula.relatedFormulas.length === 0) return null;
    
    return (
      <div className="formula-related">
        <strong>Fórmulas Relacionadas:</strong>
        <ul>
          {formula.relatedFormulas.map((related, index) => (
            <li key={index}>{related}</li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div className="dynamic-formulas">
      {/* Informações do Capítulo/Seção */}
      {data.chapter && (
        <div className="chapter-info">
          <h3>Capítulo: {data.chapter}</h3>
          {data.section && <p>Seção: {data.section}</p>}
        </div>
      )}

      {/* Fórmulas Independentes Enriched */}
      {data.standaloneFormulas && data.standaloneFormulas.length > 0 && (
        <section className="formulas-section">
          <h4>Fórmulas Independentes</h4>
          <div className="formulas-grid">
            {data.standaloneFormulas.map((formula, index) => (
              <div key={index} className="formula-card">
                {typeof formula === 'string' ? (
                  <TeX math={formula} block />
                ) : (
                  <>
                    <div className="formula-original">
                      <TeX math={formula.originalFormula || formula.genericFormula} block />
                    </div>
                    {formula.description && (
                      <p className="formula-description">{formula.description}</p>
                    )}
                    {renderTaxonomy(formula)}
                    {renderKeywords(formula)}
                    {formula.concepts && formula.concepts.length > 0 && (
                      <div className="formula-concepts">
                        <strong>Conceitos:</strong>
                        <ul>
                          {formula.concepts.map((concept, cIndex) => (
                            <li key={cIndex}>{concept}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {formula.symbols && formula.symbols.length > 0 && (
                      <div className="formula-symbols">
                        <strong>Símbolos:</strong>
                        <ul>
                          {formula.symbols.map((symbol, sIndex) => (
                            <li key={sIndex}>
                              <TeX math={symbol.symbol} inline /> - {symbol.description}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {renderRelatedFormulas(formula)}
                    <div className="formula-actions">
                      {renderGraphButton(formula)}
                    </div>
                    <div className="formula-source">
                      <small>
                        📖 {formatFormulaSource({ ...formula, source: 'standalone' }, selectedBook)}
                      </small>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Questões */}
      {data.questions && data.questions.length > 0 && (
        <section className="formulas-section">
          <h4>Questões</h4>
          {data.questions.map((question, index) => (
            <div key={index} className="question-item">
              <h5>{question.number}</h5>
              {question.text && <p className="question-text">{question.text}</p>}
              {question.formulas && question.formulas.length > 0 && (
                <div className="question-formulas">
                  {question.formulas.map((formula, fIndex) => (
                    <div key={fIndex} className="formula-card">
                      {typeof formula === 'string' ? (
                        <TeX math={formula} block />
                      ) : (
                        <>
                          <div className="formula-original">
                            <TeX math={formula.originalFormula || formula.genericFormula} block />
                          </div>
                          {formula.genericFormula && formula.genericFormula !== formula.originalFormula && (
                            <div className="formula-generic">
                              <strong>Fórmula Genérica:</strong>
                              <TeX math={formula.genericFormula} block />
                            </div>
                          )}
                          {formula.description && (
                            <p className="formula-description">{formula.description}</p>
                          )}
                          {renderTaxonomy(formula)}
                          {renderKeywords(formula)}
                          {formula.concepts && formula.concepts.length > 0 && (
                            <div className="formula-concepts">
                              <strong>Conceitos:</strong>
                              <ul>
                                {formula.concepts.map((concept, cIndex) => (
                                  <li key={cIndex}>{concept}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                          {formula.symbols && formula.symbols.length > 0 && (
                            <div className="formula-symbols">
                              <strong>Símbolos:</strong>
                              <ul>
                                {formula.symbols.map((symbol, sIndex) => (
                                  <li key={sIndex}>
                                    <TeX math={symbol.symbol} inline /> - {symbol.description}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          {renderRelatedFormulas(formula)}
                          <div className="formula-actions">
                            {renderGraphButton(formula)}
                          </div>
                          <div className="formula-source">
                            <small>
                              📖 {formatFormulaSource({ ...formula, source: 'question', questionNumber: question.number }, selectedBook)}
                            </small>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </section>
      )}

      {/* Respostas */}
      {data.answers && data.answers.length > 0 && (
        <section className="formulas-section">
          <h4>Respostas</h4>
          <div className="answers-content">
            {data.answers.map((answer, index) => (
              <div key={index} className="answer-item">
                <h5>{answer.questionNumber}</h5>
                {answer.text && <p className="answer-text">{answer.text}</p>}
                {answer.formulas && answer.formulas.length > 0 && (
                  <div className="answer-formulas">
                    {answer.formulas.map((formula, fIndex) => (
                      <div key={fIndex} className="formula-card">
                        {typeof formula === 'string' ? (
                          <TeX math={formula} block />
                        ) : (
                          <>
                            <div className="formula-original">
                              <TeX math={formula.originalFormula || formula.genericFormula} block />
                            </div>
                            {formula.description && (
                              <p className="formula-description">{formula.description}</p>
                            )}
                            {renderTaxonomy(formula)}
                            {renderKeywords(formula)}
                            {formula.concepts && formula.concepts.length > 0 && (
                              <div className="formula-concepts">
                                <strong>Conceitos:</strong>
                                <ul>
                                  {formula.concepts.map((concept, cIndex) => (
                                    <li key={cIndex}>{concept}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            {formula.symbols && formula.symbols.length > 0 && (
                              <div className="formula-symbols">
                                <strong>Símbolos:</strong>
                                <ul>
                                  {formula.symbols.map((symbol, sIndex) => (
                                    <li key={sIndex}>
                                      <TeX math={symbol.symbol} inline /> - {symbol.description}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                            {renderRelatedFormulas(formula)}
                            <div className="formula-actions">
                              {renderGraphButton(formula)}
                            </div>
                            <div className="formula-source">
                              <small>
                                📖 {formatFormulaSource({ ...formula, source: 'answer', questionNumber: answer.questionNumber }, selectedBook)}
                              </small>
                            </div>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
