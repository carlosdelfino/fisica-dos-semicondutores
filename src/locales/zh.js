import fetTypes from './fetTypes/zh.js';
import transistorTech from './transistorTech/zh.js';

export default {
  fetTypes,
  transistorTech,
  meta: {
    code: 'zh',
    name: 'Chinese (Mandarin)',
    nativeName: '中文',
    dir: 'ltr',
    flag: '🇨🇳'
  },
  header: {
    title: '学习半导体物理',
    subtitle: '教育模拟器 - 传播科学与高等物理',
    visitors: '访客'
  },
  footer: {
    model: '物理模型：抛物线能带近似；在冻结温度之上掺杂剂完全电离；非简并半导体。Eg(T) 使用 Varshni 公式。采用国际单位制常数。',
    nonprofit: '非营利项目',
    partOf: '属于',
    network: 'Basicão da Eletrônica 网站网络',
    copyright: '教育 CC BY-SA 4.0 · React + SVG + KaTeX'
  },
  menu: {
    categories: {
      learning: '📚 学习',
      fundamentals: '🔬 基础',
      bandStructure: '⚛️ 能带结构',
      quantumStatistics: '📊 量子统计',
      devices: '⚡ 器件',
      reference: '📐 参考'
    },
    items: {
      objectives: '🎯 学习路线',
      conceptsQ: '📖 题目概念',
      questions: '❓ 习题',
      glossary: '📚 术语表',
      overview: '概览',
      lattice: '晶格',
      'crystal-structures': '💎 晶体结构',
      atomband: '原子 → 能带',
      allowed: '允许/禁带',
      kp: '克勒尼希-彭尼',
      mis: '金属 × 绝缘体 × 半导体',
      kspace: 'k 空间（Si × GaAs）',
      effmass: '有效质量',
      particles: '电子 × 空穴',
      fermi: '费米-狄拉克 与 MB',
      'fermi-edu': '📊 费米-狄拉克 教育',
      dos: '态密度',
      'dos-edu': '📊 DOS 教育',
      arrhenius: 'n(T) 阿伦尼乌斯',
      junction: '⚡ PN 结',
      transistorTech: '🔬 晶体管技术',
      fetTypes: '🧪 FET 晶体管类型',
      czochralski: '🔬 晶体生长方法',
      perovskites: '☀️ 二维钙钛矿',
      exercises: '📝 练习与公式',
      periodic: '⚛️ 元素周期表',
      about: '👤 关于',
      'support-us': '💖 支持我们',
      community: '🤝 在 GitHub 上协作',
      community_title: '加入 GitHub 讨论论坛 — 需要 GitHub 账号才能参与协作'
    }
  },
  controlPanel: {
    title: '⚙️ 系统参数'
  },
  controls: {
    material: '材料',
    dopingType: '掺杂类型',
    intrinsic: '本征',
    ntype: 'n 型（P）',
    ptype: 'p 型（B）',
    temperature: '温度',
    donorConcentration: 'N_D（磷）',
    acceptorConcentration: 'N_A（硼）',
    manualFermi: '手动设置 E_F (eV)'
  },
  carrierPanel: {
    title: '计算得到的数值',
    material: '材料',
    hint: '请注意，无论掺杂如何，只要半导体保持非简并（E_F 距能带边缘至少 3kT），{formula} 都会保持（质量作用定律）。'
  },
  common: {
    back: '返回',
    next: '下一个',
    previous: '上一个',
    close: '关闭',
    loading: '加载中...',
    error: '错误',
    search: '搜索',
    more: '更多',
    less: '更少',
    showMore: '显示更多',
    showLess: '显示更少',
    goTo: '前往'
  },
  learningObjectives: {
    title: '学习路线 — 需掌握的 8 项能力',
    intro: '探索完本系统后,您应能讨论以下每一项。请使用按钮直接跳转到演示相应概念的标签页。',
    selfAssessment: '自我评估:',
    selfAssessmentBody: '在查阅标签页之前,尝试为每一项大声说出 2-3 句话的答案。如果都能解释清楚,您就已掌握半导体能带理论的基础。',
    items: {
      q1: {
        title: '定性并严格讨论允许带与禁带(Kronig-Penney)',
        hints: [
          '定性:在"原子 → 能带"面板中拉近原子,观察能级如何分裂。',
          '严格:在"Kronig-Penney"标签中改变 P,观察方程 P·sin(αa)/(αa) + cos(αa) = cos(ka) 在 |LHS| ≤ 1 处生成能带。',
          '在"允许/禁带"中观察晶体的完整结构:芯能带、价带、禁带与导带。'
        ]
      },
      q2: {
        title: '讨论硅中能级的分裂',
        hints: [
          '将滑块 r 从 1(孤立原子)移动到 0(晶体)。3s 和 3p 能级首先分裂。',
          '增加 N,观察到 10²³ 个原子时分裂实际上是连续的。',
          '禁带 E_g ≈ 1.12 eV 出现在源自 3s 的能带顶端与源自 3p 的导带底之间。'
        ]
      },
      q3: {
        title: '从 E×k 图定义有效质量及其运动意义',
        hints: [
          '1/m* = (1/ℏ²)(d²E/dk²):极值处能带曲率的倒数。',
          '在"有效质量"中施加力 F,观察自由粒子(m₀)与晶体粒子(m*)加速度不同。',
          '在"k 空间"中切换 Si 和 GaAs:GaAs 的 m*_n = 0.067 m₀ → 电子更"轻"且更快。'
        ]
      },
      q4: {
        title: '讨论空穴的概念',
        hints: [
          '在"电子 × 空穴":电荷 +q,有效质量 m*_p > 0,位于价带顶。',
          '空穴遵循 F = m*_p · a 且电荷为 +q,因为质量由 m*_p = −ℏ²/(d²E/dk²) 定义,价带顶处 d²E/dk² < 0。',
          '在 p 型"晶格"中,观察硼取代 Si 时键中缺少一个电子的空态。'
        ]
      },
      q5: {
        title: '讨论直接带隙与间接带隙的特征',
        hints: [
          '在"k 空间"切换材料:',
          '• GaAs(直接带隙,Γ):导带底和价带顶位于同一 k。仅通过光子辐射跃迁 → 适合 LED 和激光器。',
          '• Si/Ge(间接带隙):导带底在 k 方向移位。跃迁需要光子 + 声子 → 发光效率低下。'
        ]
      },
      q6: {
        title: '通过能带区分金属 × 绝缘体 × 半导体',
        hints: [
          '在"金属 × 绝缘体 × 半导体":',
          '• 金属:E_F 位于允许带内 → 空态立即可用。',
          '• 半导体:带隙小(~1 eV),σ 随 T 升高(热激发产生载流子)。',
          '• 绝缘体:带隙大(>5 eV),即使在 300 K 下 σ 也可忽略。'
        ]
      },
      q7: {
        title: '定义并计算态密度函数 g(E)',
        hints: [
          '模型:三维无限深势阱 ⇒ E = ℏ²π²(n_x²+n_y²+n_z²)/(2mL²)。',
          '在"态密度"中,QuantumWell3D 面板将态显示为 k 空间中的离散点;增大费米球半径,比较离散计数与连续预测。',
          '结果:导带的 g(E) = (1/2π²)(2m*/ℏ²)^(3/2) √(E−E_c)。'
        ]
      },
      q8: {
        title: '理解费米-狄拉克分布和费米能量',
        hints: [
          'f(E) = 1 / [1 + exp((E−E_F)/k_BT)] 给出能量为 E 的态被占据的概率。',
          'T = 0 K 时:f 在 E_F 处是完美的阶跃。T > 0 时:宽度约为 k_BT 的平滑过渡。',
          'E_F 是电子的化学势。金属中位于能带内部;本征半导体中位于中间带隙附近。',
          '当 |E − E_F| ≫ k_BT 时,f(E) ≈ exp(−(E−E_F)/k_BT) — 麦克斯韦-玻尔兹曼极限。'
        ]
      }
    }
  },
  questions: {
    title: '❓ 习题 — 自我评估',
    modeOne: '📇 逐题',
    modeAll: '📋 全部',
    stats: {
      pending: '待完成',
      reset: '♻️ 重置',
      resetTitle: '全部重置'
    },
    progress: '第 {current} / {total} 题',
    nav: {
      previous: '← 上一题',
      next: '下一题 →'
    },
    card: {
      prompt1: '1. 请尝试在 30 秒内心中构思答案。',
      prompt2: '2. 列出您将包含的主要要点。',
      prompt3: '3. 准备好后,点击下方核对。',
      show: '👁️ 显示答案',
      hide: '🔁 隐藏',
      modelAnswer: '参考答案:',
      keyPoints: '要点:',
      demos: '演示:',
      score: '您答得如何?',
      scoreOk: '✅ 答对',
      scoreNo: '❌ 答错 / 部分'
    },
    usage: {
      title: '使用方法:',
      body: '在揭示答案前先尝试作答。使用自我评估识别薄弱点。请在以下标签页中复习概念'
    }
  },
  about: {
    title: '👤 关于',
    tabs: {
      author: '👤 作者',
      bibliography: '📚 参考文献'
    },
    section: {
      about: '关于本项目',
      author: '作者',
      contribute: '贡献 — 通过 Pull Request 提供批评与建议',
      repository: '代码仓库'
    },
    project: {
      p1body: '本项目旨在帮助学习半导体物理,并将随我自身学习进展持续扩充。它使用 Claude Opus 4.7 作为结对编程伙伴,并用 SWE-1.6 进行较小的调整,基于 Donald A. Neamen 所著《Semiconductor Physics and Devices》的阅读构建,辅以 Modular Series on Solid State Devices(Robert F. Pierret 等)系列。',
      p2body: '这是一个非营利项目,是 Basicão da Eletrônica 网站网络的一部分,致力于以易于获取且免费的方式传播电子学知识。'
    },
    authorInfo: {
      name: '姓名:',
      email: '邮箱:',
      whatsapp: 'WhatsApp:',
      community: 'WhatsApp 社区 — 半导体物理:',
      joinGroup: '加入群组',
      linkedin: 'LinkedIn:',
      github: 'GitHub:',
      twitter: 'X (Twitter):'
    },
    pr: {
      heading: '🎯 核心信息:',
      body: '批评、建议、修正或改进本项目的最佳方式是提交 Pull Request。无论是一个解释中的逗号,还是一整章新的可视化,您的贡献永远受欢迎。即便 PR 未被原封不动地接受,它也会开启一段有价值的讨论,通常会演变为项目中新的内容。',
      openPR: '🚀 提交 Pull Request',
      guide: '📖 贡献指南 (CONTRIBUTING.md)',
      openIssue: '🐛 提交 Issue'
    },
    windsurf: {
      heading: '🌊 使用 Windsurf — 项目已就绪',
      p1: '强烈建议使用 Windsurf 作为贡献编辑器。项目在 .windsurf/rules/ 中包含编码规则,编辑器会自动应用:日志规范(PDCL)、markdown 格式、组件结构 — 均已配置完成。.windsurf/workflows/ 中还有现成的工作流(如 /pdcl)可自动化常见任务。Cascade 代理理解此处采用的 PDCL 方法论(Plan, Do, Check, Loop),并自然地在该流程中指导新实现。',
      p2: '如果您偏好 VS Code、Cursor 或其他编辑器,一切也能正常工作 — 只需手动遵循 .windsurf/rules/ 中描述的规则。'
    },
    hook: {
      heading: '⚙️ pre-commit Hook — 自动标准化文档',
      body: 'scripts/markdown_history_manager.py 中有一个自动脚本,由 .git/hooks/pre-commit 激活。每次涉及 .md 文件的 commit,它都会检测作者和日期,并按照 .windsurf/rules/documentacao.md 中定义的规范在变更历史中添加一条记录。',
      useAlways: '请始终使用 — 这能让文档保持可追踪且标准化。'
    },
    biblio: {
      heading: '推荐参考文献',
      intro: '共 {count} 本有组织的书目。前两本是构建本系统的主要参考;其余补充能带理论、器件和固体物理。每项都附有 Amazon 链接(搜索或直达产品)。',
      mainRefs: '📌 项目主要参考',
      supplementary: '📚 补充文献',
      amazonBtn: '🛒 Amazon',
      amazonTitle: '在 Amazon 上购买/搜索',
      note: '注:',
      noteBody: '部分链接在 Amazon 巴西有货时直接跳转到产品页;其他则跳转到按书名/作者搜索,返回最接近可得版本。旧版可能已绝版 — 也可在二手书店、大学图书馆及 Z-Library、IEEE Xplore、Google Books 等平台查找。'
    }
  },
  glossary: {
    title: '📚 术语表',
    searchPlaceholder: '搜索术语或定义...',
    noResults: '未找到术语',
    categories: {
      all: '全部',
      physics: '物理',
      materials: '材料',
      devices: '器件',
      technology: '技术'
    }
  },
  support: {
    title: '💖 支持我们',
    tabs: {
      about: '👤 关于',
      donation: '💰 捐赠'
    },
    about: {
      title: '关于本项目',
      p1: '这是一个非营利教育倡议,旨在以易于获取和免费的方式传播半导体物理知识。',
      p2: '开发和维护此平台需要时间、资源和奉献。您的贡献有助于保持项目的活跃并扩展其内容。',
      p3: '所有捐赠用于支付托管费用、开发新功能和持续改进系统。',
      highlight: '让我们共同努力,使物理和工程教育对每个人都更容易获得!',
      howToHelp: '您可以通过以下方式提供帮助:',
      codeContribution: '通过 GitHub Pull Requests 贡献代码',
      documentation: '改进文档和翻译',
      translation: '将内容翻译成其他语言',
      reporting: '报告错误并提出改进建议',
      financial: '提供财务捐赠以支持项目'
    },
    donation: {
      title: '进行捐赠',
      intro: '选择您偏好的贡献方式。任何金额都受欢迎并能产生差异!',
      pixScan: '扫描二维码',
      pixKey: 'PIX 密钥',
      pixNote: '使用上面的密钥或使用银行应用程序扫描二维码',
      crypto: '加密货币',
      copy: '复制',
      viewExplorer: '在浏览器中查看',
      disclaimer: '重要提示',
      disclaimerText: '捐赠是自愿且不可退还的。通过捐赠,您正在支持一个非营利教育项目。如有疑问,请联系我们。'
    },
    wallet: {
      title: '通过钱包捐赠',
      connectDescription: '连接您的加密钱包(MetaMask、WalletConnect 等)以直接捐赠。',
      connecting: '连接中...',
      connectButton: '🦊 连接 MetaMask',
      wallet: '钱包',
      network: '网络',
      ethereumMainnet: '以太坊主网',
      sepoliaTestnet: 'Sepolia 测试网',
      chainId: '链 ID',
      switchNetwork: '切换到以太坊主网',
      crypto: '加密货币',
      addressOnly: '仅地址',
      amount: '金额',
      suggestedAmounts: '建议金额',
      donateButton: '💖 立即捐赠',
      processing: '处理中...',
      transactionSent: '交易已发送',
      addressDescription: '对于 {{crypto}} 捐赠,请使用以下地址:',
      disconnect: '断开连接',
      copy: '复制'
    }
  }
};
