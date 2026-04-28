![visitors](https://visitor-badge.laobi.icu/badge?page_id=carlosdelfino.fisica-dos-semicondutores)
[![License: CC BY-SA 4.0](https://img.shields.io/badge/License-CC_BY--SA_4.0-blue.svg)](https://creativecommons.org/licenses/by-sa/4.0/)
![Language: Portuguese](https://img.shields.io/badge/Language-Portuguese-brightgreen.svg)
![React](https://img.shields.io/badge/React-18-61dafb)
![Vite](https://img.shields.io/badge/Vite-5-646cff)
![SVG](https://img.shields.io/badge/SVG-puro-orange)
![KaTeX](https://img.shields.io/badge/KaTeX-formulas-success)
![Status](https://img.shields.io/badge/Status-Educa%C3%A7%C3%A3o-brightgreen)
[![Stars](https://img.shields.io/github/stars/carlosdelfino/fisica-dos-semicondutores?style=social)](https://github.com/carlosdelfino/fisica-dos-semicondutores/stargazers)
[![Forks](https://img.shields.io/github/forks/carlosdelfino/fisica-dos-semicondutores?style=social)](https://github.com/carlosdelfino/fisica-dos-semicondutores/network/members)
[![Issues](https://img.shields.io/github/issues/carlosdelfino/fisica-dos-semicondutores)](https://github.com/carlosdelfino/fisica-dos-semicondutores/issues)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/carlosdelfino/fisica-dos-semicondutores/pulls)
![Repository Size](https://img.shields.io/github/repo-size/carlosdelfino/fisica-dos-semicondutores)
![Last Commit](https://img.shields.io/github/last-commit/carlosdelfino/fisica-dos-semicondutores)

<!-- Animated Header -->
<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=0:0f172a,50:1a56db,100:10b981&height=220&section=header&text=Aprendendo%20a%20F%C3%ADsica%20dos%20Semicondutores&fontSize=42&fontColor=ffffff&animation=fadeIn&fontAlignY=35&desc=Simulador%20Educacional%20%7C%20Si%20%C2%B7%20Ge%20%C2%B7%20GaAs%20%7C%20F%C3%ADsica%20Estat%C3%ADstica%20Qu%C3%A2ntica&descSize=18&descAlignY=55&descColor=94a3b8" width="100%" alt="Header"/>
</p>

# Aprendendo a Física dos Semicondutores

Aplicação **React + SVG + HTML5 + CSS** que demonstra, com rigor físico e dezenas de gráficos
interativos, o funcionamento das **bandas de energia** em semicondutores intrínsecos
e dopados (tipo-n com **Fósforo**, tipo-p com **Boro**), incluindo as fórmulas e a
**estatística quântica** que governam o comportamento dos elétrons.

## Conceitos elucidados pelo sistema

O simulador cobre, através de **14 abas interativas** e **20+ cartões de fórmulas com derivações**,
os seguintes conceitos centrais da física dos semicondutores:

| Conceito | Onde aparece |
|----------|--------------|
| **Splitting de níveis atômicos em bandas (Si)** | aba *Átomos → Bandas* |
| **Schrödinger eq. + Kronig-Penney como base rigorosa** | aba *Kronig-Penney* + *Fórmulas* (cards 0a–0d, 11, 12) |
| **Bandas permitidas / proibidas** | abas *Bandas Permitidas/Proibidas*, *Kronig-Penney*, *Átomos → Bandas* |
| **Densidade de estados (poço infinito 3D)** | aba *Densidade de Estados* (`QuantumWell3D` + `DensityOfStates`) |
| **Distribuição de Fermi–Dirac e energia de Fermi** | aba *Fermi-Dirac & MB* (sliders de T e E_F) |
| **Aproximação de Maxwell–Boltzmann** | aba *Fermi-Dirac & MB* (sobreposta + faixa de validade) |
| **Elétron (−q, +m\*, fundo BC) vs Lacuna (+q, +m\*, topo BV)** | aba *Elétron × Lacuna* |
| **Massa efetiva (elétron e lacuna)** | abas *Espaço-k*, *Massa Efetiva*, *Elétron × Lacuna* |
| **Diagrama E×k — gap direto vs indireto (Si × GaAs)** | aba *Espaço-k* |
| **Modelo de Kronig–Penney (V(x), LHS(E), E(k))** | aba *Kronig-Penney* |
| **Metal × Isolante × Semicondutor (qualitativo via bandas)** | aba *Metal × Isolante × Semicondutor* |
| **Dopagem tipo-n (P) e tipo-p (B); concentrações n, p, n_i** | abas *Visão Geral*, *Rede Cristalina*, painel numérico |
| **n(T) Arrhenius: freeze-out / extrínseco / intrínseco** | aba *n(T) Arrhenius* |
| **Roteiro de estudo com 8 competências auto-avaliáveis** | aba *Roteiro de Estudo* |

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
    ├── App.jsx                       # orquestrador das 14 abas
    ├── physics/
    │   ├── constants.js              # k_B, h, ℏ, m₀, q (SI)
    │   ├── materials.js              # Si, Ge, GaAs (Eg, m*, gap direto/indireto, Varshni)
    │   └── formulas.js               # Fermi-Dirac, Maxwell-Boltzmann, Nc/Nv, n/p/ni, EF, DOS, log_event
    ├── components/
    │   ├── Controls.jsx              # painel de controles globais
    │   ├── LearningObjectives.jsx    # 🎯 roteiro com 8 competências
    │   ├── BandDiagram.jsx           # E vs x, com portadores animados
    │   ├── Lattice.jsx               # rede 2D Si/P/B com elétron livre / lacuna
    │   ├── AtomToBand.jsx            # atômos isolados → cristal: separação em bandas
    │   ├── AllowedForbidden.jsx      # estrutura completa (núcleo, BV, BC, gaps superiores)
    │   ├── KronigPenneyDiagram.jsx   # V(x) + LHS(E) + E(k) emergente
    │   ├── MetalInsulatorSemi.jsx    # Cu × Si × SiO₂, condutividades comparadas
    │   ├── KSpaceDiagram.jsx         # E×k, gap direto (GaAs) vs indireto (Si/Ge)
    │   ├── EffectiveMassDemo.jsx     # F = m*·a, parábolas comparativas
    │   ├── ElectronHoleCard.jsx      # elétron(−q,+m*) vs lacuna(+q,+m*)
    │   ├── FermiDiracPlot.jsx        # f(E) + Maxwell-Boltzmann + faixa de validade
    │   ├── QuantumWell3D.jsx         # poço infinito 3D, esfera de Fermi, derivação de g(E)∝√E
    │   ├── DensityOfStates.jsx       # g(E), f(E), n(E)=g·f, p(E)=g·(1−f)
    │   ├── CarrierVsTemp.jsx         # ln(n,p,ni) vs 1000/T
    │   ├── CarrierPanel.jsx          # painel numérico (Eg, EF, n, p, ni, Nc, Nv)
    │   ├── FormulaCard.jsx           # cartão de fórmula reutilizável
    │   ├── FormulasPanel.jsx         # 20+ fórmulas com derivações expandíveis
    │   └── Math.jsx                  # wrapper React para KaTeX
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

1. **🎯 Roteiro de Estudo** → ler as 8 competências-meta antes de explorar.
2. **Rede Cristalina** → ligações covalentes do Si e papel dos dopantes (P, B).
3. **Átomos → Bandas** → ver os níveis 3s/3p do Si se desdobrarem em BV/BC.
4. **Bandas Permitidas/Proibidas** → estrutura completa (núcleo, BV, gap, BC, superiores).
5. **Kronig-Penney** → mover slider P e ver bandas/gaps emergirem da periodicidade.
6. **Metal × Isolante × Semicondutor** → comparar Cu, Si e SiO₂ lado-a-lado.
7. **Espaço-k (Si × GaAs)** → gap direto vs indireto, curvatura ↔ m*.
8. **Massa Efetiva** → aplicar força e comparar m₀ vs m* numericamente.
9. **Elétron × Lacuna** → cargas, sentidos de movimento sob campo elétrico.
10. **Fermi-Dirac & MB** → variar T e E_F, identificar região de validade de MB.
11. **Densidade de Estados** → poço infinito 3D → g(E)∝√E → n(E) = g(E)·f(E).
12. **n(T) Arrhenius** → freeze-out / extrínseco / intrínseco em ln(n) × 1000/T.
13. **Visão Geral** → BandDiagram + Fermi-Dirac integrados para o material escolhido.
14. **Fórmulas & Derivações** → revisar 20+ fórmulas com derivações expandíveis.

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

### Contribua — críticas e sugestões via Pull Request

> **🎯 Mensagem essencial:** a *melhor forma* de criticar, sugerir, corrigir
> ou aprimorar este projeto é **abrindo um Pull Request**. Sua contribuição é
> **sempre bem-vinda**, seja uma vírgula numa explicação ou um capítulo
> inteiro de novas visualizações. Mesmo que a PR não seja aceita exatamente
> como está, ela abre uma discussão valiosa que costuma evoluir para algo
> incorporado ao projeto.

📖 **Leia o guia completo em [`CONTRIBUTING.md`](./CONTRIBUTING.md)** — explica fluxo
detalhado, boas práticas, código de conduta e reconhecimento de contribuidores.

#### 🌊 Use o Windsurf — o projeto já está preparado

Recomendo fortemente o [**Windsurf**](https://windsurf.com) como editor para
contribuir. Por quê?

- Há **regras de codificação** em `.windsurf/rules/` que o editor aplica
  automaticamente: padrão de logging (PDCL), formatação de markdown,
  estrutura de componentes — tudo já configurado.
- **Workflows pré-prontos** em `.windsurf/workflows/` (ex.: `/pdcl`,
  `/preparo-projeto`) automatizam tarefas comuns.
- O agente **Cascade** entende a metodologia **PDCL** (Plan, Do, Check, Loop)
  adotada aqui e orienta naturalmente novas implementações dentro desse fluxo.
- Você economiza tempo verificando manualmente regras de estilo, formatação
  de logs e atualização de `REQUIREMENTS.md`.

Se preferir VS Code, Cursor ou outro editor, tudo funciona — apenas observe
manualmente as regras descritas em `.windsurf/rules/`.

#### ⚙️ Hook `pre-commit` — documentação padronizada automaticamente

Este repositório já inclui um **script automático** em
`scripts/markdown_history_manager.py`, ativado por
`.git/hooks/pre-commit`. A cada commit que envolva arquivos `.md`:

- Detecta autor (de `git config user.name`) e data automaticamente.
- Adiciona uma entrada no **Histórico de Alterações** do markdown,
  mantendo o padrão definido em `.windsurf/rules/documentacao.md`.

```bash
chmod +x .git/hooks/pre-commit   # garante execução
git commit -m "docs: ajusta seção X"
# → 🚀 Iniciando atualização de histórico de arquivos markdown...
# → ✅ Histórico atualizado: README.md
```

Use sempre — é o que mantém a documentação do projeto rastreável e padronizada.

#### Roteiro para colaboradores

1. *Fork* deste repositório no GitHub.
2. Branch descritiva: `git checkout -b feat/nome-da-melhoria` (ou `fix/`, `docs/`).
3. Implemente seguindo **PDCL** — `.windsurf/rules/pdcl.md`.
4. Atualize `REQUIREMENTS.md` se introduzir novo requisito.
5. Garanta que `npm run build` finaliza **sem erros**.
6. Commit (o pre-commit atualizará histórico dos `.md`).
7. Push e abra um **Pull Request** — o template carrega automaticamente
   ([`.github/PULL_REQUEST_TEMPLATE.md`](./.github/PULL_REQUEST_TEMPLATE.md)).

#### Tipos de contribuição que celebro

- Novos diagramas/animações que aprofundem conceitos (ex.: junção pn, MOS, FET).
- Correções de física, unidades ou rigor matemático.
- Aprimoramentos de UX/acessibilidade (contraste, navegação por teclado, *screen-readers*).
- Traduções para outros idiomas.
- Exercícios resolvidos no formato de cartões interativos.
- Reviews críticos do conteúdo didático com referências bibliográficas.

#### Sem código? Ainda assim contribua

- 🐛 [Bug Report](.github/ISSUE_TEMPLATE/bug_report.md)
- ✨ [Sugestão de Feature](.github/ISSUE_TEMPLATE/feature_request.md)
- 📚 [Dúvida Didática / Crítica de Conteúdo](.github/ISSUE_TEMPLATE/duvida_didatica.md)
- 💬 WhatsApp da Comunidade (link na seção *Autor*)

### Hall dos Colaboradores

<p align="center">
  <a href="https://github.com/carlosdelfino/fisica-dos-semicondutores/graphs/contributors">
    <img src="https://contrib.rocks/image?repo=carlosdelfino/fisica-dos-semicondutores" alt="Contributors" />
  </a>
</p>

<p align="center">
  <a href="https://github.com/carlosdelfino/fisica-dos-semicondutores/stargazers">
    <img src="https://reporoster.com/stars/carlosdelfino/fisica-dos-semicondutores" alt="Stargazers" />
  </a>
</p>

> *Os avatares acima são atualizados automaticamente pelo GitHub.*
> *Seja o primeiro a contribuir e ter seu rosto aqui!*

| # | Nome | Contribuição | GitHub |
|---|------|--------------|--------|
| 1 | Carlos Delfino Carvalho Pinheiro | Idealização, arquitetura inicial e curadoria didática | [@carlosdelfino](https://github.com/carlosdelfino) |
| — | *Seu nome aqui* | *Sua contribuição (envie um PR!)* | *@seu-usuário* |

### Conecte-se

<p align="center">
  <a href="mailto:consultoria@carlosdelfino.eti.br">
    <img src="https://img.shields.io/badge/E--mail-consultoria%40carlosdelfino.eti.br-d97706?style=for-the-badge&logo=gmail&logoColor=white" alt="E-mail" />
  </a>
  <a href="https://wa.me/5585985205490">
    <img src="https://img.shields.io/badge/WhatsApp-(85)%2098520--5490-25D366?style=for-the-badge&logo=whatsapp&logoColor=white" alt="WhatsApp" />
  </a>
  <a href="https://chat.whatsapp.com/C3vtPfTwaSlIPmcl8aHS1X">
    <img src="https://img.shields.io/badge/Comunidade-F%C3%ADsica%20dos%20Semicondutores-128C7E?style=for-the-badge&logo=whatsapp&logoColor=white" alt="Comunidade WhatsApp" />
  </a>
  <a href="https://linkedin.com/in/carlosdelfino">
    <img src="https://img.shields.io/badge/LinkedIn-carlosdelfino-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white" alt="LinkedIn" />
  </a>
  <a href="https://github.com/carlosdelfino">
    <img src="https://img.shields.io/badge/GitHub-carlosdelfino-181717?style=for-the-badge&logo=github&logoColor=white" alt="GitHub" />
  </a>
  <a href="https://x.com/carlosdelfinoCP">
    <img src="https://img.shields.io/badge/X%20(Twitter)-%40carlosdelfinoCP-000000?style=for-the-badge&logo=x&logoColor=white" alt="X (Twitter)" />
  </a>
</p>

## Licença

CC BY-SA 4.0. Material educacional — sinta-se livre para usar em aulas, citando a fonte.

<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=0:10b981,50:1a56db,100:0f172a&height=120&section=footer" width="100%" alt="Footer"/>
</p>

---
**Resumo:** Simulador educacional interativo em React + SVG + KaTeX que demonstra bandas de energia em semicondutores, modelo de Kronig-Penney, massa efetiva, espaço-k, distribuições de Fermi-Dirac e Maxwell-Boltzmann, densidade de estados e estatística quântica de elétrons.
**Data de Criação:** 2026-04-26
**Autor:** Carlos Delfino Carvalho Pinheiro (com apoio de Claude Opus 4.7 / Rapport Generativa)
**Versão:** 1.4
**Última Atualização:** 2026-04-27
**Atualizado por:** Carlos Delfino
**Histórico de Alterações:**
- 2026-04-27 - Atualizado por Carlos Delfino - Favicone para o site....
- 2026-04-26 - Atualizado por Carlos Delfino - Primeira Versão...
- 2026-04-26 - Atualizado por Carlos Delfino - Atualização de arquivo...
- 2026-04-26 - Criado por Rapport Generativa - Versão 1.0 (estrutura inicial: bandas, Fermi-Dirac, MB, DOS, Arrhenius)
- 2026-04-26 - Atualizado por Rapport Generativa - Versão 1.1 (adicionados Kronig-Penney, espaço-k, massa efetiva, bandas permitidas/proibidas)
- 2026-04-26 - Atualizado por Rapport Generativa - Versão 1.2 (Átomos→Bandas, Poço Infinito 3D, Elétron×Lacuna, Metal×Isolante×Semicondutor, Roteiro de Estudo)
- 2026-04-26 - Atualizado por Carlos Delfino - Versão 1.3 (seção Sobre com bibliografia, dados de contato, espaço para colaboradores)
- 2026-04-26 - Atualizado por Carlos Delfino - Versão 1.4 (badges GitHub, gadget contrib.rocks de colaboradores, badges sociais clicáveis, tabela de conceitos completa com Metal×Isolante×Semicondutor, estrutura de pastas com 17 componentes, roteiro de uso com 14 passos)
