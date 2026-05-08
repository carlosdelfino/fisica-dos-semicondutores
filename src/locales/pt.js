import fetTypes from './fetTypes/pt.js';
import transistorTech from './transistorTech/pt.js';

export default {
  fetTypes,
  transistorTech,
  meta: {
    code: 'pt',
    name: 'Português',
    nativeName: 'Português',
    dir: 'ltr',
    flag: '🇧🇷'
  },
  header: {
    title: 'Aprendendo a Física dos Semicondutores',
    subtitle: 'Simulador Educacional - Disseminando a Ciência e a Física Avançada',
    visitors: 'Visitantes'
  },
  footer: {
    model: 'Modelo físico: aproximação parabólica de bandas, ionização completa de dopantes acima da temperatura de freeze-out, semicondutor não-degenerado. Fórmula de Varshni para Eg(T). Constantes em SI.',
    nonprofit: 'Projeto sem fins lucrativos',
    partOf: 'Parte da',
    network: 'rede de sites do Basicão da Eletrônica',
    copyright: 'Educacional CC BY-SA 4.0 · React + SVG + KaTeX'
  },
  menu: {
    categories: {
      learning: '📚 Aprendizado',
      fundamentals: '🔬 Fundamentos',
      bandStructure: '⚛️ Estrutura de Bandas',
      quantumStatistics: '📊 Estatística Quântica',
      devices: '⚡ Dispositivos',
      reference: '📐 Referência'
    },
    items: {
      objectives: '🎯 Roteiro de Estudo',
      conceptsQ: '📖 Conceitos das Questões',
      questions: '❓ Questões',
      glossary: '📚 Glossário',
      overview: 'Visão Geral',
      lattice: 'Rede Cristalina',
      'crystal-structures': '💎 Estruturas Cristalinas',
      atomband: 'Átomos → Bandas',
      allowed: 'Bandas Permitidas/Proibidas',
      kp: 'Kronig-Penney',
      mis: 'Metal × Isolante × Semicondutor',
      kspace: 'Espaço-k (Si × GaAs)',
      effmass: 'Massa Efetiva',
      particles: 'Elétron × Lacuna',
      fermi: 'Fermi-Dirac & MB',
      'fermi-edu': '📊 Fermi-Dirac Educacional',
      dos: 'Densidade de Estados',
      'dos-edu': '📊 DOS Educacional',
      arrhenius: 'n(T) Arrhenius',
      junction: '⚡ Junção PN',
      transistorTech: '🔬 Tecnologias de Transistores',
      fetTypes: '🧪 Tipos de Transistores FET',
      czochralski: '🔬 Métodos de Crescimento',
      perovskites: '☀️ Perovskites 2D',
      formulas: '📐 Fórmulas & Símbolos',
      exercises: '📝 Exercícios',
      periodic: '⚛️ Tabela Periódica',
      about: '👤 Sobre',
      community: '🤝 Colabore no GitHub',
      community_title: 'Participe das discussões no GitHub — requer conta para colaborar'
    }
  },
  controlPanel: {
    title: '⚙️ Parâmetros do Sistema'
  },
  controls: {
    material: 'Material',
    dopingType: 'Tipo de Dopagem',
    intrinsic: 'Intrínseco',
    ntype: 'Tipo-n (P)',
    ptype: 'Tipo-p (B)',
    temperature: 'Temperatura',
    donorConcentration: 'N_D (Fósforo)',
    acceptorConcentration: 'N_A (Boro)',
    manualFermi: 'Manualizar E_F (eV)'
  },
  carrierPanel: {
    title: 'Valores numéricos calculados',
    material: 'Material',
    hint: 'Observe que {formula} é mantido (lei de ação de massas) qualquer que seja a dopagem, desde que o semicondutor permaneça não-degenerado (E_F a pelo menos 3kT das bordas das bandas).'
  },
  common: {
    back: 'Voltar',
    next: 'Próximo',
    previous: 'Anterior',
    close: 'Fechar',
    loading: 'Carregando...',
    error: 'Erro',
    search: 'Buscar',
    more: 'Mais',
    less: 'Menos',
    showMore: 'Mostrar mais',
    showLess: 'Mostrar menos',
    goTo: 'Ir para'
  },
  learningObjectives: {
    title: 'Roteiro de Estudo — 8 competências a desenvolver',
    intro: 'Após explorar este sistema, você deve conseguir discutir cada um dos itens abaixo. Use os botões para ir direto à aba que demonstra cada conceito.',
    selfAssessment: 'Auto-avaliação:',
    selfAssessmentBody: 'tente formular em voz alta uma resposta de 2-3 frases para cada item antes de consultar a aba. Se conseguir explicar todos, você dominou os fundamentos da teoria de bandas em semicondutores.',
    items: {
      q1: {
        title: 'Discutir bandas permitidas e proibidas, qualitativa e rigorosamente (Kronig-Penney)',
        hints: [
          'Qualitativo: aproxime os átomos no painel "Átomos → Bandas" e veja como os níveis se desdobram.',
          'Rigoroso: na aba "Kronig-Penney" varie P e veja a equação P·sin(αa)/(αa) + cos(αa) = cos(ka) gerar bandas onde |LHS| ≤ 1.',
          'Em "Bandas Permitidas/Proibidas" observe a estrutura completa do cristal com bandas de núcleo, BV, gap e BC.'
        ]
      },
      q2: {
        title: 'Discutir a separação dos níveis de energia no Silício',
        hints: [
          'Mova o slider r de 1 (átomos isolados) para 0 (cristal). Os níveis 3s e 3p se desdobram primeiro.',
          'Aumente N para ver que com 10²³ átomos o desdobramento é virtualmente contínuo.',
          'O gap E_g ≈ 1.12 eV emerge entre o topo da banda originária do 3s e a base da BC originária do 3p.'
        ]
      },
      q3: {
        title: 'Definir massa efetiva a partir do diagrama E×k e seu significado para o movimento',
        hints: [
          '1/m* = (1/ℏ²)(d²E/dk²): é o inverso da curvatura da banda no extremo.',
          'Em "Massa Efetiva" aplique uma força F e veja a partícula livre (m₀) e a do cristal (m*) acelerarem diferente.',
          'Em "Espaço-k" troque entre Si e GaAs: GaAs tem m*_n = 0.067 m₀ → elétrons muito mais "leves" e rápidos.'
        ]
      },
      q4: {
        title: 'Discutir o conceito de lacuna (hole)',
        hints: [
          'Em "Elétron × Lacuna": carga +q, massa efetiva m*_p > 0, vive no topo da BV.',
          'A lacuna obedece F = m*_p · a com carga +q porque a massa é definida por m*_p = −ℏ²/(d²E/dk²) com d²E/dk² < 0 no topo da BV.',
          'Na "Rede Cristalina" tipo-p, observe o estado vazio na ligação que falta um elétron quando boro substitui Si.'
        ]
      },
      q5: {
        title: 'Discutir características de gaps direto vs indireto',
        hints: [
          'Em "Espaço-k" troque o material:',
          '• GaAs (gap direto, Γ): mínimo da BC e máximo da BV no mesmo k. Transição radiativa por fóton apenas → bom para LEDs e lasers.',
          '• Si/Ge (gap indireto): mínimo da BC deslocado em k. Transição precisa de fóton + fônon → emissão luminosa ineficiente.'
        ]
      },
      q6: {
        title: 'Diferenciar metal × isolante × semicondutor pelas bandas de energia',
        hints: [
          'Em "Metal × Isolante × Semicondutor":',
          '• Metal: E_F dentro de uma banda permitida → estados vazios imediatamente acessíveis.',
          '• Semicondutor: gap pequeno (~1 eV), σ ↑ com T (excitação térmica gera portadores).',
          '• Isolante: gap grande (>5 eV), σ desprezível mesmo a 300 K.'
        ]
      },
      q7: {
        title: 'Definir e calcular a função densidade de estados g(E)',
        hints: [
          'Modelo: poço infinito 3D ⇒ E = ℏ²π²(n_x²+n_y²+n_z²)/(2mL²).',
          'Em "Densidade de Estados" o painel QuantumWell3D mostra os estados como pontos discretos no espaço-k; aumente o raio da esfera de Fermi e compare a contagem discreta com a previsão contínua.',
          'Resultado: g(E) = (1/2π²)(2m*/ℏ²)^(3/2) √(E−E_c) para a BC.'
        ]
      },
      q8: {
        title: 'Compreender a distribuição de Fermi-Dirac e a energia de Fermi',
        hints: [
          'f(E) = 1 / [1 + exp((E−E_F)/k_BT)] dá a probabilidade de um estado de energia E estar ocupado.',
          'Em T = 0 K: f é um degrau perfeito em E_F. Em T > 0: transição suave de largura ~ k_BT.',
          'E_F é o potencial químico dos elétrons. Em um metal está dentro da banda; em semicondutor intrínseco fica perto do midgap.',
          'Para |E − E_F| ≫ k_BT, f(E) ≈ exp(−(E−E_F)/k_BT) — limite de Maxwell-Boltzmann.'
        ]
      }
    }
  },
  questions: {
    title: '❓ Questões — auto-avaliação',
    modeOne: '📇 Uma por vez',
    modeAll: '📋 Todas',
    stats: {
      pending: 'pendentes',
      reset: '♻️ Reiniciar',
      resetTitle: 'Reiniciar tudo'
    },
    progress: 'Questão {current} de {total}',
    nav: {
      previous: '← Anterior',
      next: 'Próxima →'
    },
    card: {
      prompt1: '1. Tente formular sua resposta mentalmente em 30 segundos.',
      prompt2: '2. Liste os principais pontos que você incluiria.',
      prompt3: '3. Quando estiver pronto, clique abaixo para conferir.',
      show: '👁️ Mostrar resposta',
      hide: '🔁 Esconder',
      modelAnswer: 'Resposta-modelo:',
      keyPoints: 'Pontos-chave:',
      demos: 'Demonstrações:',
      score: 'Como você se saiu?',
      scoreOk: '✅ Acertei',
      scoreNo: '❌ Errei / parcial'
    },
    usage: {
      title: 'Como usar:',
      body: 'tente formular a resposta antes de revelar. Use a auto-avaliação para identificar os pontos fracos. Reveja o conceito na aba'
    }
  },
  about: {
    title: '👤 Sobre',
    tabs: {
      author: '👤 Autor',
      bibliography: '📚 Bibliografia'
    },
    section: {
      about: 'Sobre o projeto',
      author: 'Autor',
      contribute: 'Contribua — críticas e sugestões via Pull Request',
      repository: 'Repositório'
    },
    project: {
      p1body: 'Este projeto visa facilitar o aprendizado da Física dos Semicondutores e será continuamente ampliado conforme meu próprio avanço nos estudos. Foi construído usando Claude Opus 4.7 como par de programação, com SWE-1.6 para ajustes de menor complexidade, com base nas leituras que tenho feito do livro Semiconductor Physics and Devices de Donald A. Neamen, complementadas pela coleção Modular Series on Solid State Devices (Robert F. Pierret et al.).',
      p2body: 'Este é um projeto sem fins lucrativos que faz parte da rede de sites do Basicão da Eletrônica, dedicada a disseminar conhecimento de eletrônica de forma acessível e gratuita.'
    },
    authorInfo: {
      name: 'Nome:',
      email: 'E-mail:',
      whatsapp: 'WhatsApp:',
      community: 'Comunidade WhatsApp — Física dos Semicondutores:',
      joinGroup: 'Entrar no grupo',
      linkedin: 'LinkedIn:',
      github: 'GitHub:',
      twitter: 'X (Twitter):'
    },
    pr: {
      heading: '🎯 Mensagem essencial:',
      body: 'a melhor forma de criticar, sugerir, corrigir ou aprimorar este projeto é abrindo um Pull Request. Sua contribuição é sempre bem-vinda, seja uma vírgula numa explicação ou um capítulo inteiro de novas visualizações. Mesmo que a PR não seja aceita exatamente como está, ela abre uma discussão valiosa que costuma evoluir para algo incorporado ao projeto.',
      openPR: '🚀 Abrir Pull Request',
      guide: '📖 Guia de Contribuição (CONTRIBUTING.md)',
      openIssue: '🐛 Abrir Issue'
    },
    windsurf: {
      heading: '🌊 Use o Windsurf — o projeto já está preparado',
      p1: 'Recomendo fortemente o Windsurf como editor para contribuir. O projeto contém regras de codificação em .windsurf/rules/ que o editor aplica automaticamente: padrão de logging (PDCL), formatação de markdown, estrutura de componentes — tudo já configurado. Há também workflows pré-prontos em .windsurf/workflows/ (ex.: /pdcl) que automatizam tarefas comuns. O agente Cascade entende a metodologia PDCL (Plan, Do, Check, Loop) adotada aqui e orienta naturalmente novas implementações dentro desse fluxo.',
      p2: 'Se preferir VS Code, Cursor ou outro editor, tudo funciona — apenas observe manualmente as regras descritas em .windsurf/rules/.'
    },
    hook: {
      heading: '⚙️ Hook pre-commit — documentação padronizada automaticamente',
      body: 'Há um script automático em scripts/markdown_history_manager.py, ativado por .git/hooks/pre-commit. A cada commit que envolva arquivos .md, ele detecta autor e data, e adiciona uma entrada no Histórico de Alterações seguindo o padrão definido em .windsurf/rules/documentacao.md.',
      useAlways: 'Use sempre — é o que mantém a documentação rastreável e padronizada.'
    },
    biblio: {
      heading: 'Bibliografia recomendada',
      intro: 'Lista organizada com {count} títulos. Os dois primeiros são as referências principais usadas na construção deste sistema; os demais complementam a teoria de bandas, dispositivos e física do estado sólido. Cada item tem link para a Amazon (busca ou produto direto).',
      mainRefs: '📌 Referências principais do projeto',
      supplementary: '📚 Bibliografia complementar',
      amazonBtn: '🛒 Amazon',
      amazonTitle: 'Comprar/buscar na Amazon',
      note: 'Nota:',
      noteBody: 'alguns links direcionam para uma página de produto específica quando disponível na Amazon Brasil; outros levam à busca pelo título/autor, retornando a edição mais próxima disponível. Edições antigas podem estar esgotadas — busque também sebos virtuais, bibliotecas universitárias e plataformas como Z-Library, IEEE Xplore e Google Books.'
    }
  },
  glossary: {
    title: '📚 Glossário',
    searchPlaceholder: 'Buscar termo ou definição...',
    noResults: 'Nenhum termo encontrado',
    categories: {
      all: 'Todos',
      physics: 'Física',
      materials: 'Materiais',
      devices: 'Dispositivos',
      technology: 'Tecnologia'
    }
  }
};
