/**
 * Banco compartilhado de questões/conceitos centrais.
 *
 * Cada item tem:
 *   - id          (chave estável)
 *   - question    (pergunta literal traduzida do livro Neamen)
 *   - shortAnswer (resposta resumida em 1-2 linhas)
 *   - keyPoints   (bullets que estruturam uma boa resposta)
 *   - formulas    (fórmulas-chave em LaTeX, opcional)
 *   - tabs        (lista de IDs de abas que demonstram o conceito)
 *   - depth       ("conceitual" | "matemático")
 */
export const QUESTOES = [
  {
    id: 'q1',
    question: 'O que é o modelo de Kronig-Penney? O que ele representa?',
    shortAnswer:
      'É um modelo unidimensional simplificado de cristal: uma sequência periódica de poços e barreiras retangulares que representa o potencial dos núcleos atômicos vistos por um elétron.',
    keyPoints: [
      'Aproximação 1D do potencial periódico real V(x+a) = V(x) que um elétron encontra em um cristal.',
      'No limite delta (b→0, V₀→∞ com bV₀ = const) reduz-se a uma equação transcendental tratável analiticamente.',
      'Permite resolver a equação de Schrödinger explicitamente e visualizar a origem das bandas permitidas e proibidas.',
      'Não captura efeitos 3D nem detalhes orbitais, mas explica qualitativamente toda a estrutura de bandas dos semicondutores.',
    ],
    formulas: [
      String.raw`P\,\dfrac{\sin(\alpha a)}{\alpha a} + \cos(\alpha a) = \cos(k a)`,
      String.raw`\alpha = \dfrac{\sqrt{2 m E}}{\hbar},\quad P = \dfrac{m a V_0 b}{\hbar^2}`,
    ],
    tabs: ['kp', 'allowed', 'atomband'],
    depth: 'matemático',
  },
  {
    id: 'q2',
    question: 'Cite dois resultados de aplicar o modelo de Kronig-Penney à equação de Schrödinger.',
    shortAnswer:
      '(i) Existência de bandas de energia permitidas separadas por bandas proibidas (gaps); (ii) Relação E(k) periódica → momento de cristal e ondas de Bloch.',
    keyPoints: [
      'Resultado 1 — Bandas: a equação |LHS(E)| ≤ 1 só tem solução para certos intervalos de E. Esses intervalos são as bandas permitidas; o complemento são as bandas proibidas (gaps).',
      'Resultado 2 — Estrutura de zonas: a relação E(k) é periódica em k com período 2π/a; basta considerar k ∈ [-π/a, π/a] (1ª zona de Brillouin).',
      'Resultado 3 (corolário) — Função de onda: ψ(x) = u(x)·e^{ikx} (onda de Bloch), onde u(x) tem a periodicidade da rede.',
      'Resultado 4 (corolário) — Massa efetiva: a curvatura d²E/dk² nos extremos define m*, generalização de Newton para portadores no cristal.',
    ],
    formulas: [
      String.raw`\psi(x) = u(x)\,e^{ikx},\quad u(x+a) = u(x)`,
      String.raw`E(k+2\pi/a) = E(k)`,
    ],
    tabs: ['kp', 'allowed', 'kspace'],
    depth: 'matemático',
  },
  {
    id: 'q3',
    question: 'O que é massa efetiva? Como ela é definida a partir do diagrama E×k?',
    shortAnswer:
      'É a massa que um portador "parece ter" sob ação de uma força externa quando levamos em conta o potencial periódico do cristal. Define-se como o inverso da curvatura de E(k) no extremo da banda.',
    keyPoints: [
      'Definição matemática: 1/m* = (1/ℏ²) · d²E/dk² avaliada no extremo da banda.',
      'Bandas mais "abertas" (curvatura maior) ⇒ m* menor ⇒ portadores mais "leves" e rápidos.',
      'Em cristais anisotrópicos m* é um tensor; em pontos de simetria reduz-se a escalar.',
      'Permite usar F_externa = m*·a (lei de Newton) escondendo todas as forças internas do cristal em m*.',
      'Para a lacuna: define-se m*_p = −ℏ²/(d²E/dk²) > 0 no topo da BV (curvatura negativa).',
    ],
    formulas: [
      String.raw`\dfrac{1}{m^*} = \dfrac{1}{\hbar^2}\dfrac{d^2 E(k)}{dk^2}`,
      String.raw`F_{ext} = m^*\,a,\quad v_g = \dfrac{1}{\hbar}\dfrac{dE}{dk}`,
    ],
    tabs: ['kspace', 'effmass', 'particles'],
    depth: 'matemático',
  },
  {
    id: 'q4',
    question: 'O que é um semicondutor de gap direto? E de gap indireto?',
    shortAnswer:
      'Direto: o mínimo da banda de condução e o máximo da banda de valência ocorrem no mesmo k. Indireto: estão deslocados em k.',
    keyPoints: [
      'Gap direto (ex.: GaAs, InP): transição banda-a-banda conserva momento naturalmente — apenas um fóton (E≈Eg) basta. Excelente para LEDs, lasers e células fotovoltaicas finas.',
      'Gap indireto (ex.: Si, Ge): transição precisa também de um fônon para fornecer Δk. Probabilidade muito menor — fraco emissor de luz.',
      'Em Si, o mínimo da BC fica próximo do ponto X (k ≈ 0.85·2π/a); em Ge, no ponto L; em GaAs, no Γ (k=0).',
      'O valor de Eg é o mesmo nos dois casos; o que muda é a posição relativa em k dos extremos.',
      'Implicação prática: LEDs e lasers usam quase exclusivamente gap direto (GaAs, GaN, InGaN). Si domina eletrônica mas é péssimo para emissão luminosa.',
    ],
    formulas: [
      String.raw`\text{Direto: } k_{BC,min} = k_{BV,max}`,
      String.raw`\text{Indireto: } k_{BC,min} \neq k_{BV,max} \Rightarrow \text{precisa fônon } \Delta k`,
    ],
    tabs: ['kspace'],
    depth: 'conceitual',
  },
  {
    id: 'q5',
    question: 'Qual o significado da função densidade de estados g(E)?',
    shortAnswer:
      'É o número de estados quânticos disponíveis por unidade de energia e por unidade de volume.',
    keyPoints: [
      'Unidades: estados / (eV · cm³) (ou /(J · m³) em SI).',
      'Permite calcular grandezas integrais: n = ∫ g(E)·f(E) dE; p = ∫ g(E)·(1−f(E)) dE.',
      'Na BC tem origem em E_c e cresce com √(E−E_c); na BV cresce simetricamente abaixo de E_v.',
      'É ditada apenas pela estrutura de bandas (massa efetiva, dimensão), independe da temperatura ou dopagem.',
      'Em cristais 2D (poços quânticos) g(E) é constante por degraus; em 1D (fios quânticos) g(E) ∝ 1/√E; em 0D (pontos) é discreta.',
    ],
    formulas: [
      String.raw`n = \int_{E_c}^{\infty} g_c(E)\,f(E)\,dE`,
    ],
    tabs: ['dos'],
    depth: 'matemático',
  },
  {
    id: 'q6',
    question: 'Que modelo matemático foi usado para deduzir a função densidade de estados?',
    shortAnswer:
      'O poço de potencial infinito tridimensional (caixa cúbica de aresta L com paredes infinitas).',
    keyPoints: [
      'As condições de contorno ψ = 0 nas paredes forçam k_x = n_x π/L, k_y = n_y π/L, k_z = n_z π/L.',
      'Os estados ocupam um reticulado cúbico de espaçamento π/L no espaço-k.',
      'Densidade de estados no espaço-k: V/(π³) por octante (com fator 2 de spin).',
      'Energia: E = ℏ²(k_x² + k_y² + k_z²)/(2m), com superfícies de energia constante sendo esferas.',
      'Contar estados em uma casca esférica dk leva diretamente a g(E) = (1/2π²)(2m/ℏ²)^{3/2}·√E.',
      'Para bandas reais, m → m* (massa efetiva) e a origem de energia é E_c (BC) ou E_v (BV).',
    ],
    formulas: [
      String.raw`E = \dfrac{\hbar^2 \pi^2}{2 m L^2}(n_x^2 + n_y^2 + n_z^2)`,
    ],
    tabs: ['dos'],
    depth: 'matemático',
  },
  {
    id: 'q7',
    question: 'Em geral, qual a relação entre densidade de estados e energia?',
    shortAnswer:
      'Em 3D, g(E) ∝ √E (medindo E a partir do extremo da banda).',
    keyPoints: [
      '3D (semicondutor bulk): g(E) ∝ √(E − E_c) para a BC e g(E) ∝ √(E_v − E) para a BV.',
      '2D (poços quânticos): g(E) é constante em cada sub-banda — degraus.',
      '1D (fios quânticos / nanowires): g(E) ∝ 1/√E (van Hove singularities).',
      '0D (pontos quânticos): g(E) é uma soma de funções delta (níveis discretos).',
      'Esta diferença é a base da física dos dispositivos nanométricos modernos.',
    ],
    formulas: [
      String.raw`g_{3D}(E) = \dfrac{1}{2\pi^2}\!\left(\dfrac{2 m^*}{\hbar^2}\right)^{3/2}\!\sqrt{E - E_c}`,
    ],
    tabs: ['dos'],
    depth: 'matemático',
  },
  {
    id: 'q8',
    question: 'Qual o significado da função de probabilidade de Fermi-Dirac?',
    shortAnswer:
      'É a probabilidade de que um estado quântico de energia E esteja ocupado por um elétron em equilíbrio térmico.',
    keyPoints: [
      'Para férmions (elétrons), apenas valores 0 ≤ f(E) ≤ 1, refletindo o princípio de exclusão de Pauli.',
      'Em T = 0 K: f(E) é um degrau perfeito em E_F (todos estados abaixo cheios, todos acima vazios).',
      'Em T > 0: transição suave em torno de E_F, com largura ~k_BT (≈26 meV a 300 K).',
      'f(E_F) = 1/2 sempre que T > 0 (ponto de simetria).',
      'Para |E−E_F| ≫ k_BT (estados raramente ocupados ou raramente vazios) reduz-se à Maxwell-Boltzmann clássica.',
    ],
    formulas: [
      String.raw`f(E) = \dfrac{1}{1 + \exp\!\left(\dfrac{E - E_F}{k_B T}\right)}`,
    ],
    tabs: ['fermi'],
    depth: 'matemático',
  },
  {
    id: 'q9',
    question: 'O que é a energia de Fermi (E_F)?',
    shortAnswer:
      'É o potencial químico dos elétrons; a energia em que f(E) = 1/2. Marca o limite entre estados majoritariamente ocupados e majoritariamente vazios.',
    keyPoints: [
      'Em T = 0 K: é a energia do estado ocupado mais alto. Todos os estados E < E_F estão cheios; E > E_F estão vazios.',
      'Determinada pela condição global de neutralidade de carga (n + N_A^- = p + N_D^+).',
      'Em metal: dentro de uma banda permitida (sempre há estados disponíveis acima de E_F).',
      'Em semicondutor intrínseco: aproximadamente no meio do gap; deslocada por (k_BT/2)·ln(N_v/N_c).',
      'Tipo-n (P): E_F desloca-se para perto de E_c. Tipo-p (B): desloca-se para perto de E_v.',
      'Em equilíbrio termodinâmico, E_F é constante em todo o sistema (mesmo em junções).',
    ],
    formulas: [
      String.raw`E_F: f(E_F) = \tfrac{1}{2}`,
      String.raw`E_{Fi} = \tfrac{E_c + E_v}{2} + \tfrac{k_B T}{2}\ln\!\dfrac{N_v}{N_c}`,
    ],
    tabs: ['fermi', 'overview'],
    depth: 'conceitual',
  },
];

export const TAB_LABELS = {
  objectives: '🎯 Roteiro de Estudo',
  conceptsQ:  '📖 Conceitos das Questões',
  questions:  '❓ Questões',
  about:      '👤 Sobre',
  overview:   'Visão Geral',
  lattice:    'Rede Cristalina',
  atomband:   'Átomos → Bandas',
  allowed:    'Bandas Permitidas/Proibidas',
  kp:         'Kronig-Penney',
  mis:        'Metal × Isolante × Semicondutor',
  kspace:     'Espaço-k (Si × GaAs)',
  effmass:    'Massa Efetiva',
  particles:  'Elétron × Lacuna',
  fermi:      'Fermi-Dirac & MB',
  dos:        'Densidade de Estados',
  arrhenius:  'n(T) Arrhenius',
  formulas:   'Fórmulas & Derivações',
};
