import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import { ErrorBoundary } from './components/ErrorBoundary.tsx';
import './index.css';

const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  );

  // Notify watchdog that React mounted successfully
  if (typeof (window as any).__SMANKAIH_MOUNTED__ === 'function') {
    (window as any).__SMANKAIH_MOUNTED__();
  }
} else {
  console.error('Fatal: Elemen #root tidak ditemukan di index.html');
}

