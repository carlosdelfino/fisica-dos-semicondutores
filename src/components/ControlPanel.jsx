import { useState } from 'react';
import Controls from './Controls.jsx';
import CarrierPanel from './CarrierPanel.jsx';
import { useTranslation } from '../contexts/LanguageContext.jsx';

export default function ControlPanel({ controlsProps, carrierState }) {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="control-panel">
      <button 
        className="panel-title-button"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <span className="panel-title-toggle">{isExpanded ? '▼' : '▶'}</span>
        <span className="panel-title">{t('controlPanel.title')}</span>
      </button>
      
      {isExpanded && (
        <div className="panel-content">
          <Controls {...controlsProps} />
          <div className="panel-divider" />
          <CarrierPanel state={carrierState} />
        </div>
      )}
    </div>
  );
}
