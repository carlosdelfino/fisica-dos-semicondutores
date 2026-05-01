import { useState, useEffect } from 'react';
import { log_event } from '../physics/formulas.js';
import { TeX } from './Math.jsx';
import 'katex/dist/katex.min.css';

/**
 * Dados detalhados dos componentes do processo Czochralski
 */
const COMPONENT_DETAILS = {
  'pull-rod': {
    title: 'Haste de Puxamento',
    icon: '🔧',
    description: 'A haste de puxamento é responsável por movimentar a semente cristalina para cima com velocidade e rotação controladas. Este controle preciso é essencial para manter a estabilidade do crescimento do cristal.',
    engineering: {
      title: 'Engenharia do Sistema',
      content: [
        'Material: Tungstênio ou molibdênio (alta resistência mecânica e térmica)',
        'Controle de velocidade: 0.1-10 mm/h (precisão de ±0.01 mm/h)',
        'Rotação: 5-30 RPM (sentido oposto ao cadinho para homogeneização)',
        'Sistema de acionamento: Motor servo com encoder de alta resolução',
        'Vibração: < 0.1 µm (crítico para evitar defeitos no cristal)'
      ]
    },
    physics: {
      title: 'Física do Processo',
      equations: [
        {
          name: 'Velocidade de Puxamento',
          formula: 'v = \\frac{G}{\\rho_s A}',
          variables: 'G: taxa de crescimento (kg/h), ρₛ: densidade do sólido (2330 kg/m³), A: área da seção transversal'
        },
        {
          name: 'Taxa de Crescimento',
          formula: 'G = k (T_m - T_i)',
          variables: 'k: constante de transferência de calor, Tₘ: temperatura de fusão, Tᵢ: temperatura da interface'
        }
      ]
    },
    challenges: [
      'Minimizar vibrações que causam dislocações',
      'Manter alinhamento perfeito com o centro do cadinho',
      'Controlar expansão térmica da haste'
    ]
  },
  'seed': {
    title: 'Cristal Semente',
    icon: '💎',
    description: 'A semente é um pequeno monocristal de silício que define a orientação cristalográfica do tarugo inteiro. É o ponto de nucleação para o crescimento do cristal.',
    engineering: {
      title: 'Engenharia da Semente',
      content: [
        'Orientação: <100> ou <111> (depende da aplicação)',
        'Diâmetro: 3-10 mm (pescoço Dash)',
        'Material: Silício monocristalino de alta pureza',
        'Preparação: corte e polimento com precisão atômica',
        'Montagem: fixação mecânica ou por solda a ponto'
      ]
    },
    physics: {
      title: 'Física da Nucleação',
      equations: [
        {
          name: 'Energia de Nucleação',
          formula: '\\Delta G = \\frac{16\\pi \\gamma^3}{3(\\Delta G_v)^2}',
          variables: 'γ: energia superficial, ΔGᵥ: energia de volume por unidade'
        },
        {
          name: 'Raio Crítico',
          formula: 'r^* = \\frac{2\\gamma}{\\Delta G_v}',
          variables: 'r*: raio crítico para nucleação estável'
        }
      ]
    },
    challenges: [
      'Evitar contaminação da semente',
      'Garantir orientação cristalográfica precisa',
      'Controlar o resfriamento inicial para evitar tensões'
    ]
  },
  'ingot': {
    title: 'Tarugo Monocristalino',
    icon: '🔷',
    description: 'O tarugo monocristalino é o produto final do processo Czochralski, consistindo de silício de alta pureza com estrutura cristalina perfeita. Será cortado em wafers para fabricação de chips.',
    engineering: {
      title: 'Estrutura do Tarugo',
      content: [
        'Pescoço (Dash): 3-5 mm de diâmetro, elimina dislocações',
        'Ombro: transição suave para o diâmetro final',
        'Corpo: diâmetro constante (200-300 mm padrão)',
        'Cauda: redução gradual para evitar tensões',
        'Comprimento típico: 1-2 metros'
      ]
    },
    physics: {
      title: 'Crescimento do Cristal',
      equations: [
        {
          name: 'Equação de Scheil (Segregação)',
          formula: 'C_s = k_0 C_0 (1 - f)^{k_0 - 1}',
          variables: 'Cₛ: concentração no sólido, k₀: coeficiente de segregação, C₀: concentração inicial, f: fração solidificada'
        },
        {
          name: 'Taxa de Solidificação',
          formula: '\\frac{\\partial f}{\\partial t} = \\frac{v}{L}',
          variables: 'v: velocidade de puxamento, L: comprimento total'
        }
      ]
    },
    challenges: [
      'Manter homogeneidade de dopantes ao longo do comprimento',
      'Minimizar tensões residuais que causam quebra',
      'Controlar a forma da interface sólido-líquido'
    ]
  },
  'crucible': {
    title: 'Cadinho de Quartzo',
    icon: '🏺',
    description: 'O cadinho de quartzo (SiO₂) contém o silício fundido. Deve suportar temperaturas extremas (> 1414°C) sem contaminar o silício.',
    engineering: {
      title: 'Engenharia do Cadinho',
      content: [
        'Material: Quartzo de alta pureza (SiO₂ > 99.999%)',
        'Diâmetro: 300-500 mm (depende do tamanho do tarugo)',
        'Espessura: 10-15 mm (paredes)',
        'Resistência química: inerte ao silício fundido',
        'Vida útil: 50-100 horas de operação'
      ]
    },
    physics: {
      title: 'Interação Química',
      equations: [
        {
          name: 'Reação de Redução',
          formula: 'SiO_2 + Si \\rightarrow 2SiO_{(g)}',
          variables: 'Formação de monóxido de silício (evaporável)'
        },
        {
          name: 'Taxa de Erosão',
          formula: '\\frac{dR}{dt} = k_r e^{-\\frac{E_a}{RT}}',
          variables: 'kᵣ: constante de erosão, Eₐ: energia de ativação'
        }
      ]
    },
    challenges: [
      'Minimizar contaminação por oxigênio',
      'Evitar deformação sob peso do silício fundido',
      'Gerenciar expansão térmica diferencial'
    ]
  },
  'melt': {
    title: 'Silício Fundido',
    icon: '🔥',
    description: 'O silício policristalino é fundido a 1414°C e recristalizado na interface sólido-líquido. A composição química e pureza determinam as propriedades elétricas finais.',
    engineering: {
      title: 'Propriedades do Melt',
      content: [
        'Temperatura: 1414°C (ponto de fusão do Si)',
        'Densidade: 2.53 g/cm³ (líquido)',
        'Viscosidade: 0.7-0.8 mPa·s',
        'Tensão superficial: 720-740 mN/m',
        'Condutividade térmica: 64 W/(m·K)'
      ]
    },
    physics: {
      title: 'Transporte de Massa',
      equations: [
        {
          name: 'Equação de Convecção',
          formula: '\\frac{\\partial C}{\\partial t} + \\mathbf{v} \\cdot \\nabla C = D \\nabla^2 C',
          variables: 'C: concentração, v: velocidade do fluido, D: coeficiente de difusão'
        },
        {
          name: 'Número de Reynolds',
          formula: 'Re = \\frac{\\rho v L}{\\mu}',
          variables: 'ρ: densidade, v: velocidade, L: escala característica, μ: viscosidade'
        }
      ]
    },
    challenges: [
      'Homogeneizar dopantes no melt',
      'Controlar convecção para evitar defeitos',
      'Minimizar evaporação de silício'
    ]
  },
  'chamber': {
    title: 'Câmara de Crescimento',
    icon: '🔬',
    description: 'A câmara de crescimento é um invólucro fechado que permite controle preciso de atmosfera, pressão e contaminação durante o processo.',
    engineering: {
      title: 'Projeto da Câmara',
      content: [
        'Material: Aço inoxidável 316L',
        'Pressão: 10-100 Torr (vácuo parcial)',
        'Vazamento: < 10⁻⁹ Torr·L/s',
        'Portas de visualização: quartzo óptico',
        'Dimensões: 1-2 metros de altura'
      ]
    },
    physics: {
      title: 'Dinâmica de Gases',
      equations: [
        {
          name: 'Equação de Continuidade',
          formula: '\\frac{\\partial \\rho}{\\partial t} + \\nabla \\cdot (\\rho \\mathbf{v}) = 0',
          variables: 'ρ: densidade do gás, v: velocidade do fluxo'
        },
        {
          name: 'Número de Knudsen',
          formula: 'Kn = \\frac{\\lambda}{L}',
          variables: 'λ: caminho livre médio, L: escala característica'
        }
      ]
    },
    challenges: [
      'Manter vácuo estável durante operação',
      'Evitar contaminação por partículas',
      'Gerenciar expansão térmica da câmara'
    ]
  },
  'argon': {
    title: 'Atmosfera de Argônio',
    icon: '💨',
    description: 'O argônio é usado como gás inerte para reduzir oxidação e arrastar contaminantes voláteis durante o crescimento do cristal.',
    engineering: {
      title: 'Sistema de Gás',
      content: [
        'Pureza: 99.9999% (6N)',
        'Fluxo: 10-100 L/min',
        'Pressão: 10-100 Torr',
        'Circulação: forçada para homogeneização',
        'Filtragem: filtros de 0.1 µm'
      ]
    },
    physics: {
      title: 'Transporte de Contaminantes',
      equations: [
        {
          name: 'Taxa de Arraste',
          formula: 'J = k_g (C_i - C_b)',
          variables: 'J: fluxo de massa, k_g: coeficiente de transferência, Cᵢ: concentração na interface, C_b: concentração no bulk'
        },
        {
          name: 'Difusão em Gás',
          formula: 'D_{AB} = \\frac{3}{8} \\frac{(\\pi k_B T)^{1/2}}{\\pi \\sigma_{AB}^2 \\Omega}',
          variables: 'Dₐᵦ: coeficiente de difusão, k_B: constante de Boltzmann, σ: diâmetro de colisão'
        }
      ]
    },
    challenges: [
      'Minimizar turbulência que afeta o melt',
      'Controlar umidade residual',
      'Otimizar custo de argônio de alta pureza'
    ]
  },
  'diameter-control': {
    title: 'Controle de Diâmetro',
    icon: '📏',
    description: 'O controle preciso do diâmetro do cristal é crítico para a qualidade e yield dos wafers. Sistemas modernos usam sensores ópticos e controle PID multivariável.',
    engineering: {
      title: 'Sistema de Controle',
      content: [
        'Sensor: câmera CCD com iluminação laser',
        'Resolução: ±0.1 mm',
        'Algoritmo: PID multivariável adaptativo',
        'Variáveis controladas: potência, velocidade, rotação',
        'Tempo de resposta: < 1 segundo'
      ]
    },
    physics: {
      title: 'Dinâmica de Controle',
      equations: [
        {
          name: 'Controlador PID',
          formula: 'u(t) = K_p e(t) + K_i \\int_0^t e(\\tau) d\\tau + K_d \\frac{de(t)}{dt}',
          variables: 'u: sinal de controle, e: erro, Kp/Ki/Kd: ganhos'
        },
        {
          name: 'Relação Diâmetro-Velocidade',
          formula: 'D = \\frac{2G}{\\pi \\rho_s v}',
          variables: 'D: diâmetro, G: taxa de crescimento, ρₛ: densidade, v: velocidade'
        }
      ]
    },
    challenges: [
      'Compensar atrasos no sistema térmico',
      'Lidar com não-linearidades do processo',
      'Manter estabilidade durante transições'
    ]
  },
  'susceptor': {
    title: 'Susceptor de Grafite',
    icon: '🔩',
    description: 'O susceptor de grafite sustenta o cadinho e ajuda no acoplamento térmico com o sistema de aquecimento resistivo.',
    engineering: {
      title: 'Projeto do Susceptor',
      content: [
        'Material: grafite de alta pureza (99.999%)',
        'Condutividade térmica: 100-150 W/(m·K)',
        'Resistência à oxidação: atmosfera inerte',
        'Geometria: cilíndrica com suporte anelar',
        'Vida útil: 200-300 horas'
      ]
    },
    physics: {
      title: 'Transferência de Calor',
      equations: [
        {
          name: 'Condução Térmica',
          formula: 'q = -k \\nabla T',
          variables: 'q: fluxo de calor, k: condutividade térmica, T: temperatura'
        },
        {
          name: 'Resistência Térmica',
          formula: 'R_{th} = \\frac{L}{kA}',
          variables: 'Rₜₕ: resistência térmica, L: espessura, A: área'
        }
      ]
    },
    challenges: [
      'Minimizar gradientes térmicos',
      'Evitar contaminação por carbono',
      'Gerenciar expansão térmica'
    ]
  },
  'heater': {
    title: 'Aquecedor e Isolamento',
    icon: '🔌',
    description: 'O sistema de aquecimento fornece energia para manter o silício fundido e controlar o gradiente térmico crítico para o crescimento do cristal.',
    engineering: {
      title: 'Sistema de Aquecimento',
      content: [
        'Tipo: resistivo (grafite) ou indução',
        'Potência: 50-200 kW',
        'Temperatura máxima: 1600°C',
        'Isolamento: fibra cerâmica multicamadas',
        'Zonas de aquecimento: 3-5 zonas independentes'
      ]
    },
    physics: {
      title: 'Transferência de Calor',
      equations: [
        {
          name: 'Equação de Calor',
          formula: '\\rho c_p \\frac{\\partial T}{\\partial t} = \\nabla \\cdot (k \\nabla T) + Q',
          variables: 'ρ: densidade, cₚ: calor específico, k: condutividade, Q: geração de calor'
        },
        {
          name: 'Radiação Térmica',
          formula: 'q = \\epsilon \\sigma (T^4 - T_0^4)',
          variables: 'ε: emissividade, σ: constante de Stefan-Boltzmann'
        }
      ]
    },
    challenges: [
      'Controlar gradiente térmico na interface',
      'Minimizar consumo de energia',
      'Evitar pontos quentes locais'
    ]
  },
  'pull-assembly': {
    title: 'Assembly de Puxamento',
    icon: '⚙️',
    description: 'O assembly de puxamento inclui o motor, sistema de rotação e mecanismos de transmissão que controlam o movimento da haste.',
    engineering: {
      title: 'Mecanismo de Acionamento',
      content: [
        'Motor: servo de alta precisão',
        'Encoder: 10000+ pulsos/rotação',
        'Redução: engrenagens de baixo backlash',
        'Rotação: controle bidirecional',
        'Posicionamento: resolução sub-micrométrica'
      ]
    },
    physics: {
      title: 'Dinâmica Mecânica',
      equations: [
        {
          name: 'Torque Requerido',
          formula: '\\tau = I \\alpha + \\tau_{fric} + \\tau_{load}',
          variables: 'τ: torque, I: momento de inércia, α: aceleração angular'
        },
        {
          name: 'Frequência Natural',
          formula: 'f_n = \\frac{1}{2\\pi} \\sqrt{\\frac{k}{m}}',
          variables: 'fₙ: frequência natural, k: rigidez, m: massa'
        }
      ]
    },
    challenges: [
      'Minimizar vibrações mecânicas',
      'Compensar expansão térmica',
      'Manter precisão a longo prazo'
    ]
  },
  'crucible-rotation': {
    title: 'Rotação do Cadinho',
    icon: '🔄',
    description: 'A rotação do cadinho em sentido oposto ao do cristal ajuda na homogeneização térmica e química do melt.',
    engineering: {
      title: 'Sistema de Rotação',
      content: [
        'Velocidade: 5-20 RPM (oposta ao cristal)',
        'Direção: reversível para homogeneização',
        'Acoplamento: magnético (evita contaminação)',
        'Precisão: ±0.5 RPM',
        'Sincronização: com rotação do cristal'
      ]
    },
    physics: {
      title: 'Dinâmica de Fluidos',
      equations: [
        {
          name: 'Velocidade Tangencial',
          formula: 'v_\\theta = \\omega r',
          variables: 'vθ: velocidade tangencial, ω: velocidade angular, r: raio'
        },
        {
          name: 'Número de Taylor',
          formula: 'Ta = \\frac{4\\Omega^2 R^4}{\\nu^2}',
          variables: 'Ω: velocidade angular, R: raio, ν: viscosidade cinemática'
        }
      ]
    },
    challenges: [
      'Evitar instabilidades de fluxo',
      'Minimizar perturbações na interface',
      'Controlar consumo de energia'
    ]
  },
  'insulation': {
    title: 'Isolamento Térmico',
    icon: '🛡️',
    description: 'O isolamento térmico reduz perdas de calor e permite controle preciso do gradiente térmico no sistema.',
    engineering: {
      title: 'Sistema de Isolamento',
      content: [
        'Material: fibra cerâmica de alumina-silicato',
        'Espessura: 50-100 mm',
        'Condutividade: 0.1-0.2 W/(m·K)',
        'Camadas: múltiplas com densidade variável',
        'Vida útil: 500-1000 horas'
      ]
    },
    physics: {
      title: 'Transferência de Calor',
      equations: [
        {
          name: 'Fluxo de Calor',
          formula: 'q = \\frac{T_{hot} - T_{cold}}{R_{th}}',
          variables: 'q: fluxo de calor, Rₜₕ: resistência térmica total'
        },
        {
          name: 'Resistência de Isolamento',
          formula: 'R_{ins} = \\frac{L}{kA}',
          variables: 'L: espessura, k: condutividade, A: área'
        }
      ]
    },
    challenges: [
      'Minimizar degradação térmica',
      'Evitar contaminação por partículas',
      'Otimizar custo-benefício'
    ]
  }
};

/**
 * Fórmulas matemáticas do processo Czochralski
 */
const PROCESS_FORMULAS = {
  transport: {
    title: 'Transporte de Massa no Melt',
    formulas: [
      {
        name: 'Equação de Navier-Stokes (Fluxo)',
        formula: '\\rho \\left( \\frac{\\partial \\mathbf{v}}{\\partial t} + \\mathbf{v} \\cdot \\nabla \\mathbf{v} \\right) = -\\nabla p + \\mu \\nabla^2 \\mathbf{v} + \\rho \\mathbf{g}',
        description: 'Descreve o movimento do fluido no silício fundido sob influência de forças de pressão, viscosidade e gravidade.'
      },
      {
        name: 'Equação de Convecção-Difusão',
        formula: '\\frac{\\partial C}{\\partial t} + \\mathbf{v} \\cdot \\nabla C = D \\nabla^2 C + R',
        description: 'Governa o transporte de dopantes no melt, considerando convecção, difusão e reações químicas.'
      },
      {
        name: 'Número de Péclet',
        formula: 'Pe = \\frac{v L}{D}',
        description: 'Relaciona transporte convectivo e difusivo. Pe >> 1 indica domínio da convecção.'
      }
    ]
  },
  segregation: {
    title: 'Segregação de Dopantes',
    formulas: [
      {
        name: 'Equação de Scheil',
        formula: 'C_s = k_0 C_0 (1 - f)^{k_0 - 1}',
        description: 'Descreve a distribuição de dopantes ao longo do tarugo quando não há difusão no sólido.'
      },
      {
        name: 'Coeficiente de Segregação Efetivo',
        formula: 'k_{eff} = \\frac{k_0}{k_0 + (1 - k_0) e^{-v \\delta / D}}',
        description: 'Considera difusão na camada de limite, onde δ é a espessura da camada de limite.'
      },
      {
        name: 'Distribuição de Boro (k₀ = 0.8)',
        formula: 'C_s(z) = C_0 k_0 (1 - \\frac{z}{L})^{k_0 - 1}',
        description: 'Exemplo prático para boro em silício.'
      }
    ]
  },
  interface: {
    title: 'Estabilidade da Interface',
    formulas: [
      {
        name: 'Critério de Mullins-Sekerka',
        formula: '\\sigma \\kappa + \\frac{\\Delta H_f}{T_m} \\Delta T > 0',
        description: 'Condição para estabilidade morfológica da interface sólido-líquido.'
      },
      {
        name: 'Curvatura da Interface',
        formula: '\\kappa = \\frac{1}{R_1} + \\frac{1}{R_2}',
        description: 'Soma das curvaturas principais nos raios de curvatura R₁ e R₂.'
      },
      {
        name: 'Gradiente Térmico Crítico',
        formula: 'G_c = \\frac{\\Delta H_f v}{k_s}',
        description: 'Gradiente térmico mínimo para evitar instabilidades.'
      }
    ]
  },
  stress: {
    title: 'Tensões Mecânicas',
    formulas: [
      {
        name: 'Tensor de Tensão',
        formula: '\\sigma_{ij} = C_{ijkl} \\epsilon_{kl}',
        description: 'Relação constitutiva entre tensão e deformação via tensor de rigidez C.'
      },
      {
        name: 'Critério de von Mises',
        formula: '\\sigma_{vm} = \\sqrt{\\frac{3}{2} s_{ij} s_{ij}}',
        description: 'Tensão equivalente para prever yield plástico. sᵢⱼ é o desvio de tensão.'
      },
      {
        name: 'Densidade de Dislocações',
        formula: '\\rho_d = \\frac{\\sigma_{yield}}{\\alpha G b}',
        description: 'Estima densidade de dislocações baseada na tensão de yield.'
      }
    ]
  },
  modern: {
    title: 'Sistemas Modernos de Controle',
    formulas: [
      {
        name: 'Controlador PID Multivariável',
        formula: '\\mathbf{u}(t) = -\\mathbf{K}_P \\mathbf{e}(t) - \\mathbf{K}_I \\int \\mathbf{e}(t) dt - \\mathbf{K}_D \\frac{d\\mathbf{e}(t)}{dt}',
        description: 'Controle vetorial de múltiplas variáveis (potência, velocidade, rotação).'
      },
      {
        name: 'Modelo de Estado Espaço',
        formula: '\\frac{d\\mathbf{x}}{dt} = \\mathbf{A}\\mathbf{x} + \\mathbf{B}\\mathbf{u}, \\quad \\mathbf{y} = \\mathbf{C}\\mathbf{x} + \\mathbf{D}\\mathbf{u}',
        description: 'Representação moderna para controle avançado e observadores de estado.'
      },
      {
        name: 'Função de Custo MPC',
        formula: 'J = \\sum_{k=0}^{N-1} \\|\\mathbf{y}(k) - \\mathbf{r}(k)\\|^2_Q + \\|\\mathbf{u}(k)\\|^2_R',
        description: 'Model Predictive Control otimiza ações futuras minimizando erro e esforço de controle.'
      }
    ]
  }
};

export default function CzochralskiContent() {
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [activeFormulaTab, setActiveFormulaTab] = useState('transport');
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    log_event('START', 'Conteúdo Czochralski iniciado');
    return () => log_event('END', 'Conteúdo Czochralski encerrado');
  }, []);

  const handleComponentClick = (componentId) => {
    const component = COMPONENT_DETAILS[componentId];
    if (component) {
      setSelectedComponent(component);
      setShowModal(true);
      log_event('INFO', 'Componente selecionado', { component: componentId });
    }
  };

  const handleSvgClick = (componentId) => {
    handleComponentClick(componentId);
  };

  const handleMouseEnter = (componentId) => {
    // Adicionar feedback visual ao passar o mouse
  };

  const handleMouseLeave = () => {
    // Remover feedback visual
  };

  const renderFormula = (formula) => {
    return (
      <div key={formula.name} className="formula-item">
        <h4 className="formula-name">{formula.name}</h4>
        <div className="formula-display">
          <TeX math={formula.formula} block />
        </div>
        <p className="formula-description">{formula.description}</p>
      </div>
    );
  };

  return (
    <div className="czochralski-content">
      <div className="panel-header">
        <h2>🔬 Processo Czochralski de Crescimento de Cristais</h2>
        <p className="intro-text">
          Explore o processo industrial de crescimento de tarugos monocristalinos de silício para produção de wafers.
          Clique nos componentes do diagrama para detalhes sobre a engenharia do processo.
        </p>
      </div>

      <div className="panel-layout">
        <div className="diagram-container">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 1400 900" 
            className="czochralski-diagram"
            style={{ cursor: 'pointer', width: '100%', height: 'auto' }}
          >
            <defs>
              <linearGradient id="metal" x1="0" x2="1">
                <stop offset="0" stopColor="#e2e8f0"/>
                <stop offset="0.5" stopColor="#f1f5f9"/>
                <stop offset="1" stopColor="#94a3b8"/>
              </linearGradient>
              <linearGradient id="glass" x1="0" x2="1">
                <stop offset="0" stopColor="#dbeafe" stopOpacity="0.3"/>
                <stop offset="0.5" stopColor="#eff6ff" stopOpacity="0.15"/>
                <stop offset="1" stopColor="#93c5fd" stopOpacity="0.28"/>
              </linearGradient>
              <linearGradient id="siliconMelt" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0" stopColor="#ffd166"/>
                <stop offset="0.48" stopColor="#ff7a18"/>
                <stop offset="1" stopColor="#9a3412"/>
              </linearGradient>
              <linearGradient id="ingot" x1="0" x2="1">
                <stop offset="0" stopColor="#475569"/>
                <stop offset="0.18" stopColor="#cbd5e1"/>
                <stop offset="0.50" stopColor="#f8fafc"/>
                <stop offset="0.82" stopColor="#94a3b8"/>
                <stop offset="1" stopColor="#334155"/>
              </linearGradient>
              <radialGradient id="hotGlow" cx="50%" cy="55%" r="55%">
                <stop offset="0" stopColor="#fef08a" stopOpacity="0.8"/>
                <stop offset="0.55" stopColor="#fb923c" stopOpacity="0.4"/>
                <stop offset="1" stopColor="#ea580c" stopOpacity="0"/>
              </radialGradient>
              <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="8" stdDeviation="8" floodColor="#0f172a" floodOpacity="0.22"/>
              </filter>
              <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
              <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
                <path d="M0,0 L10,5 L0,10 z" fill="#1e293b"/>
              </marker>
            </defs>

            <rect x="0" y="0" width="1400" height="900" fill="#f8fafc"/>
            <text x="70" y="58" fontSize="32" fontWeight="700" fill="#0f172a">Equipamento Czochralski para crescimento de tarugo monocristalino de silício</text>
            <text x="70" y="86" fontSize="16" fill="#475569">Diagrama técnico interativo: clique nos componentes para detalhes sobre a engenharia do processo.</text>

            {/* outer machine frame */}
            <rect 
              x="390" y="110" width="470" height="715" rx="36" 
              fill="url(#metal)" stroke="#334155" strokeWidth="4" filter="url(#shadow)"
              onClick={() => handleSvgClick('chamber')}
              onMouseEnter={() => handleMouseEnter('chamber')}
              onMouseLeave={handleMouseLeave}
              style={{ cursor: 'pointer', transition: 'all 0.3s ease' }}
              className="svg-clickable"
            />
            <rect x="430" y="150" width="390" height="635" rx="30" fill="#e2e8f0" stroke="#64748b" strokeWidth="2"/>

            {/* growth chamber transparent */}
            <rect 
              x="465" y="175" width="320" height="570" rx="155" 
              fill="url(#glass)" stroke="#2563eb" strokeOpacity="0.55" strokeWidth="3"
              onClick={() => handleSvgClick('chamber')}
              onMouseEnter={() => handleMouseEnter('chamber')}
              onMouseLeave={handleMouseLeave}
              style={{ cursor: 'pointer', transition: 'all 0.3s ease' }}
              className="svg-clickable"
            />
            <rect x="500" y="210" width="250" height="500" rx="120" fill="#38bdf8" opacity="0.15"/>
            <text x="525" y="232" fontSize="13" fill="#475569">Atmosfera controlada</text>
            <text x="555" y="250" fontSize="13" fill="#475569">tipicamente argônio</text>

            {/* top pulling assembly */}
            <rect 
              x="535" y="105" width="180" height="58" rx="12" 
              fill="#cbd5e1" stroke="#1e293b" strokeWidth="2.2"
              onClick={() => handleSvgClick('pull-assembly')}
              onMouseEnter={() => handleMouseEnter('pull-assembly')}
              onMouseLeave={handleMouseLeave}
              style={{ cursor: 'pointer', transition: 'all 0.3s ease' }}
              className="svg-clickable"
            />
            <circle 
              cx="625" cy="134" r="22" fill="#f8fafc" stroke="#1e293b" strokeWidth="2.2"
              onClick={() => handleSvgClick('pull-assembly')}
              onMouseEnter={() => handleMouseEnter('pull-assembly')}
              onMouseLeave={handleMouseLeave}
              style={{ cursor: 'pointer', transition: 'all 0.3s ease' }}
              className="svg-clickable"
            />
            <path d="M607 134 h36" stroke="#334155" strokeWidth="1.6"/>
            <path d="M625 116 v36" stroke="#334155" strokeWidth="1.6"/>
            <text x="553" y="98" fontSize="13" fill="#475569">Motor/acionamento de puxamento</text>

            {/* pulling rod */}
            <rect 
              x="615" y="160" width="20" height="220" rx="8" 
              fill="#94a3b8" stroke="#1e293b" strokeWidth="2.2"
              onClick={() => handleSvgClick('pull-rod')}
              onMouseEnter={() => handleMouseEnter('pull-rod')}
              onMouseLeave={handleMouseLeave}
              style={{ cursor: 'pointer', transition: 'all 0.3s ease' }}
              className="svg-clickable"
            />
            <path d="M600 182 C585 168 585 145 602 132" fill="none" stroke="#334155" strokeWidth="2" markerEnd="url(#arrow)"/>
            <text x="540" y="183" fontSize="13" fill="#475569">rotação</text>

            {/* seed crystal */}
            <polygon 
              points="613,380 637,380 632,425 618,425" 
              fill="#64748b" stroke="#1e293b" strokeWidth="2.2"
              onClick={() => handleSvgClick('seed')}
              onMouseEnter={() => handleMouseEnter('seed')}
              onMouseLeave={handleMouseLeave}
              style={{ cursor: 'pointer', transition: 'all 0.3s ease' }}
              className="svg-clickable"
            />
            <text x="647" y="409" fontSize="13" fill="#475569">semente</text>

            {/* crystal ingot with neck, shoulder and body */}
            <path 
              d="M616 425 C617 455, 617 475, 617 492 C592 505, 568 535, 567 570 L567 640 C567 660, 683 660, 683 640 L683 570 C682 535, 658 505, 633 492 C633 475, 633 455, 634 425 Z" 
              fill="url(#ingot)" stroke="#1e293b" strokeWidth="2.2"
              onClick={() => handleSvgClick('ingot')}
              onMouseEnter={() => handleMouseEnter('ingot')}
              onMouseLeave={handleMouseLeave}
              style={{ cursor: 'pointer', transition: 'all 0.3s ease' }}
              className="svg-clickable"
            />
            <ellipse cx="625" cy="640" rx="58" ry="13" fill="#94a3b8" stroke="#1e293b" strokeWidth="2"/>
            <line x1="625" y1="430" x2="625" y2="650" stroke="#0f172a" strokeWidth="1" strokeDasharray="5 6" opacity="0.45"/>

            {/* melt and crucible */}
            <ellipse 
              cx="625" cy="664" rx="132" ry="30" 
              fill="url(#siliconMelt)" stroke="#7c2d12" strokeWidth="2"
              onClick={() => handleSvgClick('melt')}
              onMouseEnter={() => handleMouseEnter('melt')}
              onMouseLeave={handleMouseLeave}
              style={{ cursor: 'pointer', transition: 'all 0.3s ease' }}
              className="svg-clickable"
            />
            <rect x="493" y="625" width="264" height="105" fill="url(#siliconMelt)" opacity="0.90"/>
            <ellipse cx="625" cy="730" rx="132" ry="30" fill="#9a3412" stroke="#7c2d12" strokeWidth="2"/>
            <path 
              d="M493 664 C500 735, 525 770, 625 770 C725 770, 750 735, 757 664" 
              fill="none" stroke="#f8fafc" strokeWidth="24" opacity="0.88"
              onClick={() => handleSvgClick('crucible')}
              onMouseEnter={() => handleMouseEnter('crucible')}
              onMouseLeave={handleMouseLeave}
              style={{ cursor: 'pointer', transition: 'all 0.3s ease' }}
              className="svg-clickable"
            />
            <path 
              d="M493 664 C500 735, 525 770, 625 770 C725 770, 750 735, 757 664" 
              fill="none" stroke="#1e293b" strokeWidth="2.5"
              onClick={() => handleSvgClick('crucible')}
              onMouseEnter={() => handleMouseEnter('crucible')}
              onMouseLeave={handleMouseLeave}
              style={{ cursor: 'pointer', transition: 'all 0.3s ease' }}
              className="svg-clickable"
            />
            <ellipse cx="625" cy="664" rx="132" ry="30" fill="none" stroke="#1e293b" strokeWidth="2.5"/>

            {/* heat glow / heater */}
            <ellipse cx="625" cy="690" rx="210" ry="150" fill="url(#hotGlow)"/>
            <path 
              d="M452 635 C420 665, 420 735, 452 765" 
              fill="none" stroke="#ea580c" strokeWidth="16" strokeLinecap="round"
              onClick={() => handleSvgClick('heater')}
              onMouseEnter={() => handleMouseEnter('heater')}
              onMouseLeave={handleMouseLeave}
              style={{ cursor: 'pointer', transition: 'all 0.3s ease' }}
              className="svg-clickable"
            />
            <path 
              d="M798 635 C830 665, 830 735, 798 765" 
              fill="none" stroke="#ea580c" strokeWidth="16" strokeLinecap="round"
              onClick={() => handleSvgClick('heater')}
              onMouseEnter={() => handleMouseEnter('heater')}
              onMouseLeave={handleMouseLeave}
              style={{ cursor: 'pointer', transition: 'all 0.3s ease' }}
              className="svg-clickable"
            />
            <path d="M452 635 C420 665, 420 735, 452 765" fill="none" stroke="#7c2d12" strokeWidth="2"/>
            <path d="M798 635 C830 665, 830 735, 798 765" fill="none" stroke="#7c2d12" strokeWidth="2"/>

            {/* graphite susceptor */}
            <path 
              d="M475 654 C482 756, 520 798, 625 798 C730 798, 768 756, 775 654" 
              fill="none" stroke="#111827" strokeWidth="18" opacity="0.78"
              onClick={() => handleSvgClick('susceptor')}
              onMouseEnter={() => handleMouseEnter('susceptor')}
              onMouseLeave={handleMouseLeave}
              style={{ cursor: 'pointer', transition: 'all 0.3s ease' }}
              className="svg-clickable"
            />
            <ellipse 
              cx="625" cy="654" rx="150" ry="34" 
              fill="none" stroke="#111827" strokeWidth="18" opacity="0.78"
              onClick={() => handleSvgClick('susceptor')}
              onMouseEnter={() => handleMouseEnter('susceptor')}
              onMouseLeave={handleMouseLeave}
              style={{ cursor: 'pointer', transition: 'all 0.3s ease' }}
              className="svg-clickable"
            />

            {/* thermal insulation */}
            <rect 
              x="430" y="560" width="390" height="245" rx="55" 
              fill="#1f2937" opacity="0.11" stroke="#475569" strokeWidth="2" strokeDasharray="9 7"
              onClick={() => handleSvgClick('insulation')}
              onMouseEnter={() => handleMouseEnter('insulation')}
              onMouseLeave={handleMouseLeave}
              style={{ cursor: 'pointer', transition: 'all 0.3s ease' }}
              className="svg-clickable"
            />

            {/* bottom drive */}
            <rect 
              x="540" y="800" width="170" height="38" rx="9" 
              fill="#cbd5e1" stroke="#1e293b" strokeWidth="2.2"
              onClick={() => handleSvgClick('crucible-rotation')}
              onMouseEnter={() => handleMouseEnter('crucible-rotation')}
              onMouseLeave={handleMouseLeave}
              style={{ cursor: 'pointer', transition: 'all 0.3s ease' }}
              className="svg-clickable"
            />
            <line x1="625" y1="770" x2="625" y2="800" stroke="#334155" strokeWidth="8"/>
            <path d="M685 817 C707 805 707 833 685 822" fill="none" stroke="#334155" strokeWidth="2" markerEnd="url(#arrow)"/>

            {/* callout boxes left */}
            <rect 
              x="55" y="135" width="300" height="80" rx="12" 
              fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.4" filter="url(#shadow)"
              onClick={() => handleSvgClick('pull-rod')}
              onMouseEnter={() => handleMouseEnter('pull-rod')}
              onMouseLeave={handleMouseLeave}
              style={{ cursor: 'pointer', transition: 'all 0.3s ease' }}
              className="svg-clickable"
            />
            <text x="75" y="165" fontSize="16" fontWeight="600" fill="#0f172a">Haste de puxamento</text>
            <text x="75" y="188" fontSize="13" fill="#475569">Move a semente para cima</text>
            <text x="75" y="206" fontSize="13" fill="#475569">com rotação e velocidade controladas.</text>
            <path d="M355 175 C440 175, 520 205, 615 245" fill="none" stroke="#1e293b" strokeWidth="1.8" markerEnd="url(#arrow)"/>

            <rect 
              x="55" y="245" width="300" height="88" rx="12" 
              fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.4" filter="url(#shadow)"
              onClick={() => handleSvgClick('seed')}
              onMouseEnter={() => handleMouseEnter('seed')}
              onMouseLeave={handleMouseLeave}
              style={{ cursor: 'pointer', transition: 'all 0.3s ease' }}
              className="svg-clickable"
            />
            <text x="75" y="275" fontSize="16" fontWeight="600" fill="#0f172a">Cristal semente</text>
            <text x="75" y="298" fontSize="13" fill="#475569">Pequeno monocristal que define</text>
            <text x="75" y="316" fontSize="13" fill="#475569">a orientação cristalográfica do tarugo.</text>
            <path d="M355 290 C445 310, 540 360, 617 400" fill="none" stroke="#1e293b" strokeWidth="1.8" markerEnd="url(#arrow)"/>

            <rect 
              x="55" y="365" width="300" height="108" rx="12" 
              fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.4" filter="url(#shadow)"
              onClick={() => handleSvgClick('ingot')}
              onMouseEnter={() => handleMouseEnter('ingot')}
              onMouseLeave={handleMouseLeave}
              style={{ cursor: 'pointer', transition: 'all 0.3s ease' }}
              className="svg-clickable"
            />
            <text x="75" y="395" fontSize="16" fontWeight="600" fill="#0f172a">Tarugo monocristalino</text>
            <text x="75" y="418" fontSize="13" fill="#475569">Regiões típicas: pescoço, ombro</text>
            <text x="75" y="436" fontSize="13" fill="#475569">e corpo cilíndrico útil para corte</text>
            <text x="75" y="454" fontSize="13" fill="#475569">posterior em wafers.</text>
            <path d="M355 420 C450 450, 520 510, 568 565" fill="none" stroke="#1e293b" strokeWidth="1.8" markerEnd="url(#arrow)"/>

            <rect 
              x="55" y="510" width="300" height="92" rx="12" 
              fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.4" filter="url(#shadow)"
              onClick={() => handleSvgClick('crucible')}
              onMouseEnter={() => handleMouseEnter('crucible')}
              onMouseLeave={handleMouseLeave}
              style={{ cursor: 'pointer', transition: 'all 0.3s ease' }}
              className="svg-clickable"
            />
            <text x="75" y="540" fontSize="16" fontWeight="600" fill="#0f172a">Cadinho de quartzo</text>
            <text x="75" y="563" fontSize="13" fill="#475569">Recipiente de SiO₂ que contém</text>
            <text x="75" y="581" fontSize="13" fill="#475569">o silício fundido.</text>
            <path d="M355 555 C435 590, 465 650, 500 690" fill="none" stroke="#1e293b" strokeWidth="1.8" markerEnd="url(#arrow)"/>

            <rect 
              x="55" y="635" width="300" height="100" rx="12" 
              fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.4" filter="url(#shadow)"
              onClick={() => handleSvgClick('melt')}
              onMouseEnter={() => handleMouseEnter('melt')}
              onMouseLeave={handleMouseLeave}
              style={{ cursor: 'pointer', transition: 'all 0.3s ease' }}
              className="svg-clickable"
            />
            <text x="75" y="665" fontSize="16" fontWeight="600" fill="#0f172a">Silício fundido</text>
            <text x="75" y="688" fontSize="13" fill="#475569">Silício policristalino é fundido</text>
            <text x="75" y="706" fontSize="13" fill="#475569">e recristalizado na interface</text>
            <text x="75" y="724" fontSize="13" fill="#475569">sólido-líquido.</text>
            <path d="M355 685 C430 675, 500 665, 570 664" fill="none" stroke="#1e293b" strokeWidth="1.8" markerEnd="url(#arrow)"/>

            {/* callout boxes right */}
            <rect 
              x="910" y="135" width="410" height="88" rx="12" 
              fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.4" filter="url(#shadow)"
              onClick={() => handleSvgClick('chamber')}
              onMouseEnter={() => handleMouseEnter('chamber')}
              onMouseLeave={handleMouseLeave}
              style={{ cursor: 'pointer', transition: 'all 0.3s ease' }}
              className="svg-clickable"
            />
            <text x="930" y="165" fontSize="16" fontWeight="600" fill="#0f172a">Câmara de crescimento</text>
            <text x="930" y="188" fontSize="13" fill="#475569">Invólucro fechado para controle de atmosfera,</text>
            <text x="930" y="206" fontSize="13" fill="#475569">pressão, contaminação e fluxo gasoso.</text>
            <path d="M910 180 C845 205, 806 270, 784 350" fill="none" stroke="#1e293b" strokeWidth="1.8" markerEnd="url(#arrow)"/>

            <rect 
              x="910" y="255" width="410" height="88" rx="12" 
              fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.4" filter="url(#shadow)"
              onClick={() => handleSvgClick('argon')}
              onMouseEnter={() => handleMouseEnter('argon')}
              onMouseLeave={handleMouseLeave}
              style={{ cursor: 'pointer', transition: 'all 0.3s ease' }}
              className="svg-clickable"
            />
            <text x="930" y="285" fontSize="16" fontWeight="600" fill="#0f172a">Gás inerte: argônio</text>
            <text x="930" y="308" fontSize="13" fill="#475569">Usado para reduzir oxidação e arraste</text>
            <text x="930" y="326" fontSize="13" fill="#475569">de contaminantes durante o crescimento.</text>
            <path d="M910 300 C825 310, 780 330, 725 370" fill="none" stroke="#1e293b" strokeWidth="1.8" markerEnd="url(#arrow)"/>

            <rect 
              x="910" y="375" width="410" height="96" rx="12" 
              fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.4" filter="url(#shadow)"
              onClick={() => handleSvgClick('diameter-control')}
              onMouseEnter={() => handleMouseEnter('diameter-control')}
              onMouseLeave={handleMouseLeave}
              style={{ cursor: 'pointer', transition: 'all 0.3s ease' }}
              className="svg-clickable"
            />
            <text x="930" y="405" fontSize="16" fontWeight="600" fill="#0f172a">Controle de diâmetro</text>
            <text x="930" y="428" fontSize="13" fill="#475569">A taxa de puxamento, a potência térmica</text>
            <text x="930" y="446" fontSize="13" fill="#475569">e a rotação influenciam o diâmetro</text>
            <text x="930" y="464" fontSize="13" fill="#475569">do cristal em crescimento.</text>
            <path d="M910 420 C825 430, 745 500, 682 570" fill="none" stroke="#1e293b" strokeWidth="1.8" markerEnd="url(#arrow)"/>

            <rect 
              x="910" y="510" width="410" height="96" rx="12" 
              fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.4" filter="url(#shadow)"
              onClick={() => handleSvgClick('susceptor')}
              onMouseEnter={() => handleMouseEnter('susceptor')}
              onMouseLeave={handleMouseLeave}
              style={{ cursor: 'pointer', transition: 'all 0.3s ease' }}
              className="svg-clickable"
            />
            <text x="930" y="540" fontSize="16" fontWeight="600" fill="#0f172a">Susceptor de grafite</text>
            <text x="930" y="563" fontSize="13" fill="#475569">Estrutura que sustenta o cadinho</text>
            <text x="930" y="581" fontSize="13" fill="#475569">e ajuda no acoplamento térmico</text>
            <text x="930" y="599" fontSize="13" fill="#475569">com o sistema de aquecimento.</text>
            <path d="M910 560 C820 585, 790 640, 775 685" fill="none" stroke="#1e293b" strokeWidth="1.8" markerEnd="url(#arrow)"/>

            <rect 
              x="910" y="640" width="410" height="112" rx="12" 
              fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.4" filter="url(#shadow)"
              onClick={() => handleSvgClick('heater')}
              onMouseEnter={() => handleMouseEnter('heater')}
              onMouseLeave={handleMouseLeave}
              style={{ cursor: 'pointer', transition: 'all 0.3s ease' }}
              className="svg-clickable"
            />
            <text x="930" y="670" fontSize="16" fontWeight="600" fill="#0f172a">Aquecedor e isolamento térmico</text>
            <text x="930" y="693" fontSize="13" fill="#475569">Fornecem energia para manter o silício</text>
            <text x="930" y="711" fontSize="13" fill="#475569">fundido e controlar o gradiente térmico.</text>
            <text x="930" y="729" fontSize="13" fill="#475569">O isolamento reduz perdas de calor.</text>
            <path d="M910 700 C840 700, 825 700, 806 700" fill="none" stroke="#1e293b" strokeWidth="1.8" markerEnd="url(#arrow)"/>

            {/* process annotations */}
            <path d="M676 483 C710 475, 710 535, 676 528" fill="none" stroke="#334155" strokeWidth="2" markerEnd="url(#arrow)"/>
            <text x="703" y="506" fontSize="13" fill="#475569">rotação do cristal</text>

            <path d="M575 789 C545 804, 545 760, 575 777" fill="none" stroke="#334155" strokeWidth="2" markerEnd="url(#arrow)"/>
            <text x="425" y="812" fontSize="13" fill="#475569">rotação do cadinho</text>

            <line x1="625" y1="388" x2="625" y2="330" stroke="#0f172a" strokeWidth="2.4" markerEnd="url(#arrow)"/>
            <text x="642" y="350" fontSize="13" fill="#475569">puxamento vertical</text>

            {/* footer note */}
            <rect x="390" y="850" width="470" height="30" rx="10" fill="#e2e8f0" stroke="#cbd5e1"/>
            <text x="415" y="870" fontSize="13" fill="#475569">Representação didática interativa; clique nos componentes para detalhes da engenharia do processo.</text>
          </svg>
          <p className="diagram-hint">
            💡 Clique nos componentes do diagrama para ver detalhes técnicos
          </p>
        </div>

        <div className="formulas-container">
          <div className="formulas-header">
            <h3>📐 Fórmulas do Processo</h3>
            <div className="formula-tabs">
              {Object.keys(PROCESS_FORMULAS).map(key => (
                <button
                  key={key}
                  className={`formula-tab ${activeFormulaTab === key ? 'active' : ''}`}
                  onClick={() => setActiveFormulaTab(key)}
                >
                  {PROCESS_FORMULAS[key].title}
                </button>
              ))}
            </div>
          </div>

          <div className="formulas-content">
            {PROCESS_FORMULAS[activeFormulaTab] && (
              <div className="formula-section">
                <h4>{PROCESS_FORMULAS[activeFormulaTab].title}</h4>
                <div className="formulas-list">
                  {PROCESS_FORMULAS[activeFormulaTab].formulas.map(renderFormula)}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="engineering-overview">
        <h3>⚙️ Engenharia do Processo</h3>
        <div className="overview-cards">
          <div className="overview-card">
            <h4>🌊 Transporte de Massa</h4>
            <p>O processo não é puramente térmico - envolve convecção complexa no silício fundido, difusão de dopantes e interações multifásicas que afetam a homogeneidade do cristal.</p>
          </div>
          <div className="overview-card">
            <h4>🧪 Difusão de Dopantes</h4>
            <p>A equação de segregação de Scheil governa a distribuição de dopantes ao longo do tarugo. Coeficientes de segregação diferentes para boro (k₀=0.8) e fósforo (k₀=0.35) criam gradientes de concentração.</p>
          </div>
          <div className="overview-card">
            <h4>🎯 Estabilidade de Interface</h4>
            <p>A interface sólido-líquido deve ser estável para evitar defeitos. O critério de Mullins-Sekerka e o controle do gradiente térmico são essenciais para prevenir instabilidades morfológicas.</p>
          </div>
          <div className="overview-card">
            <h4>💪 Tensões Mecânicas</h4>
            <p>Tensões térmicas durante o resfriamento podem causar dislocações e quebra do cristal. O controle da taxa de resfriamento e o projeto do pescoço Dash são críticos.</p>
          </div>
        </div>
      </div>

      <div className="modern-systems">
        <h3>🚀 Sistemas Modernos</h3>
        <div className="modern-cards">
          <div className="modern-card">
            <h4>🎛️ Controle PID Multivariável</h4>
            <p>Sistemas avançados usam controladores PID que atuam simultaneamente sobre potência térmica, velocidade de puxamento e rotação para manter o diâmetro constante e a qualidade do cristal.</p>
          </div>
          <div className="modern-card">
            <h4>📷 Sensores Ópticos</h4>
            <p>Câmeras CCD de alta resolução com iluminação laser monitoram o diâmetro do cristal em tempo real, permitindo correções automáticas com precisão de ±0.1 mm.</p>
          </div>
          <div className="modern-card">
            <h4>🔬 Modelos Numéricos (CFD)</h4>
            <p>Computational Fluid Dynamics simula o fluxo no melt, transferência de calor e distribuição de dopantes, permitindo otimização do processo antes da execução real.</p>
          </div>
          <div className="modern-card">
            <h4>🤖 Inteligência Artificial</h4>
            <p>Algoritmos de machine learning analisam dados históricos para prever defeitos, otimizar parâmetros de processo e melhorar o yield de produção.</p>
          </div>
        </div>
      </div>

      {showModal && selectedComponent && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{selectedComponent.icon} {selectedComponent.title}</h3>
              <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
            </div>

            <div className="modal-body">
              <p className="modal-description">{selectedComponent.description}</p>

              {selectedComponent.engineering && (
                <div className="modal-section">
                  <h4>🔧 {selectedComponent.engineering.title}</h4>
                  <ul>
                    {selectedComponent.engineering.content.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}

              {selectedComponent.physics && (
                <div className="modal-section">
                  <h4>⚡ {selectedComponent.physics.title}</h4>
                  {selectedComponent.physics.equations.map((eq, index) => (
                    <div key={index} className="physics-equation">
                      <h5>{eq.name}</h5>
                      <div className="equation-display">
                        <TeX math={eq.formula} block />
                      </div>
                      <p className="equation-variables">{eq.variables}</p>
                    </div>
                  ))}
                </div>
              )}

              {selectedComponent.challenges && (
                <div className="modal-section">
                  <h4>⚠️ Desafios</h4>
                  <ul>
                    {selectedComponent.challenges.map((challenge, index) => (
                      <li key={index}>{challenge}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
