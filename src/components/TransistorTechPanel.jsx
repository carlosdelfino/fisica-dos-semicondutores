import { useState, useRef, useEffect } from 'react';
import { log_event } from '../physics/formulas.js';

/**
 * Dados das tecnologias de fabricação de transistores
 */
const TRANSISTOR_TECHNOLOGIES = [
  {
    id: '10nm',
    name: '10 Nanômetros',
    nodeSize: 10,
    gateLength: 42,
    pitch: 64,
    description: 'Amplamente utilizado em computadores e laptops mais antigos. Primeira geração de FinFET em escala de produção.',
    applications: 'Processadores Intel Kaby/Coffee Lake, AMD Ryzen 1000/2000',
    year: '2016-2017',
    status: 'legacy',
    density: '37.5 MTr/mm²',
    power: 'Melhoria significativa em eficiência energética vs 14nm',
    color: '#ef4444'
  },
  {
    id: '7nm',
    name: '7 Nanômetros',
    nodeSize: 7,
    gateLength: 30,
    pitch: 54,
    description: 'Muito comum em processadores de smartphones de gerações anteriores e computação de alto desempenho. EUV (Extreme Ultraviolet) introduzido.',
    applications: 'Apple A13/A14, AMD Ryzen 3000/4000/5000, Snapdragon 865/888',
    year: '2018-2020',
    status: 'mature',
    density: '96.5 MTr/mm²',
    power: '40% mais eficiente que 10nm',
    color: '#f97316'
  },
  {
    id: '5nm',
    name: '5 Nanômetros',
    nodeSize: 5,
    gateLength: 22,
    pitch: 45,
    description: 'Padrão em dispositivos premium de 2022-2024. EUV de alta produção. Transistores mais densos e eficientes.',
    applications: 'Apple A15/A16, M1/M2/M3, Snapdragon 8 Gen 1/2/3, Ryzen 6000/7000',
    year: '2020-2022',
    status: 'current',
    density: '171.3 MTr/mm²',
    power: '30% mais eficiente que 7nm',
    color: '#eab308'
  },
  {
    id: '3nm',
    name: '3 Nanômetros',
    nodeSize: 3,
    gateLength: 18,
    pitch: 36,
    description: 'Atualmente em produção em massa por TSMC e Samsung. Apple A17 Pro e sucessores. Gate-All-Around (GAA) em algumas implementações.',
    applications: 'Apple A17 Pro, M4, Snapdragon 8 Gen 4, futuros chips de alta performance',
    year: '2023-2024',
    status: 'cutting-edge',
    density: '215 MTr/mm²',
    power: '35% mais eficiente que 5nm',
    color: '#22c55e'
  },
  {
    id: '2nm',
    name: '2 Nanômetros',
    nodeSize: 2,
    gateLength: 12,
    pitch: 30,
    description: 'Próximo grande salto tecnológico. Produção em massa prevista para 2025-2026. GAAFET (Gate-All-Around) oferece maior densidade e eficiência.',
    applications: 'Futuros processadores Apple, AMD, NVIDIA (previstos)',
    year: '2025-2026 (previsto)',
    status: 'upcoming',
    density: '>500 MTr/mm² (estimado)',
    power: '25-30% mais eficiente que 3nm',
    color: '#3b82f6'
  },
  {
    id: 'a16',
    name: '1.6nm (A16)',
    nodeSize: 1.6,
    gateLength: 10,
    pitch: 24,
    description: 'TSMC A16 com arquitetura de nanofolha e "Super Power Rail". Previsão de produção para 2026. Nanosheet transistors para máximo controle.',
    applications: 'Futuros chips de ultra-alta performance (previstos)',
    year: '2026 (previsto)',
    status: 'future',
    density: '>800 MTr/mm² (estimado)',
    power: '20-25% mais eficiente que 2nm',
    color: '#8b5cf6'
  }
];

/**
 * Componentes para comparação visual
 */
const COMPARISON_OBJECTS = [
  { name: 'Cabelo Humano', size: 70000, color: '#888888' },
  { name: 'Célula Humana', size: 10000, color: '#ff6b6b' },
  { name: 'Bactéria E. coli', size: 2000, color: '#4ecdc4' },
  { name: 'Vírus', size: 100, color: '#45b7d1' },
  { name: 'DNA (largura)', size: 2, color: '#f39c12' },
  { name: 'Átomo de Silício', size: 0.235, color: '#9b59b6' },
];

export default function TransistorTechPanel() {
  const [selectedTech, setSelectedTech] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [showComparison, setShowComparison] = useState(true);
  const [autoPlay, setAutoPlay] = useState(false);
  const autoPlayRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    log_event('START', 'Painel de Tecnologias de Transistores iniciado');
    return () => log_event('END', 'Painel de Tecnologias de Transistores encerrado');
  }, []);

  useEffect(() => {
    if (autoPlay && TRANSISTOR_TECHNOLOGIES.length > 0) {
      let index = TRANSISTOR_TECHNOLOGIES.findIndex(t => t.id === selectedTech?.id);
      if (index === -1) index = 0;
      
      autoPlayRef.current = setInterval(() => {
        index = (index + 1) % TRANSISTOR_TECHNOLOGIES.length;
        setSelectedTech(TRANSISTOR_TECHNOLOGIES[index]);
      }, 3000);
      
      return () => clearInterval(autoPlayRef.current);
    }
  }, [autoPlay, selectedTech]);

  const handleTechSelect = (tech) => {
    setSelectedTech(tech);
    setZoomLevel(1);
    log_event('INFO', 'Tecnologia selecionada', { technology: tech.id, nodeSize: tech.nodeSize });
  };

  const getTransistorWidth = (nodeSize, zoom) => {
    // Escala visual: 1nm = 10px base, multiplicado pelo zoom
    return nodeSize * 10 * zoom;
  };

  const getComparisonScale = (objSize, transistorSize, zoom) => {
    const ratio = objSize / transistorSize;
    return Math.min(ratio * zoom * 0.5, 50); // Limitar tamanho visual
  };

  const getStatusBadge = (status) => {
    const badges = {
      'legacy': { text: 'Legado', color: '#6b7280' },
      'mature': { text: 'Maduro', color: '#3b82f6' },
      'current': { text: 'Atual', color: '#22c55e' },
      'cutting-edge': { text: 'Avançado', color: '#eab308' },
      'upcoming': { text: 'Próximo', color: '#f97316' },
      'future': { text: 'Futuro', color: '#8b5cf6' }
    };
    return badges[status] || badges['legacy'];
  };

  return (
    <div className="transistor-tech-panel">
      <div className="panel-header">
        <h2>🔬 Tecnologias de Fabricação de Transistores</h2>
        <p className="intro-text">
          Explore a evolução das tecnologias de fabricação de semicondutores, do 10nm ao 1.6nm. 
          Compare as dimensões dos transistores e entenda como a miniaturização impacta a performance.
        </p>
      </div>

      <div className="panel-controls">
        <button 
          className={`control-btn ${autoPlay ? 'active' : ''}`}
          onClick={() => setAutoPlay(!autoPlay)}
        >
          {autoPlay ? '⏸️ Pausar' : '▶️ Auto-play'}
        </button>
        <button 
          className={`control-btn ${showComparison ? 'active' : ''}`}
          onClick={() => setShowComparison(!showComparison)}
        >
          {showComparison ? '🔍 Ocultar Comparação' : '🔍 Mostrar Comparação'}
        </button>
      </div>

      <div className="tech-grid">
        {TRANSISTOR_TECHNOLOGIES.map(tech => (
          <div
            key={tech.id}
            className={`tech-card ${selectedTech?.id === tech.id ? 'selected' : ''}`}
            onClick={() => handleTechSelect(tech)}
            style={{ borderColor: selectedTech?.id === tech.id ? tech.color : '#e5e7eb' }}
          >
            <div className="tech-header">
              <span className="tech-name">{tech.name}</span>
              <span 
                className="status-badge"
                style={{ backgroundColor: getStatusBadge(tech.status).color }}
              >
                {getStatusBadge(tech.status).text}
              </span>
            </div>
            <div className="tech-info">
              <div className="info-row">
                <span className="info-label">Tamanho do Nó:</span>
                <span className="info-value">{tech.nodeSize}nm</span>
              </div>
              <div className="info-row">
                <span className="info-label">Comprimento de Gate:</span>
                <span className="info-value">{tech.gateLength}nm</span>
              </div>
              <div className="info-row">
                <span className="info-label">Pitch:</span>
                <span className="info-value">{tech.pitch}nm</span>
              </div>
              <div className="info-row">
                <span className="info-label">Densidade:</span>
                <span className="info-value">{tech.density}</span>
              </div>
            </div>
            <div className="tech-preview">
              <div 
                className="transistor-visual"
                style={{ 
                  width: getTransistorWidth(tech.nodeSize, 1),
                  height: getTransistorWidth(tech.nodeSize, 1),
                  backgroundColor: tech.color
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {selectedTech && (
        <div className="tech-detail">
          <div className="detail-header">
            <h3 style={{ color: selectedTech.color }}>{selectedTech.name}</h3>
            <button className="close-btn" onClick={() => setSelectedTech(null)}>✕</button>
          </div>
          
          <div className="detail-content">
            <div className="detail-section">
              <h4>📋 Descrição</h4>
              <p>{selectedTech.description}</p>
            </div>
            
            <div className="detail-section">
              <h4>🏭 Aplicações</h4>
              <p>{selectedTech.applications}</p>
            </div>
            
            <div className="detail-section">
              <h4>📅 Período</h4>
              <p>{selectedTech.year}</p>
            </div>
            
            <div className="detail-section">
              <h4>⚡ Eficiência Energética</h4>
              <p>{selectedTech.power}</p>
            </div>
          </div>

          <div className="zoom-section">
            <h4>🔍 Visualização com Zoom</h4>
            <div className="zoom-controls">
              <button onClick={() => setZoomLevel(Math.max(0.5, zoomLevel - 0.5))}>−</button>
              <span className="zoom-level">{zoomLevel}x</span>
              <button onClick={() => setZoomLevel(Math.min(10, zoomLevel + 0.5))}>+</button>
              <button onClick={() => setZoomLevel(1)}>Reset</button>
            </div>
            
            <div className="zoom-visual">
              <div className="transistor-container">
                <div 
                  className="transistor-large"
                  style={{ 
                    width: getTransistorWidth(selectedTech.nodeSize, zoomLevel),
                    height: getTransistorWidth(selectedTech.nodeSize, zoomLevel),
                    backgroundColor: selectedTech.color,
                    minWidth: '20px',
                    minHeight: '20px'
                  }}
                >
                  <span className="transistor-label">
                    {selectedTech.nodeSize}nm
                  </span>
                </div>
              </div>
              
              {showComparison && (
                <div className="comparison-panel">
                  <h5>Comparação de Escala</h5>
                  <div className="comparison-list">
                    {COMPARISON_OBJECTS.map(obj => (
                      <div key={obj.name} className="comparison-item">
                        <span className="comparison-name">{obj.name}</span>
                        <div className="comparison-bar">
                          <div 
                            className="comparison-fill"
                            style={{ 
                              width: `${Math.min(getComparisonScale(obj.size, selectedTech.nodeSize, zoomLevel), 100)}%`,
                              backgroundColor: obj.color
                            }}
                          />
                          <span className="comparison-size">
                            {obj.size > 1000 ? `${(obj.size/1000).toFixed(1)}µm` : `${obj.size}nm`}
                          </span>
                        </div>
                        <span className="comparison-ratio">
                          {(obj.size / selectedTech.nodeSize).toFixed(0)}x maior
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="parallel-view">
            <h4>📊 Visão Paralela de Todas as Tecnologias</h4>
            <div className="parallel-bars">
              {TRANSISTOR_TECHNOLOGIES.map(tech => (
                <div key={tech.id} className="parallel-item">
                  <span className="parallel-label">{tech.name}</span>
                  <div className="parallel-bar-container">
                    <div 
                      className="parallel-bar"
                      style={{ 
                        width: `${getTransistorWidth(tech.nodeSize, zoomLevel)}px`,
                        backgroundColor: tech.color,
                        minWidth: '20px'
                      }}
                    />
                  </div>
                  <span className="parallel-value">{tech.nodeSize}nm</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="info-section">
        <h3>📚 Informações Adicionais</h3>
        <div className="info-cards">
          <div className="info-card">
            <h4>🎯 O que é o "Nó" de Tecnologia?</h4>
            <p>O número do nó (ex: 5nm) historicamente referia-se ao comprimento do gate do transistor. Hoje é mais um indicador de marketing da densidade e performance geral do processo de fabricação.</p>
          </div>
          <div className="info-card">
            <h4>🔬 FinFET vs GAAFET</h4>
            <p>FinFET (Fin Field-Effect Transistor) usa uma "barbatana" vertical de silício. GAAFET (Gate-All-Around) envolve o canal com o gate em todos os lados, oferecendo melhor controle e menor leakage.</p>
          </div>
          <div className="info-card">
            <h4>⚡ EUV Lithography</h4>
            <p>Extreme Ultraviolet Lithography usa luz de 13.5nm para imprimir padrões extremamente pequenos. Essencial para nós abaixo de 7nm. Substituiu a litografia imersa de 193nm.</p>
          </div>
          <div className="info-card">
            <h4>📈 Lei de Moore</h4>
            <p>A lei de Moore previa que o número de transistores dobraria a cada 2 anos. A miniaturização contínua (10nm → 7nm → 5nm → 3nm → 2nm → 1.6nm) mantém essa tendência, apesar dos crescentes desafios físicos.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
