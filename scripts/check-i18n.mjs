// Levantamento de chaves de tradução faltantes em relação ao PT (referência)
import pt from '../src/locales/pt.js';
import en from '../src/locales/en.js';
import ar from '../src/locales/ar.js';
import hi from '../src/locales/hi.js';
import zh from '../src/locales/zh.js';

const langs = { en, ar, hi, zh };

function flatten(obj, prefix = '', out = {}) {
  for (const [k, v] of Object.entries(obj)) {
    const key = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === 'object' && !Array.isArray(v)) {
      flatten(v, key, out);
    } else {
      out[key] = v;
    }
  }
  return out;
}

const ptFlat = flatten(pt);
const ptKeys = Object.keys(ptFlat);

// Permite filtrar por prefixo: node check-i18n.mjs about
const prefix = process.argv[2] || '';
const scopeKeys = prefix ? ptKeys.filter((k) => k.startsWith(prefix)) : ptKeys;

console.log(`PT total de chaves: ${ptKeys.length}${prefix ? ` (escopo "${prefix}": ${scopeKeys.length})` : ''}\n`);

for (const [code, data] of Object.entries(langs)) {
  const flat = flatten(data);
  const missing = scopeKeys.filter((k) => !(k in flat));
  // chaves presentes mas idênticas ao PT (provável não traduzido) - ignora meta e chaves técnicas
  const identical = scopeKeys.filter(
    (k) => k in flat && typeof flat[k] === 'string' && typeof ptFlat[k] === 'string' &&
      flat[k] === ptFlat[k] && flat[k].trim().length > 2 && !k.startsWith('meta')
  );
  console.log(`=== ${code.toUpperCase()} ===`);
  console.log(`  Faltando: ${missing.length}`);
  if (missing.length) console.log('  - ' + missing.join('\n  - '));
  console.log(`  Idênticas ao PT (suspeitas): ${identical.length}`);
  if (prefix && identical.length) console.log('  ~ ' + identical.join('\n  ~ '));
  console.log('');
}
