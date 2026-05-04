// Tradução PT-BR do painel "Tipos de FET"
const ui = {
  title: '🔬 Tipos de Transistores FET — Painel Didático',
  intro: 'Explore os principais tipos de transistores de efeito de campo. Cada painel mostra a estrutura em corte com animação da mobilidade de elétrons e lacunas e setas proporcionais indicando o sentido da corrente.',
  pause: '⏸️ Pausar animações',
  resume: '▶️ Retomar animações',
  legend: { electron: 'elétron', hole: 'lacuna', current: 'corrente convencional' },
  sections: {
    operation: '🔎 Funcionamento',
    advantages: '✅ Vantagens',
    applications: '🏭 Aplicações',
    why: '📍 Onde e por quê'
  },
  layersTitle: '🧱 Camadas, materiais e dopagens',
  layersIntro: 'Cada camada tem um papel específico; a dopagem (tipo e concentração) determina barreiras, capacitâncias, mobilidade e tensões de operação.',
  layersTable: { layer: 'Camada', material: 'Material', doping: 'Dopagem', role: 'Função', impact: 'Impacto no funcionamento' },
  quickRef: '📚 Referência rápida',
  info: {
    whatIs: { title: '🎯 O que é um FET?', body: 'Dispositivo em que a corrente entre source e drain é modulada por um campo elétrico aplicado ao gate, sem corrente significativa pelo próprio gate (alta impedância de entrada).' },
    isolation: { title: '⚙️ Princípios de isolação do gate', body: 'MOSFET/IGBT: óxido. JFET: junção PN. MESFET: barreira Schottky. HEMT/MODFET: heterojunção + Schottky.' },
    trends: { title: '🚀 Tendências', body: 'Do planar → FinFET → GAAFET/Nanosheet para lógica; HEMT GaN e vertical SiC para potência; TFET para ultra baixa potência; OFET/TFT para displays e eletrônica flexível.' },
    reading: { title: '📐 Leitura das figuras', body: 'As cores são simbólicas: azul = região N / elétrons, laranja = região P / lacunas, roxo = gate, amarelo = óxido. As setas têm espessura proporcional à corrente típica do dispositivo.' }
  }
};

const catalog = {
  mosfet: {
    name: 'MOSFET Planar',
    tag: 'CMOS clássico',
    summary: 'Gate isolado por óxido sobre substrato P/N.',
    operation: 'Um canal condutor é induzido na superfície do semicondutor quando V_GS > V_TH. O óxido de gate isola eletricamente o terminal de controle, permitindo alta impedância de entrada. A corrente flui lateralmente entre source e drain através do canal.',
    advantages: 'Alta impedância de entrada, fabricação CMOS madura, baixo consumo estático.',
    applications: 'Base de todo o CMOS digital, memórias, amplificadores analógicos.',
    why: 'O óxido termicamente crescido em Si é quase perfeito (SiO₂/Si): baixa densidade de estados de interface e altíssima rigidez dielétrica. Isso permite gates com fuga desprezível e a miniaturização em massa que sustenta a indústria de microprocessadores e memórias.',
    layers: [
      { name: 'Substrato P (body)', material: 'Si monocristalino', doping: 'Leve, ~1×10¹⁵ cm⁻³ (B, aceitadores)', role: 'Fornece corpo para o canal de inversão e referência de tensão (bulk).', impact: 'Dopagem leve permite formar a região de depleção exigida pelo canal; se for muito alta, V_TH sobe e a mobilidade cai por espalhamento de impurezas.' },
      { name: 'Source / Drain N+', material: 'Si dopado', doping: 'Degenerada, ~1×10²⁰ cm⁻³ (As, P, doadores)', role: 'Reservatórios de elétrons e contatos ôhmicos de baixa resistência.', impact: 'Dopagem elevada garante contato ôhmico (sem barreira Schottky) e reduz a resistência série R_SD; uma junção abrupta minimiza efeitos de canal curto.' },
      { name: 'Óxido de gate (SiO₂)', material: 'Dióxido de silício', doping: 'Isolante (não intencionalmente dopado)', role: 'Isola eletricamente o gate do canal; acopla o campo eletrostático do gate.', impact: 'Espessura ~1–3 nm define a capacitância C_ox e portanto g_m e V_TH; se fino demais, há tunelamento direto (leakage).' },
      { name: 'Canal de inversão N', material: 'Camada de Si invertida', doping: 'Induzida eletrostaticamente (não quimicamente)', role: 'Conduz elétrons de source para drain.', impact: 'Densidade ∝ C_ox·(V_GS−V_TH); a formação depende da dopagem do body e da função trabalho do gate.' },
      { name: 'Gate', material: 'Polissilício N+ (clássico) ou metal (HKMG)', doping: 'Poly N+ ~1×10²⁰ cm⁻³ / metal: sem dopagem', role: 'Eletrodo de controle do canal.', impact: 'A função trabalho do gate fixa V_TH; poly-Si sofre "poly depletion" → tecnologias modernas usam metal gate + high-κ.' }
    ]
  },
  finfet: {
    name: 'FinFET',
    tag: '3D, 22nm–5nm',
    summary: 'Fin vertical de silício com gate envolvendo 3 lados.',
    operation: 'O canal é uma "barbatana" (fin) de silício vertical. O gate o envolve em três lados, multiplicando o controle eletrostático e reduzindo efeitos de canal curto (leakage, DIBL). A corrente soma-se sobre as três superfícies do fin.',
    advantages: 'Melhor controle do canal, menor leakage, mais corrente por área que o planar.',
    applications: 'Processadores de 22nm a 5nm (Intel, TSMC, Samsung).',
    why: 'Abaixo de ~22 nm o MOSFET planar perde controle eletrostático (DIBL, punch-through). Envolver o canal em 3 lados aumenta o acoplamento gate–canal e permite continuar a escala de Moore com menor V_DD e menor leakage.',
    layers: [
      { name: 'Substrato bulk P', material: 'Si', doping: 'Leve (B, ~10¹⁵)', role: 'Suporte mecânico e isolação via STI.', impact: 'Bem pouco relevante eletricamente; o canal fica todo no fin.' },
      { name: 'Fin (corpo do canal)', material: 'Si', doping: 'Intrínseco ou levemente dopado (<10¹⁶)', role: 'Corpo 3D onde a inversão ocorre nas três faces.', impact: 'Fin pouco dopado → menor variação estatística de V_TH e maior mobilidade; a largura do fin define a eletrostática.' },
      { name: 'Source / Drain N+ (SiGe:P ou SiP)', material: 'Si:P ou SiGe epitaxial', doping: 'Degenerada, ~1–3×10²⁰', role: 'Contato ôhmico e indutor de tensão mecânica (strain).', impact: 'O epi tensionado aumenta a mobilidade; a alta dopagem reduz R_SD.' },
      { name: 'Interfacial SiO₂ + high-κ (HfO₂)', material: 'SiO₂ fino + HfO₂', doping: 'Isolantes', role: 'Dielétrico de gate com alta κ e EOT baixo.', impact: 'High-κ reduz o tunelamento mantendo capacitância equivalente; interfacial preserva a qualidade da interface Si/óxido.' },
      { name: 'Metal gate (TiN/TaN + fill)', material: 'TiN, TaN, W', doping: 'Sem dopagem', role: 'Eletrodo com função trabalho ajustada para nMOS/pMOS.', impact: 'Função trabalho do metal define V_TH sem depender de dopar poly-Si; elimina poly depletion.' }
    ]
  },
  gaafet: {
    name: 'GAAFET (Nanosheet)',
    tag: '3nm e abaixo',
    summary: 'Gate envolve totalmente nanosheets horizontais.',
    operation: 'Várias nanosheets de silício empilhadas formam canais paralelos, e o gate as envolve em todos os lados (gate-all-around). O controle eletrostático é máximo: o gate "fecha" o canal por inteiro quando desligado.',
    advantages: 'Melhor controle do que FinFET, largura efetiva ajustável, ideal para ≤3nm.',
    applications: 'Samsung 3nm GAA, TSMC N2 e futuras gerações.',
    why: 'O FinFET satura em ~5 nm de largura de fin. O GAA permite canais empilhados com a largura da folha ajustável por design (não só por número de fins), o que dá flexibilidade de corrente e eletrostática ideal para nós ≤3 nm.',
    layers: [
      { name: 'Substrato + BOX', material: 'Si / SiO₂ enterrado', doping: 'Isolação', role: 'Base mecânica e isolação do canal.', impact: 'Reduz correntes parasitas para o bulk.' },
      { name: 'Nanosheets de Si', material: 'Si epitaxial (crescido sobre sacrificial SiGe)', doping: 'Intrínsecas', role: 'Canais paralelos envolvidos pelo gate.', impact: 'Ausência de dopantes elimina espalhamento por impurezas → maior µ; a espessura (~5 nm) define tunelamento e efeitos quânticos.' },
      { name: 'Inner spacers', material: 'SiN low-κ', doping: 'Isolante', role: 'Separam o gate dos S/D entre sheets.', impact: 'Reduzem capacitância parasita C_gd e C_gs, melhorando frequência.' },
      { name: 'Source / Drain epitaxial', material: 'SiP (nMOS) / SiGe:B (pMOS)', doping: '~1×10²¹', role: 'Contato ôhmico a todas as folhas.', impact: 'Altíssima dopagem é necessária para contato simultâneo a várias sheets sem gargalo em R_SD.' },
      { name: 'Dielétrico high-κ + metal gate', material: 'HfO₂ + TiN/TiAlC', doping: '—', role: 'Envolve cada sheet totalmente.', impact: 'Acoplamento eletrostático máximo → SS próximo do ideal (~60 mV/dec) e leakage mínimo.' }
    ]
  },
  hemt: {
    name: 'HEMT',
    tag: 'RF / alta velocidade',
    summary: 'Heteroestrutura AlGaAs/GaAs com 2DEG.',
    operation: 'A junção de materiais com bandas diferentes (AlGaAs/GaAs ou AlGaN/GaN) gera um gás de elétrons bidimensional (2DEG) na interface. Os elétrons ficam separados espacialmente dos doadores, reduzindo espalhamento por impurezas → altíssima mobilidade.',
    advantages: 'Mobilidade elevadíssima, ganho em microondas/mm-wave.',
    applications: 'Rádio 5G/6G, amplificadores de potência GaN, satélite, radar.',
    why: 'Em frequências de mm-wave (>30 GHz) o tempo de trânsito limita Si. Materiais III-V oferecem µ e v_sat muito maiores, e o truque da heterojunção separa portadores de impurezas, algo impossível em MOSFET homo-estrutural.',
    layers: [
      { name: 'Substrato semi-isolante', material: 'GaAs SI ou SiC (para GaN)', doping: 'Não dopado / compensado (>10⁷ Ω·cm)', role: 'Isolação para RF (baixa capacitância parasita).', impact: 'Substrato condutor arruinaria o isolamento em GHz; SI é essencial para Q alto.' },
      { name: 'Buffer/canal intrínseco', material: 'GaAs (ou GaN) não dopado', doping: 'Intrínseco', role: 'Aloja o 2DEG sem introduzir impurezas.', impact: 'Sem dopantes no canal → mobilidade >8000 cm²/V·s (GaAs) ou ~2000 (GaN) com v_sat altíssima.' },
      { name: 'Spacer AlGaAs/AlGaN', material: 'AlGaAs (ou AlGaN) não dopado, ~2–5 nm', doping: 'Intrínseco', role: 'Afasta fisicamente doadores do canal.', impact: 'Reduz espalhamento Coulombiano remoto; trade-off: muito espesso reduz densidade do 2DEG.' },
      { name: 'Barreira dopada', material: 'AlGaAs:Si (ou AlGaN/GaN polarizado)', doping: 'δ-doping ou uniforme, ~1×10¹⁸ (Si)', role: 'Fornece elétrons que "caem" no poço do 2DEG.', impact: 'A densidade do 2DEG (~1×10¹² – 1×10¹³ /cm²) é controlada por essa dopagem; em GaN usa-se polarização espontânea/piezo em vez de dopagem.' },
      { name: 'Cap n+ GaAs / GaN', material: 'GaAs ou GaN', doping: '~1×10¹⁹', role: 'Reduz R_c dos contatos ôhmicos.', impact: 'Sem o cap, os contatos teriam barreira Schottky indesejada.' },
      { name: 'Gate Schottky', material: 'Ti/Pt/Au ou Ni/Au', doping: '—', role: 'Modula a densidade do 2DEG por depleção.', impact: 'Barreira Schottky substitui o óxido (que não é estável em GaAs); baixa capacitância permite altíssimo f_T.' }
    ]
  },
  igbt: {
    name: 'IGBT',
    tag: 'Alta potência',
    summary: 'Híbrido MOSFET + BJT para correntes altas.',
    operation: 'A entrada é um gate MOS (alta impedância) que controla a injeção de elétrons em uma base de BJT vertical. Um segundo terminal P+ (coletor) injeta lacunas no drift, causando modulação da condutividade e I-V tipo bipolar com queda de tensão baixa.',
    advantages: 'Alta tensão de bloqueio e corrente, controle por tensão (MOS).',
    applications: 'Inversores industriais, tração veicular, energia solar/eólica.',
    why: 'Em >600 V com correntes de dezenas a centenas de ampères, um MOSFET puro teria R_on proibitivo. O IGBT injeta lacunas no drift (modulação de condutividade) reduzindo V_CE(sat) drasticamente, mantendo o controle fácil do gate MOS.',
    layers: [
      { name: 'Coletor P+ (back-side)', material: 'Si', doping: 'Pesada, ~1×10¹⁹ (B)', role: 'Injeta lacunas no drift quando ligado.', impact: 'É o que transforma o MOSFET em bipolar: maior dopagem → maior injeção → menor V_CE(sat), mas recuperação mais lenta (tail current).' },
      { name: 'Buffer N (field-stop, opcional)', material: 'Si', doping: '~1×10¹⁶', role: 'Interrompe o campo elétrico antes de atingir o coletor.', impact: 'Permite drift mais fino para mesma V_BR → menor R_on e melhor eficiência.' },
      { name: 'Drift N⁻', material: 'Si epi', doping: 'Muito leve, ~1×10¹³ – 5×10¹⁴ (P)', role: 'Sustenta toda a tensão de bloqueio.', impact: 'Quanto menor a dopagem e maior a espessura, maior V_BR — mas maior R_on(off-state); trade-off clássico V_BR × R_on.' },
      { name: 'P-body', material: 'Si', doping: '~1×10¹⁷ (B)', role: 'Região onde o canal MOS é invertido.', impact: 'Define V_TH do gate MOS; dopagem mal calibrada ⇒ latch-up do tiristor parasita.' },
      { name: 'N+ emitter', material: 'Si', doping: '~1×10²⁰ (As)', role: 'Contato ôhmico de emissor e injetor de elétrons.', impact: 'Dopagem alta reduz resistência mas aumenta risco de latch-up se mal dimensionada.' },
      { name: 'Óxido + gate poly-Si', material: 'SiO₂ + Si:N+', doping: 'Poly N+ ~10²⁰', role: 'Entrada de controle MOS.', impact: 'Permite acionamento por tensão (pouca corrente de driver), diferente de BJT/Tiristor de corrente.' }
    ]
  },
  jfet: {
    name: 'JFET',
    tag: 'Junção PN como gate',
    summary: 'Depleção de PN estrangula o canal N.',
    operation: 'O gate é uma junção PN reversamente polarizada. A região de depleção se expande dentro do canal N conforme V_GS fica mais negativo, estrangulando a passagem de corrente. Não há óxido.',
    advantages: 'Ruído baixo, simplicidade, boa linearidade.',
    applications: 'Pré-amplificadores de áudio de baixo ruído, instrumentação.',
    why: 'Sem óxido, não há captura em estados de interface nem ruído 1/f típico do MOSFET. Isso faz do JFET a melhor escolha para front-ends de instrumentação e áudio de ultra-baixo ruído.',
    layers: [
      { name: 'Canal N', material: 'Si', doping: 'Moderada, ~1×10¹⁶ – 1×10¹⁷ (P, As)', role: 'Caminho condutor principal.', impact: 'Dopagem define a corrente de saturação I_DSS e a tensão de pinch-off V_P; mais dopado → mais corrente, porém V_P mais negativo.' },
      { name: 'Gate P+ (topo e base)', material: 'Si', doping: 'Degenerada, ~1×10¹⁹ (B)', role: 'Forma a junção PN que controla a depleção.', impact: 'P+ >> N garante que a depleção cresça quase toda dentro do canal (onde queremos modular), não no gate.' },
      { name: 'Contatos ôhmicos S/D', material: 'Metal sobre N+ implant', doping: 'Localmente N+ ~10²⁰', role: 'Conexão externa.', impact: 'Região degenerada elimina barreira Schottky e mantém ruído baixo.' }
    ]
  },
  mesfet: {
    name: 'MESFET',
    tag: 'GaAs, microondas',
    summary: 'Gate Schottky direto no canal N (sem óxido).',
    operation: 'O gate é um contato Schottky metal–semicondutor feito diretamente sobre um canal GaAs dopado n. A barreira Schottky cria depleção que modula o canal. Usado onde GaAs não forma óxido estável.',
    advantages: 'Alta frequência em GaAs, processo simples sem óxido.',
    applications: 'Microondas, comunicação via satélite, amplificadores LNA.',
    why: 'GaAs não forma óxido nativo estável como Si/SiO₂. Usar uma barreira Schottky contorna esse problema e, junto com a alta µ do GaAs, permite operação até dezenas de GHz com processo simples.',
    layers: [
      { name: 'Substrato GaAs SI', material: 'GaAs compensado com Cr ou EL2', doping: 'Semi-isolante (~10⁸ Ω·cm)', role: 'Isolação de RF.', impact: 'Evita perdas dielétricas em GHz; essencial para amplificadores de baixo ruído.' },
      { name: 'Camada ativa (canal)', material: 'GaAs', doping: 'Moderada, ~1–5×10¹⁷ (Si)', role: 'Canal condutor.', impact: 'Dopagem define I_DSS e V_P; mais dopado → mais corrente, mas menor tensão de ruptura do Schottky.' },
      { name: 'Cap n+ para S/D', material: 'GaAs', doping: '~1×10¹⁸ – 10¹⁹', role: 'Reduz resistência de contato ôhmico.', impact: 'Sem a elevação localizada, os contatos seriam Schottky indesejados.' },
      { name: 'Gate Schottky', material: 'Ti/Pt/Au', doping: '—', role: 'Barreira Schottky que modula o canal por depleção.', impact: 'Barreira ≈0,7–0,9 eV limita V_GS positivo, mas dá resposta rápida (sem óxido) → altíssimo f_T.' }
    ]
  },
  modfet: {
    name: 'MODFET',
    tag: 'Dopagem modulada',
    summary: 'Variante do HEMT com ênfase na modulação de dopagem.',
    operation: 'Os átomos doadores ficam em uma camada (AlGaAs:n) afastada do canal (GaAs:i) por um espaçador não dopado. Os elétrons "caem" para o GaAs, formando o 2DEG, mas as impurezas ficam para trás — mobilidade extremamente alta.',
    advantages: 'Mobilidade superior, frequências de corte f_T muito elevadas.',
    applications: 'Front-end de RF, radioastronomia, receptores criogênicos.',
    why: 'Em temperaturas baixas (criogenia, radioastronomia) o espalhamento por impurezas ionizadas domina a mobilidade. Separar fisicamente os doadores do canal (dopagem modulada) permite mobilidades >10⁶ cm²/V·s a 4 K.',
    layers: [
      { name: 'Substrato GaAs SI', material: 'GaAs', doping: 'Semi-isolante', role: 'Base e isolação.', impact: 'Idem HEMT: baixa perda em RF.' },
      { name: 'Canal GaAs intrínseco', material: 'GaAs não dopado', doping: 'Intrínseco', role: 'Aloja o 2DEG.', impact: 'Sem impurezas ⇒ µ pode ultrapassar 10⁶ cm²/V·s a 4 K.' },
      { name: 'Spacer AlGaAs undoped', material: 'AlGaAs', doping: '0', role: 'Separa fisicamente os doadores do 2DEG.', impact: 'Controla o compromisso µ vs densidade do 2DEG: espaçador mais grosso → µ maior, n₂DEG menor.' },
      { name: 'AlGaAs:n (supply layer)', material: 'AlGaAs', doping: 'δ-doping Si ~5×10¹² cm⁻² ou uniforme ~10¹⁸', role: 'Fornece os elétrons.', impact: 'Ajusta n₂DEG sem introduzir impurezas no canal; δ-doping concentra doadores em um plano para maior eficiência.' },
      { name: 'Cap n+ GaAs', material: 'GaAs', doping: '~10¹⁹', role: 'Contato ôhmico.', impact: 'Reduz R_c crítico para ruído em LNA.' },
      { name: 'Gate Schottky recuado', material: 'Ti/Pt/Au', doping: '—', role: 'Modulação do 2DEG.', impact: 'Recesso do gate aproxima-o do canal → maior g_m.' }
    ]
  },
  ofet: {
    name: 'OFET',
    tag: 'Eletrônica orgânica',
    summary: 'Semicondutor orgânico π-conjugado.',
    operation: 'Canal formado por moléculas/polímeros conjugados (pentaceno, P3HT, etc.). A condução se dá tipicamente por hopping entre estados π. Fabricação por impressão em substratos flexíveis a baixa temperatura.',
    advantages: 'Baixo custo, flexível, área grande, biocompatível.',
    applications: 'Displays flexíveis, sensores biomédicos, RFID impresso.',
    why: 'Não compete em velocidade com Si. É escolhido onde flexibilidade mecânica, grande área, baixo custo por cm² e processamento a baixa temperatura (<150 °C) importam mais que frequência — ex.: backplanes flexíveis e sensores descartáveis.',
    layers: [
      { name: 'Substrato flexível', material: 'PET, PEN ou vidro fino', doping: '—', role: 'Suporte mecânico flexível.', impact: 'Limita temperatura de processo; exige camadas que tolerem <150 °C.' },
      { name: 'Gate metálico (bottom)', material: 'Au, Ag ou ITO', doping: '—', role: 'Eletrodo de controle.', impact: 'Função trabalho afeta V_TH e dopagem efetiva de contato.' },
      { name: 'Dielétrico polimérico', material: 'PVP, PMMA, PVA (ou Al₂O₃ por ALD)', doping: 'Isolante', role: 'Isolamento do gate.', impact: 'κ baixo exige camadas mais finas; armadilhas na interface causam histerese e shift de V_TH.' },
      { name: 'Semicondutor orgânico', material: 'Pentaceno, P3HT (p-type); C60, PCBM (n-type)', doping: 'Tipicamente intrínseco; pode haver dopagem molecular (F4-TCNQ etc.)', role: 'Canal condutor por hopping π.', impact: 'Dopagem excessiva aumenta I_off (perde on/off); pureza e ordenamento molecular dominam a µ (0,1–10 cm²/V·s).' },
      { name: 'Source / Drain', material: 'Au, Ag ou PEDOT:PSS', doping: '—', role: 'Contato ôhmico ao HOMO (p) ou LUMO (n).', impact: 'Alinhamento da função trabalho com HOMO/LUMO decide a resistência de contato, frequentemente o gargalo do OFET.' }
    ]
  },
  tfet: {
    name: 'TFET',
    tag: 'Tunelamento',
    summary: 'Injeção por tunelamento banda-a-banda.',
    operation: 'Em vez de termionicamente injetar portadores sobre uma barreira, o TFET utiliza tunelamento banda-a-banda (BTBT) na junção source P+/canal. Isso permite inclinação subthreshold menor que 60 mV/dec (limite Boltzmann).',
    advantages: 'Operação em baixíssimas tensões (<0,5 V), baixíssimo consumo.',
    applications: 'Futuros CIs ultra-baixo consumo, IoT, sensores autônomos.',
    why: 'O MOSFET está fundamentalmente preso ao limite Boltzmann (SS ≥ 60 mV/dec a 300 K), o que impede reduzir V_DD abaixo de ~0,5 V sem explodir leakage. O TFET rompe esse limite usando tunelamento, habilitando IoT com colheita de energia.',
    layers: [
      { name: 'Source P+', material: 'Si, Ge ou InGaAs', doping: 'Degenerada, ~1×10²⁰ (B)', role: 'Reservatório de lacunas e fornecedor da junção de tunelamento.', impact: 'Dopagem altíssima e abrupta é crítica: define a largura da barreira BTBT (∝ 1/√N); mais dopado → tunelamento maior (I_on maior).' },
      { name: 'Canal intrínseco', material: 'Si/Ge/InGaAs não dopado', doping: 'Intrínseco', role: 'Região onde o gate alinha as bandas.', impact: 'Sem impurezas → barreira bem definida, I_off baixíssimo; qualquer dopagem residual degrada SS.' },
      { name: 'Drain N+', material: 'Si ou InGaAs', doping: '~1×10²⁰ (As)', role: 'Coletor de elétrons tunelados.', impact: 'Assimetria P+/i/N+ cria retificação que dá o comportamento unidirecional característico.' },
      { name: 'Dielétrico high-κ', material: 'HfO₂', doping: '—', role: 'Acopla o gate ao canal para alinhar bandas.', impact: 'Alta κ é imprescindível: o tunelamento depende da curvatura abrupta de banda no canal, só obtida com forte acoplamento eletrostático.' },
      { name: 'Metal gate', material: 'TiN ou similar', doping: '—', role: 'Controla o alinhamento E_C(canal) com E_V(source).', impact: 'Função trabalho ajustada reduz V_TH e maximiza janela útil em <0,5 V.' }
    ]
  },
  tft: {
    name: 'TFT (Thin-Film)',
    tag: 'Displays',
    summary: 'Transistor em filme fino sobre vidro/plástico.',
    operation: 'Uma camada fina de semicondutor (a-Si, LTPS ou IGZO) é depositada sobre um substrato isolante (vidro). Gate bottom-gate com dielétrico (SiNx/SiO₂). Baixa temperatura de processo permite áreas muito grandes.',
    advantages: 'Área grande, processo em vidro/plástico, baixo custo.',
    applications: 'Backplane de LCD/OLED, AMOLED, e-paper, raios-X digital.',
    why: 'Painéis de vários metros quadrados exigem processo de baixa temperatura (não dá para crescer Si cristalino). Filmes finos (a-Si, LTPS, IGZO) são depositados diretamente sobre vidro, e cada pixel recebe seu próprio transistor.',
    layers: [
      { name: 'Substrato', material: 'Vidro ou plástico (PI)', doping: '—', role: 'Base mecânica.', impact: 'Limita temperatura de processo (<350 °C para vidro, <250 °C para plástico).' },
      { name: 'Gate (bottom)', material: 'Mo, Al, Cu', doping: '—', role: 'Eletrodo de controle.', impact: 'Metal de baixa resistência é essencial para backplanes grandes (uniformidade de sinal).' },
      { name: 'Dielétrico', material: 'SiNₓ, SiO₂ (PECVD) ou Al₂O₃ (ALD)', doping: 'Isolante', role: 'Isolação de gate.', impact: 'SiNx tem armadilhas que deslocam V_TH ao longo do tempo (stress bias) — grande problema em AMOLED.' },
      { name: 'Semicondutor em filme', material: 'a-Si:H (µ≈1), LTPS (µ≈100) ou IGZO (µ≈10)', doping: 'a-Si: levemente n por hidrogênio; IGZO: elétrons provenientes de vacâncias de oxigênio; LTPS: pode ser dopado por implantação', role: 'Canal do transistor.', impact: 'Em IGZO, controlar a estequiometria de O define n_e: excesso de vacâncias → canal sempre ligado (V_TH negativo); falta → TFT "morto".' },
      { name: 'Source / Drain', material: 'Mo ou Ti/Al/Ti', doping: 'Região localmente reduzida no IGZO (rica em oxigênio ausente)', role: 'Contato ôhmico.', impact: 'Tratamento de plasma cria camada n+ efetiva em IGZO para baixar R_c sem implantação.' }
    ]
  },
  vpower: {
    name: 'Vertical GaAs/GaN Power',
    tag: 'Potência vertical',
    summary: 'Corrente vertical através de drift N⁻ espesso.',
    operation: 'Estrutura vertical: source e gate no topo, drain no fundo. O drift N⁻ espesso suporta alta tensão bloqueada. Quando o gate inverte o canal no P-body, elétrons fluem verticalmente até o drain.',
    advantages: 'Suporta V_DS muito alto, densidade de corrente elevada.',
    applications: 'Conversão de energia em veículos elétricos, fontes industriais, GaN/SiC de potência.',
    why: 'Para inversores de tração (>600 V, centenas de A) a geometria vertical distribui calor pelo chip inteiro e aproveita substrato como terminal de dreno. Em SiC/GaN, o campo crítico ~10× maior que Si permite drift 10× mais fino → menor R_on·A.',
    layers: [
      { name: 'Substrato N+ (drain)', material: 'SiC, GaN ou Si', doping: 'Degenerada, ~1×10¹⁹', role: 'Terminal de dreno ôhmico pela parte inferior.', impact: 'Alta dopagem garante baixa resistência de substrato; sua condutividade térmica define a dissipação.' },
      { name: 'Buffer N (opcional)', material: 'SiC/GaN epi', doping: '~1×10¹⁷', role: 'Transição para drift e field-stop.', impact: 'Permite drift mais fino sem punch-through.' },
      { name: 'Drift N⁻', material: 'SiC/GaN epitaxial', doping: 'Leve, ~1×10¹⁴ – 1×10¹⁶', role: 'Suporta toda V_DS em bloqueio.', impact: 'Principal trade-off R_on × V_BR: R_on,sp ∝ V_BR²·⁵/(µ·E_c³). É por isso que SiC/GaN vencem Si em potência (E_c ~10× maior).' },
      { name: 'P-body', material: 'SiC/GaN', doping: '~1×10¹⁷ (Al em SiC, Mg em GaN)', role: 'Região onde o canal de inversão é formado.', impact: 'Dopagem define V_TH e a robustez ao punch-through; em GaN é ainda um desafio (ativação de Mg).' },
      { name: 'N+ source', material: 'SiC/GaN', doping: '~1×10²⁰', role: 'Fornecedor de elétrons para o canal.', impact: 'Dopagem alta reduz R_c e permite alta densidade de corrente.' },
      { name: 'Trench gate + óxido', material: 'Poly-Si ou metal sobre SiO₂/Al₂O₃', doping: 'Gate poly N+ ou metal', role: 'Canal MOS vertical no P-body.', impact: 'Geometria em trench multiplica a largura efetiva do canal, reduzindo R_on(canal); a qualidade do óxido em SiC (interface SiC/SiO₂) é historicamente o maior desafio.' }
    ]
  }
};

export default { ui, catalog };
