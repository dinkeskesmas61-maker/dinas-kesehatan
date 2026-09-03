// hooks/usePncExport.js
//
// Export rekap PNC ke file .xlsx menggunakan SheetJS (xlsx).
// Meniru pola useAncExport.

'use client';

import { useState } from 'react';
import { PNC_COLUMNS, getColAbs, getColDenominator, formatPercent } from '@/lib/pnc/pncColumns';
import { PNC_FIELDS } from '@/lib/pnc/pncFields';
import { namaBulan } from '@/lib/pnc/pncConfig';

export function usePncExport() {
  const [exporting, setExporting] = useState(false);

  const handleExportExcel = async (reportList, { bulan, tahun }) => {
    if (!reportList || reportList.length === 0) return;
    setExporting(true);
    try {
      const XLSX = await import('xlsx');

      const headerRow1 = ['NO', 'NAMA PUSKESMAS', 'BULIN'];
      const headerRow2 = ['', '', ''];
      PNC_COLUMNS.forEach((col) => {
        headerRow1.push(col.label, '');
        headerRow2.push('Abs', '%');
      });

      const dataRows = reportList.map((row, idx) => {
        const bulinVal = Number(row[PNC_FIELDS.BULIN]) || 0;
        const rowCells = [idx + 1, row.nama || row.id, bulinVal];
        PNC_COLUMNS.forEach((col) => {
          const abs = getColAbs(row, col);
          const denom = getColDenominator(row, col);
          rowCells.push(abs, formatPercent(abs, denom));
        });
        return rowCells;
      });

      const totalBulin = reportList.reduce((sum, row) => sum + (Number(row[PNC_FIELDS.BULIN]) || 0), 0);
      const totalRow = ['', 'TOTAL', totalBulin];
      PNC_COLUMNS.forEach((col) => {
        const totalAbs = reportList.reduce((sum, row) => sum + getColAbs(row, col), 0);
        const totalDenom = col.denominatorKey
          ? reportList.reduce((sum, row) => sum + (Number(row[col.denominatorKey]) || 0), 0)
          : totalBulin;
        totalRow.push(totalAbs, formatPercent(totalAbs, totalDenom));
      });

      const sheetData = [headerRow1, headerRow2, ...dataRows, totalRow];
      const worksheet = XLSX.utils.aoa_to_sheet(sheetData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Rekap PNC');

      const fileName = `Rekap_PNC_${namaBulan(bulan)}_${tahun}.xlsx`;
      XLSX.writeFile(workbook, fileName);
    } catch (err) {
      console.error('usePncExport handleExportExcel error:', err);
    } finally {
      setExporting(false);
    }
  };

  return { handleExportExcel, exporting };
}