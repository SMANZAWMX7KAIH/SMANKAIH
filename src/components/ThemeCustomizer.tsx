import React, { useState, useRef } from 'react';
import { 
  Palette, 
  Image as ImageIcon, 
  Upload, 
  RotateCcw, 
  Sliders, 
  Check, 
  Sparkles, 
  Layers, 
  Eye, 
  AlertTriangle,
  Sun,
  Moon,
  Flag,
  Compass,
  TreePine,
  CheckCircle2,
  Brush,
  Maximize2
} from 'lucide-react';
import { BACKGROUND_PRESETS } from '../data/backgroundsData';
import { BackgroundPreset, ThemeConfig, ThemeMode } from '../types';
import { 
  DEFAULT_THEME_CONFIG, 
  saveCustomBackgroundToDB, 
  removeCustomBackgroundFromDB, 
  saveTheme 
} from '../utils/storage';

interface ThemeCustomizerProps {
  themeConfig: ThemeConfig;
  onThemeChange: (newConfig: ThemeConfig) => void;
}

const THEME_MODES: {
  id: ThemeMode;
  name: string;
  badge: string;
  icon: any;
  desc: string;
  presetId: string;
  accent: string;
  isDark: boolean;
  colorPreview: string;
}[] = [
  {
    id: 'light',
    name: 'Tema Terang',
    badge: 'Cahaya Embun',
    icon: Sun,
    desc: 'Latar cerah segar, kartu putih bersih, dan teks kontras tinggi untuk siang hari.',
    presetId: 'mode-light-embun',
    accent: 'red',
    isDark: false,
    colorPreview: 'linear-gradient(135deg, #ffffff 0%, #f1f5f9 100%)',
  },
  {
    id: 'dark',
    name: 'Tema Gelap',
    badge: 'Obsidian Malam',
    icon: Moon,
    desc: 'Latar gelap elegan, ramah mata saat malam hari dan menghemat baterai HP.',
    presetId: 'mode-dark-obsidian',
    accent: 'red',
    isDark: true,
    colorPreview: 'linear-gradient(135deg, #090d16 0%, #1e293b 100%)',
  },
  {
    id: 'merah-putih',
    name: 'Tema Merah Putih',
    badge: 'Patriotik Bangsa',
    icon: Flag,
    desc: 'Semangat Sang Saka Merah Putih, nuansa merah garuda berwibawa khas Indonesia.',
    presetId: 'gradient-merah-putih',
    accent: 'red',
    isDark: true,
    colorPreview: 'linear-gradient(135deg, #7f1d1d 0%, #450a0a 100%)',
  },
  {
    id: 'anime',
    name: 'Tema Anime Pelajar',
    badge: 'Senja Fajar Hebat',
    icon: Sparkles,
    desc: 'Gradasi senja fajar anime inspiratif membangkitkan tekad belajar pelajar hebat.',
    presetId: 'anime-garuda-dawn',
    accent: 'rose',
    isDark: true,
    colorPreview: 'linear-gradient(135deg, #4c0519 0%, #1e1b4b 100%)',
  },
  {
    id: 'alam',
    name: 'Tema Alam Nusantara',
    badge: 'Zamrud Khatulistiwa',
    icon: TreePine,
    desc: 'Kesegaran hutan tropis dan keindahan pegunungan nusantara yang menyejukkan.',
    presetId: 'nature-nusantara',
    accent: 'emerald',
    isDark: true,
    colorPreview: 'linear-gradient(135deg, #022c22 0%, #064e3b 100%)',
  },
  {
    id: 'minimalis',
    name: 'Tema Minimalis Modern',
    badge: 'Fokus Belajar',
    icon: Compass,
    desc: 'Desain bersih bergradasi abu-kebiruan bebas distraksi agar belajar lebih fokus.',
    presetId: 'minimal-modern-slate',
    accent: 'sky',
    isDark: true,
    colorPreview: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
  },
];

const ACCENT_COLORS = [
  { id: 'red', name: 'Merah Putih Semangat', class: 'bg-red-600', ring: 'ring-red-500' },
  { id: 'emerald', name: 'Hijau Nusantara Sehat', class: 'bg-emerald-600', ring: 'ring-emerald-500' },
  { id: 'sky', name: 'Biru Bahari Khatulistiwa', class: 'bg-sky-600', ring: 'ring-sky-500' },
  { id: 'amber', name: 'Kuning Surya Pagi', class: 'bg-amber-600', ring: 'ring-amber-500' },
  { id: 'indigo', name: 'Ungu Gemar Belajar', class: 'bg-indigo-600', ring: 'ring-indigo-500' },
  { id: 'rose', name: 'Mawar Gotong Royong', class: 'bg-rose-600', ring: 'ring-rose-500' },
];

const SOLID_COLORS = [
  { id: '#090d16', name: 'Hitam Obsidian', class: 'bg-[#090d16]' },
  { id: '#450a0a', name: 'Merah Tua Nusantara', class: 'bg-[#450a0a]' },
  { id: '#022c22', name: 'Hijau Rimba Tropis', class: 'bg-[#022c22]' },
  { id: '#1e1b4b', name: 'Biru Malam Langit', class: 'bg-[#1e1b4b]' },
  { id: '#0f172a', name: 'Slate Modern', class: 'bg-[#0f172a]' },
  { id: '#f1f5f9', name: 'Putih Embun Bersih', class: 'bg-[#f1f5f9] border border-slate-300' },
];

export const ThemeCustomizer: React.FC<ThemeCustomizerProps> = ({
  themeConfig,
  onThemeChange,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const [tempUploadedDataUrl, setTempUploadedDataUrl] = useState<string | null>(null);
  const [applySuccessMessage, setApplySuccessMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const categories = ['Semua', ...Array.from(new Set(BACKGROUND_PRESETS.map((p) => p.category)))];

  const filteredPresets = selectedCategory === 'Semua'
    ? BACKGROUND_PRESETS
    : BACKGROUND_PRESETS.filter((p) => p.category === selectedCategory);

  const currentPreset = BACKGROUND_PRESETS.find((p) => p.id === themeConfig.presetId) || BACKGROUND_PRESETS[0];

  const showNotification = (msg: string) => {
    setApplySuccessMessage(msg);
    setTimeout(() => setApplySuccessMessage(null), 3000);
  };

  // 1. Handle Selecting Theme Mode (Terang, Gelap, Merah Putih, Anime, Alam, Minimalis)
  const handleSelectThemeMode = (mode: typeof THEME_MODES[0]) => {
    const updated: ThemeConfig = {
      ...themeConfig,
      themeMode: mode.id,
      presetId: mode.presetId,
      isDarkMode: mode.isDark,
      useCustomImage: false,
      useCustomColor: false,
      accentColor: mode.accent,
      overlayOpacity: mode.id === 'light' ? 20 : 45,
    };
    saveTheme(updated);
    onThemeChange(updated);
    showNotification(`Tema "${mode.name}" berhasil diterapkan!`);
  };

  // 2. Handle Selecting Preset from Gallery
  const handleSelectPreset = (preset: BackgroundPreset) => {
    const isLight = preset.id === 'mode-light-embun';
    let detectedThemeMode: ThemeMode = isLight ? 'light' : 'dark';
    if (preset.category.includes('Alam')) detectedThemeMode = 'alam';
    else if (preset.category.includes('Merah Putih') || preset.id === 'gradient-merah-putih') detectedThemeMode = 'merah-putih';
    else if (preset.category.includes('Anime')) detectedThemeMode = 'anime';
    else if (preset.category.includes('Minimalis')) detectedThemeMode = 'minimalis';

    const updated: ThemeConfig = {
      ...themeConfig,
      presetId: preset.id,
      themeMode: detectedThemeMode,
      isDarkMode: !isLight,
      useCustomImage: false,
      useCustomColor: false,
      accentColor: preset.accentMatch || themeConfig.accentColor,
    };
    saveTheme(updated);
    onThemeChange(updated);
    showNotification(`Background "${preset.name}" berhasil diterapkan!`);
  };

  // 3. Handle Selecting Solid Color
  const handleSelectSolidColor = (colorHex: string) => {
    const isLight = colorHex === '#f1f5f9';
    const updated: ThemeConfig = {
      ...themeConfig,
      useCustomColor: true,
      customColor: colorHex,
      useCustomImage: false,
      themeMode: isLight ? 'light' : 'dark',
      isDarkMode: !isLight,
      overlayOpacity: isLight ? 10 : 30,
    };
    saveTheme(updated);
    onThemeChange(updated);
    showNotification(`Warna background khusus berhasil diterapkan!`);
  };

  // 4. Handle Overlay Change
  const handleOverlayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    const updated: ThemeConfig = {
      ...themeConfig,
      overlayOpacity: val,
    };
    saveTheme(updated);
    onThemeChange(updated);
  };

  // 5. Handle Fit Mode Change
  const handleFitModeChange = (mode: 'cover' | 'contain' | 'fill') => {
    const updated: ThemeConfig = {
      ...themeConfig,
      fitMode: mode,
    };
    saveTheme(updated);
    onThemeChange(updated);
  };

  // 6. Handle Position Change
  const handlePositionChange = (pos: 'center' | 'top' | 'bottom') => {
    const updated: ThemeConfig = {
      ...themeConfig,
      position: pos,
    };
    saveTheme(updated);
    onThemeChange(updated);
  };

  // 7. Handle Accent Change
  const handleAccentChange = (accentId: string) => {
    const updated: ThemeConfig = {
      ...themeConfig,
      accentColor: accentId,
    };
    saveTheme(updated);
    onThemeChange(updated);
  };

  // 8. Handle Reset To Default
  const handleResetToDefault = async () => {
    await removeCustomBackgroundFromDB('user_custom_bg');
    setTempUploadedDataUrl(null);
    setUploadError(null);
    saveTheme(DEFAULT_THEME_CONFIG);
    onThemeChange(DEFAULT_THEME_CONFIG);
    showNotification('Tema dan background berhasil dikembalikan ke pengaturan awal!');
  };

  // 9. Handle File Upload from HP Gallery
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError(null);
    setIsProcessingImage(true);

    if (file.size > 12 * 1024 * 1024) {
      setUploadError('Ukuran gambar maksimal 12MB. Silakan pilih foto yang lebih kecil.');
      setIsProcessingImage(false);
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;

      img.onload = () => {
        try {
          // Scale down if image is huge to optimize browser memory
          let targetWidth = img.width;
          let targetHeight = img.height;
          const maxDim = 1920;

          if (targetWidth > maxDim || targetHeight > maxDim) {
            if (targetWidth > targetHeight) {
              targetHeight = Math.round((targetHeight * maxDim) / targetWidth);
              targetWidth = maxDim;
            } else {
              targetWidth = Math.round((targetWidth * maxDim) / targetHeight);
              targetHeight = maxDim;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = targetWidth;
          canvas.height = targetHeight;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
            const optimizedDataUrl = canvas.toDataURL('image/jpeg', 0.88);
            // Put in preview state for user approval
            setTempUploadedDataUrl(optimizedDataUrl);
          }
        } catch (err) {
          console.error(err);
          setUploadError('Gagal memproses gambar. Format mungkin tidak didukung.');
        } finally {
          setIsProcessingImage(false);
        }
      };

      img.onerror = () => {
        setUploadError('File bukan format gambar yang valid.');
        setIsProcessingImage(false);
      };
    };

    reader.onerror = () => {
      setUploadError('Gagal membaca gambar dari perangkat.');
      setIsProcessingImage(false);
    };

    reader.readAsDataURL(file);
  };

  // 10. Handle Apply Imported Background
  const handleApplyCustomBackground = async () => {
    if (!tempUploadedDataUrl) return;

    try {
      const saved = await saveCustomBackgroundToDB('user_custom_bg', tempUploadedDataUrl);
      if (saved) {
        const updated: ThemeConfig = {
          ...themeConfig,
          useCustomImage: true,
          useCustomColor: false,
          customImageKey: 'user_custom_bg',
          customImageDataUrl: tempUploadedDataUrl,
        };
        saveTheme(updated);
        onThemeChange(updated);
        showNotification('Background foto berhasil diterapkan ke seluruh website!');
      } else {
        setUploadError('Gagal menyimpan gambar ke penyimpanan lokal browser.');
      }
    } catch {
      setUploadError('Terjadi kesalahan saat menerapkan background.');
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 select-none animate-fadeIn">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Palette className="w-6 h-6 text-red-500" />
            <h1 className="text-2xl font-black theme-text tracking-tight">
              Personalisasi Tema & Background
            </h1>
          </div>
          <p className="text-xs theme-text-muted mt-1">
            Ubah tema dan latar belakang seketika: pilih mode tema, galeri gambar bawaan, warna kustom, atau impor foto dari HP Anda.
          </p>
        </div>

        <button
          onClick={handleResetToDefault}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-750 text-slate-200 font-semibold text-xs border border-slate-700 transition cursor-pointer shadow"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Kembalikan ke Awal</span>
        </button>
      </div>

      {/* Floating Success Notification */}
      {applySuccessMessage && (
        <div className="p-3 rounded-2xl bg-emerald-600 text-white font-bold text-xs flex items-center gap-2 shadow-xl animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{applySuccessMessage}</span>
        </div>
      )}

      {/* SECTION 1: 6 MODE TEMA UTAMA (Terang, Gelap, Merah Putih, Anime, Alam, Minimalis) */}
      <div className="theme-surface p-5 sm:p-6 rounded-3xl border shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b pb-3 border-slate-700/50">
          <div>
            <h2 className="text-base font-extrabold theme-text flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-red-500" />
              Pilihan Mode Tema (6 Gaya Visual)
            </h2>
            <p className="text-xs theme-text-muted mt-0.5">
              Klik salah satu mode untuk mengubah seluruh tampilan (latar, kartu, teks, navigasi, dan tombol) secara langsung.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {THEME_MODES.map((mode) => {
            const isCurrentActive =
              !themeConfig.useCustomImage &&
              !themeConfig.useCustomColor &&
              themeConfig.themeMode === mode.id;
            const Icon = mode.icon;

            return (
              <div
                key={mode.id}
                onClick={() => handleSelectThemeMode(mode)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between group ${
                  isCurrentActive
                    ? 'ring-2 ring-red-500 bg-red-600/10 border-red-500 shadow-lg'
                    : 'bg-slate-800/50 hover:bg-slate-800/80 border-slate-700/60'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-8 h-8 rounded-xl flex items-center justify-center shadow"
                        style={{ background: mode.colorPreview }}
                      >
                        <Icon className={`w-4 h-4 ${mode.id === 'light' ? 'text-slate-900' : 'text-white'}`} />
                      </div>
                      <span className="font-extrabold text-sm theme-text">{mode.name}</span>
                    </div>

                    {isCurrentActive ? (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-600 text-white font-bold flex items-center gap-1 shadow">
                        <Check className="w-3 h-3" />
                        Aktif
                      </span>
                    ) : (
                      <span className="text-[10px] px-2 py-0.5 rounded bg-slate-700 text-slate-300 font-mono">
                        {mode.badge}
                      </span>
                    )}
                  </div>

                  <p className="text-xs theme-text-muted leading-relaxed line-clamp-2">
                    {mode.desc}
                  </p>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-700/40 flex items-center justify-between">
                  <span className="text-[11px] theme-text-muted">Ganti ke tema ini</span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectThemeMode(mode);
                    }}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                      isCurrentActive
                        ? 'bg-red-600 text-white'
                        : 'bg-slate-700 hover:bg-slate-600 text-white'
                    }`}
                  >
                    {isCurrentActive ? 'Diterapkan' : 'Terapkan'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 2: IMPOR GAMBAR DARI GALERI HP & WARNA KUSTOM */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Kolom Kiri: Impor Gambar Galeri & Pengaturan (5 Cols) */}
        <div className="lg:col-span-5 space-y-5 theme-surface p-5 sm:p-6 rounded-3xl border shadow-xl">
          <h2 className="font-extrabold text-base theme-text flex items-center gap-2 pb-3 border-b border-slate-700/50">
            <Upload className="w-4 h-4 text-red-500" />
            Impor Gambar dari Galeri HP
          </h2>

          <div className="space-y-3">
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isProcessingImage}
              className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer shadow-lg shadow-red-900/30 disabled:opacity-50"
            >
              <Upload className="w-4 h-4" />
              <span>{isProcessingImage ? 'Memproses Foto...' : 'Pilih Foto dari Galeri HP / PC'}</span>
            </button>

            {uploadError && (
              <div className="p-3 rounded-xl bg-red-950/60 border border-red-800 text-xs text-red-300 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
                <span>{uploadError}</span>
              </div>
            )}

            {/* Pratinjau Gambar Impor Baru */}
            {tempUploadedDataUrl && (
              <div className="p-4 rounded-2xl bg-slate-800/80 border border-red-500/50 space-y-3 animate-fadeIn">
                <div className="flex items-center justify-between text-xs font-bold theme-text">
                  <span className="flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5 text-red-400" />
                    Pratinjau Foto Anda
                  </span>
                  <span className="text-[10px] text-amber-400 font-normal">Siap Diterapkan</span>
                </div>

                <div className="w-full h-36 rounded-xl overflow-hidden border border-slate-700 relative bg-black/40">
                  <img
                    src={tempUploadedDataUrl}
                    alt="Pratinjau Background"
                    className="w-full h-full object-cover"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleApplyCustomBackground}
                  className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/40 transition cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>Terapkan Background Ini Sekarang</span>
                </button>
              </div>
            )}

            {themeConfig.useCustomImage && (
              <div className="p-3 rounded-xl bg-emerald-950/50 border border-emerald-800/60 text-xs text-emerald-300 flex items-center justify-between">
                <span>✓ Foto dari galeri sedang aktif</span>
                <button
                  onClick={() => handleSelectPreset(currentPreset)}
                  className="text-xs text-red-400 hover:text-red-300 underline font-semibold cursor-pointer"
                >
                  Ganti ke Galeri
                </button>
              </div>
            )}
          </div>

          {/* Posisi & Penyesuaian Ukuran Gambar */}
          <div className="space-y-3 pt-3 border-t border-slate-700/50">
            <div>
              <label className="block text-xs font-bold theme-text uppercase tracking-wider mb-1.5">
                Posisi Gambar
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'top', label: 'Atas (Top)' },
                  { id: 'center', label: 'Tengah' },
                  { id: 'bottom', label: 'Bawah (Bot)' },
                ].map((pos) => (
                  <button
                    key={pos.id}
                    onClick={() => handlePositionChange(pos.id as any)}
                    className={`py-1.5 px-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
                      themeConfig.position === pos.id
                        ? 'bg-red-600 text-white shadow'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {pos.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold theme-text uppercase tracking-wider mb-1.5">
                Penyesuaian Ukuran
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'cover', label: 'Menutupi' },
                  { id: 'contain', label: 'Sesuaikan' },
                  { id: 'fill', label: 'Penuhi' },
                ].map((m) => (
                  <button
                    key={m.id}
                    onClick={() => handleFitModeChange(m.id as any)}
                    className={`py-1.5 px-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
                      themeConfig.fitMode === m.id
                        ? 'bg-red-600 text-white shadow'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Overlay Opacity Slider */}
            <div>
              <div className="flex justify-between items-center text-xs mb-1">
                <label className="font-bold theme-text uppercase tracking-wider">
                  Tingkat Gelap / Terang Overlay
                </label>
                <span className="font-mono text-red-400 font-bold">
                  {themeConfig.overlayOpacity}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="90"
                step="5"
                value={themeConfig.overlayOpacity}
                onChange={handleOverlayChange}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-red-500"
              />
              <p className="text-[10px] theme-text-muted mt-1 leading-tight">
                Sesuaikan lapisan transparan agar tulisan di atas gambar latar tetap sangat mudah dibaca.
              </p>
            </div>

            {/* Warna Background Polos Kustom */}
            <div className="pt-2">
              <label className="block text-xs font-bold theme-text uppercase tracking-wider mb-2">
                Atau Pilih Warna Polos Kustom
              </label>
              <div className="grid grid-cols-6 gap-2">
                {SOLID_COLORS.map((col) => (
                  <button
                    key={col.id}
                    onClick={() => handleSelectSolidColor(col.id)}
                    title={col.name}
                    className={`h-8 rounded-xl ${col.class} transition cursor-pointer flex items-center justify-center ${
                      themeConfig.useCustomColor && themeConfig.customColor === col.id
                        ? 'ring-2 ring-red-500 scale-105'
                        : 'hover:scale-105'
                    }`}
                  >
                    {themeConfig.useCustomColor && themeConfig.customColor === col.id && (
                      <Check className={`w-4 h-4 ${col.id === '#f1f5f9' ? 'text-slate-900' : 'text-white'}`} />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Kolom Kanan: Galeri Background Gambar Bawaan (7 Cols) */}
        <div className="lg:col-span-7 space-y-4 theme-surface p-5 sm:p-6 rounded-3xl border shadow-xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-700/50">
            <div>
              <h2 className="font-extrabold text-base theme-text flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-red-500" />
                Galeri Background Gambar Bawaan
              </h2>
              <p className="text-xs theme-text-muted mt-0.5">
                Koleksi gambar pemandangan anime, bendera Merah Putih, alam, dan suasana sekolah.
              </p>
            </div>

            {/* Filter Kategori */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
              {categories.slice(0, 5).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap transition cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-red-600 text-white'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Grid Galeri */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 max-h-[480px] overflow-y-auto pr-1">
            {filteredPresets.map((preset) => {
              const isSelected =
                !themeConfig.useCustomImage &&
                !themeConfig.useCustomColor &&
                themeConfig.presetId === preset.id;

              return (
                <div
                  key={preset.id}
                  onClick={() => handleSelectPreset(preset)}
                  className={`group rounded-2xl border overflow-hidden p-3 transition cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-slate-800/90 border-red-500 ring-2 ring-red-500/50 shadow-lg'
                      : 'bg-slate-800/40 hover:bg-slate-800/70 border-slate-700/60'
                  }`}
                >
                  <div>
                    {/* Visual Box Thumbnail */}
                    <div
                      className="w-full h-24 rounded-xl border border-white/10 shadow-inner mb-2.5 relative flex items-center justify-center overflow-hidden"
                      style={{ backgroundImage: preset.previewStyle }}
                    >
                      {isSelected && (
                        <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-red-600 text-white text-[10px] font-bold shadow flex items-center gap-1">
                          <Check className="w-3 h-3" />
                          Aktif
                        </div>
                      )}
                      <span className="text-[10px] font-mono text-white/90 bg-black/50 px-2 py-0.5 rounded backdrop-blur-sm">
                        {preset.category}
                      </span>
                    </div>

                    <h4 className="font-bold text-sm theme-text group-hover:text-red-400 transition">
                      {preset.name}
                    </h4>
                    <p className="text-[11px] theme-text-muted line-clamp-2 mt-0.5">
                      {preset.description}
                    </p>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-700/40 flex items-center justify-between text-[11px]">
                    <span className="theme-text-muted">Pilih latar ini</span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectPreset(preset);
                      }}
                      className={`px-3 py-1 rounded-lg font-bold text-xs transition cursor-pointer ${
                        isSelected
                          ? 'bg-red-600 text-white shadow'
                          : 'bg-slate-700 hover:bg-slate-600 text-white'
                      }`}
                    >
                      {isSelected ? 'Diterapkan' : 'Terapkan'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
