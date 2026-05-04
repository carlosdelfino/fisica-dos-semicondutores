import { useEffect, useMemo, useState } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { LanguageProvider, useTranslation } from './contexts/LanguageContext.jsx';
import LanguageSelector from './components/LanguageSelector.jsx';
import './styles/LanguageSelector.css';
import BandDiagram from './components/BandDiagram.jsx';
import Lattice from './components/Lattice.jsx';
import FermiDiracPlot from './components/FermiDiracPlot.jsx';
import DensityOfStates from './components/DensityOfStates.jsx';
import CarrierVsTemp from './components/CarrierVsTemp.jsx';
import FormulasPanel from './components/FormulasPanel.jsx';
import KSpaceDiagram from './components/KSpaceDiagram.jsx';
import EffectiveMassDemo from './components/EffectiveMassDemo.jsx';
import KronigPenneyDiagram from './components/KronigPenneyDiagram.jsx';
import AllowedForbidden from './components/AllowedForbidden.jsx';
import AtomToBand from './components/AtomToBand.jsx';
import QuantumWell3D from './components/QuantumWell3D.jsx';
import ElectronHoleCard from './components/ElectronHoleCard.jsx';
import MetalInsulatorSemi from './components/MetalInsulatorSemi.jsx';
import LearningObjectives from './components/LearningObjectives.jsx';
import ConceitosQuestoes from './components/ConceitosQuestoes.jsx';
import Questoes from './components/Questoes.jsx';
import Sobre from './components/Sobre.jsx';
import JunctionPN from './components/JunctionPN.jsx';
import PeriodicTable from './components/PeriodicTable.jsx';
import TransistorTechPanel from './components/TransistorTechPanel.jsx';
import FetTypesPanel from './components/FetTypesPanel.jsx';
import CrystalGrowthMethods from './components/CrystalGrowthMethods.jsx';
import PerovskitesContent from './components/PerovskitesContent.jsx';
import SemiconductorCrystalStructures from './components/SemiconductorCrystalStructures.jsx';
import Glossary from './components/Glossary.jsx';
import HierarchicalMenu from './components/HierarchicalMenu.jsx';
import ControlPanel from './components/ControlPanel.jsx';
import { carrierConcentrations, log_event } from './physics/formulas.js';
import { MATERIALS, bandgap } from './physics/materials.js';

function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const [material, setMaterial] = useState('Si');
  const [type, setType] = useState('intrinsic');
  const [T, setT] = useState(300);
  const [ND, setND] = useState(1e16);
  const [NA, setNA] = useState(1e16);
  const [EFOverride, setEFOverride] = useState({ enabled: false, value: 0 });

  // Extrai o tab atual da URL (pathname), consistente com handleTabChange -> navigate(`/${newTab}`)
  const tab = location.pathname.replace(/^\/+/, '') || 'overview';

  // dopagem efetiva conforme tipo escolhido
  const effND = type === 'n' ? ND : 0;
  const effNA = type === 'p' ? NA : 0;

  const calc = useMemo(() => {
    const c = carrierConcentrations(material, T, effND, effNA);
    const finalEF = EFOverride.enabled ? EFOverride.value : c.EF;
    return { ...c, EF: finalEF, material, T, ND: effND, NA: effNA };
  }, [material, T, effND, effNA, EFOverride]);

  const handleTabChange = (newTab) => {
    navigate(`/${newTab}`);
  };

  useEffect(() => {
    log_event('DATA', 'Estado atualizado', {
      material, T, type,
      n: calc.n.toExponential(2),
      p: calc.p.toExponential(2),
      EF: calc.EF.toFixed(3),
      Eg: calc.Eg.toFixed(3),
    });
  }, [calc, material, T, type]);

  useEffect(() => {
    log_event('START', 'Aplicação iniciada — Diagrama de Bandas em Semicondutores');
    return () => log_event('END', 'Aplicação encerrada');
  }, []);

  return (
    <div className="app">
      <header className="topbar">
        <div className="language-selector-container">
          <LanguageSelector />
        </div>
        <div className="brand">
          <span className="logo">⚛︎</span>
          <div>
            <h1>{t('header.title')}</h1>
            <p>{t('header.subtitle')}</p>
            <div className="visitor-counter">
              <img 
                src="https://visitor-badge.laobi.icu/badge?page_id=carlosdelfino.fisica-dos-semicondutores.site" 
                alt="Visitantes"
                className="visitor-badge"
              />
            </div>
          </div>
        </div>
      </header>

      <aside className="sidebar">
        <ControlPanel
          controlsProps={{
            material, setMaterial,
            type, setType,
            T, setT,
            ND, setND,
            NA, setNA,
            EFOverride, setEFOverride
          }}
          carrierState={{ ...calc, type }}
        />
        <div className="menu-container">
          <HierarchicalMenu activeTab={tab} onTabChange={handleTabChange} />
        </div>
      </aside>

      <main className="content">
        <Routes>
          <Route path="/" element={
            <>
              <BandDiagram state={{ ...calc, type }} />
              <FermiDiracPlot T={T} EF={calc.EF} Ec={calc.Ec} Ev={calc.Ev} Eg={calc.Eg} />
            </>
          } />
          <Route path="/objectives" element={<LearningObjectives onNavigate={handleTabChange} />} />
          <Route path="/conceptsQ" element={<ConceitosQuestoes onNavigate={handleTabChange} />} />
          <Route path="/questions" element={<Questoes onNavigate={handleTabChange} />} />
          <Route path="/about" element={<Sobre />} />
          <Route path="/overview" element={
            <>
              <BandDiagram state={{ ...calc, type }} />
              <FermiDiracPlot T={T} EF={calc.EF} Ec={calc.Ec} Ev={calc.Ev} Eg={calc.Eg} />
            </>
          } />
          <Route path="/lattice" element={<Lattice type={type} />} />
          <Route path="/atomband" element={<AtomToBand />} />
          <Route path="/allowed" element={<AllowedForbidden />} />
          <Route path="/kp" element={<KronigPenneyDiagram />} />
          <Route path="/mis" element={<MetalInsulatorSemi />} />
          <Route path="/kspace" element={
            <KSpaceDiagram material={material} T={T}
                           Eg={calc.Eg} Ec={calc.Ec} Ev={calc.Ev} />
          } />
          <Route path="/effmass" element={<EffectiveMassDemo />} />
          <Route path="/particles" element={<ElectronHoleCard />} />
          <Route path="/fermi" element={
            <FermiDiracPlot T={T} EF={calc.EF} Ec={calc.Ec} Ev={calc.Ev} Eg={calc.Eg} />
          } />
          <Route path="/dos" element={
            <>
              <QuantumWell3D />
              <DensityOfStates material={material} T={T}
                               EF={calc.EF} Ec={calc.Ec} Ev={calc.Ev} Eg={calc.Eg} />
            </>
          } />
          <Route path="/arrhenius" element={
            <CarrierVsTemp material={material} ND={effND} NA={effNA} currentT={T} />
          } />
          <Route path="/junction" element={<JunctionPN />} />
          <Route path="/transistorTech" element={<TransistorTechPanel />} />
          <Route path="/fetTypes" element={<FetTypesPanel />} />
          <Route path="/czochralski" element={<CrystalGrowthMethods />} />
          <Route path="/perovskites" element={<PerovskitesContent />} />
          <Route path="/crystal-structures" element={<SemiconductorCrystalStructures />} />
          <Route path="/glossary" element={<Glossary />} />
          <Route path="/periodic" element={<PeriodicTable />} />
          <Route path="/formulas" element={<FormulasPanel />} />
        </Routes>
      </main>

      <footer className="footer">
        <p>{t('footer.model')}</p>
        <p>
          <b>{t('footer.nonprofit')}</b> · {t('footer.partOf')}{' '}
          <a href="https://basicaodaeletronica.com.br" target="_blank" rel="noopener noreferrer">
            {t('footer.network')}
          </a>
        </p>
        <p className="copy">
          © {new Date().getFullYear()} · {t('footer.copyright')}
        </p>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}
