import { useState } from 'react';

/**
 * Componente que apresenta todos os símbolos e letras utilizados na Física dos Semicondutores
 * com explicações detalhadas de cada um.
 */
export default function SemiconductorSymbols() {
  const [filter, setFilter] = useState('all');

  const symbols = [
    // Energia
    { symbol: 'E', name: 'Energia', category: 'Energia', description: 'Energia de um elétron ou lacuna. Unidade: elétron-volt (eV) ou joules (J).' },
    { symbol: 'Ec', name: 'Energia da Banda de Condução', category: 'Energia', description: 'Energia mínima da banda de condução. Elétrons livres ocupam níveis acima de Ec.' },
    { symbol: 'Ev', name: 'Energia da Banda de Valência', category: 'Energia', description: 'Energia máxima da banda de valência. Lacunas ocupam níveis abaixo de Ev.' },
    { symbol: 'Ef', name: 'Nível de Fermi', category: 'Energia', description: 'Nível de energia onde a probabilidade de ocupação é 50%. Determina a distribuição de portadores.' },
    { symbol: 'Eg', name: 'Gap de Banda (Bandgap)', category: 'Energia', description: 'Diferença de energia entre Ec e Ev. Determina se o material é condutor, semicondutor ou isolante.' },
    { symbol: 'Ed', name: 'Nível Doador', category: 'Energia', description: 'Nível de energia de impurezas doadoras (tipo-n). Fica logo abaixo de Ec.' },
    { symbol: 'Ea', name: 'Nível Aceitador', category: 'Energia', description: 'Nível de energia de impurezas aceitadoras (tipo-p). Fica logo acima de Ev.' },
    { symbol: 'Ei', name: 'Nível Intrínseco', category: 'Energia', description: 'Nível de Fermi em material intrínseco. Fica aproximadamente no meio do gap.' },
    { symbol: 'k', name: 'Constante de Boltzmann', category: 'Constantes', description: 'k = 8.617×10⁻⁵ eV/K ou 1.38×10⁻²³ J/K. Relaciona energia com temperatura.' },
    
    // Portadores
    { symbol: 'n', name: 'Concentração de Elétrons', category: 'Portadores', description: 'Número de elétrons livres por cm³ na banda de condução.' },
    { symbol: 'p', name: 'Concentração de Lacunas', category: 'Portadores', description: 'Número de lacunas por cm³ na banda de valência.' },
    { symbol: 'ni', name: 'Concentração Intrínseca', category: 'Portadores', description: 'Concentração de portadores em material intrínseco (sem dopagem). n·p = ni².' },
    { symbol: 'ND', name: 'Concentração de Doadores', category: 'Dopagem', description: 'Concentração de átomos doadores (tipo-n) por cm³. Ex: fósforo em silício.' },
    { symbol: 'NA', name: 'Concentração de Aceitadores', category: 'Dopagem', description: 'Concentração de átomos aceitadores (tipo-p) por cm³. Ex: boro em silício.' },
    { symbol: 'n+', name: 'Tipo-n Altamente Dopado', category: 'Dopagem', description: 'Região tipo-n com dopagem muito alta (ND > 10¹⁹ cm⁻³).' },
    { symbol: 'p+', name: 'Tipo-p Altamente Dopado', category: 'Dopagem', description: 'Região tipo-p com dopagem muito alta (NA > 10¹⁹ cm⁻³).' },
    
    // Temperatura
    { symbol: 'T', name: 'Temperatura', category: 'Temperatura', description: 'Temperatura absoluta em Kelvin. Afeta a concentração intrínseca e a ionização de dopantes.' },
    { symbol: 'Tfreeze-out', name: 'Temperatura de Freeze-out', category: 'Temperatura', description: 'Temperatura abaixo da qual dopantes não estão totalmente ionizados.' },
    
    // Massa Efetiva
    { symbol: 'm*', name: 'Massa Efetiva', category: 'Massa Efetiva', description: 'Massa efetiva de um portador em um cristal. Diferente da massa do elétron livre (m₀).' },
    { symbol: 'me*', name: 'Massa Efetiva do Elétron', category: 'Massa Efetiva', description: 'Massa efetiva de elétrons na banda de condução. Tipicamente 0.26m₀ para Si.' },
    { symbol: 'mh*', name: 'Massa Efetiva da Lacuna', category: 'Massa Efetiva', description: 'Massa efetiva de lacunas na banda de valência. Tipicamente 0.49m₀ para Si.' },
    { symbol: 'm₀', name: 'Massa do Elétron Livre', category: 'Constantes', description: 'm₀ = 9.109×10⁻³¹ kg. Massa do elétron no vácuo.' },
    
    // Carga e Constantes
    { symbol: 'q', name: 'Carga do Elétron', category: 'Constantes', description: 'q = 1.602×10⁻¹⁹ C. Magnitude da carga elementar.' },
    { symbol: 'h', name: 'Constante de Planck', category: 'Constantes', description: 'h = 6.626×10⁻³⁴ J·s. Constante fundamental da mecânica quântica.' },
    { symbol: 'ħ', name: 'Constante de Planck Reduzida', category: 'Constantes', description: 'ħ = h/2π = 1.055×10⁻³⁴ J·s. Usada em mecânica quântica.' },
    
    // Mobilidade
    { symbol: 'μn', name: 'Mobilidade de Elétrons', category: 'Transporte', description: 'Mobilidade de elétrons no material. μn = qτn/mn*. Unidade: cm²/(V·s).' },
    { symbol: 'μp', name: 'Mobilidade de Lacunas', category: 'Transporte', description: 'Mobilidade de lacunas no material. μp = qτp/mp*. Unidade: cm²/(V·s).' },
    { symbol: 'τn', name: 'Tempo de Vida do Elétron', category: 'Transporte', description: 'Tempo médio antes que um elétron se recombine com uma lacuna.' },
    { symbol: 'τp', name: 'Tempo de Vida da Lacuna', category: 'Transporte', description: 'Tempo médio antes que uma lacuna se recombine com um elétron.' },
    
    // Difusão
    { symbol: 'Dn', name: 'Coeficiente de Difusão de Elétrons', category: 'Transporte', description: 'Dn = μn·kT/q. Descreve difusão de elétrons. Unidade: cm²/s.' },
    { symbol: 'Dp', name: 'Coeficiente de Difusão de Lacunas', category: 'Transporte', description: 'Dp = μp·kT/q. Descreve difusão de lacunas. Unidade: cm²/s.' },
    { symbol: 'Ln', name: 'Comprimento de Difusão de Elétrons', category: 'Transporte', description: 'Ln = √(Dn·τn). Distância média que elétrons difundem antes de se recombinarem.' },
    { symbol: 'Lp', name: 'Comprimento de Difusão de Lacunas', category: 'Transporte', description: 'Lp = √(Dp·τp). Distância média que lacunas difundem antes de se recombinarem.' },
    
    // Condutividade
    { symbol: 'σ', name: 'Condutividade', category: 'Transporte', description: 'σ = q(μn·n + μp·p). Mede a capacidade de conduzir corrente. Unidade: S/cm.' },
    { symbol: 'ρ', name: 'Resistividade', category: 'Transporte', description: 'ρ = 1/σ. Inverso da condutividade. Unidade: Ω·cm.' },
    
    // Permissividade
    { symbol: 'ε', name: 'Permissividade', category: 'Constantes', description: 'ε = ε₀·εr. Capacidade de um material de polarizar sob campo elétrico.' },
    { symbol: 'ε₀', name: 'Permissividade do Vácuo', category: 'Constantes', description: 'ε₀ = 8.854×10⁻¹⁴ F/cm. Permissividade do vácuo.' },
    { symbol: 'εr', name: 'Permissividade Relativa', category: 'Constantes', description: 'Permissividade relativa do material (constante dielétrica). εr(Si) ≈ 11.7.' },
    
    // Junção PN
    { symbol: 'Vbi', name: 'Potencial de Barreira', category: 'Junção PN', description: 'Potencial interno de uma junção PN. Vbi = (kT/q)·ln(ND·NA/ni²).' },
    { symbol: 'W', name: 'Largura da Região de Depleção', category: 'Junção PN', description: 'Largura total da região de carga espacial na junção PN.' },
    { symbol: 'xn', name: 'Largura da Região de Depleção (lado n)', category: 'Junção PN', description: 'Extensão da região de depleção no lado tipo-n.' },
    { symbol: 'xp', name: 'Largura da Região de Depleção (lado p)', category: 'Junção PN', description: 'Extensão da região de depleção no lado tipo-p.' },
    
    // Espaço-k
    { symbol: 'k', name: 'Vetor de Onda', category: 'Espaço-k', description: 'Vetor de onda no espaço recíproco. k = 2π/λ. Relacionado ao momento do elétron.' },
    { symbol: 'Γ', name: 'Ponto Gamma', category: 'Espaço-k', description: 'Ponto central da zona de Brillouin (k = 0). Importante para estrutura de bandas.' },
    { symbol: 'X', name: 'Ponto X', category: 'Espaço-k', description: 'Ponto na borda da zona de Brillouin na direção [100]. Si tem mínimo indireto em X.' },
    { symbol: 'L', name: 'Ponto L', category: 'Espaço-k', description: 'Ponto na borda da zona de Brillouin na direção [111]. GaAs tem mínimo direto em Γ.' },
    
    // Outros
    { symbol: 'Φ', name: 'Função Trabalho', category: 'Energia', description: 'Energia necessária para remover um elétron do material. Unidade: eV.' },
    { symbol: 'χ', name: 'Afinidade Eletrônica', category: 'Energia', description: 'Energia liberada quando um elétron do vácuo entra na banda de condução.' },
    { symbol: 'J', name: 'Densidade de Corrente', category: 'Transporte', description: 'Corrente por unidade de área. J = σ·E. Unidade: A/cm².' },
    { symbol: 'E', name: 'Campo Elétrico', category: 'Transporte', description: 'Campo elétrico aplicado. E = V/d. Unidade: V/cm.' },
    { symbol: 'V', name: 'Tensão', category: 'Transporte', description: 'Diferença de potencial elétrico. Unidade: V (volts).' },
  ];

  const categories = ['all', 'Energia', 'Portadores', 'Dopagem', 'Temperatura', 'Massa Efetiva', 'Constantes', 'Transporte', 'Junção PN', 'Espaço-k'];

  const filteredSymbols = filter === 'all' 
    ? symbols 
    : symbols.filter(s => s.category === filter);

  return (
    <div className="symbols-container">
      <h2>📚 Símbolos da Física dos Semicondutores</h2>
      <p className="symbols-intro">
        Guia completo dos símbolos, letras e notações utilizados na Física dos Semicondutores.
        Cada símbolo é fundamental para entender o comportamento de dispositivos eletrônicos.
      </p>

      <div className="filter-buttons">
        {categories.map(cat => (
          <button
            key={cat}
            className={`filter-btn ${filter === cat ? 'active' : ''}`}
            onClick={() => setFilter(cat)}
          >
            {cat === 'all' ? '📋 Todos' : cat}
          </button>
        ))}
      </div>

      <div className="symbols-grid">
        {filteredSymbols.map((item, index) => (
          <div key={index} className="symbol-card">
            <div className="symbol-header">
              <span className="symbol-math">{item.symbol}</span>
              <span className="symbol-category">{item.category}</span>
            </div>
            <h4 className="symbol-name">{item.name}</h4>
            <p className="symbol-description">{item.description}</p>
          </div>
        ))}
      </div>

      <div className="symbols-footer">
        <h3>💡 Dicas de Estudo</h3>
        <ul>
          <li>**Memorize os fundamentais**: Ec, Ev, Ef, Eg, n, p, ni são os mais usados.</li>
          <li>**Entenda as relações**: n·p = ni² (lei de ação de massas) é essencial.</li>
          <li>**Pratique com valores**: Calcule n, p, Ef para diferentes materiais e temperaturas.</li>
          <li>**Visualize os diagramas**: Associe cada símbolo com sua posição no diagrama de bandas.</li>
        </ul>
      </div>
    </div>
  );
}
