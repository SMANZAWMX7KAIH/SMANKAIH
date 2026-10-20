import React from 'react';
import { 
  Printer, 
  FileText, 
  Calendar, 
  User, 
  Building2, 
  GraduationCap, 
  CheckCircle2, 
  Circle, 
  BarChart3, 
  PieChart, 
  Sparkles,
  Download
} from 'lucide-react';
import { HABITS_DATA } from '../data/habitsData';
import { DayRecord, UserProfile } from '../types';
import { formatDeviceDate } from '../utils/dateUtils';

interface PrintReportViewProps {
  user: UserProfile;
  currentRecord: DayRecord | null;
  selectedDate: string;
}

export const PrintReportView: React.FC<PrintReportViewProps> = ({
  user,
  currentRecord,
  selectedDate,
}) => {
  const habitsList = HABITS_DATA;
  const totalPlanned = habitsList.length;

  let completedCount = 0;
  const habitRows = habitsList.map((habit, idx) => {
    const log = currentRecord?.habits[habit.id];
    const isDone = log?.completed || false;
    if (isDone) completedCount++;
    return {
      no: idx + 1,
      title: habit.title,
      targetTime: log?.targetTime || habit.defaultTargetTime,
      completedAt: log?.completedAt || '-',
      completed: isDone,
      notes: log?.notes || '-',
    };
  });

  const uncompletedCount = totalPlanned - completedCount;
  const completionPercentage = Math.round((completedCount / totalPlanned) * 100);

  const handlePrint = () => {
    window.print();
  };

  const selectedDateInfo = formatDeviceDate(selectedDate);
  const nowDeviceDateInfo = formatDeviceDate(new Date());

  // Pie chart geometry for print
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const completedStroke = (completedCount / totalPlanned) * circumference;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* On-screen control bar (Hidden during print) */}
      <div className="no-print mb-6 p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="font-extrabold text-white text-base flex items-center gap-2">
            <Printer className="w-5 h-5 text-red-500" />
            Cetak Dokumen Laporan Resmi SMANKAIH
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Format halaman A4 telah dioptimalkan untuk dicetak langsung atau disimpan sebagai PDF.
          </p>
        </div>

        <button
          onClick={handlePrint}
          className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-extrabold text-xs shadow-lg shadow-red-900/40 transition transform active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
        >
          <Printer className="w-4 h-4" />
          <span>Cetak Laporan / Simpan PDF</span>
        </button>
      </div>

      {/* The Printable A4 Sheet */}
      <div className="print-sheet bg-white text-slate-900 p-8 sm:p-12 rounded-3xl shadow-2xl border border-slate-200">
        {/* Kop Laporan Resmi */}
        <div className="border-b-4 border-double border-red-700 pb-5 mb-6 text-center relative">
          {/* Bendera Merah Putih Aksen */}
          <div className="w-16 h-4 mx-auto mb-2 border border-slate-300 flex flex-col shadow-sm">
            <div className="flex-1 bg-red-600" />
            <div className="flex-1 bg-white" />
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-red-700 tracking-wider uppercase">
            LAPORAN AKTIVITAS SMANKAIH
          </h1>
          <h2 className="text-xs sm:text-sm font-bold text-slate-800 tracking-wide mt-1 uppercase">
            SMANKAIH — 7 Kebiasaan Anak Indonesia Hebat &bull; Pembinaan Karakter Pelajar Pancasila
          </h2>
          <p className="text-[11px] text-slate-500 italic mt-0.5">
            “Langkah kecil hari ini membentuk generasi hebat di masa depan.”
          </p>
        </div>

        {/* Student Identity Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs mb-6">
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-500">Nama Siswa</div>
            <div className="font-bold text-slate-900 text-sm mt-0.5">{user.fullName}</div>
          </div>
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-500">Kelas / Umur</div>
            <div className="font-semibold text-slate-800 mt-0.5">{user.grade} ({user.age} Thn)</div>
          </div>
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-500">Asal Sekolah</div>
            <div className="font-semibold text-slate-800 mt-0.5">{user.school}</div>
          </div>
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-500">Hari & Tanggal Catatan</div>
            <div className="font-bold text-red-700 mt-0.5">
              Hari: {selectedDateInfo.dayName}<br />
              Tanggal: {selectedDateInfo.dateFormatted}
            </div>
          </div>
        </div>

        {/* 7 Habits Execution Table */}
        <div className="mb-6 overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse border border-slate-300">
            <thead>
              <tr className="bg-slate-100 text-slate-800 font-bold border-b border-slate-300">
                <th className="p-2.5 border border-slate-300 text-center w-8">No</th>
                <th className="p-2.5 border border-slate-300">Kebiasaan Positif</th>
                <th className="p-2.5 border border-slate-300 text-center w-24">Target Jam</th>
                <th className="p-2.5 border border-slate-300 text-center w-24">Waktu Selesai</th>
                <th className="p-2.5 border border-slate-300 text-center w-28">Status</th>
                <th className="p-2.5 border border-slate-300">Catatan Aktivitas</th>
              </tr>
            </thead>
            <tbody>
              {habitRows.map((row) => (
                <tr key={row.no} className="border-b border-slate-200 hover:bg-slate-50/50">
                  <td className="p-2.5 border border-slate-300 text-center font-bold text-slate-600">
                    {row.no}
                  </td>
                  <td className="p-2.5 border border-slate-300 font-bold text-slate-900">
                    {row.title}
                  </td>
                  <td className="p-2.5 border border-slate-300 text-center font-mono text-slate-700">
                    {row.targetTime} WIB
                  </td>
                  <td className="p-2.5 border border-slate-300 text-center font-mono text-slate-700">
                    {row.completedAt !== '-' ? `${row.completedAt} WIB` : '-'}
                  </td>
                  <td className="p-2.5 border border-slate-300 text-center">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[11px] font-bold ${
                        row.completed
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : 'bg-amber-100 text-amber-800 border border-amber-300'
                      }`}
                    >
                      {row.completed ? 'Selesai' : 'Belum Selesai'}
                    </span>
                  </td>
                  <td className="p-2.5 border border-slate-300 text-slate-700 text-[11px] italic">
                    {row.notes}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Statistical Summary & Printable Visual Charts */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 p-4 rounded-xl bg-slate-50 border border-slate-200">
          {/* Printable Bar Chart Representation */}
          <div className="space-y-2">
            <div className="font-bold text-slate-800 text-xs flex items-center gap-1.5 border-b border-slate-200 pb-1.5">
              <BarChart3 className="w-3.5 h-3.5 text-red-600" />
              <span>Diagram Batang Status Aktivitas</span>
            </div>
            <div className="space-y-1.5 pt-1">
              {habitRows.map((r) => (
                <div key={r.no} className="flex items-center text-[10px]">
                  <span className="w-24 truncate font-medium text-slate-700">{r.title}</span>
                  <div className="flex-1 h-3 bg-slate-200 rounded overflow-hidden mx-2">
                    <div
                      className={`h-full ${r.completed ? 'bg-emerald-600 w-full' : 'bg-slate-300 w-2'}`}
                    />
                  </div>
                  <span className={`w-14 text-right font-bold ${r.completed ? 'text-emerald-700' : 'text-slate-400'}`}>
                    {r.completed ? '100%' : '0%'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Printable Pie Chart & Summary Metrics */}
          <div className="flex flex-col justify-between">
            <div className="font-bold text-slate-800 text-xs flex items-center gap-1.5 border-b border-slate-200 pb-1.5">
              <PieChart className="w-3.5 h-3.5 text-red-600" />
              <span>Proporsi Capaian Harian</span>
            </div>

            <div className="flex items-center justify-around py-2">
              <svg className="w-24 h-24 transform -rotate-90">
                <circle
                  cx="48"
                  cy="48"
                  r={radius * 0.7}
                  stroke="#e2e8f0"
                  strokeWidth="12"
                  fill="transparent"
                />
                <circle
                  cx="48"
                  cy="48"
                  r={radius * 0.7}
                  stroke="#059669"
                  strokeWidth="12"
                  fill="transparent"
                  strokeDasharray={2 * Math.PI * (radius * 0.7)}
                  strokeDashoffset={2 * Math.PI * (radius * 0.7) * (1 - completedCount / totalPlanned)}
                />
              </svg>

              <div className="text-xs space-y-1">
                <div className="text-xl font-black text-slate-900">
                  {completionPercentage}% Capaian
                </div>
                <div className="text-slate-600 text-[11px]">
                  <strong>{completedCount}</strong> dari <strong>{totalPlanned}</strong> kebiasaan selesai
                </div>
                <div className="text-slate-500 text-[10px]">
                  Belum Selesai: {uncompletedCount}
                </div>
              </div>
            </div>

            <div className="text-[10px] text-slate-500 bg-white p-2 rounded border border-slate-200">
              * Rumus: ({completedCount} ÷ {totalPlanned}) × 100% = {completionPercentage}%
            </div>
          </div>
        </div>

        {/* Validation Signatures Box */}
        <div className="mt-8 pt-4 border-t border-slate-300">
          <div className="text-[11px] text-slate-500 text-right mb-6">
            Diterbitkan secara digital pada {nowDeviceDateInfo.fullFormatted}
          </div>

          <div className="grid grid-cols-3 gap-6 text-center text-xs text-slate-800">
            <div>
              <div className="font-medium text-slate-600 mb-16">Siswa Pelaksana,</div>
              <div className="font-bold border-t border-slate-400 pt-1">
                {user.fullName}
              </div>
              <div className="text-[10px] text-slate-500">Kelas {user.grade}</div>
            </div>

            <div>
              <div className="font-medium text-slate-600 mb-16">Orang Tua / Wali,</div>
              <div className="font-bold border-t border-slate-400 pt-1">
                ( .................................... )
              </div>
              <div className="text-[10px] text-slate-500">Tanda Tangan & Nama Terang</div>
            </div>

            <div>
              <div className="font-medium text-slate-600 mb-16">Guru Pembina / Wali Kelas,</div>
              <div className="font-bold border-t border-slate-400 pt-1">
                ( .................................... )
              </div>
              <div className="text-[10px] text-slate-500">{user.school}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
