// components/periode/PeriodeGridCard.jsx
'use client';

import { DAFTAR_BULAN, isPeriodeLocked, STATUS_TERBUKA } from '@/constants/periode';

export default function PeriodeGridCard({
  selectedYear,
  openedMonths,
  statusPeriodeMap,
  activeMonth,
  onToggleLock,
  disabled,
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {DAFTAR_BULAN.map((bulan) => {
        const isOpened = openedMonths.includes(bulan.id);
        const periodId = `${selectedYear}-${bulan.id}`;
        const currentStatus = statusPeriodeMap[periodId] || STATUS_TERBUKA;
        const locked = isPeriodeLocked(currentStatus);
        const isMainActive = activeMonth === bulan.id;

        return (
          <div
            key={bulan.id}
            className={`p-4 rounded-xl border flex flex-col justify-between space-y-3 transition-all ${
              !isOpened
                ? 'bg-gray-50 border-gray-200 opacity-60'
                : locked
                ? 'bg-rose-50/50 border-rose-200'
                : 'bg-white border-gray-200 shadow-sm'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-sm text-gray-800 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 text-xs flex items-center justify-center font-extrabold">
                  {bulan.id}
                </span>
                {bulan.nama}
              </span>

              {isOpened && (
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                    locked
                      ? 'bg-rose-100 text-rose-800 border border-rose-200'
                      : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                  }`}
                >
                  <span className="material-symbols-outlined text-[11px]">
                    {locked ? 'lock' : 'lock_open'}
                  </span>
                  {locked ? 'Dikunci' : 'Terbuka'}
                </span>
              )}
            </div>

            <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
              {!isOpened ? (
                <span className="text-xs text-gray-400 italic">Belum dibuat</span>
              ) : (
                <>
                  <span className="text-[11px] text-gray-500 font-medium">
                    {isMainActive ? ' Periode Utama' : ' Periode Arsip'}
                  </span>
                  <button
                    type="button"
                    onClick={() => onToggleLock(bulan.id)}
                    disabled={disabled}
                    className={`text-xs px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                      locked
                        ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200'
                        : 'bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200'
                    }`}
                  >
                    {locked ? 'Buka Kunci' : 'Kunci Periode'}
                  </button>
                </>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}