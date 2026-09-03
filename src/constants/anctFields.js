// constants/anctFields.js
// Konfigurasi kolom data laporan ANC Terpadu sesuai sheet Excel "ANCT" (per bulan).
//
// BEDA MENDASAR dari ANC biasa:
// - ANC Terpadu murni angka manual, TIDAK ADA kolom % cakupan otomatis
//   (beda dari ancFields.js yang banyak field getValue() untuk hitung %)
// - Semua field di sini adalah hasil rekap kumulatif "kasus BARU" bulan ini
//   (ibu yang sudah pernah dicatat di kehamilan yang sama TIDAK dihitung lagi
//   — tapi itu aturan bisnis di level Puskesmas/bidan, bukan logic di web app)
// - Field CATATAN (kolom Z di Excel) adalah teks bebas, bukan angka

export const ANCT_FIELDS = [
  // --- PPIA (Pencegahan Penularan HIV dari Ibu ke Anak) ---
  { key: 'hivBumilDatangPositif', label: 'Bumil Datang dgn HIV(+)', group: 'PPIA (HIV)' },
  { key: 'hivDitawarkanTes', label: 'Ditawarkan Tes HIV', group: 'PPIA (HIV)' },
  { key: 'hivDiTes', label: 'Di Tes HIV', group: 'PPIA (HIV)' },
  { key: 'hivHasilPositif', label: 'Hasil Tes HIV (+)', group: 'PPIA (HIV)' },
  { key: 'hivMendapatArv', label: 'Mendapat ARV', group: 'PPIA (HIV)' },
  { key: 'hivPersalinanPervaginam', label: 'Persalinan Pervaginam (HIV+)', group: 'PPIA (HIV)' },
  { key: 'hivPersalinanSc', label: 'Persalinan SC (HIV+)', group: 'PPIA (HIV)' },

  // --- Pencegahan Malaria dalam Kehamilan ---
  { key: 'malariaMendapatKelambu', label: 'Mendapat Kelambu', group: 'Malaria' },
  { key: 'malariaDiperiksaRdt', label: 'Diperiksa Mikroskopis/RDT', group: 'Malaria' },
  { key: 'malariaHasilPositif', label: 'Malaria (+)', group: 'Malaria' },
  { key: 'malariaMendapatObat', label: 'Mendapat Kina/ACT', group: 'Malaria' },

  // --- TB dalam Kehamilan ---
  { key: 'tbDiperiksaDahak', label: 'Diperiksa Dahak', group: 'TB' },
  { key: 'tbHasilPositif', label: 'Hasil Dahak TB (+)', group: 'TB' },
  { key: 'tbMendapatObat', label: 'Mendapat Obat TB', group: 'TB' },

  // --- Kecacingan dalam Kehamilan ---
  { key: 'cacingDiperiksa', label: 'Diperiksa Angkylostoma', group: 'Kecacingan' },
  { key: 'cacingHasilPositif', label: 'Hasil Tes (+)', group: 'Kecacingan' },
  { key: 'cacingDiberiObat', label: 'Diberi Obat', group: 'Kecacingan' },

  // --- Pencegahan IMS dalam Kehamilan ---
  { key: 'imsDiperiksa', label: 'Diperiksa IMS', group: 'IMS' },
  { key: 'imsHasilPositif', label: 'Hasil Tes IMS (+)', group: 'IMS' },
  { key: 'imsDiobati', label: 'Diobati', group: 'IMS' },

  // --- Pencegahan Hepatitis B dalam Kehamilan ---
  { key: 'hepbDiperiksa', label: 'Diperiksa Hepatitis B', group: 'Hepatitis B' },
  { key: 'hepbHasilPositif', label: 'Hasil Hepatitis B (+)', group: 'Hepatitis B' },
  { key: 'hepbDiobati', label: 'Diobati', group: 'Hepatitis B' },
  { key: 'hepbBayiVaksinHbig', label: 'Bayi Mendapat Vaksin HBIg', group: 'Hepatitis B' },
];

// Field teks bebas (bukan angka) — kolom Z di Excel, keterangan jenis kasus khusus
export const ANCT_CATATAN_FIELD = {
  key: 'catatanKasusKhusus',
  label: 'Catatan / Keterangan Kasus Khusus',
};

/**
 * Helper ambil nilai numerik field dari objek laporan
 */
export function getAnctFieldValue(item, fieldConfig) {
  if (!item || !fieldConfig) return 0;
  return Number(item[fieldConfig.key] || 0);
}

/**
 * Hitung total (SUM) seluruh indikator ANC Terpadu dari daftar laporan
 * (tidak ada rata-rata/cakupan % — sesuai sheet Excel aslinya)
 */
export function calculateAnctSummary(reportList) {
  const totals = {};
  ANCT_FIELDS.forEach((field) => {
    totals[field.key] = (reportList || []).reduce(
      (sum, row) => sum + getAnctFieldValue(row, field),
      0
    );
  });
  return { totals };
}