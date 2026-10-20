/**
 * SMANKAIH — 7 KEBIASAAN ANAK INDONESIA HEBAT
 * Website Edukasi Interaktif Pelajar Indonesia
 */

import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { 
  Sparkles, 
  CheckCircle2, 
  Calendar, 
  ArrowRight, 
  Trophy, 
  Flame, 
  Heart, 
  HelpCircle,
  Film,
  Play,
  RotateCcw,
  Clock
} from 'lucide-react';

import { 
  UserProfile, 
  DayRecord, 
  HabitId, 
  ThemeConfig, 
  HabitDefinition 
} from './types';
import { HABITS_DATA } from './data/habitsData';
import { BACKGROUND_PRESETS } from './data/backgroundsData';
import { 
  getSavedProfile, 
  removeProfile, 
  getAllRecords, 
  getRecordForDate, 
  saveHabitStatus, 
  getSavedTargetTimes, 
  saveTargetTime, 
  getSavedTheme, 
  getCustomBackgroundFromDB, 
  getTodayDateString, 
  formatDateIndonesian 
} from './utils/storage';
import { useDeviceDateTime, formatDeviceDate } from './utils/dateUtils';
import { audioController } from './utils/audioPlayer';

import { LoginModal } from './components/LoginModal';
import { IntroVideoModal } from './components/IntroVideoModal';
import { AudioPlayerBar } from './components/AudioPlayerBar';
import { Navbar } from './components/Navbar';
import { HabitCard } from './components/HabitCard';
import { HabitDetailModal } from './components/HabitDetailModal';
import { StatisticsView } from './components/StatisticsView';
import { ThemeCustomizer } from './components/ThemeCustomizer';
import { PrintReportView } from './components/PrintReportView';
import { ProfileModal } from './components/ProfileModal';
import { AssetGuideModal } from './components/AssetGuideModal';

export default function App() {
  const deviceTime = useDeviceDateTime();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [showIntro, setShowIntro] = useState(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'statistics' | 'theme' | 'report'>('dashboard');
  const [selectedDate, setSelectedDate] = useState<string>(() => getTodayDateString());
  const [records, setRecords] = useState<Record<string, DayRecord>>({});
  const [targetTimes, setTargetTimes] = useState<Record<HabitId, string>>({} as Record<HabitId, string>);
  const [themeConfig, setThemeConfig] = useState<ThemeConfig>(getSavedTheme());
  const [customBgUrl, setCustomBgUrl] = useState<string | null>(null);

  // Active Modals
  const [selectedHabitForDetail, setSelectedHabitForDetail] = useState<HabitDefinition | null>(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showAssetGuideModal, setShowAssetGuideModal] = useState(false);

  // Track previous device date ISO to auto-switch day at midnight
  const prevDeviceIsoRef = useRef(deviceTime.isoDate);

  // Update document title and sync date on load
  useEffect(() => {
    document.title = 'SMANKAIH — 7 Kebiasaan Anak Indonesia Hebat';
  }, []);

  // Auto-switch date if device day rolls over (e.g., crossing midnight)
  useEffect(() => {
    if (prevDeviceIsoRef.current !== deviceTime.isoDate) {
      if (selectedDate === prevDeviceIsoRef.current) {
        setSelectedDate(deviceTime.isoDate);
      }
      prevDeviceIsoRef.current = deviceTime.isoDate;
    }
  }, [deviceTime.isoDate, selectedDate]);

  // Initial Load
  useEffect(() => {
    const savedUser = getSavedProfile();
    const all = getAllRecords();
    const savedTimes = getSavedTargetTimes();
    const savedTheme = getSavedTheme();

    setUser(savedUser);
    setRecords(all);
    setTargetTimes(savedTimes);
    setThemeConfig(savedTheme);

    // Load custom background from IndexedDB if enabled
    if (savedTheme.useCustomImage) {
      getCustomBackgroundFromDB('user_custom_bg').then((data) => {
        if (data) {
          setCustomBgUrl(data);
        }
      });
    }

    // If user exists and hasn't seen intro this session, show intro
    const hasSeenIntro = sessionStorage.getItem('smankaih_session_intro');
    if (savedUser && !hasSeenIntro) {
      setShowIntro(true);
      sessionStorage.setItem('smankaih_session_intro', 'true');
    }

    setIsInitialized(true);
  }, []);

  // Try background music when user enters
  const handleUserLogin = (profile: UserProfile) => {
    setUser(profile);
    setShowIntro(true);
    sessionStorage.setItem('smankaih_session_intro', 'true');
    // Start music unless user skipped initial music
    const skipMusic = sessionStorage.getItem('smankaih_skip_music_initial');
    if (!skipMusic) {
      audioController.play().catch(() => {});
    }
  };

  const handleLogout = () => {
    removeProfile();
    setUser(null);
    audioController.stop();
  };

  // Toggle habit completion status
  const handleToggleHabit = (habitId: HabitId) => {
    const currentRec = records[selectedDate];
    const currentLog = currentRec?.habits[habitId];
    const isCurrentlyDone = currentLog?.completed || false;
    const newStatus = !isCurrentlyDone;

    const habitDef = HABITS_DATA.find((h) => h.id === habitId);
    const targetTime = targetTimes[habitId] || habitDef?.defaultTargetTime || '06:00';

    const updatedRecord = saveHabitStatus(
      selectedDate,
      habitId,
      newStatus,
      targetTime,
      currentLog?.notes,
      currentLog?.reflection
    );

    setRecords((prev) => ({
      ...prev,
      [selectedDate]: updatedRecord,
    }));

    // Check if all 7 habits are completed!
    if (newStatus) {
      let doneCount = 0;
      HABITS_DATA.forEach((h) => {
        if (h.id === habitId) doneCount++;
        else if (updatedRecord.habits[h.id]?.completed) doneCount++;
      });

      if (doneCount === 7) {
        // Trigger celebratory confetti
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#dc2626', '#ffffff', '#eab308', '#10b981'],
        });
      }
    }
  };

  // Target time change
  const handleTargetTimeChange = (habitId: HabitId, time: string) => {
    saveTargetTime(habitId, time);
    setTargetTimes((prev) => ({
      ...prev,
      [habitId]: time,
    }));

    // Update in today's record too if exists
    const currentRec = records[selectedDate];
    if (currentRec?.habits[habitId]) {
      saveHabitStatus(
        selectedDate,
        habitId,
        currentRec.habits[habitId].completed,
        time,
        currentRec.habits[habitId].notes,
        currentRec.habits[habitId].reflection
      );
      setRecords((prev) => ({
        ...prev,
        [selectedDate]: {
          ...currentRec,
          habits: {
            ...currentRec.habits,
            [habitId]: {
              ...currentRec.habits[habitId],
              targetTime: time,
            },
          },
        },
      }));
    }
  };

  // Save notes for a habit
  const handleSaveNotes = (habitId: HabitId, notes: string) => {
    const currentRec = records[selectedDate];
    const isDone = currentRec?.habits[habitId]?.completed || false;
    const targetTime = targetTimes[habitId] || '06:00';

    const updated = saveHabitStatus(
      selectedDate,
      habitId,
      isDone,
      targetTime,
      notes
    );

    setRecords((prev) => ({
      ...prev,
      [selectedDate]: updated,
    }));
  };

  // Theme update handler
  const handleThemeChange = (newTheme: ThemeConfig) => {
    setThemeConfig(newTheme);
    if (newTheme.useCustomImage && newTheme.customImageDataUrl) {
      setCustomBgUrl(newTheme.customImageDataUrl);
    } else if (!newTheme.useCustomImage) {
      setCustomBgUrl(null);
    }
  };

  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <Sparkles className="w-5 h-5 animate-spin text-red-500" />
          <span>Memuat SMANKAIH...</span>
        </div>
      </div>
    );
  }

  // If user is not logged in, show Login Modal
  if (!user) {
    return <LoginModal onSuccess={handleUserLogin} />;
  }

  // Active day record
  const currentRecord = records[selectedDate] || null;

  // Active theme background style
  const activePreset = BACKGROUND_PRESETS.find((p) => p.id === themeConfig.presetId) || BACKGROUND_PRESETS[0];

  let bgLayerStyle: React.CSSProperties = {};
  if (themeConfig.useCustomImage && customBgUrl) {
    bgLayerStyle = {
      backgroundImage: `url(${customBgUrl})`,
      backgroundSize: themeConfig.fitMode === 'cover' ? 'cover' : themeConfig.fitMode === 'contain' ? 'contain' : '100% 100%',
      backgroundPosition: themeConfig.position || 'center',
      backgroundRepeat: 'no-repeat',
    };
  } else if (themeConfig.useCustomColor && themeConfig.customColor) {
    bgLayerStyle = {
      backgroundColor: themeConfig.customColor,
    };
  } else {
    bgLayerStyle = {
      backgroundImage: activePreset.fullStyle,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
    };
  }

  // Count habits completed for current date
  let completedCount = 0;
  HABITS_DATA.forEach((h) => {
    if (currentRecord?.habits[h.id]?.completed) completedCount++;
  });
  const totalCount = HABITS_DATA.length;
  const progressPercent = Math.round((completedCount / totalCount) * 100);

  const themeModeClass = `theme-${themeConfig.themeMode || 'dark'}`;
  const isViewingDeviceToday = selectedDate === deviceTime.isoDate;

  return (
    <div className={`min-h-screen flex flex-col justify-between relative selection:bg-red-600 selection:text-white transition-colors duration-300 ${themeModeClass}`}>
      {/* 1. Fixed Background Layer: Always fills viewport cleanly behind all content */}
      <div
        id="app-theme-background-layer"
        className="fixed inset-0 pointer-events-none -z-20 transition-all duration-500 overflow-hidden"
        style={bgLayerStyle}
      />

      {/* 2. Fixed Dynamic Overlay Layer: Light overlay for light theme, dark overlay for dark themes */}
      <div
        id="app-theme-overlay-layer"
        className="fixed inset-0 pointer-events-none -z-10 transition-all duration-300"
        style={{
          backgroundColor: `rgba(var(--theme-overlay-rgb, 15, 23, 42), ${themeConfig.overlayOpacity / 100})`,
        }}
      />

      {/* Main Content Area */}
      <div className="relative z-10 flex-1 flex flex-col pb-12 sm:pb-16">
        {/* Navigation Bar */}
        <Navbar
          user={user}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          onEditProfile={() => setShowProfileModal(true)}
          onLogout={handleLogout}
          onReplayIntro={() => setShowIntro(true)}
          onOpenAssetGuide={() => setShowAssetGuideModal(true)}
        />

        {/* Dynamic View Router */}
        <main className="flex-1">
          {activeTab === 'dashboard' && (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 animate-fadeIn">
              {/* Hero Greeting Card */}
              <div className="bg-gradient-to-r from-red-600 via-rose-700 to-red-800 rounded-3xl p-6 sm:p-8 border border-red-500/30 shadow-2xl backdrop-blur-md relative overflow-hidden text-left text-white">
                {/* Decorative background glow */}
                <div className="absolute top-0 right-0 w-80 h-80 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />

                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                  <div className="space-y-3 max-w-2xl">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/25 text-xs font-bold text-red-200 border border-white/10 uppercase tracking-wider">
                      <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                      <span>SMANKAIH — 7 Kebiasaan Anak Indonesia Hebat</span>
                    </div>

                    <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                      Halo, {user.fullName}!
                    </h1>

                    <p className="text-sm sm:text-base text-red-100/90 leading-relaxed italic">
                      “Langkah kecil hari ini membentuk generasi hebat di masa depan.”
                    </p>

                    <div className="text-xs text-slate-200 flex flex-wrap items-center gap-3">
                      <span>{user.grade} &bull; {user.school}</span>
                    </div>

                    {/* Real-time Device Date & Day Card (HP/PC Synchronization) */}
                    <div className="p-3.5 sm:p-4 rounded-2xl bg-black/40 border border-white/20 backdrop-blur-md space-y-2 mt-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-extrabold text-red-200 uppercase tracking-wider flex items-center gap-1.5 text-[11px]">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                          WAKTU REAL-TIME PERANGKAT (HP)
                        </span>
                        <span className="font-mono text-xs font-bold text-amber-300 bg-white/10 px-2.5 py-0.5 rounded-lg border border-white/10 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-amber-400" />
                          {deviceTime.timeFormatted}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="bg-white/10 p-2.5 rounded-xl border border-white/10">
                          <span className="text-[10px] text-red-200 uppercase font-bold block">Hari Ini</span>
                          <span className="text-sm sm:text-base font-black text-white">Hari: {deviceTime.dayName}</span>
                        </div>
                        <div className="bg-white/10 p-2.5 rounded-xl border border-white/10">
                          <span className="text-[10px] text-red-200 uppercase font-bold block">Tanggal</span>
                          <span className="text-sm sm:text-base font-black text-white">Tanggal: {deviceTime.dateFormatted}</span>
                        </div>
                      </div>

                      {!isViewingDeviceToday ? (
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] bg-amber-500/20 text-amber-200 p-2 rounded-xl border border-amber-400/30">
                          <span>Melihat catatan tanggal: <strong>{formatDateIndonesian(selectedDate)}</strong></span>
                          <button
                            onClick={() => setSelectedDate(deviceTime.isoDate)}
                            className="px-2.5 py-1 bg-amber-400 text-slate-900 rounded-lg font-bold hover:bg-amber-300 transition text-[10px] flex items-center gap-1 cursor-pointer self-start sm:self-auto"
                          >
                            <RotateCcw className="w-2.5 h-2.5" />
                            Kembali ke Hari Ini (HP)
                          </button>
                        </div>
                      ) : (
                        <div className="text-[10px] text-red-100/70 pt-0.5">
                          * Hari dan tanggal otomatis disinkronkan dengan kalender perangkat HP Anda.
                        </div>
                      )}
                    </div>

                    {/* Quick Start Music Action */}
                    <div className="pt-2 flex flex-wrap gap-2.5">
                      <button
                        onClick={() => audioController.play()}
                        className="px-4 py-2.5 rounded-xl bg-white text-red-700 font-extrabold text-xs shadow-lg hover:bg-red-50 transition flex items-center gap-2 cursor-pointer active:scale-95"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>MULAI SMANKAIH + MUSIK PATRIOTIK</span>
                      </button>
                    </div>
                  </div>

                  {/* Daily Progress Gauge Widget */}
                  <div className="w-full lg:w-72 bg-black/30 dark:bg-black/50 p-4 sm:p-5 rounded-2xl border border-white/20 shadow-inner flex flex-col justify-between text-white self-stretch lg:self-auto">
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="font-bold text-slate-200">Capaian Hari Ini</span>
                      <span className="font-mono text-emerald-400 font-bold text-sm">
                        {completedCount} / {totalCount} Selesai
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-3 bg-black/40 rounded-full overflow-hidden p-0.5 border border-white/20 mb-2.5">
                      <div
                        className="h-full bg-gradient-to-r from-red-500 via-amber-400 to-emerald-400 rounded-full transition-all duration-700"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-200">
                      <span>Persentase: <strong className="text-white">{progressPercent}%</strong></span>
                      {progressPercent === 100 ? (
                        <span className="text-emerald-300 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Tuntas Sempurna!
                        </span>
                      ) : (
                        <span>{totalCount - completedCount} kebiasaan lagi</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Habit Cards Grid (7 Habits) */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-extrabold theme-text tracking-tight">
                      Daftar 7 Kebiasaan Positif
                    </h2>
                    <p className="text-xs theme-text-muted">
                      Klik tombol status untuk menandai selesai, atur jam target, atau buka detail untuk membaca inspirasi.
                    </p>
                  </div>

                  {/* Intro re-watch shortcut */}
                  <button
                    onClick={() => setShowIntro(true)}
                    className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl theme-surface theme-text text-xs font-semibold border transition cursor-pointer"
                  >
                    <Film className="w-3.5 h-3.5 text-amber-500" />
                    <span>Intro SMANKAIH 30s</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {HABITS_DATA.map((habit) => {
                    const log = currentRecord?.habits[habit.id];
                    const targetTime = targetTimes[habit.id] || habit.defaultTargetTime;

                    return (
                      <HabitCard
                        key={habit.id}
                        habit={habit}
                        log={log}
                        targetTime={targetTime}
                        onTargetTimeChange={(newTime) => handleTargetTimeChange(habit.id, newTime)}
                        onToggleStatus={() => handleToggleHabit(habit.id)}
                        onOpenDetails={() => setSelectedHabitForDetail(habit)}
                      />
                    );
                  })}
                </div>
              </div>

              {/* SMANKAIH Footer */}
              <footer className="mt-12 py-6 border-t border-slate-700/20 text-center text-xs theme-text-muted space-y-1">
                <div className="font-extrabold theme-text">
                  SMANKAIH &bull; 7 Kebiasaan Anak Indonesia Hebat
                </div>
                <p className="text-[11px] opacity-80">
                  Membentuk karakter tangguh, religius, berintegritas, mandiri, dan gotong royong untuk Generasi Emas Indonesia.
                </p>
              </footer>
            </div>
          )}

          {activeTab === 'statistics' && (
            <StatisticsView
              currentRecord={currentRecord}
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              onGoToDashboard={() => setActiveTab('dashboard')}
            />
          )}

          {activeTab === 'theme' && (
            <ThemeCustomizer
              themeConfig={themeConfig}
              onThemeChange={handleThemeChange}
            />
          )}

          {activeTab === 'report' && (
            <PrintReportView
              user={user}
              currentRecord={currentRecord}
              selectedDate={selectedDate}
            />
          )}
        </main>
      </div>

      {/* Persistent Audio Player Bar */}
      <AudioPlayerBar onOpenAssetGuide={() => setShowAssetGuideModal(true)} />

      {/* 30-Second Anime Cinematic Intro Modal */}
      {showIntro && (
        <IntroVideoModal
          onComplete={() => setShowIntro(false)}
          onOpenAssetGuide={() => setShowAssetGuideModal(true)}
        />
      )}

      {/* Habit Detail Modal */}
      {selectedHabitForDetail && (
        <HabitDetailModal
          habit={selectedHabitForDetail}
          log={currentRecord?.habits[selectedHabitForDetail.id]}
          targetTime={targetTimes[selectedHabitForDetail.id] || selectedHabitForDetail.defaultTargetTime}
          onTargetTimeChange={(newTime) => handleTargetTimeChange(selectedHabitForDetail.id, newTime)}
          onToggleStatus={() => handleToggleHabit(selectedHabitForDetail.id)}
          onSaveNotes={(notes) => handleSaveNotes(selectedHabitForDetail.id, notes)}
          onClose={() => setSelectedHabitForDetail(null)}
        />
      )}

      {/* Profile & Settings Modal */}
      {showProfileModal && (
        <ProfileModal
          user={user}
          onUpdate={(updated) => setUser(updated)}
          onLogout={handleLogout}
          onClose={() => setShowProfileModal(false)}
        />
      )}

      {/* Asset Guide Modal */}
      {showAssetGuideModal && (
        <AssetGuideModal onClose={() => setShowAssetGuideModal(false)} />
      )}
    </div>
  );
}
