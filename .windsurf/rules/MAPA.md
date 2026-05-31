---
trigger: always_on
---

# MAPA DA APLICAÇÃO - Diagrama do Física de Semicondutores

**Propósito:** Este arquivo mapeia toda a estrutura da aplicação para facilitar o entendimento por agentes de IA (Cascade, Windsurf) e desenvolvimento de novos recursos sem necessidade de varrer toda a aplicação.

**Atualização:** Este arquivo deve ser atualizado sempre que novos recursos, componentes ou funcionalidades forem adicionados ao sistema.

---

## 1. VISÃO GERAL DO PROJETO

**Nome:** Física dos Semicondutores  
**Tipo:** Aplicação Web Educacional (SPA)  
**Stack:** React 18 + Vite 5 + SVG puro + KaTeX + CSS  
**Objetivo:** Simulador interativo de física de semicondutores com 14+ abas e 20+ fórmulas com derivações

**Arquitetura:** 100% cliente (sem backend), React Router para navegação, componentes modulares, física em `src/physics/`

**Modelo Físico:** Aproximação parabólica de bandas, ionização completa de dopantes acima da temperatura de freeze-out, semicondutor não-degenerado. Fórmula de Varshni para Eg(T). Constantes em SI.

---

## 2. REQUISITOS FUNCIONAIS (RF)

| ID | Descrição | Componente Relacionado |
|----|-----------|------------------------|
| RF01 | Exibir diagrama de bandas (E_c, E_v, E_F, E_g) para Si intrínseco, tipo-n (P) e tipo-p (B) | BandDiagram.jsx |
| RF02 | Exibir rede cristalina 2D do Silício com ligações covalentes; permitir substituição de átomos por P ou B | Lattice.jsx |
| RF03 | Plotar a distribuição de Fermi-Dirac f(E) com slider de Temperatura (0 K → 1000 K) e de E_F | FermiDiracPlot.jsx |
| RF04 | Sobrepor aproximação de Maxwell-Boltzmann ao gráfico de Fermi-Dirac e delimitar a região de validade | FermiDiracPlot.jsx |
| RF05 | Plotar g(E)·f(E) na banda de condução e g(E)·(1-f(E)) na banda de valência | DensityOfStates.jsx |
| RF06 | Calcular e exibir Nc, Nv, n, p, n_i, E_F em função de T e da dopagem | CarrierPanel.jsx |
| RF07 | Plotar n(T), p(T) em escala ln(n) vs 1000/T mostrando regiões freeze-out, extrínseca e intrínseca | CarrierVsTemp.jsx |
| RF08 | Exibir fórmulas renderizadas em KaTeX com derivações passo-a-passo | FormulaCard.jsx, FormulasPanel.jsx |
| RF09 | Permitir escolher material (Si, Ge, GaAs, GaN, SiC) com parâmetros realistas (E_g, m*_n, m*_p) | ControlPanel.jsx, materials.js |
| RF10 | Permitir ajustar concentração de dopantes N_D (P) e N_A (B) entre 10¹³ e 10¹⁹ cm⁻³ | ControlPanel.jsx |
| RF11 | Animação de elétrons (azul) e lacunas (vermelho) cruzando o gap em função de T | BandDiagram.jsx |
| RF12 | Destacar níveis doadores E_d (~45 meV abaixo de E_c para P:Si) e aceitadores E_a (~45 meV acima de E_v para B:Si) | BandDiagram.jsx |
| RF13 | Sistema de questões para auto-avaliação com modo uma-por-vez e todas | Questoes.jsx |
| RF14 | Roteiro de estudo com 8 competências auto-avaliáveis | LearningObjectives.jsx |
| RF15 | Suporte a 5 idiomas (pt, en, ar, hi, zh) com troca dinâmica | LanguageContext.jsx, locales/ |
| RF16 | Menu hierárquico organizado por categorias | HierarchicalMenu.jsx |

---

## 3. REQUISITOS NÃO FUNCIONAIS (RNF)

- **RNF01** — Aplicação 100% cliente (SPA), sem backend.
- **RNF02** — Diagramas em **SVG puro** (sem libs de charting pesadas) para clareza e escalabilidade.
- **RNF03** — Fórmulas renderizadas com **KaTeX** (rápido, sem dependência de MathJax).
- **RNF04** — Layout responsivo, tema dark científico.
- **RNF05** — Acessibilidade: contraste AA, tooltips descritivos.
- **RNF06** — Logs estruturados no console (padrão PDCL) para ações do usuário e cálculos.
- **RNF07** — Código deve seguir padrões React (hooks funcionais, sem classes).
- **RNF08** — Internacionalização completa para todos os textos visíveis.
- **RNF09** — Performance: cálculos físicos otimizados com useMemo.
- **RNF10** — Navegação via React Router com URLs limpas.

---

## 4. LAYOUT E DESIGN DO SITE

### 4.1 Grid Layout Principal
```
┌─────────────────────────────────────────────────┐
│                  TOPBAR (header)                │
├──────────────┬──────────────────────────────────┤
│              │                                  │
│   SIDEBAR    │         CONTENT                  │
│   (320px)    │       (flex: 1)                  │
│              │                                  │
│ - Controls   │   - Diagram Cards                │
│ - Menu       │   - Formulas                      │
│              │   - Educational Content          │
├──────────────┴──────────────────────────────────┤
│                  FOOTER                          │
└─────────────────────────────────────────────────┘
```

### 4.2 Sistema de Cores (CSS Variables)
```css
--bg-0: #0b1120      /* Fundo mais escuro */
--bg-1: #0f172a      /* Fundo principal */
--bg-2: #1e293b      /* Fundo secundário */
--bg-3: #334155      /* Bordas */
--fg-0: #e2e8f0      /* Texto principal */
--fg-1: #cbd5e1      /* Texto secundário */
--fg-2: #94a3b8      /* Texto terciário */
--accent: #22d3ee     /* Cor de destaque (ciano) */
--accent-2: #fbbf24   /* Cor secundária (âmbar) */
--cb: #0ea5e9         /* Banda de condução */
--vb: #ef4444         /* Banda de valência */
--gap: #facc15        /* Gap */
--donor: #22c55e      /* Doadores */
--acceptor: #a855f7   /* Aceitadores */
```

### 4.3 Tipografia
- **Fonte:** 'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif
- **Tamanhos típicos:**
  - Títulos: 14-22px
  - Texto corpo: 12.5-14px
  - Labels: 12px
  - Código: 12px (Consolas, Monaco, Courier New)

### 4.4 Componentes de UI Padrão

#### Cards
```css
.diagram-card {
  background: var(--bg-1);
  border: 1px solid var(--bg-3);
  border-radius: 10px;
  padding: 16px;
  box-shadow: 0 4px 14px rgba(0,0,0,0.25);
}
```

#### Botões
```css
/* Botão primário */
background: var(--accent);
color: #0b1120;
border: none;
border-radius: 8px;
padding: 9px 18px;
font-weight: 700;

/* Botão secundário */
background: var(--bg-2);
color: var(--fg-0);
border: 1px solid var(--bg-3);
```

#### Inputs
```css
select, input[type="range"] {
  background: var(--bg-2);
  color: var(--fg-0);
  border: 1px solid var(--bg-3);
  border-radius: 6px;
}
input[type="range"] {
  accent-color: var(--accent);
}
```

#### Radio Buttons
```css
.radio-btn {
  border: 1px solid var(--bg-3);
  border-radius: 6px;
  padding: 6px 10px;
  background: var(--bg-2);
  cursor: pointer;
}
.radio-btn.active {
  border-color: var(--accent);
  color: #0b1120;
  background: var(--accent);
  font-weight: 600;
}
```

### 4.5 Animações
- **Transições:** 0.15s ease para hover/active
- **SlideDown:** 0.2s ease para painéis expansíveis
- **FadeIn:** Para conteúdo carregado

---

## 5. PADRÕES DE CÓDIGO REACT/NODEJS

### 5.1 Estrutura de Componente
```jsx
import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from '../contexts/LanguageContext.jsx';

function ComponentName({ prop1, prop2 }) {
  const { t } = useTranslation();
  const [state, setState] = useState(initialValue);
  
  // Cálculos derivados otimizados
  const derived = useMemo(() => {
    return expensiveCalculation(state);
  }, [state]);
  
  // Efeitos colaterais
  useEffect(() => {
    // Setup
    return () => {
      // Cleanup
    };
  }, [dependencies]);
  
  // Logging estruturado
  useEffect(() => {
    log_event('TYPE', 'Mensagem', { params });
  }, [state]);
  
  return (
    <div className="component-class">
      {/* JSX */}
    </div>
  );
}

export default ComponentName;
```

### 5.2 Hooks Padrões
- `useState` - Estado local
- `useEffect` - Efeitos colaterais
- `useMemo` - Cálculos derivados (otimização)
- `useCallback` - Funções memoizadas
- `useTranslation` - Internacionalização
- `useNavigate` - Navegação React Router
- `useLocation` - URL atual

### 5.3 Convenções de Nomenclatura
- **Componentes:** PascalCase (ex: `BandDiagram.jsx`)
- **Funções:** camelCase (ex: `carrierConcentrations`)
- **Constantes:** UPPER_SNAKE_CASE (ex: `MATERIALS`, `k_B_eV`)
- **CSS Classes:** kebab-case (ex: `.diagram-card`, `.control-panel`)
- **Arquivos:** kebab-case para componentes, camelCase para utilitários

### 5.4 Props Pattern
```jsx
// Props desestruturadas com valores padrão
function Component({ 
  material = 'Si', 
  temperature = 300,
  onValueChange 
}) {
  // ...
}

// Props do estado global passadas explicitamente
<BandDiagram 
  state={{ ...calc, type }} 
  material={material}
  T={T}
  Eg={calc.Eg}
  Ec={calc.Ec}
  Ev={calc.Ev}
  EF={calc.EF}
/>
```

### 5.5 Internacionalização
```jsx
import { useTranslation } from '../contexts/LanguageContext.jsx';

function Component() {
  const { t } = useTranslation();
  
  return (
    <div>
      <h1>{t('header.title')}</h1>
      <p>{t('controlPanel.material')}</p>
    </div>
  );
}
```

**Estrutura de chaves de tradução:**
```js
{
  section: {
    subsection: {
      key: 'Texto traduzido'
    }
  }
}
```

### 5.6 Logging Estruturado
```js
import { log_event } from '../physics/formulas.js';

// Em componentes
useEffect(() => {
  log_event('DATA', 'Estado atualizado', {
    material, 
    T, 
    n: calc.n.toExponential(2)
  });
}, [calc]);

// Em funções de física
function someCalculation(params) {
  log_event('CALC', 'Iniciando cálculo', { params });
  try {
    const result = performCalculation(params);
    log_event('SUCCESS', 'Cálculo concluído', { result });
    return result;
  } catch (error) {
    log_event('ERROR', 'Erro no cálculo', { error: error.message });
    throw error;
  }
}
```

**Tipos de log:**
- `START` - Início de processo
- `END` - Fim de processo
- `DATA` - Dados de estado
- `CALC` - Cálculos físicos
- `SUCCESS` - Operação bem-sucedida
- `ERROR` - Erros
- `INFO` - Informações gerais

---

## 6. ESTRUTURA DE DIRETÓRIOS

```
diagrama de bandas semicondutores/
├── .windsurf/                    # Configurações Windsurf/Cascade
│   ├── rules/                    # Regras de codificação (sempre carregadas)
│   │   ├── MAPA.md              # ESTE ARQUIVO - mapa da aplicação
│   │   ├── documentacao.md     # Padrões de formatação markdown
│   │   ├── logs.md              # Sistema de logging estruturado
│   │   ├── nodejs.md            # Padrões NodeJS/React
│   │   ├── pdcl.md              # Metodologia PDCL
│   │   ├── projeto.md           # Regras do projeto
│   │   ├── transcricao.md       # Padrões de transcrição
│   │   └── validacao_da_das_correcoes_e_testes.md
│   └── workflows/               # Workflows automatizados
│       ├── pdcl.md              # Workflow PDCL
│       ├── preparo-projeto.md   # Preparação de projeto
│       ├── rag-search.md        # Busca contextual
│       ├── rag-search-pdf.md    # Busca em PDFs
│       └── rag-find-page.md     # Encontrar páginas específicas
├── src/                         # Código fonte principal
│   ├── main.jsx                 # Entry point React
│   ├── App.jsx                  # Orquestrador principal + rotas
│   ├── AppWrapper.jsx           # Wrapper da aplicação
│   ├── physics/                 # Camada de física/cálculos
│   ├── components/              # Componentes React (35+ componentes)
│   ├── contexts/                # Contextos React (i18n)
│   ├── locales/                 # Arquivos de tradução (5 idiomas)
│   ├── styles/                  # CSS global
│   └── utils/                   # Utilitários e loaders
├── public/                      # Arquivos estáticos
│   ├── formulas/                # Fórmulas extraídas de PDFs
│   └── images/                  # Imagens (logo, favicon, social)
├── scripts/                     # Scripts de automação
├── docs/                        # Documentação técnica (PDFs)
├── logs/                        # Logs do sistema (rotação automática)
├── dist/                        # Build de produção
├── node_modules/                # Dependências (ignorar no mapa)
├── .git/                        # Controle de versão
├── .github/                     # Configurações GitHub
├── index.html                   # HTML entry point
├── package.json                 # Dependências NPM
├── vite.config.js               # Configuração Vite
├── routes.config.js             # Configuração de rotas + sitemap
├── .env                         # Variáveis de ambiente
├── .gitignore                   # Arquivos ignorados pelo Git
├── .nvmrc                       # Versão Node.js
├── README.md                   # Documentação principal
├── REQUIREMENTS.md              # Requisitos funcionais/não funcionais
├── CONTRIBUTING.md              # Guia para contribuidores
└── SITEMAP_GUIDE.md             # Guia de sitemap
```

---

## 7. COMPONENTES PRINCIPAIS (src/components/)

### 7.1 Componentes de Navegação e UI

- **ControlPanel.jsx** - Painel de controles globais (material, tipo, T, dopagem)
- **HierarchicalMenu.jsx** - Menu hierárquico de navegação entre abas
- **LanguageSelector.jsx** - Seletor de idioma (pt, en, ar, hi, zh)
- **SupportPanel.jsx** - Painel de apoio/apoio ao projeto

### 7.2 Componentes de Física de Semicondutores

- **BandDiagram.jsx** - Diagrama E vs x com portadores animados (RF01)
- **Lattice.jsx** - Rede cristalina 2D Si/P/B com elétrons/lacunas (RF02)
- **AtomToBand.jsx** - Transição átomos isolados → bandas (splitting)
- **AllowedForbidden.jsx** - Estrutura completa (núcleo, BV, BC, gaps)
- **KronigPenneyDiagram.jsx** - Modelo V(x) + LHS(E) + E(k)
- **MetalInsulatorSemi.jsx** - Comparação Cu × Si × SiO₂
- **KSpaceDiagram.jsx** - Diagrama E×k (gap direto vs indireto)
- **EffectiveMassDemo.jsx** - Demonstração F = m*·a
- **ElectronHoleCard.jsx** - Elétron(−q,+m*) vs lacuna(+q,+m*)
- **DiamondLatticeUnitCell.jsx** - Célula unitária rede diamante
- **SemiconductorCrystalStructures.jsx** - Estruturas cristalinas
- **CrystalGrowthMethods.jsx** - Métodos de crescimento (Czochralski, etc.)

### 7.3 Componentes de Estatística Quântica

- **FermiDiracPlot.jsx** - f(E) + Maxwell-Boltzmann + faixa validade (RF03, RF04)
- **FermiDiracEducational.jsx** - Versão educacional Fermi-Dirac
- **QuantumWell3D.jsx** - Poço infinito 3D, esfera de Fermi
- **DensityOfStates.jsx** - g(E), f(E), n(E)=g·f, p(E)=g·(1−f) (RF05)
- **DensityOfStatesEducational.jsx** - Versão educacional DOS
- **QuantumAtomModel.jsx** - Modelo atômico quântico

### 7.4 Componentes de Transporte e Dispositivos

- **CarrierVsTemp.jsx** - ln(n,p,ni) vs 1000/T (Arrhenius) (RF07)
- **CarrierPanel.jsx** - Painel numérico (Eg, EF, n, p, ni, Nc, Nv) (RF06)
- **JunctionPN.jsx** - Junção pn
- **TransistorTechPanel.jsx** - Tecnologia de transistores
- **FetTypesPanel.jsx** - Tipos de FETs
- **DegenerateNonDegenerate.jsx** - Regimes degenerado/não-degenerado
- **DiffusionDrift.jsx** - Difusão e deriva
- **DepletionLayer.jsx** - Camada de depleção
- **EinsteinRelation.jsx** - Relação de Einstein

### 7.5 Componentes Educacionais e Conteúdo

- **LearningObjectives.jsx** - Roteiro com 8 competências auto-avaliáveis
- **ConceitosQuestoes.jsx** - Conceitos e questões
- **Questoes.jsx** - Sistema de questões
- **ExercisesPanel.jsx** - Painel de exercícios
- **Glossary.jsx** - Glossário de termos
- **PeriodicTable.jsx** - Tabela periódica
- **Sobre.jsx** - Página sobre o projeto
- **PerovskitesContent.jsx** - Conteúdo sobre perovskitas

### 7.6 Componentes de Fórmulas e Matemática

- **FormulaCard.jsx** - Cartão de fórmula reutilizável (RF08)
- **FormulaCardWithNavigation.jsx** - Cartão com navegação
- **FormulasPanel.jsx** - 20+ fórmulas com derivações expandíveis
- **Math.jsx** - Wrapper React para KaTeX
- **EducationalGraph.jsx** - Gráfico educacional genérico

### 7.7 Componentes de Conteúdo Específico

- **CzochralskiPanel.jsx** - Painel Czochralski
- **CzochralskiContent.jsx** - Conteúdo Czochralski
- **BridgmanStockbargerContent.jsx** - Conteúdo Bridgman-Stockbarger
- **FloatZoneContent.jsx** - Conteúdo Float Zone
- **EpitaxialContent.jsx** - Conteúdo epitaxial
- **ComparisonContent.jsx** - Conteúdo comparativo
- **CrystalLearningObjectives.jsx** - Objetivos de aprendizado cristal

### 7.8 Componentes Legados/Descontinuados

- **Controls.jsx** - Controles legados (substituído por ControlPanel)

---

## 8. CAMADA DE FÍSICA (src/physics/)

### 8.1 Arquivos Principais

- **constants.js** - Constantes fundamentais (k_B, h, ℏ, m₀, q em SI)
- **materials.js** - Propriedades dos materiais (Si, Ge, GaAs: Eg, m*, gap direto/indireto, Varshni)
- **formulas.js** - Fórmulas principais (Fermi-Dirac, MB, Nc/Nv, n/p/ni, EF, DOS, log_event)
- **junctionPN.js** - Cálculos específicos para junção pn
- **formulaTaxonomy.js** - Taxonomia/classificação de fórmulas
- **questoes.js** - Banco de questões

### 8.2 Funções Principais (formulas.js)

- `carrierConcentrations(material, T, ND, NA)` - Calcula n, p, ni, EF, Eg, Nc, Nv
- `fermiDirac(E, EF, T)` - Distribuição de Fermi-Dirac
- `maxwellBoltzmann(E, EF, T)` - Aproximação de Maxwell-Boltzmann
- `densityOfStates(E, Ec, Ev, material)` - Densidade de estados g(E)
- `log_event(type, message, params)` - Logging estruturado (PDCL)

### 8.3 Constantes Físicas (constants.js)

```js
k_B_J  = 1.380649e-23      // J/K (constante de Boltzmann)
k_B_eV = 8.617333262e-5    // eV/K
h      = 6.62607015e-34    // J·s (constante de Planck)
hbar   = 1.054571817e-34   // J·s (constante de Planck reduzida)
m_0    = 9.1093837015e-31  // kg (massa do elétron livre)
q      = 1.602176634e-19   // C (carga elementar)
```

### 8.4 Materiais Disponíveis (materials.js)

#### Si (Silício)

- Eg_300: 1.12 eV, Eg_0: 1.17 eV
- mn_eff: 1.08, mp_eff: 0.81
- ni_300: 1.0e10 cm⁻³
- gap_type: indirect
- Dopantes: P (dE=0.045 eV), B (dE=0.045 eV)

#### Ge (Germânio)

- Eg_300: 0.66 eV, Eg_0: 0.7437 eV
- mn_eff: 0.56, mp_eff: 0.29
- ni_300: 2.0e13 cm⁻³
- gap_type: indirect
- Dopantes: P (dE=0.012 eV), B (dE=0.010 eV)

#### GaAs (Arseneto de Gálio)

- Eg_300: 1.424 eV, Eg_0: 1.519 eV
- mn_eff: 0.067, mp_eff: 0.47
- ni_300: 2.1e6 cm⁻³
- gap_type: direct
- Dopantes: Si (dE=0.006 eV), Zn (dE=0.031 eV)

#### GaN (Nitreto de Gálio)

- Eg_300: 3.39 eV, Eg_0: 3.51 eV
- mn_eff: 0.20, mp_eff: 1.4
- ni_300: 1.0e-10 cm⁻³
- gap_type: direct
- Dopantes: Si (dE=0.017 eV), Mg (dE=0.170 eV)

#### SiC (Carbeto de Silício - 4H)

- Eg_300: 3.23 eV, Eg_0: 3.26 eV
- mn_eff: 0.35, mp_eff: 1.0
- ni_300: 1.0e-9 cm⁻³
- gap_type: indirect
- Dopantes: N (dE=0.05 eV), Al (dE=0.20 eV)

### 8.5 Fórmula de Varshni (Eg vs Temperatura)

```js
Eg(T) = Eg(0) - alpha * T^2 / (T + beta)
```

- alpha: coeficiente de temperatura (eV/K)
- beta: temperatura característica (K)

### 8.6 Fórmulas Físicas Principais

#### Distribuição de Fermi-Dirac

```js
f(E) = 1 / [1 + exp((E - E_F) / (k_B * T))]
```

- Probabilidade de ocupação de um estado de energia E
- E_F: nível de Fermi
- k_B: constante de Boltzmann
- T: temperatura

#### Aproximação de Maxwell-Boltzmann

```js
f_MB(E) ≈ exp(-(E - E_F) / (k_B * T))
```

- Válida quando |E - E_F| ≫ 3k_B T

#### Densidade Efetiva de Estados

```js
N_c = 2 * (2 * π * m*_n * k_B * T / h^2)^(3/2)
N_v = 2 * (2 * π * m*_p * k_B * T / h^2)^(3/2)
```

- N_c: densidade efetiva na banda de condução
- N_v: densidade efetiva na banda de valência
- m*_n, m*_p: massas efetivas de elétrons e lacunas

#### Concentração de Portadores (não-degenerado)

```js
n = N_c * exp(-(E_c - E_F) / (k_B * T))
p = N_v * exp(-(E_F - E_v) / (k_B * T))
```

- n: concentração de elétrons
- p: concentração de lacunas
- E_c, E_v: bordas das bandas de condução e valência

#### Lei de Ação de Massas

```js
n * p = n_i^2 = N_c * N_v * exp(-E_g / (k_B * T))
```

- n_i: concentração intrínseca
- E_g: gap de energia

#### Nível de Fermi Intrínseco

```js
E_Fi = (E_c + E_v) / 2 + (k_B * T / 2) * ln(N_v / N_c)
```

#### Neutralidade de Carga (ionização completa)

```js
n + N_A^- = p + N_D^+
```

Para tipo-n:

```js
n ≈ (N_D - N_A) / 2 + sqrt(((N_D - N_A) / 2)^2 + n_i^2)
```

#### Densidade de Estados (3D, banda parabólica)

```js
g_c(E) = (1 / (2 * π^2)) * (2 * m*_n / hbar^2)^(3/2) * sqrt(E - E_c), E ≥ E_c
g_v(E) = (1 / (2 * π^2)) * (2 * m*_p / hbar^2)^(3/2) * sqrt(E_v - E), E ≤ E_v
```

#### Massa Efetiva

```js
1 / m* = (1 / hbar^2) * (d^2E / dk^2)
```

- Inverso da curvatura da banda no extremo

#### Lei de Newton no Cristal

```js
F_ext = m* * (dv_g / dt)
```

- F_ext: força externa
- v_g: velocidade de grupo

---

## 9. INTERNACIONALIZAÇÃO (src/locales/)

### 9.1 Idiomas Suportados
- **pt.js** - Português (padrão/default)
- **en.js** - Inglês
- **ar.js** - Árabe
- **hi.js** - Hindi
- **zh.js** - Chinês

### 9.2 Contexto de Linguagem
- **LanguageContext.jsx** - Provider React Context para i18n
- Sistema de tradução via hook `useTranslation()`
- Chaves organizadas por seção: header, menu, components, footer, etc.

---

## 10. ROTAS DA APLICAÇÃO (App.jsx + routes.config.js)

### 10.1 Rotas Principais
| Rota | Componente | Descrição |
|------|------------|-----------|
| `/` | BandDiagram + FermiDiracPlot | Visão geral (home) |
| `/overview` | BandDiagram + FermiDiracPlot | Visão geral (alternativa) |
| `/objectives` | LearningObjectives | Roteiro de estudo |
| `/conceptsQ` | ConceitosQuestoes | Conceitos e questões |
| `/questions` | Questoes | Sistema de questões |
| `/about` | Sobre | Sobre o projeto |
| `/support-us` | SupportPanel | Apoie o projeto |

### 10.2 Rotas de Física de Semicondutores
| Rota | Componente | Descrição |
|------|------------|-----------|
| `/lattice` | Lattice | Rede cristalina |
| `/diamond-unit-cell` | DiamondLatticeUnitCell | Célula unitária |
| `/quantumAtom` | QuantumAtomModel | Modelo atômico quântico |
| `/atomband` | AtomToBand | Átomos → Bandas |
| `/allowed` | AllowedForbidden | Bandas permitidas/proibidas |
| `/kp` | KronigPenneyDiagram | Kronig-Penney |
| `/mis` | MetalInsulatorSemi | Metal × Isolante × Semicondutor |
| `/kspace` | KSpaceDiagram | Espaço-k |
| `/effmass` | EffectiveMassDemo | Massa efetiva |
| `/particles` | ElectronHoleCard | Elétron × Lacuna |

### 10.3 Rotas de Estatística Quântica
| Rota | Componente | Descrição |
|------|------------|-----------|
| `/fermi` | FermiDiracPlot | Fermi-Dirac & MB |
| `/fermi-edu` | FermiDiracEducational | Fermi-Dirac educacional |
| `/dos` | QuantumWell3D + DensityOfStates | Densidade de estados |
| `/dos-edu` | DensityOfStatesEducational | DOS educacional |
| `/arrhenius` | CarrierVsTemp | n(T) Arrhenius |

### 10.4 Rotas de Dispositivos e Tecnologia
| Rota | Componente | Descrição |
|------|------------|-----------|
| `/junction` | JunctionPN | Junção pn |
| `/transistorTech` | TransistorTechPanel | Tecnologia de transistores |
| `/fetTypes` | FetTypesPanel | Tipos de FETs |
| `/czochralski` | CrystalGrowthMethods | Crescimento de cristais |
| `/crystal-structures` | SemiconductorCrystalStructures | Estruturas cristalinas |
| `/perovskites` | PerovskitesContent | Perovskitas |

### 10.5 Rotas de Referência
| Rota | Componente | Descrição |
|------|------------|-----------|
| `/periodic` | PeriodicTable | Tabela periódica |
| `/exercises` | ExercisesPanel | Exercícios |
| `/glossary` | Glossary | Glossário |

---

## 11. ESTADO GLOBAL DA APLICAÇÃO (App.jsx)

### 11.1 Variáveis de Estado
- `material` - Material selecionado ('Si', 'Ge', 'GaAs')
- `type` - Tipo de dopagem ('intrinsic', 'n', 'p')
- `T` - Temperatura (K)
- `ND` - Concentração de doadores (cm⁻³)
- `NA` - Concentração de aceitadores (cm⁻³)
- `EFOverride` - Override manual do nível de Fermi

### 11.2 Cálculos Derivados (useMemo)
- `calc` - Objeto com todos os cálculos físicos (n, p, ni, EF, Eg, Ec, Ev, Nc, Nv)
- `effND` - Dopagem efetiva tipo-n
- `effNA` - Dopagem efetiva tipo-p

### 11.3 Props Passadas aos Componentes
Componentes recebem props relevantes do estado global:
- Componentes de diagrama: `material`, `T`, `Eg`, `Ec`, `Ev`, `EF`
- Componentes de dopagem: `material`, `type`
- Componentes de temperatura: `material`, `ND`, `NA`, `currentT`

---

## 12. UTILITÁRIOS E LOADERS (src/utils/)

- **formulasLoader.js** - Loader para fórmulas do sistema RAG
- **booksIndexLoader.js** - Loader para índice de livros PDFs

---

## 13. SCRIPTS DE AUTOMAÇÃO (scripts/)

- **generate-sitemap.js** - Gera sitemap.xml para SEO (usa routes.config.js)
- **extract-pdf-content.js** - Extrai conteúdo de PDFs para RAG
- **add_formula_metadata.py** - Adiciona metadados a fórmulas
- **markdown_history_manager.py** - Gerencia histórico de arquivos markdown (hook pre-commit)

---

## 14. RECURSOS ESTÁTICOS (public/)

### 14.1 Imagens
- `logo-basicaodaeletronica.png` - Logo do projeto
- `favicon.svg` - Favicon
- `pix.png` / `pix.svg` - QR Code PIX para doações
- `social-preview.png` / `social-preview.svg` - Imagem para redes sociais

### 14.2 Fórmulas (public/formulas/)
- Índice: `index.json`
- Extraídas de 3 livros de referência:
  - Modular Series On Solid State Devices - Robert F Pierret
  - Semiconductor Devices - Kanaan Kano
  - Semiconductor physics and devices - Donald A. Neamen

---

## 15. DOCUMENTAÇÃO

### 15.1 Arquivos Principais
- **README.md** - Documentação principal, instruções de uso, stack, roteiro didático
- **REQUIREMENTS.md** - Requisitos funcionais/não funcionais, modelo físico
- **CONTRIBUTING.md** - Guia para contribuidores, fluxo de PR, código de conduta
- **SITEMAP_GUIDE.md** - Guia de geração de sitemap

### 15.2 Documentação Técnica (docs/)
- PDFs de referência em física de semicondutores
- Pasta `docs/extracao/` para conteúdo extraído

---

## 16. SISTEMA DE LOGGING

### 16.1 Padrão (logs.md)
Formato: `[YYYY-MM-DD HH:MM:SS] [arquivo:função:linha] emoji mensagem - parâmetros`

Emojis:
- ℹ️ - Informações gerais
- ⚠️ - Alertas
- ❌ - Erros críticos
- ✅ - Operações concluídas
- 🔍 - Depuração
- 🚀 - Início de processos
- 🏁 - Fim de processos

### 16.2 Implementação
- Função `log_event()` em `src/physics/formulas.js`
- Logs armazenados em `logs/` com rotação automática (diária ou 10MB)
- Níveis configuráveis via variáveis de ambiente ou config.json

---

## 17. METODOLOGIA DE DESENVOLVIMENTO

### 17.1 PDCL (pdcl.md)
- **Plan** - Planejar funcionalidades, requisitos e arquitetura
- **Do** - Implementar seguindo planejamento com código limpo e logs
- **Check** - Executar testes completos verificando requisitos
- **Log** - Iterar baseado em feedback e logs

### 17.2 Validação (validacao_da_das_correcoes_e_testes.md)
- Testes unitários para funções individuais
- Testes de integração para componentes
- Testes de aceitação para requisitos de negócio
- Verificação de logs gerados
- Teste de cenários reais, condições de erro e casos extremos

---

## 18. ONDE ADICIONAR NOVOS RECURSOS

### 18.1 Nova Aba/Visualização
1. Criar componente em `src/components/NovoComponente.jsx`
2. Adicionar rota em `App.jsx` (seção `<Routes>`)
3. Adicionar entrada em `routes.config.js` (array `routes`)
4. Adicionar item ao menu em `HierarchicalMenu.jsx`
5. Adicionar traduções em `src/locales/*.js`
6. Atualizar ESTE ARQUIVO (seção 6)

### 18.2 Nova Fórmula
1. Adicionar função em `src/physics/formulas.js` ou arquivo específico
2. Criar componente de exibição (ou usar `FormulaCard.jsx`)
3. Adicionar ao `FormulasPanel.jsx` se necessário
4. Adicionar metadados em `src/physics/formulaTaxonomy.js`
5. Atualizar ESTE ARQUIVO (seção 4)

### 18.3 Novo Material
1. Adicionar propriedades em `src/physics/materials.js`
2. Verificar constantes em `src/physics/constants.js`
3. Atualizar `ControlPanel.jsx` se necessário
4. Atualizar ESTE ARQUIVO (seção 4.1)

### 18.4 Novo Idioma
1. Criar arquivo `src/locales/<code>.js`
2. Importar em `src/contexts/LanguageContext.jsx`
3. Adicionar entrada em `routes.config.js` (array `LANGUAGES`)
4. Atualizar ESTE ARQUIVO (seção 5.1)

### 18.5 Novo Script de Automação
1. Criar script em `scripts/`
2. Adicionar ao `package.json` em `scripts` se necessário
3. Atualizar ESTE ARQUIVO (seção 9)

---

## 19. REDUNDÂNCIAS E PONTOS DE ATENÇÃO

### 19.1 Componentes Similares
- `Controls.jsx` (legado) vs `ControlPanel.jsx` (atual) - Preferir ControlPanel
- `FermiDiracPlot.jsx` vs `FermiDiracEducational.jsx` - Versões diferentes para contextos diferentes
- `DensityOfStates.jsx` vs `DensityOfStatesEducational.jsx` - Versões diferentes para contextos diferentes

### 19.2 Arquivos de Configuração
- `routes.config.js` - Deve ser mantido sincronizado com `App.jsx` rotas
- `package.json` - Scripts devem refletir funcionalidades disponíveis

### 19.3 Traduções
- Todos os textos visíveis devem ter tradução em `src/locales/*.js`
- Chaves de tradução devem seguir convenção de nomenclatura consistente

---

## 20. REFERÊNCIAS RÁPIDAS

### 20.1 Para Adicionar Nova Funcionalidade
1. Verificar se componente similar já existe em `src/components/`
2. Consultar seção 14 para localização correta
3. Seguir metodologia PDCL (`.windsurf/rules/pdcl.md`)
4. Implementar logging estruturado (`.windsurf/rules/logs.md`)
5. Atualizar documentação relevante
6. **ATUALIZAR ESTE ARQUIVO**

### 20.2 Para Debugar
1. Verificar logs em `logs/`
2. Usar `log_event()` para rastreamento
3. Consultar `REQUIREMENTS.md` para comportamento esperado
4. Verificar estado global em `App.jsx`

### 20.3 Para Contribuir
1. Ler `CONTRIBUTING.md`
2. Seguir regras em `.windsurf/rules/`
3. Usar workflows em `.windsurf/workflows/`
4. Atualizar documentação e este mapa



---
**Resumo:** Arquivo markdown gerenciado com histórico automático
**Data de Criação:** 2026-05-30
**Autor:** Carlos Delfino
**Versão:** 1.0
**Última Atualização:** 2026-05-30
**Atualizado por:** Carlos Delfino
**Histórico de Alterações:**
- 2026-05-30 - Criado por Carlos Delfino - Versão 1.0
