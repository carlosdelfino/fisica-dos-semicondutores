import FormulaCard from './FormulaCard.jsx';

/**
 * Painel completo com todas as fórmulas-chave da física estatística
 * de elétrons em semicondutores.
 */
export default function FormulasPanel() {
  return (
    <div className="formulas-panel">
      <h2>Estatística Quântica de Elétrons em Semicondutores</h2>

      <FormulaCard
        title="0a. Equação de Schrödinger (estacionária)"
        color="green"
        formula={String.raw`\left[ -\dfrac{\hbar^2}{2m}\nabla^2 + V(\vec{r}) \right]\psi(\vec{r}) = E\,\psi(\vec{r})`}
        description="Equação fundamental da mecânica quântica. Em um cristal, V(r) é o potencial periódico da rede. Resolvê-la com V periódico (Kronig-Penney é uma versão 1D simplificada) é o que dá origem às bandas permitidas e proibidas."
      />

      <FormulaCard
        title="0b. Poço de potencial infinito 3D"
        color="amber"
        formula={String.raw`\psi_{n_x n_y n_z}(\vec{r}) = \!\left(\dfrac{2}{L}\right)^{3/2}\!\sin\!\dfrac{n_x\pi x}{L}\sin\!\dfrac{n_y\pi y}{L}\sin\!\dfrac{n_z\pi z}{L}`}
        description="Soluções dentro de uma caixa cúbica de aresta L com paredes infinitas. Energias E = (ℏ²π²/2mL²)(n_x²+n_y²+n_z²) com n_i ∈ ℕ*. Servem de modelo simples para deduzir g(E) ∝ √E nas bandas reais."
      />

      <FormulaCard
        title="0c. Princípio da exclusão de Pauli"
        color="pink"
        formula={String.raw`|\Psi(1,2)\rangle = -|\Psi(2,1)\rangle\;\Rightarrow\; \text{2 férmions não compartilham o mesmo estado quântico}`}
        description="Função de onda antissimétrica para férmions (elétrons) implica ocupação 0 ou 1 de cada estado. É o princípio que: (1) força os N átomos a desdobrar seus níveis em N sub-níveis distintos formando bandas; (2) leva à distribuição de Fermi-Dirac em vez da clássica."
      />

      <FormulaCard
        title="0d. Desdobramento atômico em bandas"
        color="cyan"
        formula={String.raw`E_{atomic}\xrightarrow{N\,\text{átomos}}\{E_1, E_2,\dots,E_N\}\;\text{com largura}\;\Delta(r) \sim e^{-r/r_0}`}
        description="Conforme N átomos se aproximam, cada nível atômico discreto se desdobra em N sub-níveis, formando uma banda permitida. Os níveis externos (3s, 3p no Si) se desdobram primeiro porque suas funções de onda têm maior alcance espacial. As bandas BV e BC são originárias do desdobramento dos orbitais 3s e 3p, separadas pelo gap E_g."
      />

      <FormulaCard
        title="1. Distribuição de Fermi-Dirac"
        color="cyan"
        formula={String.raw`f(E) = \dfrac{1}{1 + \exp\!\left(\dfrac{E - E_F}{k_B T}\right)}`}
        description="Probabilidade de que um estado quântico de energia E esteja ocupado por um elétron, considerando o princípio de exclusão de Pauli."
        derivation={[
          { text: 'Partindo da distribuição grande-canônica para férmions indistinguíveis, com ocupação 0 ou 1:' },
          { tex: String.raw`\langle n_i \rangle = \dfrac{\sum_{n_i=0,1} n_i \, e^{-\beta(\varepsilon_i - \mu) n_i}}{\sum_{n_i=0,1} e^{-\beta(\varepsilon_i - \mu) n_i}} = \dfrac{e^{-\beta(\varepsilon_i - \mu)}}{1 + e^{-\beta(\varepsilon_i - \mu)}}` },
          { text: 'Identificando o potencial químico μ ≡ E_F (no zero termodinâmico) e β = 1/(k_BT), obtém-se a forma final.' },
        ]}
      />

      <FormulaCard
        title="2. Aproximação de Maxwell-Boltzmann"
        color="pink"
        formula={String.raw`f_{MB}(E) \approx \exp\!\left(-\dfrac{E - E_F}{k_B T}\right) \quad \text{para } E - E_F \gg k_B T`}
        description="Quando o estado é raramente ocupado (não-degenerado), o '+1' no denominador da F-D é desprezível e recupera-se a estatística clássica."
        derivation={[
          { text: 'Para E − E_F ≫ k_BT, temos exp((E−E_F)/k_BT) ≫ 1, logo:' },
          { tex: String.raw`f(E) = \dfrac{1}{1 + e^{(E-E_F)/k_BT}} \approx \dfrac{1}{e^{(E-E_F)/k_BT}} = e^{-(E-E_F)/k_BT}` },
          { text: 'Critério prático: a aproximação é boa com erro < 5% quando |E − E_F| > 3k_BT.' },
        ]}
      />

      <FormulaCard
        title="3. Densidade de Estados (3D, banda parabólica)"
        color="amber"
        formula={String.raw`g_c(E) = \dfrac{1}{2\pi^2}\!\left(\dfrac{2 m_n^*}{\hbar^2}\right)^{3/2}\!\sqrt{E - E_c},\ E\ge E_c`}
        description="Número de estados quânticos por unidade de volume e por unidade de energia, derivada da relação de dispersão E = ℏ²k²/(2m*)."
        derivation={[
          { text: 'No espaço k, o número de estados (com spin) em uma esfera de raio k é:' },
          { tex: String.raw`N(k) = 2 \cdot \dfrac{\frac{4}{3}\pi k^3}{(2\pi/L)^3} = \dfrac{V k^3}{3\pi^2}` },
          { text: 'Diferenciando e usando E − E_c = ℏ²k²/(2m_n*):' },
          { tex: String.raw`g_c(E)\,dE = \dfrac{1}{V}\dfrac{dN}{dk}\dfrac{dk}{dE}\,dE` },
          { text: 'Resulta na expressão acima. A banda de valência segue por simetria com (E_v − E).' },
        ]}
      />

      <FormulaCard
        title="4. Densidade Efetiva de Estados nas Bandas"
        color="green"
        formula={String.raw`N_c(T) = 2 \!\left(\dfrac{2\pi m_n^* k_B T}{h^2}\right)^{3/2}, \quad N_v(T) = 2 \!\left(\dfrac{2\pi m_p^* k_B T}{h^2}\right)^{3/2}`}
        description="Resultado da integral g_c(E)·exp(−(E−E_c)/k_BT) sobre toda a banda de condução, na aproximação não-degenerada."
        derivation={[
          { tex: String.raw`n = \int_{E_c}^{\infty} g_c(E) f(E)\,dE \approx \int_{E_c}^{\infty} g_c(E) e^{-(E-E_F)/k_BT} dE` },
          { text: 'Mudança de variável x = (E − E_c)/k_BT e uso de ∫₀^∞ √x e^{-x} dx = √π/2 leva a:' },
          { tex: String.raw`n = N_c\, e^{-(E_c-E_F)/k_BT}` },
        ]}
      />

      <FormulaCard
        title="5. Concentrações de Elétrons e Lacunas"
        color="cyan"
        formula={String.raw`n = N_c\,e^{-(E_c-E_F)/k_BT},\quad p = N_v\,e^{-(E_F-E_v)/k_BT}`}
        description="Concentrações de portadores em equilíbrio térmico para um semicondutor não-degenerado."
      />

      <FormulaCard
        title="6. Lei de Ação de Massas"
        color="amber"
        formula={String.raw`n \cdot p = n_i^2 = N_c N_v\, e^{-E_g/k_BT}`}
        description="Independente do nível de Fermi (e portanto da dopagem). Se aumentamos n por dopagem doadora, p decresce na mesma proporção."
      />

      <FormulaCard
        title="7. Nível de Fermi Intrínseco"
        color="green"
        formula={String.raw`E_{Fi} = \dfrac{E_c + E_v}{2} + \dfrac{k_B T}{2}\ln\!\dfrac{N_v}{N_c}`}
        description="Para Si com m*_p ≈ m*_n o segundo termo é pequeno e E_Fi ≈ midgap."
      />

      <FormulaCard
        title="8. Neutralidade de Carga (semicondutor extrínseco)"
        color="pink"
        formula={String.raw`n + N_A^- = p + N_D^+`}
        description="Combinada com n·p = n_i² fornece n e p para qualquer dopagem (assumindo ionização completa)."
        derivation={[
          { text: 'Para tipo-n com N_A = 0 e N_D ≫ n_i:' },
          { tex: String.raw`n \approx N_D, \quad p \approx \dfrac{n_i^2}{N_D}` },
          { text: 'O nível de Fermi se desloca para perto de E_c:' },
          { tex: String.raw`E_F = E_c - k_B T\,\ln\!\dfrac{N_c}{N_D}` },
        ]}
      />

      <FormulaCard
        title="9. Equação de Varshni — Eg(T)"
        color="amber"
        formula={String.raw`E_g(T) = E_g(0) - \dfrac{\alpha\,T^2}{T + \beta}`}
        description="Reduz suavemente o gap conforme a temperatura aumenta (devido à dilatação térmica e a interação elétron-fônon). Para Si: α = 4.73×10⁻⁴ eV/K, β = 636 K."
      />

      <FormulaCard
        title="10. Estatística de Bose-Einstein (fônons)"
        color="cyan"
        formula={String.raw`\langle n_{BE} \rangle = \dfrac{1}{\exp\!\left(\dfrac{\hbar\omega}{k_BT}\right) - 1}`}
        description="Quando a partícula é um bóson (fônon, fóton), o sinal '+1' vira '−1' e podemos ter ocupações múltiplas. A geração de portadores por excitação de fônons usa esta distribuição."
      />

      <FormulaCard
        title="11. Teorema de Bloch — função de onda em cristal"
        color="green"
        formula={String.raw`\psi_{n,k}(\vec{r}) = u_{n,k}(\vec{r})\,e^{i\vec{k}\cdot\vec{r}},\quad u_{n,k}(\vec{r}+\vec{R}) = u_{n,k}(\vec{r})`}
        description="Toda solução estacionária da equação de Schrödinger em um potencial periódico V(r+R)=V(r) tem a forma de uma onda plana modulada por uma função u_{n,k} com a mesma periodicidade da rede. O índice n rotula as bandas, k está restrito à 1ª zona de Brillouin."
      />

      <FormulaCard
        title="12. Modelo de Kronig-Penney (limite delta)"
        color="amber"
        formula={String.raw`P\,\dfrac{\sin(\alpha a)}{\alpha a} + \cos(\alpha a) = \cos(k a),\quad \alpha = \dfrac{\sqrt{2 m E}}{\hbar},\ P = \dfrac{m a V_0 b}{\hbar^2}`}
        description="Resolvendo a equação de Schrödinger 1D para um potencial periódico de barreiras retangulares, obtemos esta condição transcendental. Bandas permitidas correspondem a |LHS| ≤ 1 (k real); bandas proibidas a |LHS| > 1 (k complexo, onda evanescente)."
        derivation={[
          { text: 'Em cada poço (V=0): ψ = A e^{iαx} + B e^{-iαx}, α = √(2mE)/ℏ.' },
          { text: 'Em cada barreira (V=V₀ > E): ψ = C e^{βx} + D e^{-βx}, β = √(2m(V₀-E))/ℏ.' },
          { text: 'Continuidade de ψ e ψ\' nas fronteiras + condição de Bloch ψ(x+a+b) = e^{ik(a+b)} ψ(x):' },
          { tex: String.raw`\dfrac{\beta^2 - \alpha^2}{2\alpha\beta}\sinh(\beta b)\sin(\alpha a) + \cosh(\beta b)\cos(\alpha a) = \cos(k(a+b))` },
          { text: 'No limite b→0, V₀→∞ com bV₀ = constante (delta de Dirac), simplifica para a forma compacta acima.' },
        ]}
      />

      <FormulaCard
        title="13. Massa efetiva — relação curvatura ↔ massa"
        color="cyan"
        formula={String.raw`\dfrac{1}{m^*} = \dfrac{1}{\hbar^2}\dfrac{d^2 E(k)}{d k^2}`}
        description="A massa efetiva surge ao expandir E(k) em série de Taylor no extremo de uma banda. Quanto mais aberta (curva) a banda, menor é m*. Em cristais anisotrópicos m* é um tensor."
        derivation={[
          { text: 'Próximo a um mínimo k₀ da banda de condução, expandindo E(k):' },
          { tex: String.raw`E(k) \approx E_c + \dfrac{1}{2}\left.\dfrac{d^2 E}{dk^2}\right|_{k_0}(k - k_0)^2` },
          { text: 'Comparando com a forma livre E = ℏ²k²/(2m), define-se a massa efetiva por:' },
          { tex: String.raw`E(k) = E_c + \dfrac{\hbar^2 (k - k_0)^2}{2 m_n^*} \;\Rightarrow\; m_n^* = \hbar^2 \!\left(\dfrac{d^2 E}{dk^2}\right)^{-1}` },
        ]}
      />

      <FormulaCard
        title="14. Lei de Newton no cristal"
        color="pink"
        formula={String.raw`\hbar\dfrac{d\vec{k}}{dt} = \vec{F}_{ext},\qquad \vec{v}_g = \dfrac{1}{\hbar}\nabla_k E,\qquad \vec{F}_{ext} = m^* \dfrac{d\vec{v}_g}{dt}`}
        description="O momento de cristal ℏk responde à força externa; a velocidade de grupo do pacote de ondas de Bloch é o gradiente de E(k). Combinando, recupera-se a 2ª lei de Newton com a massa substituída por m*. A massa efetiva absorve as forças internas do potencial periódico."
      />

      <FormulaCard
        title="15. Massa efetiva da lacuna"
        color="amber"
        formula={String.raw`m_p^* = -\hbar^2 \!\left(\dfrac{d^2 E}{dk^2}\right)^{-1}_{\text{topo BV}} > 0`}
        description="No topo da banda de valência d²E/dk² < 0 (banda côncava para baixo). Define-se m*_p positiva pelo sinal trocado, e a lacuna passa a se comportar como uma partícula de carga +q e massa positiva m*_p, mais simples de tratar do que descrever todos os elétrons da BV."
      />

      <FormulaCard
        title="16. E(k) próximo aos extremos das bandas"
        color="green"
        formula={String.raw`E_{BC}(k) = E_c + \dfrac{\hbar^2 (k - k_{c,0})^2}{2 m_n^*},\quad E_{BV}(k) = E_v - \dfrac{\hbar^2 k^2}{2 m_p^*}`}
        description="Aproximação parabólica nas vizinhanças dos extremos. Para Si e Ge o mínimo da BC ocorre em k_{c,0} ≠ 0 (gap indireto); em GaAs ocorre em k = 0 (gap direto, permitindo emissão eficiente de fótons)."
      />
    </div>
  );
}
