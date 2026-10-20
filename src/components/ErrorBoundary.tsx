import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RotateCcw, Home, Sparkles, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('SMANKAIH ErrorBoundary caught an error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleResetDataAndReload = () => {
    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch {}
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-slate-900 border border-red-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5 text-center">
            {/* Header Icon */}
            <div className="w-16 h-16 rounded-2xl bg-red-600/20 border border-red-500/40 flex items-center justify-center mx-auto text-red-500 shadow-lg">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-950/80 text-[11px] font-bold text-red-300 border border-red-700/50 uppercase tracking-wider mb-2">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>SMANKAIH — Pemulihan Sistem</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Terjadi Kendala Memuat Aplikasi
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
                Aplikasi mengalami kendala teknis sementara. Data profil dan kebiasaan Anda tetap aman tersimpan di perangkat.
              </p>
            </div>

            {/* Error Message Box */}
            {this.state.error && (
              <div className="p-3 bg-black/40 rounded-xl border border-slate-800 text-left">
                <div className="text-[10px] uppercase font-bold text-slate-400 mb-1">
                  Pesan Sistem:
                </div>
                <div className="font-mono text-xs text-red-400 break-all">
                  {this.state.error.message || 'Kesalahan rendering tidak diketahui.'}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-2.5 pt-2">
              <button
                onClick={this.handleReload}
                className="w-full py-3 px-4 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold rounded-xl text-xs transition flex items-center justify-center gap-2 shadow-lg shadow-red-900/40 cursor-pointer"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Muat Ulang Halaman (Refresh)</span>
              </button>

              <button
                onClick={this.handleResetDataAndReload}
                className="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-semibold rounded-xl text-xs border border-slate-700 transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Pulihkan Pengaturan Awal & Muat Ulang</span>
              </button>
            </div>

            <p className="text-[10px] text-slate-500 pt-1">
              SMANKAIH &bull; 7 Kebiasaan Anak Indonesia Hebat
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
