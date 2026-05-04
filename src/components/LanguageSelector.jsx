import { useTranslation } from '../contexts/LanguageContext.jsx';

export default function LanguageSelector() {
  const { language, changeLanguage, availableLanguages } = useTranslation();

  return (
    <div className="language-selector">
      <div className="language-flags">
        {availableLanguages.map((lang) => (
          <button
            key={lang.code}
            className={`language-flag ${language === lang.code ? 'active' : ''}`}
            onClick={() => changeLanguage(lang.code)}
            title={lang.nativeName}
            aria-label={`${lang.nativeName} (${lang.name})`}
          >
            <span className="flag-emoji">{lang.flag}</span>
            <span className="language-code">{lang.code.toUpperCase()}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
