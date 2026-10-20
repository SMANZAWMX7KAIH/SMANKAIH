import React from 'react';
import { Sparkles, Code2 } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full mt-12 pt-8 pb-24 sm:pb-28 border-t border-slate-700/20 text-center relative select-none no-print transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 flex flex-col items-center space-y-4">
        
        {/* Indonesian Merah-Putih Ribbon Divider Accent */}
        <div className="flex items-center justify-center gap-3 w-full max-w-xs mx-auto">
          <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-red-500/40 to-red-500/80" />
          <div className="w-8 h-3 rounded-[3px] overflow-hidden flex flex-col shadow-sm border border-slate-600/30 shrink-0">
            <div className="flex-1 bg-red-600" />
            <div className="flex-1 bg-white" />
          </div>
          <div className="h-[1px] flex-1 bg-gradient-to-r from-red-500/80 via-red-500/40 to-transparent" />
        </div>

        {/* SMANKAIH Brand Tagline */}
        <div className="space-y-1">
          <div className="text-xs sm:text-sm font-extrabold tracking-tight theme-text flex items-center justify-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>SMANKAIH &bull; 7 Kebiasaan Anak Indonesia Hebat</span>
          </div>
          <p className="text-[11px] theme-text-muted max-w-md mx-auto leading-relaxed opacity-80">
            Membentuk karakter tangguh, religius, berintegritas, mandiri, dan gotong royong untuk Generasi Emas Indonesia.
          </p>
        </div>

        {/* Thin divider line */}
        <div className="w-24 h-[1px] bg-slate-500/20 my-1" />

        {/* Official Developer Credit Section */}
        <div className="space-y-1.5 pt-1">
          <div className="inline-flex items-center gap-1.5 text-[10px] sm:text-[11px] font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-400">
            <Code2 className="w-3.5 h-3.5 text-red-500" />
            <span>Developer &amp; Website Creator</span>
          </div>

          <div className="text-sm sm:text-base font-black tracking-wider uppercase text-white bg-gradient-to-r from-white via-red-100 to-slate-200 bg-clip-text drop-shadow-sm">
            GEMINI CENDRAWASIH TEAM
          </div>

          <div className="text-[10px] sm:text-[11px] font-medium text-slate-400 dark:text-slate-500 tracking-wide pt-0.5">
            &copy; 2026 SMANKAIH. All Rights Reserved.
          </div>
        </div>

      </div>
    </footer>
  );
};
