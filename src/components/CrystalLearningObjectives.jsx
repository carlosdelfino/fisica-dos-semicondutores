import React, { useState } from 'react';
import { log_event } from '../physics/formulas.js';

/**
 * Componente para objetivos de aprendizado e questões de revisão
 * sobre estruturas cristalinas de semicondutores
 */
export default function CrystalLearningObjectives() {
  const [completedObjectives, setCompletedObjectives] = useState(new Set());
  const [expandedSection, setExpandedSection] = useState('objectives');
  const [showAnswers, setShowAnswers] = useState(false);

  const learningObjectives = [
    { id: 1, text: 'Listar o material semicondutor elementar mais comum' },
    { id: 2, text: 'Descrever o conceito de célula unitária' },
    { id: 3, text: 'Determinar a densidade volumétrica de átomos para várias estruturas de rede' },
    { id: 4, text: 'Determinar os índices de Miller de um plano de rede cristalina' },
    { id: 5, text: 'Esboçar um plano de rede dados os índices de Miller' },
    { id: 6, text: 'Determinar a densidade superficial de átomos em um plano de rede cristalina dado' },
    { id: 7, text: 'Descrever a configuração tetraédrica dos átomos de silício' },
    { id: 8, text: 'Entender e descrever vários defeitos em uma rede monocristalina' }
  ];

  const reviewQuestions = [
    {
      id: 1,
      question: 'Liste dois materiais semicondutores elementares e dois materiais semicondutores compostos.',
      answer: 'Semicondutores elementares: Silício (Si), Germânio (Ge). Semicondutores compostos: GaAs, InP, CdTe, AlAs.'
    },
    {
      id: 2,
      question: 'Esboce três estruturas de rede: (a) cúbica simples, (b) cúbica centrada no corpo, e (c) cúbica centrada na face.',
      answer: 'As três estruturas são mostradas no painel "Células Unitárias". SC: átomos apenas nos cantos. BCC: átomos nos cantos + centro. FCC: átomos nos cantos + centros das faces.'
    },
    {
      id: 3,
      question: 'Descreva o procedimento para encontrar a densidade volumétrica de átomos em um cristal.',
      answer: '1) Identificar o tipo de célula unitária (SC, BCC, FCC). 2) Contar o número de átomos por célula (SC: 1, BCC: 2, FCC: 4). 3) Calcular o volume da célula (a³ para cúbico). 4) Dividir número de átomos pelo volume.'
    },
    {
      id: 4,
      question: 'Descreva o procedimento para obter os índices de Miller que descrevem um plano em um cristal.',
      answer: '1) Encontrar os interceptos do plano com os eixos cristalinos em termos dos parâmetros de rede. 2) Tomar os recíprocos dos interceptos. 3) Multiplicar por um fator comum para obter inteiros menores. 4) Escrever como (hkl).'
    },
    {
      id: 5,
      question: 'Descreva o procedimento para encontrar a densidade superficial de átomos em um plano de rede particular.',
      answer: '1) Identificar o plano usando índices de Miller. 2) Determinar a área do plano na célula unitária. 3) Contar o número de átomos cujos centros estão no plano (considerando frações para átomos compartilhados). 4) Dividir número de átomos pela área.'
    },
    {
      id: 6,
      question: 'Descreva por que uma célula unitária que não é primitiva pode ser preferível a uma célula unitária primitiva.',
      answer: 'Células não primitivas (como FCC) podem mostrar melhor a simetria do cristal, facilitar cálculos de densidade, e tornar mais clara a estrutura cristalina. Células primitivas têm o volume mínimo mas podem não refletir a simetria completa.'
    },
    {
      id: 7,
      question: 'Descreva a ligação covalente no silício.',
      answer: 'No silício, cada átomo forma 4 ligações covalentes com 4 átomos vizinhos em configuração tetraédrica. Cada ligação envolve compartilhamento de elétrons da valência. O ângulo de ligação é 109.5° e o comprimento é 2.35 Å.'
    },
    {
      id: 8,
      question: 'O que se entende por impureza substitucional em um cristal? O que se entende por impureza intersticial?',
      answer: 'Impureza substitucional: átomo de elemento diferente substituindo um átomo da rede cristalina (ex: fósforo substituindo silício). Impureza intersticial: átomo estranho ocupando espaço vazio entre átomos da rede (ex: lítio em silício).'
    }
  ];

  const toggleObjective = (id) => {
    const newCompleted = new Set(completedObjectives);
    if (newCompleted.has(id)) {
      newCompleted.delete(id);
    } else {
      newCompleted.add(id);
      log_event('PROGRESS', `Objetivo ${id} completado`);
    }
    setCompletedObjectives(newCompleted);
  };

  const progress = (completedObjectives.size / learningObjectives.length) * 100;

  return (
    <div className="crystal-learning-objectives">
      <div className="progress-header">
        <h3>🎯 Objetivos de Aprendizado</h3>
        <div className="progress-bar-container">
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="progress-text">{Math.round(progress)}%</span>
        </div>
      </div>

      <div className="section-tabs">
        <button
          className={`section-tab ${expandedSection === 'objectives' ? 'active' : ''}`}
          onClick={() => setExpandedSection('objectives')}
        >
          📋 Objetivos
        </button>
        <button
          className={`section-tab ${expandedSection === 'questions' ? 'active' : ''}`}
          onClick={() => setExpandedSection('questions')}
        >
          ❓ Questões de Revisão
        </button>
      </div>

      {expandedSection === 'objectives' && (
        <div className="objectives-list">
          {learningObjectives.map((obj) => (
            <div
              key={obj.id}
              className={`objective-item ${completedObjectives.has(obj.id) ? 'completed' : ''}`}
              onClick={() => toggleObjective(obj.id)}
            >
              <div className="objective-checkbox">
                {completedObjectives.has(obj.id) ? '✓' : '○'}
              </div>
              <span className="objective-text">{obj.text}</span>
            </div>
          ))}
        </div>
      )}

      {expandedSection === 'questions' && (
        <div className="questions-list">
          <div className="questions-header">
            <button
              className="toggle-answers-btn"
              onClick={() => setShowAnswers(!showAnswers)}
            >
              {showAnswers ? '🙈 Ocultar Respostas' : '👁️ Mostrar Respostas'}
            </button>
          </div>
          {reviewQuestions.map((q) => (
            <div key={q.id} className="question-item">
              <div className="question-number">Q{q.id}</div>
              <div className="question-content">
                <p className="question-text">{q.question}</p>
                {showAnswers && (
                  <div className="answer-box">
                    <strong>Resposta:</strong>
                    <p>{q.answer}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
