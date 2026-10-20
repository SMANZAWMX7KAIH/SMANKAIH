/**
 * Type definitions for 7KAIH application
 */

export type HabitId = 
  | 'bangun-pagi'
  | 'beribadah'
  | 'berolahraga'
  | 'makan-sehat'
  | 'gemar-belajar'
  | 'bermasyarakat'
  | 'tidur-cepat';

export interface UserProfile {
  fullName: string;
  age: number;
  grade: string;
  school: string;
  joinedAt: string;
}

export interface HabitDefinition {
  id: HabitId;
  order: number;
  title: string;
  subtitle: string;
  description: string;
  defaultTargetTime: string;
  iconName: string;
  colorScheme: {
    primary: string;
    bgBadge: string;
    textBadge: string;
    border: string;
    glow: string;
  };
  benefits: string[];
  actionableTips: string[];
  inspirationalQuote: string;
  animeScenePrompt: string;
}

export interface HabitLog {
  habitId: HabitId;
  completed: boolean;
  completedAt?: string; // ISO string or time string e.g. "05:15"
  targetTime: string; // e.g. "05:00"
  notes?: string;
  reflection?: string;
}

export interface DayRecord {
  date: string; // YYYY-MM-DD
  habits: Record<HabitId, HabitLog>;
  lastUpdated: string;
}

export interface BackgroundPreset {
  id: string;
  name: string;
  category: 
    | 'Anime Pelajar Indonesia'
    | 'Pelajar & Bendera Merah Putih'
    | 'Suasana Sekolah Indonesia'
    | 'Semangat Belajar'
    | 'Matahari Terbit'
    | 'Olahraga & Gaya Hidup'
    | 'Alam Indonesia'
    | 'Langit & Galaksi'
    | 'Minimalis Modern'
    | 'Gradasi Warna'
    | 'Tema Khusus';
  type: 'css-art' | 'gradient' | 'svg-scene' | 'url';
  previewStyle: string;
  fullStyle: string;
  description: string;
  accentMatch: string;
}

export type ThemeMode = 'dark' | 'light' | 'merah-putih' | 'anime' | 'alam' | 'minimalis';

export interface ThemeConfig {
  themeMode: ThemeMode;
  presetId: string;
  useCustomImage: boolean;
  customImageKey?: string; // key in IndexedDB
  customImageDataUrl?: string; // fallback preview
  useCustomColor?: boolean;
  customColor?: string;
  fitMode: 'cover' | 'contain' | 'fill';
  position: 'center' | 'top' | 'bottom';
  overlayOpacity: number; // 0 to 90 percent
  accentColor: string; // e.g. 'red', 'emerald', 'sky', 'amber', 'indigo', 'rose'
  isDarkMode: boolean;
}

export interface SongTrack {
  id: 'indonesia-raya' | 'bangun-pemudi-pemuda';
  title: string;
  subtitle: string;
  composer: string;
  mp3Path: string;
  description: string;
  tempo: string;
}
