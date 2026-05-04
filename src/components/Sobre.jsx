import { useState } from 'react';
import { useTranslation } from '../contexts/LanguageContext.jsx';

const BIBLIOGRAFIA = [
  {
    autor: 'Neamen, D. A.',
    titulo: 'Semiconductor Physics and Devices: Basic Principles',
    edicao: '4ª ed.',
    editora: 'McGraw-Hill, 2012',
    nota: '📌 Referência principal deste projeto',
    amazon: 'https://www.amazon.com.br/Semiconductor-Physics-Devices-Donald-Neamen/dp/0073529583',
    destaque: true,
  },
  {
    autor: 'Pierret, R. F. et al.',
    titulo: 'Modular Series on Solid State Devices',
    edicao: 'vols. I–VI',
    editora: 'Addison-Wesley, 1983–1996',
    nota: '📌 Coleção referência complementar',
    amazon: 'https://www.amazon.com.br/s?k=Modular+Series+on+Solid+State+Devices+Pierret',
    destaque: true,
  },
  {
    autor: 'Dimitrijev, S.',
    titulo: 'Principles of Semiconductor Devices',
    editora: 'Oxford University Press, New York, 2006',
    amazon: 'https://www.amazon.com.br/s?k=Principles+of+Semiconductor+Devices+Dimitrijev',
  },
  {
    autor: 'Kano, K.',
    titulo: 'Semiconductor Devices',
    editora: 'Prentice Hall, Upper Saddle River, NJ, 1998',
    amazon: 'https://www.amazon.com.br/s?k=Semiconductor+Devices+Kano',
  },
  {
    autor: 'Kittel, C.',
    titulo: 'Introduction to Solid State Physics',
    edicao: '7ª ed.',
    editora: 'Springer-Verlag, Berlin, 1993',
    nota: 'Clássico universal de física do estado sólido',
    amazon: 'https://www.amazon.com.br/Introduction-Solid-Physics-Charles-Kittel/dp/047141526X',
  },
  {
    autor: 'McKelvey, J. P.',
    titulo: 'Solid State Physics for Engineering and Materials Science',
    editora: 'Krieger, Malabar, FL, 1993',
    amazon: 'https://www.amazon.com.br/s?k=Solid+State+Physics+Engineering+McKelvey',
  },
  {
    autor: 'Pierret, R. F.',
    titulo: 'Semiconductor Device Fundamentals',
    editora: 'Addison-Wesley, Reading, MA, 1996',
    amazon: 'https://www.amazon.com.br/Semiconductor-Device-Fundamentals-Robert-Pierret/dp/0201543931',
  },
  {
    autor: 'Shockley, W.',
    titulo: 'Electrons and Holes in Semiconductors',
    editora: 'D. Van Nostrand, New York, 1950',
    nota: '🏆 Obra histórica do Nobel de Física 1956',
    amazon: 'https://www.amazon.com.br/s?k=Electrons+and+Holes+in+Semiconductors+Shockley',
  },
  {
    autor: 'Shur, M.',
    titulo: 'Introduction to Electronic Devices',
    editora: 'John Wiley and Sons, New York, 1996',
    amazon: 'https://www.amazon.com.br/s?k=Introduction+to+Electronic+Devices+Shur',
  },
  {
    autor: 'Shur, M.',
    titulo: 'Physics of Semiconductor Devices',
    editora: 'Prentice Hall, Englewood Cliffs, NJ, 1990',
    amazon: 'https://www.amazon.com.br/s?k=Physics+of+Semiconductor+Devices+Shur',
  },
  {
    autor: 'Singh, J.',
    titulo: 'Semiconductor Devices: An Introduction',
    editora: 'McGraw-Hill, New York, 1994',
    amazon: 'https://www.amazon.com.br/s?k=Semiconductor+Devices+An+Introduction+Singh',
  },
  {
    autor: 'Singh, J.',
    titulo: 'Semiconductor Devices: Basic Principles',
    editora: 'John Wiley and Sons, New York, 2001',
    amazon: 'https://www.amazon.com.br/s?k=Semiconductor+Devices+Basic+Principles+Jasprit+Singh',
  },
  {
    autor: 'Streetman, B. G., and Banerjee, S. K.',
    titulo: 'Solid State Electronic Devices',
    edicao: '6ª ed.',
    editora: 'Pearson Prentice Hall, Upper Saddle River, NJ, 2006',
    amazon: 'https://www.amazon.com.br/Solid-State-Electronic-Devices-Streetman/dp/013149726X',
  },
  {
    autor: 'Sze, S. M.',
    titulo: 'Semiconductor Devices: Physics and Technology',
    edicao: '2ª ed.',
    editora: 'John Wiley and Sons, New York, 2001',
    nota: 'Clássico de referência industrial',
    amazon: 'https://www.amazon.com.br/Semiconductor-Devices-Physics-Technology-Simon/dp/0471333727',
  },
  {
    autor: 'Wang, S.',
    titulo: 'Fundamentals of Semiconductor Theory and Device Physics',
    editora: 'Prentice Hall, Englewood Cliffs, NJ, 1988',
    amazon: 'https://www.amazon.com.br/s?k=Fundamentals+of+Semiconductor+Theory+Wang',
  },
  {
    autor: 'Wolfe, C. M., Holonyak Jr., N., and Stillman, G. E.',
    titulo: 'Physical Properties of Semiconductors',
    editora: 'Prentice Hall, Englewood Cliffs, NJ, 1989',
    amazon: 'https://www.amazon.com.br/s?k=Physical+Properties+of+Semiconductors+Wolfe',
  },
];

function AutorTab() {
  const { t } = useTranslation();
  return (
    <div className="sobre-content">
      <h4>{t('about.section.about')}</h4>
      <p>{t('about.project.p1body')}</p>
      <p>{t('about.project.p2body')}</p>

      <h4>{t('about.section.author')}</h4>
      <ul className="sobre-list">
        <li><b>{t('about.authorInfo.name')}</b> Carlos Delfino Carvalho Pinheiro</li>
        <li><b>{t('about.authorInfo.email')}</b> <a href="mailto:consultoria@carlosdelfino.eti.br">consultoria@carlosdelfino.eti.br</a></li>
        <li><b>{t('about.authorInfo.whatsapp')}</b> <a href="https://wa.me/5585985205490" target="_blank" rel="noopener noreferrer">+55 (85) 98520-5490</a></li>
        <li>
          <b>{t('about.authorInfo.community')}</b>{' '}
          <a href="https://chat.whatsapp.com/C3vtPfTwaSlIPmcl8aHS1X" target="_blank" rel="noopener noreferrer">
            {t('about.authorInfo.joinGroup')}
          </a>
        </li>
        <li>
          <b>{t('about.authorInfo.linkedin')}</b>{' '}
          <a href="https://linkedin.com/in/carlosdelfino" target="_blank" rel="noopener noreferrer">
            linkedin.com/in/carlosdelfino
          </a>
        </li>
        <li>
          <b>{t('about.authorInfo.github')}</b>{' '}
          <a href="https://github.com/carlosdelfino" target="_blank" rel="noopener noreferrer">
            github.com/carlosdelfino
          </a>
        </li>
        <li>
          <b>{t('about.authorInfo.twitter')}</b>{' '}
          <a href="https://x.com/carlosdelfinoCP" target="_blank" rel="noopener noreferrer">
            @carlosdelfinoCP
          </a>
        </li>
      </ul>

      <div className="contact-badges">
        <a href="mailto:consultoria@carlosdelfino.eti.br">
          <img src="https://img.shields.io/badge/E--mail-d97706?style=for-the-badge&logo=gmail&logoColor=white" alt="E-mail" />
        </a>
        <a href="https://wa.me/5585985205490" target="_blank" rel="noopener noreferrer">
          <img src="https://img.shields.io/badge/WhatsApp-25D366?style=for-the-badge&logo=whatsapp&logoColor=white" alt="WhatsApp" />
        </a>
        <a href="https://chat.whatsapp.com/C3vtPfTwaSlIPmcl8aHS1X" target="_blank" rel="noopener noreferrer">
          <img src="https://img.shields.io/badge/Comunidade-128C7E?style=for-the-badge&logo=whatsapp&logoColor=white" alt="Comunidade" />
        </a>
        <a href="https://linkedin.com/in/carlosdelfino" target="_blank" rel="noopener noreferrer">
          <img src="https://img.shields.io/badge/LinkedIn-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white" alt="LinkedIn" />
        </a>
        <a href="https://github.com/carlosdelfino" target="_blank" rel="noopener noreferrer">
          <img src="https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white" alt="GitHub" />
        </a>
        <a href="https://x.com/carlosdelfinoCP" target="_blank" rel="noopener noreferrer">
          <img src="https://img.shields.io/badge/X%20%28Twitter%29-000000?style=for-the-badge&logo=x&logoColor=white" alt="X" />
        </a>
      </div>

      <h4>{t('about.section.contribute')}</h4>

      <div className="pr-callout">
        <p style={{ margin: 0 }}>
          <b>{t('about.pr.heading')}</b> {t('about.pr.body')}
        </p>
      </div>

      <div className="pr-buttons">
        <a className="pr-btn primary"
           href="https://github.com/carlosdelfino/fisica-dos-semicondutores/compare"
           target="_blank" rel="noopener noreferrer">
          {t('about.pr.openPR')}
        </a>
        <a className="pr-btn"
           href="https://github.com/carlosdelfino/fisica-dos-semicondutores/blob/main/CONTRIBUTING.md"
           target="_blank" rel="noopener noreferrer">
          {t('about.pr.guide')}
        </a>
        <a className="pr-btn"
           href="https://github.com/carlosdelfino/fisica-dos-semicondutores/issues/new/choose"
           target="_blank" rel="noopener noreferrer">
          {t('about.pr.openIssue')}
        </a>
      </div>

      <h5>{t('about.windsurf.heading')}</h5>
      <p>{t('about.windsurf.p1')}</p>
      <p>{t('about.windsurf.p2')}</p>

      <h5>{t('about.hook.heading')}</h5>
      <p>{t('about.hook.body')}</p>
      <pre className="pr-codeblock">{`chmod +x .git/hooks/pre-commit

git commit -m "docs: ajusta seção X"`}</pre>
      <p>{t('about.hook.useAlways')}</p>

      <h4>{t('about.section.repository')}</h4>
      <p>
        <a href="https://github.com/carlosdelfino/fisica-dos-semicondutores"
           target="_blank" rel="noopener noreferrer">
          github.com/carlosdelfino/fisica-dos-semicondutores
        </a>
      </p>
    </div>
  );
}

function BibliografiaTab() {
  const { t } = useTranslation();
  const destaques = BIBLIOGRAFIA.filter((b) => b.destaque);
  const demais    = BIBLIOGRAFIA.filter((b) => !b.destaque);

  const renderItem = (b, i) => (
    <li key={i} className={`biblio-item ${b.destaque ? 'destaque' : ''}`}>
      <div className="biblio-main">
        <span className="biblio-autor">{b.autor}</span>{' '}
        <span className="biblio-titulo">
          <i>{b.titulo}</i>
          {b.edicao && <span className="biblio-edicao"> ({b.edicao})</span>}
        </span>.{' '}
        <span className="biblio-editora">{b.editora}</span>
        {b.nota && <span className="biblio-nota"> — {b.nota}</span>}
      </div>
      <a href={b.amazon} target="_blank" rel="noopener noreferrer"
         className="biblio-amazon-btn"
         title={t('about.biblio.amazonTitle')}>
        {t('about.biblio.amazonBtn')}
      </a>
    </li>
  );

  return (
    <div className="sobre-content">
      <h4>{t('about.biblio.heading')}</h4>
      <p style={{ color: '#94a3b8', fontSize: 13 }}>
        {t('about.biblio.intro', { count: BIBLIOGRAFIA.length })}
      </p>

      <h5 className="biblio-section-title">{t('about.biblio.mainRefs')}</h5>
      <ol className="biblio-list">
        {destaques.map((b, i) => renderItem(b, i))}
      </ol>

      <h5 className="biblio-section-title">{t('about.biblio.supplementary')}</h5>
      <ol className="biblio-list" start={destaques.length + 1}>
        {demais.map((b, i) => renderItem(b, i))}
      </ol>

      <div style={{ background: 'rgba(2,6,23,0.6)', padding: 12, borderRadius: 8,
                    marginTop: 14, fontSize: 12, color: '#94a3b8' }}>
        <p style={{ margin: 0 }}>
          <b>{t('about.biblio.note')}</b> {t('about.biblio.noteBody')}
        </p>
      </div>
    </div>
  );
}

export default function Sobre() {
  const { t } = useTranslation();
  const [sub, setSub] = useState('autor');

  return (
    <div className="diagram-card">
      <h3>{t('about.title')}</h3>

      <nav className="sub-tabs">
        <button className={`sub-tab ${sub === 'autor' ? 'active' : ''}`}
                onClick={() => setSub('autor')}>
          {t('about.tabs.author')}
        </button>
        <button className={`sub-tab ${sub === 'bibliografia' ? 'active' : ''}`}
                onClick={() => setSub('bibliografia')}>
          {t('about.tabs.bibliography')}
        </button>
      </nav>

      {sub === 'autor' ? <AutorTab /> : <BibliografiaTab />}
    </div>
  );
}
