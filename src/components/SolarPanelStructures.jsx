import { useState, useEffect } from 'react';
import { log_event } from '../physics/formulas.js';
import { TeX } from './Math.jsx';
import SolarCrystalStructures from './SolarCrystalStructures.jsx';
import 'katex/dist/katex.min.css';

/**
 * Componente educacional sobre estruturas cristalinas em painéis solares
 * Foca em diferentes materiais: Si, GaAs, CdTe, CIGS e suas estruturas cristalinas
 */
export default function SolarPanelStructures() {
  const [activeSection, setActiveSection] = useState('overview');

  useEffect(() => {
    log_event('START', 'Seção de Estruturas Cristalinas Solares iniciada');
    return () => log_event('END', 'Seção de Estruturas Cristalinas Solares encerrada');
  }, []);

  const SECTIONS = [
    { id: 'overview', label: 'Visão Geral', icon: '📊' },
    { id: 'silicon', label: 'Silício', icon: '💎' },
    { id: 'gaas', label: 'Gallium Arsenide', icon: '🔮' },
    { id: 'cdte', label: 'Cadmium Telluride', icon: '🟡' },
    { id: 'cigs', label: 'CIGS', icon: '🟢' },
    { id: 'comparison', label: 'Comparação', icon: '📈' }
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return <OverviewSection />;
      case 'silicon':
        return <SiliconSection />;
      case 'gaas':
        return <GaAsSection />;
      case 'cdte':
        return <CdTeSection />;
      case 'cigs':
        return <CIGSSection />;
      case 'comparison':
        return <ComparisonSection />;
      default:
        return <OverviewSection />;
    }
  };

  return (
    <div className="solar-panel-structures">
      <div className="content-header">
        <h2>☀️ Estruturas Cristalinas em Painéis Solares</h2>
        <p className="intro-text">
          Explore as diferentes estruturas cristalinas utilizadas na fabricação de células solares. 
          Entenda como a organização atômica afeta as propriedades elétricas e ópticas dos materiais 
          fotovoltaicos.
        </p>
      </div>

      <div className="content-tabs">
        {SECTIONS.map(section => (
          <button
            key={section.id}
            className={`content-tab ${activeSection === section.id ? 'active' : ''}`}
            onClick={() => {
              setActiveSection(section.id);
              log_event('INFO', 'Seção de estruturas solares selecionada', { section: section.id });
            }}
          >
            <span className="tab-icon">{section.icon}</span>
            <span className="tab-label">{section.label}</span>
          </button>
        ))}
      </div>

      <div className="content-body">
        {renderContent()}
      </div>
    </div>
  );
}

function OverviewSection() {
  return (
    <div className="section-content">
      <h3>📊 Visão Geral das Estruturas Cristalinas</h3>
      
      <div className="info-box">
        <h4>Importância da Estrutura Cristalina</h4>
        <p>
          A estrutura cristalina determina as propriedades fundamentais dos materiais semicondutores 
          utilizados em células solares, incluindo:
        </p>
        <ul>
          <li><strong>Bandgap:</strong> Energia mínima para excitar elétrons</li>
          <li><strong>Mobilidade de portadores:</strong> Velocidade de transporte de carga</li>
          <li><strong>Absorção óptica:</strong> Capacidade de absorver luz</li>
          <li><strong>Estabilidade:</strong> Resistência à degradação</li>
        </ul>
      </div>

      <div className="info-box">
        <h4>Principais Materiais Fotovoltaicos</h4>
        <ul>
          <li><strong>Silício (Si):</strong> Dominante no mercado (95%+), estrutura diamante cúbico</li>
          <li><strong>Gallium Arsenide (GaAs):</strong> Alta eficiência, estrutura zincblende</li>
          <li><strong>Cadmium Telluride (CdTe):</strong> Filme fino, estrutura zincblende</li>
          <li><strong>CIGS:</strong> Filme fino, estrutura calcopirita</li>
          <li><strong>Perovskites:</strong> Tecnologia emergente, estrutura ABX₃</li>
        </ul>
      </div>

      <div className="highlight-box">
        <h4>🔬 Sistemas Cristalinos em Fotovoltaica</h4>
        <p>
          Os seis sistemas cristalinos fundamentais são: triclínico, monoclínico, ortorrômbico, 
          tetragonal, hexagonal e cúbico. Em fotovoltaica, o sistema cúbico é predominante, 
          especialmente as variações:
        </p>
        <ul>
          <li><strong>Cúbico Simples:</strong> Raro em fotovoltaica</li>
          <li><strong>Cúbico Centrado no Corpo (BCC):</strong> Metais de contato (Mo, W)</li>
          <li><strong>Cúbico Centrado na Face (FCC):</strong> Silício, GaAs, CdTe</li>
          <li><strong>Diamante Cúbico:</strong> Silício, germânio</li>
          <li><strong>Zincblende:</strong> GaAs, CdTe, outros III-V e II-VI</li>
          <li><strong>Calcopirita:</strong> CIGS (distorsionado do zincblende)</li>
        </ul>
      </div>

      <div className="diagram-container">
        <SolarCrystalStructures />
      </div>
    </div>
  );
}

function SiliconSection() {
  return (
    <div className="section-content">
      <h3>💎 Silício (Si) - Estrutura Diamante Cúbico</h3>
      
      <div className="info-box">
        <h4>Estrutura Cristalina</h4>
        <p>
          O silício cristaliza na estrutura diamante cúbico, que é essencialmente duas redes 
          FCC interpenetrantes deslocadas por ¼ da diagonal do cubo. Cada átomo de silício 
          está covalentemente ligado a quatro vizinhos em uma configuração tetraédrica.
        </p>
      </div>

      <div className="formula-box">
        <h4>Parâmetros Cristalinos</h4>
        <p><strong>Constante de rede:</strong> <TeX math="a = 5.43 \text{ Å}" /></p>
        <p><strong>Número de coordenação:</strong> 4</p>
        <p><strong>Ângulos de ligação:</strong> 109.5° (tetraédrico)</p>
        <p><strong>Densidade:</strong> 2.33 g/cm³</p>
        <p><strong>Bandgap direto:</strong> 3.4 eV</p>
        <p><strong>Bandgap indireto:</strong> 1.12 eV (utilizado em fotovoltaica)</p>
      </div>

      <div className="highlight-box">
        <h4>🎯 Vantagens do Silício</h4>
        <ul>
          <li><strong>Abundância:</strong> Segundo elemento mais abundante na crosta terrestre</li>
          <li><strong>Maturidade:</strong> Tecnologia bem estabelecida e escalável</li>
          <li><strong>Estabilidade:</strong> Longa vida operacional (25+ anos)</li>
          <li><strong>Toxicidade:</strong> Baixa toxicidade ambiental</li>
          <li><strong>Custo:</strong> Custo continuamente decrescente</li>
        </ul>
      </div>

      <div className="info-box">
        <h4>Tipos de Silício Fotovoltaico</h4>
        <ul>
          <li><strong>Monocristalino:</strong> Eficiência 26-27%, alto custo</li>
          <li><strong>Policristalino:</strong> Eficiência 20-22%, custo moderado</li>
          <li><strong>Amorfo (a-Si):</strong> Eficiência 6-10%, baixo custo, aplicações flexíveis</li>
        </ul>
      </div>

      <div className="info-box">
        <h4>Limitações</h4>
        <ul>
          <li>Bandgap indireto requer material espesso para absorção completa</li>
          <li>Alta temperatura de processamento (~1400°C)</li>
          <li>Limitação teórica de eficiência (~29.4% para junção única)</li>
        </ul>
      </div>
    </div>
  );
}

function GaAsSection() {
  return (
    <div className="section-content">
      <h3>🔮 Gallium Arsenide (GaAs) - Estrutura Zincblende</h3>
      
      <div className="info-box">
        <h4>Estrutura Cristalina</h4>
        <p>
          GaAs cristaliza na estrutura zincblende (blenda de zinco), similar à estrutura diamante 
          mas com dois tipos diferentes de átomos. Ga e As ocupam posições alternadas na rede FCC, 
          criando ligações covalentes polares.
        </p>
      </div>

      <div className="formula-box">
        <h4>Parâmetros Cristalinos</h4>
        <p><strong>Constante de rede:</strong> <TeX math="a = 5.65 \text{ Å}" /></p>
        <p><strong>Número de coordenação:</strong> 4</p>
        <p><strong>Bandgap direto:</strong> 1.42 eV (ideal para fotovoltaica)</p>
        <p><strong>Densidade:</strong> 5.32 g/cm³</p>
        <p><strong>Coefficiente de absorção:</strong> <TeX math="\alpha \approx 10^4 \text{ cm}^{-1}" /></p>
      </div>

      <div className="highlight-box">
        <h4>🎯 Vantagens do GaAs</h4>
        <ul>
          <li><strong>Bandgap direto:</strong> Absorção eficiente com material fino</li>
          <li><strong>Alta mobilidade:</strong> Excelente transporte de carga</li>
          <li><strong>Alta eficiência:</strong> Recordes de 29-30% (junção única)</li>
          <li><strong>Resistência à radiação:</strong> Ideal para aplicações espaciais</li>
          <li><strong>Tandem:</strong> Excelente para células tandem multi-junção</li>
        </ul>
      </div>

      <div className="info-box">
        <h4>Aplicações</h4>
        <ul>
          <li><strong>Espaço:</strong> Satélites e sondas espaciais (alta resistência à radiação)</li>
          <li><strong>Concentradores:</strong> Sistemas de concentração solar (CPV)</li>
          <li><strong>Tandem:</strong> Células multi-junção de alta eficiência</li>
          <li><strong>Optoeletrônica:</strong> LEDs, laser diodes, fotodetectores</li>
        </ul>
      </div>

      <div className="info-box">
        <h4>Limitações</h4>
        <ul>
          <li><strong>Custo:</strong> Muito alto (substratos GaAs caros)</li>
          <li><strong>Escassez:</strong> Arsênio é escasso e tóxico</li>
          <li><strong>Peso:</strong> Densidade alta limita aplicações terrestres</li>
          <li><strong>Escalabilidade:</strong> Difícil produzir em larga escala</li>
        </ul>
      </div>
    </div>
  );
}

function CdTeSection() {
  return (
    <div className="section-content">
      <h3>🟡 Cadmium Telluride (CdTe) - Estrutura Zincblende</h3>
      
      <div className="info-box">
        <h4>Estrutura Cristalina</h4>
        <p>
          CdTe também cristaliza na estrutura zincblende, sendo um semicondutor composto II-VI. 
          Os átomos de Cd e Te ocupam posições alternadas na rede FCC, com ligações mais iônicas 
          que os semicondutores III-V.
        </p>
      </div>

      <div className="formula-box">
        <h4>Parâmetros Cristalinos</h4>
        <p><strong>Constante de rede:</strong> <TeX math="a = 6.48 \text{ Å}" /></p>
        <p><strong>Número de coordenação:</strong> 4</p>
        <p><strong>Bandgap direto:</strong> 1.45 eV (próximo do ideal)</p>
        <p><strong>Densidade:</strong> 5.85 g/cm³</p>
        <p><strong>Coefficiente de absorção:</strong> <TeX math="\alpha \approx 10^5 \text{ cm}^{-1}" /></p>
      </div>

      <div className="highlight-box">
        <h4>🎯 Vantagens do CdTe</h4>
        <ul>
          <li><strong>Bandgap ideal:</strong> 1.45 eV próximo do ótimo para conversão solar</li>
          <li><strong>Absorção alta:</strong> Material fino (1-2 μm) suficiente</li>
          <li><strong>Custo baixo:</strong> Processamento simples e rápido</li>
          <li><strong>Escala:</strong> Produção em larga escala estabelecida</li>
          <li><strong>Reciclagem:</strong> Programas de reciclagem desenvolvidos</li>
        </ul>
      </div>

      <div className="info-box">
        <h4>Processamento</h4>
        <ul>
          <li><strong>Deposição:</strong> Vapor transport close-spaced (CST), sputtering</li>
          <li><strong>Substrato:</strong> Vidro (soda-lime com Na para passivação)</li>
          <li><strong>Espessura:</strong> 1-3 μm (muito fino comparado ao Si)</li>
          <li><strong>Contato traseiro:</strong> Carbono/metal ou Mo</li>
        </ul>
      </div>

      <div className="info-box">
        <h4>Limitações</h4>
        <ul>
          <li><strong>Toxicidade:</strong> Cádmio é tóxico (regulações ambientais)</li>
          <li><strong>Escassez:</strong> Telúrio é raro (produção limitada)</li>
          <li><strong>Eficiência:</strong> Limitada a ~22% (menor que Si)</li>
          <li><strong>Estabilidade:</strong> Degradação em condições extremas</li>
        </ul>
      </div>
    </div>
  );
}

function CIGSSection() {
  return (
    <div className="section-content">
      <h3>🟢 CIGS - Estrutura Calcopirita</h3>
      
      <div className="info-box">
        <h4>Estrutura Cristalina</h4>
        <p>
          CIGS (Copper Indium Gallium Selenide) cristaliza na estrutura calcopirita, uma variação 
          distorcida da estrutura zincblende. A fórmula geral é Cu(In,Ga)Se₂, onde Ga substitui 
          parcialmente In para ajustar o bandgap.
        </p>
      </div>

      <div className="formula-box">
        <h4>Parâmetros Cristalinos</h4>
        <p><strong>Constante de rede:</strong> <TeX math="a \approx 5.7 \text{ Å}, c \approx 11.5 \text{ Å}" /></p>
        <p><strong>Número de coordenação:</strong> 4</p>
        <p><strong>Bandgap:</strong> 1.0-1.7 eV (ajustável pela razão Ga/In)</p>
        <p><strong>Densidade:</strong> 5.75 g/cm³</p>
        <p><strong>Coefficiente de absorção:</strong> <TeX math="\alpha \approx 10^5 \text{ cm}^{-1}" /></p>
      </div>

      <div className="highlight-box">
        <h4>🎯 Vantagens do CIGS</h4>
        <ul>
          <li><strong>Bandgap ajustável:</strong> Tunable pela composição Ga/In</li>
          <li><strong>Absorção alta:</strong> Material fino (1-2 μm) suficiente</li>
          <li><strong>Flexibilidade:</strong> Pode ser depositado em substratos flexíveis</li>
          <li><strong>Eficiência:</strong> Recordes de ~23% (filme fino)</li>
          <li><strong>Estabilidade:</strong> Boa estabilidade térmica e ambiental</li>
        </ul>
      </div>

      <div className="info-box">
        <h4>Estrutura do Dispositivo</h4>
        <ul>
          <li><strong>Substrato:</strong> Vidro (soda-lime) ou polímero flexível</li>
          <li><strong>Contato traseiro:</strong> Molibdênio (Mo)</li>
          <li><strong>Absorvedor:</strong> CIGS p-type (1-3 μm)</li>
          <li><strong>Buffer:</strong> CdS n-type (50 nm)</li>
          <li><strong>Janela:</strong> ZnO:Al (TCO transparente)</li>
        </ul>
      </div>

      <div className="info-box">
        <h4>Processamento</h4>
        <ul>
          <li><strong>Co-evaporação:</strong> Alta eficiência, complexo</li>
          <li><strong>Selenização:</strong> Sputtering + selenização, escalável</li>
          <li><strong>Print:</strong> Impressão de nanopartículas, baixo custo</li>
        </ul>
      </div>

      <div className="info-box">
        <h4>Limitações</h4>
        <ul>
          <li><strong>Complexidade:</strong> Múltiplos elementos (Cu, In, Ga, Se)</li>
          <li><strong>Escassez:</strong> Índio é raro e caro</li>
          <li><strong>Uniformidade:</strong> Difícil manter composição uniforme em larga escala</li>
          <li><strong>Custo:</strong> Processamento mais complexo que CdTe</li>
        </ul>
      </div>
    </div>
  );
}

function ComparisonSection() {
  return (
    <div className="section-content">
      <h3>📈 Comparação de Materiais Fotovoltaicos</h3>
      
      <div className="comparison-box">
        <h4>Comparação Geral</h4>
        <table className="comparison-table">
          <thead>
            <tr>
              <th>Propriedade</th>
              <th>Si</th>
              <th>GaAs</th>
              <th>CdTe</th>
              <th>CIGS</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Estrutura</td>
              <td>Diamante Cúbico</td>
              <td>Zincblende</td>
              <td>Zincblende</td>
              <td>Calcopirita</td>
            </tr>
            <tr>
              <td>Bandgap (eV)</td>
              <td>1.12 (indireto)</td>
              <td>1.42 (direto)</td>
              <td>1.45 (direto)</td>
              <td>1.0-1.7 (direto)</td>
            </tr>
            <tr>
              <td>Eficiência (%)</td>
              <td>26-27</td>
              <td>29-30</td>
              <td>~22</td>
              <td>~23</td>
            </tr>
            <tr>
              <td>Absorção</td>
              <td>Baixa (necessita espessura)</td>
              <td>Alta</td>
              <td>Muito alta</td>
              <td>Muito alta</td>
            </tr>
            <tr>
              <td>Custo</td>
              <td>Moderado</td>
              <td>Muito alto</td>
              <td>Baixo</td>
              <td>Moderado</td>
            </tr>
            <tr>
              <td>Maturidade</td>
              <td>Alta</td>
              <td>Média</td>
              <td>Alta</td>
              <td>Média</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="comparison-box">
        <h4>Comparação de Estruturas Cristalinas</h4>
        <table className="comparison-table">
          <thead>
            <tr>
              <th>Estrutura</th>
              <th>Características</th>
              <th>Materiais</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Diamante Cúbico</td>
              <td>Dois FCC interpenetrantes, tetraédrico</td>
              <td>Si, Ge, C (diamante)</td>
            </tr>
            <tr>
              <td>Zincblende</td>
              <td>FCC alternado, ligações polares</td>
              <td>GaAs, CdTe, ZnSe</td>
            </tr>
            <tr>
              <td>Calcopirita</td>
              <td>Zincblende distorcido, tetragonal</td>
              <td>CIGS, CuInSe₂</td>
            </tr>
            <tr>
              <td>Wurtzite</td>
              <td>Hexagonal, similar ao zincblende</td>
              <td>GaN, ZnO, CdS</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="highlight-box">
        <h4>🔬 Tendências Futuras</h4>
        <ul>
          <li><strong>Perovskites:</strong> Alta eficiência potencial, baixo custo, estabilidade em desenvolvimento</li>
          <li><strong>Tandem:</strong> Combinação de materiais para superar limites teóricos</li>
          <li><strong>Perovskite/Si:</strong> Eficiências &gt;33% demonstradas</li>
          <li><strong>Perovskite/CIGS:</strong> Filme fino tandem flexível</li>
          <li><strong>Materiais emergentes:</strong> Sb₂Se₃, kesterites, perovskitas sem chumbo</li>
        </ul>
      </div>

      <div className="info-box">
        <h4>Seleção de Material</h4>
        <p>
          A escolha do material depende da aplicação:
        </p>
        <ul>
          <li><strong>Utilitário:</strong> Si (custo/benefício otimizado)</li>
          <li><strong>Espaço:</strong> GaAs (alta eficiência, resistência à radiação)</li>
          <li><strong>Residencial:</strong> Si ou CdTe (custo moderado)</li>
          <li><strong>Flexível:</strong> CIGS ou perovskites (substratos leves)</li>
          <li><strong>Concentrador:</strong> GaAs tandem (alta eficiência sob alta concentração)</li>
        </ul>
      </div>

      <div className="diagram-container">
        <SolarCrystalStructures />
      </div>
    </div>
  );
}
