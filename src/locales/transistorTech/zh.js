// 简体中文 — “晶体管制造技术”面板
const ui = {
  title: '🔬 晶体管制造技术',
  intro: '探索半导体制造技术从 10nm 到 1.6nm 的演进。比较晶体管的尺寸，理解微缩如何影响性能。',
  controls: {
    play: '▶️ 自动播放',
    pause: '⏸️ 暂停',
    showComparison: '🔍 显示比较',
    hideComparison: '🔍 隐藏比较'
  },
  card: {
    nodeSize: '节点尺寸：',
    gateLength: '栅极长度：',
    pitch: '间距：',
    density: '密度：'
  },
  status: {
    legacy: '传统',
    mature: '成熟',
    current: '当前',
    'cutting-edge': '前沿',
    upcoming: '即将到来',
    future: '未来'
  },
  detail: {
    description: '📋 描述',
    applications: '🏭 应用',
    period: '📅 时期',
    power: '⚡ 能效',
    zoomTitle: '🔍 缩放视图',
    reset: '重置',
    comparisonTitle: '尺度比较',
    biggerThan: '大 {n} 倍',
    parallelTitle: '📊 所有技术的并行视图'
  },
  units: { nm: 'nm', um: 'µm' },
  comparison: {
    hair: '人类头发',
    cell: '人体细胞',
    bacteria: 'E. coli 细菌',
    virus: '病毒',
    dna: 'DNA（宽度）',
    silicon: '硅原子'
  },
  info: {
    sectionTitle: '📚 附加信息',
    node: {
      title: '🎯 什么是技术"节点"？',
      body: '节点编号（例如 5nm）历史上指代晶体管栅极长度。如今它更多是制造工艺整体密度与性能的市场指标。'
    },
    finfetGaa: {
      title: '🔬 FinFET 与 GAAFET',
      body: 'FinFET（鳍式场效应晶体管）使用垂直的硅"鳍"。GAAFET（全环栅极）从所有方向包覆沟道，提供更佳控制和更低漏电。'
    },
    euv: {
      title: '⚡ EUV 光刻',
      body: '极紫外光刻使用 13.5nm 光源以打印极小的图形。对 7nm 以下节点必不可少，已取代 193nm 浸没式光刻。'
    },
    moore: {
      title: '📈 摩尔定律',
      body: '摩尔定律预测晶体管数量每 2 年翻一倍。持续的微缩（10nm → 7nm → 5nm → 3nm → 2nm → 1.6nm）尽管面临日益增长的物理挑战，仍然延续了这一趋势。'
    }
  }
};

const catalog = {
  '10nm': {
    name: '10 纳米',
    description: '广泛用于较旧的台式机与笔记本电脑。生产规模 FinFET 的第一代。',
    applications: 'Intel Kaby/Coffee Lake 处理器，AMD Ryzen 1000/2000',
    year: '2016-2017',
    density: '37.5 MTr/mm²',
    power: '相比 14nm 能效显著提升'
  },
  '7nm': {
    name: '7 纳米',
    description: '在前几代智能手机处理器和高性能计算中非常常见。引入 EUV（极紫外）。',
    applications: 'Apple A13/A14、AMD Ryzen 3000/4000/5000、Snapdragon 865/888',
    year: '2018-2020',
    density: '96.5 MTr/mm²',
    power: '比 10nm 节能 40%'
  },
  '5nm': {
    name: '5 纳米',
    description: '2022-2024 高端设备的标准。大批量 EUV。更密集、更高效的晶体管。',
    applications: 'Apple A15/A16、M1/M2/M3、Snapdragon 8 Gen 1/2/3、Ryzen 6000/7000',
    year: '2020-2022',
    density: '171.3 MTr/mm²',
    power: '比 7nm 节能 30%'
  },
  '3nm': {
    name: '3 纳米',
    description: '目前由 TSMC 和 Samsung 大规模生产。Apple A17 Pro 及后续产品。某些实现采用全环栅极（GAA）。',
    applications: 'Apple A17 Pro、M4、Snapdragon 8 Gen 4、未来的高性能芯片',
    year: '2023-2024',
    density: '215 MTr/mm²',
    power: '比 5nm 节能 35%'
  },
  '2nm': {
    name: '2 纳米',
    description: '下一次重大技术飞跃。预计 2025-2026 年大规模量产。GAAFET（全环栅极）提供更高密度与效率。',
    applications: '未来 Apple、AMD、NVIDIA 处理器（预期）',
    year: '2025-2026（预期）',
    density: '>500 MTr/mm²（估算）',
    power: '比 3nm 节能 25-30%'
  },
  a16: {
    name: '1.6nm（A16）',
    description: '采用纳米片架构和"Super Power Rail"的 TSMC A16。预计 2026 年量产。Nanosheet 晶体管以获得最大控制力。',
    applications: '未来超高性能芯片（预期）',
    year: '2026（预期）',
    density: '>800 MTr/mm²（估算）',
    power: '比 2nm 节能 20-25%'
  }
};

export default { ui, catalog };
