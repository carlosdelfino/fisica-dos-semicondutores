import { useState, useRef, useEffect } from 'react';
import { log_event } from '../physics/formulas.js';
import { useTranslation } from '../contexts/LanguageContext.jsx';

/**
 * Metadados estáticos das tecnologias de fabricação (textos em locales/transistorTech)
 */
const TECH_META = [
  { id: '10nm', nodeSize: 10, gateLength: 42, pitch: 64, status: 'legacy', color: '#ef4444' },
  { id: '7nm', nodeSize: 7, gateLength: 30, pitch: 54, status: 'mature', color: '#f97316' },
  { id: '5nm', nodeSize: 5, gateLength: 22, pitch: 45, status: 'current', color: '#eab308' },
  { id: '3nm', nodeSize: 3, gateLength: 18, pitch: 36, status: 'cutting-edge', color: '#22c55e' },
  { id: '2nm', nodeSize: 2, gateLength: 12, pitch: 30, status: 'upcoming', color: '#3b82f6' },
  { id: 'a16', nodeSize: 1.6, gateLength: 10, pitch: 24, status: 'future', color: '#8b5cf6' }
];

/**
 * Objetos para comparação visual (chave i18n + tamanho em nm)
 */
const COMPARISON_OBJECTS = [
  { key: 'hair', size: 70000, color: '#888888' },
  { key: 'cell', size: 10000, color: '#ff6b6b' },
  { key: 'bacteria', size: 2000, color: '#4ecdc4' },
  { key: 'virus', size: 100, color: '#45b7d1' },
  { key: 'dna', size: 2, color: '#f39c12' },
  { key: 'silicon', size: 0.235, color: '#9b59b6' }
];

export default function TransistorTechPanel() {
  const { t } = useTranslation();
  const [selectedId, setSelectedId] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [showComparison, setShowComparison] = useState(true);
  const [autoPlay, setAutoPlay] = useState(false);
  const autoPlayRef = useRef(null);

  useEffect(() => {
    log_event('START', 'Painel de Tecnologias de Transistores iniciado');
    return () => log_event('END', 'Painel de Tecnologias de Transistores encerrado');
  }, []);

  useEffect(() => {
    if (autoPlay && TECH_META.length > 0) {
      let index = TECH_META.findIndex((tech) => tech.id === selectedId);
      if (index === -1) index = 0;

      autoPlayRef.current = setInterval(() => {
        index = (index + 1) % TECH_META.length;
        setSelectedId(TECH_META[index].id);
      }, 3000);

      return () => clearInterval(autoPlayRef.current);
    }
  }, [autoPlay, selectedId]);

  const handleTechSelect = (tech) => {
    setSelectedId(tech.id);
    setZoomLevel(1);
    log_event('INFO', 'Tecnologia selecionada', { technology: tech.id, nodeSize: tech.nodeSize });
  };

  const getTransistorWidth = (nodeSize, zoom) => nodeSize * 10 * zoom;

  const getComparisonScale = (objSize, transistorSize, zoom) => {
    const ratio = objSize / transistorSize;
    return Math.min(ratio * zoom * 0.5, 50);
  };

  const STATUS_COLORS = {
    legacy: '#6b7280',
    mature: '#3b82f6',
    current: '#22c55e',
    'cutting-edge': '#eab308',
    upcoming: '#f97316',
    future: '#8b5cf6'
  };

  const tt = (suffix) => t(`transistorTech.${suffix}`);
  const cat = (id, field) => {
    const v = t(`transistorTech.catalog.${id}.${field}`);
    return v === `transistorTech.catalog.${id}.${field}` ? '' : v;
  };
  const nm = tt('ui.units.nm') || 'nm';
  const um = tt('ui.units.um') || 'µm';

  const formatSize = (size) => (size > 1000 ? `${(size / 1000).toFixed(1)}${um}` : `${size}${nm}`);

  const selectedMeta = TECH_META.find((tech) => tech.id === selectedId) || null;

  return (
    <div className="transistor-tech-panel">
      <div className="panel-header">
        <h2>{tt('ui.title')}</h2>
        <p className="intro-text">{tt('ui.intro')}</p>
      </div>

      <div className="panel-controls">
        <button
          className={`control-btn ${autoPlay ? 'active' : ''}`}
          onClick={() => setAutoPlay(!autoPlay)}
        >
          {autoPlay ? tt('ui.controls.pause') : tt('ui.controls.play')}
        </button>
        <button
          className={`control-btn ${showComparison ? 'active' : ''}`}
          onClick={() => setShowComparison(!showComparison)}
        >
          {showComparison ? tt('ui.controls.hideComparison') : tt('ui.controls.showComparison')}
        </button>
      </div>

      <div className="tech-grid">
        {TECH_META.map((tech) => (
          <div
            key={tech.id}
            className={`tech-card ${selectedId === tech.id ? 'selected' : ''}`}
            onClick={() => handleTechSelect(tech)}
            style={{ borderColor: selectedId === tech.id ? tech.color : '#e5e7eb' }}
          >
            <div className="tech-header">
              <span className="tech-name">{cat(tech.id, 'name')}</span>
              <span
                className="status-badge"
                style={{ backgroundColor: STATUS_COLORS[tech.status] || STATUS_COLORS.legacy }}
              >
                {tt(`ui.status.${tech.status}`)}
              </span>
            </div>
            <div className="tech-info">
              <div className="info-row">
                <span className="info-label">{tt('ui.card.nodeSize')}</span>
                <span className="info-value">{tech.nodeSize}{nm}</span>
              </div>
              <div className="info-row">
                <span className="info-label">{tt('ui.card.gateLength')}</span>
                <span className="info-value">{tech.gateLength}{nm}</span>
              </div>
              <div className="info-row">
                <span className="info-label">{tt('ui.card.pitch')}</span>
                <span className="info-value">{tech.pitch}{nm}</span>
              </div>
              <div className="info-row">
                <span className="info-label">{tt('ui.card.density')}</span>
                <span className="info-value">{cat(tech.id, 'density')}</span>
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

      {selectedMeta && (
        <div className="tech-detail">
          <div className="detail-header">
            <h3 style={{ color: selectedMeta.color }}>{cat(selectedMeta.id, 'name')}</h3>
            <button className="close-btn" onClick={() => setSelectedId(null)}>✕</button>
          </div>

          <div className="detail-content">
            <div className="detail-section">
              <h4>{tt('ui.detail.description')}</h4>
              <p>{cat(selectedMeta.id, 'description')}</p>
            </div>

            <div className="detail-section">
              <h4>{tt('ui.detail.applications')}</h4>
              <p>{cat(selectedMeta.id, 'applications')}</p>
            </div>

            <div className="detail-section">
              <h4>{tt('ui.detail.period')}</h4>
              <p>{cat(selectedMeta.id, 'year')}</p>
            </div>

            <div className="detail-section">
              <h4>{tt('ui.detail.power')}</h4>
              <p>{cat(selectedMeta.id, 'power')}</p>
            </div>
          </div>

          <div className="zoom-section">
            <h4>{tt('ui.detail.zoomTitle')}</h4>
            <div className="zoom-controls">
              <button onClick={() => setZoomLevel(Math.max(0.5, zoomLevel - 0.5))}>−</button>
              <span className="zoom-level">{zoomLevel}x</span>
              <button onClick={() => setZoomLevel(Math.min(10, zoomLevel + 0.5))}>+</button>
              <button onClick={() => setZoomLevel(1)}>{tt('ui.detail.reset')}</button>
            </div>

            <div className="zoom-visual">
              <div className="transistor-container">
                <div
                  className="transistor-large"
                  style={{
                    width: getTransistorWidth(selectedMeta.nodeSize, zoomLevel),
                    height: getTransistorWidth(selectedMeta.nodeSize, zoomLevel),
                    backgroundColor: selectedMeta.color,
                    minWidth: '20px',
                    minHeight: '20px'
                  }}
                >
                  <span className="transistor-label">
                    {selectedMeta.nodeSize}{nm}
                  </span>
                </div>
              </div>

              {showComparison && (
                <div className="comparison-panel">
                  <h5>{tt('ui.detail.comparisonTitle')}</h5>
                  <div className="comparison-list">
                    {COMPARISON_OBJECTS.map((obj) => (
                      <div key={obj.key} className="comparison-item">
                        <span className="comparison-name">{tt(`ui.comparison.${obj.key}`)}</span>
                        <div className="comparison-bar">
                          <div
                            className="comparison-fill"
                            style={{
                              width: `${Math.min(getComparisonScale(obj.size, selectedMeta.nodeSize, zoomLevel), 100)}%`,
                              backgroundColor: obj.color
                            }}
                          />
                          <span className="comparison-size">{formatSize(obj.size)}</span>
                        </div>
                        <span className="comparison-ratio">
                          {t('transistorTech.ui.detail.biggerThan', {
                            n: (obj.size / selectedMeta.nodeSize).toFixed(0)
                          })}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="parallel-view">
            <h4>{tt('ui.detail.parallelTitle')}</h4>
            <div className="parallel-bars">
              {TECH_META.map((tech) => (
                <div key={tech.id} className="parallel-item">
                  <span className="parallel-label">{cat(tech.id, 'name')}</span>
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
                  <span className="parallel-value">{tech.nodeSize}{nm}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="info-section">
        <h3>{tt('ui.info.sectionTitle')}</h3>
        <div className="info-cards">
          <div className="info-card">
            <h4>{tt('ui.info.node.title')}</h4>
            <p>{tt('ui.info.node.body')}</p>
          </div>
          <div className="info-card">
            <h4>{tt('ui.info.finfetGaa.title')}</h4>
            <p>{tt('ui.info.finfetGaa.body')}</p>
          </div>
          <div className="info-card">
            <h4>{tt('ui.info.euv.title')}</h4>
            <p>{tt('ui.info.euv.body')}</p>
          </div>
          <div className="info-card">
            <h4>{tt('ui.info.moore.title')}</h4>
            <p>{tt('ui.info.moore.body')}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
