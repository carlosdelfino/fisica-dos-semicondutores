// English (UK) translation — "Transistor Manufacturing Technologies" panel
const ui = {
  title: '🔬 Transistor Manufacturing Technologies',
  intro: 'Explore the evolution of semiconductor manufacturing technologies, from 10nm to 1.6nm. Compare transistor dimensions and understand how miniaturisation impacts performance.',
  controls: {
    play: '▶️ Auto-play',
    pause: '⏸️ Pause',
    showComparison: '🔍 Show comparison',
    hideComparison: '🔍 Hide comparison'
  },
  card: {
    nodeSize: 'Node size:',
    gateLength: 'Gate length:',
    pitch: 'Pitch:',
    density: 'Density:'
  },
  status: {
    legacy: 'Legacy',
    mature: 'Mature',
    current: 'Current',
    'cutting-edge': 'Cutting-edge',
    upcoming: 'Upcoming',
    future: 'Future'
  },
  detail: {
    description: '📋 Description',
    applications: '🏭 Applications',
    period: '📅 Period',
    power: '⚡ Power efficiency',
    zoomTitle: '🔍 Zoom view',
    reset: 'Reset',
    comparisonTitle: 'Scale comparison',
    biggerThan: '{n}× bigger',
    parallelTitle: '📊 Parallel view of all technologies'
  },
  units: { nm: 'nm', um: 'µm' },
  comparison: {
    hair: 'Human hair',
    cell: 'Human cell',
    bacteria: 'E. coli bacterium',
    virus: 'Virus',
    dna: 'DNA (width)',
    silicon: 'Silicon atom'
  },
  info: {
    sectionTitle: '📚 Additional information',
    node: {
      title: '🎯 What is a technology "node"?',
      body: 'The node number (e.g. 5nm) historically referred to the transistor gate length. Today it is mainly a marketing indicator of the overall density and performance of the manufacturing process.'
    },
    finfetGaa: {
      title: '🔬 FinFET vs GAAFET',
      body: 'FinFET (Fin Field-Effect Transistor) uses a vertical silicon "fin". GAAFET (Gate-All-Around) wraps the channel with the gate on all sides, giving better control and lower leakage.'
    },
    euv: {
      title: '⚡ EUV lithography',
      body: 'Extreme Ultraviolet Lithography uses 13.5nm light to print extremely small patterns. Essential for nodes below 7nm. It replaced 193nm immersion lithography.'
    },
    moore: {
      title: '📈 Moore\'s law',
      body: "Moore's law predicted that the number of transistors would double every 2 years. Continued miniaturisation (10nm → 7nm → 5nm → 3nm → 2nm → 1.6nm) keeps this trend going, despite growing physical challenges."
    }
  }
};

const catalog = {
  '10nm': {
    name: '10 Nanometres',
    description: 'Widely used in older computers and laptops. First generation of production-scale FinFET.',
    applications: 'Intel Kaby/Coffee Lake processors, AMD Ryzen 1000/2000',
    year: '2016-2017',
    density: '37.5 MTr/mm²',
    power: 'Significant energy-efficiency improvement vs 14nm'
  },
  '7nm': {
    name: '7 Nanometres',
    description: 'Very common in earlier-generation smartphone processors and high-performance computing. EUV (Extreme Ultraviolet) introduced.',
    applications: 'Apple A13/A14, AMD Ryzen 3000/4000/5000, Snapdragon 865/888',
    year: '2018-2020',
    density: '96.5 MTr/mm²',
    power: '40% more efficient than 10nm'
  },
  '5nm': {
    name: '5 Nanometres',
    description: 'Standard in premium devices from 2022-2024. High-volume EUV. Denser, more efficient transistors.',
    applications: 'Apple A15/A16, M1/M2/M3, Snapdragon 8 Gen 1/2/3, Ryzen 6000/7000',
    year: '2020-2022',
    density: '171.3 MTr/mm²',
    power: '30% more efficient than 7nm'
  },
  '3nm': {
    name: '3 Nanometres',
    description: 'Currently in mass production at TSMC and Samsung. Apple A17 Pro and successors. Gate-All-Around (GAA) in some implementations.',
    applications: 'Apple A17 Pro, M4, Snapdragon 8 Gen 4, future high-performance chips',
    year: '2023-2024',
    density: '215 MTr/mm²',
    power: '35% more efficient than 5nm'
  },
  '2nm': {
    name: '2 Nanometres',
    description: 'Next major technological leap. Mass production expected for 2025-2026. GAAFET (Gate-All-Around) offers higher density and efficiency.',
    applications: 'Future Apple, AMD, NVIDIA processors (expected)',
    year: '2025-2026 (expected)',
    density: '>500 MTr/mm² (estimated)',
    power: '25-30% more efficient than 3nm'
  },
  a16: {
    name: '1.6nm (A16)',
    description: 'TSMC A16 with nanosheet architecture and "Super Power Rail". Production expected for 2026. Nanosheet transistors for maximum control.',
    applications: 'Future ultra-high-performance chips (expected)',
    year: '2026 (expected)',
    density: '>800 MTr/mm² (estimated)',
    power: '20-25% more efficient than 2nm'
  }
};

export default { ui, catalog };
