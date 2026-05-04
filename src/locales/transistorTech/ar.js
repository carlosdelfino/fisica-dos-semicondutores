// ترجمة عربية — لوحة "تقنيات تصنيع الترانزستورات"
const ui = {
  title: '🔬 تقنيات تصنيع الترانزستورات',
  intro: 'استكشف تطور تقنيات تصنيع أشباه الموصلات من 10 نانومتر إلى 1.6 نانومتر. قارن أبعاد الترانزستورات وافهم كيف يؤثر التصغير على الأداء.',
  controls: {
    play: '▶️ تشغيل تلقائي',
    pause: '⏸️ إيقاف مؤقت',
    showComparison: '🔍 إظهار المقارنة',
    hideComparison: '🔍 إخفاء المقارنة'
  },
  card: {
    nodeSize: 'حجم العقدة:',
    gateLength: 'طول البوابة:',
    pitch: 'الخطوة:',
    density: 'الكثافة:'
  },
  status: {
    legacy: 'تراثي',
    mature: 'ناضج',
    current: 'حالي',
    'cutting-edge': 'متقدم',
    upcoming: 'قادم',
    future: 'مستقبلي'
  },
  detail: {
    description: '📋 الوصف',
    applications: '🏭 التطبيقات',
    period: '📅 الفترة',
    power: '⚡ كفاءة الطاقة',
    zoomTitle: '🔍 عرض بالتكبير',
    reset: 'إعادة',
    comparisonTitle: 'مقارنة المقياس',
    biggerThan: 'أكبر بـ {n}×',
    parallelTitle: '📊 عرض متوازٍ لجميع التقنيات'
  },
  units: { nm: 'نانومتر', um: 'ميكرومتر' },
  comparison: {
    hair: 'شعرة بشرية',
    cell: 'خلية بشرية',
    bacteria: 'بكتيريا E. coli',
    virus: 'فيروس',
    dna: 'DNA (العرض)',
    silicon: 'ذرة سيليكون'
  },
  info: {
    sectionTitle: '📚 معلومات إضافية',
    node: {
      title: '🎯 ما هي "العقدة" التقنية؟',
      body: 'كان رقم العقدة (مثال: 5 نانومتر) يشير تاريخياً إلى طول بوابة الترانزستور. أما اليوم فهو في الغالب مؤشر تسويقي للكثافة العامة وأداء عملية التصنيع.'
    },
    finfetGaa: {
      title: '🔬 FinFET مقابل GAAFET',
      body: 'يستخدم FinFET زعنفة سيليكون عمودية. أما GAAFET (Gate-All-Around) فيلف القناة بالبوابة من جميع الجوانب، مما يوفر تحكماً أفضل وتسرّباً أقل.'
    },
    euv: {
      title: '⚡ ليثوغرافيا EUV',
      body: 'تستخدم ليثوغرافيا فوق البنفسجية المتطرفة ضوءاً بطول موجة 13.5 نانومتر لطباعة أنماط متناهية الصغر. ضرورية للعقد أقل من 7 نانومتر. حلت محل ليثوغرافيا الغمر 193 نانومتر.'
    },
    moore: {
      title: '📈 قانون مور',
      body: 'توقع قانون مور أن يتضاعف عدد الترانزستورات كل سنتين. التصغير المستمر (10nm → 7nm → 5nm → 3nm → 2nm → 1.6nm) يحافظ على هذا الاتجاه رغم التحديات الفيزيائية المتزايدة.'
    }
  }
};

const catalog = {
  '10nm': {
    name: '10 نانومتر',
    description: 'مستخدم على نطاق واسع في الحواسيب والمحمولة الأقدم. الجيل الأول من FinFET بمقياس الإنتاج.',
    applications: 'معالجات Intel Kaby/Coffee Lake وAMD Ryzen 1000/2000',
    year: '2016-2017',
    density: '37.5 MTr/mm²',
    power: 'تحسين كبير في كفاءة الطاقة مقارنة بـ 14nm'
  },
  '7nm': {
    name: '7 نانومتر',
    description: 'شائع جداً في معالجات الهواتف الذكية لأجيال سابقة وفي الحوسبة عالية الأداء. تم إدخال EUV (الأشعة فوق البنفسجية المتطرفة).',
    applications: 'Apple A13/A14، AMD Ryzen 3000/4000/5000، Snapdragon 865/888',
    year: '2018-2020',
    density: '96.5 MTr/mm²',
    power: 'أكثر كفاءة بنسبة 40% من 10nm'
  },
  '5nm': {
    name: '5 نانومتر',
    description: 'معيار في الأجهزة المتميزة 2022-2024. EUV بحجم إنتاج عالٍ. ترانزستورات أكثر كثافة وكفاءة.',
    applications: 'Apple A15/A16، M1/M2/M3، Snapdragon 8 Gen 1/2/3، Ryzen 6000/7000',
    year: '2020-2022',
    density: '171.3 MTr/mm²',
    power: 'أكثر كفاءة بنسبة 30% من 7nm'
  },
  '3nm': {
    name: '3 نانومتر',
    description: 'حالياً في الإنتاج الكمي لدى TSMC وSamsung. Apple A17 Pro وما بعده. Gate-All-Around (GAA) في بعض التنفيذات.',
    applications: 'Apple A17 Pro، M4، Snapdragon 8 Gen 4، رقائق المستقبل عالية الأداء',
    year: '2023-2024',
    density: '215 MTr/mm²',
    power: 'أكثر كفاءة بنسبة 35% من 5nm'
  },
  '2nm': {
    name: '2 نانومتر',
    description: 'القفزة التقنية الكبرى التالية. الإنتاج الكمي متوقع لعامي 2025-2026. يوفر GAAFET (Gate-All-Around) كثافة وكفاءة أعلى.',
    applications: 'معالجات Apple وAMD وNVIDIA المستقبلية (متوقعة)',
    year: '2025-2026 (متوقع)',
    density: '>500 MTr/mm² (تقديري)',
    power: 'أكثر كفاءة بنسبة 25-30% من 3nm'
  },
  a16: {
    name: '1.6 نانومتر (A16)',
    description: 'TSMC A16 ببنية الـ nanosheet و"Super Power Rail". الإنتاج متوقع في 2026. ترانزستورات nanosheet لأقصى تحكم.',
    applications: 'رقائق مستقبلية فائقة الأداء (متوقعة)',
    year: '2026 (متوقع)',
    density: '>800 MTr/mm² (تقديري)',
    power: 'أكثر كفاءة بنسبة 20-25% من 2nm'
  }
};

export default { ui, catalog };
