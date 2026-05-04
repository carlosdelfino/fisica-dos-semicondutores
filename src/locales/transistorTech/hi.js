// हिन्दी अनुवाद — "ट्रांजिस्टर निर्माण प्रौद्योगिकियाँ" पैनल
const ui = {
  title: '🔬 ट्रांजिस्टर निर्माण प्रौद्योगिकियाँ',
  intro: '10nm से 1.6nm तक अर्धचालक निर्माण प्रौद्योगिकियों के विकास का अन्वेषण करें। ट्रांजिस्टरों के आयामों की तुलना करें और समझें कि लघुकरण प्रदर्शन को कैसे प्रभावित करता है।',
  controls: {
    play: '▶️ ऑटो-प्ले',
    pause: '⏸️ रोकें',
    showComparison: '🔍 तुलना दिखाएँ',
    hideComparison: '🔍 तुलना छिपाएँ'
  },
  card: {
    nodeSize: 'नोड का आकार:',
    gateLength: 'गेट लंबाई:',
    pitch: 'पिच:',
    density: 'घनत्व:'
  },
  status: {
    legacy: 'विरासत',
    mature: 'परिपक्व',
    current: 'वर्तमान',
    'cutting-edge': 'अग्रणी',
    upcoming: 'आगामी',
    future: 'भावी'
  },
  detail: {
    description: '📋 विवरण',
    applications: '🏭 अनुप्रयोग',
    period: '📅 अवधि',
    power: '⚡ ऊर्जा दक्षता',
    zoomTitle: '🔍 ज़ूम दृश्य',
    reset: 'रीसेट',
    comparisonTitle: 'पैमाने की तुलना',
    biggerThan: '{n}× बड़ा',
    parallelTitle: '📊 सभी प्रौद्योगिकियों का समानांतर दृश्य'
  },
  units: { nm: 'nm', um: 'µm' },
  comparison: {
    hair: 'मानव बाल',
    cell: 'मानव कोशिका',
    bacteria: 'E. coli जीवाणु',
    virus: 'वायरस',
    dna: 'DNA (चौड़ाई)',
    silicon: 'सिलिकॉन परमाणु'
  },
  info: {
    sectionTitle: '📚 अतिरिक्त जानकारी',
    node: {
      title: '🎯 प्रौद्योगिकी "नोड" क्या है?',
      body: 'नोड संख्या (जैसे 5nm) ऐतिहासिक रूप से ट्रांजिस्टर के गेट की लंबाई को दर्शाती थी। आज यह मुख्यतः निर्माण प्रक्रिया के घनत्व और प्रदर्शन का विपणन सूचक है।'
    },
    finfetGaa: {
      title: '🔬 FinFET बनाम GAAFET',
      body: 'FinFET (Fin Field-Effect Transistor) एक ऊर्ध्वाधर सिलिकॉन "फिन" का उपयोग करता है। GAAFET (Gate-All-Around) चैनल को सभी ओर से गेट से लपेटता है, जिससे बेहतर नियंत्रण और कम लीकेज मिलता है।'
    },
    euv: {
      title: '⚡ EUV लिथोग्राफी',
      body: 'एक्सट्रीम अल्ट्रावायलेट लिथोग्राफी 13.5nm प्रकाश का उपयोग करके अत्यंत छोटे पैटर्न मुद्रित करती है। 7nm से छोटे नोड्स के लिए आवश्यक। 193nm इमर्शन लिथोग्राफी का स्थान लिया।'
    },
    moore: {
      title: '📈 मूर का नियम',
      body: 'मूर के नियम ने अनुमान लगाया कि ट्रांजिस्टरों की संख्या हर 2 वर्षों में दोगुनी होगी। निरंतर लघुकरण (10nm → 7nm → 5nm → 3nm → 2nm → 1.6nm) बढ़ती भौतिक चुनौतियों के बावजूद इस प्रवृत्ति को बनाए रखता है।'
    }
  }
};

const catalog = {
  '10nm': {
    name: '10 नैनोमीटर',
    description: 'पुराने कंप्यूटरों और लैपटॉप में व्यापक रूप से उपयोग किया जाता है। उत्पादन पैमाने पर FinFET की पहली पीढ़ी।',
    applications: 'Intel Kaby/Coffee Lake प्रोसेसर, AMD Ryzen 1000/2000',
    year: '2016-2017',
    density: '37.5 MTr/mm²',
    power: '14nm की तुलना में ऊर्जा दक्षता में महत्वपूर्ण सुधार'
  },
  '7nm': {
    name: '7 नैनोमीटर',
    description: 'पूर्व पीढ़ियों के स्मार्टफोन प्रोसेसर और उच्च प्रदर्शन कंप्यूटिंग में बहुत आम। EUV (Extreme Ultraviolet) पेश किया गया।',
    applications: 'Apple A13/A14, AMD Ryzen 3000/4000/5000, Snapdragon 865/888',
    year: '2018-2020',
    density: '96.5 MTr/mm²',
    power: '10nm से 40% अधिक कुशल'
  },
  '5nm': {
    name: '5 नैनोमीटर',
    description: '2022-2024 के प्रीमियम उपकरणों में मानक। उच्च-वॉल्यूम EUV। अधिक घने और कुशल ट्रांजिस्टर।',
    applications: 'Apple A15/A16, M1/M2/M3, Snapdragon 8 Gen 1/2/3, Ryzen 6000/7000',
    year: '2020-2022',
    density: '171.3 MTr/mm²',
    power: '7nm से 30% अधिक कुशल'
  },
  '3nm': {
    name: '3 नैनोमीटर',
    description: 'वर्तमान में TSMC और Samsung द्वारा बड़े पैमाने पर उत्पादन में। Apple A17 Pro और उत्तराधिकारी। कुछ कार्यान्वयनों में Gate-All-Around (GAA)।',
    applications: 'Apple A17 Pro, M4, Snapdragon 8 Gen 4, भविष्य के उच्च-प्रदर्शन चिप्स',
    year: '2023-2024',
    density: '215 MTr/mm²',
    power: '5nm से 35% अधिक कुशल'
  },
  '2nm': {
    name: '2 नैनोमीटर',
    description: 'अगली प्रमुख तकनीकी छलांग। बड़े पैमाने पर उत्पादन 2025-2026 के लिए अपेक्षित। GAAFET (Gate-All-Around) उच्च घनत्व और दक्षता प्रदान करता है।',
    applications: 'भविष्य के Apple, AMD, NVIDIA प्रोसेसर (अपेक्षित)',
    year: '2025-2026 (अपेक्षित)',
    density: '>500 MTr/mm² (अनुमानित)',
    power: '3nm से 25-30% अधिक कुशल'
  },
  a16: {
    name: '1.6nm (A16)',
    description: 'nanosheet वास्तुकला और "Super Power Rail" के साथ TSMC A16। उत्पादन 2026 के लिए अपेक्षित। अधिकतम नियंत्रण के लिए Nanosheet ट्रांजिस्टर।',
    applications: 'भविष्य के अति-उच्च प्रदर्शन चिप्स (अपेक्षित)',
    year: '2026 (अपेक्षित)',
    density: '>800 MTr/mm² (अनुमानित)',
    power: '2nm से 20-25% अधिक कुशल'
  }
};

export default { ui, catalog };
