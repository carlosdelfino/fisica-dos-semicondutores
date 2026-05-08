#!/usr/bin/env node

import dotenv from 'dotenv';
import OpenAI from 'openai';
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

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_MODEL = process.env.OPENAI_MODEL && process.env.OPENAI_MODEL !== 'GPT-5.4-mini' 
  ? process.env.OPENAI_MODEL 
  : 'gpt-4o-mini';

if (!OPENAI_API_KEY) {
  log('ERROR', '❌', 'OPENAI_API_KEY não encontrada no arquivo .env');
  process.exit(1);
}

// Inicializar cliente OpenAI
const openai = new OpenAI({
  apiKey: OPENAI_API_KEY
});

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

// Função para enriquecer uma fórmula com OpenAI
async function enrichFormula(formula, context = '') {
  log('INFO', '🔍', 'Enriquecendo fórmula', { formula });
  
  try {
    const response = await openai.chat.completions.create({
      model: OPENAI_MODEL,
      messages: [
        {
          role: 'system',
          content: `Você é um especialista em física de semicondutores e educação científica.

Sua tarefa é analisar fórmulas matemáticas e físicas e fornecer informações didáticas.

Para cada fórmula, você deve:
1. Descrever o que a fórmula representa em linguagem clara e acessível
2. Converter a fórmula para sua forma genérica (remover valores numéricos específicos do exercício)
3. Explicar os conceitos físicos envolvidos na fórmula
4. Descrever cada símbolo usado na fórmula (SEM usar notação matemática, apenas descrição textual)

IMPORTANTE:
- A fórmula genérica deve estar em formato KaTeX/LaTeX compatível
- As descrições de símbolos devem ser puramente textuais, sem usar fórmulas matemáticas
- Mantenha a fórmula original separada da versão genérica
- Use linguagem didática e educacional

Retorne o resultado em formato JSON com a seguinte estrutura:
{
  "originalFormula": "fórmula original em KaTeX",
  "genericFormula": "fórmula genérica em KaTeX (sem valores numéricos)",
  "description": "descrição didática do que a fórmula representa",
  "concepts": ["lista de conceitos físicos envolvidos"],
  "symbols": [
    {
      "symbol": "símbolo",
      "description": "descrição textual do que o símbolo representa"
    }
  ]
}`
        },
        {
          role: 'user',
          content: `Analise a seguinte fórmula${context ? ` do contexto: ${context}` : ''}:

Fórmula: ${formula}

Forneça a análise didática completa seguindo as instruções.`
        }
      ],
      max_tokens: 2000,
      temperature: 0.3
    });
    
    const content = response.choices[0].message.content;
    log('INFO', '✅', 'Enriquecimento concluído', { tokensUsed: response.usage?.total_tokens });
    
    // Tentar extrair JSON da resposta
    let jsonData;
    try {
      const cleanContent = content.replace(/```json\n?|\n?```/g, '').trim();
      jsonData = JSON.parse(cleanContent);
    } catch (parseError) {
      log('WARN', '⚠️', 'Não foi possível fazer parse do JSON', { error: parseError.message });
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
    log('ERROR', '❌', 'Erro ao enriquecer fórmula', { error: error.message });
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
    log('INFO', '✅', 'Todas as imagens já existem', { count: totalPages });
    // Retornar todas as imagens em ordem
    const allImages = [];
    for (let i = 1; i <= totalPages; i++) {
      allImages.push(path.join(imageDir, `${prefix}-${String(i).padStart(3, '0')}.png`));
    }
    return allImages;
  }
  
  log('INFO', '🚀', 'Extraindo páginas faltantes', { missingPages, count: missingPages.length });
  
  // Extrair apenas as páginas faltantes
  await extractMissingPages(pdfPath, imageDir, prefix, missingPages);
  
  // Retornar todas as imagens em ordem
  const allImages = [];
  for (let i = 1; i <= totalPages; i++) {
    allImages.push(path.join(imageDir, `${prefix}-${String(i).padStart(3, '0')}.png`));
  }
  
  log('INFO', '🏁', 'Extração de imagens concluída', { totalPages: allImages.length });
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
      log('WARN', '⚠️', 'pdfinfo stderr', { error: data.toString() });
    });
    
    pdfinfo.on('close', (code) => {
      if (code !== 0) {
        log('WARN', '⚠️', 'pdfinfo falhou, assumindo valor padrão', { code });
        resolve(267); // Valor padrão baseado no log anterior
        return;
      }
      
      const match = output.match(/Pages:\s*(\d+)/);
      const totalPages = match ? parseInt(match[1]) : 267;
      resolve(totalPages);
    });
    
    pdfinfo.on('error', (error) => {
      log('WARN', '⚠️', 'Erro ao executar pdfinfo, assumindo valor padrão', { error: error.message });
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
      log('INFO', 'ℹ️', 'pdftoppm output', { output: data.toString() });
    });
    
    pdftoppm.stderr.on('data', (data) => {
      log('WARN', '⚠️', 'pdftoppm stderr', { error: data.toString() });
    });
    
    pdftoppm.on('close', (code) => {
      if (code !== 0) {
        log('ERROR', '❌', 'pdftoppm falhou', { code });
        reject(new Error(`pdftoppm exited with code ${code}`));
        return;
      }
      
      log('INFO', '✅', 'Páginas extraídas com sucesso', { pages: pageNumbers });
      resolve();
    });
    
    pdftoppm.on('error', (error) => {
      log('ERROR', '❌', 'Erro ao executar pdftoppm', { error: error.message });
      reject(error);
    });
  });
}

// Função para analisar imagem com OpenAI Vision
async function analyzeImage(imagePath, pageNumber) {
  log('INFO', '🔍', 'Analisando página com OpenAI Vision', { pageNumber, imagePath });
  
  try {
    const imageData = fs.readFileSync(imagePath);
    const base64Image = imageData.toString('base64');
    
    const response = await openai.chat.completions.create({
      model: OPENAI_MODEL,
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
NÃO inclua explicações, comentários ou texto fora do JSON.`
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
    
    const content = response.choices[0].message.content;
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
  
  // Atualizar arquivo de metadados (sem timestamp)
  const metadataFilename = path.join(outputDir, `${baseFilename}-metadata.json`);
  fs.writeFileSync(metadataFilename, JSON.stringify({
    processedPages: Array.from(processedPages),
    lastUpdated: new Date().toISOString()
  }, null, 2));
  log('INFO', '💾', 'Metadados atualizados', { pageNumber, filename: metadataFilename });
  
  // Salvar dados do capítulo (sem timestamp)
  const chapterFilename = path.join(outputDir, `${baseFilename}-${safeChapterName}.json`);
  
  // Verificar se existe arquivo anterior do capítulo para mesclar
  let chapterData = { chapter, section: data.section || 'unknown', questions: [], answers: [], standaloneFormulas: [] };
  
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
  
  // Salvar arquivo atualizado
  fs.writeFileSync(chapterFilename, JSON.stringify(chapterData, null, 2));
  log('INFO', '✅', 'Capítulo salvo incrementalmente', { chapter, filename: chapterFilename });
}

// Função para salvar resultados
function saveResults(groupedData, pdfPath, processedPages) {
  log('INFO', '💾', 'Salvando resultados agrupados por capítulo');
  
  const outputDir = getOutputDir(pdfPath);
  const baseFilename = path.basename(pdfPath, path.extname(pdfPath));
  
  // Salvar arquivo de metadados de páginas processadas (separado dos dados, sem timestamp)
  const metadataFilename = path.join(outputDir, `${baseFilename}-metadata.json`);
  fs.writeFileSync(metadataFilename, JSON.stringify({
    processedPages: Array.from(processedPages),
    lastUpdated: new Date().toISOString()
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
    
    fs.writeFileSync(outputFilename, JSON.stringify(mergedData, null, 2));
    log('INFO', '✅', 'Arquivo salvo', { chapter: chapterName, filename: outputFilename });
  });
  
  // Salvar índice geral (sem timestamp)
  const indexFilename = path.join(outputDir, `${baseFilename}-index.json`);
  const indexData = {
    ...groupedData,
    processedPages: Array.from(processedPages),
    lastUpdated: new Date().toISOString()
  };
  fs.writeFileSync(indexFilename, JSON.stringify(indexData, null, 2));
  log('INFO', '✅', 'Índice geral salvo', { filename: indexFilename });
}

// Função principal
async function main() {
  log('INFO', '🚀', 'Iniciando extração de conteúdo de PDF');
  
  // Verificar argumento de linha de comando
  const args = process.argv.slice(2);
  if (args.length === 0) {
    log('ERROR', '❌', 'Uso: node extract-pdf-content.js <caminho-do-pdf>');
    process.exit(1);
  }
  
  const pdfPath = args[0];
  
  // Verificar se o arquivo existe
  if (!fs.existsSync(pdfPath)) {
    log('ERROR', '❌', 'Arquivo PDF não encontrado', { pdfPath });
    process.exit(1);
  }
  
  log('INFO', 'ℹ️', 'Configurações', { 
    pdfPath, 
    model: OPENAI_MODEL,
    outputDir: getOutputDir(pdfPath) 
  });
  
  // Variáveis para estado parcial (para salvamento em caso de interrupção)
  let extractedData = [];
  let newlyProcessedPages = new Set();
  
  // Handler para interrupção (Ctrl+C)
  const handleInterrupt = () => {
    log('WARN', '⚠️', 'Processo interrompido pelo usuário');
    if (extractedData.length > 0) {
      log('INFO', '💾', 'Salvando dados parciais antes de sair');
      try {
        const groupedData = groupByChapter(extractedData);
        saveResults(groupedData, pdfPath, newlyProcessedPages);
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
    
    // Verificar quais páginas já foram processadas
    const processedPages = getProcessedPages(pdfPath);
    log('INFO', 'ℹ️', 'Páginas já processadas', { count: processedPages.size });
    
    // Analisar cada imagem (pular páginas já processadas)
    
    for (let i = 0; i < images.length; i++) {
      const pageNumber = i + 1;
      
      if (processedPages.has(pageNumber)) {
        log('INFO', '⏭️', `Página ${pageNumber} já processada, pulando`);
        continue;
      }
      
      log('INFO', '🔄', `Processando página ${pageNumber}/${images.length}`);
      const data = await analyzeImage(images[i], pageNumber);
      
      // Enriquecer fórmulas extraídas
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
      // Carregar dados existentes do índice
      const indexFile = fs.readdirSync(OUTPUT_DIR)
        .find(f => f.includes('index') && f.startsWith(path.basename(pdfPath, path.extname(pdfPath))));
      
      if (indexFile) {
        const indexPath = path.join(OUTPUT_DIR, indexFile);
        const existingData = JSON.parse(fs.readFileSync(indexPath, 'utf-8'));
        log('INFO', '🏁', 'Usando dados existentes', { chapters: Object.keys(existingData).length });
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
    saveResults(groupedData, pdfPath, newlyProcessedPages);
    
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
