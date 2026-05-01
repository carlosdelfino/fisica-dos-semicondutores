import { useState, useEffect } from 'react';
import { log_event } from '../physics/formulas.js';
import { TeX } from './Math.jsx';
import 'katex/dist/katex.min.css';

const EPITAXIAL_FORMULAS = {
  growth: {
    title: 'Crescimento Epitaxial',
    formulas: [
      {
        name: 'Taxa de Crescimento',
        formula: 'v = \\frac{1}{\\rho N_A} \\frac{dN}{dt}',
        description: 'Velocidade de crescimento em função da taxa de deposição de átomos.'
      },
      {
        name: 'Espessura da Camada',
        formula: 'd = v \\cdot t',
        description: 'Espessura da camada epitaxial em função do tempo de crescimento.'
      }
    ]
  },
  thermodynamics: {
    title: 'Termodinâmica',
    formulas: [
      {
        name: 'Energia de Superfície',
        formula: '\\gamma = \\gamma_0 + k_B T \\ln(\\frac{P}{P_0})',
        description: 'Energia de superfície em função da pressão parcial.'
      },
      {
        name: 'Critério de Nucleação',
        formula: '\\Delta G^* = \\frac{16\\pi \\gamma^3}{3(\\Delta G_v)^2}',
        description: 'Barreira de energia para nucleação homogênea.'
      }
    ]
  },
  doping: {
    title: 'Dopagem Epitaxial',
    formulas: [
      {
        name: 'Concentração de Dopante',
        formula: 'N_d = \\frac{P_{dopant}}{P_{total}} \\cdot N_{Si}',
        description: 'Concentração de dopante em função da pressão parcial.'
      },
      {
        name: 'Coeficiente de Incorporação',
        formula: 'k_{inc} = \\frac{N_d}{N_{gas}}',
        description: 'Eficiência de incorporação de dopantes no cristal.'
      }
    ]
  }
};

export default function EpitaxialContent() {
  const [activeFormulaTab, setActiveFormulaTab] = useState('growth');

  useEffect(() => {
    log_event('START', 'Conteúdo Epitaxial iniciado');
    return () => log_event('END', 'Conteúdo Epitaxial encerrado');
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
    <div className="epitaxial-content">
      <div className="panel-header">
        <h2>💎 Crescimento Epitaxial</h2>
        <p className="intro-text">
          O crescimento epitaxial é um processo de deposição de camadas cristalinas sobre um substrato monocristalino, criando estruturas com propriedades controladas.
          Diferente dos outros métodos, não gera o wafer base, mas adiciona camadas funcionais sobre ele.
        </p>
      </div>

      <div className="method-overview">
        <h3>📋 Visão Geral</h3>
        <div className="overview-cards">
          <div className="overview-card">
            <h4>🎯 Princípio Básico</h4>
            <p>Átomos ou moléculas são depositados sobre um substrato cristalino, continuando a estrutura cristalina do substrato na camada depositada.</p>
          </div>
          <div className="overview-card">
            <h4>🔬 Tipos de Epitaxia</h4>
            <p>Existem epitaxia homotípica (mesmo material) e heterotípica (material diferente), cada com aplicações específicas.</p>
          </div>
          <div className="overview-card">
            <h4>🏭 Métodos de Deposição</h4>
            <p>CVD (Chemical Vapor Deposition), MBE (Molecular Beam Epitaxy) e LPE (Liquid Phase Epitaxy) são os principais métodos.</p>
          </div>
          <div className="overview-card">
            <h4>💎 Aplicações</h4>
            <p>Estruturas de poços quânticos, super-redes, dispositivos optoeletrônicos e camadas ativas de transistores avançados.</p>
          </div>
        </div>
      </div>

      <div className="method-diagram">
        <h3>🔬 Diagrama do Processo</h3>
        <div className="diagram-container">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" className="epitaxial-diagram">
            <defs>
              <linearGradient id="epiSubstrate" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0" stopColor="#64748b"/>
                <stop offset="1" stopColor="#475569"/>
              </linearGradient>
              <linearGradient id="epiLayer" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0" stopColor="#93c5fd"/>
                <stop offset="1" stopColor="#3b82f6"/>
              </linearGradient>
              <linearGradient id="epiGas" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0" stopColor="#dbeafe"/>
                <stop offset="1" stopColor="#bfdbfe"/>
              </linearGradient>
            </defs>

            <rect x="0" y="0" width="800" height="600" fill="#f8fafc"/>

            {/* Reactor chamber */}
            <rect x="100" y="50" width="600" height="500" rx="20" fill="#e2e8f0" stroke="#64748b" strokeWidth="3"/>

            {/* Gas inlet */}
            <rect x="150" y="30" width="100" height="30" fill="#94a3b8" stroke="#1e293b" strokeWidth="2"/>
            <text x="200" y="50" fontSize="12" fill="#0f172a" textAnchor="middle">Entrada de Gás</text>

            {/* Gas flow arrows */}
            <path d="M200 80 L200 150" stroke="#3b82f6" strokeWidth="3" markerEnd="url(#arrow)"/>
            <path d="M250 80 L250 150" stroke="#3b82f6" strokeWidth="3" markerEnd="url(#arrow)"/>
            <path d="M300 80 L300 150" stroke="#3b82f6" strokeWidth="3" markerEnd="url(#arrow)"/>

            {/* Heater */}
            <rect x="120" y="450" width="560" height="80" fill="#ea580c" opacity="0.3" rx="10"/>
            <text x="400" y="495" fontSize="14" fill="#ea580c" textAnchor="middle">Aquecedor</text>

            {/* Substrate holder */}
            <rect x="250" y="400" width="300" height="40" fill="#334155" stroke="#1e293b" strokeWidth="2"/>
            <text x="400" y="425" fontSize="12" fill="#ffffff" textAnchor="middle">Porta-substrato</text>

            {/* Substrate */}
            <rect x="300" y="350" width="200" height="50" fill="url(#epiSubstrate)" stroke="#1e293b" strokeWidth="2"/>
            <text x="400" y="380" fontSize="12" fill="#ffffff" textAnchor="middle">Substrato</text>

            {/* Epitaxial layer */}
            <rect x="300" y="320" width="200" height="30" fill="url(#epiLayer)" stroke="#1e293b" strokeWidth="2" opacity="0.8"/>
            <text x="400" y="340" fontSize="11" fill="#ffffff" textAnchor="middle">Camada Epitaxial</text>

            {/* Gas molecules */}
            <circle cx="200" cy="200" r="5" fill="#3b82f6" opacity="0.6"/>
            <circle cx="250" cy="220" r="5" fill="#3b82f6" opacity="0.6"/>
            <circle cx="300" cy="190" r="5" fill="#3b82f6" opacity="0.6"/>
            <circle cx="350" cy="210" r="5" fill="#3b82f6" opacity="0.6"/>
            <circle cx="400" cy="180" r="5" fill="#3b82f6" opacity="0.6"/>
            <circle cx="450" cy="200" r="5" fill="#3b82f6" opacity="0.6"/>
            <circle cx="500" cy="220" r="5" fill="#3b82f6" opacity="0.6"/>
            <circle cx="550" cy="190" r="5" fill="#3b82f6" opacity="0.6"/>

            {/* Deposition arrows */}
            <path d="M350 230 L350 310" stroke="#10b981" strokeWidth="2" markerEnd="url(#arrow)"/>
            <path d="M400 230 L400 310" stroke="#10b981" strokeWidth="2" markerEnd="url(#arrow)"/>
            <path d="M450 230 L450 310" stroke="#10b981" strokeWidth="2" markerEnd="url(#arrow)"/>
            <text x="400" y="270" fontSize="10" fill="#10b981" textAnchor="middle">Deposição</text>

            {/* Gas outlet */}
            <rect x="550" y="30" width="100" height="30" fill="#94a3b8" stroke="#1e293b" strokeWidth="2"/>
            <text x="600" y="50" fontSize="12" fill="#0f172a" textAnchor="middle">Saída de Gás</text>

            {/* Labels */}
            <text x="50" y="150" fontSize="14" fill="#0f172a">Vantagens:</text>
            <text x="50" y="175" fontSize="12" fill="#475569">• Controle preciso</text>
            <text x="50" y="195" fontSize="12" fill="#475569">• Estruturas complexas</text>
            <text x="50" y="215" fontSize="12" fill="#475569">• Alta qualidade</text>
            <text x="50" y="235" fontSize="12" fill="#475569">• Versátil</text>

            <text x="680" y="150" fontSize="14" fill="#0f172a">Limitações:</text>
            <text x="680" y="175" fontSize="12" fill="#475569">• Custo alto</text>
            <text x="680" y="195" fontSize="12" fill="#475569">• Lento</text>
            <text x="680" y="215" fontSize="12" fill="#475569">• Complexo</text>
            <text x="680" y="235" fontSize="12" fill="#475569">• Tamanho limitado</text>

            {/* Temperature indicator */}
            <text x="700" y="470" fontSize="16" fill="#ea580c">🔥</text>
            <text x="705" y="490" fontSize="11" fill="#ea580c">600-1200°C</text>
          </svg>
        </div>
      </div>

      <div className="formulas-container">
        <div className="formulas-header">
          <h3>📐 Fórmulas do Processo Epitaxial</h3>
          <div className="formula-tabs">
            {Object.keys(EPITAXIAL_FORMULAS).map(key => (
              <button
                key={key}
                className={`formula-tab ${activeFormulaTab === key ? 'active' : ''}`}
                onClick={() => setActiveFormulaTab(key)}
              >
                {EPITAXIAL_FORMULAS[key].title}
              </button>
            ))}
          </div>
        </div>

        <div className="formulas-content">
          {EPITAXIAL_FORMULAS[activeFormulaTab] && (
            <div className="formula-section">
              <h4>{EPITAXIAL_FORMULAS[activeFormulaTab].title}</h4>
              <div className="formulas-list">
                {EPITAXIAL_FORMULAS[activeFormulaTab].formulas.map(renderFormula)}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="engineering-details">
        <h3>⚙️ Detalhes de Engenharia</h3>
        <div className="engineering-cards">
          <div className="engineering-card">
            <h4>🔬 Métodos de Deposição</h4>
            <ul>
              <li>CVD: 600-1200°C, 1-100 µm/h</li>
              <li>MBE: ultra-alto vácuo, 0.1-1 µm/h</li>
              <li>LPE: 400-800°C, 10-100 µm/h</li>
              <li>ALD: deposição atômica por camada</li>
            </ul>
          </div>
          <div className="engineering-card">
            <h4>🎯 Controle de Processo</h4>
            <ul>
              <li>Pressão: 0.1-760 Torr</li>
              <li>Temperatura: ±1°C</li>
              <li>Fluxo de gás: ±0.1 sccm</li>
              <li>Uniformidade: ±1%</li>
            </ul>
          </div>
          <div className="engineering-card">
            <h4>💎 Tipos de Estruturas</h4>
            <ul>
              <li>Camadas simples (homo/heteroepitaxia)</li>
              <li>Poços quânticos</li>
              <li>Super-redes</li>
              <li>Heteroestruturas complexas</li>
            </ul>
          </div>
          <div className="engineering-card">
            <h4>⚠️ Desafios</h4>
            <ul>
              <li>Defeitos de rede (mismatch)</li>
              <li>Contaminação</li>
              <li>Uniformidade</li>
              <li>Custo de equipamento</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="applications">
        <h3>🎯 Aplicações Específicas</h3>
        <div className="application-cards">
          <div className="application-card">
            <h4>💻 Transistores Avançados</h4>
            <p>Camadas epitaxiais para transistores de alta mobilidade (FinFETs, GAA-FETs) e estruturas SiGe.</p>
          </div>
          <div className="application-card">
            <h4>💡 Optoeletrônica</h4>
            <p>LEDs, lasers fotônicos e detectores baseados em poços quânticos e heteroestruturas.</p>
          </div>
          <div className="application-card">
            <h4>🔬 Dispositivos Quânticos</h4>
            <p>Qubits, sensores quânticos e estruturas de spintrônica que requerem controle atômico.</p>
          </div>
          <div className="application-card">
            <h4>📡 RF e Micro-ondas</h4>
            <p>HBTs, HEMTs e outros dispositivos de alta frequência que utilizam heteroestruturas epitaxiais.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
