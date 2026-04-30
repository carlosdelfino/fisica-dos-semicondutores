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
import { routes, SITE_URL } from '../routes.config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const distDir = path.join(__dirname, '..', 'dist');
const sitemapPath = path.join(distDir, 'sitemap.xml');

function generateSitemap() {
  console.log('🚀 Gerando sitemap.xml...');
  
  // Cria o diretório dist se não existir
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
    console.log('✅ Diretório dist/ criado');
  }

  // Gera o conteúdo do sitemap
  const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes.map(route => {
  const url = `${SITE_URL}${route.path}`;
  return `  <url>
    <loc>${url}</loc>
    <lastmod>${route.lastmod}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`;
}).join('\n')}
</urlset>`;

  // Escreve o arquivo sitemap.xml
  fs.writeFileSync(sitemapPath, xmlContent, 'utf8');
  console.log(`✅ Sitemap gerado em: ${sitemapPath}`);
  console.log(`📊 Total de URLs: ${routes.length}`);
  console.log(`🌐 Site URL: ${SITE_URL}`);
}

// Executa a geração do sitemap
generateSitemap();
