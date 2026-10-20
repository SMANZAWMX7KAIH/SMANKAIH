import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { ErrorBoundary } from './components/ErrorBoundary.tsx';
import './index.css';

try {
  const rootElement = document.getElementById('root');
  if (rootElement) {
    const root = createRoot(rootElement);
    root.render(
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    );

    // Notify watchdog that React has initiated mount
    if (typeof (window as any).__SMANKAIH_MOUNTED__ === 'function') {
      (window as any).__SMANKAIH_MOUNTED__();
    }
  } else {
    console.error('Fatal: Elemen #root tidak ditemukan di index.html');
  }
} catch (err: any) {
  console.error('Fatal error saat mounting React SMANKAIH:', err);
  const root = document.getElementById('root');
  if (root) {
    root.innerHTML = `
      <div style="min-height: 100vh; display: flex; align-items: center; justify-content: center; background: #090d16; color: white; padding: 20px; font-family: sans-serif; text-align: center;">
        <div style="max-width: 400px; background: #0f172a; border: 1px solid rgba(239, 68, 68, 0.4); border-radius: 20px; padding: 24px; box-shadow: 0 20px 40px rgba(0,0,0,0.5);">
          <div style="font-size: 32px; margin-bottom: 12px; color: #ef4444;">⚠</div>
          <h2 style="color: #ffffff; font-size: 18px; font-weight: 800; margin-bottom: 8px;">Kendala Memuat SMANKAIH</h2>
          <p style="font-size: 13px; color: #94a3b8; line-height: 1.5; margin-bottom: 16px;">
            ${err?.message || 'Terjadi kendala saat menginisialisasi modul antarmuka.'}
          </p>
          <button onclick="window.location.reload()" style="background: linear-gradient(135deg, #dc2626, #b91c1c); color: white; border: none; padding: 10px 24px; border-radius: 12px; font-weight: bold; font-size: 13px; cursor: pointer;">
            Coba Lagi (Muat Ulang)
          </button>
        </div>
      </div>
    `;
  }
}
