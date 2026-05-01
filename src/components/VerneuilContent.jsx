import { useState, useEffect } from 'react';
import { log_event } from '../physics/formulas.js';
import { TeX } from './Math.jsx';
import 'katex/dist/katex.min.css';

const VERNEUIL_FORMULAS = {
  fusion: {
    title: 'Fusão por Chama',
    formulas: [
      {
        name: 'Taxa de Fusão',
        formula: '\\frac{dm}{dt} = \\frac{\\eta P}{\\Delta H_f}',
        description: 'Taxa de fusão em função da potência da chama e entalpia de fusão.'
      },
      {
        name: 'Fluxo de Calor',
        formula: 'q = h(T_{flame} - T_{melt})',
        description: 'Transferência de calor da chama para o pó fundido.'
      }
    ]
  },
  growth: {
    title: 'Crescimento Cristalino',
    formulas: [
      {
        name: 'Velocidade de Crescimento',
        formula: 'v = \\frac{1}{\\rho A} \\frac{dm}{dt}',
        description: 'Velocidade de crescimento do cristal em função da taxa de fusão.'
      },
      {
        name: 'Resfriamento',
        formula: '\\frac{dT}{dt} = -\\frac{hA}{\\rho c_p V}(T - T_{amb})',
        description: 'Taxa de resfriamento do cristal.'
      }
    ]
  },
  thermal: {
    title: 'Dinâmica Térmica',
    formulas: [
      {
        name: 'Gradiente Térmico',
        formula: 'G = \\frac{T_{flame} - T_{substrate}}{L}',
        description: 'Gradiente de temperatura na zona de crescimento.'
      },
      {
        name: 'Número de Stefan',
        formula: 'Ste = \\frac{c_p \\Delta T}{\\Delta H_f}',
        description: 'Relação entre calor sensível e latente.'
      }
    ]
  }
};

export default function VerneuilContent() {
  const [activeFormulaTab, setActiveFormulaTab] = useState('fusion');

  useEffect(() => {
    log_event('START', 'Conteúdo Verneuil iniciado');
    return () => log_event('END', 'Conteúdo Verneuil encerrado');
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
    <div className="verneuil-content">
      <div className="panel-header">
        <h2>🔥 Método Verneuil (Flame Fusion)</h2>
        <p className="intro-text">
          O método Verneuil, também conhecido como fusão por chama, é uma técnica de crescimento de cristais que utiliza uma chama de oxi-hidrogênio para fundir pó alimentado.
          É historicamente importante para produção de rubis e safiras sintéticos.
        </p>
      </div>

      <div className="method-overview">
        <h3>📋 Visão Geral</h3>
        <div className="overview-cards">
          <div className="overview-card">
            <h4>🎯 Princípio Básico</h4>
            <p>Pó fino do material é alimentado através de uma chama de oxi-hidrogênio, fundindo e depositando-se sobre um cristal semente, formando um "boule" (tarugo) monocristalino.</p>
          </div>
          <div className="overview-card">
            <h4>🔥 Fusão por Chama</h4>
            <p>Temperaturas de até 2800°C são alcançadas com chama oxi-hidrogênio, permitindo fusão de materiais com pontos de fusão muito altos.</p>
          </div>
          <div className="overview-card">
            <h4>💎 Histórico</h4>
            <p>Desenvolvido por Auguste Verneuil em 1902, foi o primeiro método industrial para produção de cristais sintéticos de alta qualidade.</p>
          </div>
          <div className="overview-card">
            <h4>🏭 Aplicações Clássicas</h4>
            <p>Principalmente usado para rubis, safiras e outros óxidos refratários como YAG e espinélios.</p>
          </div>
        </div>
      </div>

      <div className="method-diagram">
        <h3>🔬 Diagrama do Processo</h3>
        <div className="diagram-container">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" className="verneuil-diagram">
            <defs>
              <radialGradient id="flame" cx="50%" cy="100%" r="80%">
                <stop offset="0" stopColor="#fef08a" stopOpacity="0.9"/>
                <stop offset="0.4" stopColor="#fb923c" stopOpacity="0.7"/>
                <stop offset="0.8" stopColor="#ea580c" stopOpacity="0.4"/>
                <stop offset="1" stopColor="#dc2626" stopOpacity="0"/>
              </radialGradient>
              <linearGradient id="crystal" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0" stopColor="#dc2626"/>
                <stop offset="0.5" stopColor="#ef4444"/>
                <stop offset="1" stopColor="#f87171"/>
              </linearGradient>
              <linearGradient id="powder" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0" stopColor="#9ca3af"/>
                <stop offset="1" stopColor="#6b7280"/>
              </linearGradient>
            </defs>

            <rect x="0" y="0" width="800" height="600" fill="#f8fafc"/>

            {/* Powder hopper */}
            <rect x="350" y="30" width="100" height="80" fill="#475569" stroke="#1e293b" strokeWidth="2"/>
            <polygon points="400,110 380,130 420,130" fill="#475569" stroke="#1e293b" strokeWidth="2"/>
            <text x="400" y="75" fontSize="12" fill="#ffffff" textAnchor="middle">Pó</text>

            {/* Powder stream */}
            <path d="M400 130 L400 200" stroke="#9ca3af" strokeWidth="8" strokeDasharray="4 4"/>
            <circle cx="400" cy="150" r="3" fill="#9ca3af"/>
            <circle cx="400" cy="170" r="3" fill="#9ca3af"/>
            <circle cx="400" cy="190" r="3" fill="#9ca3af"/>

            {/* Flame */}
            <ellipse cx="400" cy="220" rx="60" ry="80" fill="url(#flame)"/>
            <text x="400" y="240" fontSize="12" fill="#dc2626" textAnchor="middle">Chama</text>
            <text x="400" y="255" fontSize="12" fill="#dc2626" textAnchor="middle">O₂-H₂</text>

            {/* Molten zone */}
            <ellipse cx="400" cy="300" rx="30" ry="15" fill="#fbbf24" opacity="0.8"/>
            <text x="400" y="305" fontSize="10" fill="#92400e" textAnchor="middle">Fuso</text>

            {/* Growing crystal (boule) */}
            <ellipse cx="400" cy="400" rx="50" ry="20" fill="url(#crystal)"/>
            <path d="M350 400 C350 450, 380 500, 400 520 C420 500, 450 450, 450 400" fill="url(#crystal)"/>
            <text x="400" y="460" fontSize="12" fill="#ffffff" textAnchor="middle">Boule</text>

            {/* Seed holder */}
            <rect x="380" y="520" width="40" height="50" fill="#334155" stroke="#1e293b" strokeWidth="2"/>
            <text x="400" y="550" fontSize="11" fill="#ffffff" textAnchor="middle">Semente</text>

            {/* Rotation indicator */}
            <path d="M460 400 C480 380, 480 360, 460 340" fill="none" stroke="#10b981" strokeWidth="2" markerEnd="url(#arrow)"/>
            <text x="490" y="375" fontSize="12" fill="#10b981">Rotação</text>

            {/* Labels */}
            <text x="100" y="100" fontSize="14" fill="#0f172a">Vantagens:</text>
            <text x="100" y="125" fontSize="12" fill="#475569">• Alta temperatura</text>
            <text x="100" y="145" fontSize="12" fill="#475569">• Sem cadinho</text>
            <text x="100" y="165" fontSize="12" fill="#475569">• Baixo custo</text>
            <text x="100" y="185" fontSize="12" fill="#475569">• Processo rápido</text>

            <text x="600" y="350" fontSize="14" fill="#0f172a">Limitações:</text>
            <text x="600" y="375" fontSize="12" fill="#475569">• Tamanho limitado</text>
            <text x="600" y="395" fontSize="12" fill="#475569">• Tensões térmicas</text>
            <text x="600" y="415" fontSize="12" fill="#475569">• Baixa pureza</text>
            <text x="600" y="435" fontSize="12" fill="#475569">• Defeitos internos</text>

            {/* Temperature indicator */}
            <text x="470" y="220" fontSize="16" fill="#dc2626">🔥</text>
            <text x="475" y="240" fontSize="11" fill="#dc2626">~2800°C</text>
          </svg>
        </div>
      </div>

      <div className="formulas-container">
        <div className="formulas-header">
          <h3>📐 Fórmulas do Processo</h3>
          <div className="formula-tabs">
            {Object.keys(VERNEUIL_FORMULAS).map(key => (
              <button
                key={key}
                className={`formula-tab ${activeFormulaTab === key ? 'active' : ''}`}
                onClick={() => setActiveFormulaTab(key)}
              >
                {VERNEUIL_FORMULAS[key].title}
              </button>
            ))}
          </div>
        </div>

        <div className="formulas-content">
          {VERNEUIL_FORMULAS[activeFormulaTab] && (
            <div className="formula-section">
              <h4>{VERNEUIL_FORMULAS[activeFormulaTab].title}</h4>
              <div className="formulas-list">
                {VERNEUIL_FORMULAS[activeFormulaTab].formulas.map(renderFormula)}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="engineering-details">
        <h3>⚙️ Detalhes de Engenharia</h3>
        <div className="engineering-cards">
          <div className="engineering-card">
            <h4>🔥 Sistema de Chama</h4>
            <ul>
              <li>Combustível: hidrogênio puro</li>
              <li>Oxidante: oxigênio puro</li>
              <li>Temperatura: até 2800°C</li>
              <li>Controle de fluxo: precisão ±1%</li>
            </ul>
          </div>
          <div className="engineering-card">
            <h4>📦 Alimentação de Pó</h4>
            <ul>
              <li>Tamanho do pó: 1-100 µm</li>
              <li>Taxa de alimentação: 1-10 g/h</li>
              <li>Vibrador para controle</li>
              <li>Distribuição uniforme</li>
            </ul>
          </div>
          <div className="engineering-card">
            <h4>💎 Materiais Comuns</h4>
            <ul>
              <li>Óxidos: Al₂O₃ (rubí, safira)</li>
              <li>YAG (ítrio-alumínio-granada)</li>
              <li>Espinélios (MgAl₂O₄)</li>
              <li>Titânio, zircônio</li>
            </ul>
          </div>
          <div className="engineering-card">
            <h4>⚠️ Desafios</h4>
            <ul>
              <li>Controle de temperatura</li>
              <li>Uniformidade do pó</li>
              <li>Tensões de resfriamento</li>
              <li>Formação de bolhas</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="applications">
        <h3>🎯 Aplicações Específicas</h3>
        <div className="application-cards">
          <div className="application-card">
            <h4>💎 Pedras Preciosas Sintéticas</h4>
            <p>Rubis e safiras para joalheria, relógios e aplicações industriais como rolamentos e janelas ópticas.</p>
          </div>
          <div className="application-card">
            <h4>🔭 Lasers</h4>
            <p>Cristais de YAG dopados com neodímio (Nd:YAG) para lasers de alta potência e aplicações médicas.</p>
          </div>
          <div className="application-card">
            <h4>🧪 Pesquisa</h4>
            <p>Crescimento experimental de óxidos refratários para pesquisa em ciência de materiais.</p>
          </div>
          <div className="application-card">
            <h4>🏭 Indústria</h4>
            <p>Componentes cerâmicos especiais para aplicações de alta temperatura e resistência ao desgaste.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
