import React from 'react';
import { 
  Sunrise, 
  HeartHandshake, 
  Activity, 
  Apple, 
  BookOpen, 
  Users, 
  Moon,
  Clock,
  CheckCircle2,
  Circle,
  ChevronRight,
  FileText
} from 'lucide-react';
import { HabitDefinition, HabitLog } from '../types';

interface HabitCardProps {
  habit: HabitDefinition;
  log?: HabitLog;
  targetTime: string;
  onTargetTimeChange: (newTime: string) => void;
  onToggleStatus: () => void;
  onOpenDetails: () => void;
}

const ICON_MAP: Record<string, any> = {
  Sunrise,
  HeartHandshake,
  Activity,
  Apple,
  BookOpen,
  Users,
  Moon,
};

export const HabitCard: React.FC<HabitCardProps> = ({
  habit,
  log,
  targetTime,
  onTargetTimeChange,
  onToggleStatus,
  onOpenDetails,
}) => {
  const isCompleted = log?.completed || false;
  const IconComponent = ICON_MAP[habit.iconName] || Sunrise;

  return (
    <div
      className={`group relative rounded-2xl sm:rounded-3xl p-5 sm:p-6 transition-all duration-300 border flex flex-col justify-between theme-surface ${
        isCompleted
          ? 'border-emerald-500/60 shadow-lg shadow-emerald-950/20'
          : 'hover:border-slate-500/50 shadow-md'
      }`}
    >
      {/* Top Bar: Habit Order & Status Badge */}
      <div>
        <div className="flex items-center justify-between mb-3.5">
          <div className="flex items-center gap-2.5">
            <div
              className={`w-11 h-11 rounded-2xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-105 ${
                isCompleted
                  ? 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white'
                  : `bg-gradient-to-br ${habit.colorScheme.primary} text-white`
              }`}
            >
              <IconComponent className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-extrabold uppercase tracking-widest theme-text-muted">
                  KEBIASAAN #{habit.order}
                </span>
                {isCompleted && (
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-500 font-bold border border-emerald-500/40">
                    Selesai
                  </span>
                )}
              </div>
              <h3 className="font-extrabold text-base sm:text-lg theme-text group-hover:text-red-500 transition">
                {habit.title}
              </h3>
            </div>
          </div>

          {/* Target Time Setting */}
          <div 
            title="Klik untuk mengubah jam target"
            className="flex items-center gap-1.5 theme-input px-2.5 py-1 rounded-xl border text-xs transition"
          >
            <Clock className="w-3.5 h-3.5 text-red-500 shrink-0" />
            <input
              type="time"
              value={targetTime}
              onChange={(e) => onTargetTimeChange(e.target.value)}
              className="bg-transparent text-xs font-semibold theme-text focus:outline-none cursor-pointer w-14"
              aria-label={`Jam target ${habit.title}`}
            />
          </div>
        </div>

        {/* Short Description */}
        <p className="text-xs theme-text-muted leading-relaxed mb-4 line-clamp-2">
          {habit.description}
        </p>

        {/* Completion details or Notes banner if present */}
        {isCompleted && (
          <div className="mb-4 px-3 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-[11px] text-emerald-600 dark:text-emerald-300 flex items-center justify-between">
            <span className="flex items-center gap-1.5 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Selesai tercatat {log?.completedAt ? `pukul ${log.completedAt} WIB` : 'hari ini'}
            </span>
            {log?.notes && (
              <span className="flex items-center gap-1 text-[10px] theme-text-muted" title={log.notes}>
                <FileText className="w-3 h-3 text-sky-500" />
                Catatan ada
              </span>
            )}
          </div>
        )}
      </div>

      {/* Bottom Action Buttons */}
      <div className="pt-3 border-t border-slate-700/30 flex items-center justify-between gap-2">
        {/* Detail Modal Trigger */}
        <button
          type="button"
          onClick={onOpenDetails}
          className="text-xs theme-text-muted hover:theme-text font-medium flex items-center gap-1 py-1.5 px-2 rounded-lg hover:bg-black/10 dark:hover:bg-white/10 transition cursor-pointer"
        >
          <span>Detail & Panduan</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>

        {/* Toggle Status Button */}
        <button
          type="button"
          onClick={onToggleStatus}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow cursor-pointer active:scale-95 ${
            isCompleted
              ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-950/40'
              : 'theme-input hover:border-slate-500/80 border'
          }`}
        >
          {isCompleted ? (
            <>
              <CheckCircle2 className="w-3.5 h-3.5 text-white" />
              <span>Selesai</span>
            </>
          ) : (
            <>
              <Circle className="w-3.5 h-3.5 text-slate-400" />
              <span className="theme-text">Belum Selesai</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
