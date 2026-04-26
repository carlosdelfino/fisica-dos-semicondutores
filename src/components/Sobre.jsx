import { useState } from 'react';

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
  return (
    <div className="sobre-content">
      <h4>Sobre o projeto</h4>
      <p>
        Este projeto visa <b>facilitar o aprendizado da Física dos Semicondutores</b> e
        será continuamente <b>ampliado conforme meu próprio avanço nos estudos</b>.
        Foi construído usando <b>Claude Opus 4.7</b> como par de programação, com base
        nas leituras que tenho feito do livro <i>Semiconductor Physics and Devices</i> de
        <b> Donald A. Neamen</b>, complementadas pela coleção
        <i> Modular Series on Solid State Devices</i> (Robert F. Pierret et al.).
      </p>

      <h4>Autor</h4>
      <ul className="sobre-list">
        <li><b>Nome:</b> Carlos Delfino Carvalho Pinheiro</li>
        <li><b>E-mail:</b> <a href="mailto:consultoria@carlosdelfino.eti.br">consultoria@carlosdelfino.eti.br</a></li>
        <li><b>WhatsApp:</b> <a href="https://wa.me/5585985205490" target="_blank" rel="noopener noreferrer">+55 (85) 98520-5490</a></li>
        <li>
          <b>Comunidade WhatsApp — Física dos Semicondutores:</b>{' '}
          <a href="https://chat.whatsapp.com/C3vtPfTwaSlIPmcl8aHS1X" target="_blank" rel="noopener noreferrer">
            Entrar no grupo
          </a>
        </li>
        <li>
          <b>LinkedIn:</b>{' '}
          <a href="https://linkedin.com/in/carlosdelfino" target="_blank" rel="noopener noreferrer">
            linkedin.com/in/carlosdelfino
          </a>
        </li>
        <li>
          <b>GitHub:</b>{' '}
          <a href="https://github.com/carlosdelfino" target="_blank" rel="noopener noreferrer">
            github.com/carlosdelfino
          </a>
        </li>
        <li>
          <b>X (Twitter):</b>{' '}
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

      <h4>Contribua — críticas e sugestões via Pull Request</h4>

      <div className="pr-callout">
        <p style={{ margin: 0 }}>
          <b>🎯 Mensagem essencial:</b> a <i>melhor forma</i> de criticar, sugerir,
          corrigir ou aprimorar este projeto é abrindo um <b>Pull Request</b>. Sua
          contribuição é <b>sempre bem-vinda</b>, seja uma vírgula numa explicação ou
          um capítulo inteiro de novas visualizações. Mesmo que a PR não seja aceita
          exatamente como está, ela abre uma discussão valiosa que costuma evoluir
          para algo incorporado ao projeto.
        </p>
      </div>

      <div className="pr-buttons">
        <a className="pr-btn primary"
           href="https://github.com/carlosdelfino/fisica-dos-semicondutores/compare"
           target="_blank" rel="noopener noreferrer">
          🚀 Abrir Pull Request
        </a>
        <a className="pr-btn"
           href="https://github.com/carlosdelfino/fisica-dos-semicondutores/blob/main/CONTRIBUTING.md"
           target="_blank" rel="noopener noreferrer">
          📖 Guia de Contribuição (CONTRIBUTING.md)
        </a>
        <a className="pr-btn"
           href="https://github.com/carlosdelfino/fisica-dos-semicondutores/issues/new/choose"
           target="_blank" rel="noopener noreferrer">
          🐛 Abrir Issue
        </a>
      </div>

      <h5>🌊 Use o Windsurf — o projeto já está preparado</h5>
      <p>
        Recomendo fortemente o{' '}
        <a href="https://windsurf.com" target="_blank" rel="noopener noreferrer">
          <b>Windsurf</b>
        </a>{' '}
        como editor para contribuir. O projeto contém <b>regras de codificação</b> em
        <code> .windsurf/rules/</code> que o editor aplica automaticamente: padrão de
        logging (PDCL), formatação de markdown, estrutura de componentes — tudo já
        configurado. Há também <b>workflows pré-prontos</b> em
        <code> .windsurf/workflows/</code> (ex.: <code>/pdcl</code>) que automatizam
        tarefas comuns. O agente <b>Cascade</b> entende a metodologia <b>PDCL</b>
        (Plan, Do, Check, Loop) adotada aqui e orienta naturalmente novas
        implementações dentro desse fluxo.
      </p>
      <p>
        Se preferir VS Code, Cursor ou outro editor, tudo funciona — apenas observe
        manualmente as regras descritas em <code>.windsurf/rules/</code>.
      </p>

      <h5>⚙️ Hook <code>pre-commit</code> — documentação padronizada automaticamente</h5>
      <p>
        Há um <b>script automático</b> em{' '}
        <code>scripts/markdown_history_manager.py</code>, ativado por{' '}
        <code>.git/hooks/pre-commit</code>. A cada commit que envolva arquivos{' '}
        <code>.md</code>, ele detecta autor e data, e adiciona uma entrada no{' '}
        <i>Histórico de Alterações</i> seguindo o padrão definido em{' '}
        <code>.windsurf/rules/documentacao.md</code>.
      </p>
      <pre className="pr-codeblock">{`# garantir execução
chmod +x .git/hooks/pre-commit

git commit -m "docs: ajusta seção X"
# 🚀 Iniciando atualização de histórico de arquivos markdown...
# ✅ Histórico atualizado: README.md`}</pre>
      <p>
        Use sempre — é o que mantém a documentação rastreável e padronizada.
      </p>

      <h4>Repositório</h4>
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
         title="Comprar/buscar na Amazon">
        🛒 Amazon
      </a>
    </li>
  );

  return (
    <div className="sobre-content">
      <h4>Bibliografia recomendada</h4>
      <p style={{ color: '#94a3b8', fontSize: 13 }}>
        Lista organizada com {BIBLIOGRAFIA.length} títulos. Os dois primeiros são as
        referências principais usadas na construção deste sistema; os demais
        complementam a teoria de bandas, dispositivos e física do estado sólido.
        Cada item tem link para a Amazon (busca ou produto direto).
      </p>

      <h5 className="biblio-section-title">📌 Referências principais do projeto</h5>
      <ol className="biblio-list">
        {destaques.map((b, i) => renderItem(b, i))}
      </ol>

      <h5 className="biblio-section-title">📚 Bibliografia complementar</h5>
      <ol className="biblio-list" start={destaques.length + 1}>
        {demais.map((b, i) => renderItem(b, i))}
      </ol>

      <div style={{ background: 'rgba(2,6,23,0.6)', padding: 12, borderRadius: 8,
                    marginTop: 14, fontSize: 12, color: '#94a3b8' }}>
        <p style={{ margin: 0 }}>
          <b>Nota:</b> alguns links direcionam para uma página de produto específica
          quando disponível na Amazon Brasil; outros levam à busca pelo título/autor,
          retornando a edição mais próxima disponível. Edições antigas podem estar
          esgotadas — busque também sebos virtuais, bibliotecas universitárias e
          plataformas como Z-Library, IEEE Xplore e Google Books.
        </p>
      </div>
    </div>
  );
}

export default function Sobre() {
  const [sub, setSub] = useState('autor');

  return (
    <div className="diagram-card">
      <h3>👤 Sobre</h3>

      <nav className="sub-tabs">
        <button className={`sub-tab ${sub === 'autor' ? 'active' : ''}`}
                onClick={() => setSub('autor')}>
          👤 Autor
        </button>
        <button className={`sub-tab ${sub === 'bibliografia' ? 'active' : ''}`}
                onClick={() => setSub('bibliografia')}>
          📚 Bibliografia
        </button>
      </nav>

      {sub === 'autor' ? <AutorTab /> : <BibliografiaTab />}
    </div>
  );
}
