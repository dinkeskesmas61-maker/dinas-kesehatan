'use client';

import { useEffect, useState } from 'react';
import { subscribeActivePeriode } from '@/lib/anc/ancConfig';

/**
 * Hook untuk membaca periode aktif pelaporan dari Firestore settings/active_period.
 * Data di-subscribe secara real-time menggunakan subscribeActivePeriode.
 */
export function usePeriodeAktif() {
  const [periodeAktif, setPeriodeAktif] = useState({
    bulan: null,
    tahun: null,
    status: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = subscribeActivePeriode(
      (data) => {
        if (data) {
          setPeriodeAktif({
            bulan: data.bulan ?? null,
            tahun: data.tahun ?? null,
            status: data.status ?? 'active',
          });
          setError(null);
        } else {
          setPeriodeAktif({ bulan: null, tahun: null, status: null });
          setError('Periode aktif belum dikonfigurasi oleh Admin Dinas Kesehatan.');
        }
        setLoading(false);
      },
      (err) => {
        console.error('usePeriodeAktif error:', err);
        setError('Gagal memuat konfigurasi periode aktif.');
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, []);

  return { ...periodeAktif, loading, error };
}
