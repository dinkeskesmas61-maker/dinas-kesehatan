// constants/kematianFields.js
// Field laporan Kematian Ibu berdasarkan Sebab Kematian, sesuai sheet
// Excel "KM" (KM JAN, KM FEB, dst).

export const KEMATIAN_FIELDS = [
  // --- Saat Kejadian ---
  { key: 'hamil', label: 'Hamil', group: 'Saat Kejadian' },
  { key: 'bersalin', label: 'Bersalin', group: 'Saat Kejadian' },
  { key: 'nifas', label: 'Nifas', group: 'Saat Kejadian' },

  // --- Sebab Kematian Ibu ---
  { key: 'perdarahan', label: 'Perdarahan', group: 'Sebab Kematian Ibu' },
  { key: 'gangguanHipertensi', label: 'Gangguan Hipertensi', group: 'Sebab Kematian Ibu' },
  { key: 'infeksi', label: 'Infeksi', group: 'Sebab Kematian Ibu' },
  { key: 'komplikasiPascaKeguguran', label: 'Komplikasi Pasca Keguguran (Abortus)', group: 'Sebab Kematian Ibu' },
  { key: 'partusLama', label: 'Partus Lama', group: 'Sebab Kematian Ibu' },
  { key: 'kelainanJantung', label: 'Kelainan Jantung & Pembuluh Darah', group: 'Sebab Kematian Ibu' },
  { key: 'gangguanAutoimun', label: 'Gangguan Autoimun', group: 'Sebab Kematian Ibu' },
  { key: 'gangguanCerebrovaskular', label: 'Gangguan Cerebrovaskular', group: 'Sebab Kematian Ibu' },
  { key: 'covid19', label: 'COVID-19', group: 'Sebab Kematian Ibu' },
  { key: 'lainLain', label: 'Lain-lain', group: 'Sebab Kematian Ibu' },
];

// Field teks bebas — keterangan jenis sebab kematian "lain-lain"
export const KEMATIAN_CATATAN_FIELD = {
  key: 'catatanLainLain',
  label: 'Keterangan Lain-lain',
};

// Jumlah Kematian Ibu (otomatis) = hamil + bersalin + nifas
export function hitungJumlahKematianIbu(values) {
  return (
    (Number(values.hamil) || 0) +
    (Number(values.bersalin) || 0) +
    (Number(values.nifas) || 0)
  );
}

export function getKematianFieldValue(item, fieldConfig) {
  if (!item || !fieldConfig) return 0;
  return Number(item[fieldConfig.key] || 0);
}

export function calculateKematianSummary(reportList) {
  const totals = {};
  KEMATIAN_FIELDS.forEach((field) => {
    totals[field.key] = (reportList || []).reduce(
      (sum, row) => sum + getKematianFieldValue(row, field),
      0
    );
  });
  totals.jumlahKematianIbu = (reportList || []).reduce(
    (sum, row) => sum + hitungJumlahKematianIbu(row),
    0
  );
  return { totals };
}