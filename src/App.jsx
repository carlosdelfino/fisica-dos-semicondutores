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
import FermiDiracEducational from './components/FermiDiracEducational.jsx';
import DensityOfStatesEducational from './components/DensityOfStatesEducational.jsx';
import ExercisesPanel from './components/ExercisesPanel.jsx';
import KSpaceDiagram from './components/KSpaceDiagram.jsx';
import EffectiveMassDemo from './components/EffectiveMassDemo.jsx';
import KronigPenneyDiagram from './components/KronigPenneyDiagram.jsx';
import AllowedForbidden from './components/AllowedForbidden.jsx';
import AtomToBand from './components/AtomToBand.jsx';
import QuantumWell3D from './components/QuantumWell3D.jsx';
import QuantumAtomModel from './components/QuantumAtomModel.jsx';
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
import DiamondLatticeUnitCell from './components/DiamondLatticeUnitCell.jsx';
import Glossary from './components/Glossary.jsx';
import HierarchicalMenu from './components/HierarchicalMenu.jsx';
import ControlPanel from './components/ControlPanel.jsx';
import SupportPanel from './components/SupportPanel.jsx';
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
                alt={t('header.visitors')}
                className="visitor-badge"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Tarja GitHub com i18n */}
      <aside className="gh-ribbon" aria-label={t('menu.items.community')}>
        <a href="https://github.com/carlosdelfino/fisica-dos-semicondutores"
           target="_blank" rel="noopener noreferrer"
           title={t('menu.items.community_title')}>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.56v-2.13c-3.2.7-3.87-1.36-3.87-1.36-.52-1.32-1.27-1.67-1.27-1.67-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.02 1.75 2.68 1.24 3.34.95.1-.74.4-1.24.72-1.53-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.28 1.18-3.09-.12-.29-.51-1.46.11-3.04 0 0 .96-.31 3.15 1.18.91-.25 1.89-.38 2.86-.38.97 0 1.95.13 2.86.38 2.18-1.49 3.14-1.18 3.14-1.18.62 1.58.23 2.75.11 3.04.74.81 1.18 1.83 1.18 3.09 0 4.42-2.69 5.39-5.26 5.68.41.36.78 1.06.78 2.13v3.16c0 .31.21.66.8.55C20.21 21.39 23.5 17.08 23.5 12 23.5 5.65 18.35.5 12 .5z"/>
          </svg>
          <span>{t('menu.items.community')}</span>
        </a>
      </aside>

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
          <Route path="/diamond-unit-cell" element={<DiamondLatticeUnitCell />} />
          <Route path="/lattice" element={<Lattice material={material} type={type} />} />
          <Route path="/quantumAtom" element={<QuantumAtomModel />} />
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
          <Route path="/fermi-edu" element={
            <FermiDiracEducational />
          } />
          <Route path="/dos" element={
            <>
              <QuantumWell3D />
              <DensityOfStates material={material} T={T}
                               EF={calc.EF} Ec={calc.Ec} Ev={calc.Ev} Eg={calc.Eg} />
            </>
          } />
          <Route path="/dos-edu" element={
            <DensityOfStatesEducational />
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
          <Route path="/exercises" element={<ExercisesPanel />} />
          <Route path="/support-us" element={<SupportPanel />} />
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
