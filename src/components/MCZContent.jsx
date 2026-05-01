import { useState, useEffect } from 'react';
import { log_event } from '../physics/formulas.js';
import { TeX } from './Math.jsx';
import 'katex/dist/katex.min.css';

const MCZ_FORMULAS = {
  magnetic: {
    title: 'Efeitos Magnéticos',
    formulas: [
      {
        name: 'Força de Lorentz',
        formula: '\\mathbf{F} = q(\\mathbf{E} + \\mathbf{v} \\times \\mathbf{B})',
        description: 'Força sobre cargas em movimento em campo magnético.'
      },
      {
        name: 'Número de Hartmann',
        formula: 'Ha = B L \\sqrt{\\frac{\\sigma}{\\rho \\nu}}',
        description: 'Parâmetro adimensional que relaciona forças magnéticas e viscosas.'
      }
    ]
  },
  convection: {
    title: 'Controle de Convecção',
    formulas: [
      {
        name: 'Velocidade com Campo Magnético',
        formula: 'v = v_0 \\frac{1}{1 + Ha^2}',
        description: 'Redução da velocidade de convecção sob campo magnético.'
      },
      {
        name: 'Supressão de Oscilações',
        formula: 'B_{crit} = \\frac{\\mu}{\\sigma v_0 L}',
        description: 'Campo magnético crítico para suprimir oscilações termocapilares.'
      }
    ]
  },
  quality: {
    title: 'Qualidade do Cristal',
    formulas: [
      {
        name: 'Homogeneidade de Oxigênio',
        formula: '\\Delta O = O_{max} - O_{min} \\propto \\frac{1}{B}',
        description: 'Variação de oxigênio reduzida com campo magnético.'
      },
      {
        name: 'Densidade de Defeitos',
        formula: '\\rho_d = \\rho_{d,0} e^{-\\alpha B}',
        description: 'Redução de defeitos com campo magnético aplicado.'
      }
    ]
  }
};

export default function MCZContent() {
  const [activeFormulaTab, setActiveFormulaTab] = useState('magnetic');

  useEffect(() => {
    log_event('START', 'Conteúdo MCZ iniciado');
    return () => log_event('END', 'Conteúdo MCZ encerrado');
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
    <div className="mcz-content">
      <div className="panel-header">
        <h2>🧲 Czochralski Magnético (MCZ)</h2>
        <p className="intro-text">
          O método Czochralski Magnético aplica um campo magnético forte ao processo Czochralski convencional para controlar a convecção no melt.
          Isso resulta em cristais de silício com homogeneidade superior, especialmente para aplicações de alta performance.
        </p>
      </div>

      <div className="method-overview">
        <h3>📋 Visão Geral</h3>
        <div className="overview-cards">
          <div className="overview-card">
            <h4>🧲 Campo Magnético</h4>
            <p>Um campo magnético intenso (0.1-0.5 T) é aplicado ao melt, gerando forças de Lorentz que suprimem a convecção turbulenta.</p>
          </div>
          <div className="overview-card">
            <h4>🎯 Controle de Convecção</h4>
            <p>O campo magnético controla o fluxo no silício fundido, reduzindo oscilações e melhorando a homogeneidade de dopantes e oxigênio.</p>
          </div>
          <div className="overview-card">
            <h4>💎 Alta Qualidade</h4>
            <p>Produz silício com uniformidade excepcional, essencial para ULSI (Ultra Large Scale Integration) e dispositivos avançados.</p>
          </div>
          <div className="overview-card">
            <h4>🔧 Configurações</h4>
            <p>Existem três tipos principais: CUSP (campo transversal), vertical (VGF) e horizontal, cada com características específicas.</p>
          </div>
        </div>
      </div>

      <div className="method-diagram">
        <h3>🔬 Diagrama do Processo</h3>
        <div className="diagram-container">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" className="mcz-diagram">
            <defs>
              <linearGradient id="mczMetal" x1="0" x2="1">
                <stop offset="0" stopColor="#e2e8f0"/>
                <stop offset="0.5" stopColor="#f1f5f9"/>
                <stop offset="1" stopColor="#94a3b8"/>
              </linearGradient>
              <linearGradient id="mczGlass" x1="0" x2="1">
                <stop offset="0" stopColor="#dbeafe" stopOpacity="0.3"/>
                <stop offset="1" stopColor="#93c5fd" stopOpacity="0.28"/>
              </linearGradient>
              <linearGradient id="mczMelt" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0" stopColor="#ffd166"/>
                <stop offset="1" stopColor="#9a3412"/>
              </linearGradient>
            </defs>

            <rect x="0" y="0" width="800" height="600" fill="#f8fafc"/>

            {/* Magnetic coils */}
            <rect x="250" y="100" width="100" height="400" fill="#dc2626" opacity="0.3" rx="10"/>
            <rect x="450" y="100" width="100" height="400" fill="#2563eb" opacity="0.3" rx="10"/>
            <text x="300" y="85" fontSize="12" fill="#dc2626" textAnchor="middle">Bobina N</text>
            <text x="500" y="85" fontSize="12" fill="#2563eb" textAnchor="middle">Bobina S</text>

            {/* Magnetic field lines */}
            <path d="M300 120 Q400 300 500 120" fill="none" stroke="#8b5cf6" strokeWidth="2" strokeDasharray="5 5"/>
            <path d="M300 180 Q400 300 500 180" fill="none" stroke="#8b5cf6" strokeWidth="2" strokeDasharray="5 5"/>
            <path d="M300 240 Q400 300 500 240" fill="none" stroke="#8b5cf6" strokeWidth="2" strokeDasharray="5 5"/>
            <text x="400" y="280" fontSize="11" fill="#8b5cf6" textAnchor="middle">Campo B</text>

            {/* Chamber */}
            <rect x="320" y="150" width="160" height="300" rx="20" fill="url(#mczGlass)" stroke="#2563eb" strokeWidth="2"/>
            
            {/* Crucible */}
            <ellipse cx="400" cy="380" rx="50" ry="15" fill="#f8fafc" stroke="#1e293b" strokeWidth="2"/>
            <path d="M350 380 C360 420, 380 440, 400 440 C420 440, 440 420, 450 380" fill="none" stroke="#1e293b" strokeWidth="2"/>
            
            {/* Melt */}
            <ellipse cx="400" cy="380" rx="45" ry="12" fill="url(#mczMelt)" stroke="#7c2d12" strokeWidth="2"/>
            
            {/* Crystal */}
            <rect x="390" y="200" width="20" height="170" fill="#94a3b8" stroke="#1e293b" strokeWidth="2"/>
            <ellipse cx="400" cy="200" rx="10" ry="5" fill="#64748b" stroke="#1e293b" strokeWidth="2"/>
            
            {/* Seed holder */}
            <rect x="385" y="160" width="30" height="30" fill="#475569" stroke="#1e293b" strokeWidth="2"/>

            {/* Reduced convection arrows */}
            <path d="M370 360 L380 360" stroke="#10b981" strokeWidth="2" markerEnd="url(#arrow)"/>
            <path d="M420 360 L430 360" stroke="#10b981" strokeWidth="2" markerEnd="url(#arrow)"/>
            <text x="400" y="345" fontSize="10" fill="#10b981" textAnchor="middle">Convecção</text>
            <text x="400" y="357" fontSize="10" fill="#10b981" textAnchor="middle">reduzida</text>

            {/* Labels */}
            <text x="100" y="150" fontSize="14" fill="#0f172a">Vantagens:</text>
            <text x="100" y="175" fontSize="12" fill="#475569">• Homogeneidade superior</text>
            <text x="100" y="195" fontSize="12" fill="#475569">• Menos defeitos</text>
            <text x="100" y="215" fontSize="12" fill="#475569">• Controle de oxigênio</text>
            <text x="100" y="235" fontSize="12" fill="#475569">• Yield maior</text>

            <text x="600" y="150" fontSize="14" fill="#0f172a">Limitações:</text>
            <text x="600" y="175" fontSize="12" fill="#475569">• Custo mais alto</text>
            <text x="600" y="195" fontSize="12" fill="#475569">• Consumo de energia</text>
            <text x="600" y="215" fontSize="12" fill="#475569">• Complexidade</text>
            <text x="600" y="235" fontSize="12" fill="#475569">• Manutenção</text>

            {/* Magnetic field indicator */}
            <text x="560" y="300" fontSize="24" fill="#8b5cf6">🧲</text>
            <text x="580" y="320" fontSize="12" fill="#8b5cf6">B = 0.1-0.5 T</text>
          </svg>
        </div>
      </div>

      <div className="formulas-container">
        <div className="formulas-header">
          <h3>📐 Fórmulas do Processo MCZ</h3>
          <div className="formula-tabs">
            {Object.keys(MCZ_FORMULAS).map(key => (
              <button
                key={key}
                className={`formula-tab ${activeFormulaTab === key ? 'active' : ''}`}
                onClick={() => setActiveFormulaTab(key)}
              >
                {MCZ_FORMULAS[key].title}
              </button>
            ))}
          </div>
        </div>

        <div className="formulas-content">
          {MCZ_FORMULAS[activeFormulaTab] && (
            <div className="formula-section">
              <h4>{MCZ_FORMULAS[activeFormulaTab].title}</h4>
              <div className="formulas-list">
                {MCZ_FORMULAS[activeFormulaTab].formulas.map(renderFormula)}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="engineering-details">
        <h3>⚙️ Detalhes de Engenharia</h3>
        <div className="engineering-cards">
          <div className="engineering-card">
            <h4>🧲 Sistema Magnético</h4>
            <ul>
              <li>Intensidade: 0.1-0.5 Tesla</li>
              <li>Configuração: CUSP, vertical, horizontal</li>
              <li>Bobinas: supercondutoras ou resistentes</li>
              <li>Consumo: até 500 kW</li>
            </ul>
          </div>
          <div className="engineering-card">
            <h4>🌊 Controle de Fluxo</h4>
            <ul>
              <li>Número de Hartmann: 10-1000</li>
              <li>Redução de convecção: 50-90%</li>
              <li>Estabilidade: ±0.1°C</li>
              <li>Homogeneidade: ±1% dopante</li>
            </ul>
          </div>
          <div className="engineering-card">
            <h4>💎 Propriedades do Produto</h4>
            <ul>
              <li>Oxigênio: 5-15 ppma (controlado)</li>
              <li>Variação radial: &lt; 5%</li>
              <li>Densidade de defeitos: 10x menor</li>
              <li>Diâmetro: até 300 mm</li>
            </ul>
          </div>
          <div className="engineering-card">
            <h4>⚠️ Desafios</h4>
            <ul>
              <li>Custo de energia elevado</li>
              <li>Complexidade do sistema</li>
              <li>Manutenção das bobinas</li>
              <li>Otimização do campo B</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="applications">
        <h3>🎯 Aplicações Específicas</h3>
        <div className="application-cards">
          <div className="application-card">
            <h4>💻 ULSI</h4>
            <p>Processadores avançados e memórias que requerem homogeneidade extrema de dopantes e oxigênio.</p>
          </div>
          <div className="application-card">
            <h4>📱 Dispositivos Móveis</h4>
            <p>SoCs e processadores para smartphones que exigem alto yield e baixa variação de propriedades.</p>
          </div>
          <div className="application-card">
            <h4>🚀 Aplicações Críticas</h4>
            <p>Dispositivos para aplicações espaciais, militares e médicas onde a confiabilidade é crítica.</p>
          </div>
          <div className="application-card">
            <h4>🔬 Pesquisa Avançada</h4>
            <p>Desenvolvimento de novos dispositivos e processos que requerem silício de ultra-alta qualidade.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
