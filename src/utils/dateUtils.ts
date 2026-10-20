/**
 * Utilitas Tanggal dan Hari Perangkat (HP / Laptop) SMANKAIH
 * Mengikuti waktu lokal aktual perangkat pengguna secara realtime.
 * 
 * Aturan implementasi:
 * - Menggunakan JavaScript `new Date()` dari perangkat pengguna.
 * - Menggunakan `getFullYear()`, `getMonth()`, `getDate()`, dan `getDay()`.
 * - Menggunakan `Intl.DateTimeFormat('id-ID', ...)` untuk lokalisasi bahasa Indonesia.
 * - Tanpa tanggal statis, tanpa hardcoded, zona waktu mengikuti HP pengguna.
 */

import { useState, useEffect } from 'react';

export const INDONESIAN_DAYS = [
  'Minggu',
  'Senin',
  'Selasa',
  'Rabu',
  'Kamis',
  'Jumat',
  'Sabtu',
];

export const INDONESIAN_MONTHS = [
  'Januari',
  'Februari',
  'Maret',
  'April',
  'Mei',
  'Juni',
  'Juli',
  'Agustus',
  'September',
  'Oktober',
  'November',
  'Desember',
];

export interface FormattedDateResult {
  dayName: string;         // Contoh: "Jumat"
  dateFormatted: string;   // Contoh: "16 Oktober 2026"
  fullFormatted: string;   // Contoh: "Jumat, 16 Oktober 2026"
  isoDate: string;         // "2026-10-16" (zona lokal perangkat)
  dayNumber: number;       // 16
  monthNumber: number;     // 10
  yearNumber: number;      // 2026
  dayIndex: number;        // 0-6 (0 = Minggu)
}

/**
 * Mendapatkan string tanggal ISO lokal "YYYY-MM-DD" dari objek Date.
 * Dibuat khusus menghindari pergeseran hari akibat UTC (seperti toISOString()).
 */
export function getLocalDateString(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Memformat tanggal menjadi komponen hari dan tanggal bahasa Indonesia.
 * Mendukung input Date maupun string "YYYY-MM-DD".
 */
export function formatDeviceDate(inputDate: Date | string = new Date()): FormattedDateResult {
  let dateObj: Date;

  if (typeof inputDate === 'string') {
    const parts = inputDate.split('-').map(Number);
    if (parts.length === 3 && !isNaN(parts[0]) && !isNaN(parts[1]) && !isNaN(parts[2])) {
      // Gunakan konstruktor lokal (year, monthIndex, day)
      dateObj = new Date(parts[0], parts[1] - 1, parts[2]);
    } else {
      dateObj = new Date(inputDate);
    }
  } else {
    dateObj = inputDate;
  }

  // Fallback if dateObj is invalid
  if (isNaN(dateObj.getTime())) {
    dateObj = new Date();
  }

  // Ambil komponen menggunakan metode standar Date
  const year = dateObj.getFullYear();
  const monthIndex = dateObj.getMonth();
  const dateNum = dateObj.getDate();
  const dayIndex = dateObj.getDay();

  // Nama hari dan bulan bahasa Indonesia
  const dayName = INDONESIAN_DAYS[dayIndex] || 'Senin';
  const monthName = INDONESIAN_MONTHS[monthIndex] || 'Januari';
  const dateFormatted = `${dateNum} ${monthName} ${year}`;
  const isoDate = getLocalDateString(dateObj);

  // Verifikasi dan sinkronkan dengan Intl.DateTimeFormat('id-ID')
  let fullFormatted = `${dayName}, ${dateFormatted}`;
  try {
    const intlFormatter = new Intl.DateTimeFormat('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
    fullFormatted = intlFormatter.format(dateObj);
  } catch (err) {
    // Fallback jika browser lawas
    fullFormatted = `${dayName}, ${dateFormatted}`;
  }

  return {
    dayName,
    dateFormatted,
    fullFormatted,
    isoDate,
    dayNumber: dateNum,
    monthNumber: monthIndex + 1,
    yearNumber: year,
    dayIndex,
  };
}

/**
 * Hook React untuk memantau waktu perangkat pengguna secara langsung.
 * - Berjalan setiap detik untuk jam & pergantian hari otomatis.
 * - Memastikan informasi hari dan tanggal selalu sinkron dengan HP.
 */
export function useDeviceDateTime() {
  const [currentDate, setCurrentDate] = useState<Date>(() => new Date());

  useEffect(() => {
    // Perbarui setiap detik
    const timer = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const info = formatDeviceDate(currentDate);

  // Format jam lokal perangkat: HH:MM:SS
  const hours = String(currentDate.getHours()).padStart(2, '0');
  const minutes = String(currentDate.getMinutes()).padStart(2, '0');
  const seconds = String(currentDate.getSeconds()).padStart(2, '0');
  const timeFormatted = `${hours}:${minutes}:${seconds}`;

  return {
    dateObj: currentDate,
    ...info,
    timeFormatted,
  };
}
