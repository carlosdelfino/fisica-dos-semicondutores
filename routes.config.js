/**
 * Configuração de rotas do site
 * Este arquivo define todas as rotas disponíveis no site para geração automática do sitemap
 * 
 * Para adicionar um novo painel/rota:
 * 1. Adicione a rota ao App.jsx
 * 2. Adicione a entrada neste arquivo
 * 3. Execute npm run build (o sitemap será gerado automaticamente)
 */

const SITE_URL = 'https://semicondutores.tec.br';

/**
 * Idiomas suportados pelo site.
 * - `code`: código usado internamente e na query string (?lang=xx)
 * - `hreflang`: valor para o atributo `hreflang` do sitemap/links alternativos
 * - `default`: marca o idioma padrão (também é referenciado como `x-default`)
 *
 * Ao adicionar um novo idioma:
 * 1. Crie o arquivo de tradução em `src/locales/<code>.js`
 * 2. Importe-o em `src/contexts/LanguageContext.jsx`
 * 3. Adicione a entrada aqui para que apareça no sitemap
 */
const LANGUAGES = [
  { code: 'pt', hreflang: 'pt-BR', default: true },
  { code: 'en', hreflang: 'en' },
  { code: 'ar', hreflang: 'ar' },
  { code: 'hi', hreflang: 'hi' },
  { code: 'zh', hreflang: 'zh' },
];

const routes = [
  {
    path: '/',
    changefreq: 'weekly',
    priority: '1.0',
    lastmod: new Date().toISOString(),
  },
  {
    path: '#overview',
    changefreq: 'weekly',
    priority: '0.9',
    lastmod: new Date().toISOString(),
  },
  {
    path: '#objectives',
    changefreq: 'monthly',
    priority: '0.8',
    lastmod: new Date().toISOString(),
  },
  {
    path: '#conceptsQ',
    changefreq: 'monthly',
    priority: '0.8',
    lastmod: new Date().toISOString(),
  },
  {
    path: '#questions',
    changefreq: 'monthly',
    priority: '0.8',
    lastmod: new Date().toISOString(),
  },
  {
    path: '#about',
    changefreq: 'monthly',
    priority: '0.7',
    lastmod: new Date().toISOString(),
  },
  {
    path: '#lattice',
    changefreq: 'monthly',
    priority: '0.8',
    lastmod: new Date().toISOString(),
  },
  {
    path: '#atomband',
    changefreq: 'monthly',
    priority: '0.8',
    lastmod: new Date().toISOString(),
  },
  {
    path: '#allowed',
    changefreq: 'monthly',
    priority: '0.8',
    lastmod: new Date().toISOString(),
  },
  {
    path: '#kp',
    changefreq: 'monthly',
    priority: '0.8',
    lastmod: new Date().toISOString(),
  },
  {
    path: '#mis',
    changefreq: 'monthly',
    priority: '0.8',
    lastmod: new Date().toISOString(),
  },
  {
    path: '#kspace',
    changefreq: 'monthly',
    priority: '0.8',
    lastmod: new Date().toISOString(),
  },
  {
    path: '#effmass',
    changefreq: 'monthly',
    priority: '0.8',
    lastmod: new Date().toISOString(),
  },
  {
    path: '#particles',
    changefreq: 'monthly',
    priority: '0.8',
    lastmod: new Date().toISOString(),
  },
  {
    path: '#fermi',
    changefreq: 'monthly',
    priority: '0.8',
    lastmod: new Date().toISOString(),
  },
  {
    path: '#dos',
    changefreq: 'monthly',
    priority: '0.8',
    lastmod: new Date().toISOString(),
  },
  {
    path: '#arrhenius',
    changefreq: 'monthly',
    priority: '0.8',
    lastmod: new Date().toISOString(),
  },
  {
    path: '#junction',
    changefreq: 'monthly',
    priority: '0.8',
    lastmod: new Date().toISOString(),
  },
  {
    path: '#transistorTech',
    changefreq: 'monthly',
    priority: '0.8',
    lastmod: new Date().toISOString(),
  },
  {
    path: '#fetTypes',
    changefreq: 'monthly',
    priority: '0.8',
    lastmod: new Date().toISOString(),
  },
  {
    path: '#periodic',
    changefreq: 'monthly',
    priority: '0.8',
    lastmod: new Date().toISOString(),
  },
  {
    path: '#exercises',
    changefreq: 'monthly',
    priority: '0.8',
    lastmod: new Date().toISOString(),
  },
  {
    path: '#formulas',
    changefreq: 'monthly',
    priority: '0.8',
    lastmod: new Date().toISOString(),
  },
  {
    path: '/support-us',
    changefreq: 'monthly',
    priority: '0.7',
    lastmod: new Date().toISOString(),
  },
];

export { routes, SITE_URL, LANGUAGES };
