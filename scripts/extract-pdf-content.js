#!/usr/bin/env node

import dotenv from 'dotenv';
import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';
import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Configuração de logging seguindo as regras do projeto
const LOG_DIR = path.join(process.cwd(), 'logs');
const LOG_FILE = path.join(LOG_DIR, `pdf-extraction-${new Date().toISOString().split('T')[0]}.log`);

// Criar diretório de logs se não existir
if (!fs.existsSync(LOG_DIR)) {
  fs.mkdirSync(LOG_DIR, { recursive: true });
}

function log(level, emoji, message, params = {}) {
  const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
  const caller = new Error().stack.split('\n')[2].trim();
  const paramsStr = Object.keys(params).length > 0 ? ` - ${JSON.stringify(params)}` : '';
  const logLine = `[${timestamp}] [${caller}] ${emoji} ${message}${paramsStr}\n`;
  
  fs.appendFileSync(LOG_FILE, logLine);
  console.log(logLine.trim());
}

// Carregar variáveis de ambiente
dotenv.config();

// Configuração de API (será definida após parsing dos argumentos)
let API_PROVIDER = 'openai'; // padrão
let apiClient = null;
let API_MODEL = '';

// Função para inicializar o cliente API baseado no provider
function initializeApiClient(provider) {
  log('INFO', '🚀', 'Inicializando cliente API', { provider });
  
  switch (provider) {
    case 'openai': {
      const apiKey = process.env.OPENAI_API_KEY;
      if (!apiKey) {
        log('ERROR', '❌', 'OPENAI_API_KEY não encontrada no arquivo .env');
        process.exit(1);
      }
      API_MODEL = process.env.OPENAI_MODEL && process.env.OPENAI_MODEL !== 'GPT-5.4-mini' 
        ? process.env.OPENAI_MODEL 
        : 'gpt-4o-mini';
      return new OpenAI({ apiKey });
    }
    
    case 'anthropic': {
      const apiKey = process.env.ANTHROPIC_API_KEY;
      if (!apiKey) {
        log('ERROR', '❌', 'ANTHROPIC_API_KEY não encontrada no arquivo .env');
        process.exit(1);
      }
      API_MODEL = process.env.ANTHROPIC_MODEL || 'claude-3-5-sonnet-20241022';
      return new Anthropic({ apiKey });
    }
    
    case 'openroute': {
      const apiKey = process.env.OPENROUTER_API_KEY;
      if (!apiKey) {
        log('ERROR', '❌', 'OPENROUTER_API_KEY não encontrada no arquivo .env');
        process.exit(1);
      }
      API_MODEL = process.env.OPENROUTER_MODEL || 'anthropic/claude-3.5-sonnet';
      return new OpenAI({
        apiKey,
        baseURL: 'https://openrouter.ai/api/v1'
      });
    }
    
    case 'ollama': {
      API_MODEL = process.env.OLLAMA_MODEL || 'llama3.1';
      const baseURL = process.env.OLLAMA_BASE_URL || 'http://localhost:11434/v1';
      return new OpenAI({
        baseURL,
        apiKey: 'ollama' // Ollama não requer API key real
      });
    }
    
    default:
      log('ERROR', '❌', 'Provider de API inválido', { provider });
      log('INFO', 'ℹ️', 'Providers disponíveis: openai, anthropic, openroute, ollama');
      process.exit(1);
  }
}

// Diretório de saída
const BASE_OUTPUT_DIR = path.join(process.cwd(), 'public', 'formulas');
const BASE_TEMP_DIR = path.join(process.cwd(), 'docs', 'extracao');

// Criar diretório de saída base se não existir
if (!fs.existsSync(BASE_OUTPUT_DIR)) {
  fs.mkdirSync(BASE_OUTPUT_DIR, { recursive: true });
}

// Criar diretório temporário base se não existir
if (!fs.existsSync(BASE_TEMP_DIR)) {
  fs.mkdirSync(BASE_TEMP_DIR, { recursive: true });
}

// Função para obter o diretório de imagens baseado no nome do livro
function getImageDir(pdfPath) {
  const bookName = path.basename(pdfPath, path.extname(pdfPath));
  const imageDir = path.join(BASE_TEMP_DIR, bookName);
  
  // Criar diretório se não existir
  if (!fs.existsSync(imageDir)) {
    fs.mkdirSync(imageDir, { recursive: true });
    log('INFO', '✅', 'Diretório de imagens criado', { imageDir });
  }
  
  return imageDir;
}

// Função para obter o diretório de saída baseado no nome do livro
function getOutputDir(pdfPath) {
  const bookName = path.basename(pdfPath, path.extname(pdfPath));
  const outputDir = path.join(BASE_OUTPUT_DIR, bookName);
  
  // Criar diretório se não existir
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
    log('INFO', '✅', 'Diretório de saída criado', { outputDir });
  }
  
  return outputDir;
}

// Função para verificar quais números de página estão faltando
function getMissingPageNumbers(prefix, imageDir, totalPages) {
  const files = fs.readdirSync(imageDir);
  const existingNumbers = files
    .filter(f => f.startsWith(prefix) && f.endsWith('.png'))
    .map(f => parseInt(f.match(/\d+/)[0]));
  
  const existingSet = new Set(existingNumbers);
  const missingNumbers = [];
  
  for (let i = 1; i <= totalPages; i++) {
    if (!existingSet.has(i)) {
      missingNumbers.push(i);
    }
  }
  
  return missingNumbers;
}

// Função para enriquecer uma fórmula com a API configurada
async function enrichFormula(formula, context = '') {
  log('INFO', '🔍', 'Enriquecendo fórmula', { formula, provider: API_PROVIDER });
  
  try {
    let response;
    
    if (API_PROVIDER === 'anthropic') {
      response = await apiClient.messages.create({
        model: API_MODEL,
        max_tokens: 2000,
        system: `Você é um especialista em física dos semicondutores, mecânica quântica e física quântica. Sua tarefa é enriquecer fórmulas com informações didáticas e taxonomia.

Para cada fórmula fornecida, retorne um JSON com o seguinte formato:
{
  "originalFormula": "fórmula original fornecida",
  "genericFormula": "fórmula genérica (sem valores numéricos específicos, usando variáveis)",
  "description": "descrição didática detalhada do que a fórmula representa e quando é usada",
  "concepts": ["lista de conceitos físicos envolvidos"],
  "symbols": [
    {
      "symbol": "símbolo LaTeX",
      "description": "descrição do que o símbolo representa"
    }
  ],
  "taxonomy": {
    "category": "uma de: quantum-physics, quantum-mechanics, semiconductor-physics",
    "subcategory": "subcategoria específica (ex: energy-levels, band-structure, carrier-transport)",
    "domain": "domínio principal (ex: atomic-physics, solid-state, device-physics)"
  },
  "keywords": ["palavras-chave para busca e linkagem (ex: energy, momentum, bandgap, carrier)"],
  "graphVisualization": {
    "hasGraph": true/false,
    "graphType": "tipo de gráfico se aplicável (ex: energy-band, dispersion, density-of-states)",
    "graphParameters": ["parâmetros para o gráfico (ex: energy, momentum, temperature)"]
  },
  "relatedFormulas": ["IDs ou nomes de fórmulas relacionadas (ex: Schrodinger, Fermi-Dirac)"]
}

CATEGORIAS DE TAXONOMIA:
- quantum-physics: Fórmulas fundamentais de física quântica (Schrödinger, Heisenberg, Pauli)
- quantum-mechanics: Aplicações específicas da mecânica quântica (função de onda, operadores, estados)
- semiconductor-physics: Fórmulas específicas de semicondutores (bandas, portadores, junções)

PALAVRAS-CHAVE ÚTEIS PARA LINKAGEM:
- Para energia: energy, level, gap, band, state, transition
- Para momento: momentum, wave-vector, k, effective-mass
- Para transporte: carrier, mobility, diffusion, conductivity, current
- Para estrutura de bandas: band, conduction, valence, gap, effective-mass
- Para estatística: distribution, Fermi-Dirac, Bose-Einstein, concentration
- Para dispositivos: junction, diode, transistor, depletion, barrier

IMPORTANTE:
- A fórmula genérica deve estar em formato LaTeX/KaTeX compatível
- Use \\text{} para texto dentro de fórmulas se necessário
- Escape corretamente barras invertidas: use \\text{}, \\frac{}, \\sqrt{}, etc.
- A descrição deve ser didática e explicar o contexto físico
- Os conceitos devem ser termos técnicos relevantes
- Os símbolos devem incluir todas as variáveis e constantes usadas
- A taxonomia deve ajudar a categorizar a fórmula para busca
- As palavras-chave devem facilitar linkagem entre fórmulas e gráficos
- graphVisualization indica se a fórmula tem representação gráfica
- NÃO inclua explicações fora do JSON
- Retorne APENAS JSON válido, sem markdown code blocks`,
        messages: [{
          role: 'user',
          content: `Enriqueça esta fórmula: ${formula}\n\nContexto: ${context}`
        }]
      });
    } else {
      // openai, openroute, ollama (usam formato OpenAI)
      response = await apiClient.chat.completions.create({
        model: API_MODEL,
        messages: [
        {
          role: 'system',
          content: `Você é um especialista em física dos semicondutores, mecânica quântica e física quântica. Sua tarefa é enriquecer fórmulas com informações didáticas e taxonomia.

Para cada fórmula fornecida, retorne um JSON com o seguinte formato:
{
  "originalFormula": "fórmula original fornecida",
  "genericFormula": "fórmula genérica (sem valores numéricos específicos, usando variáveis)",
  "description": "descrição didática detalhada do que a fórmula representa e quando é usada",
  "concepts": ["lista de conceitos físicos envolvidos"],
  "symbols": [
    {
      "symbol": "símbolo LaTeX",
      "description": "descrição do que o símbolo representa"
    }
  ],
  "taxonomy": {
    "category": "uma de: quantum-physics, quantum-mechanics, semiconductor-physics",
    "subcategory": "subcategoria específica (ex: energy-levels, band-structure, carrier-transport)",
    "domain": "domínio principal (ex: atomic-physics, solid-state, device-physics)"
  },
  "keywords": ["palavras-chave para busca e linkagem (ex: energy, momentum, bandgap, carrier)"],
  "graphVisualization": {
    "hasGraph": true/false,
    "graphType": "tipo de gráfico se aplicável (ex: energy-band, dispersion, density-of-states)",
    "graphParameters": ["parâmetros para o gráfico (ex: energy, momentum, temperature)"]
  },
  "relatedFormulas": ["IDs ou nomes de fórmulas relacionadas (ex: Schrodinger, Fermi-Dirac)"]
}

CATEGORIAS DE TAXONOMIA:
- quantum-physics: Fórmulas fundamentais de física quântica (Schrödinger, Heisenberg, Pauli)
- quantum-mechanics: Aplicações específicas da mecânica quântica (função de onda, operadores, estados)
- semiconductor-physics: Fórmulas específicas de semicondutores (bandas, portadores, junções)

PALAVRAS-CHAVE ÚTEIS PARA LINKAGEM:
- Para energia: energy, level, gap, band, state, transition
- Para momento: momentum, wave-vector, k, effective-mass
- Para transporte: carrier, mobility, diffusion, conductivity, current
- Para estrutura de bandas: band, conduction, valence, gap, effective-mass
- Para estatística: distribution, Fermi-Dirac, Bose-Einstein, concentration
- Para dispositivos: junction, diode, transistor, depletion, barrier

IMPORTANTE:
- A fórmula genérica deve estar em formato LaTeX/KaTeX compatível
- Use \\text{} para texto dentro de fórmulas se necessário
- Escape corretamente barras invertidas: use \\text{}, \\frac{}, \\sqrt{}, etc.
- A descrição deve ser didática e explicar o contexto físico
- Os conceitos devem ser termos técnicos relevantes
- Os símbolos devem incluir todas as variáveis e constantes usadas
- A taxonomia deve ajudar a categorizar a fórmula para busca
- As palavras-chave devem facilitar linkagem entre fórmulas e gráficos
- graphVisualization indica se a fórmula tem representação gráfica
- NÃO inclua explicações fora do JSON
- Retorne APENAS JSON válido, sem markdown code blocks`,
        },
        {
          role: 'user',
          content: `Enriqueça esta fórmula: ${formula}\n\nContexto: ${context}`
        }
      ],
      max_tokens: 2000,
      temperature: 0.3
    });
    }
    
    let content;
    if (API_PROVIDER === 'anthropic') {
      content = response.content[0].text;
    } else {
      content = response.choices[0].message.content;
    }
    log('INFO', '✅', 'Enriquecimento concluído', { tokensUsed: response.usage?.total_tokens });
    
    // Tentar extrair JSON da resposta
    let jsonData;
    try {
      const cleanContent = content.replace(/```json\n?|\n?```/g, '').trim();
      jsonData = JSON.parse(cleanContent);
    } catch (parseError) {
      log('WARN', '', 'Não foi possível fazer parse do JSON', { error: parseError.message });
      jsonData = {
        originalFormula: formula,
        genericFormula: formula,
        description: 'Não foi possível gerar descrição automática',
        concepts: [],
        symbols: [],
        rawText: content
      };
    }
    
    return jsonData;
  } catch (error) {
    log('ERROR', '', 'Erro ao enriquecer fórmula', { error: error.message });
    // Retornar estrutura básica em caso de erro
    return {
      originalFormula: formula,
      genericFormula: formula,
      description: 'Erro ao enriquecer fórmula',
      concepts: [],
      symbols: []
    };
  }
}

// Função para converter PDF em imagens usando pdftoppm
async function pdfToImages(pdfPath, totalPages = null) {
  const prefix = 'temp-page';
  const imageDir = getImageDir(pdfPath);
  
  // Obter número total de páginas do PDF se não fornecido
  if (!totalPages) {
    totalPages = await getTotalPdfPages(pdfPath);
  }
  
  // Verificar quais páginas estão faltando
  const missingPages = getMissingPageNumbers(prefix, imageDir, totalPages);
  
  if (missingPages.length === 0) {
    log('INFO', '', 'Todas as imagens já existem', { count: totalPages });
    // Retornar todas as imagens em ordem
    const allImages = [];
    for (let i = 1; i <= totalPages; i++) {
      allImages.push(path.join(imageDir, `${prefix}-${String(i).padStart(3, '0')}.png`));
    }
    return allImages;
  }
  
  log('INFO', '', 'Extraindo páginas faltantes', { missingPages, count: missingPages.length });
  
  // Extrair apenas as páginas faltantes
  await extractMissingPages(pdfPath, imageDir, prefix, missingPages);
  
  // Retornar todas as imagens em ordem
  const allImages = [];
  for (let i = 1; i <= totalPages; i++) {
    allImages.push(path.join(imageDir, `${prefix}-${String(i).padStart(3, '0')}.png`));
  }
  
  log('INFO', '', 'Extração de imagens concluída', { totalPages: allImages.length });
  return allImages;
}

// Função para obter o número total de páginas do PDF
async function getTotalPdfPages(pdfPath) {
  return new Promise((resolve, reject) => {
    const pdfinfo = spawn('pdfinfo', [pdfPath]);
    
    let output = '';
    
    pdfinfo.stdout.on('data', (data) => {
      output += data.toString();
    });
    
    pdfinfo.stderr.on('data', (data) => {
      log('WARN', '', 'pdfinfo stderr', { error: data.toString() });
    });
    
    pdfinfo.on('close', (code) => {
      if (code !== 0) {
        log('WARN', '', 'pdfinfo falhou, assumindo valor padrão', { code });
        resolve(267); // Valor padrão baseado no log anterior
        return;
      }
      
      const match = output.match(/Pages:\s*(\d+)/);
      const totalPages = match ? parseInt(match[1]) : 267;
      resolve(totalPages);
    });
    
    pdfinfo.on('error', (error) => {
      log('WARN', '', 'Erro ao executar pdfinfo, assumindo valor padrão', { error: error.message });
      resolve(267);
    });
  });
}

// Função para extrair páginas específicas do PDF
async function extractMissingPages(pdfPath, imageDir, prefix, pageNumbers) {
  return new Promise((resolve, reject) => {
    const pdftoppm = spawn('pdftoppm', [
      '-png',
      '-r', '200',
      '-f', pageNumbers[0].toString(),
      '-l', pageNumbers[pageNumbers.length - 1].toString(),
      pdfPath,
      path.join(imageDir, prefix)
    ]);
    
    pdftoppm.stdout.on('data', (data) => {
      log('INFO', '', 'pdftoppm output', { output: data.toString() });
    });
    
    pdftoppm.stderr.on('data', (data) => {
      log('WARN', '', 'pdftoppm stderr', { error: data.toString() });
    });
    
    pdftoppm.on('close', (code) => {
      if (code !== 0) {
        log('ERROR', '', 'pdftoppm falhou', { code });
        reject(new Error(`pdftoppm exited with code ${code}`));
        return;
      }
      
      log('INFO', '', 'Páginas extraídas com sucesso', { pages: pageNumbers });
      resolve();
    });
    
    pdftoppm.on('error', (error) => {
      log('ERROR', '', 'Erro ao executar pdftoppm', { error: error.message });
      reject(error);
    });
  });
}

// Função para analisar imagem com a API configurada
async function analyzeImage(imagePath, pageNumber) {
  log('INFO', '', 'Analisando página com Vision API', { pageNumber, imagePath, provider: API_PROVIDER });
  
  try {
    const imageData = fs.readFileSync(imagePath);
    const base64Image = imageData.toString('base64');
    
    let response;
    
    if (API_PROVIDER === 'anthropic') {
      response = await apiClient.messages.create({
        model: API_MODEL,
        max_tokens: 4000,
        system: `Você é um assistente especializado em extrair conteúdo educacional de livros de física de semicondutores.

Sua tarefa é analisar cada página e extrair:
1. Perguntas (exercícios, problemas, questões de revisão)
2. Respostas ou soluções
3. Fórmulas matemáticas e físicas

IMPORTANTE: Todas as fórmulas devem estar em formato KaTeX/LaTeX compatível. Use a seguinte sintaxe:
- Frações: \\frac{numerador}{denominador}
- Derivadas parciais: \\frac{\\partial}{\\partial x}
- Sobrescritos: x^{n} ou e^{-E/kT}
- Subscritos: E_{c}, n_{i}, \\epsilon_{0}
- Letras gregas: \\pi, \\epsilon, \\sigma, \\mu, \\lambda
- Integrais: \\int_{a}^{b} f(x) dx
- Somatórios: \\sum_{i=1}^{n}
- Raízes: \\sqrt{x}
- Parênteses: \\left( \\right) para parênteses dimensionados
- Matrizes: \\begin{matrix} ... \\end{matrix}
- Constantes: use \\hbar para h-barra, \\infty para infinito

Exemplos de formato correto:
- E = \\frac{h^2 n^2}{8 m L^2}
- \\frac{1}{r^2} \\frac{\\partial}{\\partial r} \\left( r^2 \\frac{\\partial \\psi}{\\partial r} \\right) + \\frac{2m}{\\hbar^2} (E - V(r))\\psi = 0
- V(r) = -\\frac{e^2}{4\\pi\\epsilon_0 r}
- n_i = \\sqrt{N_c N_v} e^{-E_g / 2kT}

Organize o conteúdo por capítulos quando possível. Se a página contiver múltiplos capítulos ou seções, separe claramente.

CRÍTICO: Retorne APENAS o JSON, sem texto adicional. Use markdown code blocks com formato json.
Exemplo de formato:
\`\`\`json
{
  "chapter": "número ou nome do capítulo (se identificável)",
  "section": "seção ou tópico (se identificável)",
  "questions": [
    {
      "number": "número da questão",
      "text": "texto da pergunta",
      "formulas": ["lista de fórmulas relevantes em formato KaTeX"]
    }
  ],
  "answers": [
    {
      "questionNumber": "número da questão correspondente",
      "text": "texto da resposta/solução",
      "formulas": ["lista de fórmulas usadas na solução em formato KaTeX"]
    }
  ],
  "standaloneFormulas": ["fórmulas que não estão associadas a questões específicas em formato KaTeX"]
}
\`\`\`

Se não houver perguntas, respostas ou fórmulas na página, retorne arrays vazios.
NÃO inclua explicações, comentários ou texto fora do JSON.`,
        messages: [{
          role: 'user',
          content: [
            {
              type: 'text',
              text: 'Analise esta página e extraia todas as perguntas, respostas e fórmulas, organizando por capítulo se possível.'
            },
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: 'image/png',
                data: base64Image
              }
            }
          ]
        }]
      });
    } else {
      // openai, openroute, ollama (usam formato OpenAI)
      response = await apiClient.chat.completions.create({
        model: API_MODEL,
        messages: [
        {
          role: 'system',
          content: `Você é um assistente especializado em extrair conteúdo educacional de livros de física de semicondutores.

Sua tarefa é analisar cada página e extrair:
1. Perguntas (exercícios, problemas, questões de revisão)
2. Respostas ou soluções
3. Fórmulas matemáticas e físicas

IMPORTANTE: Todas as fórmulas devem estar em formato KaTeX/LaTeX compatível. Use a seguinte sintaxe:
- Frações: \\frac{numerador}{denominador}
- Derivadas parciais: \\frac{\\partial}{\\partial x}
- Sobrescritos: x^{n} ou e^{-E/kT}
- Subscritos: E_{c}, n_{i}, \\epsilon_{0}
- Letras gregas: \\pi, \\epsilon, \\sigma, \\mu, \\lambda
- Integrais: \\int_{a}^{b} f(x) dx
- Somatórios: \\sum_{i=1}^{n}
- Raízes: \\sqrt{x}
- Parênteses: \\left( \\right) para parênteses dimensionados
- Matrizes: \\begin{matrix} ... \\end{matrix}
- Constantes: use \\hbar para h-barra, \\infty para infinito

Exemplos de formato correto:
- E = \\frac{h^2 n^2}{8 m L^2}
- \\frac{1}{r^2} \\frac{\\partial}{\\partial r} \\left( r^2 \\frac{\\partial \\psi}{\\partial r} \\right) + \\frac{2m}{\\hbar^2} (E - V(r))\\psi = 0
- V(r) = -\\frac{e^2}{4\\pi\\epsilon_0 r}
- n_i = \\sqrt{N_c N_v} e^{-E_g / 2kT}

Organize o conteúdo por capítulos quando possível. Se a página contiver múltiplos capítulos ou seções, separe claramente.

CRÍTICO: Retorne APENAS o JSON, sem texto adicional. Use markdown code blocks com formato json.
Exemplo de formato:
\`\`\`json
{
  "chapter": "número ou nome do capítulo (se identificável)",
  "section": "seção ou tópico (se identificável)",
  "questions": [
    {
      "number": "número da questão",
      "text": "texto da pergunta",
      "formulas": ["lista de fórmulas relevantes em formato KaTeX"]
    }
  ],
  "answers": [
    {
      "questionNumber": "número da questão correspondente",
      "text": "texto da resposta/solução",
      "formulas": ["lista de fórmulas usadas na solução em formato KaTeX"]
    }
  ],
  "standaloneFormulas": ["fórmulas que não estão associadas a questões específicas em formato KaTeX"]
}
\`\`\`

Se não houver perguntas, respostas ou fórmulas na página, retorne arrays vazios.
NÃO inclua explicações, comentários ou texto fora do JSON.`,
        },
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: 'Analise esta página e extraia todas as perguntas, respostas e fórmulas, organizando por capítulo se possível.'
            },
            {
              type: 'image_url',
              image_url: {
                url: `data:image/png;base64,${base64Image}`
              }
            }
          ]
        }
      ],
      max_tokens: 4000,
      temperature: 0.3
    });
    }
    
    let content;
    if (API_PROVIDER === 'anthropic') {
      content = response.content[0].text;
    } else {
      content = response.choices[0].message.content;
    }
    log('INFO', '✅', 'Análise concluída', { pageNumber, tokensUsed: response.usage?.total_tokens });
    
    // Tentar extrair JSON da resposta
    let jsonData;
    try {
      // Remover markdown code blocks se presentes
      let cleanContent = content.replace(/```json\n?|\n?```/g, '').trim();
      
      // Tentar corrigir caracteres LaTeX mal escapados
      // A OpenAI às vezes retorna \text{...} em vez de \\text{...}
      cleanContent = cleanContent.replace(/\\text{/g, '\\\\text{');
      cleanContent = cleanContent.replace(/\\rightarrow/g, '\\\\rightarrow');
      cleanContent = cleanContent.replace(/\\times/g, '\\\\times');
      cleanContent = cleanContent.replace(/\\frac/g, '\\\\frac');
      cleanContent = cleanContent.replace(/\\sqrt/g, '\\\\sqrt');
      cleanContent = cleanContent.replace(/\\int/g, '\\\\int');
      cleanContent = cleanContent.replace(/\\sum/g, '\\\\sum');
      cleanContent = cleanContent.replace(/\\pi/g, '\\\\pi');
      cleanContent = cleanContent.replace(/\\infty/g, '\\\\infty');
      cleanContent = cleanContent.replace(/\\hbar/g, '\\\\hbar');
      cleanContent = cleanContent.replace(/\\partial/g, '\\\\partial');
      cleanContent = cleanContent.replace(/\\left/g, '\\\\left');
      cleanContent = cleanContent.replace(/\\right/g, '\\\\right');
      
      jsonData = JSON.parse(cleanContent);
      
      // Garantir que campos de taxonomia existam
      if (!jsonData.taxonomy) {
        jsonData.taxonomy = {
          category: 'unknown',
          subcategory: 'unknown',
          domain: 'unknown'
        };
      }
      if (!jsonData.keywords) {
        jsonData.keywords = [];
      }
      if (!jsonData.graphVisualization) {
        jsonData.graphVisualization = {
          hasGraph: false,
          graphType: null,
          graphParameters: []
        };
      }
      if (!jsonData.relatedFormulas) {
        jsonData.relatedFormulas = [];
      }
      
    } catch (parseError) {
      log('WARN', '⚠️', 'Não foi possível fazer parse do JSON, tentando correção adicional', { 
        pageNumber, 
        error: parseError.message,
        contentLength: content.length,
        contentPreview: content.substring(0, 200)
      });
      
      // Tentar correção mais agressiva - escapar todas as barras invertidas
      try {
        let aggressiveClean = content.replace(/```json\n?|\n?```/g, '').trim();
        // Escapar barras invertidas que não estão escapadas
        aggressiveClean = aggressiveClean.replace(/([^\\])\\([^\\])/g, '$1\\\\$2');
        jsonData = JSON.parse(aggressiveClean);
        log('INFO', '✅', 'Parse bem-sucedido com correção agressiva');
        
        // Garantir que campos de taxonomia existam
        if (!jsonData.taxonomy) {
          jsonData.taxonomy = {
            category: 'unknown',
            subcategory: 'unknown',
            domain: 'unknown'
          };
        }
        if (!jsonData.keywords) {
          jsonData.keywords = [];
        }
        if (!jsonData.graphVisualization) {
          jsonData.graphVisualization = {
            hasGraph: false,
            graphType: null,
            graphParameters: []
          };
        }
        if (!jsonData.relatedFormulas) {
          jsonData.relatedFormulas = [];
        }
      } catch (secondError) {
        log('WARN', '⚠️', 'Parse falhou mesmo com correção agressiva, retornando texto bruto', { 
          pageNumber, 
          error: secondError.message 
        });
        log('INFO', 'ℹ️', 'Conteúdo bruto retornado pela OpenAI', { rawContent: content });
        jsonData = {
          chapter: 'unknown',
          section: 'unknown',
          questions: [],
          answers: [],
          standaloneFormulas: [],
          rawText: content
        };
      }
    }
    
    return jsonData;
  } catch (error) {
    log('ERROR', '❌', 'Erro ao analisar imagem', { pageNumber, error: error.message });
    throw error;
  }
}

// Função para verificar quais páginas já foram processadas
function getProcessedPages(pdfPath) {
  const outputDir = getOutputDir(pdfPath);
  const files = fs.readdirSync(outputDir);
  const baseFilename = path.basename(pdfPath, path.extname(pdfPath));
  
  const processedPages = new Set();
  
  // Tentar ler do arquivo de metadados separado (sem timestamp)
  const metadataFilename = path.join(outputDir, `${baseFilename}-metadata.json`);
  
  if (fs.existsSync(metadataFilename)) {
    log('INFO', 'ℹ️', 'Arquivo de metadados encontrado');
    try {
      const metadata = JSON.parse(fs.readFileSync(metadataFilename, 'utf-8'));
      
      if (metadata.processedPages) {
        metadata.processedPages.forEach(page => processedPages.add(page));
        log('INFO', 'ℹ️', 'Páginas recuperadas do metadados', { pages: metadata.processedPages });
      }
    } catch (error) {
      log('WARN', '⚠️', 'Erro ao ler arquivo de metadados', { error: error.message });
    }
  }
  
  // Tentar ler do arquivo de metadados de extração de metadados (fase 1)
  const metadataExtractionFilename = path.join(outputDir, `${baseFilename}-metadata-extraction.json`);
  
  if (fs.existsSync(metadataExtractionFilename)) {
    log('INFO', 'ℹ️', 'Arquivo de metadados de extração encontrado');
    try {
      const metadataExtraction = JSON.parse(fs.readFileSync(metadataExtractionFilename, 'utf-8'));
      
      if (metadataExtraction.metadataProcessedPages) {
        metadataExtraction.metadataProcessedPages.forEach(page => processedPages.add(page));
        log('INFO', 'ℹ️', 'Páginas de metadados recuperadas', { pages: metadataExtraction.metadataProcessedPages });
      }
    } catch (error) {
      log('WARN', '⚠️', 'Erro ao ler arquivo de metadados de extração', { error: error.message });
    }
  }
  
  // Se não encontrou no metadados, tentar ler dos arquivos JSON individuais
  if (processedPages.size === 0) {
    const jsonFiles = files.filter(f => 
      f.startsWith(baseFilename) &&
      f.endsWith('.json') && 
      !f.includes('index') && 
      !f.includes('metadata')
    );
    
    log('INFO', 'ℹ️', 'Verificando arquivos JSON existentes', { count: jsonFiles.length });
    
    jsonFiles.forEach(file => {
      try {
        const filePath = path.join(outputDir, file);
        const content = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        
        // Extrair número das páginas processadas (se disponível nos metadados)
        if (content.processedPages) {
          content.processedPages.forEach(page => processedPages.add(page));
          log('INFO', 'ℹ️', 'Páginas encontradas no arquivo', { file, pages: content.processedPages });
        }
        
        // Se não houver metadados processedPages, inferir do conteúdo
        if (!content.processedPages || content.processedPages.length === 0) {
          // Verificar se há conteúdo (perguntas, respostas, fórmulas)
          const hasContent = 
            (content.questions && content.questions.length > 0) ||
            (content.answers && content.answers.length > 0) ||
            (content.standaloneFormulas && content.standaloneFormulas.length > 0);
          
          if (hasContent) {
            log('INFO', 'ℹ️', 'Arquivo tem conteúdo mas sem metadados de páginas', { file });
            // Não podemos inferir números de páginas específicos sem metadados
            // Mas sabemos que há algum processamento
          }
        }
      } catch (error) {
        log('WARN', '⚠️', 'Erro ao ler arquivo JSON existente', { file, error: error.message });
      }
    });
  }
  
  log('INFO', 'ℹ️', 'Total de páginas já processadas', { count: processedPages.size });
  return processedPages;
}

// Função para agrupar conteúdo por capítulo
function groupByChapter(extractedData) {
  const grouped = {};
  
  extractedData.forEach((data, index) => {
    const chapter = data.chapter || `chapter-${index}`;
    
    if (!grouped[chapter]) {
      grouped[chapter] = {
        chapter: chapter,
        questions: [],
        answers: [],
        standaloneFormulas: []
      };
    }
    
    grouped[chapter].questions.push(...(data.questions || []));
    grouped[chapter].answers.push(...(data.answers || []));
    grouped[chapter].standaloneFormulas.push(...(data.standaloneFormulas || []));
  });
  
  return grouped;
}

// Função para salvar incrementalmente após cada página processada
async function saveIncremental(data, pageNumber, pdfPath, processedPages) {
  const outputDir = getOutputDir(pdfPath);
  const baseFilename = path.basename(pdfPath, path.extname(pdfPath));
  const chapter = data.chapter || 'unknown';
  const safeChapterName = chapter.replace(/[^a-zA-Z0-9-_]/g, '_');
  
  // Extrair bookTitle e author do nome do arquivo se possível
  const bookTitle = baseFilename.replace(/_/g, ' ').replace(/ - Solution Manual.*$/, '').replace(/ - .*$/, '');
  const authorMatch = baseFilename.match(/ - (.+?)\.pdf$/);
  const author = authorMatch ? authorMatch[1].replace(/\.pdf$/, '') : 'Unknown';
  
  // Tentar extrair editora e edição do nome do arquivo (se disponível)
  const publisherMatch = baseFilename.match(/ - (.+?) - /);
  const publisher = publisherMatch ? publisherMatch[1] : 'Unknown';
  
  const editionMatch = baseFilename.match(/(\d+)(?:st|nd|rd|th)?\s*Edition/i);
  const edition = editionMatch ? editionMatch[1] : 'Unknown';
  
  const yearMatch = baseFilename.match(/(\d{4})/);
  const year = yearMatch ? yearMatch[1] : 'Unknown';
  
  // Atualizar arquivo de metadados (sem timestamp)
  const metadataFilename = path.join(outputDir, `${baseFilename}-metadata.json`);
  fs.writeFileSync(metadataFilename, JSON.stringify({
    processedPages: Array.from(processedPages),
    lastUpdated: new Date().toISOString(),
    bookTitle,
    author,
    publisher,
    edition,
    year
  }, null, 2));
  log('INFO', '💾', 'Metadados atualizados', { pageNumber, filename: metadataFilename });
  
  // Salvar dados do capítulo (sem timestamp)
  const chapterFilename = path.join(outputDir, `${baseFilename}-${safeChapterName}.json`);
  
  // Verificar se existe arquivo anterior do capítulo para mesclar
  let chapterData = { 
    chapter, 
    section: data.section || 'unknown', 
    questions: [], 
    answers: [], 
    standaloneFormulas: [],
    bookTitle,
    author
  };
  
  if (fs.existsSync(chapterFilename)) {
    try {
      chapterData = JSON.parse(fs.readFileSync(chapterFilename, 'utf-8'));
    } catch (error) {
      log('WARN', '⚠️', 'Erro ao ler arquivo existente, criando novo', { error: error.message });
    }
  }
  
  // Adicionar dados da página atual
  if (data.questions && data.questions.length > 0) {
    const existingQuestions = new Set(chapterData.questions.map(q => q.number));
    const newQuestions = data.questions.filter(q => !existingQuestions.has(q.number));
    chapterData.questions.push(...newQuestions);
  }
  
  if (data.answers && data.answers.length > 0) {
    const existingAnswers = new Set(chapterData.answers.map(a => a.questionNumber));
    const newAnswers = data.answers.filter(a => !existingAnswers.has(a.questionNumber));
    chapterData.answers.push(...newAnswers);
  }
  
  if (data.standaloneFormulas && data.standaloneFormulas.length > 0) {
    const existingFormulas = new Set(chapterData.standaloneFormulas.map(f => f.originalFormula));
    const newFormulas = data.standaloneFormulas.filter(f => !existingFormulas.has(f.originalFormula));
    chapterData.standaloneFormulas.push(...newFormulas);
  }
  
  // Adicionar metadados
  chapterData.processedPages = Array.from(processedPages);
  chapterData.lastUpdated = new Date().toISOString();
  chapterData.bookTitle = bookTitle;
  chapterData.author = author;
  chapterData.publisher = publisher;
  chapterData.edition = edition;
  chapterData.year = year;
  
  // Salvar arquivo atualizado
  fs.writeFileSync(chapterFilename, JSON.stringify(chapterData, null, 2));
  log('INFO', '✅', 'Capítulo salvo incrementalmente', { chapter, filename: chapterFilename });
}

// Função para extrair metadados de forma incremental de cada página
async function extractMetadataFromPage(imagePath, pageNumber) {
  log('INFO', '🔍', 'Extraindo metadados da página', { pageNumber, imagePath });
  
  try {
    const imageBuffer = fs.readFileSync(imagePath);
    const base64Image = imageBuffer.toString('base64');
    
    const prompt = `Analise esta página de um livro acadêmico e extraia as informações disponíveis:

SE ESTA PÁGINA FOR CAPA, PÁGINA DE TÍTULO OU FICHA CATALOGRÁFICA:
- title: Título completo do livro
- author: Nome do(s) autor(es)
- publisher: Editora/publicadora
- edition: Edição (ex: "Fourth Edition", "3rd")
- year: Ano de publicação (4 dígitos)

SE ESTA PÁGINA FOR ÍNDICE (TABLE OF CONTENTS):
- chapters: Extraia TODOS os capítulos listados com número e título
- Formato: [{"number": "1", "title": "Título do Capítulo"}, {"number": "2", "title": "Título do Capítulo"}, ...]

SE ESTA PÁGINA NÃO TIVER NENHUMA DESTAS INFORMAÇÕES:
- Retorne campos vazios ou "Unknown"

Retorne APENAS um JSON válido:
{
  "title": "Título ou Unknown",
  "author": "Autor ou Unknown",
  "publisher": "Editora ou Unknown",
  "edition": "Edição ou Unknown",
  "year": "Ano ou Unknown",
  "chapters": [{"number": "1", "title": "Título"}],
  "isIndex": true/false,
  "hasContent": true/false
}

IMPORTANTE:
- Extraia APENAS informações VISÍVEIS nesta página
- Se for índice, extraia TODOS os capítulos listados
- NÃO invente informações`;

    let response;
    
    if (API_PROVIDER === 'openai' || API_PROVIDER === 'openroute' || API_PROVIDER === 'ollama') {
      response = await apiClient.chat.completions.create({
        model: API_MODEL,
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: prompt },
              { type: 'image_url', image_url: { url: `data:image/png;base64,${base64Image}` } }
            ]
          }
        ],
        max_tokens: 2000
      });
    } else if (API_PROVIDER === 'anthropic') {
      response = await apiClient.messages.create({
        model: API_MODEL,
        max_tokens: 2000,
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: prompt },
              { type: 'image', source: { type: 'base64', media_type: 'image/png', data: base64Image } }
            ]
          }
        ]
      });
    }
    
    let content;
    if (API_PROVIDER === 'anthropic') {
      content = response.content[0].text;
    } else {
      content = response.choices[0].message.content;
    }
    
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return { isIndex: false, hasContent: false };
    }
    
    const result = JSON.parse(jsonMatch[0]);
    
    // Normalizar chapters para garantir array
    if (result.chapters) {
      if (typeof result.chapters === 'string') {
        result.chapters = [];
      } else if (!Array.isArray(result.chapters)) {
        result.chapters = [];
      }
    } else {
      result.chapters = [];
    }
    
    log('INFO', '✅', 'Metadados extraídos da página', { 
      pageNumber, 
      isIndex: result.isIndex, 
      hasContent: result.hasContent,
      hasTitle: !!result.title && result.title !== 'Unknown',
      hasChapters: result.chapters.length > 0
    });
    
    return result;
    
  } catch (error) {
    log('WARN', '⚠️', 'Erro ao extrair metadados da página', { pageNumber, error: error.message });
    return { isIndex: false, hasContent: false, chapters: [] };
  }
}

// Função para extrair metadados da ficha catalográfica usando IA
async function extractBookMetadataFromCatalogPage(imagePath, pdfPath) {
  log('INFO', '🔍', 'Extraindo metadados da ficha catalográfica', { imagePath });
  
  try {
    const imageBuffer = fs.readFileSync(imagePath);
    const base64Image = imageBuffer.toString('base64');
    
    const prompt = `Analise esta página de um livro acadêmico e extraia as seguintes informações da ficha catalográfica, páginas de rosto ou índice:

1. **Título completo do livro** (title) - extraia exatamente como aparece na capa ou página de título
2. **Autor(es)** (author) - lista completa de todos os autores como aparece no livro
3. **Editora** (publisher) - nome da editora/publicadora
4. **Edição** (edition) - número da edição (ex: "Fourth Edition", "3rd", "1")
5. **Ano de publicação** (year) - ano de publicação (4 dígitos)
6. **Capítulos** (chapters) - SE ESTA PÁGINA CONTIVER ÍNDICE, extraia todos os capítulos com número e título. Formato: [{"number": "1", "title": "Título do Capítulo"}, ...]
7. **Citação acadêmica** (citation) - formate em formato ABNT: AUTOR, Nome. Título. Edição. Editora, Ano.

IMPORTANTE:
- Extraia APENAS as informações que estão VISÍVEIS nesta página específica
- Se esta página for índice, extraia TODOS os capítulos listados
- Se não encontrar uma informação, use "Unknown"
- Para capítulos, use o formato: [{"number": "número", "title": "título completo"}]
- NÃO invente informações que não estão na página

Retorne APENAS um JSON válido com estes campos:
{
  "title": "Título Completo do Livro",
  "author": "Nome do Autor",
  "publisher": "Editora",
  "edition": "Edição",
  "year": "Ano",
  "chapters": [{"number": "1", "title": "Título do Capítulo"}],
  "citation": "AUTOR, Nome. Título. Edição. Editora, Ano."
}`;

    let response;
    
    if (API_PROVIDER === 'openai' || API_PROVIDER === 'openroute' || API_PROVIDER === 'ollama') {
      response = await apiClient.chat.completions.create({
        model: API_MODEL,
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: prompt },
              { type: 'image_url', image_url: { url: `data:image/png;base64,${base64Image}` } }
            ]
          }
        ],
        max_tokens: 2000
      });
    } else if (API_PROVIDER === 'anthropic') {
      response = await apiClient.messages.create({
        model: API_MODEL,
        max_tokens: 2000,
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: prompt },
              { type: 'image', source: { type: 'base64', media_type: 'image/png', data: base64Image } }
            ]
          }
        ]
      });
    }
    
    let content;
    if (API_PROVIDER === 'anthropic') {
      content = response.content[0].text;
    } else {
      content = response.choices[0].message.content;
    }
    
    // Extrair JSON da resposta
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      log('WARN', '⚠️', 'Não foi possível extrair JSON da resposta da IA');
      return null;
    }
    
    let metadata = JSON.parse(jsonMatch[0]);
    
    // Normalizar estrutura de chapters se necessário
    if (metadata.chapters) {
      // Se chapters for string "Unknown", converter para array vazio
      if (typeof metadata.chapters === 'string' && metadata.chapters === 'Unknown') {
        metadata.chapters = [];
      }
      // Se chapters for array de strings, converter para array de objetos
      else if (Array.isArray(metadata.chapters)) {
        if (metadata.chapters.length > 0 && typeof metadata.chapters[0] === 'string') {
          metadata.chapters = metadata.chapters.map((chapter, index) => {
            const match = chapter.match(/^(\d+)[:\s]+(.+)$/);
            if (match) {
              return { number: match[1], title: match[2].trim() };
            }
            return { number: (index + 1).toString(), title: chapter };
          });
        }
      }
      // Se chapters não for array, converter para array vazio
      else if (!Array.isArray(metadata.chapters)) {
        metadata.chapters = [];
      }
    } else {
      // Se chapters não existir, criar array vazio
      metadata.chapters = [];
    }
    
    log('INFO', '✅', 'Metadados extraídos com sucesso', { metadata });
    return metadata;
    
  } catch (error) {
    log('ERROR', '❌', 'Erro ao extrair metadados da ficha catalográfica', { error: error.message });
    return null;
  }
}

// Função para atualizar o index.json global com metadados de todos os livros
function updateGlobalIndex(bookName, bookMetadata) {
  const globalIndexPath = path.join(BASE_OUTPUT_DIR, 'index.json');
  
  let globalIndex = {};
  if (fs.existsSync(globalIndexPath)) {
    try {
      globalIndex = JSON.parse(fs.readFileSync(globalIndexPath, 'utf-8'));
      log('INFO', 'ℹ️', 'Index global existente carregado');
    } catch (error) {
      log('WARN', '⚠️', 'Erro ao ler index global, criando novo', { error: error.message });
    }
  }
  
  // Atualizar ou adicionar metadados do livro
  globalIndex[bookName] = {
    ...bookMetadata,
    directory: bookName,
    lastUpdated: new Date().toISOString()
  };
  
  fs.writeFileSync(globalIndexPath, JSON.stringify(globalIndex, null, 2));
  log('INFO', '✅', 'Index global atualizado', { filename: globalIndexPath, bookName });
}

// Função para salvar resultados
async function saveResults(groupedData, pdfPath, processedPages, bookMetadata = null) {
  log('INFO', '💾', 'Salvando resultados agrupados por capítulo');
  
  const outputDir = getOutputDir(pdfPath);
  const baseFilename = path.basename(pdfPath, path.extname(pdfPath));
  const bookName = baseFilename;
  
  // Extrair bookTitle e author do nome do arquivo se possível
  const bookTitle = baseFilename.replace(/_/g, ' ').replace(/ - Solution Manual.*$/, '').replace(/ - .*$/, '');
  const authorMatch = baseFilename.match(/ - (.+?)\.pdf$/);
  const author = authorMatch ? authorMatch[1].replace(/\.pdf$/, '') : 'Unknown';
  
  // Tentar extrair editora e edição do nome do arquivo (se disponível)
  const publisherMatch = baseFilename.match(/ - (.+?) - /);
  const publisher = publisherMatch ? publisherMatch[1] : 'Unknown';
  
  const editionMatch = baseFilename.match(/(\d+)(?:st|nd|rd|th)?\s*Edition/i);
  const edition = editionMatch ? editionMatch[1] : 'Unknown';
  
  const yearMatch = baseFilename.match(/(\d{4})/);
  const year = yearMatch ? yearMatch[1] : 'Unknown';
  
  // Salvar arquivo de metadados de páginas processadas (separado dos dados, sem timestamp)
  const metadataFilename = path.join(outputDir, `${baseFilename}-metadata.json`);
  fs.writeFileSync(metadataFilename, JSON.stringify({
    processedPages: Array.from(processedPages),
    lastUpdated: new Date().toISOString(),
    bookTitle,
    author
  }, null, 2));
  log('INFO', '✅', 'Metadados de páginas salvo', { filename: metadataFilename });
  
  Object.entries(groupedData).forEach(([chapterName, data]) => {
    const safeChapterName = chapterName.replace(/[^a-zA-Z0-9-_]/g, '_');
    const outputFilename = path.join(outputDir, `${baseFilename}-${safeChapterName}.json`);
    
    // Verificar se existe arquivo anterior do mesmo capítulo para mesclar
    let mergedData = { ...data };
    
    if (fs.existsSync(outputFilename)) {
      log('INFO', 'ℹ️', 'Mesclando com arquivo existente', { chapter: chapterName });
      try {
        const existingData = JSON.parse(fs.readFileSync(outputFilename, 'utf-8'));
        
        // Mesclar perguntas
        if (existingData.questions && data.questions) {
          const existingQuestions = new Set(existingData.questions.map(q => q.number));
          const newQuestions = data.questions.filter(q => !existingQuestions.has(q.number));
          mergedData.questions = [...existingData.questions, ...newQuestions];
        }
        
        // Mesclar respostas
        if (existingData.answers && data.answers) {
          const existingAnswers = new Set(existingData.answers.map(a => a.questionNumber));
          const newAnswers = data.answers.filter(a => !existingAnswers.has(a.questionNumber));
          mergedData.answers = [...existingData.answers, ...newAnswers];
        }
        
        // Mesclar fórmulas independentes
        if (existingData.standaloneFormulas && data.standaloneFormulas) {
          const existingFormulas = new Set(existingData.standaloneFormulas.map(f => f.originalFormula));
          const newFormulas = data.standaloneFormulas.filter(f => !existingFormulas.has(f.originalFormula));
          mergedData.standaloneFormulas = [...existingData.standaloneFormulas, ...newFormulas];
        }
        
        log('INFO', '✅', 'Dados mesclados com sucesso', { 
          totalQuestions: mergedData.questions?.length || 0,
          totalAnswers: mergedData.answers?.length || 0
        });
      } catch (error) {
        log('WARN', '⚠️', 'Erro ao mesclar com arquivo existente, usando apenas novos dados', { error: error.message });
      }
    }
    
    // Adicionar metadados de páginas processadas
    mergedData.processedPages = Array.from(processedPages);
    mergedData.lastUpdated = new Date().toISOString();
    mergedData.bookTitle = bookTitle;
    mergedData.author = author;
    mergedData.publisher = publisher;
    mergedData.edition = edition;
    mergedData.year = year;
    
    fs.writeFileSync(outputFilename, JSON.stringify(mergedData, null, 2));
    log('INFO', '✅', 'Arquivo salvo', { chapter: chapterName, filename: outputFilename });
  });
  
  // Salvar índice geral (sem timestamp)
  const indexFilename = path.join(outputDir, `${baseFilename}-index.json`);
  const indexData = {
    ...groupedData,
    processedPages: Array.from(processedPages),
    lastUpdated: new Date().toISOString(),
    bookTitle,
    author,
    publisher,
    edition,
    year,
    directory: baseFilename
  };
  fs.writeFileSync(indexFilename, JSON.stringify(indexData, null, 2));
  log('INFO', '✅', 'Índice geral salvo', { filename: indexFilename });
  
  // Atualizar o index.json global com metadados do livro
  updateGlobalIndex(baseFilename, {
    title: bookTitle,
    author,
    publisher,
    edition,
    year,
    chapters: Object.keys(groupedData),
    totalProcessedPages: processedPages.size
  });
  
  // Atualizar o index.json global com metadados completos (incluindo capítulos extraídos do índice)
  if (bookMetadata) {
    updateGlobalIndex(baseFilename, {
      title: bookMetadata.title,
      author: bookMetadata.author,
      publisher: bookMetadata.publisher,
      edition: bookMetadata.edition,
      year: bookMetadata.year,
      chapters: bookMetadata.chapters,
      citation: bookMetadata.citation,
      totalProcessedPages: processedPages.size
    });
  } else {
    // Fallback para metadados básicos
    updateGlobalIndex(baseFilename, {
      title: bookTitle,
      author,
      publisher,
      edition,
      year,
      chapters: Object.keys(groupedData),
      citation: `${author}. ${bookTitle}. ${publisher}, ${year}.`,
      totalProcessedPages: processedPages.size
    });
  }
}

// Função para extrair metadados das primeiras páginas do livro
async function extractMetadataFromFirstPages(imageDir, pdfPath) {
  log('INFO', '🔍', 'Buscando metadados nas primeiras páginas', { imageDir });
  
  // Buscar as primeiras 10 páginas onde geralmente está a ficha catalográfica
  const files = fs.readdirSync(imageDir)
    .filter(f => f.endsWith('.png'))
    .sort((a, b) => {
      const numA = parseInt(a.match(/\d+/)[0]);
      const numB = parseInt(b.match(/\d+/)[0]);
      return numA - numB;
    });
  
  const firstPages = files.slice(0, 10);
  log('INFO', 'ℹ️', 'Verificando primeiras páginas', { pages: firstPages.length });
  
  for (const file of firstPages) {
    const imagePath = path.join(imageDir, file);
    const metadata = await extractBookMetadataFromCatalogPage(imagePath, pdfPath);
    
    if (metadata && metadata.title && metadata.title !== 'Unknown') {
      log('INFO', '✅', 'Metadados encontrados na página', { page: file });
      return metadata;
    }
  }
  
  log('WARN', '⚠️', 'Não foi possível extrair metadados das primeiras páginas');
  return null;
}

// Função para salvar metadados de extração (fase 1)
function saveMetadataExtraction(pdfPath, metadata, metadataProcessedPages, indexEndPage) {
  const outputDir = getOutputDir(pdfPath);
  const baseFilename = path.basename(pdfPath, path.extname(pdfPath));
  
  const metadataExtractionFilename = path.join(outputDir, `${baseFilename}-metadata-extraction.json`);
  
  const metadataExtractionData = {
    ...metadata,
    metadataProcessedPages: Array.from(metadataProcessedPages),
    indexEndPage,
    lastUpdated: new Date().toISOString()
  };
  
  fs.writeFileSync(metadataExtractionFilename, JSON.stringify(metadataExtractionData, null, 2));
  log('INFO', '✅', 'Metadados de extração salvos', { filename: metadataExtractionFilename, indexEndPage });
}

// Função para carregar metadados de extração (fase 1)
function loadMetadataExtraction(pdfPath) {
  const outputDir = getOutputDir(pdfPath);
  const baseFilename = path.basename(pdfPath, path.extname(pdfPath));
  
  const metadataExtractionFilename = path.join(outputDir, `${baseFilename}-metadata-extraction.json`);
  
  if (fs.existsSync(metadataExtractionFilename)) {
    try {
      const metadataExtraction = JSON.parse(fs.readFileSync(metadataExtractionFilename, 'utf-8'));
      log('INFO', '✅', 'Metadados de extração carregados', { indexEndPage: metadataExtraction.indexEndPage });
      return metadataExtraction;
    } catch (error) {
      log('WARN', '⚠️', 'Erro ao ler arquivo de metadados de extração', { error: error.message });
      return null;
    }
  }
  
  return null;
}

// Função principal
async function main() {
  log('INFO', '🚀', 'Iniciando extração de conteúdo de PDF');
  
  // Verificar argumento de linha de comando
  const args = process.argv.slice(2);
  if (args.length === 0) {
    log('ERROR', '❌', 'Uso: node extract-pdf-content.js [--api <provider>] [--force] [--extract] <caminho-do-pdf>');
    log('INFO', 'ℹ️', 'Opções:');
    log('INFO', 'ℹ️', '  --api <provider>  : API provider (openai, anthropic, openroute, ollama)');
    log('INFO', 'ℹ️', '  --force           : Forçar reprocessamento de todas as páginas');
    log('INFO', 'ℹ️', '  --extract         : Apenas extração, sem enriquecimento de fórmulas');
    log('INFO', 'ℹ️', 'Providers disponíveis: openai, anthropic, openroute, ollama');
    process.exit(1);
  }
  
  // Parse argumentos
  let pdfPath = '';
  let forceReprocess = false;
  let extractOnly = false;
  
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--api' && i + 1 < args.length) {
      API_PROVIDER = args[i + 1].toLowerCase();
      i++; // pular o próximo argumento
    } else if (args[i] === '--force') {
      forceReprocess = true;
    } else if (args[i] === '--extract') {
      extractOnly = true;
    } else if (!args[i].startsWith('--')) {
      pdfPath = args[i];
    }
  }
  
  if (!pdfPath) {
    log('ERROR', '❌', 'Caminho do PDF não fornecido');
    log('INFO', 'ℹ️', 'Uso: node extract-pdf-content.js [--api <provider>] [--force] [--extract] <caminho-do-pdf>');
    process.exit(1);
  }
  
  // Inicializar cliente API
  apiClient = initializeApiClient(API_PROVIDER);
  
  // Verificar se o arquivo existe
  if (!fs.existsSync(pdfPath)) {
    log('ERROR', '❌', 'Arquivo PDF não encontrado', { pdfPath });
    process.exit(1);
  }
  
  log('INFO', 'ℹ️', 'Configurações', { 
    pdfPath, 
    provider: API_PROVIDER,
    model: API_MODEL,
    forceReprocess,
    extractOnly,
    outputDir: getOutputDir(pdfPath) 
  });
  
  // Variáveis para estado parcial (para salvamento em caso de interrupção)
  let extractedData = [];
  let newlyProcessedPages = new Set();
  
  // Handler para interrupção (Ctrl+C)
  const handleInterrupt = async () => {
    log('WARN', '⚠️', 'Processo interrompido pelo usuário');
    if (extractedData.length > 0) {
      log('INFO', '💾', 'Salvando dados parciais antes de sair');
      try {
        const groupedData = groupByChapter(extractedData);
        await saveResults(groupedData, pdfPath, newlyProcessedPages, bookMetadata);
        log('INFO', '✅', 'Dados parciais salvos com sucesso');
      } catch (error) {
        log('ERROR', '❌', 'Erro ao salvar dados parciais', { error: error.message });
      }
    }
    process.exit(0);
  };
  
  process.on('SIGINT', handleInterrupt);
  process.on('SIGTERM', handleInterrupt);
  
  try {
    // Converter PDF para imagens (ou usar imagens existentes)
    const images = await pdfToImages(pdfPath);
    
    // Verificar se já existe metadados de extração (fase 1)
    const metadataExtraction = loadMetadataExtraction(pdfPath);
    
    // FASE 1: Extração de metadados (incluindo capítulos do índice)
    // Executa sempre se o arquivo de metadados de extração não existir
    let bookMetadata = null;
    let indexEndPage = null;
    let metadataProcessedPages = new Set();
    
    if (!metadataExtraction || forceReprocess) {
      log('INFO', '🚀', 'Iniciando FASE 1: Extração de metadados e índice de forma incremental');
      
      // Inicializar metadados vazios
      bookMetadata = {
        title: 'Unknown',
        author: 'Unknown',
        publisher: 'Unknown',
        edition: 'Unknown',
        year: 'Unknown',
        chapters: [],
        citation: 'Unknown'
      };
      
      // Processar páginas incrementalmente até o fim do índice
      let foundIndex = false;
      let consecutiveNonIndexPages = 0;
      const MAX_CONSECUTIVE_NON_INDEX = 3;
      const MAX_PAGES_TO_SCAN = 50; // Limitar varredura a 50 páginas para economizar tokens
      
      for (let i = 0; i < Math.min(images.length, MAX_PAGES_TO_SCAN); i++) {
        const pageNumber = i + 1;
        
        log('INFO', '🔍', `Processando página ${pageNumber}/${Math.min(images.length, MAX_PAGES_TO_SCAN)} para metadados`);
        const pageMetadata = await extractMetadataFromPage(images[i], pageNumber);
        
        // Acumular metadados básicos se encontrados
        if (pageMetadata.title && pageMetadata.title !== 'Unknown') {
          bookMetadata.title = pageMetadata.title;
          log('INFO', '✅', 'Título encontrado', { title: pageMetadata.title });
        }
        
        if (pageMetadata.author && pageMetadata.author !== 'Unknown') {
          bookMetadata.author = pageMetadata.author;
          log('INFO', '✅', 'Autor encontrado', { author: pageMetadata.author });
        }
        
        if (pageMetadata.publisher && pageMetadata.publisher !== 'Unknown') {
          bookMetadata.publisher = pageMetadata.publisher;
          log('INFO', '✅', 'Editora encontrada', { publisher: pageMetadata.publisher });
        }
        
        if (pageMetadata.edition && pageMetadata.edition !== 'Unknown') {
          bookMetadata.edition = pageMetadata.edition;
          log('INFO', '✅', 'Edição encontrada', { edition: pageMetadata.edition });
        }
        
        if (pageMetadata.year && pageMetadata.year !== 'Unknown') {
          bookMetadata.year = pageMetadata.year;
          log('INFO', '✅', 'Ano encontrado', { year: pageMetadata.year });
        }
        
        // Se for página de índice, acumular capítulos
        if (pageMetadata.isIndex) {
          foundIndex = true;
          consecutiveNonIndexPages = 0;
          metadataProcessedPages.add(pageNumber);
          
          if (pageMetadata.chapters && pageMetadata.chapters.length > 0) {
            log('INFO', '✅', `Capítulos encontrados na página ${pageNumber}`, { count: pageMetadata.chapters.length });
            
            // Adicionar capítulos únicos
            const existingChapterNumbers = new Set(bookMetadata.chapters.map(c => c.number));
            pageMetadata.chapters.forEach(chapter => {
              if (!existingChapterNumbers.has(chapter.number)) {
                bookMetadata.chapters.push({
                  number: chapter.number,
                  title: chapter.title
                });
              }
            });
          }
          
          log('INFO', 'ℹ️', 'Página de índice identificada', { pageNumber });
        } else {
          if (foundIndex) {
            consecutiveNonIndexPages++;
            log('INFO', 'ℹ️', 'Página não é índice', { pageNumber, consecutiveNonIndexPages });
            
            // Se encontrou X páginas consecutivas que não são índice, assumir que o índice terminou
            if (consecutiveNonIndexPages >= MAX_CONSECUTIVE_NON_INDEX) {
              indexEndPage = pageNumber - MAX_CONSECUTIVE_NON_INDEX;
              log('INFO', '🏁', 'Índice terminado', { indexEndPage });
              break;
            }
          }
        }
      }
      
      // Se não encontrou fim do índice, assumir que terminou na última página verificada
      if (!indexEndPage && foundIndex) {
        indexEndPage = Math.max(...metadataProcessedPages);
        log('INFO', 'ℹ️', 'Índice terminado na última página', { indexEndPage });
      }
      
      // Gerar citação se tiver metadados suficientes
      if (bookMetadata.author !== 'Unknown' && bookMetadata.title !== 'Unknown') {
        bookMetadata.citation = `${bookMetadata.author}. ${bookMetadata.title}. ${bookMetadata.publisher !== 'Unknown' ? bookMetadata.publisher : 'Unknown'}, ${bookMetadata.year !== 'Unknown' ? bookMetadata.year : 'Unknown'}.`;
      }
      
      // Adicionar totalProcessedPages
      bookMetadata.totalProcessedPages = images.length;
      
      // Salvar metadados de extração
      saveMetadataExtraction(pdfPath, bookMetadata, metadataProcessedPages, indexEndPage);
      
      log('INFO', '✅', 'FASE 1 concluída', {
        title: bookMetadata.title,
        author: bookMetadata.author,
        publisher: bookMetadata.publisher,
        edition: bookMetadata.edition,
        year: bookMetadata.year,
        totalChapters: bookMetadata.chapters.length,
        indexEndPage,
        metadataProcessedPages: metadataProcessedPages.size
      });
    } else {
      // Carregar metadados existentes
      bookMetadata = metadataExtraction;
      indexEndPage = metadataExtraction.indexEndPage;
      metadataProcessedPages = new Set(metadataExtraction.metadataProcessedPages || []);
      
      log('INFO', '✅', 'Metadados de extração carregados', {
        totalChapters: bookMetadata.chapters?.length || 0,
        indexEndPage,
        metadataProcessedPages: metadataProcessedPages.size
      });
    }
    
    // FASE 2: Extração de fórmulas (continua de onde o índice terminou)
    log('INFO', '🚀', 'Iniciando FASE 2: Extração de fórmulas');
    
    // Verificar quais páginas já foram processadas (fórmulas)
    // Nota: Isso inclui páginas processadas na FASE 1, que serão puladas na FASE 2
    const processedPages = getProcessedPages(pdfPath);
    log('INFO', 'ℹ️', 'Páginas já processadas (fórmulas + metadados)', { count: processedPages.size });
    
    // Determinar página inicial para extração de fórmulas
    const formulaStartPage = indexEndPage ? indexEndPage + 1 : 1;
    log('INFO', 'ℹ️', 'Iniciando extração de fórmulas na página', { formulaStartPage });
    
    // Analisar cada imagem para fórmulas (pular páginas já processadas e páginas de metadados)
    for (let i = formulaStartPage - 1; i < images.length; i++) {
      const pageNumber = i + 1;
      
      // Pular páginas que foram processadas na fase de metadados
      if (metadataProcessedPages.has(pageNumber)) {
        log('INFO', '⏭️', `Página ${pageNumber} processada na fase de metadados, pulando`);
        continue;
      }
      
      // Pular páginas já processadas para fórmulas
      if (processedPages.has(pageNumber)) {
        log('INFO', '⏭️', `Página ${pageNumber} já processada, pulando`);
        continue;
      }
      
      log('INFO', '🔄', `Processando página ${pageNumber}/${images.length} para fórmulas`);
      const data = await analyzeImage(images[i], pageNumber);
      
      // Enriquecer fórmulas extraídas (apenas se não for --extract)
      if (!extractOnly) {
        if (data.questions && data.questions.length > 0) {
          for (const question of data.questions) {
            if (question.formulas && question.formulas.length > 0) {
              const enrichedFormulas = [];
              for (const formula of question.formulas) {
                const enriched = await enrichFormula(formula, `questão ${question.number}`);
                enrichedFormulas.push(enriched);
              }
              question.formulas = enrichedFormulas;
            }
          }
        }
        
        if (data.answers && data.answers.length > 0) {
          for (const answer of data.answers) {
            if (answer.formulas && answer.formulas.length > 0) {
              const enrichedFormulas = [];
              for (const formula of answer.formulas) {
                const enriched = await enrichFormula(formula, `resposta ${answer.questionNumber}`);
                enrichedFormulas.push(enriched);
              }
              answer.formulas = enrichedFormulas;
            }
          }
        }
        
        if (data.standaloneFormulas && data.standaloneFormulas.length > 0) {
          const enrichedFormulas = [];
          for (const formula of data.standaloneFormulas) {
            const enriched = await enrichFormula(formula, 'fórmula independente');
            enrichedFormulas.push(enriched);
          }
          data.standaloneFormulas = enrichedFormulas;
        }
      } else {
        log('INFO', 'ℹ️', 'Modo extract ativado - pulando enriquecimento de fórmulas');
      }
      
      extractedData.push(data);
      newlyProcessedPages.add(pageNumber);
      
      // Salvar incrementalmente após cada página processada
      await saveIncremental(data, pageNumber, pdfPath, newlyProcessedPages);
      
      // NÃO deletar imagem temporária - mantê-la para reprocessamento se necessário
      log('INFO', 'ℹ️', 'Imagem mantida para reprocessamento', { pageNumber, imagePath: images[i] });
    }
    
    // Se não houver novos dados para processar, usar dados existentes
    if (extractedData.length === 0 && processedPages.size > 0) {
      log('INFO', 'ℹ️', 'Nenhuma nova página para processar, usando dados existentes');
      
      // Carregar metadados de extração se não estiver definido
      if (!bookMetadata) {
        bookMetadata = loadMetadataExtraction(pdfPath);
        if (bookMetadata) {
          indexEndPage = bookMetadata.indexEndPage;
          metadataProcessedPages = new Set(bookMetadata.metadataProcessedPages || []);
        }
      }
      
      // Carregar dados existentes do índice
      const indexFile = fs.readdirSync(BASE_OUTPUT_DIR)
        .find(f => f.includes('index') && f.startsWith(path.basename(pdfPath, path.extname(pdfPath))));
      
      if (indexFile) {
        const indexPath = path.join(BASE_OUTPUT_DIR, indexFile);
        const existingData = JSON.parse(fs.readFileSync(indexPath, 'utf-8'));
        log('INFO', '🏁', 'Usando dados existentes', { chapters: Object.keys(existingData).length });
        
        // Atualizar index.json global com metadados completos
        if (bookMetadata) {
          updateGlobalIndex(path.basename(pdfPath, path.extname(pdfPath)), {
            title: bookMetadata.title,
            author: bookMetadata.author,
            publisher: bookMetadata.publisher,
            edition: bookMetadata.edition,
            year: bookMetadata.year,
            chapters: bookMetadata.chapters,
            citation: bookMetadata.citation,
            totalProcessedPages: processedPages.size
          });
        }
        
        return;
      }
    }
    
    // Agrupar por capítulo
    const groupedData = groupByChapter(extractedData);
    
    // Combinar com dados existentes se houver
    if (processedPages.size > 0) {
      log('INFO', 'ℹ️', 'Combinando com dados existentes');
      // Aqui você poderia implementar lógica para mesclar com dados existentes
      // Por enquanto, vamos apenas adicionar as páginas processadas ao conjunto total
      processedPages.forEach(page => newlyProcessedPages.add(page));
    }
    
    // Salvar resultados
    await saveResults(groupedData, pdfPath, newlyProcessedPages, bookMetadata);
    
    log('INFO', '🏁', 'Extração concluída com sucesso', { 
      totalPages: images.length,
      newlyProcessed: newlyProcessedPages.size,
      totalProcessed: newlyProcessedPages.size,
      chapters: Object.keys(groupedData).length 
    });
    
  } catch (error) {
    log('ERROR', '❌', 'Erro durante a extração', { error: error.message });
    process.exit(1);
  }
}

// Executar
main();