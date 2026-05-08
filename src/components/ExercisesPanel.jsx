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
  const [selectedFile, setSelectedFile] = useState('');
  const [fileData, setFileData] = useState(null);
  const [availableBooks, setAvailableBooks] = useState([]);
  const [availableFiles, setAvailableFiles] = useState([]);
  const [relevantFiles, setRelevantFiles] = useState([]);
  const [filteredOutFiles, setFilteredOutFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFiltered, setShowFiltered] = useState(false);

  // Lista de livros conhecidos (subpastas em public/formulas)
  const KNOWN_BOOKS = [
    'Semiconductor Physics and Devices - Solution Manual - Donald A. Neamen',
    'Semiconductor Devices - Kanaan Kano'
  ];

  // Carregar lista de livros disponíveis
  useEffect(() => {
    const loadBooks = async () => {
      try {
        const validBooks = [];
        
        for (const book of KNOWN_BOOKS) {
          try {
            const response = await fetch(`/formulas/${book}/`, { method: 'HEAD' });
            if (response.ok || response.status === 404) {
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
        setLoading(false);
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
          ...Array.from({ length: 20 }, (_, i) => `${selectedBook}-${i + 1}.json`),
          `${selectedBook}-metadata.json`,
          `${selectedBook}-index.json`,
        ];

        const validFiles = [];
        const filesData = [];

        for (const fileName of possiblePatterns) {
          try {
            const response = await fetch(`/formulas/${selectedBook}/${fileName}`);
            if (response.ok) {
              const data = await response.json();
              validFiles.push(fileName);
              filesData.push({ fileName, data });
            }
          } catch (e) {
            // Arquivo não existe, continuar
          }
        }

        const { relevant, filteredOut } = filterRelevantFiles(filesData, 10);
        
        setAvailableFiles(validFiles);
        setRelevantFiles(relevant);
        setFilteredOutFiles(filteredOut);

        if (relevant.length > 0) {
          setSelectedFile(relevant[0].fileName);
          setFileData(relevant[0].data);
        } else if (filesData.length > 0) {
          setSelectedFile(filesData[0].fileName);
          setFileData(filesData[0].data);
        }
      } catch (error) {
        console.error('Erro ao carregar arquivos:', error);
        setAvailableFiles([]);
        setRelevantFiles([]);
        setFilteredOutFiles([]);
      }
    };

    loadFiles();
  }, [selectedBook]);

  // Carregar dados do arquivo selecionado
  useEffect(() => {
    const loadFileData = async () => {
      if (!selectedFile || !selectedBook) return;
      
      try {
        const response = await fetch(`/formulas/${selectedBook}/${selectedFile}`);
        
        if (!response.ok) {
          throw new Error(`Falha ao carregar arquivo ${selectedFile}`);
        }
        
        const data = await response.json();
        setFileData(data);
      } catch (error) {
        console.error('Erro ao carregar dados do arquivo:', error);
        setFileData(null);
      }
    };

    loadFileData();
  }, [selectedFile, selectedBook]);

  return (
    <div className="exercises-panel">
      <h2>📝 Exercícios e Fórmulas</h2>
      
      {loading ? (
        <p>Carregando livros...</p>
      ) : (
        <>
          <div className="book-selector">
            <label htmlFor="book-select">Selecione o Livro:</label>
            <select
              id="book-select"
              value={selectedBook}
              onChange={(e) => setSelectedBook(e.target.value)}
              className="book-select"
            >
              {availableBooks.map(book => (
                <option key={book} value={book}>
                  {book}
                </option>
              ))}
            </select>
          </div>

          {relevantFiles.length > 0 ? (
            <>
              <div className="file-selector">
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
