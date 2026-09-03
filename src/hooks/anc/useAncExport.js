// hooks/useAncExport.js
// Custom Hook khusus yang menangani ekspor data laporan ANC 78+ indikator ke Excel (.xlsx) menggunakan exceljs

import { useState, useCallback } from 'react';
import { ANC_FIELDS, getFieldValue } from '@/constants/ancFields';
import { namaBulan, STATUS_FIELD, STATUS_SUBMITTED } from '@/lib/anc/ancConfig';

export function useAncExport() {
  const [exporting, setExporting] = useState(false);

  const handleExportExcel = useCallback(async (puskesmasList, activePeriode) => {
    if (!puskesmasList || puskesmasList.length === 0) {
      alert('Tidak ada data Puskesmas untuk diekspor.');
      return;
    }

    setExporting(true);

    try {
      const ExcelJS = (await import('exceljs')).default;
      const workbook = new ExcelJS.Workbook();
      const bulanLabel = activePeriode?.bulan ? namaBulan(activePeriode.bulan) : 'Bulan';
      const tahunLabel = activePeriode?.tahun || '2026';
      const sheetName = `ANC ${bulanLabel}`;
      const worksheet = workbook.addWorksheet(sheetName);

      const totalCols = ANC_FIELDS.length + 2; // No, Nama Puskesmas + ANC_FIELDS
      const endColLetter = worksheet.getColumn(totalCols).letter;

      // 1. Title Banner Header (Baris 1)
      worksheet.mergeCells(`A1:${endColLetter}1`);
      const titleCell = worksheet.getCell('A1');
      titleCell.value = `LAPORAN PELAYANAN ANC KOTA BAUBAU - PERIODE ${activePeriode?.namaPeriode || `${bulanLabel} ${tahunLabel}`}`;
      titleCell.font = { name: 'Arial', size: 14, bold: true, color: { argb: 'FFFFFFFF' } };
      titleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF004D40' } };
      titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
      worksheet.getRow(1).height = 30;

      // 2. Header Level 1 (Baris 3)
      const h1 = [
        'NO', 'NAMA PUSKESMAS', 'JUMLAH PENDUDUK', 'SASARAN BUMIL', 'SASARAN WUS', 'BUKU KIA (K1 AKSES)',
        'PELAYANAN KUNJUNGAN IBU HAMIL', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '',
        'PELAYANAN KUNJUNGAN IBU HAMIL DENGAN 12 T', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '',
        'STATUS IBU HAMIL', '', '', '', '',
        'PEMBERIAN TTD 180 TAB',
        'IBU HAMIL DENGAN ANEMIA', '', '', '', '',
        'STATUS GIZI BUMIL', '', '', '',
        'IBU HAMIL DENGAN PREEKLAMSI', '', '',
        'PELAYANAN KOMPLIKASI MATERNAL', '', '', '', '', '', '', '', '', '',
        'JLH BUMIL MENGIKUTI KELAS BUMIL MINIMAL 4X',
        'IBU HAMIL DENGAN 4T',
        'DETEKSI RESTI IBU HAMIL', '',
        'RUJUKAN', '',
        'JUMLAH KAB/KOTA DENGAN PUSK MAMPU PONED', '', ''
      ];
      worksheet.addRow([]); // Baris 2 kosong pemisah
      const r3 = worksheet.addRow(h1);
      r3.height = 24;

      // 3. Header Level 2 (Baris 4)
      const h2 = [
        '', '', '', '', '', '',
        'K1 MURNI', '', '', '', '', '',
        'K1 AKSES', 'CAKUPAN K1 AKSES (%)',
        'K1 OLEH DOKTER', '',
        'K5 OLEH DOKTER / USG', '',
        'K6', '',
        'K8', '',
        'IBU HAMIL DIPERIKSA TB/BB', 'IBU HAMIL DIPERIKSA TD (TENSI)', 'IBU HAMIL DIPERIKSA STATUS GIZI (LILA)',
        'IBU HAMIL DIUKUR TFU', 'IBU HAMIL DIPERIKSA DJJ', 'IBU HAMIL DIPERIKSA STATUS TT', 'IBU HAMIL DIBERI TTD',
        'TES LABORATORIUM', '', '', '', '', '',
        'IBU HAMIL DITATA LAKSANA KASUS', 'IBU HAMIL DILAKUKAN TEMU WICARA', 'JML IBU HAMIL ANC DENGAN USG', 'JML IBU HAMIL SKRINING JIWA',
        'CAKUPAN ANC SESUAI STANDAR 12 T', '',
        'SKRINING STATUS TT PADA IBU HAMIL', '', '', '', '',
        '',
        'RINGAN', 'SEDANG', 'BERAT', 'TOTAL', 'CAKUPAN (%)',
        'BUMIL KONSUMSI SUPLEMEN GIZI', 'BUMIL KEK', 'BUMIL KEK DAPAT PMT', 'JLH BUMIL KEK & RESIKO KEK',
        'BUMIL DISKRINING PREEKLAMSIA', 'BUMIL DENGAN PREEKLAMSIA', 'BUMIL PREEKLAMSIA DAPAT TATALAKSANA',
        'KEGUGURAN', 'PENYAKIT PENYERTA NON OBSTETRIK', 'PROTEIN URIN (+)', 'MALARIA', 'HIPERTENSI', 'OBESITAS', 'INFEKSI', 'GANGGUAN JANTUNG', 'DIABETES MELITUS', 'TUBERKULOSIS',
        '', '',
        'DETEKSI RESTI OLEH NAKES', 'DETEKSI RESTI OLEH MASYARAKAT',
        'MATERNAL', 'NEONATAL',
        'JUMLAH PKM', 'PKM PONED', '%'
      ];
      const r4 = worksheet.addRow(h2);
      r4.height = 22;

      // 4. Header Level 3 (Baris 5)
      const h3 = [
        '', '', '', '', '', '',
        'K1 MURNI', 'CAKUPAN K1 MURNI (%)', 'K1 TW1 DOKTER+USG', 'K1 > 12 MGG', 'CAKUPAN K1 > 12 MGG (%)', 'BUMIL MEMILIKI BUKU KIA',
        '', '',
        'ABS', 'CAKUPAN (%)',
        'ABS', 'CAKUPAN (%)',
        'ABS', 'CAKUPAN (%)',
        'ABS', 'CAKUPAN (%)',
        '', '', '', '', '', '', '',
        'HB [TM1]', 'HB [TM3]', 'GOL. DARAH', 'HIV', 'SIFILIS', 'HEPATITIS',
        '', '', '', '',
        'ABS', 'CAKUPAN (%)',
        'T1', 'T2', 'T3', 'T4', 'T5',
        '',
        'ABS', 'ABS', 'ABS', 'ABS', 'CAKUPAN (%)',
        '', '', '', '',
        '', '', '',
        '', '', '', '', '', '', '', '', '', '',
        '', '',
        '', '',
        '', '',
        'ABS', 'ABS', '%'
      ];
      const r5 = worksheet.addRow(h3);
      r5.height = 20;

      // Styling Header (Baris 3-5)
      [r3, r4, r5].forEach((row) => {
        row.eachCell((cell) => {
          cell.font = { name: 'Arial', size: 9, bold: true, color: { argb: 'FFFFFFFF' } };
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF00695C' } };
          cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
          cell.border = {
            top: { style: 'thin', color: { argb: 'FFB2DFDB' } },
            left: { style: 'thin', color: { argb: 'FFB2DFDB' } },
            bottom: { style: 'thin', color: { argb: 'FF004D40' } },
            right: { style: 'thin', color: { argb: 'FFB2DFDB' } },
          };
        });
      });

      // 5. Populate Data Rows (Baris 6+)
      puskesmasList.forEach((pkm, idx) => {
        const rowValues = [
          idx + 1,
          pkm.namaPuskesmas || pkm.nama || `Puskesmas ${idx + 1}`,
          ...ANC_FIELDS.map((field) => getFieldValue(pkm, field, pkm)),
        ];

        const row = worksheet.addRow(rowValues);
        row.height = 20;
        const isEven = idx % 2 === 0;
        const bgColor = isEven ? 'FFFFFFFF' : 'FFF2F7F7';

        row.eachCell((cell, colNum) => {
          cell.font = { name: 'Arial', size: 9 };
          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: bgColor } };
          cell.border = {
            top: { style: 'thin', color: { argb: 'FFE0E0E0' } },
            left: { style: 'thin', color: { argb: 'FFE0E0E0' } },
            bottom: { style: 'thin', color: { argb: 'FFE0E0E0' } },
            right: { style: 'thin', color: { argb: 'FFE0E0E0' } },
          };

          if (colNum === 1) {
            cell.alignment = { horizontal: 'center', vertical: 'middle' };
          } else if (colNum === 2) {
            cell.alignment = { horizontal: 'left', vertical: 'middle' };
            cell.font = { name: 'Arial', size: 9, bold: true };
          } else {
            cell.alignment = { horizontal: 'right', vertical: 'middle' };
          }
        });
      });

      // Auto-fit width
      worksheet.columns.forEach((col) => {
        let maxLen = 10;
        col.eachCell({ includeEmpty: false }, (cell) => {
          const s = cell.value ? String(cell.value) : '';
          if (s.length > maxLen) maxLen = s.length;
        });
        col.width = Math.min(Math.max(maxLen + 2, 10), 30);
      });

      // Generate Buffer & Trigger Browser Download
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      const url = window.URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = `Laporan_Lengkap_ANC_Baubau_${tahunLabel}_${bulanLabel}.xlsx`;
      anchor.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error exporting Excel:', err);
      alert('Gagal mengekspor file Excel: ' + err.message);
    } finally {
      setExporting(false);
    }
  }, []);

  return {
    handleExportExcel,
    exportToExcel: handleExportExcel,
    exporting,
  };
}
