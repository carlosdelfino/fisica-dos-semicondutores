import { useState, useEffect } from 'react';
import { log_event } from '../physics/formulas.js';
import { TeX } from './Math.jsx';
import 'katex/dist/katex.min.css';

const FZ_FORMULAS = {
  zoneMelting: {
    title: 'Fusão de Zona',
    formulas: [
      {
        name: 'Equação de Distribuição',
        formula: 'C_s = C_0 \\left[ k_0 (1 - f)^{k_0 - 1} \\right]',
        description: 'Concentração no sólido após múltiplas passagens da zona fundida.'
      },
      {
        name: 'Número de Passagens Eficaz',
        formula: 'n_{eff} = \\frac{L}{v \\tau}',
        description: 'Número de passagens da zona necessárias para purificação efetiva.'
      }
    ]
  },
  purification: {
    title: 'Purificação',
    formulas: [
      {
        name: 'Coeficiente de Segregação',
        formula: 'k = \\frac{C_s}{C_l}',
        description: 'Razão entre concentração no sólido e no líquido na interface.'
      },
      {
        name: 'Eficiência de Purificação',
        formula: '\\eta = 1 - \\frac{C_{final}}{C_{initial}}',
        description: 'Eficiência da remoção de impurezas.'
      }
    ]
  },
  thermal: {
    title: 'Dinâmica Térmica',
    formulas: [
      {
        name: 'Fluxo de Calor na Zona',
        formula: 'q = -k \\nabla T + \\rho c_p \\mathbf{v} T',
        description: 'Transferência de calor com convecção na zona fundida.'
      },
      {
        name: 'Temperatura da Zona',
        formula: 'T_z = T_m + \\frac{P_{RF}}{2\\pi r L h}',
        description: 'Temperatura da zona fundida em função da potência RF.'
      }
    ]
  }
};

export default function FloatZoneContent() {
  const [activeFormulaTab, setActiveFormulaTab] = useState('zoneMelting');

  useEffect(() => {
    log_event('START', 'Conteúdo Float Zone iniciado');
    return () => log_event('END', 'Conteúdo Float Zone encerrado');
  }, []);

  const renderFormula = (formula) => {
    return (
      <div key={formula.name} className="formula-item">
        <h4 className="formula-name">{formula.name}</h4>
        <div className="formula-display">
          <TeX math={formula.formula} block />
        </div>
        <p className="formula-description">{formula.description}</p>
      </div>
    );
  };

  return (
    <div className="float-zone-content">
      <div className="panel-header">
        <h2>🌊 Método Float Zone (FZ)</h2>
        <p className="intro-text">
          O método Float Zone é uma técnica de crescimento de cristais que utiliza uma zona fundida móvel para purificar e cristalizar materiais.
          É especialmente usado para silício de alta pureza para aplicações de alta potência.
        </p>
      </div>

      <div className="method-overview">
        <h3>📋 Visão Geral</h3>
        <div className="overview-cards">
          <div className="overview-card">
            <h4>🎯 Princípio Básico</h4>
            <p>Uma zona fundida é criada e movida ao longo de um tarugo policristalino vertical. A zona flutua devido à tensão superficial, permitindo purificação e cristalização sem contato com cadinho.</p>
          </div>
          <div className="overview-card">
            <h4>💎 Alta Pureza</h4>
            <p>O método FZ produz silício com pureza extremamente alta (resistividade > 10.000 Ω·cm) pois não há contaminação por cadinho de quartzo.</p>
          </div>
          <div className="overview-card">
            <h4>⚡ Aplicações</h4>
            <p>Principalmente usado para dispositivos de alta potência, tiristores, IGBTs e componentes que requerem baixíssimas concentrações de oxigênio e carbono.</p>
          </div>
          <div className="overview-card">
            <h4>🔧 Aquecimento RF</h4>
            <p>A zona fundida é criada por aquecimento por indução de radiofrequência (RF), que gera calor diretamente no material sem contato físico.</p>
          </div>
        </div>
      </div>

      <div className="method-diagram">
        <h3>🔬 Diagrama do Processo</h3>
        <div className="diagram-container">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" className="fz-diagram">
            <defs>
              <linearGradient id="fzMetal" x1="0" x2="1">
                <stop offset="0" stopColor="#94a3b8"/>
                <stop offset="0.5" stopColor="#cbd5e1"/>
                <stop offset="1" stopColor="#64748b"/>
              </linearGradient>
              <linearGradient id="fzMelt" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0" stopColor="#ffd166"/>
                <stop offset="0.5" stopColor="#ff7a18"/>
                <stop offset="1" stopColor="#9a3412"/>
              </linearGradient>
              <radialGradient id="fzGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0" stopColor="#fef08a" stopOpacity="0.6"/>
                <stop offset="1" stopColor="#fb923c" stopOpacity="0"/>
              </radialGradient>
            </defs>

            {/* Background */}
            <rect x="0" y="0" width="800" height="600" fill="#f8fafc"/>

            {/* RF Coil */}
            <ellipse cx="400" cy="280" rx="120" ry="30" fill="none" stroke="#ea580c" strokeWidth="8"/>
            <text x="400" y="260" fontSize="14" fill="#ea580c" textAnchor="middle">Bobina RF</text>

            {/* Ingot - Top (solid) */}
            <rect x="360" y="50" width="80" height="180" fill="url(#fzMetal)" stroke="#334155" strokeWidth="2"/>
            <text x="400" y="100" fontSize="12" fill="#0f172a" textAnchor="middle">Tarugo Sólido</text>

            {/* Molten Zone */}
            <ellipse cx="400" cy="280" rx="45" ry="25" fill="url(#fzMelt)" stroke="#7c2d12" strokeWidth="2"/>
            <ellipse cx="400" cy="280" rx="45" ry="25" fill="url(#fzGlow)"/>
            <text x="400" y="320" fontSize="12" fill="#7c2d12" textAnchor="middle">Zona Fundida</text>

            {/* Ingot - Bottom (solid) */}
            <rect x="360" y="320" width="80" height="230" fill="url(#fzMetal)" stroke="#334155" strokeWidth="2"/>
            <text x="400" y="450" fontSize="12" fill="#0f172a" textAnchor="middle">Cristal Crescido</text>

            {/* Seed holder */}
            <rect x="380" y="20" width="40" height="30" fill="#475569" stroke="#1e293b" strokeWidth="2"/>
            <text x="400" y="580" fontSize="12" fill="#0f172a" textAnchor="middle">Suporte Inferior</text>

            {/* Arrows showing movement */}
            <path d="M500 280 L560 280" stroke="#3b82f6" strokeWidth="3" markerEnd="url(#arrow)"/>
            <text x="570" y="285" fontSize="14" fill="#3b82f6">Movimento da Zona</text>

            {/* Rotation indicators */}
            <path d="M320 280 C300 260, 320 240, 340 260" fill="none" stroke="#10b981" strokeWidth="2" markerEnd="url(#arrow)"/>
            <text x="280" y="285" fontSize="12" fill="#10b981">Rotação</text>

            {/* Labels */}
            <text x="100" y="100" fontSize="14" fill="#0f172a">Vantagens:</text>
            <text x="100" y="125" fontSize="12" fill="#475569">• Alta pureza</text>
            <text x="100" y="145" fontSize="12" fill="#475569">• Sem contaminação</text>
            <text x="100" y="165" fontSize="12" fill="#475569">• Baixo oxigênio</text>

            <text x="600" y="400" fontSize="14" fill="#0f172a">Limitações:</text>
            <text x="600" y="425" fontSize="12" fill="#475569">• Diâmetro limitado</text>
            <text x="600" y="445" fontSize="12" fill="#475569">• Custo alto</text>
            <text x="600" y="465" fontSize="12" fill="#475569">• Processo lento</text>
          </svg>
        </div>
      </div>

      <div className="formulas-container">
        <div className="formulas-header">
          <h3>📐 Fórmulas do Processo FZ</h3>
          <div className="formula-tabs">
            {Object.keys(FZ_FORMULAS).map(key => (
              <button
                key={key}
                className={`formula-tab ${activeFormulaTab === key ? 'active' : ''}`}
                onClick={() => setActiveFormulaTab(key)}
              >
                {FZ_FORMULAS[key].title}
              </button>
            ))}
          </div>
        </div>

        <div className="formulas-content">
          {FZ_FORMULAS[activeFormulaTab] && (
            <div className="formula-section">
              <h4>{FZ_FORMULAS[activeFormulaTab].title}</h4>
              <div className="formulas-list">
                {FZ_FORMULAS[activeFormulaTab].formulas.map(renderFormula)}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="engineering-details">
        <h3>⚙️ Detalhes de Engenharia</h3>
        <div className="engineering-cards">
          <div className="engineering-card">
            <h4>🔧 Sistema de Aquecimento RF</h4>
            <ul>
              <li>Frequência: 50-500 kHz</li>
              <li>Potência: 10-50 kW</li>
              <li>Bobina de cobre resfriada a água</li>
              <li>Controle de temperatura: ±1°C</li>
            </ul>
          </div>
          <div className="engineering-card">
            <h4>🎯 Controle de Diâmetro</h4>
            <ul>
              <li>Sensores ópticos de alta precisão</li>
              <li>Controle de potência RF em tempo real</li>
              <li>Velocidade de puxamento: 1-10 mm/min</li>
              <li>Rotação: 5-30 RPM</li>
            </ul>
          </div>
          <div className="engineering-card">
            <h4>💎 Propriedades do Produto</h4>
            <ul>
              <li>Resistividade: 1-10.000 Ω·cm</li>
              <li>Oxigênio: < 5 ppba (vs 10-20 ppm em CZ)</li>
              <li>Carbono: < 0.1 ppma</li>
              <li>Diâmetro máximo: ~200 mm</li>
            </ul>
          </div>
          <div className="engineering-card">
            <h4>⚠️ Desafios</h4>
            <ul>
              <li>Estabilidade da zona fundida</li>
              <li>Controle de impurezas voláteis</li>
              <li>Uniformidade dopante</li>
              <li>Custo de produção elevado</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="applications">
        <h3>🎯 Aplicações Específicas</h3>
        <div className="application-cards">
          <div className="application-card">
            <h4>⚡ Dispositivos de Potência</h4>
            <p>Tiristores, IGBTs, diodos de alta potência requerem silício FZ devido à alta resistividade e baixas perdas.</p>
          </div>
          <div className="application-card">
            <h4>🔬 Sensores de Radiação</h4>
            <p>Detectores de partículas e sensores de imagem utilizam silício FZ pela alta pureza e longa vida útil de portadores.</p>
          </div>
          <div className="application-card">
            <h4>📡 RF e Micro-ondas</h4>
            <p>Dispositivos de alta frequência se beneficiam das baixas perdas e alta resistividade do silício FZ.</p>
          </div>
          <div className="application-card">
            <h4>🧪 Pesquisa Científica</h4>
            <p>Experimentos de física fundamental que requerem materiais de ultra-alta pureza.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
