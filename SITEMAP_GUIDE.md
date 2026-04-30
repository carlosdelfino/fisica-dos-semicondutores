![visitors](https://visitor-badge.laobi.icu/badge?page_id=carlosdelfino.diagrama-de-bandas-semicondutores.sitemap)
[![License: CC BY-SA 4.0](https://img.shields.io/badge/License-CC_BY--SA_4.0-blue.svg)](https://creativecommons.org/licenses/by-sa/4.0/)
![Language: Portuguese](https://img.shields.io/badge/Language-Portuguese-brightgreen.svg)
![React](https://img.shields.io/badge/React-18-blue)
![Vite](https://img.shields.io/badge/Vite-5-purple)
![Status](https://img.shields.io/badge/Status-Produção-brightgreen)

<!-- Animated Header -->
<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=0:0f172a,50:1a56db,100:10b981&height=220&section=header&text=Sitemap%20Autoatualizável&fontSize=42&fontColor=ffffff&animation=fadeIn&fontAlignY=35&desc=Guia%20de%20Sitemap%20para%20Sistemas%20de%20Busca&descSize=18&descAlignY=55&descColor=94a3b8" width="100%" alt="Sitemap Header"/>
</p>

# Guia de Sitemap Autoatualizável

Este documento descreve como o sitemap.xml é gerado automaticamente para o projeto de Diagrama de Bandas de Semicondutores.

## Visão Geral

O projeto possui um sistema de sitemap autoatualizável que:
- Gera automaticamente o arquivo `sitemap.xml` durante o build
- Permite adicionar novas rotas/painéis facilmente
- É compatível com GitHub Pages (usa hash routing)
- Segue os padrões do protocolo Sitemap

## Como Funciona

### 1. Configuração de Rotas

As rotas são definidas em `routes.config.js`. Cada rota possui:
- `path`: caminho da rota (com `#` para hash routing)
- `changefreq`: frequência de atualização (daily, weekly, monthly, yearly)
- `priority`: prioridade da página (0.0 a 1.0)
- `lastmod`: data da última modificação (ISO 8601)

### 2. Geração Automática

O script `scripts/generate-sitemap.js`:
- Lê as rotas de `routes.config.js`
- Gera o arquivo XML no formato padrão
- Salva em `dist/sitemap.xml` após o build

### 3. Integração com Build

O `package.json` foi configurado para executar o script automaticamente:
```json
"build": "vite build && node scripts/generate-sitemap.js"
```

## Como Adicionar Novas Rotas

### Passo 1: Adicionar a Rota no App.jsx

Adicione a nova rota no componente `App.jsx` usando React Router:

```jsx
<Route path="/nova-rota" element={<NovoComponente />} />
```

### Passo 2: Adicionar ao Menu (opcional)

Se a rota deve aparecer no menu, adicione em `src/components/HierarchicalMenu.jsx`:

```javascript
{
  category: '📚 Categoria',
  items: [
    { id: 'nova-rota', label: '📝 Novo Painel' },
  ]
}
```

### Passo 3: Adicionar ao Sitemap

Adicione a rota em `routes.config.js`:

```javascript
{
  path: '#nova-rota',
  changefreq: 'monthly',
  priority: '0.8',
  lastmod: new Date().toISOString(),
}
```

### Passo 4: Gerar o Sitemap

Execute o build:

```bash
npm run build
```

O sitemap será gerado automaticamente em `dist/sitemap.xml`.

## Roteamento com Hash

Como o site está hospedado no GitHub Pages, usamos **Hash Routing**. Isso significa que:
- URLs usam `#` para identificar rotas: `site.github.io/#overview`
- Funciona sem configuração de servidor
- Compatível com SPA (Single Page Applications)

### Exemplos de URLs

- Home: `https://carlosdelfino.github.io/diagrama-de-bandas-semicondutores/`
- Visão Geral: `https://carlosdelfino.github.io/diagrama-de-bandas-semicondutores/#overview`
- Tabela Periódica: `https://carlosdelfino.github.io/diagrama-de-bandas-semicondutores/#periodic`
- Fórmulas: `https://carlosdelfino.github.io/diagrama-de-bandas-semicondutores/#formulas`

## Comandos Disponíveis

```bash
# Desenvolvimento
npm run dev

# Build com geração de sitemap
npm run build

# Apenas gerar sitemap (após build manual)
npm run generate-sitemap

# Preview do build
npm run preview
```

## Estrutura de Arquivos

```
.
├── routes.config.js          # Configuração das rotas
├── scripts/
│   └── generate-sitemap.js   # Script gerador de sitemap
├── src/
│   ├── App.jsx              # Rotas React Router
│   ├── main.jsx             # Configuração HashRouter
│   └── components/
│       └── HierarchicalMenu.jsx  # Menu de navegação
├── dist/
│   └── sitemap.xml          # Sitemap gerado (após build)
└── package.json             # Scripts de build
```

## Prioridades de Sitemap

- **1.0**: Home page (mais importante)
- **0.9**: Páginas principais (overview)
- **0.8**: Páginas de conteúdo (painéis educacionais)
- **0.7**: Páginas informativas (sobre)

## Frequência de Atualização

- **weekly**: Home e páginas principais
- **monthly**: Painéis educacionais (conteúdo estável)

## SEO e Sistemas de Busca

Para melhorar a indexação:

1. **Submeter o Sitemap**:
   - Google Search Console: `https://search.google.com/search-console`
   - Bing Webmaster Tools: `https://www.bing.com/webmasters`

2. **Robots.txt** (recomendado):
   ```txt
   User-agent: *
   Allow: /
   Sitemap: https://carlosdelfino.github.io/diagrama-de-bandas-semicondutores/sitemap.xml
   ```

3. **Meta Tags** (já implementadas no index.html)

## Troubleshooting

### Sitemap não é gerado

Verifique se:
- O diretório `dist/` existe
- O script tem permissões de execução
- `routes.config.js` está no formato correto

### Rotas não funcionam

Verifique se:
- A rota está definida em `App.jsx`
- A rota está em `routes.config.js`
- O hash está correto (começa com `#`)

### Build falha

Verifique se:
- Todas as dependências estão instaladas: `npm install`
- Não há erros de sintaxe nos arquivos
- O Node.js está na versão correta

## Manutenção

### Atualizar Frequência

Se um painel for atualizado frequentemente, aumente `changefreq`:
```javascript
changefreq: 'weekly'  // de 'monthly' para 'weekly'
```

### Atualizar Prioridade

Se uma página se tornar mais importante, ajuste `priority`:
```javascript
priority: '0.9'  // de '0.8' para '0.9'
```

### Atualizar Data

A data é gerada automaticamente, mas pode ser fixa:
```javascript
lastmod: '2026-04-30T12:00:00.000Z'
```

<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=0:10b981,50:1a56db,100:0f172a&height=120&section=footer" width="100%" alt="Footer"/>
</p>

---
**Resumo:** Guia completo para manutenção e uso do sistema de sitemap autoatualizável do projeto de Diagrama de Bandas de Semicondutores.
**Data de Criação:** 2026-04-30
**Autor:** Carlos Delfino
**Versão:** 1.0
**Última Atualização:** 2026-04-30
**Atualizado por:** Carlos Delfino
**Histórico de Alterações:**
- 2026-04-30 - Atualizado por Carlos Delfino - Adcionado um painel que demonstra as dimenções de ...
- 2026-04-30 - Criado por Carlos Delfino - Versão 1.0 - Implementação inicial do sistema de sitemap autoatualizável
