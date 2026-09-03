// hooks/anct/useAnctExport.js
'use client';

import { useState } from 'react';
import { ANCT_FIELDS, ANCT_CATATAN_FIELD } from '@/constants/anctFields';
import { namaBulan } from '@/lib/anct/anctConfig';

export function useAnctExport() {
  const [exporting, setExporting] = useState(false);

  const handleExportExcel = async (reportList, { bulan, tahun }) => {
    if (!reportList || reportList.length === 0) return;
    setExporting(true);
    try {
      const XLSX = await import('xlsx');

      const headerRow = ['NO', 'NAMA PUSKESMAS', ...ANCT_FIELDS.map((f) => `${f.group} - ${f.label}`), ANCT_CATATAN_FIELD.label];

      const dataRows = reportList.map((row, idx) => [
        idx + 1,
        row.namaPuskesmas || row.id,
        ...ANCT_FIELDS.map((f) => Number(row[f.key] || 0)),
        row[ANCT_CATATAN_FIELD.key] || '',
      ]);

      const totalRow = [
        '',
        'TOTAL',
        ...ANCT_FIELDS.map((f) => reportList.reduce((sum, row) => sum + (Number(row[f.key]) || 0), 0)),
        '',
      ];

      const sheetData = [headerRow, ...dataRows, totalRow];
      const worksheet = XLSX.utils.aoa_to_sheet(sheetData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Rekap ANCT');

      const fileName = `Rekap_ANCT_${namaBulan(bulan)}_${tahun}.xlsx`;
      XLSX.writeFile(workbook, fileName);
    } catch (err) {
      console.error('useAnctExport handleExportExcel error:', err);
    } finally {
      setExporting(false);
    }
  };

  return { handleExportExcel, exporting };
}