import { useState, useEffect, useMemo } from 'react';
import { ethers } from 'ethers';
import { useTranslation } from '../contexts/LanguageContext.jsx';

const DEFAULT_ETH_ADDRESS = '0x841B788FFcbAdFabc5E8A2CfcBbeC93179B9ABef';
const SUGGESTED_USD = [1, 5, 10, 15, 20];
const COINGECKO_URL =
  'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd';

export default function WalletConnector({ ethereumAddress = DEFAULT_ETH_ADDRESS }) {
  const { t } = useTranslation();
  const [ethUsd, setEthUsd] = useState(null);
  const [rateError, setRateError] = useState(false);
  const [usdAmount, setUsdAmount] = useState(5);
  const [customUsd, setCustomUsd] = useState('');
  const [isDonating, setIsDonating] = useState(false);
  const [txHash, setTxHash] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let aborted = false;
    fetch(COINGECKO_URL)
      .then((r) => r.json())
      .then((data) => {
        if (aborted) return;
        const price = data?.ethereum?.usd;
        if (typeof price === 'number' && price > 0) {
          setEthUsd(price);
        } else {
          setRateError(true);
        }
      })
      .catch(() => {
        if (!aborted) setRateError(true);
      });
    return () => {
      aborted = true;
    };
  }, []);

  const effectiveUsd = useMemo(() => {
    const custom = parseFloat(customUsd);
    if (!Number.isNaN(custom) && custom > 0) return custom;
    return usdAmount;
  }, [usdAmount, customUsd]);

  const ethAmount = useMemo(() => {
    if (!ethUsd || !effectiveUsd) return null;
    return effectiveUsd / ethUsd;
  }, [ethUsd, effectiveUsd]);

  const handleSelectAmount = (value) => {
    setUsdAmount(value);
    setCustomUsd('');
  };

  const donate = async () => {
    setError(null);
    setTxHash(null);

    if (!ethAmount || ethAmount <= 0) {
      setError(t('support.wallet.errors.invalidAmount'));
      return;
    }
    if (typeof window === 'undefined' || !window.ethereum) {
      setError(t('support.wallet.errors.noWallet'));
      return;
    }

    setIsDonating(true);
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      // Solicita conexão somente no momento da doação; nenhum dado é exibido.
      await provider.send('eth_requestAccounts', []);
      const signer = await provider.getSigner();

      // Arredonda para 6 casas (gwei-like) para evitar precisão excessiva.
      const ethValue = ethAmount.toFixed(6);
      const tx = await signer.sendTransaction({
        to: ethereumAddress,
        value: ethers.parseEther(ethValue),
      });
      setTxHash(tx.hash);
      await tx.wait();
    } catch (err) {
      const msg = err?.shortMessage || err?.message || String(err);
      setError(`${t('support.wallet.errors.txFailed')}: ${msg}`);
    } finally {
      setIsDonating(false);
    }
  };

  const formatHash = (h) => (h ? `${h.slice(0, 8)}…${h.slice(-6)}` : '');

  return (
    <div className="wallet-connector">
      <h4>💰 {t('support.wallet.title')}</h4>
      <p className="wallet-intro">{t('support.wallet.intro')}</p>
      <p className="wallet-privacy">🛡️ {t('support.wallet.privacy')}</p>

      <div className="donation-form">
        <div className="usd-amount-block">
          <label className="usd-label">
            {t('support.wallet.chooseAmount')} (USD)
          </label>
          <div className="usd-buttons">
            {SUGGESTED_USD.map((v) => {
              const active = !customUsd && usdAmount === v;
              return (
                <button
                  key={v}
                  type="button"
                  className={`usd-button${active ? ' active' : ''}`}
                  onClick={() => handleSelectAmount(v)}
                  disabled={isDonating}
                >
                  ${v}
                </button>
              );
            })}
          </div>

          <div className="usd-custom">
            <label htmlFor="custom-usd">{t('support.wallet.customAmount')}:</label>
            <div className="usd-custom-input">
              <span className="usd-prefix">$</span>
              <input
                id="custom-usd"
                type="number"
                min="0"
                step="0.5"
                inputMode="decimal"
                value={customUsd}
                onChange={(e) => setCustomUsd(e.target.value)}
                placeholder={t('support.wallet.customPlaceholder')}
                disabled={isDonating}
              />
            </div>
          </div>
        </div>

        <div className="conversion-info" aria-live="polite">
          {rateError && (
            <span className="rate-error">
              ⚠️ {t('support.wallet.errors.rate')}
            </span>
          )}
          {!rateError && !ethUsd && (
            <span className="rate-loading">⏳ {t('support.wallet.fetchingRate')}</span>
          )}
          {!rateError && ethUsd && (
            <span className="rate-summary">
              ≈ <strong>{ethAmount ? ethAmount.toFixed(6) : '—'} ETH</strong>
              <span className="rate-quote">
                {' '}(1 ETH = ${ethUsd.toLocaleString('en-US', { maximumFractionDigits: 2 })})
              </span>
            </span>
          )}
        </div>

        <button
          className="donate-button"
          onClick={donate}
          disabled={isDonating || !ethAmount}
        >
          {isDonating
            ? t('support.wallet.processing')
            : `${t('support.wallet.donateButton')} · $${effectiveUsd}`}
        </button>

        {txHash && (
          <p className="tx-info">
            ✅ {t('support.wallet.transactionSent')}:{' '}
            <a
              href={`https://etherscan.io/tx/${txHash}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {formatHash(txHash)}
            </a>
          </p>
        )}

        {error && <p className="wallet-error">❌ {error}</p>}
      </div>
    </div>
  );
}
