import React, { useState } from 'react';
import { 
  BarChart3, 
  PieChart, 
  CheckCircle2, 
  Clock, 
  Calendar, 
  TrendingUp, 
  Award, 
  HelpCircle,
  FileCheck2,
  AlertCircle,
  Sparkles
} from 'lucide-react';
import { HABITS_DATA } from '../data/habitsData';
import { DayRecord, HabitId } from '../types';
import { formatDateIndonesian, getAllRecords, getTodayDateString } from '../utils/storage';

interface StatisticsViewProps {
  currentRecord: DayRecord | null;
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  onGoToDashboard: () => void;
}

export const StatisticsView: React.FC<StatisticsViewProps> = ({
  currentRecord,
  selectedDate,
  setSelectedDate,
  onGoToDashboard,
}) => {
  const allRecords = getAllRecords();
  const availableDates = Object.keys(allRecords).sort().reverse();
  const todayStr = getTodayDateString();

  // If selected date is not in availableDates, ensure it's still accessible
  const dateList = Array.from(new Set([todayStr, selectedDate, ...availableDates])).sort().reverse();

  // Calculate statistics for the selected date
  const habitsList = HABITS_DATA;
  const totalPlanned = habitsList.length; // 7 habits

  let completedCount = 0;
  const habitStatusList = habitsList.map((habit) => {
    const log = currentRecord?.habits[habit.id];
    const isDone = log?.completed || false;
    if (isDone) completedCount++;
    return {
      habit,
      completed: isDone,
      completedAt: log?.completedAt,
      targetTime: log?.targetTime || habit.defaultTargetTime,
      notes: log?.notes,
    };
  });

  const uncompletedCount = totalPlanned - completedCount;
  // Formula: Persentase penyelesaian = (selesai / total direncanakan) * 100%
  const completionPercentage = Math.round((completedCount / totalPlanned) * 100);

  // SVG Pie Chart Calculation
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const completedStroke = (completedCount / totalPlanned) * circumference;

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 select-none animate-fadeIn">
      {/* Top Header & Date Filter */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-700/40">
        <div>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-red-500" />
            <h1 className="text-2xl font-black theme-text tracking-tight">
              Statistik Aktivitas SMANKAIH
            </h1>
          </div>
          <p className="text-xs theme-text-muted mt-1">
            Pantau perbandingan dan proporsi pelaksanaan 7 kebiasaan positif setiap hari secara akurat.
          </p>
        </div>

        {/* Date Filter selector */}
        <div className="flex items-center gap-2 theme-surface p-1.5 rounded-2xl border shadow-sm">
          <Calendar className="w-4 h-4 text-red-500 ml-2" />
          <select
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="theme-input text-xs font-semibold px-3 py-1.5 rounded-xl border focus:outline-none cursor-pointer"
          >
            {dateList.map((d) => (
              <option key={d} value={d}>
                {formatDateIndonesian(d)} {d === todayStr ? '(Hari Ini)' : ''}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Summary Stat Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Planned */}
        <div className="theme-surface p-4 sm:p-5 rounded-2xl border flex items-center justify-between shadow">
          <div>
            <div className="text-[11px] font-bold theme-text-muted uppercase tracking-wider">
              Total Kebiasaan
            </div>
            <div className="text-2xl sm:text-3xl font-black theme-text mt-1">
              {totalPlanned}
            </div>
            <div className="text-[10px] theme-text-muted mt-0.5">Target kebiasaan harian</div>
          </div>
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-black/10 dark:bg-white/10 flex items-center justify-center theme-text-muted">
            <FileCheck2 className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
        </div>

        {/* Completed */}
        <div className="theme-surface p-4 sm:p-5 rounded-2xl border border-emerald-500/40 flex items-center justify-between shadow">
          <div>
            <div className="text-[11px] font-bold text-emerald-500 uppercase tracking-wider">
              Selesai Terlaksana
            </div>
            <div className="text-2xl sm:text-3xl font-black text-emerald-500 mt-1">
              {completedCount}
            </div>
            <div className="text-[10px] theme-text-muted mt-0.5">Aktivitas berhasil</div>
          </div>
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-500">
            <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
        </div>

        {/* Pending / Uncompleted */}
        <div className="theme-surface p-4 sm:p-5 rounded-2xl border border-amber-500/40 flex items-center justify-between shadow">
          <div>
            <div className="text-[11px] font-bold text-amber-500 uppercase tracking-wider">
              Belum Selesai
            </div>
            <div className="text-2xl sm:text-3xl font-black text-amber-500 mt-1">
              {uncompletedCount}
            </div>
            <div className="text-[10px] theme-text-muted mt-0.5">Menunggu dituntaskan</div>
          </div>
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500">
            <Clock className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
        </div>

        {/* Completion Percentage */}
        <div className="bg-gradient-to-br from-red-600 via-rose-600 to-red-800 p-4 sm:p-5 rounded-2xl border border-red-500/40 flex items-center justify-between shadow text-white">
          <div>
            <div className="text-[11px] font-bold text-red-100 uppercase tracking-wider">
              Persentase Capaian
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white mt-1">
              {completionPercentage}%
            </div>
            <div className="text-[10px] text-red-100/90 mt-0.5">
              {completionPercentage === 100 ? 'Sempurna! Luar biasa!' : `${completedCount} dari 7 selesai`}
            </div>
          </div>
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-white/20 border border-white/30 flex items-center justify-center text-white">
            <Award className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
        </div>
      </div>

      {/* Main Charts Section: Bar Chart & Pie Chart side-by-side */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* DIAGRAM BATANG (7 Cols) */}
        <div className="lg:col-span-7 theme-surface rounded-3xl p-5 sm:p-6 border shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-700/40">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-red-500" />
                <h3 className="font-extrabold text-base theme-text">
                  Diagram Batang Status Kebiasaan
                </h3>
              </div>
              <span className="text-[11px] font-mono theme-text-muted theme-input px-2.5 py-1 rounded-lg border">
                7 Kebiasaan Positif
              </span>
            </div>

            {completedCount === 0 ? (
              /* Empty state according to instructions */
              <div className="py-12 px-4 text-center rounded-2xl bg-black/5 dark:bg-white/5 border border-dashed border-slate-700/40 my-4">
                <AlertCircle className="w-10 h-10 text-amber-500 mx-auto mb-2 opacity-80" />
                <div className="text-sm font-bold theme-text mb-1">
                  Belum ada aktivitas yang tercatat
                </div>
                <p className="text-xs theme-text-muted max-w-sm mx-auto mb-4">
                  Pada tanggal {formatDateIndonesian(selectedDate)}, belum ada kebiasaan yang ditandai selesai.
                </p>
                <button
                  onClick={onGoToDashboard}
                  className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-xl transition cursor-pointer shadow"
                >
                  Buka Checklist Kebiasaan &rarr;
                </button>
              </div>
            ) : (
              /* Interactive Bar Chart */
              <div className="space-y-3.5 my-2">
                {habitStatusList.map((item, idx) => (
                  <div key={item.habit.id} className="space-y-1">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-semibold theme-text flex items-center gap-1.5">
                        <span className="w-4 theme-text-muted text-[11px] font-mono">#{idx + 1}</span>
                        {item.habit.title}
                      </span>
                      <span className={`text-[11px] font-bold ${item.completed ? 'text-emerald-500' : 'theme-text-muted'}`}>
                        {item.completed ? `Selesai (${item.completedAt || 'Tercatat'})` : 'Belum Selesai'}
                      </span>
                    </div>

                    {/* Bar visualization */}
                    <div className="w-full h-4 bg-black/10 dark:bg-white/10 rounded-full overflow-hidden p-0.5 border border-slate-700/30">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${
                          item.completed
                            ? 'bg-gradient-to-r from-emerald-500 to-teal-400 w-full shadow-sm'
                            : 'bg-slate-400/40 w-2'
                        }`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Bar Chart Legend */}
          <div className="mt-4 pt-3 border-t border-slate-700/40 flex items-center justify-between text-xs theme-text-muted">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm bg-emerald-500" />
                Selesai ({completedCount})
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-sm bg-slate-400" />
                Belum Selesai ({uncompletedCount})
              </span>
            </div>
            <span className="text-[11px] theme-text-muted">
              Perbandingan Aktivitas
            </span>
          </div>
        </div>

        {/* DIAGRAM LINGKARAN (5 Cols) */}
        <div className="lg:col-span-5 theme-surface rounded-3xl p-5 sm:p-6 border shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-700/40">
              <div className="flex items-center gap-2">
                <PieChart className="w-5 h-5 text-rose-500" />
                <h3 className="font-extrabold text-base theme-text">
                  Diagram Lingkaran Proporsi
                </h3>
              </div>
              <span className="text-[11px] font-bold text-red-500 bg-red-500/10 px-2.5 py-1 rounded-lg border border-red-500/30">
                {completionPercentage}%
              </span>
            </div>

            {/* SVG Circular Donut Chart */}
            <div className="flex flex-col items-center justify-center my-6 relative">
              <svg className="w-48 h-48 transform -rotate-90">
                {/* Background track circle */}
                <circle
                  cx="96"
                  cy="96"
                  r={radius}
                  stroke="currentColor"
                  strokeWidth="20"
                  className="text-black/10 dark:text-white/10"
                  fill="transparent"
                />
                {/* Uncompleted segment */}
                <circle
                  cx="96"
                  cy="96"
                  r={radius}
                  stroke="currentColor"
                  strokeWidth="20"
                  className="text-amber-500/40"
                  fill="transparent"
                  strokeDasharray={circumference}
                  strokeDashoffset={0}
                />
                {/* Completed segment */}
                <circle
                  cx="96"
                  cy="96"
                  r={radius}
                  stroke="currentColor"
                  strokeWidth="20"
                  className="text-emerald-500 transition-all duration-1000 ease-out"
                  fill="transparent"
                  strokeDasharray={circumference}
                  strokeDashoffset={circumference - completedStroke}
                  strokeLinecap="round"
                />
              </svg>

              {/* Center percentage badge */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-3xl font-black theme-text">
                  {completionPercentage}%
                </span>
                <span className="text-[11px] font-semibold theme-text-muted">
                  {completedCount} / {totalPlanned} Selesai
                </span>
              </div>
            </div>

            {/* Formula Explanation Callout */}
            <div className="p-3 bg-black/5 dark:bg-white/5 rounded-2xl border border-slate-700/40 text-[11px] theme-text space-y-1">
              <div className="font-semibold flex items-center gap-1">
                <HelpCircle className="w-3.5 h-3.5 text-sky-500" />
                Rumus Persentase Penyelesaian:
              </div>
              <p className="font-mono theme-text-muted text-[10px]">
                ({completedCount} selesai ÷ {totalPlanned} target) × 100% = <strong className="theme-text">{completionPercentage}%</strong>
              </p>
            </div>
          </div>

          {/* Pie Chart Legend Table */}
          <div className="mt-4 pt-3 border-t border-slate-700/40 space-y-2 text-xs">
            <div className="flex items-center justify-between p-2 rounded-xl theme-input border">
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded-full bg-emerald-500" />
                <span className="font-semibold theme-text">Selesai Terlaksana</span>
              </div>
              <div className="font-mono text-emerald-500 font-bold">
                {completedCount} ({completionPercentage}%)
              </div>
            </div>

            <div className="flex items-center justify-between p-2 rounded-xl theme-input border">
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded-full bg-amber-500" />
                <span className="font-semibold theme-text">Belum Selesai</span>
              </div>
              <div className="font-mono text-amber-500 font-bold">
                {uncompletedCount} ({100 - completionPercentage}%)
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
