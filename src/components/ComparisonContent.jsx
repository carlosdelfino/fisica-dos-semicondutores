import { useState, useEffect } from 'react';
import { log_event } from '../physics/formulas.js';

const METHOD_COMPARISON = [
  {
    name: 'Czochralski (CZ)',
    icon: '🔬',
    description: 'Método mais comum para produção de silício para wafers. Usa cadinho de quartzo e puxamento vertical.',
    specifications: {
      purity: 'Alta (99.9999%)',
      oxygen: '10-20 ppm',
      diameter: '200-300 mm',
      cost: 'Médio',
      throughput: 'Alto',
      applications: 'Processadores, memórias, dispositivos gerais'
    },
    advantages: [
      'Alta produtividade',
      'Diâmetros grandes',
      'Custo competitivo',
      'Processo maduro'
    ],
    disadvantages: [
      'Contaminação por oxigênio',
      'Dependência de cadinho',
      'Limitações de pureza'
    ],
    bestFor: 'Produção em massa de wafers de silício para indústria de semicondutores'
  },
  {
    name: 'Float Zone (FZ)',
    icon: '🌊',
    description: 'Método sem cadinho usando zona fundida móvel. Produz silício de ultra-alta pureza.',
    specifications: {
      purity: 'Ultra-alta (99.999999%)',
      oxygen: '< 5 ppba',
      diameter: 'Até 200 mm',
      cost: 'Alto',
      throughput: 'Baixo',
      applications: 'Dispositivos de potência, sensores, pesquisa'
    },
    advantages: [
      'Pureza extrema',
      'Baixíssimo oxigênio',
      'Sem contaminação de cadinho',
      'Resistividade controlável'
    ],
    disadvantages: [
      'Diâmetros limitados',
      'Custo muito alto',
      'Baixa produtividade',
      'Processo complexo'
    ],
    bestFor: 'Aplicações que requerem ultra-alta pureza e baixíssimas concentrações de oxigênio'
  },
  {
    name: 'Bridgman-Stockbarger',
    icon: '🔥',
    description: 'Solidificação direcional em cadinho com gradiente térmico controlado.',
    specifications: {
      purity: 'Alta',
      oxygen: 'Variável',
      diameter: 'Até 150 mm',
      cost: 'Médio-Baixo',
      throughput: 'Médio',
      applications: 'Semicondutores compostos, materiais ópticos'
    },
    advantages: [
      'Versátil para muitos materiais',
      'Baixo custo',
      'Boa qualidade cristalina',
      'Escalável'
    ],
    disadvantages: [
      'Contaminação do cadinho',
      'Tensões térmicas',
      'Interface plana'
    ],
    bestFor: 'Semicondutores compostos (GaAs, InP) e materiais ópticos'
  },
  {
    name: 'Verneuil',
    icon: '🔥',
    description: 'Fusão por chama de oxi-hidrogênio. Método histórico para rubis e safiras sintéticos.',
    specifications: {
      purity: 'Média-Alta',
      oxygen: 'Alto',
      diameter: 'Até 50 mm',
      cost: 'Baixo',
      throughput: 'Médio',
      applications: 'Pedras preciosas, lasers, cerâmicas'
    },
    advantages: [
      'Temperaturas muito altas',
      'Sem cadinho',
      'Baixo custo',
      'Processo rápido'
    ],
    disadvantages: [
      'Tamanho limitado',
      'Tensões térmicas',
      'Baixa pureza',
      'Defeitos internos'
    ],
    bestFor: 'Óxidos refratários, pedras preciosas sintéticas e aplicações especiais'
  },
  {
    name: 'Czochralski Magnético (MCZ)',
    icon: '🧲',
    description: 'Czochralski com campo magnético para controle de convecção. Homogeneidade superior.',
    specifications: {
      purity: 'Ultra-alta',
      oxygen: '5-15 ppma (controlado)',
      diameter: 'Até 300 mm',
      cost: 'Alto',
      throughput: 'Médio-Alto',
      applications: 'ULSI, dispositivos críticos, alta performance'
    },
    advantages: [
      'Homogeneidade excepcional',
      'Controle de oxigênio',
      'Menos defeitos',
      'Yield maior'
    ],
    disadvantages: [
      'Custo elevado',
      'Consumo de energia',
      'Complexidade',
      'Manutenção'
    ],
    bestFor: 'Processadores avançados, dispositivos móveis e aplicações críticas'
  },
  {
    name: 'Epitaxial Growth',
    icon: '💎',
    description: 'Deposição de camadas cristalinas sobre substrato. Não gera wafer base.',
    specifications: {
      purity: 'Ultra-alta (camada)',
      oxygen: 'Controlado',
      diameter: 'Limitado ao substrato',
      cost: 'Muito Alto',
      throughput: 'Baixo',
      applications: 'Transistores avançados, optoeletrônica, quântica'
    },
    advantages: [
      'Controle atômico',
      'Estruturas complexas',
      'Alta qualidade',
      'Versátil'
    ],
    disadvantages: [
      'Não gera wafer',
      'Custo muito alto',
      'Processo lento',
      'Complexo'
    ],
    bestFor: 'Camadas funcionais em transistores avançados, dispositivos optoeletrônicos e estruturas quânticas'
  }
];

export default function ComparisonContent() {
  const [sortBy, setSortBy] = useState('name');

  useEffect(() => {
    log_event('START', 'Conteúdo Comparação iniciado');
    return () => log_event('END', 'Conteúdo Comparação encerrado');
  }, []);

  const sortedMethods = [...METHOD_COMPARISON].sort((a, b) => {
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    if (sortBy === 'purity') {
      const purityOrder = { 'Ultra-alta': 3, 'Alta': 2, 'Média-Alta': 1, 'Média': 0 };
      return (purityOrder[b.specifications.purity] || 0) - (purityOrder[a.specifications.purity] || 0);
    }
    if (sortBy === 'cost') {
      const costOrder = { 'Muito Alto': 4, 'Alto': 3, 'Médio': 2, 'Médio-Baixo': 1, 'Baixo': 0 };
      return (costOrder[a.specifications.cost] || 0) - (costOrder[b.specifications.cost] || 0);
    }
    return 0;
  });

  const getCostColor = (cost) => {
    switch (cost) {
      case 'Baixo': return '#10b981';
      case 'Médio-Baixo': return '#34d399';
      case 'Médio': return '#f59e0b';
      case 'Alto': return '#f97316';
      case 'Muito Alto': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getPurityColor = (purity) => {
    switch (purity) {
      case 'Ultra-alta': return '#10b981';
      case 'Alta': return '#34d399';
      case 'Média-Alta': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  return (
    <div className="comparison-content">
      <div className="panel-header">
        <h2>📊 Comparação Técnica dos Métodos</h2>
        <p className="intro-text">
          Compare os diferentes métodos de crescimento de cristais em termos de pureza, custo, aplicações e características técnicas.
          Entenda as vantagens e limitações de cada método para escolher o mais adequado para sua aplicação.
        </p>
      </div>

      <div className="comparison-controls">
        <div className="sort-controls">
          <label>Ordenar por:</label>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="name">Nome</option>
            <option value="purity">Pureza</option>
            <option value="cost">Custo</option>
          </select>
        </div>
      </div>

      <div className="comparison-grid">
        {sortedMethods.map((method, index) => (
          <div key={index} className="comparison-card">
            <div className="card-header">
              <span className="method-icon">{method.icon}</span>
              <h3>{method.name}</h3>
            </div>
            
            <p className="method-description">{method.description}</p>

            <div className="specifications">
              <h4>Especificações</h4>
              <div className="spec-grid">
                <div className="spec-item">
                  <span className="spec-label">Pureza:</span>
                  <span className="spec-value" style={{ color: getPurityColor(method.specifications.purity) }}>
                    {method.specifications.purity}
                  </span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">Oxigênio:</span>
                  <span className="spec-value">{method.specifications.oxygen}</span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">Diâmetro:</span>
                  <span className="spec-value">{method.specifications.diameter}</span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">Custo:</span>
                  <span className="spec-value" style={{ color: getCostColor(method.specifications.cost) }}>
                    {method.specifications.cost}
                  </span>
                </div>
                <div className="spec-item">
                  <span className="spec-label">Throughput:</span>
                  <span className="spec-value">{method.specifications.throughput}</span>
                </div>
              </div>
            </div>

            <div className="advantages">
              <h4>✅ Vantagens</h4>
              <ul>
                {method.advantages.map((advantage, i) => (
                  <li key={i}>{advantage}</li>
                ))}
              </ul>
            </div>

            <div className="disadvantages">
              <h4>❌ Limitações</h4>
              <ul>
                {method.disadvantages.map((disadvantage, i) => (
                  <li key={i}>{disadvantage}</li>
                ))}
              </ul>
            </div>

            <div className="best-for">
              <h4>🎯 Melhor Para</h4>
              <p>{method.bestFor}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="comparison-summary">
        <h3>📋 Resumo Comparativo</h3>
        <div className="summary-table">
          <table>
            <thead>
              <tr>
                <th>Método</th>
                <th>Pureza</th>
                <th>Custo</th>
                <th>Diâmetro Máx.</th>
                <th>Aplicação Principal</th>
              </tr>
            </thead>
            <tbody>
              {METHOD_COMPARISON.map((method, index) => (
                <tr key={index}>
                  <td>{method.icon} {method.name}</td>
                  <td style={{ color: getPurityColor(method.specifications.purity) }}>
                    {method.specifications.purity}
                  </td>
                  <td style={{ color: getCostColor(method.specifications.cost) }}>
                    {method.specifications.cost}
                  </td>
                  <td>{method.specifications.diameter}</td>
                  <td>{method.specifications.applications}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="recommendations">
        <h3>💡 Recomendações de Uso</h3>
        <div className="recommendation-cards">
          <div className="recommendation-card">
            <h4>🏭 Produção em Massa</h4>
            <p><strong>Czochralski (CZ)</strong> é a escolha padrão para produção de wafers de silício em escala industrial devido ao custo competitivo e alta produtividade.</p>
          </div>
          <div className="recommendation-card">
            <h4>⚡ Alta Potência</h4>
            <p><strong>Float Zone (FZ)</strong> é ideal para dispositivos de alta potência devido à ultra-alta pureza e baixíssima concentração de oxigênio.</p>
          </div>
          <div className="recommendation-card">
            <h4>💻 ULSI Avançado</h4>
            <p><strong>Czochralski Magnético (MCZ)</strong> oferece homogeneidade superior necessária para processadores avançados e dispositivos de alta performance.</p>
          </div>
          <div className="recommendation-card">
            <h4>💎 Semicondutores Compostos</h4>
            <p><strong>Bridgman-Stockbarger</strong> é amplamente usado para GaAs, InP e outros semicondutores compostos para optoeletrônica.</p>
          </div>
          <div className="recommendation-card">
            <h4>🔬 Pesquisa e Especial</h4>
            <p><strong>Verneuil</strong> e <strong>FZ</strong> são usados para aplicações especiais como pedras preciosas sintéticas e pesquisa científica.</p>
          </div>
          <div className="recommendation-card">
            <h4>🚀 Transistores Avançados</h4>
            <p><strong>Epitaxial Growth</strong> é essencial para camadas funcionais em transistores de última geração (FinFETs, GAA-FETs).</p>
          </div>
        </div>
      </div>
    </div>
  );
}
