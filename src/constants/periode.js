// constants/periode.js
// Konstanta daftar bulan, status penguncian periode, dan helper function formatting

export const DAFTAR_BULAN = [
  { id: '01', nama: 'Januari' },
  { id: '02', nama: 'Februari' },
  { id: '03', nama: 'Maret' },
  { id: '04', nama: 'April' },
  { id: '05', nama: 'Mei' },
  { id: '06', nama: 'Juni' },
  { id: '07', nama: 'Juli' },
  { id: '08', nama: 'Agustus' },
  { id: '09', nama: 'September' },
  { id: '10', nama: 'Oktober' },
  { id: '11', nama: 'November' },
  { id: '12', nama: 'Desember' },
];

export const STATUS_TERBUKA = 'active';
export const STATUS_TERKUNCI = 'inactive';

export const STATUS_PERIODE_CONFIG = {
  [STATUS_TERBUKA]: {
    key: STATUS_TERBUKA,
    label: 'Terbuka (Input Dibuka)',
    color: 'emerald',
    icon: 'lock_open',
  },
  [STATUS_TERKUNCI]: {
    key: STATUS_TERKUNCI,
    label: 'Dikunci (Input Tertutup)',
    color: 'rose',
    icon: 'lock',
  },
};

/**
 * Cek apakah status periode dikunci oleh Admin (Read-Only)
 */
export function isPeriodeLocked(status) {
  if (!status) return true;
  return status === STATUS_TERKUNCI || status === 'locked' || status === 'closed' || status === 'inactive';
}

/**
 * Mengambil nama bulan berdasarkan ID bulan ("01" s/d "12")
 */
export function getNamaBulan(monthId) {
  if (!monthId) return '';
  const monthObj = DAFTAR_BULAN.find((b) => b.id === String(monthId).padStart(2, '0'));
  return monthObj ? monthObj.nama : monthId;
}

/**
 * Mengubah year dan month menjadi format string standar (misal: "2026-02" atau "Februari 2026")
 */
export function formatPeriode(year, month, formatType = 'standard') {
  if (!year || !month) return '';
  const monthFormatted = String(month).padStart(2, '0');
  if (formatType === 'iso') {
    return `${year}-${monthFormatted}`;
  }
  return `${getNamaBulan(monthFormatted)} ${year}`;
}
