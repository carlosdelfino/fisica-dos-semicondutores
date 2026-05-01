import { useState, useEffect } from 'react';
import './Splashscreen.css';

function Splashscreen({ onComplete }) {
  const [isVisible, setIsVisible] = useState(true);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsFading(true);
      setTimeout(() => {
        setIsVisible(false);
        onComplete();
      }, 1500);
    }, 3000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!isVisible) return null;

  return (
    <div className={`splashscreen ${isFading ? 'fade-out' : ''}`}>
      <div className="splashscreen-content">
        <img 
          src="/images/logo-basicaodaeletronica.png" 
          alt="Basicão da Eletrônica Logo" 
          className="splashscreen-logo"
        />
        <div className="splashscreen-text">
          <a 
            href="https://basicaodaeletronica.com.br" 
            target="_blank" 
            rel="noopener noreferrer"
            className="splashscreen-link"
          >
            um site da rede Basicão da Eletrônica
          </a>
          <p className="splashscreen-tagline">
            Capilarizando a Ciência, a Engenharia e o Conhecimento
          </p>
        </div>
      </div>
    </div>
  );
}

export default Splashscreen;
