import { useEffect, useMemo, useState } from 'react';
import Controls from './components/Controls.jsx';
import BandDiagram from './components/BandDiagram.jsx';
import Lattice from './components/Lattice.jsx';
import FermiDiracPlot from './components/FermiDiracPlot.jsx';
import DensityOfStates from './components/DensityOfStates.jsx';
import CarrierVsTemp from './components/CarrierVsTemp.jsx';
import CarrierPanel from './components/CarrierPanel.jsx';
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
import { carrierConcentrations, log_event } from './physics/formulas.js';
import { MATERIALS, bandgap } from './physics/materials.js';

const TABS = [
  { id: 'objectives', label: '🎯 Roteiro de Estudo' },
  { id: 'overview',   label: 'Visão Geral' },
  { id: 'lattice',    label: 'Rede Cristalina' },
  { id: 'atomband',   label: 'Átomos → Bandas' },
  { id: 'allowed',    label: 'Bandas Permitidas/Proibidas' },
  { id: 'kp',         label: 'Kronig-Penney' },
  { id: 'mis',        label: 'Metal × Isolante × Semicondutor' },
  { id: 'kspace',     label: 'Espaço-k (Si × GaAs)' },
  { id: 'effmass',    label: 'Massa Efetiva' },
  { id: 'particles',  label: 'Elétron × Lacuna' },
  { id: 'fermi',      label: 'Fermi-Dirac & MB' },
  { id: 'dos',        label: 'Densidade de Estados' },
  { id: 'arrhenius',  label: 'n(T) Arrhenius' },
  { id: 'formulas',   label: 'Fórmulas & Derivações' },
];

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
            <h1>Bandas de Energia em Semicondutores</h1>
            <p>Simulador educacional · Si / Ge / GaAs · intrínseco · dopado P (n) · dopado B (p)</p>
          </div>
        </div>
        <nav className="tabs">
          {TABS.map((t) => (
            <button key={t.id} className={tab === t.id ? 'tab active' : 'tab'}
                    onClick={() => setTab(t.id)}>
              {t.label}
            </button>
          ))}
        </nav>
      </header>

      <aside className="sidebar">
        <Controls
          material={material} setMaterial={setMaterial}
          type={type} setType={setType}
          T={T} setT={setT}
          ND={ND} setND={setND}
          NA={NA} setNA={setNA}
          EFOverride={EFOverride} setEFOverride={setEFOverride}
        />
        <CarrierPanel state={{ ...calc, type }} />
      </aside>

      <main className="content">
        {tab === 'objectives' && <LearningObjectives onNavigate={setTab} />}
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
