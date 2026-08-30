// app/admin/periode/page.js
'use client';

import { useManajemenPeriode } from '@/hooks/useManajemenPeriode';
import PeriodeGridCard from '@/components/periode/PeriodeGridCard';

export default function ManajemenPeriodePage() {
  const {
    selectedYear,
    openedMonths,
    statusPeriodeMap,
    activeMonth,
    loading,
    processing,
    handleCreateNextPeriod,
    handleToggleLock,
    nextMonthName,
  } = useManajemenPeriode();

  if (loading) {
    return <div className="p-8 text-center text-gray-500 text-sm">Memuat data manajemen periode...</div>;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header & Action Button */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <span className="material-symbols-outlined text-emerald-600">calendar_month</span>
            Manajemen Periode Pelaporan Bulanan
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Buka bulan baru secara berurutan atau kontrol akses kunci (buka/tutup) periode yang sudah ada.
          </p>
        </div>

        {nextMonthName ? (
          <button
            type="button"
            onClick={handleCreateNextPeriod}
            disabled={processing}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 rounded-xl text-xs font-semibold shadow-sm transition-all cursor-pointer disabled:opacity-50 flex-shrink-0"
          >
            <span className="material-symbols-outlined text-sm">add_circle</span>
            <span>Buka Periode {nextMonthName} {selectedYear}</span>
          </button>
        ) : (
          <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
            Semua Bulan Tahun {selectedYear} Telah Terbuka
          </span>
        )}
      </div>

      {/* Grid Status 12 Bulan */}
      <PeriodeGridCard
        selectedYear={selectedYear}
        openedMonths={openedMonths}
        statusPeriodeMap={statusPeriodeMap}
        activeMonth={activeMonth}
        onToggleLock={handleToggleLock}
        disabled={processing}
      />
    </div>
  );
}