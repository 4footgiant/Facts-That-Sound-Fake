import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { initializeAdMob } from './lib/adMobSDK';

// Initialize the Google Mobile Ads SDK instantly at application startup
initializeAdMob().catch((err) => {
  console.error('[Startup] Failed to launch Google Mobile Ads SDK:', err);
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js");
  });
}
