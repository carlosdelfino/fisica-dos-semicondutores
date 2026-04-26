/**
 * Roteiro de estudo: 8 perguntas que o aluno deve ser capaz de responder
 * após interagir com o sistema, cada uma com botão "Ir para a aba" que
 * conduz ao componente correspondente.
 */
export default function LearningObjectives({ onNavigate, completed = {} }) {
  const objectives = [
    {
      id: 'q1',
      title: 'Discutir bandas permitidas e proibidas, qualitativa e rigorosamente (Kronig-Penney)',
      tabs: ['allowed', 'kp', 'atomband'],
      hints: [
        'Qualitativo: aproxime os átomos no painel "Átomos → Bandas" e veja como os níveis se desdobram.',
        'Rigoroso: na aba "Kronig-Penney" varie P e veja a equação P·sin(αa)/(αa) + cos(αa) = cos(ka) gerar bandas onde |LHS| ≤ 1.',
        'Em "Bandas Permitidas/Proibidas" observe a estrutura completa do cristal com bandas de núcleo, BV, gap e BC.',
      ],
    },
    {
      id: 'q2',
      title: 'Discutir a separação dos níveis de energia no Silício',
      tabs: ['atomband'],
      hints: [
        'Mova o slider r de 1 (átomos isolados) para 0 (cristal). Os níveis 3s e 3p se desdobram primeiro.',
        'Aumente N para ver que com 10²³ átomos o desdobramento é virtualmente contínuo.',
        'O gap E_g ≈ 1.12 eV emerge entre o topo da banda originária do 3s e a base da BC originária do 3p.',
      ],
    },
    {
      id: 'q3',
      title: 'Definir massa efetiva a partir do diagrama E×k e seu significado para o movimento',
      tabs: ['kspace', 'effmass'],
      hints: [
        '1/m* = (1/ℏ²)(d²E/dk²): é o inverso da curvatura da banda no extremo.',
        'Em "Massa Efetiva" aplique uma força F e veja a partícula livre (m₀) e a do cristal (m*) acelerarem diferente.',
        'Em "Espaço-k" troque entre Si e GaAs: GaAs tem m*_n = 0.067 m₀ → elétrons muito mais "leves" e rápidos.',
      ],
    },
    {
      id: 'q4',
      title: 'Discutir o conceito de lacuna (hole)',
      tabs: ['particles', 'lattice'],
      hints: [
        'Em "Elétron × Lacuna": carga +q, massa efetiva m*_p > 0, vive no topo da BV.',
        'A lacuna obedece F = m*_p · a com carga +q porque a massa é definida por m*_p = −ℏ²/(d²E/dk²) com d²E/dk² < 0 no topo da BV.',
        'Na "Rede Cristalina" tipo-p, observe o estado vazio na ligação que falta um elétron quando boro substitui Si.',
      ],
    },
    {
      id: 'q5',
      title: 'Discutir características de gaps direto vs indireto',
      tabs: ['kspace'],
      hints: [
        'Em "Espaço-k" troque o material:',
        '• GaAs (gap direto, Γ): mínimo da BC e máximo da BV no mesmo k. Transição radiativa por fóton apenas → bom para LEDs e lasers.',
        '• Si/Ge (gap indireto): mínimo da BC deslocado em k. Transição precisa de fóton + fônon → emissão luminosa ineficiente.',
      ],
    },
    {
      id: 'q6',
      title: 'Diferenciar metal × isolante × semicondutor pelas bandas de energia',
      tabs: ['mis'],
      hints: [
        'Em "Metal × Isolante × Semicondutor":',
        '• Metal: E_F dentro de uma banda permitida → estados vazios imediatamente acessíveis.',
        '• Semicondutor: gap pequeno (~1 eV), σ ↑ com T (excitação térmica gera portadores).',
        '• Isolante: gap grande (>5 eV), σ desprezível mesmo a 300 K.',
      ],
    },
    {
      id: 'q7',
      title: 'Definir e calcular a função densidade de estados g(E)',
      tabs: ['dos'],
      hints: [
        'Modelo: poço infinito 3D ⇒ E = ℏ²π²(n_x²+n_y²+n_z²)/(2mL²).',
        'Em "Densidade de Estados" o painel `QuantumWell3D` mostra os estados como pontos discretos no espaço-k; aumente o raio da esfera de Fermi e compare a contagem discreta com a previsão contínua.',
        'Resultado: g(E) = (1/2π²)(2m*/ℏ²)^(3/2) √(E−E_c) para a BC.',
      ],
    },
    {
      id: 'q8',
      title: 'Compreender a distribuição de Fermi-Dirac e a energia de Fermi',
      tabs: ['fermi'],
      hints: [
        'f(E) = 1 / [1 + exp((E−E_F)/k_BT)] dá a probabilidade de um estado de energia E estar ocupado.',
        'Em T = 0 K: f é um degrau perfeito em E_F. Em T > 0: transição suave de largura ~ k_BT.',
        'E_F é o potencial químico dos elétrons. Em um metal está dentro da banda; em semicondutor intrínseco fica perto do midgap.',
        'Para |E − E_F| ≫ k_BT, f(E) ≈ exp(−(E−E_F)/k_BT) — limite de Maxwell-Boltzmann.',
      ],
    },
  ];

  const tabLabel = {
    overview: 'Visão Geral', lattice: 'Rede Cristalina', atomband: 'Átomos → Bandas',
    allowed: 'Bandas Permitidas/Proibidas', kp: 'Kronig-Penney',
    kspace: 'Espaço-k', effmass: 'Massa Efetiva', particles: 'Elétron × Lacuna',
    fermi: 'Fermi-Dirac & MB', dos: 'Densidade de Estados',
    arrhenius: 'n(T) Arrhenius', mis: 'Metal × Isolante × Semicondutor',
    formulas: 'Fórmulas',
  };

  return (
    <div className="diagram-card">
      <h3>Roteiro de Estudo — 8 competências a desenvolver</h3>
      <p style={{ color: '#94a3b8', fontSize: 13, marginTop: 0 }}>
        Após explorar este sistema, você deve conseguir <b>discutir</b> cada um dos itens abaixo.
        Use os botões para ir direto à aba que demonstra cada conceito.
      </p>

      <ol className="objectives-list">
        {objectives.map((obj, i) => (
          <li key={obj.id} className={`objective-item ${completed[obj.id] ? 'done' : ''}`}>
            <div className="objective-header">
              <span className="objective-num">{i + 1}</span>
              <h4>{obj.title}</h4>
            </div>
            <ul className="objective-hints">
              {obj.hints.map((h, j) => (
                <li key={j}>{h}</li>
              ))}
            </ul>
            <div className="objective-actions">
              {obj.tabs.map((t) => (
                <button key={t} className="objective-btn"
                        onClick={() => onNavigate?.(t)}>
                  → {tabLabel[t] || t}
                </button>
              ))}
            </div>
          </li>
        ))}
      </ol>

      <div style={{ background: 'rgba(2,6,23,0.6)', padding: 14, borderRadius: 8,
                    marginTop: 16, fontSize: 13, color: '#cbd5e1' }}>
        <p style={{ margin: 0 }}>
          <b>Auto-avaliação:</b> tente formular em voz alta uma resposta de 2-3 frases para cada item
          antes de consultar a aba. Se conseguir explicar todos, você dominou os fundamentos da
          teoria de bandas em semicondutores.
        </p>
      </div>
    </div>
  );
}
