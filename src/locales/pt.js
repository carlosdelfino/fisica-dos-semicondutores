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
      quantumAtom: '⚛️ Modelo Atômico Quântico',
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
      exercises: '📝 Exercícios e Fórmulas',
      periodic: '⚛️ Tabela Periódica',
      about: '👤 Sobre',
      'support-us': '💖 Apoie o Projeto',
      community: '🤝 Colabore no GitHub',
      community_title: 'Participe das discussões no GitHub — requer conta para colaborar'
    },
    quantumAtom: '⚛️ Modelo Atômico Quântico'
  },
  quantumAtom: {
    title: 'Modelo Atômico Quântico',
    subtitle: 'A visão moderna do átomo segundo a Mecânica Quântica',
    alt: 'Modelo atômico quântico mostrando núcleo, nuvem eletrônica e orbitais',
    sections: {
      nucleus: {
        title: 'Núcleo Atômico',
        content: 'O núcleo contém prótons (carga positiva) e nêutrons (sem carga), representando a maior parte da massa do átomo. As partículas no núcleo são mantidas juntas pela força nuclear forte.'
      },
      electronCloud: {
        title: 'Nuvem Eletrônica',
        content: 'Diferente do modelo de Bohr, os elétrons não seguem órbitas fixas. Eles são descritos por uma nuvem de probabilidade - regiões onde há maior chance de encontrar o elétron. Esta nuvem é representada pela função de onda ψ(r).'
      },
      orbitals: {
        title: 'Orbitais Atômicos',
        content: 'Orbitais são regiões do espaço onde há alta probabilidade de encontrar um elétron. Cada orbital tem uma forma característica: orbitais s são esféricos, orbitais p têm forma de halter, orbitais d são mais complexos, etc. A forma é determinada pelos números quânticos.'
      },
      waveFunction: {
        title: 'Função de Onda',
        content: 'Elétrons são descritos matematicamente por funções de onda ψ(x,y,z,t). O quadrado da função de onda |ψ|² representa a densidade de probabilidade de encontrar o elétron em uma determinada posição. Esta é a base da interpretação de Born da mecânica quântica.'
      },
      uncertainty: {
        title: 'Princípio da Incerteza',
        content: 'Formulado por Werner Heisenberg, este princípio estabelece que não é possível conhecer simultaneamente com precisão arbitrária a posição e o momento de uma partícula. Δx·Δp ≥ ℏ/2. Isso significa que quanto mais precisamente conhecemos a posição, menos sabemos sobre o momento, e vice-versa.'
      }
    },
    comparison: {
      title: 'Evolução dos Modelos Atômicos',
      rutherford: {
        title: 'Modelo de Rutherford (1911)',
        items: [
          'Átomo como sistema solar: núcleo denso e elétrons orbitando',
          'Descoberta do núcleo atômico através do experimento com partículas alfa',
          'Elétrons em órbitas arbitrárias (sem quantização)',
          'Não explicava estabilidade do átomo (elétrons deveriam cair no núcleo)',
          'Incompatível com espectros atômicos observados'
        ]
      },
      bohr: {
        title: 'Modelo de Bohr (1913)',
        items: [
          'Elétrons em órbitas circulares fixas e quantizadas',
          'Postulou órbitas estáveis sem radiação',
          'Quantização de energia em níveis discretos',
          'Explicava espectro do hidrogênio, mas não átomos com mais de um elétron',
          'Mistura de física clássica e quântica (semi-clássico)'
        ]
      },
      quantum: {
        title: 'Modelo Quântico (1926-presente)',
        items: [
          'Elétrons em nuvem de probabilidade',
          'Posição descrita por distribuição de probabilidade',
          'Quantização através de números quânticos (n, l, m, s)',
          'Explica todos os átomos e moléculas',
          'Consistente com o princípio da incerteza'
        ]
      }
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
  graphs: {
    title: 'Gráfico',
    details: 'Detalhes',
    formula: 'Fórmula',
    description: 'Descrição',
    concepts: 'Conceitos',
    symbols: 'Símbolos',
    symbol: 'Símbolo',
    showDetails: 'Mostrar Detalhes',
    hideDetails: 'Ocultar Detalhes',
    replayAnimation: 'Reproduzir Animação',
    PhotonEnergyGraph: 'Energia do Fóton',
    HeisenbergUncertaintyGraph: 'Princípio da Incerteza',
    DensityOfStatesGraph: 'Densidade de Estados',
    BandStructureGraph: 'Estrutura de Bandas'
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
      repository: 'Repositório',
      network: 'Rede de Sites'
    },
    project: {
      p1body: 'Este projeto visa facilitar o aprendizado da Física dos Semicondutores e será continuamente ampliado conforme meu próprio avanço nos estudos. Foi construído usando Claude Opus 4.7 como par de programação, com SWE-1.6 para ajustes de menor complexidade, com base nas leituras que tenho feito do livro Semiconductor Physics and Devices de Donald A. Neamen, complementadas pela coleção Modular Series on Solid State Devices (Robert F. Pierret et al.).',
      p2body: 'Este é um projeto sem fins lucrativos que faz parte da rede de sites do Basicão da Eletrônica, dedicada a disseminar conhecimento de eletrônica de forma acessível e gratuita.'
    },
    authorInfo: {
      name: 'Nome:',
      website: 'Website:',
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
  },
  support: {
    title: '💖 Apoie o Projeto',
    tabs: {
      about: '👤 Sobre',
      donation: '💰 Doações'
    },
    about: {
      title: 'Sobre o Projeto',
      p1: 'Este projeto é uma iniciativa educacional sem fins lucrativos que visa disseminar conhecimento sobre física dos semicondutores de forma acessível e gratuita.',
      p2: 'O desenvolvimento e manutenção desta plataforma requer tempo, recursos e dedicação. Sua contribuição ajuda a manter o projeto ativo e a expandir seu conteúdo.',
      p3: 'Todas as doações são utilizadas para cobrir custos de hospedagem, desenvolvimento de novos recursos e melhoria contínua do sistema.',
      highlight: 'Juntos, podemos tornar a educação em física e engenharia mais acessível para todos!',
      howToHelp: 'Como você pode ajudar:',
      codeContribution: 'Contribua com código através de Pull Requests no GitHub',
      documentation: 'Melhore a documentação e traduções',
      translation: 'Traduza o conteúdo para outros idiomas',
      reporting: 'Reporte bugs e sugira melhorias',
      financial: 'Faça uma doação financeira para apoiar o projeto'
    },
    donation: {
      title: 'Faça uma Doação',
      intro: 'Escolha o método de contribuição que preferir. Qualquer valor é bem-vindo e faz a diferença!',
      pixScan: 'Escaneie o QR Code',
      pixKey: 'Chave PIX',
      pixNote: 'Use a chave acima ou escaneie o QR Code com seu app bancário',
      crypto: 'Criptomoedas',
      copy: 'Copiar',
      viewExplorer: 'Ver no explorador',
      disclaimer: 'Aviso Importante',
      disclaimerText: 'As doações são voluntárias e não reembolsáveis. Ao fazer uma doação, você está apoiando um projeto educacional sem fins lucrativos. Entre em contato se tiver dúvidas.'
    },
    wallet: {
      title: 'Doar via Wallet (Ethereum)',
      intro: 'Escolha um valor em dólares e doe diretamente pela sua carteira Web3. A transação é assinada por você na sua carteira — nenhum dado pessoal é exibido aqui.',
      privacy: 'Sua privacidade é preservada: não armazenamos nem mostramos endereço, saldo ou rede da sua carteira.',
      chooseAmount: 'Escolha um valor',
      customAmount: 'Outro valor',
      customPlaceholder: 'Digite um valor em USD',
      fetchingRate: 'Obtendo cotação do ETH...',
      donateButton: '💖 Doar agora',
      processing: 'Processando...',
      transactionSent: 'Transação enviada',
      errors: {
        invalidAmount: 'Informe um valor válido em dólares.',
        noWallet: 'Nenhuma carteira Web3 encontrada. Instale o MetaMask ou outra carteira compatível.',
        rate: 'Não foi possível obter a cotação do ETH. Tente novamente em instantes.',
        txFailed: 'Falha ao enviar a transação'
      }
    }
  }
};
