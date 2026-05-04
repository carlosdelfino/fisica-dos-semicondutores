import { createContext, useContext, useState, useEffect, useMemo } from 'react';
import pt from '../locales/pt.js';
import en from '../locales/en.js';
import ar from '../locales/ar.js';
import hi from '../locales/hi.js';
import zh from '../locales/zh.js';

const translations = { pt, en, ar, hi, zh };
const DEFAULT_LANGUAGE = 'pt';

const LanguageContext = createContext(null);

export function useTranslation() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return context;
}

// Resolve chave "a.b.c" em objeto de tradução com fallback para PT
function resolveKey(obj, keys) {
  let value = obj;
  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k];
    } else {
      return undefined;
    }
  }
  return value;
}

function interpolate(template, vars) {
  if (!vars || typeof template !== 'string') return template;
  return template.replace(/\{(\w+)\}/g, (_, name) =>
    vars[name] !== undefined ? String(vars[name]) : `{${name}}`
  );
}

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    try {
      const saved = localStorage.getItem('language');
      if (saved && translations[saved]) return saved;
      const browser = (navigator.language || '').split('-')[0];
      if (translations[browser]) return browser;
    } catch (e) { /* noop */ }
    return DEFAULT_LANGUAGE;
  });

  useEffect(() => {
    try { localStorage.setItem('language', language); } catch (e) { /* noop */ }
    const meta = translations[language]?.meta || translations[DEFAULT_LANGUAGE].meta;
    // Atualiza atributos do documento para suporte a RTL e idioma
    document.documentElement.lang = meta.code;
    document.documentElement.dir = meta.dir || 'ltr';
  }, [language]);

  const t = useMemo(() => {
    return (key, vars) => {
      const keys = String(key).split('.');
      const primary = resolveKey(translations[language], keys);
      if (primary !== undefined) return interpolate(primary, vars);
      // Fallback para português
      if (language !== DEFAULT_LANGUAGE) {
        const fallback = resolveKey(translations[DEFAULT_LANGUAGE], keys);
        if (fallback !== undefined) return interpolate(fallback, vars);
      }
      return key;
    };
  }, [language]);

  const changeLanguage = (newLanguage) => {
    if (translations[newLanguage]) setLanguage(newLanguage);
  };

  const meta = translations[language]?.meta || translations[DEFAULT_LANGUAGE].meta;

  const value = {
    language,
    changeLanguage,
    t,
    dir: meta.dir,
    availableLanguages: Object.keys(translations).map((code) => ({
      code,
      ...translations[code].meta
    }))
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}
