import { useState } from 'react';
import { useTranslation } from '../contexts/LanguageContext.jsx';

const MENU_STRUCTURE = [
  {
    key: 'learning',
    items: ['objectives', 'conceptsQ', 'questions', 'glossary']
  },
  {
    key: 'fundamentals',
    items: ['overview', 'lattice', 'crystal-structures', 'atomband', 'allowed', 'kp', 'mis']
  },
  {
    key: 'bandStructure',
    items: ['kspace', 'effmass', 'particles']
  },
  {
    key: 'quantumStatistics',
    items: ['fermi', 'dos', 'arrhenius', 'fermi-edu', 'dos-edu']
  },
  {
    key: 'devices',
    items: ['junction', 'transistorTech', 'fetTypes', 'czochralski', 'perovskites']
  },
  {
    key: 'reference',
    items: [
      'exercises',
      'periodic',
      'about',
      'support-us',
      {
        id: 'community',
        href: 'https://github.com/carlosdelfino/fisica-dos-semicondutores/discussions',
        external: true,
      },
    ]
  },
];

export default function HierarchicalMenu({ activeTab, onTabChange }) {
  const { t } = useTranslation();
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

  const findCategoryKeyForTab = (tabId) => {
    for (const cat of MENU_STRUCTURE) {
      const ids = cat.items.map((it) => (typeof it === 'string' ? it : it.id));
      if (ids.includes(tabId)) return cat.key;
    }
    return null;
  };

  const activeCategoryKey = findCategoryKeyForTab(activeTab);

  return (
    <nav className="hierarchical-menu">
      {MENU_STRUCTURE.map((category, catIndex) => (
        <div key={category.key} className="menu-category">
          <button
            className={`category-header ${activeCategoryKey === category.key ? 'active' : ''}`}
            onClick={() => toggleCategory(catIndex)}
          >
            <span className="category-toggle">
              {expandedCategories[catIndex] ? '▼' : '▶'}
            </span>
            <span className="category-name">{t(`menu.categories.${category.key}`)}</span>
          </button>

          {expandedCategories[catIndex] && (
            <div className="category-items">
              {category.items.map((item) => {
                const isExternal = typeof item === 'object' && item.external;
                const itemId = typeof item === 'string' ? item : item.id;
                if (isExternal) {
                  return (
                    <a
                      key={itemId}
                      className="menu-item menu-item-external"
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={t(`menu.items.${itemId}_title`)}
                    >
                      {t(`menu.items.${itemId}`)}
                      <span className="external-icon" aria-hidden="true"> ↗</span>
                    </a>
                  );
                }
                return (
                  <button
                    key={itemId}
                    className={`menu-item ${activeTab === itemId ? 'active' : ''}`}
                    onClick={() => onTabChange(itemId)}
                  >
                    {t(`menu.items.${itemId}`)}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      ))}
    </nav>
  );
}
