import { createContext, useContext, useState, useEffect, useMemo } from 'react';
import pt from '../locales/pt.js';
import en from '../locales/en.js';
import ar from '../locales/ar.js';
import hi from '../locales/hi.js';
import zh from '../locales/zh.js';

const translations = { pt, en, ar, hi, zh };
const DEFAULT_LANGUAGE = 'pt';

// Lê o idioma da query string (?lang=xx) se presente
function getLanguageFromURL() {
  if (typeof window === 'undefined') return null;
  try {
    const params = new URLSearchParams(window.location.search);
    const lang = params.get('lang');
    if (lang && translations[lang]) return lang;
  } catch (e) { /* noop */ }
  return null;
}

// Atualiza a query string ?lang=xx sem recarregar a página, preservando hash
function updateURLLanguage(lang) {
  if (typeof window === 'undefined') return;
  try {
    const url = new URL(window.location.href);
    if (lang === DEFAULT_LANGUAGE) {
      url.searchParams.delete('lang');
    } else {
      url.searchParams.set('lang', lang);
    }
    window.history.replaceState({}, '', url.toString());
  } catch (e) { /* noop */ }
}

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
    // Prioridade: 1) query string (?lang=xx), 2) localStorage, 3) navegador
    const fromURL = getLanguageFromURL();
    if (fromURL) return fromURL;
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
    // Sincroniza a URL para que buscadores e usuários possam compartilhar o idioma
    updateURLLanguage(language);
  }, [language]);

  // Reage a mudanças de query string via navegação (botão voltar/avançar)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handler = () => {
      const fromURL = getLanguageFromURL();
      if (fromURL && fromURL !== language) setLanguage(fromURL);
    };
    window.addEventListener('popstate', handler);
    return () => window.removeEventListener('popstate', handler);
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
