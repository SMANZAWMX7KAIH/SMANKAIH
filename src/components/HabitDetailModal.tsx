import React from 'react';
import { 
  X, 
  Clock, 
  CheckCircle2, 
  Circle, 
  Lightbulb, 
  Sparkles, 
  Award, 
  Quote, 
  Calendar,
  Check,
  FileText
} from 'lucide-react';
import { HabitDefinition, HabitLog } from '../types';

interface HabitDetailModalProps {
  habit: HabitDefinition;
  log?: HabitLog;
  targetTime: string;
  onTargetTimeChange: (newTime: string) => void;
  onToggleStatus: () => void;
  onSaveNotes: (notes: string) => void;
  onClose: () => void;
}

export const HabitDetailModal: React.FC<HabitDetailModalProps> = ({
  habit,
  log,
  targetTime,
  onTargetTimeChange,
  onToggleStatus,
  onSaveNotes,
  onClose,
}) => {
  const isCompleted = log?.completed || false;
  const [localNotes, setLocalNotes] = React.useState(log?.notes || '');
  const [isSaved, setIsSaved] = React.useState(false);

  const handleNotesSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveNotes(localNotes);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto select-none">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden my-8 animate-fadeIn text-left">
        {/* Header with color gradient */}
        <div className={`p-6 sm:p-8 bg-gradient-to-r ${habit.colorScheme.primary} text-white relative`}>
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-black/20 hover:bg-black/40 text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/25 text-xs font-bold uppercase tracking-wider mb-2">
            <span>Kebiasaan #{habit.order}</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {habit.title}
          </h2>
          <p className="text-white/90 text-sm mt-1 max-w-lg">
            {habit.subtitle}
          </p>

          {/* Quick status bar */}
          <div className="mt-4 pt-4 border-t border-white/20 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-white/80">Status Hari Ini:</span>
              <span className={`px-2.5 py-1 rounded-full font-bold flex items-center gap-1.5 ${
                isCompleted 
                  ? 'bg-emerald-900/80 text-emerald-200 border border-emerald-400/50' 
                  : 'bg-black/30 text-amber-200 border border-amber-400/30'
              }`}>
                {isCompleted ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Circle className="w-3.5 h-3.5" />}
                {isCompleted ? 'Selesai Terlaksana' : 'Belum Selesai'}
              </span>
              {log?.completedAt && (
                <span className="text-white/80 font-mono text-[11px]">
                  (Pukul {log.completedAt} WIB)
                </span>
              )}
            </div>

            {/* Target time config inside modal */}
            <div className="flex items-center gap-2 bg-black/30 px-3 py-1 rounded-xl border border-white/20">
              <Clock className="w-3.5 h-3.5" />
              <span>Target Jam:</span>
              <input
                type="time"
                value={targetTime}
                onChange={(e) => onTargetTimeChange(e.target.value)}
                className="bg-transparent font-bold text-white focus:outline-none cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[60vh] overflow-y-auto">
          {/* Detailed Description */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Penjelasan & Filosofi
            </h4>
            <p className="text-sm text-slate-200 leading-relaxed bg-slate-800/40 p-4 rounded-2xl border border-slate-700/50">
              {habit.description}
            </p>
          </div>

          {/* Manfaat Utama */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-amber-400" />
              Manfaat Utama Bagi Pelajar Indonesia
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {habit.benefits.map((benefit, idx) => (
                <div 
                  key={idx}
                  className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 text-xs text-slate-300 flex items-start gap-2.5"
                >
                  <span className="w-5 h-5 rounded-full bg-slate-700 text-slate-300 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Langkah Praktis / Tips */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <Lightbulb className="w-4 h-4 text-yellow-400" />
              Langkah Praktis Setiap Hari
            </h4>
            <ul className="space-y-2">
              {habit.actionableTips.map((tip, idx) => (
                <li 
                  key={idx}
                  className="flex items-start gap-2.5 text-xs text-slate-300 bg-slate-800/30 p-2.5 rounded-xl border border-slate-700/40"
                >
                  <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Kata Mutiara & Inspirasi */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-red-950/40 to-slate-900 border border-red-500/20 text-xs text-slate-300 flex items-start gap-3">
            <Quote className="w-6 h-6 text-red-400 shrink-0 mt-1 opacity-75" />
            <div className="italic text-slate-200 text-xs sm:text-sm font-medium">
              {habit.inspirationalQuote}
            </div>
          </div>

          {/* Catatan Harian Pengguna */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-sky-400" />
              Catatan & Refleksi Harian Anda
            </h4>
            <form onSubmit={handleNotesSubmit} className="space-y-2">
              <textarea
                value={localNotes}
                onChange={(e) => setLocalNotes(e.target.value)}
                placeholder="Tuliskan catatan aktivitas Anda untuk kebiasaan ini (misal: bangun jam 5 pas, salat subuh berjamaah, lari 1.5 km di lapangan)..."
                rows={3}
                className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500"
              />
              <div className="flex justify-between items-center">
                <span className="text-[11px] text-emerald-400">
                  {isSaved && '✓ Catatan berhasil disimpan ke log harian!'}
                </span>
                <button
                  type="submit"
                  className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-200 transition cursor-pointer"
                >
                  Simpan Catatan
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-6 bg-slate-950/80 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-400">
            {isCompleted ? 'Aktivitas telah selesai dicatat.' : 'Belum selesai, luangkan waktu untuk melaksanakannya.'}
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={onToggleStatus}
              className={`w-full sm:w-auto px-5 py-2.5 rounded-xl font-bold text-xs shadow-lg transition flex items-center justify-center gap-2 cursor-pointer ${
                isCompleted
                  ? 'bg-amber-600 hover:bg-amber-500 text-white'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/30'
              }`}
            >
              {isCompleted ? (
                <>
                  <Circle className="w-4 h-4" />
                  <span>Tandai Belum Selesai</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Tandai Selesai Sekarang</span>
                </>
              )}
            </button>

            <button
              onClick={onClose}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs transition cursor-pointer"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
