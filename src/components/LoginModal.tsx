import React, { useState } from 'react';
import { 
  User, 
  GraduationCap, 
  Building2, 
  Calendar, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  Eye, 
  AlertCircle,
  Flag
} from 'lucide-react';
import { UserProfile } from '../types';
import { saveProfile } from '../utils/storage';
import { useDeviceDateTime } from '../utils/dateUtils';

interface LoginModalProps {
  onSuccess: (profile: UserProfile) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ onSuccess }) => {
  const deviceTime = useDeviceDateTime();
  const [fullName, setFullName] = useState('');
  const [age, setAge] = useState('');
  const [grade, setGrade] = useState('');
  const [school, setSchool] = useState('');
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPreview, setShowPreview] = useState(false);

  const validateForm = (): boolean => {
    const errs: Record<string, string> = {};

    if (!fullName.trim()) {
      errs.fullName = 'Nama lengkap wajib diisi dan tidak boleh hanya spasi.';
    } else if (fullName.trim().length < 3) {
      errs.fullName = 'Nama lengkap minimal 3 karakter.';
    }

    const ageNum = parseInt(age, 10);
    if (!age.trim()) {
      errs.age = 'Umur wajib diisi.';
    } else if (isNaN(ageNum) || ageNum < 6 || ageNum > 35) {
      errs.age = 'Masukkan umur yang valid (antara 6 hingga 35 tahun).';
    }

    if (!grade.trim()) {
      errs.grade = 'Kelas wajib diisi (contoh: X-1, XI MIPA 2, XII IPS).';
    }

    if (!school.trim()) {
      errs.school = 'Asal sekolah wajib diisi dan tidak boleh hanya spasi.';
    } else if (school.trim().length < 3) {
      errs.school = 'Nama asal sekolah minimal 3 karakter.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handlePreview = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setShowPreview(true);
    }
  };

  const handleFinalSubmit = () => {
    if (!validateForm()) {
      setShowPreview(false);
      return;
    }

    const profile: UserProfile = {
      fullName: fullName.trim(),
      age: parseInt(age, 10),
      grade: grade.trim(),
      school: school.trim(),
      joinedAt: new Date().toISOString(),
    };

    saveProfile(profile);
    onSuccess(profile);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden transition-all duration-300 my-8">
        {/* Banner with Indonesian Patriotic Emblem */}
        <div className="relative bg-gradient-to-r from-red-600 via-rose-700 to-red-800 p-6 sm:p-8 text-white text-center overflow-hidden">
          {/* Subtle Merah Putih ribbon accent */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl transform translate-x-12 -translate-y-12" />
          
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/25 backdrop-blur-sm border border-white/20 text-xs font-semibold uppercase tracking-wider text-red-100 mb-3">
            <Flag className="w-3.5 h-3.5 text-white" />
            <span>Karakter Pelajar Nusantara</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">
            SELAMAT DATANG DI SMANKAIH!
          </h1>
          <p className="text-red-100 text-xs sm:text-sm font-medium italic max-w-md mx-auto mb-3">
            “Langkah kecil hari ini membentuk generasi hebat di masa depan.”
          </p>

          {/* Live Device Date & Day Indicator */}
          <div className="inline-flex flex-wrap items-center justify-center gap-2 px-3 py-1.5 rounded-xl bg-black/40 border border-white/15 text-xs text-slate-200">
            <span className="text-amber-300 font-bold">Hari: {deviceTime.dayName}</span>
            <span className="text-white/40">&bull;</span>
            <span className="text-white font-semibold">Tanggal: {deviceTime.dateFormatted}</span>
            <span className="text-white/40">&bull;</span>
            <span className="font-mono text-[11px] text-emerald-300">{deviceTime.timeFormatted}</span>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8">
          {!showPreview ? (
            /* Input Form */
            <form onSubmit={handlePreview} className="space-y-4">
              <div className="text-xs text-slate-400 mb-2">
                Silakan lengkapi formulir identitas siswa untuk memulai pencatatan kebiasaan hebat Anda.
              </div>

              {/* 1. Nama Lengkap */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Nama Lengkap <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Contoh: Raden Satria Pratama"
                    className={`w-full pl-9 pr-3 py-2.5 bg-slate-800/80 border rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 transition ${
                      errors.fullName
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-slate-700 focus:border-red-500 focus:ring-red-500/20'
                    }`}
                  />
                </div>
                {errors.fullName && (
                  <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.fullName}
                  </p>
                )}
              </div>

              {/* 2. Umur & Kelas (Grid) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Umur */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Umur (Tahun) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                      <Calendar className="w-4 h-4" />
                    </div>
                    <input
                      type="number"
                      min="6"
                      max="35"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      placeholder="16"
                      className={`w-full pl-9 pr-3 py-2.5 bg-slate-800/80 border rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 transition ${
                        errors.age
                          ? 'border-red-500 focus:ring-red-500'
                          : 'border-slate-700 focus:border-red-500 focus:ring-red-500/20'
                      }`}
                    />
                  </div>
                  {errors.age && (
                    <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.age}
                    </p>
                  )}
                </div>

                {/* Kelas */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Kelas <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                      <GraduationCap className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      value={grade}
                      onChange={(e) => setGrade(e.target.value)}
                      placeholder="Contoh: XI MIPA 1"
                      className={`w-full pl-9 pr-3 py-2.5 bg-slate-800/80 border rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 transition ${
                        errors.grade
                          ? 'border-red-500 focus:ring-red-500'
                          : 'border-slate-700 focus:border-red-500 focus:ring-red-500/20'
                      }`}
                    />
                  </div>
                  {errors.grade && (
                    <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.grade}
                    </p>
                  )}
                </div>
              </div>

              {/* 3. Asal Sekolah */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Asal Sekolah <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={school}
                    onChange={(e) => setSchool(e.target.value)}
                    placeholder="Contoh: SMAN 1 Teladan Jakarta"
                    className={`w-full pl-9 pr-3 py-2.5 bg-slate-800/80 border rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 transition ${
                      errors.school
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-slate-700 focus:border-red-500 focus:ring-red-500/20'
                    }`}
                  />
                </div>
                {errors.school && (
                  <p className="text-xs text-red-400 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.school}
                  </p>
                )}
              </div>

              {/* Privacy Notice */}
              <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/60 text-[11px] text-slate-400 flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Privasi Aman:</strong> Data profil disimpan secara lokal di peramban Anda. Tidak ada kata sandi yang diminta dan data tidak diunggah ke peladen pihak ketiga.
                </span>
              </div>

              {/* Action Button: Preview */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 px-4 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold rounded-xl shadow-lg shadow-red-900/30 transition transform active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Eye className="w-4 h-4" />
                  Pratinjau Identitas
                </button>
              </div>
            </form>
          ) : (
            /* Student Identity Card Preview */
            <div className="space-y-5 animate-fadeIn">
              <div className="text-center">
                <span className="text-xs font-semibold text-red-400 uppercase tracking-wider">
                  Pratinjau Kartu Siswa SMANKAIH
                </span>
                <h3 className="text-base font-bold text-white">
                  Periksa Kembali Data Anda
                </h3>
              </div>

              {/* Preview Badge Card */}
              <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-5 rounded-2xl border-2 border-red-500/40 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-red-600/10 rounded-full blur-xl" />
                
                <div className="flex items-center justify-between border-b border-slate-700/80 pb-3 mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-4 bg-red-600 rounded-sm shadow border border-white/20 flex flex-col">
                      <div className="flex-1 bg-red-600" />
                      <div className="flex-1 bg-white" />
                    </div>
                    <span className="text-xs font-extrabold text-white tracking-widest">
                      SMANKAIH PELAJAR
                    </span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-900/50 text-red-200 border border-red-700/50">
                    Aktif
                  </span>
                </div>

                <div className="space-y-2.5 text-xs">
                  <div className="flex justify-between items-center py-1 border-b border-slate-700/40">
                    <span className="text-slate-400">Nama Lengkap</span>
                    <span className="font-bold text-white text-sm">{fullName}</span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-slate-700/40">
                    <span className="text-slate-400">Umur</span>
                    <span className="font-semibold text-slate-200">{age} Tahun</span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-slate-700/40">
                    <span className="text-slate-400">Kelas</span>
                    <span className="font-semibold text-slate-200">{grade}</span>
                  </div>
                  <div className="flex justify-between items-center py-1">
                    <span className="text-slate-400">Asal Sekolah</span>
                    <span className="font-semibold text-slate-200">{school}</span>
                  </div>
                </div>
              </div>

              {/* Confirmation Notice */}
              <p className="text-[11px] text-slate-400 text-center leading-relaxed">
                Profil ini akan digunakan dalam pemantauan kebiasaan harian dan pencetakan Laporan Aktivitas SMANKAIH.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    handleFinalSubmit();
                  }}
                  className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-500 hover:to-rose-500 text-white font-extrabold text-xs tracking-wide shadow-xl shadow-red-900/40 transition transform active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>MULAI PERJALANAN SMANKAIH + MUSIK PATRIOTIK</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setShowPreview(false)}
                    className="w-1/2 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs border border-slate-700 transition cursor-pointer"
                  >
                    Ubah Data
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      sessionStorage.setItem('smankaih_skip_music_initial', 'true');
                      handleFinalSubmit();
                    }}
                    className="w-1/2 py-2 px-3 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-slate-200 font-semibold text-xs border border-slate-700/60 transition cursor-pointer"
                  >
                    Mulai SMANKAIH Saja
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
