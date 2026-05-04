// Tradução PT — Painel "Tecnologias de Fabricação de Transistores"
const ui = {
  title: '🔬 Tecnologias de Fabricação de Transistores',
  intro: 'Explore a evolução das tecnologias de fabricação de semicondutores, do 10nm ao 1.6nm. Compare as dimensões dos transistores e entenda como a miniaturização impacta a performance.',
  controls: {
    play: '▶️ Auto-play',
    pause: '⏸️ Pausar',
    showComparison: '🔍 Mostrar Comparação',
    hideComparison: '🔍 Ocultar Comparação'
  },
  card: {
    nodeSize: 'Tamanho do Nó:',
    gateLength: 'Comprimento de Gate:',
    pitch: 'Pitch:',
    density: 'Densidade:'
  },
  status: {
    legacy: 'Legado',
    mature: 'Maduro',
    current: 'Atual',
    'cutting-edge': 'Avançado',
    upcoming: 'Próximo',
    future: 'Futuro'
  },
  detail: {
    description: '📋 Descrição',
    applications: '🏭 Aplicações',
    period: '📅 Período',
    power: '⚡ Eficiência Energética',
    zoomTitle: '🔍 Visualização com Zoom',
    reset: 'Reset',
    comparisonTitle: 'Comparação de Escala',
    biggerThan: '{n}x maior',
    parallelTitle: '📊 Visão Paralela de Todas as Tecnologias'
  },
  units: { nm: 'nm', um: 'µm' },
  comparison: {
    hair: 'Cabelo Humano',
    cell: 'Célula Humana',
    bacteria: 'Bactéria E. coli',
    virus: 'Vírus',
    dna: 'DNA (largura)',
    silicon: 'Átomo de Silício'
  },
  info: {
    sectionTitle: '📚 Informações Adicionais',
    node: {
      title: '🎯 O que é o "Nó" de Tecnologia?',
      body: 'O número do nó (ex: 5nm) historicamente referia-se ao comprimento do gate do transistor. Hoje é mais um indicador de marketing da densidade e performance geral do processo de fabricação.'
    },
    finfetGaa: {
      title: '🔬 FinFET vs GAAFET',
      body: 'FinFET (Fin Field-Effect Transistor) usa uma "barbatana" vertical de silício. GAAFET (Gate-All-Around) envolve o canal com o gate em todos os lados, oferecendo melhor controle e menor leakage.'
    },
    euv: {
      title: '⚡ EUV Lithography',
      body: 'Extreme Ultraviolet Lithography usa luz de 13.5nm para imprimir padrões extremamente pequenos. Essencial para nós abaixo de 7nm. Substituiu a litografia imersa de 193nm.'
    },
    moore: {
      title: '📈 Lei de Moore',
      body: 'A lei de Moore previa que o número de transistores dobraria a cada 2 anos. A miniaturização contínua (10nm → 7nm → 5nm → 3nm → 2nm → 1.6nm) mantém essa tendência, apesar dos crescentes desafios físicos.'
    }
  }
};

const catalog = {
  '10nm': {
    name: '10 Nanômetros',
    description: 'Amplamente utilizado em computadores e laptops mais antigos. Primeira geração de FinFET em escala de produção.',
    applications: 'Processadores Intel Kaby/Coffee Lake, AMD Ryzen 1000/2000',
    year: '2016-2017',
    density: '37.5 MTr/mm²',
    power: 'Melhoria significativa em eficiência energética vs 14nm'
  },
  '7nm': {
    name: '7 Nanômetros',
    description: 'Muito comum em processadores de smartphones de gerações anteriores e computação de alto desempenho. EUV (Extreme Ultraviolet) introduzido.',
    applications: 'Apple A13/A14, AMD Ryzen 3000/4000/5000, Snapdragon 865/888',
    year: '2018-2020',
    density: '96.5 MTr/mm²',
    power: '40% mais eficiente que 10nm'
  },
  '5nm': {
    name: '5 Nanômetros',
    description: 'Padrão em dispositivos premium de 2022-2024. EUV de alta produção. Transistores mais densos e eficientes.',
    applications: 'Apple A15/A16, M1/M2/M3, Snapdragon 8 Gen 1/2/3, Ryzen 6000/7000',
    year: '2020-2022',
    density: '171.3 MTr/mm²',
    power: '30% mais eficiente que 7nm'
  },
  '3nm': {
    name: '3 Nanômetros',
    description: 'Atualmente em produção em massa por TSMC e Samsung. Apple A17 Pro e sucessores. Gate-All-Around (GAA) em algumas implementações.',
    applications: 'Apple A17 Pro, M4, Snapdragon 8 Gen 4, futuros chips de alta performance',
    year: '2023-2024',
    density: '215 MTr/mm²',
    power: '35% mais eficiente que 5nm'
  },
  '2nm': {
    name: '2 Nanômetros',
    description: 'Próximo grande salto tecnológico. Produção em massa prevista para 2025-2026. GAAFET (Gate-All-Around) oferece maior densidade e eficiência.',
    applications: 'Futuros processadores Apple, AMD, NVIDIA (previstos)',
    year: '2025-2026 (previsto)',
    density: '>500 MTr/mm² (estimado)',
    power: '25-30% mais eficiente que 3nm'
  },
  a16: {
    name: '1.6nm (A16)',
    description: 'TSMC A16 com arquitetura de nanofolha e "Super Power Rail". Previsão de produção para 2026. Nanosheet transistors para máximo controle.',
    applications: 'Futuros chips de ultra-alta performance (previstos)',
    year: '2026 (previsto)',
    density: '>800 MTr/mm² (estimado)',
    power: '20-25% mais eficiente que 2nm'
  }
};

export default { ui, catalog };
