/**
 * Glossário de termos importantes em física de semicondutores
 */
export default function Glossary() {
  const terms = [
    { term: 'binary semiconductor', definition: 'Semicondutor composto de dois elementos, como arseneto de gálio (GaAs).' },
    { term: 'covalent bonding', definition: 'Ligação entre átomos na qual os elétrons de valência são compartilhados.' },
    { term: 'diamond lattice', definition: 'Estrutura cristalina atômica do silício, por exemplo, na qual cada átomo tem quatro vizinhos mais próximos em uma configuração tetraédrica.' },
    { term: 'doping', definition: 'Processo de adicionar tipos específicos de átomos a um semicondutor para alterar favoravelmente as características elétricas.' },
    { term: 'elemental semiconductor', definition: 'Semicondutor composto por uma única espécie de átomo, como silício ou germânio.' },
    { term: 'epitaxial layer', definition: 'Uma camada fina monocristalina de material formada na superfície de um substrato.' },
    { term: 'ion implantation', definition: 'Um processo específico de dopagem de um semicondutor.' },
    { term: 'lattice', definition: 'Arranjo periódico de átomos em um cristal.' },
    { term: 'Miller indices', definition: 'O conjunto de inteiros usados para descrever um plano cristalino.' },
    { term: 'primitive cell', definition: 'A menor célula unitária que pode ser repetida para formar uma rede cristalina.' },
    { term: 'substrate', definition: 'Uma pastilha de semicondutor ou outro material usado como material inicial para processamento adicional de semicondutores, como crescimento epitaxial ou difusão.' },
    { term: 'ternary semiconductor', definition: 'Semicondutor composto de três elementos, como arseneto de alumínio-gálio (AlGaAs).' },
    { term: 'unit cell', definition: 'Um pequeno volume de um cristal que pode ser usado para reproduzir todo o cristal.' },
    { term: 'zincblende lattice', definition: 'Estrutura de rede idêntica à rede de diamante, exceto que há dois tipos de átomos em vez de um.' },
    { term: 'band gap (Eg)', definition: 'A diferença de energia entre o topo da banda de valência e o fundo da banda de condução em um semicondutor. Determina as propriedades elétricas e ópticas.' },
    { term: 'valence band', definition: 'A banda de energia mais alta de elétrons em um sólido na temperatura absoluta zero. Elétrons nesta banda estão ligados aos átomos e contribuem para a ligação química.' },
    { term: 'conduction band', definition: 'A banda de energia mais baixa que está vazia de elétrons na temperatura absoluta zero. Elétrons nesta banda são livres para se mover e contribuir para a condutividade elétrica.' },
    { term: 'intrinsic semiconductor', definition: 'Um semicondutor puro sem dopagem intencional, onde a concentração de elétrons é igual à concentração de lacunas (n = p = ni).' },
    { term: 'extrinsic semiconductor', definition: 'Um semicondutor que foi dopado com impurezas para alterar suas propriedades elétricas, seja tipo-n (excesso de elétrons) ou tipo-p (excesso de lacunas).' },
    { term: 'n-type semiconductor', definition: 'Um semicondutor dopado com impurezas doadoras (ex: fósforo no silício) que fornecem elétrons extras como portadores de carga majoritários.' },
    { term: 'p-type semiconductor', definition: 'Um semicondutor dopado com impurezas aceitadoras (ex: boro no silício) que criam lacunas como portadores de carga majoritários.' },
    { term: 'donor', definition: 'Um átomo de impureza que doa elétrons para a banda de condução quando adicionado a um semicondutor, criando material tipo-n.' },
    { term: 'acceptor', definition: 'Um átomo de impureza que aceita elétrons da banda de valência quando adicionado a um semicondutor, criando material tipo-p e lacunas.' },
    { term: 'electron', definition: 'Uma partícula carregada negativamente (−q) com massa efetiva m*_n que se move na banda de condução e contribui para a corrente elétrica.' },
    { term: 'hole', definition: 'Uma quase-partícula carregada positivamente (+q) com massa efetiva m*_p que representa a ausência de um elétron na banda de valência e contribui para a corrente elétrica.' },
    { term: 'effective mass (m*)', definition: 'A massa aparente de uma partícula em um cristal, definida como 1/m* = (1/ℏ²)(d²E/dk²). Determina como as partículas respondem a forças externas no cristal.' },
    { term: 'Fermi level (EF)', definition: 'O nível de energia no qual a probabilidade de encontrar um elétron é 50% em uma dada temperatura. Em semicondutores, fica perto do meio do gap de bandas para material intrínseco.' },
    { term: 'Fermi-Dirac distribution', definition: 'A distribuição estatística f(E) = 1/[1 + exp((E−E_F)/k_BT)] que descreve a probabilidade de um elétron ocupar um estado quântico na energia E e temperatura T.' },
    { term: 'Maxwell-Boltzmann approximation', definition: 'Uma simplificação da distribuição de Fermi-Dirac válida quando a diferença de energia é muito maior que k_BT, dando f(E) aproximadamente igual a exp(-(E-E_F)/k_BT).' },
    { term: 'density of states g(E)', definition: 'O número de estados quânticos disponíveis por unidade de energia por unidade de volume. Para um sistema 3D, g(E) ∝ √(E−E_c) próximo à borda da banda de condução.' },
    { term: 'direct band gap', definition: 'Um gap de banda onde o mínimo da banda de condução e o máximo da banda de valência ocorrem no mesmo momento cristalino (k). Permite transições radiativas eficientes (ex: GaAs).' },
    { term: 'indirect band gap', definition: 'Um gap de banda onde o mínimo da banda de condução e o máximo da banda de valência ocorrem em momentos cristalinos diferentes (k). Requer participação de fônons para transições (ex: Si, Ge).' },
    { term: 'k-space', definition: 'A representação do espaço de momento de um cristal, onde o vetor de onda k descreve a periodicidade das funções de onda dos elétrons. Usado para plotar diagramas de bandas E(k).' },
    { term: 'Kronig-Penney model', definition: 'Um modelo teórico que descreve o comportamento do elétron em um potencial periódico usando a equação P·sin(αa)/(αa) + cos(αa) = cos(ka), demonstrando a formação de bandas e gaps de energia.' },
    { term: 'freeze-out', definition: 'O regime de baixa temperatura onde os dopantes não estão completamente ionizados, resultando em concentração reduzida de portadores em semicondutores extrínsecos.' },
    { term: 'intrinsic carrier concentration (ni)', definition: 'A concentração de elétrons e lacunas em um semicondutor intrínseco em equilíbrio térmico, dada por ni² = N_c N_v exp(−E_g/k_BT).' },
    { term: 'mass action law', definition: 'A relação n·p = ni² que vale para um semicondutor em equilíbrio térmico, onde n é a concentração de elétrons e p é a concentração de lacunas.' },
    { term: 'depletion region', definition: 'Uma região ao redor de uma junção p-n que é esgotada de portadores de carga móveis devido à difusão, criando um campo elétrico.' },
    { term: 'built-in potential', definition: 'A diferença de potencial elétrico através de uma junção p-n em equilíbrio, resultante da difusão de portadores e da formação da região de depleção.' },
    { term: 'diffusion current', definition: 'Corrente resultante do movimento térmico aleatório de portadores de regiões de alta concentração para baixa concentração.' },
    { term: 'drift current', definition: 'Corrente resultante do movimento de portadores de carga sob a influência de um campo elétrico.' },
    { term: 'mobility (μ)', definition: 'Uma medida de quão facilmente os portadores de carga se movem através de um semicondutor sob um campo elétrico, definida como v_drift = μE.' },
    { term: 'Varshni equation', definition: 'Uma fórmula empírica Eg(T) = Eg(0) − αT²/(T+β) que descreve a dependência térmica da energia do gap de banda.' },
    { term: 'quantum well', definition: 'Uma camada fina de material semicondutor onde os portadores são confinados em uma dimensão, criando níveis de energia discretos. Usado em dispositivos de poço quântico.' },
    { term: 'perovskite', definition: 'Uma estrutura cristalina com a fórmula geral ABX₃, onde A e B são cátions e X é um ânion. Semicondutores perovskita (ex: MAPbI₃) são promissores para células solares.' },
    { term: 'Czochralski process', definition: 'Um método para crescer lingotes monocristalinos a partir de um fundido puxando um cristal semente do material fundido enquanto o gira.' },
    { term: 'Bridgman-Stockbarger method', definition: 'Uma técnica de crescimento cristalino onde um material fundido é lentamente resfriado através de um gradiente de temperatura em um forno móvel.' },
    { term: 'float zone method', definition: 'Uma técnica de crescimento cristalino onde uma zona fundida é passada através de uma barra policristalina usando aquecimento por radiofrequência, produzindo cristais de alta pureza.' },
  ];

  return (
    <div className="diagram-card">
      <h3>Glossário de Termos Importantes</h3>
      <p style={{ color: '#94a3b8', fontSize: 13, marginTop: 0 }}>
        Definições para termos-chave usados em física de semicondutores e análise de estrutura cristalina.
      </p>

      <table className="glossary-table">
        <thead>
          <tr>
            <th>Termo</th>
            <th>Definição</th>
          </tr>
        </thead>
        <tbody>
          {terms.map((item, index) => (
            <tr key={index}>
              <td className="term-cell">{item.term}</td>
              <td className="definition-cell">{item.definition}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ background: 'rgba(2,6,23,0.6)', padding: 14, borderRadius: 8,
                    marginTop: 16, fontSize: 13, color: '#cbd5e1' }}>
        <p style={{ margin: 0 }}>
          <b>Referência:</b> Estes termos são fundamentais para compreender a física de semicondutores,
          estruturas cristalinas, processos de dopagem e técnicas de crescimento epitaxial.
        </p>
      </div>
    </div>
  );
}
