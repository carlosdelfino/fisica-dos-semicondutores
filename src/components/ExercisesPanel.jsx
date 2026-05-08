import { useState, useEffect } from 'react';
import { TeX } from './Math.jsx';

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
 * Painel dinâmico de exercícios que carrega dados JSON da pasta public/formulas
 * organizados por livro e permite seleção por capítulo com filtragem inteligente.
 */
export default function ExercisesPanel() {
  const [selectedBook, setSelectedBook] = useState('');
  const [selectedChapter, setSelectedChapter] = useState('');
  const [selectedFile, setSelectedFile] = useState('');
  const [fileData, setFileData] = useState(null);
  const [availableBooks, setAvailableBooks] = useState([]);
  const [availableChapters, setAvailableChapters] = useState([]);
  const [availableFiles, setAvailableFiles] = useState([]);
  const [relevantFiles, setRelevantFiles] = useState([]);
  const [filteredOutFiles, setFilteredOutFiles] = useState([]);
  const [loadingBooks, setLoadingBooks] = useState(true);
  const [loadingFiles, setLoadingFiles] = useState(false);
  const [showFiltered, setShowFiltered] = useState(false);

  // Lista de livros conhecidos (subpastas em public/formulas)
  const KNOWN_BOOKS = [
    'Semiconductor Physics and Devices - Solution Manual - Donald A. Neamen',
    'Semiconductor Devices - Kanaan Kano'
  ];

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
      
      setLoadingFiles(true);
      try {
        const possiblePatterns = [
          ...Array.from({ length: 20 }, (_, i) => `${selectedBook}-${i + 1}.json`),
          `${book}-metadata.json`,
          `${book}-index.json`,
        ];

        const validFiles = [];
        const filesData = [];
        const chaptersSet = new Set();

        for (const fileName of possiblePatterns) {
          try {
            const response = await fetch(`/formulas/${selectedBook}/${fileName}`);
            if (response.ok) {
              const data = await response.json();
              validFiles.push(fileName);
              filesData.push({ fileName, data });
              
              // Extrair número do capítulo do nome do arquivo
              const chapterMatch = fileName.match(/-\d+\.json/);
              if (chapterMatch) {
                const chapterNum = chapterMatch[0].replace(/-/g, '').replace('.json', '');
                chaptersSet.add(chapterNum);
              }
            }
          } catch (e) {
            // Arquivo não existe, continuar
          }
        }

        const { relevant, filteredOut } = filterRelevantFiles(filesData, 10);
        
        setAvailableFiles(validFiles);
        setRelevantFiles(relevant);
        setFilteredOutFiles(filteredOut);
        setAvailableChapters(Array.from(chaptersSet).sort((a, b) => parseInt(a) - parseInt(b)));

        if (relevant.length > 0) {
          setSelectedFile(relevant[0].fileName);
          setFileData(relevant[0].data);
          
          // Selecionar o capítulo do primeiro arquivo relevante
          const chapterMatch = relevant[0].fileName.match(/-\d+\.json/);
          if (chapterMatch) {
            const chapterNum = chapterMatch[0].replace(/-/g, '').replace('.json', '');
            setSelectedChapter(chapterNum);
          }
        } else if (filesData.length > 0) {
          setSelectedFile(filesData[0].fileName);
          setFileData(filesData[0].data);
        }
      } catch (error) {
        console.error('Erro ao carregar arquivos:', error);
        setAvailableFiles([]);
        setRelevantFiles([]);
        setFilteredOutFiles([]);
        setAvailableChapters([]);
      } finally {
        setLoadingFiles(false);
      }
    };

    loadFiles();
  }, [selectedBook]);

  // Filtrar arquivos por capítulo selecionado
  useEffect(() => {
    if (!selectedChapter) {
      setRelevantFiles(prevRelevant => prevRelevant);
      return;
    }
    
    // Filtrar relevantFiles pelo capítulo selecionado
    const chapterFiles = relevantFiles.filter(file => 
      file.fileName.includes(`-${selectedChapter}.json`)
    );
    
    if (chapterFiles.length > 0) {
      setSelectedFile(chapterFiles[0].fileName);
      setFileData(chapterFiles[0].data);
    }
  }, [selectedChapter]);

  return (
    <div className="exercises-panel">
      <h2>📝 Exercícios e Fórmulas</h2>
      
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
                setSelectedFile('');
                setFileData(null);
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

          {loadingFiles ? (
            <div className="loading-container">
              <div className="spinner"></div>
              <p>Carregando arquivos...</p>
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
                  <option value="">Todos os capítulos</option>
                  {availableChapters.map(chapter => (
                    <option key={chapter} value={chapter}>
                      Capítulo {chapter}
                    </option>
                  ))}
                </select>
              </div>

              {relevantFiles.length > 0 ? (
                <>
                  <div className="control-group">
                    <label htmlFor="file-select">Selecione o Arquivo:</label>
                    <select
                      id="file-select"
                      value={selectedFile}
                      onChange={(e) => setSelectedFile(e.target.value)}
                      className="file-select"
                    >
                      {relevantFiles.map(file => (
                        <option key={file.fileName} value={file.fileName}>
                          {file.fileName} (Pontuação: {file.relevance.score})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="relevance-info">
                    <p>📊 {relevantFiles.length} arquivos relevantes encontrados</p>
                    {filteredOutFiles.length > 0 && (
                      <button 
                        className="toggle-filtered-btn"
                        onClick={() => setShowFiltered(!showFiltered)}
                      >
                        {showFiltered ? `Ocultar ${filteredOutFiles.length} arquivos filtrados` : `Ver ${filteredOutFiles.length} arquivos filtrados`}
                      </button>
                    )}
                  </div>

                  {showFiltered && filteredOutFiles.length > 0 && (
                    <div className="filtered-files-section">
                      <h4>Arquivos Filtrados (Pontuação inferior a 10)</h4>
                      <ul>
                        {filteredOutFiles.map(file => (
                          <li key={file.fileName}>
                            <strong>{file.fileName}</strong> - Pontuação: {file.relevance.score}
                            <br />
                            <small>{file.relevance.reasons.join(', ')}</small>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {fileData ? (
                    <DynamicFormulaContent data={fileData} />
                  ) : (
                    <p>Selecione um arquivo para ver as fórmulas.</p>
                  )}
                </>
              ) : availableFiles.length > 0 ? (
                <p>Nenhum arquivo com conteúdo relevante encontrado. Todos os arquivos têm pontuação baixa.</p>
              ) : (
                <p>Nenhum arquivo disponível para este livro.</p>
              )}
            </>
          ) : selectedBook ? (
            <p>Nenhum arquivo disponível para este livro.</p>
          ) : null}
        </>
      )}
    </div>
  );
}

function DynamicFormulaContent({ data }) {
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
