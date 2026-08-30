// constants/ancFields.js
// Konfigurasi lengkap 78+ kolom data laporan ANC sesuai Firestore dan format Laporan Pelayanan Kesehatan Ibu Hamil

export const ANC_FIELDS = [
  // --- Master Data & Sasaran (Source: pkm) ---
  { key: 'jumlahPenduduk', label: 'Penduduk', source: 'pkm', isPercent: false },
  { key: 'sasaranBumil', label: 'Sasaran Bumil', source: 'pkm', isPercent: false },
  { key: 'sasaranWus', label: 'Sasaran WUS', source: 'pkm', isPercent: false },

  // --- Buku KIA & K1 Murni ---
  { key: 'bumilBukuKia', label: 'Buku KIA', source: 'anc', isPercent: false },
  { key: 'k1Murni', label: 'K1 Murni', source: 'anc', isPercent: false },
  {
    key: 'k1MurniCakupan',
    label: 'Cakupan K1 Murni (%)',
    source: 'anc',
    isPercent: true,
    getValue: (item, pkm) => {
      if (item.k1MurniCakupan !== undefined) return Number(item.k1MurniCakupan);
      const sasaran = Number(item.sasaranBumil || pkm?.sasaranBumil || 0);
      return sasaran > 0 ? Math.round((Number(item.k1Murni || 0) / sasaran) * 100) : 0;
    },
  },
  { key: 'k1Tw1DokterUsg', label: 'K1 TW1 Dokter + USG', source: 'anc', isPercent: false },
  { key: 'k1Lebih12Minggu', label: 'K1 > 12 Mgg', source: 'anc', isPercent: false },
  {
    key: 'k1Lebih12MingguCakupan',
    label: 'Cakupan K1 > 12 Mgg (%)',
    source: 'anc',
    isPercent: true,
    getValue: (item, pkm) => {
      if (item.k1Lebih12MingguCakupan !== undefined) return Number(item.k1Lebih12MingguCakupan);
      const sasaran = Number(item.sasaranBumil || pkm?.sasaranBumil || 0);
      return sasaran > 0 ? Math.round((Number(item.k1Lebih12Minggu || 0) / sasaran) * 100) : 0;
    },
  },
  { key: 'bukuKiaK1Murni', label: 'Buku KIA K1 Murni', source: 'anc', isPercent: false },

  // --- K1 Akses ---
  {
    key: 'k1Akses',
    label: 'K1 Akses',
    source: 'anc',
    isPercent: false,
    getValue: (item) => (item.k1Akses !== undefined ? Number(item.k1Akses) : Number(item.k1Murni || 0) + Number(item.k1Lebih12Minggu || 0)),
  },
  {
    key: 'k1AksesCakupan',
    label: 'Cakupan K1 Akses (%)',
    source: 'anc',
    isPercent: true,
    getValue: (item, pkm) => {
      if (item.k1AksesCakupan !== undefined) return Number(item.k1AksesCakupan);
      const sasaran = Number(item.sasaranBumil || pkm?.sasaranBumil || 0);
      const k1Akses = item.k1Akses !== undefined ? Number(item.k1Akses) : Number(item.k1Murni || 0) + Number(item.k1Lebih12Minggu || 0);
      return sasaran > 0 ? Math.round((k1Akses / sasaran) * 100) : 0;
    },
  },

  // --- K1 Dokter ---
  { key: 'k1OlehDokter', label: 'K1 Dokter Abs', source: 'anc', isPercent: false },
  {
    key: 'k1DokterCakupan',
    label: 'Cakupan K1 Dokter (%)',
    source: 'anc',
    isPercent: true,
    getValue: (item, pkm) => {
      if (item.k1DokterCakupan !== undefined) return Number(item.k1DokterCakupan);
      const sasaran = Number(item.sasaranBumil || pkm?.sasaranBumil || 0);
      return sasaran > 0 ? Math.round((Number(item.k1OlehDokter || 0) / sasaran) * 100) : 0;
    },
  },

  // --- K5 USG ---
  { key: 'k5OlehDokterUsg', label: 'K5 USG Abs', source: 'anc', isPercent: false },
  {
    key: 'k5UsgCakupan',
    label: 'Cakupan K5 USG (%)',
    source: 'anc',
    isPercent: true,
    getValue: (item, pkm) => {
      if (item.k5UsgCakupan !== undefined) return Number(item.k5UsgCakupan);
      const sasaran = Number(item.sasaranBumil || pkm?.sasaranBumil || 0);
      return sasaran > 0 ? Math.round((Number(item.k5OlehDokterUsg || 0) / sasaran) * 100) : 0;
    },
  },

  // --- K6 ---
  { key: 'k6', label: 'K6 Abs', source: 'anc', isPercent: false },
  {
    key: 'k6Cakupan',
    label: 'Cakupan K6 (%)',
    source: 'anc',
    isPercent: true,
    getValue: (item, pkm) => {
      if (item.k6Cakupan !== undefined) return Number(item.k6Cakupan);
      const sasaran = Number(item.sasaranBumil || pkm?.sasaranBumil || 0);
      return sasaran > 0 ? Math.round((Number(item.k6 || 0) / sasaran) * 100) : 0;
    },
  },

  // --- K8 ---
  { key: 'k8', label: 'K8 Abs', source: 'anc', isPercent: false },
  {
    key: 'k8Cakupan',
    label: 'Cakupan K8 (%)',
    source: 'anc',
    isPercent: true,
    getValue: (item, pkm) => {
      if (item.k8Cakupan !== undefined) return Number(item.k8Cakupan);
      const sasaran = Number(item.sasaranBumil || pkm?.sasaranBumil || 0);
      return sasaran > 0 ? Math.round((Number(item.k8 || 0) / sasaran) * 100) : 0;
    },
  },

  // --- Pelayanan 12 T ---
  { key: 'tbBb', label: 'TB / BB', source: 'anc', isPercent: false },
  { key: 'td', label: 'TD (Tensi)', source: 'anc', isPercent: false },
  { key: 'statusGizi', label: 'Status Gizi (LILA)', source: 'anc', isPercent: false },
  { key: 'tfu', label: 'TFU', source: 'anc', isPercent: false },
  { key: 'djj', label: 'DJJ', source: 'anc', isPercent: false },
  { key: 'statusTt', label: 'Status TT', source: 'anc', isPercent: false },
  { key: 'ttd', label: 'Beri TTD', source: 'anc', isPercent: false },

  // --- Tes Laboratorium 12T ---
  { key: 'hbTm1', label: 'HB (TM1)', source: 'anc', isPercent: false },
  { key: 'hbTm3', label: 'HB (TM3)', source: 'anc', isPercent: false },
  { key: 'golDarah', label: 'Golongan Darah', source: 'anc', isPercent: false },
  { key: 'hiv', label: 'Tes HIV', source: 'anc', isPercent: false },
  { key: 'sifilis', label: 'Tes Sifilis', source: 'anc', isPercent: false },
  { key: 'hepatitis', label: 'Tes Hepatitis B', source: 'anc', isPercent: false },

  // --- Pelayanan & Cakupan 12T ---
  { key: 'tataLaksanaKasus', label: 'Tatalaksana Kasus', source: 'anc', isPercent: false },
  { key: 'temuWicara', label: 'Temu Wicara', source: 'anc', isPercent: false },
  { key: 'usgK1Akses', label: 'USG K1 Akses', source: 'anc', isPercent: false },
  { key: 'skriningJiwa', label: 'Skrining Jiwa', source: 'anc', isPercent: false },
  { key: 'cakupanStandar12tAbs', label: 'Cakupan 12T Abs', source: 'anc', isPercent: false },
  {
    key: 'ancStandar12tCakupan',
    label: 'Cakupan 12T (%)',
    source: 'anc',
    isPercent: true,
    getValue: (item, pkm) => {
      if (item.ancStandar12tCakupan !== undefined) return Number(item.ancStandar12tCakupan);
      const sasaran = Number(item.sasaranBumil || pkm?.sasaranBumil || 0);
      return sasaran > 0 ? Math.round((Number(item.cakupanStandar12tAbs || 0) / sasaran) * 100) : 0;
    },
  },

  // --- Status TT ---
  { key: 't1', label: 'TT1', source: 'anc', isPercent: false },
  { key: 't2', label: 'TT2', source: 'anc', isPercent: false },
  { key: 't3', label: 'TT3', source: 'anc', isPercent: false },
  { key: 't4', label: 'TT4', source: 'anc', isPercent: false },
  { key: 't5', label: 'TT5', source: 'anc', isPercent: false },

  // --- Suplemen TTD 180 ---
  { key: 'ttd180', label: 'TTD 180 Tab', source: 'anc', isPercent: false },

  // --- Anemia ---
  { key: 'anemiaRingan', label: 'Anemia Ringan', source: 'anc', isPercent: false },
  { key: 'anemiaSedang', label: 'Anemia Sedang', source: 'anc', isPercent: false },
  { key: 'anemiaBerat', label: 'Anemia Berat', source: 'anc', isPercent: false },
  {
    key: 'totalAnemia',
    label: 'Total Anemia',
    source: 'anc',
    isPercent: false,
    getValue: (item) =>
      item.totalAnemia !== undefined
        ? Number(item.totalAnemia)
        : Number(item.anemiaRingan || 0) + Number(item.anemiaSedang || 0) + Number(item.anemiaBerat || 0),
  },
  {
    key: 'anemiaCakupan',
    label: 'Cakupan Anemia (%)',
    source: 'anc',
    isPercent: true,
    getValue: (item, pkm) => {
      if (item.anemiaCakupan !== undefined) return Number(item.anemiaCakupan);
      const sasaran = Number(item.sasaranBumil || pkm?.sasaranBumil || 0);
      const totalAn = item.totalAnemia !== undefined
        ? Number(item.totalAnemia)
        : Number(item.anemiaRingan || 0) + Number(item.anemiaSedang || 0) + Number(item.anemiaBerat || 0);
      return sasaran > 0 ? Math.round((totalAn / sasaran) * 100) : 0;
    },
  },

  // --- Status Gizi Bumil ---
  { key: 'konsumsiSuplemenGizi', label: 'Suplemen Gizi', source: 'anc', isPercent: false },
  { key: 'bumilKek', label: 'Bumil KEK', source: 'anc', isPercent: false },
  { key: 'kekDapatMakananTambahan', label: 'KEK + PMT', source: 'anc', isPercent: false },
  { key: 'jumlahKekResikoKek', label: 'Resiko KEK', source: 'anc', isPercent: false },

  // --- Preeklamsia ---
  { key: 'diskriningPreeklamsia', label: 'Skrining PE', source: 'anc', isPercent: false },
  { key: 'bumilPreeklamsia', label: 'Bumil PE', source: 'anc', isPercent: false },
  { key: 'preeklamsiaTataLaksana', label: 'Laksana PE', source: 'anc', isPercent: false },

  // --- Komplikasi Maternal ---
  { key: 'keguguran', label: 'Keguguran', source: 'anc', isPercent: false },
  { key: 'penyakitPenyertaNonObstetrik', label: 'Non-Obstetrik', source: 'anc', isPercent: false },
  { key: 'proteinUrinPositif', label: 'Protein Urin (+)', source: 'anc', isPercent: false },
  { key: 'malaria', label: 'Malaria', source: 'anc', isPercent: false },
  { key: 'hipertensi', label: 'Hipertensi', source: 'anc', isPercent: false },
  { key: 'obesitas', label: 'Obesitas', source: 'anc', isPercent: false },
  { key: 'infeksi', label: 'Infeksi', source: 'anc', isPercent: false },
  { key: 'gangguanJantung', label: 'Gangguan Jantung', source: 'anc', isPercent: false },
  { key: 'diabetes', label: 'Diabetes', source: 'anc', isPercent: false },
  { key: 'tuberkulosis', label: 'TBC', source: 'anc', isPercent: false },

  // --- Resti, Rujukan & PONED ---
  { key: 'kelasBumilMin4x', label: 'Kelas Bumil ≥4x', source: 'anc', isPercent: false },
  { key: 'bumil4t', label: 'Bumil 4T', source: 'anc', isPercent: false },
  { key: 'deteksiRestiNakes', label: 'Resti Nakes', source: 'anc', isPercent: false },
  { key: 'deteksiRestiMasyarakat', label: 'Resti Masyarakat', source: 'anc', isPercent: false },
  { key: 'rujukanMaternal', label: 'Rujukan Maternal', source: 'anc', isPercent: false },
  { key: 'rujukanNeonatal', label: 'Rujukan Neonatal', source: 'anc', isPercent: false },
  { key: 'jumlahPkm', label: 'Jumlah PKM', source: 'anc', isPercent: false },
  { key: 'pkmPoned', label: 'PKM PONED', source: 'anc', isPercent: false },
  {
    key: 'persenPkmPoned',
    label: '% PKM PONED',
    source: 'anc',
    isPercent: true,
    getValue: (item) => {
      if (item.persenPkmPoned !== undefined) return Number(item.persenPkmPoned);
      const jlh = Number(item.jumlahPkm || 1);
      return jlh > 0 ? Math.round((Number(item.pkmPoned || 0) / jlh) * 100) : 0;
    },
  },
];

/**
 * Helper untuk mengambil nilai numerik field dari objek laporan
 */
export function getFieldValue(item, fieldConfig, pkmInfo) {
  if (!item || !fieldConfig) return 0;
  if (fieldConfig.getValue) {
    return fieldConfig.getValue(item, pkmInfo);
  }
  const raw = item[fieldConfig.key] !== undefined ? item[fieldConfig.key] : pkmInfo?.[fieldConfig.key];
  return Number(raw || 0);
}

/**
 * Helper untuk menghitung total (SUM) dan rata-rata (AVG) seluruh indikator ANC
 */
export function calculateAncSummary(reportList) {
  if (!reportList || reportList.length === 0) {
    return { totals: {}, averages: {} };
  }

  const totals = {};
  const averages = {};

  ANC_FIELDS.forEach((field) => {
    const sum = reportList.reduce((acc, curr) => acc + getFieldValue(curr, field, curr), 0);
    totals[field.key] = sum;
    averages[field.key] = Math.round((sum / reportList.length) * 10) / 10;
  });

  return { totals, averages };
}
