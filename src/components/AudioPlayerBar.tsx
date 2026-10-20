import React, { useEffect, useState, useRef } from 'react';
import { 
  Play, 
  Pause, 
  Square, 
  SkipBack, 
  SkipForward, 
  Repeat, 
  Volume2, 
  VolumeX, 
  Music, 
  X,
  AlertTriangle,
  Upload,
  CheckCircle2,
  Sliders,
  Sparkles,
  Info
} from 'lucide-react';
import { audioController, AudioPlayerState, SONGS } from '../utils/audioPlayer';

interface AudioPlayerBarProps {
  onOpenAssetGuide: () => void;
}

export const AudioPlayerBar: React.FC<AudioPlayerBarProps> = ({ onOpenAssetGuide }) => {
  const [playerState, setPlayerState] = useState<AudioPlayerState>(audioController.getState());
  const [isOpen, setIsOpen] = useState(false);
  const [isSeeking, setIsSeeking] = useState(false);
  const [seekValue, setSeekValue] = useState(0);
  const [showAutoplayBanner, setShowAutoplayBanner] = useState(false);
  const localUploadRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const unsubscribe = audioController.subscribe((state) => {
      setPlayerState(state);
      if (!isSeeking) {
        setSeekValue(state.currentTime);
      }
      if (state.errorMessage && state.errorMessage.includes('Autoplay')) {
        setShowAutoplayBanner(true);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [isSeeking]);

  // Handle click outside to close panel gracefully on mobile/desktop
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen &&
        panelRef.current &&
        !panelRef.current.contains(event.target as Node)
      ) {
        const target = event.target as HTMLElement;
        // Don't close if clicking the toggle floating button
        if (!target.closest('#smankaih-audio-floating-btn')) {
          setIsOpen(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleStartMusicPrompt = async () => {
    setShowAutoplayBanner(false);
    await audioController.play();
  };

  const togglePlayPause = () => {
    if (playerState.isPlaying) {
      audioController.pause();
    } else {
      audioController.play();
    }
  };

  const handleStop = () => {
    audioController.stop();
  };

  const handleToggleLoop = () => {
    audioController.toggleLoop();
  };

  const handleToggleMute = () => {
    audioController.toggleMute();
  };

  const handleSongChange = (songId: 'indonesia-raya' | 'bangun-pemudi-pemuda') => {
    audioController.selectSong(songId, true);
  };

  const handlePrevSong = () => {
    audioController.prevTrack(true);
  };

  const handleNextSong = () => {
    audioController.nextTrack(true);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    audioController.setVolume(val);
  };

  const handleScrubberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setSeekValue(val);
  };

  const handleScrubberCommit = () => {
    audioController.seek(seekValue);
    setIsSeeking(false);
  };

  const handleLocalMp3Upload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      audioController.attachUserUploadedFile(playerState.currentSong.id, file);
    }
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds) || seconds < 0) return '00:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const isCurrentFileMissing = playerState.fileStatus[playerState.currentSong.id] === 'missing';
  const isCurrentFileAvailable = playerState.fileStatus[playerState.currentSong.id] === 'available';

  return (
    <div className="no-print select-none">
      {/* Hidden local MP3 upload input */}
      <input
        type="file"
        ref={localUploadRef}
        accept="audio/mp3,audio/*"
        onChange={handleLocalMp3Upload}
        className="hidden"
      />

      {/* Autoplay prompt toast if blocked by browser */}
      {showAutoplayBanner && (
        <div className="fixed top-16 left-4 right-4 sm:left-auto sm:right-6 sm:w-96 bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white p-3.5 rounded-2xl shadow-2xl flex items-center justify-between z-50 animate-fadeIn border border-white/20">
          <div className="flex items-center space-x-2.5 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-amber-300 animate-ping" />
            <span>Klik untuk memutar lagu patriotik SMANKAIH</span>
          </div>
          <button
            onClick={handleStartMusicPrompt}
            className="bg-white text-red-700 font-extrabold px-3 py-1 rounded-full text-xs shadow hover:bg-red-50 transition cursor-pointer flex items-center gap-1 shrink-0"
          >
            <Play className="w-3 h-3 fill-current" />
            <span>Putar</span>
          </button>
        </div>
      )}

      {/* ======================================================== */}
      {/* 1. COMPACT POPUP PLAYER PANEL (Only shown when open)   */}
      {/* ======================================================== */}
      {isOpen && (
        <div 
          ref={panelRef}
          role="dialog"
          aria-label="Panel Pemutar Musik Patriotik SMANKAIH"
          className="fixed bottom-20 right-3 sm:right-6 z-40 w-[calc(100vw-1.5rem)] sm:w-[380px] max-w-[390px] animate-fadeIn transition-all duration-300"
          style={{
            bottom: 'calc(4.75rem + env(safe-area-inset-bottom, 0px))',
          }}
        >
          <div className="theme-surface backdrop-blur-2xl border-2 border-red-500/40 rounded-3xl p-4 sm:p-5 shadow-2xl shadow-red-950/40 text-left space-y-3.5 ring-1 ring-white/10">
            {/* Header: Title, Badge, and Close Button */}
            <div className="flex items-center justify-between border-b pb-3 border-slate-700/30">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-red-600 to-rose-600 text-white flex items-center justify-center shadow-md shadow-red-900/40">
                  <Music className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-black uppercase tracking-wider text-red-500">
                      SMANKAIH AUDIO
                    </span>
                    {playerState.isPlaying && (
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Memutar
                      </span>
                    )}
                  </div>
                  <h3 className="text-sm font-extrabold theme-text">
                    Musik Patriotik Nasional
                  </h3>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={onOpenAssetGuide}
                  title="Panduan Folder & File Audio"
                  className="p-1.5 rounded-xl theme-input hover:text-amber-500 transition cursor-pointer text-xs"
                >
                  <Info className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  aria-label="Tutup panel pemutar musik"
                  className="p-1.5 rounded-xl theme-input hover:bg-red-500/20 hover:text-red-500 transition cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Song Selection: 2 Clear Songs with Composer & Active State */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                Pilih Lagu Patriotik:
              </label>

              <div className="grid grid-cols-2 gap-2">
                {SONGS.map((song) => {
                  const isSelected = playerState.currentSong.id === song.id;
                  const isPlayingThis = isSelected && playerState.isPlaying;

                  return (
                    <button
                      key={song.id}
                      onClick={() => handleSongChange(song.id)}
                      className={`p-2.5 rounded-2xl border text-left transition-all relative overflow-hidden cursor-pointer ${
                        isSelected
                          ? 'border-red-500 bg-red-600/15 shadow-md shadow-red-950/20'
                          : 'theme-input hover:border-slate-500/50'
                      }`}
                    >
                      {/* Active indicator bar */}
                      {isSelected && (
                        <div className="absolute top-0 left-0 bottom-0 w-1 bg-red-600" />
                      )}

                      <div className="flex items-center justify-between mb-1 pl-1">
                        <span className={`text-[10px] font-bold uppercase tracking-wider ${
                          isSelected ? 'text-red-500' : 'theme-text-muted'
                        }`}>
                          {song.id === 'indonesia-raya' ? 'Lagu 1' : 'Lagu 2'}
                        </span>
                        {isPlayingThis ? (
                          <div className="flex items-end gap-0.5 h-3">
                            <span className="w-0.5 h-3 bg-red-500 animate-pulse rounded-full" />
                            <span className="w-0.5 h-2 bg-red-500 animate-pulse delay-75 rounded-full" />
                            <span className="w-0.5 h-3 bg-red-500 animate-pulse delay-150 rounded-full" />
                          </div>
                        ) : isSelected ? (
                          <span className="w-2 h-2 rounded-full bg-red-500" />
                        ) : null}
                      </div>

                      <div className="pl-1">
                        <h4 className="text-xs font-black theme-text truncate leading-snug">
                          {song.title}
                        </h4>
                        <p className="text-[10px] theme-text-muted truncate">
                          {song.id === 'indonesia-raya' ? 'W.R. Supratman' : 'C. Simanjuntak'}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Currently Playing Card */}
            <div className="p-2.5 rounded-2xl bg-black/5 dark:bg-white/5 border border-slate-700/20 flex items-center justify-between">
              <div className="truncate pr-2">
                <span className="text-[10px] font-bold text-red-500 block truncate">
                  {playerState.currentSong.subtitle}
                </span>
                <span className="text-xs font-bold theme-text truncate block">
                  {playerState.currentSong.title} &bull; {playerState.currentSong.tempo}
                </span>
              </div>
              <div className="text-right shrink-0">
                <span className="text-[10px] font-mono theme-text-muted">
                  {formatTime(isSeeking ? seekValue : playerState.currentTime)} / {formatTime(playerState.duration)}
                </span>
              </div>
            </div>

            {/* Scrubber / Progress Slider */}
            <div className="space-y-1">
              <input
                type="range"
                min="0"
                max={playerState.duration || 100}
                step="0.5"
                value={isSeeking ? seekValue : playerState.currentTime}
                onMouseDown={() => setIsSeeking(true)}
                onTouchStart={() => setIsSeeking(true)}
                onChange={handleScrubberChange}
                onMouseUp={handleScrubberCommit}
                onTouchEnd={handleScrubberCommit}
                disabled={isCurrentFileMissing && !playerState.duration}
                aria-label="Posisi Waktu Musik"
                className="w-full h-1.5 bg-black/20 dark:bg-white/20 rounded-lg appearance-none cursor-pointer accent-red-600 disabled:opacity-40"
              />
            </div>

            {/* Controls: Prev, Play/Pause, Stop, Next, Loop, Volume */}
            <div className="flex items-center justify-between gap-1 pt-1">
              <button
                onClick={handlePrevSong}
                title="Lagu Sebelumnya"
                className="p-2 rounded-xl theme-text-muted hover:theme-text hover:bg-black/5 dark:hover:bg-white/10 transition cursor-pointer"
              >
                <SkipBack className="w-4 h-4" />
              </button>

              <button
                onClick={togglePlayPause}
                title={playerState.isPlaying ? 'Jeda Musik' : 'Putar Musik'}
                className="p-3 bg-gradient-to-tr from-red-600 via-rose-600 to-red-700 hover:from-red-500 hover:to-rose-500 text-white rounded-full shadow-lg shadow-red-900/40 transition transform active:scale-95 cursor-pointer ring-2 ring-white/20"
              >
                {playerState.isPlaying ? (
                  <Pause className="w-5 h-5 fill-current" />
                ) : (
                  <Play className="w-5 h-5 fill-current translate-x-0.5" />
                )}
              </button>

              <button
                onClick={handleStop}
                title="Hentikan Musik (Stop)"
                className="p-2 rounded-xl theme-text-muted hover:theme-text hover:bg-black/5 dark:hover:bg-white/10 transition cursor-pointer"
              >
                <Square className="w-4 h-4" />
              </button>

              <button
                onClick={handleNextSong}
                title="Lagu Berikutnya"
                className="p-2 rounded-xl theme-text-muted hover:theme-text hover:bg-black/5 dark:hover:bg-white/10 transition cursor-pointer"
              >
                <SkipForward className="w-4 h-4" />
              </button>

              <button
                onClick={handleToggleLoop}
                title={playerState.isLooping ? 'Ulangi Aktif' : 'Ulangi Mati'}
                className={`p-2 rounded-xl transition cursor-pointer ${
                  playerState.isLooping
                    ? 'text-red-500 bg-red-500/10 border border-red-500/30'
                    : 'theme-text-muted hover:theme-text'
                }`}
              >
                <Repeat className="w-4 h-4" />
              </button>

              {/* Volume Slider & Mute Toggle */}
              <div className="flex items-center gap-1.5 pl-1.5 border-l border-slate-700/30">
                <button 
                  onClick={handleToggleMute}
                  title={playerState.isMuted ? 'Nyalakan Suara (Unmute)' : 'Matikan Suara (Mute)'}
                  className="theme-text-muted hover:theme-text p-1 cursor-pointer"
                >
                  {playerState.isMuted || playerState.volume === 0 ? (
                    <VolumeX className="w-4 h-4 text-red-500" />
                  ) : (
                    <Volume2 className="w-4 h-4" />
                  )}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={playerState.isMuted ? 0 : playerState.volume}
                  onChange={handleVolumeChange}
                  aria-label="Volume Musik"
                  className="w-16 h-1.5 bg-black/20 dark:bg-white/20 rounded-lg appearance-none cursor-pointer accent-red-500"
                />
              </div>
            </div>

            {/* File Status & Fallback Upload Option */}
            {isCurrentFileMissing ? (
              <div className="p-2.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-[11px] text-amber-500 space-y-1.5">
                <div className="flex items-center gap-1.5 font-bold">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                  <span>File audio belum dipasang di folder server:</span>
                </div>
                <div className="font-mono text-[10px] bg-black/20 p-1.5 rounded-lg text-amber-400 break-all">
                  public{playerState.currentSong.mp3Path}
                </div>
                <div className="flex items-center justify-between pt-0.5 gap-2">
                  <button
                    onClick={() => localUploadRef.current?.click()}
                    className="px-2.5 py-1 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-[10px] flex items-center gap-1 transition cursor-pointer shadow"
                  >
                    <Upload className="w-3 h-3" />
                    Unggah MP3 Lokal
                  </button>
                  <button
                    onClick={onOpenAssetGuide}
                    className="px-2.5 py-1 rounded-xl theme-input font-bold text-[10px] transition cursor-pointer"
                  >
                    Lihat Panduan
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-[11px] text-emerald-500 flex items-center justify-between">
                <span className="flex items-center gap-1.5 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Audio instrumental aktif
                </span>
                <span className="font-mono text-[10px] theme-text-muted">
                  {playerState.uploadedBlobUrls[playerState.currentSong.id] ? 'MP3 Lokal' : 'Instrumental Resmi'}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 2. FLOATING CIRCULAR MUSIC BUTTON (Small, Round, 48-56px) */}
      {/* ======================================================== */}
      <div 
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40"
        style={{
          bottom: 'calc(1rem + env(safe-area-inset-bottom, 0px))',
        }}
      >
        <button
          id="smankaih-audio-floating-btn"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? 'Tutup pemutar musik SMANKAIH' : 'Buka pemutar musik SMANKAIH'}
          title={`Musik Patriotik SMANKAIH — ${playerState.currentSong.title} (${playerState.isPlaying ? 'Sedang Diputar' : 'Jeda'})`}
          className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 transform hover:scale-105 active:scale-95 cursor-pointer relative border-2 ${
            isOpen 
              ? 'bg-gradient-to-tr from-red-800 to-rose-700 text-white border-white ring-4 ring-red-500/30 shadow-red-950/60'
              : playerState.isPlaying
                ? 'bg-gradient-to-tr from-red-600 via-rose-600 to-red-700 text-white border-white/95 shadow-red-900/50'
                : 'bg-gradient-to-tr from-red-600 to-rose-700 text-white border-white/80 hover:border-white shadow-black/40'
          }`}
        >
          {/* Subtle pulse ripple ring when music is actively playing */}
          {playerState.isPlaying && (
            <span className="absolute -inset-1 rounded-full bg-red-500/30 animate-ping pointer-events-none" />
          )}

          {/* Soundwave equalizer indicator if playing */}
          {playerState.isPlaying ? (
            <div className="flex items-end gap-1 h-5">
              <span className="w-1 bg-white rounded-full animate-bounce h-3" />
              <span className="w-1 bg-white rounded-full animate-bounce h-5 delay-100" />
              <span className="w-1 bg-white rounded-full animate-bounce h-4 delay-200" />
            </div>
          ) : (
            <Music className="w-6 h-6 text-white drop-shadow" />
          )}

          {/* Tiny Status Dot Badge */}
          {playerState.isPlaying && (
            <span className="absolute top-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-white shadow animate-pulse" />
          )}

          {isCurrentFileMissing && !playerState.isPlaying && (
            <span className="absolute top-0 right-0 w-3 h-3 rounded-full bg-amber-400 border-2 border-white shadow" />
          )}
        </button>
      </div>
    </div>
  );
};
