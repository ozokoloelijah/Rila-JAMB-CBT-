import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { registerSW } from 'virtual:pwa-register';

// Register service worker for complete offline caching across Windows, macOS, and Linux
registerSW({
  immediate: true,
  onNeedRefresh() {
    console.log('JAMB CBT Engine update ready.');
  },
  onOfflineReady() {
    console.log('JAMB CBT Engine is cached and ready for complete offline use.');
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
