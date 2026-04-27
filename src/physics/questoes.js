/**
 * Banco de questões organizado em MÓDULOS.
 *
 * Estrutura escalável: cada módulo é um capítulo do livro/tópico de estudo.
 * Para adicionar um novo módulo (BJT, MOSFET, células solares, etc.) basta
 * criar um array de questões e registrá-lo em MODULOS.
 *
 * Cada questão tem:
 *   - id          (chave estável)
 *   - question    (pergunta literal)
 *   - shortAnswer (resposta resumida em 1-2 linhas)
 *   - keyPoints   (bullets que estruturam uma boa resposta)
 *   - formulas    (fórmulas-chave em LaTeX, opcional)
 *   - tabs        (lista de IDs de abas que demonstram o conceito)
 *   - depth       ("conceitual" | "matemático")
 */

// ──────────────────────────────────────────────────────────────────────────────
// MÓDULO 1 — Introdução à Física dos Semicondutores (Neamen, cap. 3)
// ──────────────────────────────────────────────────────────────────────────────
export const QUESTOES_INTRO = [
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

// ──────────────────────────────────────────────────────────────────────────────
// MÓDULO 2 — Introdução aos Componentes PN (Neamen, cap. 4-7)
// ──────────────────────────────────────────────────────────────────────────────
export const QUESTOES_PN = [
  {
    id: 'pn1',
    question: 'O que é uma junção PN? Como ela se forma fisicamente?',
    shortAnswer:
      'É a interface, dentro de um único cristal semicondutor, entre uma região dopada com aceitadores (tipo P) e outra com doadores (tipo N). Forma-se por difusão ou implantação iônica de dopantes opostos no mesmo substrato.',
    keyPoints: [
      'Não é a justaposição de dois cristais — é o mesmo cristal com dopagens locais distintas.',
      'Métodos de fabricação: difusão térmica (ex.: Boro num substrato N), implantação iônica, epitaxia, ligas crescidas.',
      'Pode ser abrupta (N_d/N_a muda em poucos átomos) ou gradual (linear, gaussiana, erfc).',
      'Em equilíbrio, a transição cria um potencial built-in V_bi e uma camada de depleção.',
      'É o tijolo fundamental de diodos, BJTs (duas junções), células solares, LEDs e muitos sensores.',
    ],
    formulas: [
      String.raw`\text{P: } N_a \gg n_i \;\;|\;\; \text{N: } N_d \gg n_i`,
    ],
    tabs: ['junction'],
    depth: 'conceitual',
  },
  {
    id: 'pn2',
    question: 'O que é a camada de depleção e por que ela surge em equilíbrio?',
    shortAnswer:
      'Região vizinha à junção esvaziada de portadores móveis, contendo apenas as cargas iônicas fixas dos dopantes ionizados (N_a⁻ no lado P, N_d⁺ no lado N).',
    keyPoints: [
      'No instante da formação, elétrons (lado N) e lacunas (lado P) difundem por gradiente de concentração.',
      'Ao saírem, deixam para trás íons fixos (cargas espaciais): N_a⁻ no lado P e N_d⁺ no lado N.',
      'Esses íons criam um campo elétrico E que aponta de N para P, freando a difusão posterior.',
      'O equilíbrio é atingido quando J_drift = −J_diff exatamente para elétrons e lacunas.',
      'A largura W depende de N_a, N_d, V_bi e de uma eventual tensão aplicada V_a.',
      'Largura típica em Si moderadamente dopado: 0.1–1 µm.',
    ],
    formulas: [
      String.raw`W = \sqrt{\dfrac{2\varepsilon_s (V_{bi} - V_a)}{q}\!\left(\dfrac{N_a + N_d}{N_a N_d}\right)}`,
      String.raw`x_n = \dfrac{N_a}{N_a+N_d}\,W,\quad x_p = \dfrac{N_d}{N_a+N_d}\,W`,
    ],
    tabs: ['junction'],
    depth: 'matemático',
  },
  {
    id: 'pn3',
    question: 'O que é o potencial built-in V_bi? Como é calculado?',
    shortAnswer:
      'Diferença de potencial eletrostático entre os dois lados da junção em equilíbrio, necessária para anular a corrente líquida. V_bi = (kT/q)·ln(N_a·N_d / n_i²).',
    keyPoints: [
      'Existe mesmo sem nenhuma fonte externa — é "interno" (built-in).',
      'Surge porque E_F deve ser constante em equilíbrio, mas E_c, E_v se deslocam dos lados N e P.',
      'Para Si dopado com N_a = N_d = 10¹⁶ cm⁻³ a 300 K: V_bi ≈ 0,7 V.',
      'É a barreira de potencial vista pelos portadores majoritários ao tentarem cruzar.',
      'Não é diretamente medível com voltímetro — perde-se nos contatos metálicos por contra-tensões.',
    ],
    formulas: [
      String.raw`V_{bi} = \dfrac{kT}{q}\ln\!\dfrac{N_a N_d}{n_i^2}`,
      String.raw`V_t = \dfrac{kT}{q} \approx 25{,}9\;\text{mV @ 300 K}`,
    ],
    tabs: ['junction'],
    depth: 'matemático',
  },
  {
    id: 'pn4',
    question: 'Diferencie corrente de difusão e corrente de deriva (drift).',
    shortAnswer:
      'Difusão: causada por gradiente de concentração, J ∝ −∇n. Deriva: causada por campo elétrico, J = q·n·μ·E. Em equilíbrio se cancelam exatamente.',
    keyPoints: [
      'Drift (deriva): força externa (campo E) acelera os portadores até a velocidade limite v_d = μ·E.',
      'Difusão: passeio aleatório térmico que tende a uniformizar concentrações; sem campo nenhum.',
      'Equação de Fick: J_n,diff = q·D_n·∇n; J_p,diff = −q·D_p·∇p.',
      'Equação de drift: J_n,drift = q·n·μ_n·E; J_p,drift = q·p·μ_p·E.',
      'Corrente total: J_n = J_n,drift + J_n,diff (idem para p).',
      'Em equilíbrio termodinâmico estrito: J_n = 0 e J_p = 0 separadamente.',
    ],
    formulas: [
      String.raw`J_n = q n \mu_n E + q D_n \dfrac{dn}{dx}`,
      String.raw`J_p = q p \mu_p E - q D_p \dfrac{dp}{dx}`,
    ],
    tabs: ['junction'],
    depth: 'matemático',
  },
  {
    id: 'pn5',
    question: 'Por que existe campo elétrico não-zero dentro de um semicondutor não-uniformemente dopado em equilíbrio?',
    shortAnswer:
      'Para que J_n = 0 (e J_p = 0), o gradiente de concentração que gera difusão precisa ser exatamente cancelado por uma corrente de deriva — o que exige um campo elétrico interno auto-induzido.',
    keyPoints: [
      'Em equilíbrio, J_n = q·n·μ_n·E + q·D_n·(dn/dx) = 0.',
      'Resolvendo: E_x = −(D_n/μ_n)·(1/n)·(dn/dx) = −(kT/q)·(1/n)·(dn/dx).',
      'Equivalente a: E_x = −(1/q)·(dE_F/dx) com E_F constante e E_c(x) inclinado.',
      'O cristal "redistribui" os elétrons localmente até criar um campo elétrico que se opõe à difusão.',
      'Esse mesmo princípio gera o campo na camada de depleção da junção PN.',
      'Em junções graduais (linearly graded), o campo é parabólico em x; em abruptas, triangular.',
    ],
    formulas: [
      String.raw`E_x = -\dfrac{kT}{q}\,\dfrac{1}{n(x)}\,\dfrac{dn}{dx}`,
      String.raw`E_x = -\dfrac{1}{q}\,\dfrac{dE_F}{dx} \;\;(\text{equil.}\Rightarrow E_F=\text{cte})`,
    ],
    tabs: ['junction'],
    depth: 'matemático',
  },
  {
    id: 'pn6',
    question: 'Enuncie a relação de Einstein. Por que ela vale mesmo fora do equilíbrio?',
    shortAnswer:
      'D/μ = kT/q (ou equivalentemente μ/D = q/kT). Liga difusividade à mobilidade via temperatura. Vale fora do equilíbrio porque μ e D dependem do mesmo mecanismo microscópico (espalhamento térmico), independente da força externa.',
    keyPoints: [
      'Mnemônico em inglês: "Dee over mu equals kay-tee over Q" — rima e gruda na memória.',
      'Forma invertida: "mu over Dee equals Q over kay-tee".',
      'Tanto μ quanto D são determinados pelo tempo médio entre colisões τ — uma quantidade térmica.',
      'D = (1/3)·v_th²·τ (passeio aleatório); μ = q·τ/m* (resposta a campo). Razão D/μ = (m*·v_th²)/(3q) = kT/q.',
      'Fora do equilíbrio (corrente líquida ≠ 0), τ ainda é térmico → relação preserva-se.',
      'Se aplica a elétrons (D_n/μ_n) e lacunas (D_p/μ_p) separadamente.',
      'Permite reduzir 4 parâmetros de transporte (μ_n, μ_p, D_n, D_p) a apenas 2 (μ_n, μ_p).',
    ],
    formulas: [
      String.raw`\boxed{\;\dfrac{D}{\mu} = \dfrac{kT}{q}\;}`,
      String.raw`\dfrac{\mu}{D} = \dfrac{q}{kT}`,
      String.raw`D_n = \mu_n \dfrac{kT}{q},\quad D_p = \mu_p \dfrac{kT}{q}`,
    ],
    tabs: ['junction'],
    depth: 'matemático',
  },
  {
    id: 'pn7',
    question: 'Qual a diferença entre material degenerado e não-degenerado?',
    shortAnswer:
      'Não-degenerado: dopagem moderada, E_F dentro do gap (≥3kT distante das bandas), Maxwell-Boltzmann válida. Degenerado: dopagem altíssima, E_F dentro da BC ou BV, comporta-se como metal e exige Fermi-Dirac integral.',
    keyPoints: [
      'Critério aproximado de não-degenerescência: E_c − E_F ≥ 3kT (lado N) ou E_F − E_v ≥ 3kT (lado P).',
      'Em Si a 300 K, isso ocorre quando N_d ≪ N_c ≈ 2,8×10¹⁹ cm⁻³ (ou N_a ≪ N_v ≈ 1,04×10¹⁹).',
      'Não-degenerado: n = N_c·exp(−(E_c−E_F)/kT) — fórmula Boltzmann simples.',
      'Degenerado: precisa integral de Fermi-Dirac F_{1/2}(η); n = N_c · (2/√π)·F_{1/2}((E_F−E_c)/kT).',
      'Materiais altamente dopados (>10¹⁹ cm⁻³): comportam-se como metais — usados em contatos ôhmicos.',
      'Limita a ionização: em material degenerado tipo P forte (B>10²⁰), N_a "fundamentalmente" sai do gap.',
      'Notação: N⁺ ou P⁺ na literatura indicam dopagem alta (geralmente 10¹⁹–10²⁰ cm⁻³, beirando a degenerescência).',
    ],
    formulas: [
      String.raw`\text{Não-deg.: } n = N_c\,e^{-(E_c - E_F)/kT}`,
      String.raw`\text{Deg.: } n = N_c\,\dfrac{2}{\sqrt{\pi}}\,F_{1/2}\!\left(\dfrac{E_F - E_c}{kT}\right)`,
    ],
    tabs: ['junction', 'fermi'],
    depth: 'matemático',
  },
  {
    id: 'pn8',
    question: 'O que acontece com a camada de depleção sob polarização direta e reversa?',
    shortAnswer:
      'Direta (V_a > 0): W diminui, barreira efetiva V_bi − V_a cai → corrente cresce exponencialmente. Reversa (V_a < 0): W aumenta, barreira cresce → praticamente só corrente de saturação reversa.',
    keyPoints: [
      'Direta: terminal P em + e N em −. V_a opõe-se a V_bi → W ↓, corrente de minoritários ↑↑.',
      'Reversa: terminal P em − e N em +. V_a soma-se a V_bi → W ↑↑, corrente desprezível (≈ I_s).',
      'Equação do diodo de Shockley: I = I_s [exp(V_a/V_t) − 1].',
      'Em reversa elevada: ruptura por avalanche (impacto-ionização) ou Zener (tunneling) — diodos Zener exploram isto.',
      'A capacitância de junção C_j ∝ 1/√(V_bi − V_a) — base dos varactores (capacitores ajustáveis por tensão).',
    ],
    formulas: [
      String.raw`I = I_s\!\left[e^{V_a/V_t} - 1\right]`,
      String.raw`W(V_a) = W_0\sqrt{1 - V_a/V_{bi}}`,
      String.raw`C_j = \dfrac{\varepsilon_s A}{W} \propto (V_{bi} - V_a)^{-1/2}`,
    ],
    tabs: ['junction'],
    depth: 'matemático',
  },
];

// ──────────────────────────────────────────────────────────────────────────────
// REGISTRO DE MÓDULOS — adicione aqui quando criar novos capítulos
// ──────────────────────────────────────────────────────────────────────────────
export const MODULOS = [
  {
    id: 'intro',
    label: 'Introdução à Física dos Semicondutores',
    shortLabel: '🔬 Intro à Física dos Semi.',
    icon: '🔬',
    description: 'Bandas de energia, Kronig-Penney, Fermi-Dirac, massa efetiva, densidade de estados.',
    questoes: QUESTOES_INTRO,
  },
  {
    id: 'pn',
    label: 'Introdução aos Componentes PN',
    shortLabel: '⚡ Componentes PN',
    icon: '⚡',
    description: 'Junções PN, depleção, V_bi, Einstein, dopagem não-uniforme, degenerescência.',
    questoes: QUESTOES_PN,
  },
  // FUTURO:
  // { id: 'bjt', label: 'Transistor Bipolar', icon: '🔁', questoes: QUESTOES_BJT },
  // { id: 'mos', label: 'MOSFET', icon: '🚪', questoes: QUESTOES_MOS },
  // { id: 'opto', label: 'Optoeletrônica', icon: '💡', questoes: QUESTOES_OPTO },
];

/** Compatibilidade retroativa — concat de todos os módulos. */
export const QUESTOES = MODULOS.flatMap((m) => m.questoes);

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
  junction:   '⚡ Junção PN',
};
