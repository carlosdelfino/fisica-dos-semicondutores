import { useState } from 'react';
import { useTranslation } from '../contexts/LanguageContext.jsx';
import WalletConnector from './WalletConnector.jsx';

const CRYPTO_ADDRESSES = {
  ethereum: '0x841B788FFcbAdFabc5E8A2CfcBbeC93179B9ABef',
  bitcoin: 'bc1q2gth8nf5aqux0lmxlqyzhwkefxm2cwpr354edu',
  solana: 'DMpnSvYmUfjrEkc5ZaFFEJTqKhyoATcAHBGgWZzucf9j',
  tron: 'TGpwRLA3eBh9P8nq3ccmFwRbWbcaynbYfj',
};

const CRYPTO_META = [
  {
    id: 'ethereum',
    name: 'Ethereum (ETH)',
    icon: 'Ξ',
    explorer: (a) => `https://etherscan.io/address/${a}`,
  },
  {
    id: 'bitcoin',
    name: 'Bitcoin (BTC)',
    icon: '₿',
    explorer: (a) => `https://blockstream.info/address/${a}`,
  },
  {
    id: 'solana',
    name: 'Solana (SOL)',
    icon: '◎',
    explorer: (a) => `https://explorer.solana.com/address/${a}`,
  },
  {
    id: 'tron',
    name: 'Tron (TRX)',
    icon: '◈',
    explorer: (a) => `https://tronscan.org/#/address/${a}`,
  },
];

const PIX_KEY = 'nubank@carlosdelfino.eti.br';

// QR Code SVG para PIX (carregado do arquivo externo)
function PixQRCode() {
  return (
    <img 
      src="/images/pix.svg" 
      alt="QR Code PIX" 
      className="pix-qr-code"
      width="200"
      height="200"
    />
  );
}

function AboutTab() {
  const { t } = useTranslation();

  return (
    <div className="support-content">
      <h4>{t('support.about.title')}</h4>
      <p>{t('support.about.p1')}</p>
      <p>{t('support.about.p2')}</p>
      <p>{t('support.about.p3')}</p>

      <div className="support-highlight">
        <p>
          <strong>💡 {t('support.about.highlight')}</strong>
        </p>
      </div>

      <h4>{t('support.about.howToHelp')}</h4>
      <ul className="support-list">
        <li>{t('support.about.codeContribution')}</li>
        <li>{t('support.about.documentation')}</li>
        <li>{t('support.about.translation')}</li>
        <li>{t('support.about.reporting')}</li>
        <li>{t('support.about.financial')}</li>
      </ul>
    </div>
  );
}

function DonationTab() {
  const { t } = useTranslation();
  const [copiedAddress, setCopiedAddress] = useState(null);

  const copyToClipboard = (address, type) => {
    navigator.clipboard.writeText(address);
    setCopiedAddress(type);
    setTimeout(() => setCopiedAddress(null), 2000);
  };

  return (
    <div className="support-content">
      <h4>{t('support.donation.title')}</h4>
      <p>{t('support.donation.intro')}</p>

      {/* PIX Section */}
      <div className="donation-section pix-section">
        <h5>📱 PIX</h5>
        <div className="pix-container">
          <div className="pix-qr-wrapper">
            <PixQRCode />
            <p className="pix-label">{t('support.donation.pixScan')}</p>
          </div>
          <div className="pix-info">
            <p className="pix-key-label">{t('support.donation.pixKey')}:</p>
            <div className="pix-key-wrapper">
              <code className="pix-key">{PIX_KEY}</code>
              <button
                className="copy-button"
                onClick={() => copyToClipboard(PIX_KEY, 'pix')}
                title={t('support.donation.copy')}
              >
                {copiedAddress === 'pix' ? '✓' : '📋'}
              </button>
            </div>
            <p className="pix-note">{t('support.donation.pixNote')}</p>
          </div>
        </div>
      </div>

      {/* Cryptocurrency Section */}
      <div className="donation-section crypto-section">
        <h5>₿ {t('support.donation.crypto')}</h5>

        <div className="crypto-grid">
          {CRYPTO_META.map(({ id, name, icon, explorer }) => {
            const address = CRYPTO_ADDRESSES[id];
            return (
              <div key={id} className="crypto-card">
                <div className="crypto-header">
                  <span className="crypto-icon">{icon}</span>
                  <span className="crypto-name">{name}</span>
                </div>
                <div className="crypto-address-wrapper">
                  <code className="crypto-address">{address}</code>
                  <button
                    className="copy-button"
                    onClick={() => copyToClipboard(address, id)}
                    title={t('support.donation.copy')}
                  >
                    {copiedAddress === id ? '✓' : '📋'}
                  </button>
                </div>
                <a
                  href={explorer(address)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="crypto-explorer"
                >
                  {t('support.donation.viewExplorer')} →
                </a>
              </div>
            );
          })}
        </div>
      </div>

      {/* Web3 Wallet Donation */}
      <WalletConnector ethereumAddress={CRYPTO_ADDRESSES.ethereum} />

      <div className="donation-note">
        <p>
          <strong>⚠️ {t('support.donation.disclaimer')}</strong>
        </p>
        <p>{t('support.donation.disclaimerText')}</p>
      </div>
    </div>
  );
}

export default function SupportPanel() {
  const { t } = useTranslation();
  const [subTab, setSubTab] = useState('about');

  return (
    <div className="diagram-card support-panel">
      <h3>{t('support.title')}</h3>

      <nav className="sub-tabs">
        <button
          className={`sub-tab ${subTab === 'about' ? 'active' : ''}`}
          onClick={() => setSubTab('about')}
        >
          {t('support.tabs.about')}
        </button>
        <button
          className={`sub-tab ${subTab === 'donation' ? 'active' : ''}`}
          onClick={() => setSubTab('donation')}
        >
          {t('support.tabs.donation')}
        </button>
      </nav>

      {subTab === 'about' ? <AboutTab /> : <DonationTab />}
    </div>
  );
}
