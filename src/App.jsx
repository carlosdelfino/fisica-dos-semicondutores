import { useEffect, useMemo, useState } from 'react';
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
import HierarchicalMenu from './components/HierarchicalMenu.jsx';
import ControlPanel from './components/ControlPanel.jsx';
import { carrierConcentrations, log_event } from './physics/formulas.js';
import { MATERIALS, bandgap } from './physics/materials.js';

export default function App() {
  const [material, setMaterial] = useState('Si');
  const [type, setType] = useState('intrinsic');
  const [T, setT] = useState(300);
  const [ND, setND] = useState(1e16);
  const [NA, setNA] = useState(1e16);
  const [tab, setTab] = useState('overview');
  const [EFOverride, setEFOverride] = useState({ enabled: false, value: 0 });

  // dopagem efetiva conforme tipo escolhido
  const effND = type === 'n' ? ND : 0;
  const effNA = type === 'p' ? NA : 0;

  const calc = useMemo(() => {
    const c = carrierConcentrations(material, T, effND, effNA);
    const finalEF = EFOverride.enabled ? EFOverride.value : c.EF;
    return { ...c, EF: finalEF, material, T, ND: effND, NA: effNA };
  }, [material, T, effND, effNA, EFOverride]);

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
        <div className="brand">
          <span className="logo">⚛︎</span>
          <div>
            <h1>Aprendendo a Física dos Semicondutores</h1>
            <p>Simulador Educacional - Disseminando a Ciência e a Física Avançada</p>
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
          <HierarchicalMenu activeTab={tab} onTabChange={setTab} />
        </div>
      </aside>

      <main className="content">
        {tab === 'objectives' && <LearningObjectives onNavigate={setTab} />}
        {tab === 'conceptsQ' && <ConceitosQuestoes onNavigate={setTab} />}
        {tab === 'questions' && <Questoes onNavigate={setTab} />}
        {tab === 'about' && <Sobre />}
        {tab === 'overview' && (
          <>
            <BandDiagram state={{ ...calc, type }} />
            <FermiDiracPlot T={T} EF={calc.EF} Ec={calc.Ec} Ev={calc.Ev} Eg={calc.Eg} />
          </>
        )}
        {tab === 'lattice' && <Lattice type={type} />}
        {tab === 'atomband' && <AtomToBand />}
        {tab === 'allowed' && <AllowedForbidden />}
        {tab === 'kp' && <KronigPenneyDiagram />}
        {tab === 'mis' && <MetalInsulatorSemi />}
        {tab === 'kspace' && (
          <KSpaceDiagram material={material} T={T}
                         Eg={calc.Eg} Ec={calc.Ec} Ev={calc.Ev} />
        )}
        {tab === 'effmass' && <EffectiveMassDemo />}
        {tab === 'particles' && <ElectronHoleCard />}
        {tab === 'fermi' && (
          <FermiDiracPlot T={T} EF={calc.EF} Ec={calc.Ec} Ev={calc.Ev} Eg={calc.Eg} />
        )}
        {tab === 'dos' && (
          <>
            <QuantumWell3D />
            <DensityOfStates material={material} T={T}
                             EF={calc.EF} Ec={calc.Ec} Ev={calc.Ev} Eg={calc.Eg} />
          </>
        )}
        {tab === 'arrhenius' && (
          <CarrierVsTemp material={material} ND={effND} NA={effNA} currentT={T} />
        )}
        {tab === 'junction' && <JunctionPN />}
        {tab === 'transistorTech' && <TransistorTechPanel />}
        {tab === 'periodic' && <PeriodicTable />}
        {tab === 'formulas' && <FormulasPanel />}
      </main>

      <footer className="footer">
        <p>
          Modelo físico: aproximação parabólica de bandas, ionização completa de dopantes acima da temperatura
          de freeze-out, semicondutor não-degenerado. Fórmula de Varshni para Eg(T). Constantes em SI.
        </p>
        <p className="copy">
          © {new Date().getFullYear()} · Educacional CC BY-SA 4.0 · React + SVG + KaTeX
        </p>
      </footer>
    </div>
  );
}
