import { useState } from 'react';
import { log_event } from '../physics/formulas.js';
import CzochralskiContent from './CzochralskiContent';
import FloatZoneContent from './FloatZoneContent';
import BridgmanStockbargerContent from './BridgmanStockbargerContent';
import VerneuilContent from './VerneuilContent';
import MCZContent from './MCZContent';
import EpitaxialContent from './EpitaxialContent';
import ComparisonContent from './ComparisonContent';
import 'katex/dist/katex.min.css';

const METHODS = [
  { id: 'czochralski', label: 'Czochralski', icon: '🔬' },
  { id: 'float-zone', label: 'Float Zone (FZ)', icon: '🌊' },
  { id: 'bridgman', label: 'Bridgman-Stockbarger', icon: '🔥' },
  { id: 'verneuil', label: 'Verneuil', icon: '🔥' },
  { id: 'mcz', label: 'Czochralski Magnético', icon: '🧲' },
  { id: 'epitaxial', label: 'Epitaxial Growth', icon: '💎' },
  { id: 'comparison', label: 'Comparação Técnica', icon: '📊' }
];

export default function CrystalGrowthMethods() {
  const [activeTab, setActiveTab] = useState('czochralski');

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    log_event('INFO', 'Método de crescimento selecionado', { method: tabId });
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'czochralski':
        return <CzochralskiContent />;
      case 'float-zone':
        return <FloatZoneContent />;
      case 'bridgman':
        return <BridgmanStockbargerContent />;
      case 'verneuil':
        return <VerneuilContent />;
      case 'mcz':
        return <MCZContent />;
      case 'epitaxial':
        return <EpitaxialContent />;
      case 'comparison':
        return <ComparisonContent />;
      default:
        return <CzochralskiContent />;
    }
  };

  return (
    <div className="crystal-growth-methods">
      <div className="methods-header">
        <h2>🔬 Métodos de Crescimento de Cristais</h2>
        <p className="intro-text">
          Explore os diferentes métodos industriais para crescimento de cristais de silício e outros materiais semicondutores.
          Cada método tem características específicas que determinam sua aplicação ideal.
        </p>
      </div>

      <div className="methods-tabs">
        {METHODS.map(method => (
          <button
            key={method.id}
            className={`method-tab ${activeTab === method.id ? 'active' : ''}`}
            onClick={() => handleTabChange(method.id)}
          >
            <span className="tab-icon">{method.icon}</span>
            <span className="tab-label">{method.label}</span>
          </button>
        ))}
      </div>

      <div className="methods-content">
        {renderContent()}
      </div>
    </div>
  );
}
