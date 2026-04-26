![visitors](https://visitor-badge.laobi.icu/badge?page_id=carlosdelfino.BasicaoDaEletronica)
[![License: CC BY-SA 4.0](https://img.shields.io/badge/License-CC_BY--SA_4.0-blue.svg)](https://creativecommons.org/licenses/by-sa/4.0/)
![Language: Portuguese](https://img.shields.io/badge/Language-Portuguese-brightgreen.svg)
![React](https://img.shields.io/badge/React-18-61dafb)
![Vite](https://img.shields.io/badge/Vite-5-646cff)
![SVG](https://img.shields.io/badge/SVG-puro-orange)
![KaTeX](https://img.shields.io/badge/KaTeX-formulas-success)
![Status](https://img.shields.io/badge/Status-Educa%C3%A7%C3%A3o-brightgreen)

<!-- Animated Header -->
<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=0:0f172a,50:1a56db,100:10b981&height=220&section=header&text=Bandas%20de%20Energia&fontSize=42&fontColor=ffffff&animation=fadeIn&fontAlignY=35&desc=Simulador%20Educacional%20%7C%20Si%20%C2%B7%20Ge%20%C2%B7%20GaAs%20%7C%20F%C3%ADsica%20Estat%C3%ADstica%20Qu%C3%A2ntica&descSize=18&descAlignY=55&descColor=94a3b8" width="100%" alt="Header"/>
</p>

# Diagrama de Bandas em Semicondutores

Aplicação **React + SVG + HTML5 + CSS** que demonstra, com rigor físico e dezenas de gráficos
interativos, o funcionamento das **bandas de energia** em semicondutores intrínsecos
e dopados (tipo-n com **Fósforo**, tipo-p com **Boro**), incluindo as fórmulas e a
**estatística quântica** que governam o comportamento dos elétrons.

## Conceitos elucidados pelo sistema

| Conceito | Onde aparece |
|----------|--------------|
| **Discrete levels split into bands as N atoms approach** | aba *Átomos → Bandas* |
| **Schrödinger eq. + Kronig-Penney como base da teoria** | aba *Kronig-Penney* + *Fórmulas* (cards 0a–0d, 11, 12) |
| **Allowed / forbidden energy band** | abas *Bandas Permitidas/Proibidas*, *Kronig-Penney*, *Átomos → Bandas* |
| **Density of states from 3D infinite well** | aba *Densidade de Estados* (componente `QuantumWell3D` + `DensityOfStates`) |
| **Fermi–Dirac probability function** | aba *Fermi-Dirac & MB* (slider de T e E_F) |
| **Fermi energy E_F** | todos os diagramas de bandas, painel numérico |
| **Maxwell–Boltzmann approximation** | aba *Fermi-Dirac & MB* (sobreposta + faixa de validade) |
| **Electron (-q, +m\*, fundo BC) vs Hole (+q, +m\*, topo BV)** | aba *Elétron × Lacuna* |
| **Electron / Hole effective mass** | abas *Espaço-k*, *Massa Efetiva*, *Elétron × Lacuna* |
| **k-space diagram (Si × GaAs, direct/indirect)** | aba *Espaço-k* com gap direto/indireto |
| **Kronig–Penney model** | aba *Kronig-Penney* (V(x), LHS(E), bandas E(k)) |

## Stack

- **React 18** + **Vite 5** (SPA, sem backend)
- **SVG puro** para todos os diagramas (escalável e exportável)
- **KaTeX** para fórmulas matemáticas
- **CSS** com variáveis e tema dark científico, layout responsivo

## Como executar

```bash
npm install
npm run dev      # servidor de desenvolvimento em http://localhost:5173
npm run build    # build de produção em ./dist
npm run preview  # serve o build localmente
```

## Estrutura do projeto

```text
.
├── REQUIREMENTS.md
├── README.md
├── index.html
├── package.json
├── vite.config.js
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── physics/
    │   ├── constants.js     # k_B, h, ℏ, m₀, q
    │   ├── materials.js     # Si, Ge, GaAs (Eg, m*, gap direto/indireto, …)
    │   └── formulas.js      # Fermi-Dirac, Maxwell-Boltzmann, Nc/Nv, n/p/ni, EF, DOS, log_event
    ├── components/
    │   ├── Controls.jsx
    │   ├── BandDiagram.jsx          # E vs x, com portadores animados
    │   ├── Lattice.jsx              # rede 2D Si/P/B
    │   ├── AllowedForbidden.jsx     # bandas múltiplas (gap, BV, BC, gaps superiores)
    │   ├── KronigPenneyDiagram.jsx  # V(x) + LHS(E) + bandas resultantes
    │   ├── KSpaceDiagram.jsx        # E vs k, gap direto vs indireto
    │   ├── EffectiveMassDemo.jsx    # F = m*·a com sliders
    │   ├── FermiDiracPlot.jsx       # f(E) + Maxwell-Boltzmann
    │   ├── DensityOfStates.jsx      # g(E), f(E), n(E), p(E)
    │   ├── CarrierVsTemp.jsx        # n,p,ni vs 1000/T
    │   ├── CarrierPanel.jsx         # painel numérico
    │   ├── FormulaCard.jsx          # cartão de fórmula reutilizável
    │   ├── FormulasPanel.jsx        # 16 fórmulas com derivações
    │   └── Math.jsx                 # wrapper React para KaTeX
    └── styles/app.css
```

## Modelo físico

Modelo não-degenerado, ionização completa de dopantes, bandas parabólicas próximas
aos extremos. Equação de Varshni para Eg(T). Constantes em SI. Para detalhes
consulte [`REQUIREMENTS.md`](./REQUIREMENTS.md), seção 4.

| Fórmula | Expressão |
|---------|-----------|
| Fermi-Dirac | f(E) = 1 / [1 + exp((E−E_F)/k_BT)] |
| Maxwell-Boltzmann | f_MB(E) ≈ exp(−(E−E_F)/k_BT) |
| Densidade efetiva | N_c = 2 (2π m*_n k_BT / h²)^{3/2} |
| Concentração | n = N_c exp(−(E_c−E_F)/k_BT) |
| Ação de massas | n p = n_i² = N_c N_v exp(−E_g/k_BT) |
| Kronig-Penney | P sin(αa)/(αa) + cos(αa) = cos(ka) |
| Massa efetiva | 1/m* = (1/ℏ²) d²E/dk² |
| Lei de Newton no cristal | F_ext = m* dv_g/dt |

## Roteiro de uso (sugestão didática)

1. **Rede Cristalina** → entender ligações covalentes do Si e papel dos dopantes.
2. **Bandas Permitidas/Proibidas** → visualizar onde estão BV, BC e o gap.
3. **Kronig-Penney** → mover o slider P e ver bandas e gaps emergirem da periodicidade.
4. **Espaço-k** → trocar entre Si (indireto) e GaAs (direto), notar curvatura ↔ m*.
5. **Massa Efetiva** → aplicar uma força e observar duas partículas com m₀ vs m*.
6. **Fermi-Dirac & MB** → variar T e E_F, ver onde MB é boa aproximação.
7. **Densidade de Estados** → integrar visualmente n(E) = g(E)·f(E).
8. **n(T) Arrhenius** → identificar regiões freeze-out / extrínseca / intrínseca.
9. **Visão Geral** → ver tudo em conjunto para semicondutor escolhido.
10. **Fórmulas & Derivações** → revisar 16 fórmulas com derivações expandíveis.

## Desenvolvimento

O projeto segue a metodologia **PDCL** (Plan, Do, Check, Loop) descrita em
[`.windsurf/rules/pdcl.md`](./.windsurf/rules/pdcl.md). Logs estruturados são
emitidos no console do navegador em formato:

```text
[YYYY-MM-DD HH:MM:SS] [arquivo:função:linha] emoji mensagem - parâmetros
```

através da função `log_event()` em `src/physics/formulas.js`.

```text
[2026-04-26 18:05:12] [App.jsx:effect:46] 📊 Estado atualizado - material=Si, T=300, n=1.00e+10
```

## Sobre

Este projeto visa **facilitar o aprendizado da Física dos Semicondutores** e será continuamente
ampliado conforme meu próprio avanço nos estudos. Foi construído usando **Claude Opus 4.7** como
par de programação, com base nas leituras que tenho feito do livro
*Semiconductor Physics and Devices* de **Donald A. Neamen**, complementadas pela coleção
*Modular Series on Solid State Devices* (Robert F. Pierret et al.).

### Bibliografia de referência

- **Neamen, D. A.** — *Semiconductor Physics and Devices: Basic Principles* (4ª ed.).
  [📖 Amazon](https://www.amazon.com.br/Semiconductor-Physics-Devices-Donald-Neamen/dp/0073529583)
- **Pierret, R. F. et al.** — *Modular Series on Solid State Devices*
  (volumes I a VI: *Semiconductor Fundamentals*, *The pn Junction Diode*, *The Bipolar Junction Transistor*,
  *Field-Effect Devices*, *Volume Optoelectronics*, *Advanced Semiconductor Fundamentals*).
  [📖 Amazon — busca da coleção](https://www.amazon.com.br/s?k=Modular+Series+on+Solid+State+Devices+Pierret)

### Autor

- **Nome:** Carlos Delfino Carvalho Pinheiro
- **E-mail:** [consultoria@carlosdelfino.eti.br](mailto:consultoria@carlosdelfino.eti.br)
- **WhatsApp:** [+55 (85) 98520-5490](https://wa.me/5585985205490)
- **Comunidade WhatsApp — Física dos Semicondutores:**
  [Entrar no grupo](https://chat.whatsapp.com/C3vtPfTwaSlIPmcl8aHS1X)
- **LinkedIn:** [linkedin.com/in/carlosdelfino](https://linkedin.com/in/carlosdelfino)
- **GitHub:** [github.com/carlosdelfino](https://github.com/carlosdelfino)
- **X (Twitter):** [@carlosdelfinoCP](https://x.com/carlosdelfinoCP)

### Contribua

**Críticas e sugestões são sempre muito bem-vindas!** A forma preferida de contribuição é via
**Pull Request** apresentando melhorias concretas — código, novas visualizações, correções
físicas, traduções ou aprimoramentos didáticos. Você também pode abrir uma *issue* descrevendo
o problema ou ideia.

#### Roteiro para colaboradores

1. *Fork* deste repositório no GitHub.
2. Crie uma branch descritiva: `git checkout -b melhoria/nome-da-melhoria`.
3. Implemente a alteração seguindo a metodologia **PDCL** descrita em `.windsurf/rules/pdcl.md`.
4. Atualize `REQUIREMENTS.md` se houver novo requisito.
5. Garanta que `npm run build` finaliza sem erros.
6. Abra um Pull Request explicando *o quê* e *por quê* da mudança.

#### Tipos de contribuição que celebro

- Novos diagramas/animações que aprofundem conceitos (ex.: junção pn, MOS, FET).
- Correções de física, unidades ou rigor matemático.
- Aprimoramentos de UX/acessibilidade (contraste, navegação por teclado, *screen-readers*).
- Traduções para outros idiomas.
- Exercícios resolvidos no formato de cartões interativos.
- Reviews críticos do conteúdo didático com referências bibliográficas.

### Hall dos Colaboradores

> *Esta seção será preenchida com os nomes e GitHub de quem contribuir com o projeto.*
> *Seja o primeiro a colaborar e tenha seu nome aqui!*

| Nome | Contribuição | GitHub |
|------|--------------|--------|
| Carlos Delfino Carvalho Pinheiro | Idealização e desenvolvimento inicial | [@carlosdelfino](https://github.com/carlosdelfino) |
| *Seu nome aqui* | *Sua contribuição* | *@seu-usuário* |

## Licença

CC BY-SA 4.0. Material educacional — sinta-se livre para usar em aulas, citando a fonte.

<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=0:10b981,50:1a56db,100:0f172a&height=120&section=footer" width="100%" alt="Footer"/>
</p>

---
**Resumo:** Simulador educacional interativo em React + SVG + KaTeX que demonstra bandas de energia em semicondutores, modelo de Kronig-Penney, massa efetiva, espaço-k, distribuições de Fermi-Dirac e Maxwell-Boltzmann, densidade de estados e estatística quântica de elétrons.
**Data de Criação:** 2026-04-26
**Autor:** Carlos Delfino Carvalho Pinheiro (com apoio de Claude Opus 4.7 / Rapport Generativa)
**Versão:** 1.3
**Última Atualização:** 2026-04-26
**Atualizado por:** Carlos Delfino
**Histórico de Alterações:**
- 2026-04-26 - Atualizado por Carlos Delfino - Atualização de arquivo...
- 2026-04-26 - Criado por Rapport Generativa - Versão 1.0 (estrutura inicial: bandas, Fermi-Dirac, MB, DOS, Arrhenius)
- 2026-04-26 - Atualizado por Rapport Generativa - Versão 1.1 (adicionados Kronig-Penney, espaço-k, massa efetiva, bandas permitidas/proibidas)
- 2026-04-26 - Atualizado por Rapport Generativa - Versão 1.2 (Átomos→Bandas, Poço Infinito 3D, Elétron×Lacuna, Metal×Isolante×Semicondutor, Roteiro de Estudo)
- 2026-04-26 - Atualizado por Carlos Delfino - Versão 1.3 (seção Sobre com bibliografia, dados de contato, espaço para colaboradores)
