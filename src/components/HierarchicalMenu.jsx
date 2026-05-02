import { useState } from 'react';

const MENU_STRUCTURE = [
  {
    category: '📚 Aprendizado',
    items: [
      { id: 'objectives', label: '🎯 Roteiro de Estudo' },
      { id: 'conceptsQ',  label: '📖 Conceitos das Questões' },
      { id: 'questions',  label: '❓ Questões' },
    ]
  },
  {
    category: '🔬 Fundamentos',
    items: [
      { id: 'overview',   label: 'Visão Geral' },
      { id: 'lattice',    label: 'Rede Cristalina' },
      { id: 'atomband',   label: 'Átomos → Bandas' },
      { id: 'allowed',    label: 'Bandas Permitidas/Proibidas' },
      { id: 'kp',         label: 'Kronig-Penney' },
      { id: 'mis',        label: 'Metal × Isolante × Semicondutor' },
    ]
  },
  {
    category: '⚛️ Estrutura de Bandas',
    items: [
      { id: 'kspace',     label: 'Espaço-k (Si × GaAs)' },
      { id: 'effmass',    label: 'Massa Efetiva' },
      { id: 'particles',  label: 'Elétron × Lacuna' },
    ]
  },
  {
    category: '📊 Estatística Quântica',
    items: [
      { id: 'fermi',      label: 'Fermi-Dirac & MB' },
      { id: 'dos',        label: 'Densidade de Estados' },
      { id: 'arrhenius',  label: 'n(T) Arrhenius' },
    ]
  },
  {
    category: '⚡ Dispositivos',
    items: [
      { id: 'junction',   label: '⚡ Junção PN' },
      { id: 'transistorTech', label: '🔬 Tecnologias de Transistores' },
      { id: 'czochralski', label: '🔬 Métodos de Crescimento' },
      { id: 'perovskites', label: '☀️ Perovskites 2D' },
    ]
  },
  {
    category: '📐 Referência',
    items: [
      { id: 'formulas',   label: '📐 Fórmulas & Símbolos' },
      { id: 'periodic',   label: '⚛️ Tabela Periódica' },
      { id: 'about',      label: '👤 Sobre' },
    ]
  },
];

export default function HierarchicalMenu({ activeTab, onTabChange }) {
  const [expandedCategories, setExpandedCategories] = useState(
    MENU_STRUCTURE.map(() => true)
  );

  const toggleCategory = (index) => {
    setExpandedCategories(prev => {
      const newExpanded = [...prev];
      newExpanded[index] = !newExpanded[index];
      return newExpanded;
    });
  };

  const findCategoryForTab = (tabId) => {
    for (const cat of MENU_STRUCTURE) {
      if (cat.items.some(item => item.id === tabId)) {
        return cat.category;
      }
    }
    return null;
  };

  const activeCategory = findCategoryForTab(activeTab);

  return (
    <nav className="hierarchical-menu">
      {MENU_STRUCTURE.map((category, catIndex) => (
        <div key={category.category} className="menu-category">
          <button
            className={`category-header ${activeCategory === category.category ? 'active' : ''}`}
            onClick={() => toggleCategory(catIndex)}
          >
            <span className="category-toggle">
              {expandedCategories[catIndex] ? '▼' : '▶'}
            </span>
            <span className="category-name">{category.category}</span>
          </button>
          
          {expandedCategories[catIndex] && (
            <div className="category-items">
              {category.items.map((item) => (
                <button
                  key={item.id}
                  className={`menu-item ${activeTab === item.id ? 'active' : ''}`}
                  onClick={() => onTabChange(item.id)}
                >
                  {item.label}
                </button>
              ))}
            </div>
          )}
        </div>
      ))}
    </nav>
  );
}
