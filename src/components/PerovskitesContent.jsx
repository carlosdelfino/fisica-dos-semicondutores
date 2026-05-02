import { useState, useEffect } from 'react';
import { log_event } from '../physics/formulas.js';
import { TeX } from './Math.jsx';
import PerovskiteStructures from './PerovskiteStructures.jsx';
import SolarPanelStructures from './SolarPanelStructures.jsx';
import 'katex/dist/katex.min.css';

/**
 * Componente educacional sobre Perovskites 2D para Painéis Solares
 * Foca em estruturas cristalinas, distorção octaédrica e transporte de excitons
 */
export default function PerovskitesContent() {
  const [activeSection, setActiveSection] = useState('intro');

  useEffect(() => {
    log_event('START', 'Seção de Perovskites 2D iniciada');
    return () => log_event('END', 'Seção de Perovskites 2D encerrada');
  }, []);

  const SECTIONS = [
    { id: 'intro', label: 'Introdução', icon: '📖' },
    { id: 'structure', label: 'Estrutura Cristalina', icon: '🔷' },
    { id: 'distortion', label: 'Distorção Octaédrica', icon: '🔄' },
    { id: 'transport', label: 'Transporte de Excitons', icon: '⚡' },
    { id: 'other-structures', label: 'Outras Estruturas', icon: '💎' },
    { id: 'applications', label: 'Aplicações', icon: '☀️' },
    { id: 'comparison', label: 'Comparação', icon: '📊' }
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'intro':
        return <IntroductionSection />;
      case 'structure':
        return <StructureSection />;
      case 'distortion':
        return <DistortionSection />;
      case 'transport':
        return <TransportSection />;
      case 'other-structures':
        return <SolarPanelStructures />;
      case 'applications':
        return <ApplicationsSection />;
      case 'comparison':
        return <ComparisonSection />;
      default:
        return <IntroductionSection />;
    }
  };

  return (
    <div className="perovskites-content">
      <div className="content-header">
        <h2>☀️ Perovskites 2D para Painéis Solares</h2>
        <p className="intro-text">
          Explore a física dos semicondutores de perovskite bidimensionais e seu potencial revolucionário 
          para a próxima geração de células solares. Entenda como a simetria cristalina afeta o transporte 
          de carga e a eficiência fotovoltaica.
        </p>
      </div>

      <div className="content-tabs">
        {SECTIONS.map(section => (
          <button
            key={section.id}
            className={`content-tab ${activeSection === section.id ? 'active' : ''}`}
            onClick={() => {
              setActiveSection(section.id);
              log_event('INFO', 'Seção de perovskites selecionada', { section: section.id });
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

function IntroductionSection() {
  return (
    <div className="section-content">
      <h3>📖 Introdução às Perovskites 2D</h3>
      
      <div className="info-box">
        <h4>O que são Perovskites?</h4>
        <p>
          Perovskites são uma classe de materiais com estrutura cristalina geral ABX₃, onde:
        </p>
        <ul>
          <li><strong>A</strong> = cátion orgânico ou inorgânico grande (ex: MA⁺, FA⁺, Cs⁺)</li>
          <li><strong>B</strong> = cátion metálico (tipicamente Pb²⁺ ou Sn²⁺)</li>
          <li><strong>X</strong> = ânion halogênio (Cl⁻, Br⁻, I⁻)</li>
        </ul>
      </div>

      <div className="info-box">
        <h4>Perovskites 2D (Ruddlesden-Popper)</h4>
        <p>
          As perovskites bidimensionais consistem em camadas alternadas de octaedros inorgânicos 
          e moléculas orgânicas de espaçamento. A fórmula geral é:
        </p>
        <div className="formula-box">
          <TeX math="(A')_{2}(A)_{n-1}B_nX_{3n+1}" />
        </div>
        <p>
          Onde <TeX math="A'" /> é o cátion de espaçamento e <TeX math="n" /> é o número 
          de camadas inorgânicas. Esta estrutura quântica de poço confina excitons e melhora a estabilidade.
        </p>
      </div>

      <div className="highlight-box">
        <h4>🎯 Por que Perovskites 2D para Solares?</h4>
        <ul>
          <li><strong>Estabilidade aprimorada:</strong> Maior resistência à umidade e calor comparado às 3D</li>
          <li><strong>Efeito quântico:</strong> Confinamento de excitons em poços quânticos</li>
          <li><strong>Tunabilidade:</strong> Bandgap ajustável pela espessura da camada (valor n)</li>
          <li><strong>Custo-benefício:</strong> Processamento em baixa temperatura e solução</li>
        </ul>
      </div>

      <div className="diagram-container">
        <PerovskiteStructures />
      </div>
    </div>
  );
}

function StructureSection() {
  return (
    <div className="section-content">
      <h3>🔷 Estrutura Cristalina</h3>
      
      <div className="info-box">
        <h4>Estrutura Octaédrica</h4>
        <p>
          A estrutura fundamental das perovskites é baseada em octaedros BX₆, onde o íon metálico B 
          está coordenado por seis íons halogênios X. Em perovskites 2D, esses octaedros formam 
          camadas conectadas pelos vértices.
        </p>
      </div>

      <div className="info-box">
        <h4>Grupo Espacial Tetragonal P4/mmm</h4>
        <p>
          Pesquisadores recentes desenvolveram perovskites 2D com simetria máxima, pertencentes ao 
          grupo espacial tetragonal <strong>P4/mmm</strong>. Esta é a simetria mais alta possível 
          para estruturas em camadas, resultando em:
        </p>
        <ul>
          <li>Ausência de distorção octaédrica no plano e fora do plano</li>
          <li>Ângulos de ligação Pb-X-Pb próximos de 180° (ideal)</li>
          <li>Distâncias intercamadas mínimas (4 Å)</li>
        </ul>
      </div>

      <div className="formula-box">
        <h4>Parâmetros Cristalinos</h4>
        <p><strong>Distância intercamada:</strong></p>
        <TeX math="d = 4 \text{ Å}" />
        <p><strong>Bandgap:</strong></p>
        <TeX math="E_g = 1.7 - 1.8 \text{ eV}" />
        <p><strong>Composição típica:</strong></p>
        <TeX math="(FA)_2(MA)_{n-1}Pb_nI_{3n+1}" />
      </div>

      <div className="highlight-box">
        <h4>🔬 Importância da Simetria</h4>
        <p>
          A alta simetria cristalina é uma característica chave de muitos semicondutores inorgânicos 
          e fundamenta suas propriedades físicas notáveis. Perovskites híbridas (orgânicas e inorgânicas) 
          tradicionalmente exibem simetria cristalina muito menor devido a distorções octaédricas.
        </p>
      </div>
    </div>
  );
}

function DistortionSection() {
  return (
    <div className="section-content">
      <h3>🔄 Distorção Octaédrica</h3>
      
      <div className="info-box">
        <h4>O que é Distorção Octaédrica?</h4>
        <p>
          A distorção octaédrica ocorre quando os octaedros BX₆ se afastam da geometria ideal, 
          resultando em:
        </p>
        <ul>
          <li><strong>Distorção no plano:</strong> Rotação ou inclinação dos octaedros</li>
          <li><strong>Distorção fora do plano:</strong> Compressão ou expansão axial</li>
          <li><strong>Ângulos de ligação:</strong> Desvio de 180° na conexão Pb-X-Pb</li>
        </ul>
      </div>

      <div className="info-box">
        <h4>Causas da Distorção</h4>
        <ul>
          <li><strong>Tamanho do cátion A:</strong> Cátions muito grandes ou pequenos causam tensão estrutural</li>
          <li><strong>Interações de van der Waals:</strong> Entre camadas orgânicas</li>
          <li><strong>Temperatura:</strong> Transições de fase térmicas</li>
          <li><strong>Síntese:</strong> Condições de cristalização (temperatura e taxa)</li>
        </ul>
      </div>

      <div className="comparison-box">
        <h4>Comparação: Com vs Sem Distorção</h4>
        <table className="comparison-table">
          <thead>
            <tr>
              <th>Propriedade</th>
              <th>Com Distorção</th>
              <th>Sem Distorção (Simétrica)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Ângulo Pb-X-Pb</td>
              <td>150-170°</td>
              <td>~180° (ideal)</td>
            </tr>
            <tr>
              <td>Distância intercamada</td>
              <td>&gt; 4 Å</td>
              <td>= 4 Å (mínima)</td>
            </tr>
            <tr>
              <td>Transporte de carga</td>
              <td>Limitado</td>
              <td>Otimizado</td>
            </tr>
            <tr>
              <td>Bandgap</td>
              <td>1.9-2.2 eV</td>
              <td>1.7-1.8 eV</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="diagram-container">
        <PerovskiteStructures />
      </div>
    </div>
  );
}

function TransportSection() {
  return (
    <div className="section-content">
      <h3>⚡ Transporte de Excitons</h3>
      
      <div className="info-box">
        <h4>O que são Excitons?</h4>
        <p>
          Excitons são pares elétron-lacuna ligados por atração coulombiana, formados quando um fóton 
          é absorvido pelo material. Em perovskites 2D, o confinamento quântico aumenta a energia 
          de ligação do exciton.
        </p>
      </div>

      <div className="formula-box">
        <h4>Comprimento de Difusão de Exciton</h4>
        <p>
          O comprimento de difusão (<TeX math="L_D" />) é a distância média que um exciton viaja 
          antes de se recombinar:
        </p>
        <TeX math="L_D = \sqrt{D \tau}" />
        <p>
          Onde <TeX math="D" /> é o coeficiente de difusão e <TeX math="\tau" /> é o tempo de vida.
        </p>
      </div>

      <div className="highlight-box">
        <h4>🚀 Recordes em Perovskites Simétricas</h4>
        <p>
          Perovskites 2D com simetria máxima alcançaram:
        </p>
        <ul>
          <li><strong>Comprimento de difusão:</strong> <TeX math="L_D = 2.5 \mu\text{m}" /></li>
          <li><strong>Difusividade:</strong> <TeX math="D = 4.4 \text{ cm}^2/\text{s}" /></li>
          <li><strong>Comparação:</strong> Uma ordem de magnitude maior que perovskites 2D anteriores</li>
          <li><strong>Paridade:</strong> Comparável a dicalcogenetos de metal de transição monocamada</li>
        </ul>
      </div>

      <div className="info-box">
        <h4>Impacto da Ausência de Distorção</h4>
        <p>
          A eliminação da distorção octaédrica resulta em:
        </p>
        <ul>
          <li>Redução da dispersão (scattering) de fonons</li>
          <li>Melhor acoplamento entre camadas</li>
          <li>Transporte de carga mais eficiente</li>
          <li>Menor probabilidade de recombinação não radiativa</li>
        </ul>
      </div>

      <div className="comparison-box">
        <h4>Comparação de Transporte</h4>
        <table className="comparison-table">
          <thead>
            <tr>
              <th>Material</th>
              <th>L_D (μm)</th>
              <th>D (cm²/s)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Perovskite 2D com distorção</td>
              <td>0.1-0.5</td>
              <td>0.1-0.5</td>
            </tr>
            <tr>
              <td>Perovskite 2D simétrica</td>
              <td><strong>2.5</strong></td>
              <td><strong>4.4</strong></td>
            </tr>
            <tr>
              <td>Perovskite 3D (FAPbI₃)</td>
              <td>1-5</td>
              <td>1-10</td>
            </tr>
            <tr>
              <td>TMD monocamada (MoS₂)</td>
              <td>0.5-2</td>
              <td>1-5</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ApplicationsSection() {
  return (
    <div className="section-content">
      <h3>☀️ Aplicações em Painéis Solares</h3>
      
      <div className="info-box">
        <h4>Células Solares Tandem</h4>
        <p>
          Perovskites 2D são ideais para células solares tandem (empilhadas) devido ao seu bandgap 
          ajustável (1.7-1.8 eV), que é perfeito para a camada superior em tandem com silício 
          (bandgap ~1.1 eV).
        </p>
      </div>

      <div className="formula-box">
        <h4>Limite de Eficiência Tandem</h4>
        <p>
          A eficiência teórica máxima de uma célula tandem é maior que a de uma célula de junção única:
        </p>
        <ul>
          <li><strong>Junção única (Si):</strong> ~29% (limite de Shockley-Queisser)</li>
          <li><strong>Tandem Perovskite/Si:</strong> ~43% (limite teórico)</li>
          <li><strong>Record experimental:</strong> &gt;33% (2024)</li>
        </ul>
      </div>

      <div className="highlight-box">
        <h4>🎯 Vantagens para Aplicações Solares</h4>
        <ul>
          <li><strong>Estabilidade:</strong> Perovskites 2D são mais estáveis que as 3D</li>
          <li><strong>Processamento:</strong> Podem ser depositadas por spin-coating, blade-coating</li>
          <li><strong>Custo:</strong> Materiais e processamento de baixo custo</li>
          <li><strong>Flexibilidade:</strong> Podem ser aplicadas em substratos flexíveis</li>
          <li><strong>Transparência:</strong> Camadas finas podem ser semitransparentes</li>
        </ul>
      </div>

      <div className="info-box">
        <h4>Desafios Atuais</h4>
        <ul>
          <li><strong>Escalabilidade:</strong> Uniformidade em grandes áreas</li>
          <li><strong>Toxicidade:</strong> Conteúdo de chumbo (pesquisa em substitutos como Sn)</li>
          <li><strong>Longevidade:</strong> Degradação a longo prazo</li>
          <li><strong>Integração:</strong> Compatibilidade com processos industriais existentes</li>
        </ul>
      </div>
    </div>
  );
}

function ComparisonSection() {
  return (
    <div className="section-content">
      <h3>📊 Comparação Completa</h3>
      
      <div className="comparison-box">
        <h4>Perovskites 2D vs 3D</h4>
        <table className="comparison-table">
          <thead>
            <tr>
              <th>Propriedade</th>
              <th>Perovskite 2D</th>
              <th>Perovskite 3D</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Estrutura</td>
              <td>Camadas alternadas</td>
              <td>Rede contínua 3D</td>
            </tr>
            <tr>
              <td>Estabilidade</td>
              <td>Alta (resistente à umidade)</td>
              <td>Moderada/Baixa</td>
            </tr>
            <tr>
              <td>Transporte de carga</td>
              <td>Anisotrópico (melhor no plano)</td>
              <td>Isotrópico</td>
            </tr>
            <tr>
              <td>Bandgap</td>
              <td>1.7-2.5 eV (ajustável)</td>
              <td>1.2-1.6 eV</td>
            </tr>
            <tr>
              <td>Processamento</td>
              <td>Temperatura ambiente</td>
              <td>Temperatura moderada</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="comparison-box">
        <h4>Com vs Sem Distorção em 2D</h4>
        <table className="comparison-table">
          <thead>
            <tr>
              <th>Propriedade</th>
              <th>Com Distorção</th>
              <th>Sem Distorção (Simétrica)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Simetria cristalina</td>
              <td>Baixa (triclínica/monoclínica)</td>
              <td>Alta (tetragonal P4/mmm)</td>
            </tr>
            <tr>
              <td>Ângulo Pb-X-Pb</td>
              <td>150-170°</td>
              <td>~180°</td>
            </tr>
            <tr>
              <td>Distância intercamada</td>
              <td>&gt; 4 Å</td>
              <td>= 4 Å</td>
            </tr>
            <tr>
              <td>L_D (exciton)</td>
              <td>0.1-0.5 μm</td>
              <td>2.5 μm</td>
            </tr>
            <tr>
              <td>D (difusividade)</td>
              <td>0.1-0.5 cm²/s</td>
              <td>4.4 cm²/s</td>
            </tr>
            <tr>
              <td>Bandgap</td>
              <td>1.9-2.2 eV</td>
              <td>1.7-1.8 eV</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="highlight-box">
        <h4>🔬 Conclusões Principais</h4>
        <ul>
          <li>A simetria cristalina máxima é crucial para transporte de carga eficiente em perovskites 2D</li>
          <li>A eliminação da distorção octaédrica aumenta o comprimento de difusão em uma ordem de magnitude</li>
          <li>Perovskites 2D simétricas combinam estabilidade com desempenho comparável às 3D</li>
          <li>Estes materiais são promissores para células solares tandem de alta eficiência</li>
          <li>O controle preciso da síntese (temperatura, taxa, cátions) é essencial para alcançar simetria máxima</li>
        </ul>
      </div>

      <div className="diagram-container">
        <PerovskiteStructures />
      </div>
    </div>
  );
}
