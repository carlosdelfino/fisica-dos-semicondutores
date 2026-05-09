import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useTranslation } from '../contexts/LanguageContext.jsx';

const DONATION_ADDRESSES = {
  ethereum: '0xcEF96AEee7322F10e3024cbCb7b3b9388d965392',
  bitcoin: 'bc1q34ak5nt0wtsdaqgutw308j9lzq4cx8luh3f4r7',
  solana: 'DZPyD4WyhQdAqAvx2eAmXzX4n53VZwVWXjofEb12RWxe',
};

const SUGGESTED_AMOUNTS = {
  ethereum: ['0.01', '0.05', '0.1', '0.5', '1.0'],
  bitcoin: ['0.0001', '0.0005', '0.001', '0.005', '0.01'],
};

export default function WalletConnector() {
  const { t } = useTranslation();
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [selectedCrypto, setSelectedCrypto] = useState('ethereum');
  const [donationAmount, setDonationAmount] = useState('');
  const [isDonating, setIsDonating] = useState(false);
  const [txHash, setTxHash] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    checkIfWalletConnected();
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);
    }
    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, []);

  const checkIfWalletConnected = async () => {
    try {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          const provider = new ethers.BrowserProvider(window.ethereum);
          setProvider(provider);
          const network = await provider.getNetwork();
          setChainId(Number(network.chainId));
        }
      }
    } catch (error) {
      console.error('Error checking wallet connection:', error);
    }
  };

  const handleAccountsChanged = (accounts) => {
    if (accounts.length === 0) {
      setAccount(null);
      setProvider(null);
      setChainId(null);
    } else {
      setAccount(accounts[0]);
    }
  };

  const handleChainChanged = () => {
    window.location.reload();
  };

  const connectWallet = async () => {
    setIsConnecting(true);
    setError(null);
    try {
      if (!window.ethereum) {
        setError('MetaMask não encontrado. Por favor, instale o MetaMask.');
        setIsConnecting(false);
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send('eth_requestAccounts', []);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      const network = await provider.getNetwork();

      setAccount(address);
      setProvider(provider);
      setChainId(Number(network.chainId));
    } catch (error) {
      setError('Erro ao conectar carteira: ' + error.message);
      console.error('Error connecting wallet:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
    setProvider(null);
    setChainId(null);
    setTxHash(null);
    setError(null);
  };

  const switchToEthereum = async () => {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x1' }], // Ethereum Mainnet
      });
    } catch (switchError) {
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: '0x1',
                chainName: 'Ethereum Mainnet',
                nativeCurrency: {
                  name: 'ETH',
                  symbol: 'ETH',
                  decimals: 18,
                },
                rpcUrls: ['https://eth.llamarpc.com'],
                blockExplorerUrls: ['https://etherscan.io'],
              },
            ],
          });
        } catch (addError) {
          setError('Erro ao adicionar rede Ethereum: ' + addError.message);
        }
      }
      setError('Erro ao mudar para rede Ethereum: ' + switchError.message);
    }
  };

  const donate = async () => {
    if (!provider || !account) {
      setError('Por favor, conecte sua carteira primeiro.');
      return;
    }

    if (!donationAmount || parseFloat(donationAmount) <= 0) {
      setError('Por favor, insira um valor válido para doação.');
      return;
    }

    setIsDonating(true);
    setError(null);
    setTxHash(null);

    try {
      const signer = await provider.getSigner();
      const amountInWei = ethers.parseEther(donationAmount);

      const tx = await signer.sendTransaction({
        to: DONATION_ADDRESSES.ethereum,
        value: amountInWei,
      });

      setTxHash(tx.hash);

      await tx.wait();
      alert(`Doação realizada com sucesso! Hash: ${tx.hash}`);
      setDonationAmount('');
    } catch (error) {
      setError('Erro ao realizar doação: ' + error.message);
      console.error('Error donating:', error);
    } finally {
      setIsDonating(false);
    }
  };

  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  if (!account) {
    return (
      <div className="wallet-connector">
        <h4>💰 {t('support.wallet.title')}</h4>
        <p>{t('support.wallet.connectDescription')}</p>
        <button 
          className="connect-wallet-button"
          onClick={connectWallet}
          disabled={isConnecting}
        >
          {isConnecting ? t('support.wallet.connecting') : t('support.wallet.connectButton')}
        </button>
        {error && <p className="wallet-error">{error}</p>}
      </div>
    );
  }

  return (
    <div className="wallet-connector">
      <h4>💰 {t('support.wallet.title')}</h4>
      
      <div className="wallet-info">
        <p><strong>{t('support.wallet.wallet')}:</strong> {formatAddress(account)}</p>
        <p><strong>{t('support.wallet.network')}:</strong> {chainId === 1 ? t('support.wallet.ethereumMainnet') : chainId === 11155111 ? t('support.wallet.sepoliaTestnet') : `${t('support.wallet.chainId')}: ${chainId}`}</p>
        {chainId !== 1 && (
          <button className="switch-network-button" onClick={switchToEthereum}>
            {t('support.wallet.switchNetwork')}
          </button>
        )}
      </div>

      <div className="donation-form">
        <div className="crypto-selector">
          <label htmlFor="crypto-select">{t('support.wallet.crypto')}:</label>
          <select
            id="crypto-select"
            value={selectedCrypto}
            onChange={(e) => setSelectedCrypto(e.target.value)}
            disabled={isDonating}
          >
            <option value="ethereum">Ethereum (ETH)</option>
            <option value="bitcoin">Bitcoin (BTC) - {t('support.wallet.addressOnly')}</option>
            <option value="solana">Solana (SOL) - {t('support.wallet.addressOnly')}</option>
          </select>
        </div>

        {selectedCrypto === 'ethereum' ? (
          <>
            <div className="amount-selector">
              <label htmlFor="amount-input">{t('support.wallet.amount')} (ETH):</label>
              <input
                id="amount-input"
                type="number"
                step="0.01"
                min="0"
                value={donationAmount}
                onChange={(e) => setDonationAmount(e.target.value)}
                placeholder="0.01"
                disabled={isDonating}
              />
            </div>

            <div className="suggested-amounts">
              <label>{t('support.wallet.suggestedAmounts')}:</label>
              <div className="amount-buttons">
                {SUGGESTED_AMOUNTS.ethereum.map((amount) => (
                  <button
                    key={amount}
                    className="amount-button"
                    onClick={() => setDonationAmount(amount)}
                    disabled={isDonating}
                  >
                    {amount} ETH
                  </button>
                ))}
              </div>
            </div>

            <button
              className="donate-button"
              onClick={donate}
              disabled={isDonating || !donationAmount}
            >
              {isDonating ? t('support.wallet.processing') : t('support.wallet.donateButton')}
            </button>

            {txHash && (
              <p className="tx-info">
                {t('support.wallet.transactionSent')}:{' '}
                <a
                  href={`https://etherscan.io/tx/${txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {formatAddress(txHash)}
                </a>
              </p>
            )}
          </>
        ) : (
          <div className="crypto-address-only">
            <p>{t('support.wallet.addressDescription', { crypto: selectedCrypto.toUpperCase() })}</p>
            <code className="crypto-address-display">{DONATION_ADDRESSES[selectedCrypto]}</code>
            <button
              className="copy-button"
              onClick={() => navigator.clipboard.writeText(DONATION_ADDRESSES[selectedCrypto])}
            >
              📋 {t('support.wallet.copy')}
            </button>
          </div>
        )}

        <button className="disconnect-button" onClick={disconnectWallet}>
          {t('support.wallet.disconnect')}
        </button>

        {error && <p className="wallet-error">{error}</p>}
      </div>
    </div>
  );
}
