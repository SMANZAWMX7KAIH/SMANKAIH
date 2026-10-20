import React, { useState } from 'react';
import { 
  X, 
  User, 
  Calendar, 
  GraduationCap, 
  Building2, 
  Save, 
  Trash2, 
  AlertTriangle, 
  ShieldAlert, 
  LogOut,
  Info
} from 'lucide-react';
import { UserProfile } from '../types';
import { saveProfile, clearAll7KAIHData } from '../utils/storage';

interface ProfileModalProps {
  user: UserProfile;
  onUpdate: (updated: UserProfile) => void;
  onLogout: () => void;
  onClose: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  user,
  onUpdate,
  onLogout,
  onClose,
}) => {
  const [fullName, setFullName] = useState(user.fullName);
  const [age, setAge] = useState(user.age.toString());
  const [grade, setGrade] = useState(user.grade);
  const [school, setSchool] = useState(user.school);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !school.trim() || !grade.trim()) {
      setErrorMsg('Semua kolom identitas wajib diisi dan tidak boleh hanya spasi.');
      return;
    }
    const ageNum = parseInt(age, 10);
    if (isNaN(ageNum) || ageNum < 6 || ageNum > 35) {
      setErrorMsg('Umur harus angka valid antara 6 hingga 35 tahun.');
      return;
    }

    const updated: UserProfile = {
      ...user,
      fullName: fullName.trim(),
      age: ageNum,
      grade: grade.trim(),
      school: school.trim(),
    };

    saveProfile(updated);
    onUpdate(updated);
    onClose();
  };

  const handleConfirmClearAll = async () => {
    await clearAll7KAIHData();
    window.location.reload();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto select-none">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden my-8 text-left animate-fadeIn">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-red-600 to-rose-700 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold text-base">
              {fullName.charAt(0).toUpperCase() || 'S'}
            </div>
            <div>
              <h2 className="font-extrabold text-lg text-white">Profil & Data Pelajar</h2>
              <p className="text-xs text-red-100">SMANKAIH — 7 Kebiasaan Anak Indonesia Hebat</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-black/20 hover:bg-black/40 text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Form */}
        <div className="p-6 space-y-5">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-950/50 border border-red-800 text-xs text-red-300">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Nama Lengkap
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3 top-3 pointer-events-none" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-red-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Umur
                </label>
                <div className="relative">
                  <Calendar className="w-4 h-4 text-slate-500 absolute left-3 top-3 pointer-events-none" />
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Kelas
                </label>
                <div className="relative">
                  <GraduationCap className="w-4 h-4 text-slate-500 absolute left-3 top-3 pointer-events-none" />
                  <input
                    type="text"
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-red-500"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Asal Sekolah
              </label>
              <div className="relative">
                <Building2 className="w-4 h-4 text-slate-500 absolute left-3 top-3 pointer-events-none" />
                <input
                  type="text"
                  value={school}
                  onChange={(e) => setSchool(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-red-500"
                />
              </div>
            </div>

            <div className="pt-2 flex gap-3">
              <button
                type="submit"
                className="flex-1 py-2.5 px-4 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl text-xs transition flex items-center justify-center gap-1.5 cursor-pointer shadow"
              >
                <Save className="w-4 h-4" />
                Simpan Perubahan
              </button>
              <button
                type="button"
                onClick={onClose}
                className="py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl text-xs transition cursor-pointer"
              >
                Batal
              </button>
            </div>
          </form>

          {/* Privacy info note */}
          <div className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/60 text-[11px] text-slate-400 flex items-start gap-2">
            <Info className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
            <span>
              Profil ini disimpan secara lokal di peramban perangkat Anda dan tidak disinkronisasikan ke perangkat lain.
            </span>
          </div>

          {/* Danger Zone: Reset & Logout */}
          <div className="pt-4 border-t border-slate-800 space-y-3">
            <div className="flex justify-between items-center">
              <button
                type="button"
                onClick={onLogout}
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 transition cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Ganti Akun / Logout</span>
              </button>

              <button
                type="button"
                onClick={() => setShowDeleteConfirm(!showDeleteConfirm)}
                className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1 transition cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Reset Semua Data</span>
              </button>
            </div>

            {showDeleteConfirm && (
              <div className="p-4 rounded-2xl bg-red-950/60 border border-red-800/80 space-y-3 animate-fadeIn">
                <div className="flex items-start gap-2 text-xs text-red-200">
                  <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block font-bold">Konfirmasi Hapus Seluruh Data</strong>
                    Apakah Anda yakin ingin menghapus seluruh data profil, riwayat checklist harian, dan background custom? Tindakan ini permanen dan tidak dapat dibatalkan.
                  </div>
                </div>

                <div className="flex gap-2 justify-end">
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs font-semibold"
                  >
                    Batal
                  </button>
                  <button
                    onClick={handleConfirmClearAll}
                    className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-bold"
                  >
                    Ya, Hapus Semua Data
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
