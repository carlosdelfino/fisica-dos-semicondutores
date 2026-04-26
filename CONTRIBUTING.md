![visitors](https://visitor-badge.laobi.icu/badge?page_id=carlosdelfino.fisica-dos-semicondutores)
[![License: CC BY-SA 4.0](https://img.shields.io/badge/License-CC_BY--SA_4.0-blue.svg)](https://creativecommons.org/licenses/by-sa/4.0/)
![Language: Portuguese](https://img.shields.io/badge/Language-Portuguese-brightgreen.svg)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/carlosdelfino/fisica-dos-semicondutores/pulls)
[![Windsurf](https://img.shields.io/badge/Editor-Windsurf-1e40af?logo=visualstudiocode&logoColor=white)](https://windsurf.com)
![Status](https://img.shields.io/badge/Status-Aceitando%20PRs-brightgreen)

<!-- Animated Header -->
<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=0:0f172a,50:1a56db,100:10b981&height=180&section=header&text=Como%20Contribuir&fontSize=36&fontColor=ffffff&animation=fadeIn&fontAlignY=40&desc=Cr%C3%ADticas%20e%20sugest%C3%B5es%20s%C3%A3o%20sempre%20bem-vindas&descSize=16&descAlignY=70&descColor=94a3b8" width="100%" alt="Header"/>
</p>

# Guia de Contribuição

> **🎯 Mensagem direta:** a *melhor forma* de criticar, sugerir, corrigir ou
> aprimorar este projeto é abrindo um **Pull Request**. Sua contribuição é
> **sempre bem-vinda**, seja uma vírgula numa explicação ou um novo capítulo
> inteiro de visualizações.

## Por que via Pull Request?

- **Concretiza a sugestão** — em vez de apenas apontar o que poderia ser
  melhor, você já entrega uma proposta avaliável.
- **Preserva o histórico** — fica registrado quem propôs, o que mudou e por
  quê, para benefício de todos os estudantes futuros.
- **Permite discussão técnica** — comentários linha-a-linha, sugestões de
  ajuste, validação física rigorosa.
- **Coloca seu nome no Hall dos Colaboradores** — sua contribuição entra no
  README e no painel `contrib.rocks` automaticamente.

> Mesmo que sua PR não seja aceita exatamente como está, ela **abre uma
> discussão valiosa** e quase sempre evolui para algo aceito após revisão.

## 🌊 Use o Windsurf — o projeto já está pronto para isso

Recomendo fortemente usar o [**Windsurf**](https://windsurf.com) como editor
para contribuir. Por quê?

- O projeto já contém **regras de codificação** em `.windsurf/rules/` que o
  Windsurf aplica automaticamente. Isso garante que você siga o **mesmo padrão**
  de código, documentação e logging adotado no projeto.
- Há **workflows pré-configurados** em `.windsurf/workflows/` (`/pdcl`,
  `/preparo-projeto`, etc.) que automatizam tarefas comuns.
- O agente **Cascade** do Windsurf entende a metodologia **PDCL** (Plan, Do,
  Check, Loop) usada aqui e orienta naturalmente novas implementações dentro
  desse fluxo.
- Você economiza tempo verificando manualmente regras de estilo, formatação
  de logs, atualização de `REQUIREMENTS.md`, etc.

Se preferir outro editor (VS Code, Cursor, Zed, etc.), tudo funciona — mas
você precisará observar manualmente as regras descritas neste guia e em
`.windsurf/rules/`.

## ⚙️ Script de pré-commit — mantenha a documentação padronizada

Este repositório inclui um **script automático de manutenção da documentação**
em `scripts/markdown_history_manager.py`, ativado via git hook em
`.git/hooks/pre-commit`.

### O que ele faz

- A cada `git commit` que envolva arquivos `.md`:
  - Detecta o **autor** do commit (via `git config user.name`).
  - Captura a **data** do commit (formato `AAAA-MM-DD`).
  - **Atualiza automaticamente** a seção *Histórico de Alterações* do `.md`
    inserindo uma nova entrada, mantendo o padrão definido em
    `.windsurf/rules/documentacao.md`.

### Como ativar localmente

```bash
# 1. Garanta que o hook está executável
chmod +x .git/hooks/pre-commit

# 2. Verifique que Python 3 está disponível
python3 --version
```

> Em clones recém-feitos, se o hook não estiver presente, copie-o de algum
> repositório existente ou peça ao mantenedor. Trabalhamos para incluir
> instalação automática via `husky` ou similar em uma futura versão.

### Quando ele dispara

```bash
# qualquer um destes comandos vai disparar o hook
git add README.md && git commit -m "docs: atualiza README"
git commit -am "feat: nova visualização"  # se modificou algum .md
```

Você verá no terminal:

```text
🚀 Iniciando atualização de histórico de arquivos markdown...
📝 1 arquivo(s) .md encontrado(s) para atualização
✅ Histórico atualizado: README.md
🏁 Concluído: 1/1 arquivos atualizados
```

## 📋 Tipos de contribuição que celebro

| Tipo | Exemplos |
|------|----------|
| 🐛 **Correção de bug** | UI quebrada, fórmula errada, link morto |
| ✨ **Nova visualização** | Junção pn, MOSFET, célula solar, fototransistor |
| 📐 **Rigor físico** | Unidades, valores de constantes, equações |
| 📚 **Conteúdo didático** | Explicações mais claras, analogias, exemplos |
| 🌐 **Tradução** | EN, ES, FR, IT, … |
| 🎨 **UX / acessibilidade** | Contraste, navegação por teclado, screen-readers |
| 🧪 **Exercícios** | Cartões interativos com problemas resolvidos |
| 🔍 **Reviews críticos** | Apontar imprecisões com referência bibliográfica |

## 🚀 Fluxo de contribuição

### Passo a passo

1. **Fork** do repositório no GitHub.
2. **Clone** o seu fork:
   ```bash
   git clone git@github.com:seu-usuario/fisica-dos-semicondutores.git
   cd fisica-dos-semicondutores
   ```
3. **Branch descritiva** (`tipo/descricao-curta`):
   ```bash
   git checkout -b feat/visualizacao-junction-pn
   git checkout -b fix/unidade-effmass
   git checkout -b docs/bibliografia-pierret
   ```
4. **Instale as dependências**:
   ```bash
   npm install
   ```
5. **Implemente** seguindo a metodologia **PDCL**:
   - **Plan** — atualize `REQUIREMENTS.md` se for novo requisito.
   - **Do** — implemente com logs estruturados (`log_event()` em
     `src/physics/formulas.js`).
   - **Check** — execute `npm run dev` e valide; rode `npm run build` para
     garantir que produção compila sem erros.
   - **Loop** — itere até resposta correta visual e física.
6. **Commit** com mensagem clara (de preferência em
   [Conventional Commits](https://www.conventionalcommits.org)):
   ```bash
   git commit -m "feat(kspace): adiciona caminhos GaAs no diagrama E-k"
   git commit -m "fix(dos): corrige unidades de g(E) para cm^-3 eV^-1"
   git commit -m "docs(readme): adiciona seção de contribuição"
   ```
   > O hook **pre-commit** atualizará automaticamente o histórico dos `.md`
   > modificados.
7. **Push** para o seu fork:
   ```bash
   git push origin feat/visualizacao-junction-pn
   ```
8. **Abra o Pull Request** no GitHub. O template
   `.github/PULL_REQUEST_TEMPLATE.md` será carregado automaticamente —
   preencha as seções relevantes.

### Tempo de revisão

- Resposta inicial em **até 7 dias** (geralmente bem mais rápido).
- Discussão em comentários até consenso.
- Merge feito pelo mantenedor (rebase ou squash conforme o caso).

## 🧪 Boas práticas

### Código

- **JSX/JS modernos** (ES2020+). Sem TypeScript por enquanto, mas é bem-vindo.
- **SVG puro** para diagramas (sem libs de chart).
- **KaTeX** para fórmulas — não introduzir MathJax sem discussão prévia.
- **Tema dark** consistente com `--accent` (`#22d3ee`) como cor primária.
- **Componentes pequenos e focados** — preferir composição a herança.
- **Funções puras** em `src/physics/` — testáveis e previsíveis.

### Logs

Use `log_event()` (importado de `src/physics/formulas.js`) para qualquer
evento relevante, com os emojis padronizados em `.windsurf/rules/pdcl.md`:

```js
import { log_event } from '../physics/formulas.js';

log_event('START', 'Carregando rede cristalina', { material: 'Si', N: 49 });
log_event('DATA',  'n_i calculado', { T, ni: ni.toExponential(2) });
log_event('SUCCESS', 'Renderizado em SVG');
```

### Documentação

- Todos os `.md` seguem o padrão definido em `.windsurf/rules/documentacao.md`:
  badges no topo, header animado, resumo final com histórico.
- O **hook pre-commit** mantém o histórico sincronizado.

## 🐛 Reportar bug ou sugerir melhoria sem código

Se não puder enviar PR, ainda assim valorizamos sua contribuição:

- **Issue** descrevendo o problema com passos para reproduzir e capturas.
- **WhatsApp da comunidade**: [Entrar no grupo](https://chat.whatsapp.com/C3vtPfTwaSlIPmcl8aHS1X)
- **E-mail**: [consultoria@carlosdelfino.eti.br](mailto:consultoria@carlosdelfino.eti.br)

## 📜 Código de conduta

- Respeito ao colaborador é inegociável.
- Críticas devem ser **técnicas**, **construtivas** e **acompanhadas de
  evidência** (referência bibliográfica, equação, captura).
- Discussões devem manter o foco no **conteúdo** e no **objetivo educacional**,
  não em qualidades pessoais.

## 🙏 Reconhecimento

Todo contribuidor terá:

- Avatar exibido no painel `contrib.rocks` no README (atualizado automaticamente).
- Nome listado no **Hall dos Colaboradores** com sua contribuição específica.
- Crédito explícito quando sua sugestão for incorporada em capítulos didáticos.

## 🔗 Links úteis

- 📖 [`README.md`](./README.md) — visão geral do projeto
- 📋 [`REQUIREMENTS.md`](./REQUIREMENTS.md) — requisitos físicos e funcionais
- 🤖 [`.windsurf/rules/`](./.windsurf/rules/) — regras de codificação
- 🔄 [`.windsurf/workflows/`](./.windsurf/workflows/) — workflows automatizados
- 🏗️ [`.github/PULL_REQUEST_TEMPLATE.md`](./.github/PULL_REQUEST_TEMPLATE.md) — template de PR

<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=0:10b981,50:1a56db,100:0f172a&height=120&section=footer" width="100%" alt="Footer"/>
</p>

---

**Resumo:** Guia de contribuição — encoraja PRs como meio principal de crítica e sugestão, recomenda Windsurf, explica o hook pre-commit `markdown_history_manager.py`, descreve metodologia PDCL e fluxo de revisão.
**Data de Criação:** 2026-04-26
**Autor:** Carlos Delfino Carvalho Pinheiro
**Versão:** 1.0
**Última Atualização:** 2026-04-26
**Atualizado por:** Carlos Delfino
**Histórico de Alterações:**
- 2026-04-26 - Atualizado por Carlos Delfino - Primeira Versão...
- 2026-04-26 - Criado por Carlos Delfino - Versão 1.0 (guia inicial: PRs, Windsurf, pre-commit, PDCL)
