import React, { useState } from 'react';
import { 
  X, 
  Film, 
  Music, 
  Copy, 
  Check, 
  FolderCheck, 
  Sparkles, 
  Code,
  Download,
  AlertCircle
} from 'lucide-react';

interface AssetGuideModalProps {
  onClose: () => void;
}

export const AssetGuideModal: React.FC<AssetGuideModalProps> = ({ onClose }) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2500);
  };

  const videoPrompts = [
    {
      time: 'Detik 00–05',
      scene: 'Fajar Indonesia & Bendera Merah Putih',
      prompt: 'Cinematic anime scene, sunrise golden dawn over lush tropical Indonesian high school courtyard, the red-and-white national flag of Indonesia waving proudly on a tall flagpole in slow motion, soft golden sun rays, atmospheric morning mist, Kyoto Animation aesthetic, 8k resolution, 60fps.',
    },
    {
      time: 'Detik 05–10',
      scene: 'Bangun Pagi Ceria',
      prompt: 'Anime Indonesian high school student waking up cheerful in cozy modern bedroom, stretching arms with a vibrant smile, gentle morning breeze blowing white curtains, sunlight illuminating tidy school uniform on chair, hopeful and energetic anime visual.',
    },
    {
      time: 'Detik 10–15',
      scene: 'Beribadah & Berolahraga',
      prompt: 'Cinematic split cut: first half showing student in respectful prayer with divine glowing light rays; transitioning to dynamic running sequence with student jogging along palm-lined avenue in stylish Indonesian athletic tracksuit, sweat glistening in the morning light, energetic motion blur.',
    },
    {
      time: 'Detik 15–20',
      scene: 'Sarapan Sehat & Belajar Tekun',
      prompt: 'Bright colorful anime scene of nutritious Indonesian breakfast table with rice, tempeh, fresh vegetables, fresh fruit; cuts smoothly to focused student writing diligently in notebook at classroom desk, books, eyeglasses reflecting chalkboard, passionate spark in eyes.',
    },
    {
      time: 'Detik 20–25',
      scene: 'Bermasyarakat & Istirahat Teratur',
      prompt: 'Warm heartwarming anime sequence of diverse Indonesian youth students laughing and helping elderly neighbor carrying groceries, smiling warmly; night cut to tranquil bedroom where student turns off bedside lamp and sleeps peacefully under star-filled night sky, Makoto Shinkai night lighting.',
    },
    {
      time: 'Detik 25–30',
      scene: 'Generasi Emas & Logo SMANKAIH',
      prompt: 'Epic wide hero shot of inspiring group of Indonesian students standing proudly in school plaza with large fluttering Merah Putih flag in background, sun flare, looking confidently towards future, followed by grand gold and crimson title card: "SMANKAIH — 7 KEBIASAAN ANAK INDONESIA HEBAT".',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto select-none">
      <div className="w-full max-w-3xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden my-8 text-left animate-fadeIn">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-red-600 to-rose-700 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <FolderCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-extrabold text-lg text-white">Panduan Aset Video & Audio SMANKAIH</h2>
              <p className="text-xs text-red-100">Struktur file & Prompt AI Video Generatif</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-black/20 hover:bg-black/40 text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Audio Section */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Music className="w-4 h-4 text-red-400" />
              1. Aset Musik Nasionalisme Instrumental
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Letakkan file audio instrumental resmi Anda di folder <code className="bg-slate-800 text-amber-300 px-2 py-0.5 rounded font-mono">public/audio/</code>:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60">
                <div className="font-bold text-slate-200">Lagu 1: Indonesia Raya</div>
                <div className="font-mono text-red-400 text-[11px] mt-1 break-all">
                  public/audio/indonesia-raya-instrumental.mp3
                </div>
                <div className="text-[11px] text-slate-400 mt-1">Ciptaan: W.R. Supratman &bull; Orkestra Simfoni</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60">
                <div className="font-bold text-slate-200">Lagu 2: Bangun Pemudi Pemuda</div>
                <div className="font-mono text-red-400 text-[11px] mt-1 break-all">
                  public/audio/bangun-pemudi-pemuda-instrumental.mp3
                </div>
                <div className="text-[11px] text-slate-400 mt-1">Ciptaan: Alfred Simanjuntak &bull; Orkestra Patriotik</div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-[11px] text-amber-300 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
              <span>
                <strong>Status File:</strong> Jika file MP3 fisik belum diletakkan di direktori di atas, pemutar akan menampilkan status belum terpasang secara transparan. Anda juga dapat mengunggah file MP3 dari perangkat Anda secara langsung melalui tombol "Unggah File MP3 Lokal" pada pemutar musik.
              </span>
            </div>
          </div>

          {/* Video Section */}
          <div className="space-y-3 pt-4 border-t border-slate-800">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Film className="w-4 h-4 text-red-400" />
              2. Aset Video Intro Sinematik 30 Detik
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Letakkan file video MP4 berdurasi 30 detik pada path berikut:
            </p>
            <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60 font-mono text-xs text-red-400 flex items-center justify-between">
              <span>public/videos/intro-smankaih.mp4 (atau intro-7kaih.mp4)</span>
              <span className="text-[10px] text-slate-400 font-sans">Durasi: 30 Detik &bull; MP4 1080p</span>
            </div>

            <p className="text-xs text-slate-400">
              Gunakan prompt di bawah ini pada generator AI video (seperti Sora, Runway Gen-3, Kling AI, Luma Dream Machine, atau Pika Labs) untuk membuat video intro 30 detik:
            </p>

            <div className="space-y-2.5">
              {videoPrompts.map((vp, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/50 text-xs">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-slate-700 font-bold text-[10px] text-slate-200">
                        {vp.time}
                      </span>
                      <span className="font-bold text-white">{vp.scene}</span>
                    </div>
                    <button
                      onClick={() => copyToClipboard(vp.prompt, idx)}
                      className="px-2.5 py-1 rounded bg-slate-700 hover:bg-slate-600 text-slate-200 text-[11px] font-semibold flex items-center gap-1 transition cursor-pointer"
                    >
                      {copiedIndex === idx ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span>Tersalin</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Salin Prompt</span>
                        </>
                      )}
                    </button>
                  </div>
                  <p className="text-slate-300/90 text-[11px] italic font-mono bg-slate-900/60 p-2 rounded-lg border border-slate-800">
                    "{vp.prompt}"
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950/80 border-t border-slate-800 text-right">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs transition cursor-pointer"
          >
            Tutup Panduan
          </button>
        </div>
      </div>
    </div>
  );
};
