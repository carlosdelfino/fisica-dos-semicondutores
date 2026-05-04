// 简体中文 — “FET 晶体管类型”面板翻译
const ui = {
  title: '🔬 FET 晶体管类型 — 教学面板',
  intro: '探索各种主要类型的场效应晶体管。每个面板展示器件的剖面结构，包含电子和空穴迁移的动画，以及表示电流方向、宽度成正比的箭头。',
  pause: '⏸️ 暂停动画',
  resume: '▶️ 恢复动画',
  legend: { electron: '电子', hole: '空穴', current: '常规电流' },
  sections: {
    operation: '🔎 工作原理',
    advantages: '✅ 优点',
    applications: '🏭 应用领域',
    why: '📍 在哪里以及为什么使用'
  },
  layersTitle: '🧱 各层、材料与掺杂',
  layersIntro: '每一层都有特定的功能；掺杂（类型与浓度）决定势垒、电容、迁移率以及工作电压。',
  layersTable: { layer: '层', material: '材料', doping: '掺杂', role: '功能', impact: '对工作的影响' },
  quickRef: '📚 快速参考',
  info: {
    whatIs: { title: '🎯 什么是 FET？', body: '一种通过施加在栅极的电场调制源极与漏极之间电流的器件，几乎没有栅极电流（高输入阻抗）。' },
    isolation: { title: '⚙️ 栅极隔离原理', body: 'MOSFET/IGBT：氧化物。JFET：PN 结。MESFET：肖特基势垒。HEMT/MODFET：异质结 + 肖特基。' },
    trends: { title: '🚀 发展趋势', body: '逻辑器件：平面 → FinFET → GAAFET/纳米片；功率器件：GaN HEMT 与垂直 SiC；超低功耗：TFET；显示与柔性电子：OFET/TFT。' },
    reading: { title: '📐 如何阅读图示', body: '颜色为示意性：蓝色 = N 型区/电子，橙色 = P 型区/空穴，紫色 = 栅极，黄色 = 氧化层。箭头粗细与器件的典型电流成正比。' }
  }
};

const catalog = {
  mosfet: {
    name: '平面 MOSFET',
    tag: '经典 CMOS',
    summary: '在 P/N 衬底之上具有氧化物隔离的栅极。',
    operation: '当 V_GS > V_TH 时，在半导体表面感应出导电沟道。栅氧化层将控制端在电学上隔离，从而实现高输入阻抗。电流通过沟道在源漏之间横向流动。',
    advantages: '高输入阻抗、成熟的 CMOS 工艺、低静态功耗。',
    applications: '所有数字 CMOS、存储器以及模拟放大器的基础。',
    why: '在 Si 上热生长的氧化物（SiO₂/Si）几乎是完美的：界面态密度低、击穿场强极高。这使得栅极漏电极小，并支撑了支持微处理器与存储产业的大规模微缩。',
    layers: [
      { name: 'P 型衬底（体）', material: '单晶 Si', doping: '轻掺杂，约 1×10¹⁵ cm⁻³（B，受主）', role: '为反型沟道提供体并作为电压参考（衬底）。', impact: '轻掺杂便于形成沟道所需的耗尽区；若过高则 V_TH 增大，且杂质散射降低迁移率。' },
      { name: 'N+ 源/漏', material: '掺杂 Si', doping: '简并，约 1×10²⁰ cm⁻³（As、P，施主）', role: '电子库与低电阻欧姆接触。', impact: '高掺杂保证欧姆接触（无肖特基势垒）并降低串联电阻 R_SD；陡峭结减少短沟道效应。' },
      { name: '栅氧化层（SiO₂）', material: '二氧化硅', doping: '绝缘体（不有意掺杂）', role: '在电学上将栅极与沟道隔离，并耦合栅极的静电场。', impact: '厚度约 1–3 nm 决定电容 C_ox，从而决定 g_m 与 V_TH；若太薄则发生直接隧穿（漏电）。' },
      { name: 'N 反型沟道', material: '反型 Si 层', doping: '由静电感应而非化学掺杂', role: '将电子从源极导向漏极。', impact: '密度 ∝ C_ox·(V_GS−V_TH)；其形成取决于体掺杂与栅极功函数。' },
      { name: '栅极', material: 'N+ 多晶硅（经典）或金属（HKMG）', doping: '多晶 N+ 约 1×10²⁰ cm⁻³ / 金属：未掺杂', role: '沟道控制电极。', impact: '栅极功函数确定 V_TH；多晶硅会出现“多晶耗尽” → 现代工艺采用金属栅 + high-κ。' }
    ]
  },
  finfet: {
    name: 'FinFET',
    tag: '3D，22nm–5nm',
    summary: '垂直硅鳍状沟道，栅极包覆三面。',
    operation: '沟道是一片垂直的硅"鳍"。栅极包覆其三个面，倍增了静电控制力，并降低了短沟道效应（漏电、DIBL）。电流由鳍的三个表面之和构成。',
    advantages: '更好的沟道控制、更低的漏电、单位面积电流高于平面工艺。',
    applications: '从 22nm 到 5nm 的处理器（Intel、TSMC、Samsung）。',
    why: '低于约 22 nm 时，平面 MOSFET 失去静电控制（DIBL、穿通）。将沟道在三面包覆增大了栅—沟道耦合，使摩尔定律得以延续，且 V_DD 与漏电更低。',
    layers: [
      { name: 'P 型体衬底', material: 'Si', doping: '轻掺杂（B，约 10¹⁵）', role: '机械支撑及 STI 隔离。', impact: '电学上影响很小；沟道完全位于鳍中。' },
      { name: '鳍（沟道体）', material: 'Si', doping: '本征或轻掺杂（<10¹⁶）', role: '形成 3D 体，反型出现在三个面上。', impact: '低掺杂鳍 → V_TH 的统计涨落更小、迁移率更高；鳍宽决定静电特性。' },
      { name: 'N+ 源/漏（SiGe:P 或 SiP）', material: '外延 Si:P 或 SiGe', doping: '简并，约 1–3×10²⁰', role: '欧姆接触并诱导机械应变。', impact: '应变外延提高迁移率；高掺杂降低 R_SD。' },
      { name: '界面 SiO₂ + high-κ（HfO₂）', material: '薄 SiO₂ + HfO₂', doping: '绝缘体', role: '低 EOT 的 high-κ 栅介质。', impact: 'high-κ 在保持等效电容的同时降低隧穿；界面层维持 Si/氧化物界面质量。' },
      { name: '金属栅（TiN/TaN + 填充）', material: 'TiN、TaN、W', doping: '未掺杂', role: '具备针对 nMOS/pMOS 调谐功函数的电极。', impact: '金属功函数无需依赖多晶硅掺杂即可设定 V_TH；消除多晶耗尽。' }
    ]
  },
  gaafet: {
    name: 'GAAFET（纳米片）',
    tag: '3nm 及更先进',
    summary: '栅极完全包覆水平纳米片。',
    operation: '若干堆叠的硅纳米片形成并联沟道，栅极在所有面（gate-all-around）将其包覆。静电控制达到最大：关断时栅极完全"夹断"沟道。',
    advantages: '比 FinFET 控制更好、可调有效宽度，理想适配 ≤3nm。',
    applications: 'Samsung 3nm GAA、TSMC N2 及未来世代。',
    why: 'FinFET 在鳍宽约 5 nm 处饱和。GAA 允许堆叠沟道，且片宽可由设计（而不仅是鳍数）调节，提供电流灵活性以及 ≤3 nm 节点所需的理想静电特性。',
    layers: [
      { name: '衬底 + BOX', material: 'Si / 埋层 SiO₂', doping: '隔离', role: '机械基底与沟道隔离。', impact: '减少向衬底的寄生电流。' },
      { name: 'Si 纳米片', material: '在牺牲性 SiGe 上外延的 Si', doping: '本征', role: '由栅极包覆的并联沟道。', impact: '无掺杂消除杂质散射 → 更高 µ；厚度（约 5 nm）决定隧穿与量子效应。' },
      { name: '内侧间隔', material: '低-κ SiN', doping: '绝缘体', role: '在片间将栅与 S/D 分隔。', impact: '降低寄生电容 C_gd 与 C_gs，提升频率性能。' },
      { name: '外延源/漏', material: 'SiP（nMOS）/ SiGe:B（pMOS）', doping: '约 1×10²¹', role: '与所有片形成欧姆接触。', impact: '需极高掺杂以同时接触多片而不形成 R_SD 瓶颈。' },
      { name: 'high-κ 介质 + 金属栅', material: 'HfO₂ + TiN/TiAlC', doping: '—', role: '完全包覆每一片。', impact: '最大静电耦合 → SS 接近理想（约 60 mV/dec），漏电最小。' }
    ]
  },
  hemt: {
    name: 'HEMT',
    tag: '射频 / 高速',
    summary: 'AlGaAs/GaAs 异质结构 + 2DEG。',
    operation: '具有不同能带的材料结合（AlGaAs/GaAs 或 AlGaN/GaN）在界面形成二维电子气（2DEG）。电子在空间上与施主分离，杂质散射降低 → 迁移率极高。',
    advantages: '极高迁移率，在微波/毫米波具有增益。',
    applications: '5G/6G 射频、GaN 功率放大器、卫星、雷达。',
    why: '在毫米波频段（>30 GHz）下，渡越时间限制了 Si。III–V 材料具有高得多的 µ 与 v_sat，且异质结将载流子与杂质分离——这是同质 MOSFET 无法实现的。',
    layers: [
      { name: '半绝缘衬底', material: 'SI GaAs 或 SiC（用于 GaN）', doping: '未掺杂/补偿（>10⁷ Ω·cm）', role: '射频隔离（低寄生电容）。', impact: '导电衬底会破坏 GHz 隔离；半绝缘对高 Q 必不可少。' },
      { name: '本征缓冲/沟道', material: '未掺杂 GaAs（或 GaN）', doping: '本征', role: '在不引入杂质的情况下承载 2DEG。', impact: '沟道无掺杂 → 迁移率 >8000 cm²/V·s（GaAs）或约 2000（GaN），且 v_sat 极高。' },
      { name: 'AlGaAs/AlGaN 间隔层', material: '未掺杂 AlGaAs（或 AlGaN），约 2–5 nm', doping: '本征', role: '在物理上将施主与沟道分隔。', impact: '降低远程库仑散射；折衷：过厚则降低 2DEG 密度。' },
      { name: '掺杂势垒层', material: 'AlGaAs:Si（或极化 AlGaN/GaN）', doping: 'δ 掺杂或均匀掺杂，约 1×10¹⁸（Si）', role: '提供"落入"2DEG 阱的电子。', impact: '2DEG 密度（约 1×10¹² – 1×10¹³ /cm²）由该掺杂控制；GaN 中使用自发/压电极化代替掺杂。' },
      { name: 'GaAs / GaN n+ 帽层', material: 'GaAs 或 GaN', doping: '约 1×10¹⁹', role: '降低欧姆接触的 R_c。', impact: '若没有帽层，接触会形成不希望的肖特基势垒。' },
      { name: '肖特基栅', material: 'Ti/Pt/Au 或 Ni/Au', doping: '—', role: '通过耗尽调制 2DEG 密度。', impact: '肖特基势垒替代氧化物（GaAs 上无稳定氧化物）；低电容支持极高 f_T。' }
    ]
  },
  igbt: {
    name: 'IGBT',
    tag: '大功率',
    summary: '为高电流而设的 MOSFET + BJT 混合结构。',
    operation: '输入是 MOS 栅极（高阻抗），用于控制电子注入垂直 BJT 的基区。第二个 P+ 端（集电极）向漂移区注入空穴，从而引起电导率调制和带有低压降的双极型 I-V 特性。',
    advantages: '高阻断电压与电流，电压控制（MOS）。',
    applications: '工业逆变器、车辆牵引、太阳能/风能。',
    why: '在 >600 V 且电流为数十至数百安培的条件下，纯 MOSFET 的 R_on 将无法接受。IGBT 向漂移区注入空穴（电导率调制），显著降低 V_CE(sat)，同时保留 MOS 栅极的简易控制。',
    layers: [
      { name: 'P+ 集电极（背面）', material: 'Si', doping: '重掺杂，约 1×10¹⁹（B）', role: '导通时向漂移区注入空穴。', impact: '正是它把 MOSFET 变成双极型：掺杂越高 → 注入越多 → V_CE(sat) 越低，但恢复更慢（拖尾电流）。' },
      { name: 'N 缓冲层（场截止，可选）', material: 'Si', doping: '约 1×10¹⁶', role: '在电场到达集电极之前将其截止。', impact: '相同 V_BR 下允许更薄的漂移区 → 更低 R_on，效率更高。' },
      { name: 'N⁻ 漂移区', material: 'Si 外延', doping: '极轻，约 1×10¹³ – 5×10¹⁴（P）', role: '承担整个阻断电压。', impact: '掺杂越低、越厚 → V_BR 越高，但 R_on 越大；典型 V_BR × R_on 折衷。' },
      { name: 'P-体', material: 'Si', doping: '约 1×10¹⁷（B）', role: 'MOS 沟道反型的区域。', impact: '决定 MOS 栅极的 V_TH；掺杂校准不当 ⇒ 寄生晶闸管闩锁。' },
      { name: 'N+ 发射极', material: 'Si', doping: '约 1×10²⁰（As）', role: '发射极欧姆接触并注入电子。', impact: '高掺杂降低电阻，但若设计不当则增加闩锁风险。' },
      { name: '氧化层 + 多晶硅栅', material: 'SiO₂ + Si:N+', doping: '多晶 N+ 约 10²⁰', role: 'MOS 控制输入。', impact: '允许电压驱动（驱动电流很小），不同于电流驱动的 BJT/晶闸管。' }
    ]
  },
  jfet: {
    name: 'JFET',
    tag: '以 PN 结作栅',
    summary: 'PN 耗尽夹断 N 型沟道。',
    operation: '栅极是反向偏置的 PN 结。当 V_GS 变得更负时，耗尽区在 N 型沟道内扩展并夹断电流。没有氧化层。',
    advantages: '低噪声、结构简单、线性度好。',
    applications: '低噪声音频前置放大器、仪器仪表。',
    why: '由于没有氧化层，不存在界面态俘获，也没有 MOSFET 中典型的 1/f 噪声。这使 JFET 成为仪表前端与超低噪声音频的最佳选择。',
    layers: [
      { name: 'N 沟道', material: 'Si', doping: '中等，约 1×10¹⁶ – 1×10¹⁷（P、As）', role: '主要导电通路。', impact: '掺杂决定饱和电流 I_DSS 与夹断电压 V_P；掺杂越高 → 电流越大，但 V_P 更负。' },
      { name: 'P+ 栅（顶部和底部）', material: 'Si', doping: '简并，约 1×10¹⁹（B）', role: '形成控制耗尽的 PN 结。', impact: 'P+ >> N 保证耗尽区几乎完全在沟道内（我们希望调制处）扩展，而不是在栅极内。' },
      { name: 'S/D 欧姆接触', material: 'N+ 注入区上的金属', doping: '局部 N+ 约 10²⁰', role: '外部连接。', impact: '简并区消除肖特基势垒并保持低噪声。' }
    ]
  },
  mesfet: {
    name: 'MESFET',
    tag: 'GaAs，微波',
    summary: '直接在 N 沟道上的肖特基栅（无氧化层）。',
    operation: '栅极是直接在 n 掺杂 GaAs 沟道上制作的金属—半导体肖特基接触。肖特基势垒形成耗尽区从而调制沟道。用于 GaAs 这类不能形成稳定氧化物的材料。',
    advantages: '在 GaAs 上的高频性能、无氧化层的简化工艺。',
    applications: '微波、卫星通信、低噪声放大器（LNA）。',
    why: 'GaAs 不像 Si/SiO₂ 那样形成稳定的本征氧化物。使用肖特基势垒可绕开此问题，结合 GaAs 的高 µ，可以以简单工艺工作至数十 GHz。',
    layers: [
      { name: '半绝缘 GaAs 衬底', material: '由 Cr 或 EL2 补偿的 GaAs', doping: '半绝缘（约 10⁸ Ω·cm）', role: '射频隔离。', impact: '避免 GHz 下的介电损耗；对低噪声放大器至关重要。' },
      { name: '有源层（沟道）', material: 'GaAs', doping: '中等，约 1–5×10¹⁷（Si）', role: '导电沟道。', impact: '掺杂决定 I_DSS 与 V_P；掺杂越高 → 电流越大，但肖特基击穿电压越低。' },
      { name: '用于 S/D 的 n+ 帽层', material: 'GaAs', doping: '约 1×10¹⁸ – 10¹⁹', role: '降低欧姆接触电阻。', impact: '若不进行局部抬升，接触会形成不希望的肖特基特性。' },
      { name: '肖特基栅', material: 'Ti/Pt/Au', doping: '—', role: '通过耗尽调制沟道的肖特基势垒。', impact: '势垒约 0.7–0.9 eV 限制了正向 V_GS，但响应迅速（无氧化层）→ 极高 f_T。' }
    ]
  },
  modfet: {
    name: 'MODFET',
    tag: '调制掺杂',
    summary: '强调调制掺杂的 HEMT 变体。',
    operation: '施主原子位于一层（AlGaAs:n），通过未掺杂的间隔层与沟道（GaAs:i）分开。电子"落入" GaAs 形成 2DEG，但杂质留在原处——迁移率极高。',
    advantages: '迁移率出色，截止频率 f_T 极高。',
    applications: '射频前端、射电天文、低温接收机。',
    why: '在低温（低温学、射电天文）下，电离杂质散射主导迁移率。将施主与沟道在物理上分开（调制掺杂），可在 4 K 时实现 >10⁶ cm²/V·s 的迁移率。',
    layers: [
      { name: '半绝缘 GaAs 衬底', material: 'GaAs', doping: '半绝缘', role: '基底与隔离。', impact: '与 HEMT 相同：射频损耗低。' },
      { name: '本征 GaAs 沟道', material: '未掺杂 GaAs', doping: '本征', role: '承载 2DEG。', impact: '没有杂质 ⇒ 4 K 下 µ 可超过 10⁶ cm²/V·s。' },
      { name: '未掺杂 AlGaAs 间隔层', material: 'AlGaAs', doping: '0', role: '在物理上将施主与 2DEG 分开。', impact: '控制 µ 与 2DEG 密度的折衷：间隔层越厚 → µ 越高、n₂DEG 越低。' },
      { name: 'AlGaAs:n（供给层）', material: 'AlGaAs', doping: 'δ 掺杂 Si 约 5×10¹² cm⁻² 或均匀约 10¹⁸', role: '提供电子。', impact: '在不向沟道引入杂质的前提下调节 n₂DEG；δ 掺杂将施主集中于一平面以提高效率。' },
      { name: 'GaAs n+ 帽层', material: 'GaAs', doping: '约 10¹⁹', role: '欧姆接触。', impact: '降低对 LNA 噪声至关重要的 R_c。' },
      { name: '凹陷肖特基栅', material: 'Ti/Pt/Au', doping: '—', role: '调制 2DEG。', impact: '栅极凹陷使其更靠近沟道 → g_m 更大。' }
    ]
  },
  ofet: {
    name: 'OFET',
    tag: '有机电子',
    summary: 'π 共轭有机半导体。',
    operation: '沟道由共轭分子/聚合物（并五苯、P3HT 等）构成。导电通常通过 π 态之间的跳跃。可在低温（<150 °C）下印刷在柔性衬底上。',
    advantages: '低成本、柔性、大面积、生物兼容。',
    applications: '柔性显示、生物医学传感器、印刷 RFID。',
    why: '它在速度上无法与 Si 竞争。当机械柔性、大面积、单位 cm² 成本以及低温（<150 °C）工艺比频率更重要时被选用——例如柔性背板与一次性传感器。',
    layers: [
      { name: '柔性衬底', material: 'PET、PEN 或薄玻璃', doping: '—', role: '柔性机械支撑。', impact: '限制工艺温度；要求各层耐 <150 °C。' },
      { name: '金属栅（底栅）', material: 'Au、Ag 或 ITO', doping: '—', role: '控制电极。', impact: '功函数影响 V_TH 与有效接触掺杂。' },
      { name: '聚合物介质', material: 'PVP、PMMA、PVA（或 ALD 沉积的 Al₂O₃）', doping: '绝缘体', role: '栅极隔离。', impact: 'κ 较低需更薄的层；界面陷阱引起迟滞与 V_TH 漂移。' },
      { name: '有机半导体', material: '并五苯、P3HT（p 型）；C60、PCBM（n 型）', doping: '通常本征；可分子掺杂（F4-TCNQ 等）', role: '通过 π 跳跃形成导电沟道。', impact: '过度掺杂提高 I_off（失去开/关）；分子纯度与有序性主导 µ（0.1–10 cm²/V·s）。' },
      { name: '源/漏', material: 'Au、Ag 或 PEDOT:PSS', doping: '—', role: '与 HOMO（p）或 LUMO（n）形成欧姆接触。', impact: '功函数与 HOMO/LUMO 的对齐决定接触电阻，常常是 OFET 的瓶颈。' }
    ]
  },
  tfet: {
    name: 'TFET',
    tag: '隧穿',
    summary: '带间隧穿注入。',
    operation: 'TFET 不是通过热电子越过势垒来注入载流子，而是利用 P+ 源/沟道结的带间隧穿（BTBT）。这使得亚阈值斜率可以低于 60 mV/dec（玻尔兹曼极限）。',
    advantages: '可在极低电压（<0.5 V）工作、功耗极低。',
    applications: '未来超低功耗集成电路、IoT、自供能传感器。',
    why: 'MOSFET 在根本上受限于玻尔兹曼极限（300 K 下 SS ≥ 60 mV/dec），导致难以将 V_DD 降至约 0.5 V 以下而不导致漏电激增。TFET 利用隧穿打破该极限，使带能量收集的 IoT 成为可能。',
    layers: [
      { name: 'P+ 源', material: 'Si、Ge 或 InGaAs', doping: '简并，约 1×10²⁰（B）', role: '空穴库，并供给隧穿结。', impact: '极高且陡峭的掺杂至关重要：它决定 BTBT 势垒宽度（∝ 1/√N）；掺杂越高 → 隧穿越多（I_on 越高）。' },
      { name: '本征沟道', material: '未掺杂 Si/Ge/InGaAs', doping: '本征', role: '栅极用于对齐能带的区域。', impact: '无杂质 → 势垒清晰，I_off 极低；任何残留掺杂都会恶化 SS。' },
      { name: 'N+ 漏', material: 'Si 或 InGaAs', doping: '约 1×10²⁰（As）', role: '收集隧穿出来的电子。', impact: 'P+/i/N+ 不对称形成整流，从而具有典型的单向特性。' },
      { name: 'high-κ 介质', material: 'HfO₂', doping: '—', role: '将栅与沟道耦合以对齐能带。', impact: 'high κ 是必要的：隧穿依赖沟道中陡峭的能带弯曲，只有在强静电耦合下才能实现。' },
      { name: '金属栅', material: 'TiN 或类似', doping: '—', role: '控制 E_C（沟道）与 E_V（源）的对齐。', impact: '调谐功函数降低 V_TH，并最大化 0.5 V 以下的有用工作窗口。' }
    ]
  },
  tft: {
    name: 'TFT（薄膜）',
    tag: '显示器',
    summary: '玻璃/塑料上的薄膜晶体管。',
    operation: '在绝缘衬底（玻璃）上沉积一层薄的半导体（a-Si、LTPS 或 IGZO）。底栅 + 介质（SiNx/SiO₂）。低温工艺允许极大的面积。',
    advantages: '大面积、可在玻璃/塑料上工艺、低成本。',
    applications: 'LCD/OLED 背板、AMOLED、电子纸、数字 X 射线。',
    why: '面积达数平方米的面板需要低温工艺（无法生长晶体 Si）。薄膜（a-Si、LTPS、IGZO）直接沉积在玻璃上，每个像素拥有自己的晶体管。',
    layers: [
      { name: '衬底', material: '玻璃或塑料（PI）', doping: '—', role: '机械基底。', impact: '限制工艺温度（玻璃 <350 °C，塑料 <250 °C）。' },
      { name: '栅（底栅）', material: 'Mo、Al、Cu', doping: '—', role: '控制电极。', impact: '低电阻金属对大面积背板（信号均匀性）至关重要。' },
      { name: '介质', material: 'SiNₓ、SiO₂（PECVD）或 Al₂O₃（ALD）', doping: '绝缘体', role: '栅极隔离。', impact: 'SiNx 的陷阱会随时间偏移 V_TH（偏置应力）—— 是 AMOLED 的主要问题。' },
      { name: '薄膜半导体', material: 'a-Si:H（µ≈1）、LTPS（µ≈100）或 IGZO（µ≈10）', doping: 'a-Si：因氢轻微 n 型；IGZO：来自氧空位的电子；LTPS：可由注入掺杂', role: '晶体管沟道。', impact: '在 IGZO 中，控制 O 的化学计量决定 n_e：氧空位过多 → 沟道始终导通（V_TH 为负）；过少 → "死" TFT。' },
      { name: '源/漏', material: 'Mo 或 Ti/Al/Ti', doping: 'IGZO 中局部还原区域（缺氧富集）', role: '欧姆接触。', impact: '等离子处理在 IGZO 中形成有效的 n+ 层，无需注入即可降低 R_c。' }
    ]
  },
  vpower: {
    name: '垂直 GaAs/GaN 功率器件',
    tag: '垂直功率',
    summary: '电流垂直流经厚 N⁻ 漂移区。',
    operation: '垂直结构：源和栅在顶部，漏在底部。厚的 N⁻ 漂移区承担高的阻断电压。当栅极在 P-体内反型出沟道时，电子沿垂直方向流向漏极。',
    advantages: '可承受极高 V_DS、高电流密度。',
    applications: '电动汽车的功率变换、工业电源、功率 GaN/SiC。',
    why: '对于牵引逆变器（>600 V，数百 A），垂直几何使热分布于整个芯片，并将衬底用作漏极端子。在 SiC/GaN 中，临界电场约为 Si 的 10 倍，使漂移区厚度可降低 10 倍 → R_on·A 更低。',
    layers: [
      { name: 'N+ 衬底（漏）', material: 'SiC、GaN 或 Si', doping: '简并，约 1×10¹⁹', role: '位于底部的漏极欧姆端子。', impact: '高掺杂保证低衬底电阻；其热导率决定散热能力。' },
      { name: 'N 缓冲层（可选）', material: 'SiC/GaN 外延', doping: '约 1×10¹⁷', role: '过渡到漂移区并起场截止作用。', impact: '允许更薄的漂移区而不发生穿通。' },
      { name: 'N⁻ 漂移区', material: '外延 SiC/GaN', doping: '轻，约 1×10¹⁴ – 1×10¹⁶', role: '在阻断时承担全部 V_DS。', impact: '主要的 R_on × V_BR 折衷：R_on,sp ∝ V_BR²·⁵/(µ·E_c³)。这正是 SiC/GaN 在功率应用上胜过 Si 的原因（E_c 高约 10 倍）。' },
      { name: 'P-体', material: 'SiC/GaN', doping: '约 1×10¹⁷（SiC 中的 Al，GaN 中的 Mg）', role: '形成反型沟道的区域。', impact: '掺杂决定 V_TH 与抗穿通能力；GaN 中仍是挑战（Mg 激活）。' },
      { name: 'N+ 源', material: 'SiC/GaN', doping: '约 1×10²⁰', role: '为沟道供应电子。', impact: '高掺杂降低 R_c 并支持高电流密度。' },
      { name: '沟槽栅 + 氧化层', material: 'SiO₂/Al₂O₃ 上的多晶 Si 或金属', doping: 'N+ 多晶栅或金属', role: '在 P-体内的垂直 MOS 沟道。', impact: '沟槽几何倍增有效沟道宽度，降低 R_on（沟道）；SiC 的氧化物质量（SiC/SiO₂ 界面）历来是最大挑战。' }
    ]
  }
};

export default { ui, catalog };
