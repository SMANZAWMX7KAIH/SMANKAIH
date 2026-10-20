import React, { useState } from 'react';
import { 
  Home, 
  BarChart3, 
  Palette, 
  Printer, 
  User, 
  LogOut, 
  Film, 
  HelpCircle,
  Menu,
  X,
  Sparkles,
  CalendarDays,
  Clock,
  RotateCcw
} from 'lucide-react';
import { UserProfile } from '../types';
import { useDeviceDateTime, formatDeviceDate } from '../utils/dateUtils';

interface NavbarProps {
  user: UserProfile;
  activeTab: 'dashboard' | 'statistics' | 'theme' | 'report';
  setActiveTab: (tab: 'dashboard' | 'statistics' | 'theme' | 'report') => void;
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  onEditProfile: () => void;
  onLogout: () => void;
  onReplayIntro: () => void;
  onOpenAssetGuide: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  activeTab,
  setActiveTab,
  selectedDate,
  setSelectedDate,
  onEditProfile,
  onLogout,
  onReplayIntro,
  onOpenAssetGuide,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const deviceTime = useDeviceDateTime();
  const selectedDateInfo = formatDeviceDate(selectedDate);
  const isViewingToday = selectedDate === deviceTime.isoDate;

  const navItems = [
    { id: 'dashboard', label: 'Tujuh Kebiasaan', icon: Home },
    { id: 'statistics', label: 'Statistik & Diagram', icon: BarChart3 },
    { id: 'theme', label: 'Tema & Background', icon: Palette },
    { id: 'report', label: 'Cetak Laporan', icon: Printer },
  ];

  return (
    <header className="sticky top-0 z-30 w-full theme-nav backdrop-blur-md border-b shadow-lg no-print transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          {/* Logo Brand SMANKAIH */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setActiveTab('dashboard')}
              className="flex items-center gap-2.5 text-left group cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-600 via-rose-600 to-red-800 p-0.5 shadow-lg shadow-red-900/30 group-hover:scale-105 transition">
                <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center font-black text-transparent bg-clip-text bg-gradient-to-tr from-white via-red-200 to-red-400 text-sm tracking-tight">
                  SM
                </div>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-black text-lg tracking-tight theme-text">
                    SMANKAIH
                  </span>
                  <span className="text-[9px] font-extrabold px-1.5 py-0.5 bg-red-600 text-white rounded shadow-sm tracking-wider uppercase">
                    HEBAT
                  </span>
                </div>
                <div className="text-[11px] theme-text-muted font-medium hidden sm:block">
                  7 Kebiasaan Anak Indonesia Hebat
                </div>
              </div>
            </button>
          </div>

          {/* Desktop Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1 bg-black/5 dark:bg-white/5 p-1 rounded-xl border border-slate-700/30">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as any)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                    isActive
                      ? 'bg-red-600 text-white shadow-md shadow-red-900/30'
                      : 'theme-text-muted hover:theme-text hover:bg-black/5 dark:hover:bg-white/10'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Device Date & Day Live Badge (HP / Laptop sync) */}
          <div className="hidden xl:flex items-center gap-2.5 px-3 py-1 rounded-xl bg-red-600/10 border border-red-500/20 text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            <div className="flex flex-col text-left leading-tight">
              <div className="flex items-center gap-1 text-[11px] font-bold theme-text">
                <span className="text-red-500">Hari:</span>
                <span>{deviceTime.dayName}</span>
                <span className="text-slate-400 mx-1">&bull;</span>
                <span className="text-red-500">Tanggal:</span>
                <span>{deviceTime.dateFormatted}</span>
              </div>
              <div className="text-[10px] theme-text-muted flex items-center gap-1.5 font-mono">
                <Clock className="w-2.5 h-2.5 text-amber-500" />
                <span>Waktu HP: {deviceTime.timeFormatted}</span>
              </div>
            </div>
          </div>

          {/* Right Section: Date Selector & User & Quick Actions */}
          <div className="hidden sm:flex items-center gap-2">
            {/* Interactive Date Selector with Device Date reset */}
            <div className="flex items-center gap-1.5 theme-input px-2.5 py-1.5 rounded-lg border text-xs">
              <CalendarDays className="w-3.5 h-3.5 text-red-500 shrink-0" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="bg-transparent text-xs theme-text focus:outline-none cursor-pointer max-w-[115px]"
                title="Pilih tanggal aktivitas"
              />
              {!isViewingToday && (
                <button
                  onClick={() => setSelectedDate(deviceTime.isoDate)}
                  className="text-[10px] bg-red-600 text-white px-1.5 py-0.5 rounded shadow hover:bg-red-500 transition cursor-pointer font-bold flex items-center gap-0.5"
                  title="Kembali ke tanggal hari ini di HP"
                >
                  <RotateCcw className="w-2.5 h-2.5" />
                  Hari Ini
                </button>
              )}
            </div>

            {/* Replay 30s Intro */}
            <button
              onClick={onReplayIntro}
              title="Tonton Ulang Intro Anime 30 Detik SMANKAIH"
              className="p-2 rounded-lg theme-input hover:border-slate-500 transition cursor-pointer"
            >
              <Film className="w-4 h-4 text-amber-500" />
            </button>

            {/* User Profile Button */}
            <button
              onClick={onEditProfile}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg theme-input hover:border-slate-500 text-xs font-medium theme-text transition cursor-pointer"
              title="Lihat & Edit Profil Siswa"
            >
              <div className="w-6 h-6 rounded-full bg-red-600/30 text-red-500 flex items-center justify-center font-bold text-xs">
                {user.fullName.charAt(0).toUpperCase()}
              </div>
              <span className="max-w-[100px] truncate font-semibold">{user.fullName.split(' ')[0]}</span>
            </button>

            {/* Logout button */}
            <button
              onClick={onLogout}
              title="Ganti Profil / Keluar"
              className="p-2 rounded-lg theme-input hover:border-red-500 text-slate-400 hover:text-red-500 transition cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={onEditProfile}
              className="p-1.5 rounded-lg theme-input text-xs flex items-center gap-1"
            >
              <User className="w-4 h-4 text-red-500" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg theme-input theme-text cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden theme-nav border-b px-4 pt-2 pb-4 space-y-3 animate-fadeIn">
          {/* Live Device Date on Mobile */}
          <div className="p-3 rounded-2xl bg-gradient-to-r from-red-950/50 to-slate-900 border border-red-500/30 space-y-1.5 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-red-400 flex items-center gap-1.5 text-[11px] uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Waktu HP Anda
              </span>
              <span className="font-mono text-amber-300 font-bold bg-black/40 px-2 py-0.5 rounded text-[11px]">
                {deviceTime.timeFormatted}
              </span>
            </div>
            <div className="flex items-center justify-between text-slate-200 pt-0.5">
              <span>Hari: <strong className="text-white">{deviceTime.dayName}</strong></span>
              <span>Tanggal: <strong className="text-white">{deviceTime.dateFormatted}</strong></span>
            </div>
          </div>

          {/* User info on mobile */}
          <div className="p-3 rounded-xl theme-surface border flex items-center justify-between">
            <div>
              <div className="font-bold text-sm theme-text">{user.fullName}</div>
              <div className="text-xs theme-text-muted">{user.grade} &bull; {user.school}</div>
            </div>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onEditProfile();
              }}
              className="text-xs text-red-500 hover:underline font-semibold"
            >
              Edit Profil
            </button>
          </div>

          {/* Date Picker on Mobile */}
          <div className="flex items-center justify-between p-2 rounded-lg theme-input text-xs gap-2">
            <span className="theme-text-muted shrink-0">Pilih Tanggal:</span>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-transparent px-2 py-1 rounded theme-text text-xs border border-slate-700/50 flex-1 text-center"
            />
            {!isViewingToday && (
              <button
                onClick={() => setSelectedDate(deviceTime.isoDate)}
                className="text-[10px] bg-red-600 text-white px-2 py-1 rounded font-bold shrink-0"
              >
                Hari Ini
              </button>
            )}
          </div>

          {/* Navigation Links */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id as any);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-semibold ${
                    isActive
                      ? 'bg-red-600 text-white shadow'
                      : 'theme-surface hover:border-slate-500'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Additional quick actions */}
          <div className="flex gap-2 pt-2 border-t border-slate-700/30 mt-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onReplayIntro();
              }}
              className="flex-1 py-2 rounded-lg theme-surface text-xs font-semibold flex items-center justify-center gap-1.5"
            >
              <Film className="w-3.5 h-3.5 text-amber-500" />
              Intro SMANKAIH 30s
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAssetGuide();
              }}
              className="flex-1 py-2 rounded-lg theme-surface text-xs font-semibold flex items-center justify-center gap-1.5"
            >
              <HelpCircle className="w-3.5 h-3.5 text-sky-500" />
              Panduan
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onLogout();
              }}
              className="py-2 px-3 rounded-lg theme-surface text-red-500 text-xs font-semibold flex items-center justify-center gap-1"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
