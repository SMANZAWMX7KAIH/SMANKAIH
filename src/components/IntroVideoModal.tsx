import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  SkipForward, 
  Sparkles, 
  Film, 
  Volume2, 
  VolumeX, 
  Info, 
  CheckCircle2, 
  Flag,
  Sun,
  BookOpen,
  Heart,
  Users,
  Moon
} from 'lucide-react';
import { getAssetUrl } from '../utils/audioPlayer';

interface IntroVideoModalProps {
  onComplete: () => void;
  onOpenAssetGuide: () => void;
}

interface SceneInfo {
  startSec: number;
  endSec: number;
  title: string;
  tagline: string;
  badge: string;
  icon: any;
  color: string;
  bgGradient: string;
}

const SCENES: SceneInfo[] = [
  {
    startSec: 0,
    endSec: 5,
    title: 'Fajar Emas Khatulistiwa',
    tagline: 'Matahari terbit menyinari bumi pertiwi, Sang Saka Merah Putih berkibar dengan gagah.',
    badge: 'Detik 0–5',
    icon: Flag,
    color: 'text-red-500',
    bgGradient: 'from-red-950 via-slate-900 to-amber-950',
  },
  {
    startSec: 5,
    endSec: 10,
    title: 'Kebiasaan #1: Bangun Pagi',
    tagline: 'Pelajar anime Indonesia bangun penuh gairah, membuka jendela kamar menyongsong harapan.',
    badge: 'Detik 5–10',
    icon: Sun,
    color: 'text-amber-400',
    bgGradient: 'from-amber-950 via-slate-900 to-slate-950',
  },
  {
    startSec: 10,
    endSec: 15,
    title: 'Kebiasaan #2 & #3: Beribadah & Berolahraga',
    tagline: 'Khusyuk bersujud kepada Sang Pencipta, dilanjutkan peregangan raga menjaga stamina prima.',
    badge: 'Detik 10–15',
    icon: Heart,
    color: 'text-emerald-400',
    bgGradient: 'from-emerald-950 via-slate-900 to-cyan-950',
  },
  {
    startSec: 15,
    endSec: 20,
    title: 'Kebiasaan #4 & #5: Makan Sehat & Gemar Belajar',
    tagline: 'Sarapan gizi seimbang, lalu tekun menuntut ilmu di sekolah demi kemajuan nusantara.',
    badge: 'Detik 15–20',
    icon: BookOpen,
    color: 'text-blue-400',
    bgGradient: 'from-blue-950 via-slate-900 to-indigo-950',
  },
  {
    startSec: 20,
    endSec: 25,
    title: 'Kebiasaan #6 & #7: Bermasyarakat & Tidur Cepat',
    tagline: 'Gotong royong membantu sesama, dan beristirahat teratur memulihkan kekuatan jiwa raga.',
    badge: 'Detik 20–25',
    icon: Users,
    color: 'text-rose-400',
    bgGradient: 'from-rose-950 via-slate-900 to-violet-950',
  },
  {
    startSec: 25,
    endSec: 30,
    title: 'Generasi Emas Indonesia Hebat',
    tagline: 'Bersama SMANKAIH, wujudkan cita-cita bangsa dengan karakter tangguh dan berintegritas!',
    badge: 'Detik 25–30',
    icon: Sparkles,
    color: 'text-yellow-400',
    bgGradient: 'from-red-900 via-slate-900 to-red-950',
  },
];

export const IntroVideoModal: React.FC<IntroVideoModalProps> = ({ onComplete, onOpenAssetGuide }) => {
  const [seconds, setSeconds] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [hasMp4Video, setHasMp4Video] = useState<boolean | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [activeTab, setActiveTab] = useState<'cinema' | 'storyboard'>('cinema');
  const videoRef = useRef<HTMLVideoElement>(null);
  const timerRef = useRef<any>(null);

  // Check if video file exists at /videos/intro-smankaih.mp4 or /videos/intro-7kaih.mp4
  const [videoSrc, setVideoSrc] = useState<string>(() => getAssetUrl('videos/intro-smankaih.mp4'));

  useEffect(() => {
    const videoTest = document.createElement('video');
    videoTest.src = getAssetUrl('videos/intro-smankaih.mp4');
    videoTest.oncanplay = () => {
      setVideoSrc(getAssetUrl('videos/intro-smankaih.mp4'));
      setHasMp4Video(true);
    };
    videoTest.onerror = () => {
      const fallbackTest = document.createElement('video');
      fallbackTest.src = getAssetUrl('videos/intro-7kaih.mp4');
      fallbackTest.oncanplay = () => {
        setVideoSrc(getAssetUrl('videos/intro-7kaih.mp4'));
        setHasMp4Video(true);
      };
      fallbackTest.onerror = () => {
        // Not yet present in public/videos
        setHasMp4Video(false);
      };
    };
  }, []);

  // 30 Seconds Timer Loop
  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setSeconds((prev) => {
          if (prev >= 30) {
            clearInterval(timerRef.current);
            onComplete();
            return 30;
          }
          return prev + 0.1;
        });
      }, 100);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, onComplete]);

  // Current active scene
  const currentScene = SCENES.find(
    (s) => seconds >= s.startSec && (seconds < s.endSec || (s.endSec === 30 && seconds >= 29.9))
  ) || SCENES[0];

  const progressPercent = Math.min(100, (seconds / 30) * 100);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
    if (videoRef.current) {
      if (isPlaying) videoRef.current.pause();
      else videoRef.current.play();
    }
  };

  const handleSeek = (newSec: number) => {
    setSeconds(newSec);
    if (videoRef.current) {
      videoRef.current.currentTime = newSec;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex flex-col justify-between overflow-hidden select-none">
      {/* Top Header Bar */}
      <div className="w-full max-w-5xl mx-auto px-4 py-3 flex items-center justify-between z-20">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1 bg-red-600/30 border border-red-500/50 rounded-full text-xs font-bold text-red-300">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
            INTRO SINEMATIK 30 DETIK
          </div>
          <span className="hidden sm:inline text-xs text-slate-400">
            SMANKAIH — 7 Kebiasaan Anak Indonesia Hebat
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab(activeTab === 'cinema' ? 'storyboard' : 'cinema')}
            className="px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition flex items-center gap-1.5 cursor-pointer"
          >
            <Film className="w-3.5 h-3.5" />
            {activeTab === 'cinema' ? 'Lihat Storyboard' : 'Kembali ke Sinema'}
          </button>

          <button
            onClick={onOpenAssetGuide}
            title="Panduan file video intro-7kaih.mp4"
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-amber-300 border border-slate-700 transition cursor-pointer"
          >
            <Info className="w-4 h-4" />
          </button>

          <button
            onClick={onComplete}
            className="px-4 py-1.5 rounded-full bg-white/10 hover:bg-red-600 text-white font-semibold text-xs border border-white/20 hover:border-red-500 transition duration-200 cursor-pointer flex items-center gap-1"
          >
            <span>Lewati Intro</span>
            <SkipForward className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Screen Content */}
      <div className="flex-1 max-w-5xl w-full mx-auto px-4 flex items-center justify-center relative">
        {activeTab === 'cinema' ? (
          <div className="w-full aspect-video max-h-[70vh] rounded-2xl overflow-hidden shadow-2xl relative border border-slate-800 bg-slate-950 flex flex-col items-center justify-center">
            {/* If actual video file exists */}
            {hasMp4Video ? (
              <video
                ref={videoRef}
                src={videoSrc}
                className="w-full h-full object-cover"
                autoPlay
                muted={isMuted}
                playsInline
                onEnded={onComplete}
              />
            ) : (
              /* Anime Cinematic Interactive SVG / Canvas Engine */
              <div className={`w-full h-full bg-gradient-to-b ${currentScene.bgGradient} transition-colors duration-1000 flex flex-col items-center justify-between p-6 sm:p-10 relative overflow-hidden`}>
                {/* Visual Graphic Elements (Stars, Sunlight, Flag Ripples) */}
                <div className="absolute inset-0 opacity-20 pointer-events-none">
                  <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-red-500/30 rounded-full blur-3xl animate-pulse" />
                  <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-amber-500/20 rounded-full blur-3xl" />
                </div>

                {/* Animated Merah Putih Flag Header */}
                <div className="w-full flex items-center justify-between z-10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-7 rounded shadow-md overflow-hidden border border-white/20 flex flex-col">
                      <div className="flex-1 bg-red-600" />
                      <div className="flex-1 bg-white" />
                    </div>
                    <div className="text-left">
                      <div className="text-xs font-bold text-red-400 tracking-wider">INDONESIA EMAS</div>
                      <div className="text-[11px] text-slate-400">Generasi Berkarakter Hebat</div>
                    </div>
                  </div>

                  <div className="px-3 py-1 rounded-full bg-slate-900/80 border border-slate-700/80 text-xs font-mono font-bold text-slate-300">
                    {Math.floor(seconds)}s / 30s
                  </div>
                </div>

                {/* Cinematic Center Visual Motif */}
                <div className="text-center z-10 flex flex-col items-center my-auto transition-all transform duration-700 max-w-2xl">
                  {/* Dynamic Scene Icon Badge */}
                  <div className={`w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-slate-900/90 border border-white/10 shadow-2xl flex items-center justify-center mb-4 transition-transform duration-500 hover:scale-105`}>
                    {React.createElement(currentScene.icon, {
                      className: `w-10 h-10 sm:w-12 sm:h-12 ${currentScene.color} animate-bounce`,
                    })}
                  </div>

                  <span className="text-xs font-bold tracking-widest text-slate-400 uppercase mb-1">
                    {currentScene.badge}
                  </span>
                  
                  <h1 className="text-2xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-slate-300 tracking-tight mb-2 drop-shadow-md">
                    {currentScene.title}
                  </h1>

                  <p className="text-sm sm:text-base text-slate-300/90 max-w-lg leading-relaxed">
                    {currentScene.tagline}
                  </p>
                </div>

                {/* Bottom Cue Text */}
                <div className="w-full text-center z-10 flex items-center justify-between text-xs text-slate-400">
                  <span>Animasi Sinematik Pelajar Indonesia</span>
                  <span className="font-mono text-amber-400/90 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    Scene {SCENES.indexOf(currentScene) + 1} dari 6
                  </span>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Storyboard Detail View */
          <div className="w-full max-h-[70vh] overflow-y-auto bg-slate-900/90 rounded-2xl p-6 border border-slate-800 text-left">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
              <div>
                <h2 className="text-lg font-bold text-white">Storyboard Video Anime 30 Detik</h2>
                <p className="text-xs text-slate-400">
                  Rancangan visual adegan sinematik untuk file <code className="text-red-400">public/videos/intro-7kaih.mp4</code>
                </p>
              </div>
              <button
                onClick={onOpenAssetGuide}
                className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
              >
                <Film className="w-3.5 h-3.5" />
                Petunjuk Pembuatan Video
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {SCENES.map((scene, idx) => (
                <div
                  key={scene.badge}
                  onClick={() => handleSeek(scene.startSec)}
                  className={`p-3.5 rounded-xl border transition cursor-pointer ${
                    currentScene.badge === scene.badge
                      ? 'bg-red-950/40 border-red-500/60 shadow-lg'
                      : 'bg-slate-800/40 border-slate-700/50 hover:bg-slate-800/70'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-700 text-slate-200">
                      {scene.badge}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      Adegan #{idx + 1}
                    </span>
                  </div>
                  <h3 className="font-bold text-sm text-white mb-1">{scene.title}</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">{scene.tagline}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Timeline Controls */}
      <div className="w-full max-w-5xl mx-auto px-4 py-4 z-20">
        {/* Progress Bar with markers */}
        <div className="relative mb-3">
          <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden cursor-pointer">
            <div
              className="h-full bg-gradient-to-r from-red-600 via-rose-500 to-amber-500 transition-all duration-100 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          {/* Scene cut tick marks */}
          <div className="absolute inset-0 flex justify-between pointer-events-none px-0.5">
            {[0, 5, 10, 15, 20, 25, 30].map((sec) => (
              <div key={sec} className="h-full flex flex-col items-center justify-center">
                <div className="w-0.5 h-2 bg-slate-600/50" />
              </div>
            ))}
          </div>
        </div>

        {/* Play/Pause & Scene Jump */}
        <div className="flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-3">
            <button
              onClick={togglePlay}
              className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-white transition cursor-pointer"
              title={isPlaying ? 'Jeda Intro' : 'Putar Intro'}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
            </button>
            <span className="font-mono text-slate-300">
              00:{String(Math.floor(seconds)).padStart(2, '0')} / 00:30
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-400">
              {hasMp4Video ? 'Memutar Video MP4' : 'Simulator Visual Sinematik SMANKAIH'}
            </span>
            <button
              onClick={onComplete}
              className="px-3 py-1 bg-red-600 hover:bg-red-500 text-white rounded font-bold text-xs transition cursor-pointer"
            >
              Masuk Dashboard &rarr;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
