/**
 * Patriotic Music Controller for 7KAIH Smart AI
 * Manages playback, state, time-scrubbing, volume, and file availability checks.
 */

export interface SongTrack {
  id: 'indonesia-raya' | 'bangun-pemudi-pemuda';
  title: string;
  subtitle: string;
  composer: string;
  mp3Path: string;
  description: string;
  tempo: string;
}

import { safeLocalStorageGet, safeLocalStorageSet } from './storage';

export function getAssetUrl(path: string): string {
  const base = import.meta.env.BASE_URL || '/';
  const cleanBase = base.endsWith('/') ? base : `${base}/`;
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `${cleanBase}${cleanPath}`;
}

export const SONGS: SongTrack[] = [
  {
    id: 'indonesia-raya',
    title: 'Indonesia Raya',
    subtitle: 'Lagu Kebangsaan Republik Indonesia',
    composer: 'Cipt. Wage Rudolf Supratman',
    mp3Path: getAssetUrl('audio/indonesia-raya-instrumental.mp3'),
    description: 'Aransemen orkestra simfoni khidmat, megah, dan berwibawa dengan paduan brass, strings, perkusi, dan timpani.',
    tempo: 'Maestoso (Khidmat & Agung)',
  },
  {
    id: 'bangun-pemudi-pemuda',
    title: 'Bangun Pemudi Pemuda',
    subtitle: 'Lagu Perjuangan & Semangat Generasi Muda',
    composer: 'Cipt. Alfred Simanjuntak',
    mp3Path: getAssetUrl('audio/bangun-pemudi-pemuda-instrumental.mp3'),
    description: 'Aransemen orkestra patriotik energik bersemangat tinggi dengan derap marching snare, brass membahana, dan strings dinamis.',
    tempo: 'Marcia con brio (Tegas & Bersemangat)',
  },
];

export type AudioFileStatus = 'checking' | 'available' | 'missing' | 'error';

export interface AudioPlayerState {
  currentSong: SongTrack;
  isPlaying: boolean;
  isMuted: boolean;
  isLooping: boolean;
  volume: number; // 0 to 1
  currentTime: number;
  duration: number;
  fileStatus: Record<'indonesia-raya' | 'bangun-pemudi-pemuda', AudioFileStatus>;
  errorMessage: string | null;
  uploadedBlobUrls: Record<string, string>; // for user-uploaded MP3 files
}

const STORAGE_KEYS = {
  VOLUME: '7kaih_music_volume_v2',
  LAST_SONG: '7kaih_music_last_song_v2',
  MUTED: '7kaih_music_muted_v2',
};

class AudioPlayerController {
  private audio: HTMLAudioElement | null = null;
  private currentSongIndex: number = 0;
  private isPlaying: boolean = false;
  private isMuted: boolean = false;
  private isLooping: boolean = false;
  private volume: number = 0.7;
  private previousVolumeBeforeMute: number = 0.7;
  private currentTime: number = 0;
  private duration: number = 0;
  private errorMessage: string | null = null;
  private uploadedBlobUrls: Record<string, string> = {};
  private fileStatus: Record<'indonesia-raya' | 'bangun-pemudi-pemuda', AudioFileStatus> = {
    'indonesia-raya': 'checking',
    'bangun-pemudi-pemuda': 'checking',
  };
  private listeners: Array<(state: AudioPlayerState) => void> = [];

  constructor() {
    if (typeof window !== 'undefined') {
      try {
        this.loadPreferences();
        this.initAudioElement();
        this.checkAllFiles();
      } catch (err) {
        console.warn('AudioPlayerController initialization deferred:', err);
      }
    }
  }

  private loadPreferences() {
    try {
      const savedVol = safeLocalStorageGet(STORAGE_KEYS.VOLUME);
      if (savedVol !== null) {
        this.volume = parseFloat(savedVol);
        this.previousVolumeBeforeMute = this.volume;
      }
      const savedMuted = safeLocalStorageGet(STORAGE_KEYS.MUTED);
      if (savedMuted === 'true') {
        this.isMuted = true;
      }
      const savedSong = safeLocalStorageGet(STORAGE_KEYS.LAST_SONG);
      if (savedSong) {
        const idx = SONGS.findIndex((s) => s.id === savedSong);
        if (idx !== -1) {
          this.currentSongIndex = idx;
        }
      }
    } catch (e) {
      console.warn('Could not load audio prefs', e);
    }
  }

  private savePreferences() {
    try {
      safeLocalStorageSet(STORAGE_KEYS.VOLUME, this.volume.toString());
      safeLocalStorageSet(STORAGE_KEYS.MUTED, this.isMuted.toString());
      safeLocalStorageSet(STORAGE_KEYS.LAST_SONG, this.getCurrentSong().id);
    } catch {}
  }

  private initAudioElement() {
    if (this.audio) return;
    try {
      this.audio = new Audio();
      this.audio.preload = 'metadata';
      this.audio.volume = this.isMuted ? 0 : this.volume;
      this.audio.loop = this.isLooping;

      this.audio.addEventListener('play', () => {
        this.isPlaying = true;
        this.errorMessage = null;
        this.notify();
      });

      this.audio.addEventListener('pause', () => {
        this.isPlaying = false;
        this.notify();
      });

      this.audio.addEventListener('timeupdate', () => {
        if (this.audio) {
          this.currentTime = this.audio.currentTime;
          if (!isNaN(this.audio.duration) && this.audio.duration > 0) {
            this.duration = this.audio.duration;
          }
          this.notify();
        }
      });

      this.audio.addEventListener('loadedmetadata', () => {
        if (this.audio) {
          this.duration = isNaN(this.audio.duration) ? 0 : this.audio.duration;
          const curId = this.getCurrentSong().id;
          this.fileStatus[curId] = 'available';
          this.notify();
        }
      });

      this.audio.addEventListener('ended', () => {
        if (!this.isLooping) {
          this.nextTrack(true);
        }
      });

      this.audio.addEventListener('error', () => {
        const curId = this.getCurrentSong().id;
        this.fileStatus[curId] = 'missing';
        this.isPlaying = false;
        this.errorMessage = `File audio "${this.getCurrentSong().mp3Path}" belum dipasang di folder public/audio/.`;
        this.notify();
      });
    } catch (e) {
      console.warn('HTMLAudioElement not supported or blocked:', e);
      this.audio = null;
    }
  }

  public async checkAllFiles() {
    for (const song of SONGS) {
      if (this.uploadedBlobUrls[song.id]) {
        this.fileStatus[song.id] = 'available';
        continue;
      }
      try {
        const res = await fetch(song.mp3Path, { method: 'HEAD' });
        if (res.ok) {
          this.fileStatus[song.id] = 'available';
        } else {
          this.fileStatus[song.id] = 'missing';
        }
      } catch {
        this.fileStatus[song.id] = 'missing';
      }
    }
    this.notify();
  }

  public subscribe(listener: (state: AudioPlayerState) => void): () => void {
    this.listeners.push(listener);
    listener(this.getState());
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notify() {
    const state = this.getState();
    this.listeners.forEach((fn) => fn(state));
  }

  public getState(): AudioPlayerState {
    return {
      currentSong: this.getCurrentSong(),
      isPlaying: this.isPlaying,
      isMuted: this.isMuted,
      isLooping: this.isLooping,
      volume: this.volume,
      currentTime: this.currentTime,
      duration: this.duration,
      fileStatus: { ...this.fileStatus },
      errorMessage: this.errorMessage,
      uploadedBlobUrls: { ...this.uploadedBlobUrls },
    };
  }

  public getCurrentSong(): SongTrack {
    return SONGS[this.currentSongIndex] || SONGS[0];
  }

  private getEffectiveAudioSrc(song: SongTrack): string {
    return this.uploadedBlobUrls[song.id] || song.mp3Path;
  }

  public async play(): Promise<boolean> {
    this.initAudioElement();
    if (!this.audio) return false;

    const currentSong = this.getCurrentSong();
    const targetSrc = this.getEffectiveAudioSrc(currentSong);

    // If source is different or empty, set src
    if (!this.audio.src || !this.audio.src.endsWith(targetSrc)) {
      this.audio.src = targetSrc;
      this.audio.load();
    }

    this.audio.volume = this.isMuted ? 0 : this.volume;
    this.audio.loop = this.isLooping;

    try {
      await this.audio.play();
      this.isPlaying = true;
      this.errorMessage = null;
      this.fileStatus[currentSong.id] = 'available';
      this.notify();
      return true;
    } catch (err: any) {
      if (err.name === 'NotAllowedError') {
        this.errorMessage = 'Autoplay diblokir oleh peramban. Silakan tekan tombol Mulai Musik.';
      } else {
        this.fileStatus[currentSong.id] = 'missing';
        this.errorMessage = `File audio belum tersedia: ${currentSong.mp3Path}`;
      }
      this.isPlaying = false;
      this.notify();
      return false;
    }
  }

  public pause() {
    if (this.audio) {
      this.audio.pause();
    }
    this.isPlaying = false;
    this.notify();
  }

  public resume() {
    this.play();
  }

  public stop() {
    if (this.audio) {
      this.audio.pause();
      this.audio.currentTime = 0;
    }
    this.isPlaying = false;
    this.currentTime = 0;
    this.notify();
  }

  public seek(seconds: number) {
    if (this.audio && !isNaN(seconds)) {
      const clamped = Math.max(0, Math.min(seconds, this.duration || seconds));
      this.audio.currentTime = clamped;
      this.currentTime = clamped;
      this.notify();
    }
  }

  public selectSong(songId: 'indonesia-raya' | 'bangun-pemudi-pemuda', autoPlay: boolean = true) {
    const idx = SONGS.findIndex((s) => s.id === songId);
    if (idx === -1) return;

    const wasPlaying = this.isPlaying;
    this.stop();
    this.currentSongIndex = idx;
    this.currentTime = 0;
    this.duration = 0;
    this.errorMessage = null;
    this.savePreferences();

    if (this.audio) {
      this.audio.src = this.getEffectiveAudioSrc(SONGS[idx]);
      this.audio.load();
    }

    if (autoPlay || wasPlaying) {
      this.play();
    } else {
      this.notify();
    }
  }

  public nextTrack(autoPlay: boolean = true) {
    const nextIdx = (this.currentSongIndex + 1) % SONGS.length;
    this.selectSong(SONGS[nextIdx].id, autoPlay);
  }

  public prevTrack(autoPlay: boolean = true) {
    const prevIdx = (this.currentSongIndex - 1 + SONGS.length) % SONGS.length;
    this.selectSong(SONGS[prevIdx].id, autoPlay);
  }

  public setVolume(val: number) {
    const clamped = Math.max(0, Math.min(1, val));
    this.volume = clamped;
    if (clamped > 0 && this.isMuted) {
      this.isMuted = false;
    }
    if (this.audio) {
      this.audio.volume = this.isMuted ? 0 : clamped;
    }
    this.savePreferences();
    this.notify();
  }

  public toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.isMuted) {
      this.previousVolumeBeforeMute = this.volume > 0 ? this.volume : 0.7;
      if (this.audio) this.audio.volume = 0;
    } else {
      this.volume = this.previousVolumeBeforeMute;
      if (this.audio) this.audio.volume = this.volume;
    }
    this.savePreferences();
    this.notify();
  }

  public toggleLoop() {
    this.isLooping = !this.isLooping;
    if (this.audio) {
      this.audio.loop = this.isLooping;
    }
    this.notify();
  }

  /**
   * Allows user to load a local MP3 file directly into the player
   * so they can hear the music immediately on their device.
   */
  public attachUserUploadedFile(songId: 'indonesia-raya' | 'bangun-pemudi-pemuda', file: File) {
    const blobUrl = URL.createObjectURL(file);
    this.uploadedBlobUrls[songId] = blobUrl;
    this.fileStatus[songId] = 'available';
    this.errorMessage = null;

    if (this.getCurrentSong().id === songId) {
      if (this.audio) {
        this.audio.src = blobUrl;
        this.audio.load();
      }
      this.play();
    } else {
      this.notify();
    }
  }
}

// Singleton global controller
export const audioController = new AudioPlayerController();
