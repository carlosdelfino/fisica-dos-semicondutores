#!/usr/bin/env node

/**
 * Script gerador de sitemap.xml autoatualizável
 * 
 * Este script gera automaticamente o sitemap.xml baseado nas rotas configuradas
 * em routes.config.js. Deve ser executado após o build do projeto.
 * 
 * Uso: node scripts/generate-sitemap.js
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { routes, SITE_URL, LANGUAGES } from '../routes.config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const distDir = path.join(__dirname, '..', 'dist');
const sitemapPath = path.join(distDir, 'sitemap.xml');

const DEFAULT_LANG = LANGUAGES.find(l => l.default) || LANGUAGES[0];

/**
 * Monta a URL pública para uma rota em um determinado idioma.
 * - O idioma padrão não recebe `?lang=` (URL canônica limpa).
 * - Rotas hash (`#xxx`) recebem o `?lang=` antes do `#` para compatibilidade
 *   com HashRouter/SPA.
 */
function buildURL(routePath, langCode) {
  const isDefault = langCode === DEFAULT_LANG.code;
  const query = isDefault ? '' : `?lang=${langCode}`;

  if (routePath.startsWith('#')) {
    return `${SITE_URL}/${query}${routePath}`;
  }
  // Rotas começando com "/" (ou vazia)
  const base = routePath === '/' ? '/' : routePath;
  return `${SITE_URL}${base}${query}`;
}

function escapeXml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function generateSitemap() {
  console.log('🚀 Gerando sitemap.xml...');

  // Cria o diretório dist se não existir
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
    console.log('✅ Diretório dist/ criado');
  }

  // Para cada rota, cria uma entrada <url> por idioma, com <xhtml:link hreflang>
  // apontando para as demais traduções (inclui x-default para o idioma padrão).
  const urlEntries = [];
  for (const route of routes) {
    const alternates = LANGUAGES.map(l => ({
      hreflang: l.hreflang,
      href: buildURL(route.path, l.code),
      isDefault: !!l.default,
    }));

    for (const lang of LANGUAGES) {
      const loc = buildURL(route.path, lang.code);
      const links = alternates.map(a =>
        `    <xhtml:link rel="alternate" hreflang="${escapeXml(a.hreflang)}" href="${escapeXml(a.href)}"/>`
      );
      // x-default aponta para a URL canônica (idioma padrão)
      const xDefault = alternates.find(a => a.isDefault);
      if (xDefault) {
        links.push(
          `    <xhtml:link rel="alternate" hreflang="x-default" href="${escapeXml(xDefault.href)}"/>`
        );
      }

      urlEntries.push(`  <url>
    <loc>${escapeXml(loc)}</loc>
    <lastmod>${route.lastmod}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
${links.join('\n')}
  </url>`);
    }
  }

  const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urlEntries.join('\n')}
</urlset>`;

  fs.writeFileSync(sitemapPath, xmlContent, 'utf8');
  console.log(`✅ Sitemap gerado em: ${sitemapPath}`);
  console.log(`📊 Total de URLs: ${urlEntries.length} (${routes.length} rotas × ${LANGUAGES.length} idiomas)`);
  console.log(`🌐 Site URL: ${SITE_URL}`);
  console.log(`🗣️  Idiomas: ${LANGUAGES.map(l => l.hreflang).join(', ')}`);
}

// Executa a geração do sitemap
generateSitemap();
