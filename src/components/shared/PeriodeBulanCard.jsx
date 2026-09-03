// components/PeriodeBulanCard.jsx
// Komponen UI terpisah untuk merender grid card 12 bulan (Januari - Desember) dengan indikator gembok & warning alert.

'use client';

import { useState } from 'react';
import { DAFTAR_BULAN, isPeriodeLocked } from '@/constants/periode';

export default function PeriodeBulanCard({
  selectedMonth,
  onSelectMonth,
  year = String(new Date().getFullYear()),
  statusPeriodeMap = {},
  activeMonth,
}) {
  const [warningMessage, setWarningMessage] = useState(null);

  const handleCardClick = (bulanId, status) => {
    const isLocked = isPeriodeLocked(status);
    if (isLocked) {
      const namaBulanStr = DAFTAR_BULAN?.find((b) => b.id === bulanId)?.nama || bulanId;
      setWarningMessage(`Periode ${namaBulanStr} ${year} telah dikunci oleh Admin Dinas Kesehatan (Read-Only).`);
    } else {
      setWarningMessage(null);
    }

    if (onSelectMonth) {
      onSelectMonth(bulanId);
    }
  };

  const selectedBulanObj = DAFTAR_BULAN?.find((b) => b.id === selectedMonth);

  return (
    <div className="bg-surface-container-low p-4 sm:p-5 rounded-2xl border border-outline-variant shadow-sm space-y-3">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-xl">calendar_view_month</span>
          <h3 className="text-sm font-bold text-on-surface">Pilih Periode Pelaporan Bulanan ({year})</h3>
        </div>
        <span className="text-xs text-on-surface-variant font-medium">
          Bulan Terpilih:{' '}
          <strong className="text-primary font-bold">
            {selectedBulanObj ? `${selectedBulanObj.nama} ${year}` : 'Belum Memilih'}
          </strong>
        </span>
      </div>

      {/* Warning Banner Jika Memilih Bulan Terkunci */}
      {warningMessage && (
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-xs flex items-center justify-between gap-2 animate-fade-in">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-base text-amber-600">lock</span>
            <span className="font-medium">{warningMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setWarningMessage(null)}
            className="text-amber-700 hover:text-amber-900 font-bold text-xs"
          >
            Tutup
          </button>
        </div>
      )}

      {/* Grid 12 Month Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2.5">
        {DAFTAR_BULAN?.map((bulan) => {
          const isSelected = selectedMonth === bulan.id;
          const isMainActive = activeMonth === bulan.id;
          const monthKey = `${year}-${bulan.id}`;
          
          const status =
            statusPeriodeMap[monthKey] ||
            statusPeriodeMap[bulan.id] ||
            (isMainActive ? 'active' : 'inactive');

          const locked = isPeriodeLocked(status);

          return (
            <button
              key={bulan.id}
              type="button"
              onClick={() => handleCardClick(bulan.id, status)}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between min-h-[85px] relative ${
                isSelected
                  ? 'bg-primary text-on-primary border-primary shadow-md ring-2 ring-primary/30 transform scale-[1.02]'
                  : locked
                  ? 'bg-rose-50/40 border-rose-200/60 text-on-surface hover:bg-rose-50/70'
                  : 'bg-surface-container-lowest border-outline-variant text-on-surface hover:bg-surface-container-high hover:border-primary/50'
              }`}
            >
              <div className="flex items-center justify-between w-full gap-1">
                <span
                  className={`w-5 h-5 rounded-full text-[10px] font-extrabold flex items-center justify-center flex-shrink-0 ${
                    isSelected ? 'bg-white text-primary' : 'bg-primary/10 text-primary'
                  }`}
                >
                  {bulan.id}
                </span>

                <div className="flex items-center gap-1 flex-wrap justify-end">
                  {/* Badge Utama jika ini bulan aktif dari Admin */}
                  {isMainActive && (
                    <span
                      className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded-full ${
                        isSelected ? 'bg-amber-300 text-amber-950' : 'bg-amber-100 text-amber-800 border border-amber-300'
                      }`}
                    >
                      Utama
                    </span>
                  )}

                  {/* Badge Status Gembok (Terbuka / Dikunci) */}
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                      isSelected
                        ? 'bg-white/20 text-on-primary'
                        : locked
                        ? 'bg-rose-100 text-rose-800 border border-rose-200'
                        : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[11px]">
                      {locked ? 'lock' : 'lock_open'}
                    </span>
                    <span>{locked ? 'Dikunci' : 'Terbuka'}</span>
                  </span>
                </div>
              </div>

              <div className="mt-2 flex items-center justify-between w-full">
                <span className="text-xs font-bold truncate">{bulan.nama}</span>
                {isSelected && (
                  <span className="material-symbols-outlined text-sm text-on-primary flex-shrink-0">
                    check_circle
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}