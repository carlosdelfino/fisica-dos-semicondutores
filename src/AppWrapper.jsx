import { useState } from 'react';
import Splashscreen from './components/Splashscreen.jsx';
import App from './App.jsx';

function AppWrapper() {
  const [showSplashscreen, setShowSplashscreen] = useState(true);

  return (
    <>
      <Splashscreen onComplete={() => setShowSplashscreen(false)} />
      {!showSplashscreen && <App />}
    </>
  );
}

export default AppWrapper;
