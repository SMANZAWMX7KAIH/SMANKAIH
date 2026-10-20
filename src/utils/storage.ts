/**
 * Local storage & IndexedDB utilities for 7KAIH
 */
import { UserProfile, DayRecord, HabitId, ThemeConfig } from '../types';
import { formatDeviceDate, getLocalDateString } from './dateUtils';

const STORAGE_KEYS = {
  PROFILE: '7kaih_user_profile_v1',
  RECORDS: '7kaih_daily_records_v1',
  THEME: '7kaih_theme_config_v1',
  HAS_SEEN_INTRO: '7kaih_has_seen_intro_v1',
  MUSIC_PREFS: '7kaih_music_prefs_v1',
  TARGET_TIMES: '7kaih_habit_target_times_v1',
};

// IndexedDB database for large custom background images
const DB_NAME = '7kaih_assets_db';
const DB_VERSION = 1;
const STORE_NAME = 'custom_backgrounds';

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB not supported'));
      return;
    }
    const request = window.indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function saveCustomBackgroundToDB(key: string, dataUrl: string): Promise<boolean> {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.put(dataUrl, key);
      req.onsuccess = () => resolve(true);
      req.onerror = () => resolve(false);
    });
  } catch (err) {
    console.warn('IndexedDB save failed, falling back to memory/session', err);
    return false;
  }
}

export async function getCustomBackgroundFromDB(key: string): Promise<string | null> {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(key);
      req.onsuccess = () => resolve((req.result as string) || null);
      req.onerror = () => resolve(null);
    });
  } catch {
    return null;
  }
}

export async function removeCustomBackgroundFromDB(key: string): Promise<boolean> {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.delete(key);
      req.onsuccess = () => resolve(true);
      req.onerror = () => resolve(false);
    });
  } catch {
    return false;
  }
}

// User Profile
export function getSavedProfile(): UserProfile | null {
  try {
    const item = localStorage.getItem(STORAGE_KEYS.PROFILE);
    if (!item) return null;
    return JSON.parse(item) as UserProfile;
  } catch (e) {
    console.error('Error reading profile', e);
    return null;
  }
}

export function saveProfile(profile: UserProfile): void {
  try {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
  } catch (e) {
    console.error('Error saving profile', e);
  }
}

export function removeProfile(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.PROFILE);
  } catch (e) {
    console.error('Error removing profile', e);
  }
}

// Daily Records
export function getAllRecords(): Record<string, DayRecord> {
  try {
    const item = localStorage.getItem(STORAGE_KEYS.RECORDS);
    if (!item) return {};
    return JSON.parse(item);
  } catch {
    return {};
  }
}

export function getRecordForDate(dateStr: string): DayRecord | null {
  const records = getAllRecords();
  return records[dateStr] || null;
}

export function saveHabitStatus(
  dateStr: string,
  habitId: HabitId,
  completed: boolean,
  targetTime: string,
  notes?: string,
  reflection?: string
): DayRecord {
  const records = getAllRecords();
  const existing = records[dateStr] || {
    date: dateStr,
    habits: {} as Record<HabitId, any>,
    lastUpdated: new Date().toISOString(),
  };

  const now = new Date();
  const timeFormatted = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

  existing.habits[habitId] = {
    habitId,
    completed,
    completedAt: completed ? (existing.habits[habitId]?.completedAt || timeFormatted) : undefined,
    targetTime: targetTime || existing.habits[habitId]?.targetTime || '06:00',
    notes: notes !== undefined ? notes : existing.habits[habitId]?.notes || '',
    reflection: reflection !== undefined ? reflection : existing.habits[habitId]?.reflection || '',
  };
  existing.lastUpdated = new Date().toISOString();

  records[dateStr] = existing;
  try {
    localStorage.setItem(STORAGE_KEYS.RECORDS, JSON.stringify(records));
  } catch (e) {
    console.error('Error saving records', e);
  }

  return existing;
}

// Target times preference map
export function getSavedTargetTimes(): Record<HabitId, string> {
  try {
    const item = localStorage.getItem(STORAGE_KEYS.TARGET_TIMES);
    if (!item) return {} as Record<HabitId, string>;
    return JSON.parse(item);
  } catch {
    return {} as Record<HabitId, string>;
  }
}

export function saveTargetTime(habitId: HabitId, time: string): void {
  try {
    const current = getSavedTargetTimes();
    current[habitId] = time;
    localStorage.setItem(STORAGE_KEYS.TARGET_TIMES, JSON.stringify(current));
  } catch (e) {
    console.error('Error saving target time', e);
  }
}

// Theme Config
export const DEFAULT_THEME_CONFIG: ThemeConfig = {
  themeMode: 'dark',
  presetId: 'anime-garuda-dawn',
  useCustomImage: false,
  useCustomColor: false,
  fitMode: 'cover',
  position: 'center',
  overlayOpacity: 45,
  accentColor: 'red',
  isDarkMode: true,
};

export function getSavedTheme(): ThemeConfig {
  try {
    const item = localStorage.getItem(STORAGE_KEYS.THEME);
    if (!item) return DEFAULT_THEME_CONFIG;
    return { ...DEFAULT_THEME_CONFIG, ...JSON.parse(item) };
  } catch {
    return DEFAULT_THEME_CONFIG;
  }
}

export function saveTheme(theme: ThemeConfig): void {
  try {
    // Exclude large dataUrl from localStorage to avoid quota issues; it is kept in IndexedDB
    const safeToStore = { ...theme, customImageDataUrl: undefined };
    localStorage.setItem(STORAGE_KEYS.THEME, JSON.stringify(safeToStore));
  } catch (e) {
    console.error('Error saving theme', e);
  }
}

// Reset all SMANKAIH data
export async function clearAllSMANKAIHData(): Promise<void> {
  try {
    localStorage.removeItem(STORAGE_KEYS.PROFILE);
    localStorage.removeItem(STORAGE_KEYS.RECORDS);
    localStorage.removeItem(STORAGE_KEYS.THEME);
    localStorage.removeItem(STORAGE_KEYS.TARGET_TIMES);
    localStorage.removeItem(STORAGE_KEYS.HAS_SEEN_INTRO);
    localStorage.removeItem(STORAGE_KEYS.MUSIC_PREFS);
    await removeCustomBackgroundFromDB('user_custom_bg');
  } catch (e) {
    console.error('Error resetting all data', e);
  }
}
// Alias for backward compatibility
export const clearAll7KAIHData = clearAllSMANKAIHData;

// Format Date in Indonesian (e.g. "Senin, 19 Oktober 2026")
export function formatDateIndonesian(dateStr: string): string {
  try {
    return formatDeviceDate(dateStr).fullFormatted;
  } catch {
    return dateStr;
  }
}

export function getTodayDateString(): string {
  return getLocalDateString(new Date());
}

