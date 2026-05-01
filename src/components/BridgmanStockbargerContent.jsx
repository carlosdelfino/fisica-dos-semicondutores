import { useState, useEffect } from 'react';
import { log_event } from '../physics/formulas.js';
import { TeX } from './Math.jsx';
import 'katex/dist/katex.min.css';

const BRIDGMAN_FORMULAS = {
  solidification: {
    title: 'Solidificação Direcional',
    formulas: [
      {
        name: 'Velocidade de Solidificação',
        formula: 'v = \\frac{dx}{dt} = \\frac{k}{\\rho L} \\frac{dT}{dx}',
        description: 'Velocidade da interface sólido-líquido em função do gradiente térmico.'
      },
      {
        name: 'Gradiente Térmico',
        formula: 'G = \\frac{T_{hot} - T_{cold}}{L}',
        description: 'Gradiente de temperatura ao longo do cadinho.'
      }
    ]
  },
  segregation: {
    title: 'Segregação',
    formulas: [
      {
        name: 'Equação de Pfann',
        formula: 'C_s(x) = C_0 k_0 (1 - k_0) e^{-k_0 v x / D}',
        description: 'Distribuição de soluto ao longo do cristal crescido.'
      },
      {
        name: 'Comprimento de Característica',
        formula: 'L_c = \\frac{D}{k_0 v}',
        description: 'Escala de comprimento para distribuição de dopantes.'
      }
    ]
  },
  thermal: {
    title: 'Transferência de Calor',
    formulas: [
      {
        name: 'Equação de Calor',
        formula: '\\rho c_p \\frac{\\partial T}{\\partial t} = k \\nabla^2 T + Q',
        description: 'Difusão térmica no sistema Bridgman-Stockbarger.'
      },
      {
        name: 'Número de Péclet Térmico',
        formula: 'Pe_T = \\frac{v L}{\\alpha}',
        description: 'Relação entre convecção e difusão térmica.'
      }
    ]
  }
};

export default function BridgmanStockbargerContent() {
  const [activeFormulaTab, setActiveFormulaTab] = useState('solidification');

  useEffect(() => {
    log_event('START', 'Conteúdo Bridgman-Stockbarger iniciado');
    return () => log_event('END', 'Conteúdo Bridgman-Stockbarger encerrado');
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
    <div className="bridgman-content">
      <div className="panel-header">
        <h2>🔥 Método Bridgman-Stockbarger</h2>
        <p className="intro-text">
          O método Bridgman-Stockbarger é uma técnica de crescimento de cristais por solidificação direcional em cadinho.
          É amplamente usado para crescer cristais de materiais ópticos, semicondutores compostos e materiais cerâmicos.
        </p>
      </div>

      <div className="method-overview">
        <h3>📋 Visão Geral</h3>
        <div className="overview-cards">
          <div className="overview-card">
            <h4>🎯 Princípio Básico</h4>
            <p>O material é fundido em um cadinho e então movido gradualmente através de um gradiente térmico controlado, causando solidificação direcional do fundo para o topo.</p>
          </div>
          <div className="overview-card">
            <h4>🏺 Cadinho Especial</h4>
            <p>Usa cadinhos com formato cônico ou com "bico" para nucleação controlada, permitindo crescimento de um único cristal a partir de um ponto.</p>
          </div>
          <div className="overview-card">
            <h4>💎 Versatilidade</h4>
            <p>Aplicável a uma ampla gama de materiais: semicondutores (GaAs, InP), ópticos (CaF₂, LiF), cerâmicas e metais especiais.</p>
          </div>
          <div className="overview-card">
            <h4>🔧 Controle Térmico</h4>
            <p>O gradiente térmico é controlado por múltiplas zonas de aquecimento, permitindo ajuste fino da velocidade de solidificação.</p>
          </div>
        </div>
      </div>

      <div className="method-diagram">
        <h3>🔬 Diagrama do Processo</h3>
        <div className="diagram-container">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" className="bridgman-diagram">
            <defs>
              <linearGradient id="bgHot" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0" stopColor="#fef3c7"/>
                <stop offset="1" stopColor="#fde68a"/>
              </linearGradient>
              <linearGradient id="bgCold" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0" stopColor="#dbeafe"/>
                <stop offset="1" stopColor="#93c5fd"/>
              </linearGradient>
              <linearGradient id="crucible" x1="0" x2="1">
                <stop offset="0" stopColor="#94a3b8"/>
                <stop offset="0.5" stopColor="#cbd5e1"/>
                <stop offset="1" stopColor="#64748b"/>
              </linearGradient>
              <linearGradient id="melt" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0" stopColor="#ffd166"/>
                <stop offset="1" stopColor="#ff7a18"/>
              </linearGradient>
              <linearGradient id="crystal" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0" stopColor="#64748b"/>
                <stop offset="1" stopColor="#94a3b8"/>
              </linearGradient>
            </defs>

            <rect x="0" y="0" width="800" height="600" fill="#f8fafc"/>

            {/* Hot Zone */}
            <rect x="50" y="50" width="200" height="250" fill="url(#bgHot)" rx="10"/>
            <text x="150" y="80" fontSize="14" fill="#92400e" textAnchor="middle">Zona Quente</text>
            <text x="150" y="100" fontSize="12" fill="#b45309" textAnchor="middle">T &gt; Tm</text>

            {/* Cold Zone */}
            <rect x="50" y="320" width="200" height="230" fill="url(#bgCold)" rx="10"/>
            <text x="150" y="350" fontSize="14" fill="#1e40af" textAnchor="middle">Zona Fria</text>
            <text x="150" y="370" fontSize="12" fill="#3b82f6" textAnchor="middle">T &lt; Tm</text>

            {/* Temperature Gradient */}
            <rect x="50" y="300" width="200" height="20" fill="#e5e7eb" opacity="0.5"/>
            <text x="150" y="315" fontSize="11" fill="#6b7280" textAnchor="middle">Gradiente Térmico</text>

            {/* Crucible with tapered bottom */}
            <path d="M350 100 L450 100 L460 450 L440 500 L360 500 L340 450 Z" fill="url(#crucible)" stroke="#334155" strokeWidth="2"/>
            
            {/* Melt (top) */}
            <path d="M350 100 L450 100 L455 250 L345 250 Z" fill="url(#melt)" opacity="0.8"/>
            <text x="400" y="180" fontSize="12" fill="#7c2d12" textAnchor="middle">Fundo</text>

            {/* Crystal (bottom) */}
            <path d="M345 250 L455 250 L440 500 L360 500 Z" fill="url(#crystal)" opacity="0.9"/>
            <text x="400" y="380" fontSize="12" fill="#0f172a" textAnchor="middle">Cristal</text>

            {/* Seed crystal */}
            <polygon points="395,490 405,490 400,500" fill="#475569"/>
            <text x="400" y="520" fontSize="11" fill="#0f172a" textAnchor="middle">Semente</text>

            {/* Movement arrow */}
            <path d="M500 300 L560 300" stroke="#3b82f6" strokeWidth="3" markerEnd="url(#arrow)"/>
            <text x="570" y="305" fontSize="14" fill="#3b82f6">Movimento</text>
            <text x="570" y="325" fontSize="12" fill="#3b82f6">para baixo</text>

            {/* Labels */}
            <text x="600" y="100" fontSize="14" fill="#0f172a">Vantagens:</text>
            <text x="600" y="125" fontSize="12" fill="#475569">• Alta qualidade cristalina</text>
            <text x="600" y="145" fontSize="12" fill="#475569">• Baixo custo</text>
            <text x="600" y="165" fontSize="12" fill="#475569">• Escalável</text>
            <text x="600" y="185" fontSize="12" fill="#475569">• Versátil</text>

            <text x="600" y="350" fontSize="14" fill="#0f172a">Limitações:</text>
            <text x="600" y="375" fontSize="12" fill="#475569">• Contaminação do cadinho</text>
            <text x="600" y="395" fontSize="12" fill="#475569">• Tensões térmicas</text>
            <text x="600" y="415" fontSize="12" fill="#475569">• Interface plana</text>
            <text x="600" y="435" fontSize="12" fill="#475569">• Tamanho limitado</text>

            {/* Temperature indicators */}
            <text x="280" y="180" fontSize="18" fill="#dc2626">🔥</text>
            <text x="280" y="400" fontSize="18" fill="#2563eb">❄️</text>
          </svg>
        </div>
      </div>

      <div className="formulas-container">
        <div className="formulas-header">
          <h3>📐 Fórmulas do Processo</h3>
          <div className="formula-tabs">
            {Object.keys(BRIDGMAN_FORMULAS).map(key => (
              <button
                key={key}
                className={`formula-tab ${activeFormulaTab === key ? 'active' : ''}`}
                onClick={() => setActiveFormulaTab(key)}
              >
                {BRIDGMAN_FORMULAS[key].title}
              </button>
            ))}
          </div>
        </div>

        <div className="formulas-content">
          {BRIDGMAN_FORMULAS[activeFormulaTab] && (
            <div className="formula-section">
              <h4>{BRIDGMAN_FORMULAS[activeFormulaTab].title}</h4>
              <div className="formulas-list">
                {BRIDGMAN_FORMULAS[activeFormulaTab].formulas.map(renderFormula)}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="engineering-details">
        <h3>⚙️ Detalhes de Engenharia</h3>
        <div className="engineering-cards">
          <div className="engineering-card">
            <h4>🏺 Projeto do Cadinho</h4>
            <ul>
              <li>Material: quartzo, grafite, BN, Pt</li>
              <li>Formato: cônico ou com "bico"</li>
              <li>Revestimento: para evitar reações</li>
              <li>Diâmetro: até 150 mm</li>
            </ul>
          </div>
          <div className="engineering-card">
            <h4>🌡️ Controle Térmico</h4>
            <ul>
              <li>Zonas: 2-5 zonas independentes</li>
              <li>Gradiente: 10-100 K/cm</li>
              <li>Precisão: ±0.5°C</li>
              <li>Velocidade: 0.1-10 mm/h</li>
            </ul>
          </div>
          <div className="engineering-card">
            <h4>💎 Materiais Comuns</h4>
            <ul>
              <li>Semicondutores: GaAs, InP, CdTe</li>
              <li>Ópticos: CaF₂, BaF₂, LiF</li>
              <li>Cerâmicas: Al₂O₃, YAG</li>
              <li>Metais: superligas, intermetálicos</li>
            </ul>
          </div>
          <div className="engineering-card">
            <h4>⚠️ Desafios</h4>
            <ul>
              <li>Contaminação pelo cadinho</li>
              <li>Expansão térmica diferencial</li>
              <li>Formação de grãos múltiplos</li>
              <li>Tensões durante resfriamento</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="applications">
        <h3>🎯 Aplicações Específicas</h3>
        <div className="application-cards">
          <div className="application-card">
            <h4>💡 Semicondutores Compostos</h4>
            <p>GaAs e InP para dispositivos optoeletrônicos, LEDs, lasers e células solares de alta eficiência.</p>
          </div>
          <div className="application-card">
            <h4>🔭 Materiais Ópticos</h4>
            <p>Cristais transparentes para lentes, janelas ópticas, prismas e componentes de sistemas laser.</p>
          </div>
          <div className="application-card">
            <h4>🧪 Cerâmicas Técnicas</h4>
            <p>Materiais cerâmicos avançados para aplicações estruturais, eletrônicas e biomédicas.</p>
          </div>
          <div className="application-card">
            <h4>🔬 Pesquisa</h4>
            <p>Crescimento de cristais experimentais para pesquisa em física de materiais e propriedades ópticas.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
