// app/dashboard/anc/page.js
// Halaman Form Input ANC Petugas Puskesmas dengan Pemilih Bulan, Auto-Switch Otomatis ke Bulan Aktif Admin, dan Peninjauan Riwayat.

'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp, onSnapshot } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import {
  subscribeActivePeriode,
  getAncReportRef,
  getAncCollectionName,
  namaBulan,
  STATUS_DRAFT,
  STATUS_SUBMITTED,
  STATUS_FIELD,
  TEMPLATE_KOLOM_ANC,
} from '@/lib/anc/ancConfig';
import { DAFTAR_BULAN, formatPeriode } from '@/constants/periode';

import PeriodeBulanCard from '@/components/PeriodeBulanCard';
import StepKunjunganK1K8 from '@/components/anc/StepKunjunganK1K8';
import Step12T from '@/components/anc/Step12T';
import StepTesLab from '@/components/anc/StepTesLab';
import StepStatusGiziAnemia from '@/components/anc/StepStatusGiziAnemia';
import StepPreeklamsiaKomplikasi from '@/components/anc/StepPreeklamsiaKomplikasi';
import StepDeteksiRestiRujukan from '@/components/anc/StepDeteksiRestiRujukan';
import AncReportTablePreview from '@/components/anc/AncReportTablePreview';

const STEPS = [
  { id: 1, label: 'Kunjungan K1-K8', shortLabel: 'K1-K8' },
  { id: 2, label: 'Checklist 12T', shortLabel: '12T' },
  { id: 3, label: 'Tes Lab & Tata Laksana', shortLabel: 'Tes Lab' },
  { id: 4, label: 'Status TT, Anemia & Gizi', shortLabel: 'TT & Gizi' },
  { id: 5, label: 'Preeklamsia & Komplikasi', shortLabel: 'Komplikasi' },
  { id: 6, label: 'Deteksi Resti & PONED', shortLabel: 'Resti & PONED' },
];

export default function FormANCPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [autoSaveStatus, setAutoSaveStatus] = useState('saved');
  const [activeStep, setActiveStep] = useState(1);
  const [activeViewTab, setActiveViewTab] = useState('wizard');
  const [userProfile, setUserProfile] = useState(null);
  const [targetBumil, setTargetBumil] = useState(0);
  const [formData, setFormData] = useState(TEMPLATE_KOLOM_ANC);

  // State Pemilihan Bulan & Tahun
  const [selectedMonth, setSelectedMonth] = useState('01');
  const [selectedYear, setSelectedYear] = useState(String(new Date().getFullYear()));
  const [userManuallySelected, setUserManuallySelected] = useState(false);

  // State Keberadaan Dokumen di Firestore
  const [periodDocExists, setPeriodDocExists] = useState(null);

  // Status Periode Aktif & Status Per-Bulan Real-Time
  const [activePeriode, setActivePeriode] = useState(null);
  const [periodStatusesMap, setPeriodStatusesMap] = useState({});
  const [periodeLoading, setPeriodeLoading] = useState(true);

  // 1. Listen real-time status active_period
  useEffect(() => {
    const unsubscribe = subscribeActivePeriode(
      (active) => {
        if (active) {
          setActivePeriode(active);
        }
        setPeriodeLoading(false);
      },
      (err) => {
        console.error('Error loading active period:', err);
        setPeriodeLoading(false);
      }
    );
    return () => unsubscribe();
  }, []);

  // 2. Listen real-time status Buka/Kunci per-bulan dari settings/period_statuses
  useEffect(() => {
    const statusesRef = doc(db, 'settings', 'period_statuses');
    const unsubscribe = onSnapshot(statusesRef, (snap) => {
      if (snap.exists()) {
        setPeriodStatusesMap(snap.data() || {});
      }
    });
    return () => unsubscribe();
  }, []);

  // 3. Auto-switch selectedMonth ke bulan aktif riil dari Admin jika user belum memilih bulan secara manual
  useEffect(() => {
    if (userManuallySelected) return;

    let targetMonth = activePeriode?.bulan;
    let targetYear = activePeriode?.tahun || selectedYear;

    const activeEntries = Object.entries(periodStatusesMap).filter(
      ([key, status]) => key.startsWith(`${targetYear}-`) && status === 'active'
    );
    if (activeEntries.length > 0) {
      const highestActiveKey = activeEntries.sort().pop()[0];
      targetMonth = highestActiveKey.split('-')[1];
    }

    if (targetMonth) {
      setSelectedMonth(targetMonth);
      if (targetYear) setSelectedYear(targetYear);
    }
  }, [activePeriode, periodStatusesMap, userManuallySelected, selectedYear]);

  const periodKey = `${selectedYear}-${selectedMonth}`;
  const specificStatus = periodStatusesMap[periodKey];

  const isSelectedActivePeriod =
    activePeriode &&
    activePeriode.bulan === selectedMonth &&
    activePeriode.tahun === selectedYear;

  const isAdmin = userProfile?.role === 'admin_dinkes';

  // Editable jika specificStatus === 'active', atau jika bulan ini active_period dengan status 'active', atau jika Admin
  const isEditable =
    isAdmin ||
    (specificStatus === 'active') ||
    (specificStatus !== 'inactive' && isSelectedActivePeriod && activePeriode?.status === 'active');

  const isReadOnly = !isEditable;

  const currentCollectionName = getAncCollectionName(selectedYear, selectedMonth);

  // Fetch data laporan ANC untuk bulan terpilih
  const fetchReportDataForMonth = useCallback(
    async (puskId, targetCollection) => {
      if (!targetCollection || !puskId) {
        setPeriodDocExists(false);
        return;
      }

      try {
        const reportRef = getAncReportRef(targetCollection, puskId);
        const reportSnap = await getDoc(reportRef);

        if (reportSnap.exists()) {
          setPeriodDocExists(true);
          const data = reportSnap.data();
          setFormData(() => {
            const merged = { ...TEMPLATE_KOLOM_ANC };
            Object.keys(TEMPLATE_KOLOM_ANC).forEach((key) => {
              if (data[key] !== undefined) merged[key] = data[key];
            });
            return merged;
          });
        } else {
          setPeriodDocExists(false);
          setFormData(TEMPLATE_KOLOM_ANC);
        }
      } catch (err) {
        console.error('Error fetching report data for month:', err);
        setPeriodDocExists(false);
        setFormData(TEMPLATE_KOLOM_ANC);
      }
    },
    []
  );

  // Load User Profile
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.push('/');
        return;
      }
      try {
        const userRef = doc(db, 'users', user.email);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const uData = userSnap.data();
          setUserProfile(uData);

          if (uData.puskesmasId) {
            const sasaranRef = doc(db, 'sasaran', `${uData.puskesmasId}-${selectedYear}`);
            const sasaranSnap = await getDoc(sasaranRef);
            if (sasaranSnap.exists()) setTargetBumil(sasaranSnap.data().bumil || 0);

            await fetchReportDataForMonth(uData.puskesmasId, currentCollectionName);
          }
        } else {
          router.push('/');
        }
      } catch (err) {
        console.error('Error initializing Form ANC:', err);
      } finally {
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, [router, selectedYear, currentCollectionName, fetchReportDataForMonth]);

  // Handle klik pilih bulan di PeriodeBulanCard
  const handleSelectMonth = async (mId) => {
    setUserManuallySelected(true);
    setSelectedMonth(mId);
    if (userProfile?.puskesmasId) {
      const targetCol = getAncCollectionName(selectedYear, mId);
      await fetchReportDataForMonth(userProfile.puskesmasId, targetCol);
    }
  };

  // Simpan data laporan ke Firestore
  const saveToFirestore = useCallback(
    async (dataToSave, statusReport = STATUS_DRAFT) => {
      if (isReadOnly || !periodDocExists || !userProfile?.puskesmasId) {
        return;
      }

      setAutoSaveStatus('saving');

      const k1Murni = Number(dataToSave.k1Murni || 0);
      const k1Lebih12Minggu = Number(dataToSave.k1Lebih12Minggu || 0);
      const k1Akses = k1Murni + k1Lebih12Minggu;
      const totalAnemia =
        Number(dataToSave.anemiaRingan || 0) +
        Number(dataToSave.anemiaSedang || 0) +
        Number(dataToSave.anemiaBerat || 0);
      const jumlahPkm = Number(dataToSave.jumlahPkm || 0);
      const pkmPoned = Number(dataToSave.pkmPoned || 0);
      const persenPkmPoned = jumlahPkm > 0 ? Math.round((pkmPoned / jumlahPkm) * 100) : 0;

      const periodeId = `${selectedYear}-${selectedMonth}`;
      const uniqueDocId = `${periodeId}_${userProfile.puskesmasId}`;

      const reportPayload = {
        puskesmasId: userProfile.puskesmasId,
        namaPuskesmas: userProfile.namaPuskesmas || userProfile.puskesmasId,
        periode: periodeId,
        ...dataToSave,
        k1Akses,
        totalAnemia,
        persenPkmPoned,
        [STATUS_FIELD]: statusReport,
        updatedAt: serverTimestamp(),
        updatedBy: userProfile.email,
      };

      try {
        const reportRef = getAncReportRef(currentCollectionName, userProfile.puskesmasId);
        await setDoc(reportRef, reportPayload, { merge: true });

        const globalAncReportRef = doc(db, 'anc_reports', uniqueDocId);
        await setDoc(globalAncReportRef, reportPayload, { merge: true });

        const rekapRef = doc(db, 'rekap_kelengkapan', uniqueDocId);
        await setDoc(
          rekapRef,
          {
            periode: periodeId,
            puskesmasId: userProfile.puskesmasId,
            namaPuskesmas: userProfile.namaPuskesmas || userProfile.puskesmasId,
            isSubmitted: statusReport === STATUS_SUBMITTED,
            submittedAt: serverTimestamp(),
          },
          { merge: true }
        );

        setAutoSaveStatus('saved');
      } catch (err) {
        console.error('Error saving ANC report:', err);
        setAutoSaveStatus('error');
      }
    },
    [isReadOnly, periodDocExists, userProfile, currentCollectionName, selectedYear, selectedMonth]
  );

  const handleInputChange = (e) => {
    if (isReadOnly || !periodDocExists) return;
    const { name, value } = e.target;
    const val = Math.max(0, parseInt(value, 10) || 0);
    setFormData((prev) => ({ ...prev, [name]: val }));
  };

  const goToStep = (stepNumber) => {
    if (stepNumber < 1 || stepNumber > 6) return;
    if (isEditable && periodDocExists) {
      saveToFirestore(formData, STATUS_DRAFT);
    }
    setActiveStep(stepNumber);
  };

  const handleFinalSubmit = async (e) => {
    if (e) e.preventDefault();
    if (isReadOnly || !periodDocExists) return;
    setSaving(true);
    try {
      await saveToFirestore(formData, STATUS_SUBMITTED);
      alert(`Laporan ANC untuk ${formatPeriode(selectedYear, selectedMonth)} berhasil disimpan dan ditandai selesai!`);
      router.push('/dashboard');
    } catch (err) {
      console.error('Error submitting final ANC report:', err);
      alert('Gagal menyimpan laporan final: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading || periodeLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface text-on-surface">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-on-surface-variant font-medium text-xs">Memuat Halaman Form ANC...</p>
        </div>
      </div>
    );
  }

  const puskesmasName =
    userProfile?.namaPuskesmas ||
    (userProfile?.puskesmasId
      ? userProfile.puskesmasId.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
      : 'Puskesmas');

  return (
    <main className="flex-1 p-margin-desktop bg-surface max-w-container-max mx-auto w-full flex flex-col gap-6">
      {/* Header Utama */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-outline-variant pb-4">
        <div>
          <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface">
            Form Pelaporan ANC Puskesmas
          </h2>
          <div className="flex items-center gap-2 mt-1 text-on-surface-variant font-body-md text-body-md">
            <span className="material-symbols-outlined text-sm">local_hospital</span>
            <span className="font-medium text-primary">{puskesmasName}</span>
            <span>•</span>
            <span>Target Sasaran Bumil: <strong>{targetBumil}</strong> orang</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {isEditable && autoSaveStatus === 'saving' && (
            <span className="inline-flex items-center gap-1.5 text-xs text-amber-700 font-medium bg-amber-50 px-3 py-1.5 rounded-full border border-amber-200">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />Menyimpan...
            </span>
          )}
          {isEditable && autoSaveStatus === 'saved' && (
            <span className="inline-flex items-center gap-1.5 text-xs text-emerald-700 font-medium bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200">
              <span className="material-symbols-outlined text-[14px]">check_circle</span>Tersimpan Otomatis
            </span>
          )}

          <div
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border font-medium text-xs ${
              isEditable
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : 'bg-rose-50 border-rose-200 text-rose-800'
            }`}
          >
            <span className="material-symbols-outlined text-sm">
              {isEditable ? 'lock_open' : 'lock'}
            </span>
            <span>
              Mode Bulan Terpilih: <strong>{formatPeriode(selectedYear, selectedMonth)}</strong> —{' '}
              {isEditable ? 'Buka (Bisa Diisi)' : 'Read-Only (Riwayat)'}
            </span>
          </div>
        </div>
      </header>

      {/* Grid Selection 12 Bulan */}
      <PeriodeBulanCard
        selectedMonth={selectedMonth}
        onSelectMonth={handleSelectMonth}
        year={selectedYear}
        statusPeriodeMap={periodStatusesMap}
        activeMonth={activePeriode?.bulan}
      />

      {/* Banner Notifikasi Status Akses Bulan Terpilih */}
      {!periodDocExists && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-amber-900 text-xs flex items-center gap-3">
          <span className="material-symbols-outlined text-2xl text-amber-600">info</span>
          <div>
            <p className="font-bold">Periode Belum Pernah Dibuka</p>
            <p className="mt-0.5 opacity-90">
              Dokumen pelaporan untuk <strong>{formatPeriode(selectedYear, selectedMonth)}</strong> belum pernah diinisialisasi oleh Admin Dinas Kesehatan.
            </p>
          </div>
        </div>
      )}

      {periodDocExists && isReadOnly && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-900 text-xs flex items-center gap-3">
          <span className="material-symbols-outlined text-2xl text-rose-600">lock</span>
          <div>
            <p className="font-bold">Mode Riwayat Laporan (Read-Only)</p>
            <p className="mt-0.5 opacity-90">
              Periode <strong>{formatPeriode(selectedYear, selectedMonth)}</strong> dalam status Dikunci. Anda dapat meninjau seluruh riwayat angka yang pernah diisikan. Jika perlu melakukan perubahan/susulan data, hubungi Admin Dinkes untuk Membuka Kembali Input bulan ini.
            </p>
          </div>
        </div>
      )}

      {/* View Mode Tabs */}
      <div className="flex border-b border-outline-variant gap-2">
        <button
          type="button"
          onClick={() => setActiveViewTab('wizard')}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 rounded-t-xl transition flex items-center gap-2 ${
            activeViewTab === 'wizard'
              ? 'border-primary text-primary bg-surface-container-low'
              : 'border-transparent text-on-surface-variant hover:text-on-surface hover:bg-surface-container-lowest'
          }`}
        >
          <span className="material-symbols-outlined text-base">edit_note</span>
          Form Input / Riwayat (Wizard 6 Langkah)
        </button>

        <button
          type="button"
          onClick={() => setActiveViewTab('preview')}
          className={`px-4 py-2.5 text-xs font-bold border-b-2 rounded-t-xl transition flex items-center gap-2 ${
            activeViewTab === 'preview'
              ? 'border-primary text-primary bg-surface-container-low'
              : 'border-transparent text-on-surface-variant hover:text-on-surface hover:bg-surface-container-lowest'
          }`}
        >
          <span className="material-symbols-outlined text-base">table_view</span>
          Lihat Rekapitulasi & Export Excel (.xlsx)
        </button>
      </div>

      {activeViewTab === 'preview' ? (
        <AncReportTablePreview
          userProfile={userProfile}
          selectedMonth={selectedMonth}
          selectedYear={selectedYear}
        />
      ) : (
        <>
          <nav aria-label="Step Indicator" className="w-full bg-surface-container-lowest border border-outline-variant rounded-xl p-3 shadow-sm">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
              {STEPS.map((step) => {
                const isActive = activeStep === step.id;
                return (
                  <button
                    key={step.id}
                    type="button"
                    onClick={() => goToStep(step.id)}
                    className={`flex flex-col items-center justify-center p-2.5 rounded-lg text-center transition-all duration-200 cursor-pointer ${
                      isActive
                        ? 'bg-primary-container text-on-primary-container font-bold shadow-sm ring-2 ring-primary-container/30'
                        : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high'
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                          isActive ? 'bg-white text-primary-container' : 'bg-outline-variant text-on-surface'
                        }`}
                      >
                        {step.id}
                      </span>
                      <span className="text-xs font-semibold truncate">{step.shortLabel}</span>
                    </div>
                    <span className="text-[11px] mt-0.5 opacity-80 hidden md:block truncate max-w-full">
                      {step.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </nav>

          <div className={`bg-surface-container-lowest border rounded-xl p-6 shadow-sm ${isReadOnly ? 'border-rose-200' : 'border-outline-variant'}`}>
            {activeStep === 1 && (
              <StepKunjunganK1K8 values={formData} onChange={handleInputChange} targetBumil={targetBumil} disabled={isReadOnly || !periodDocExists} />
            )}
            {activeStep === 2 && (
              <Step12T values={formData} onChange={handleInputChange} disabled={isReadOnly || !periodDocExists} />
            )}
            {activeStep === 3 && (
              <StepTesLab values={formData} onChange={handleInputChange} targetBumil={targetBumil} disabled={isReadOnly || !periodDocExists} />
            )}
            {activeStep === 4 && (
              <StepStatusGiziAnemia values={formData} onChange={handleInputChange} targetBumil={targetBumil} disabled={isReadOnly || !periodDocExists} />
            )}
            {activeStep === 5 && (
              <StepPreeklamsiaKomplikasi values={formData} onChange={handleInputChange} disabled={isReadOnly || !periodDocExists} />
            )}
            {activeStep === 6 && (
              <StepDeteksiRestiRujukan values={formData} onChange={handleInputChange} targetBumil={targetBumil} disabled={isReadOnly || !periodDocExists} />
            )}

            <footer className="mt-8 pt-6 border-t border-outline-variant flex justify-between items-center gap-4">
              <button
                type="button"
                onClick={() => goToStep(activeStep - 1)}
                disabled={activeStep === 1}
                className="px-5 py-2.5 rounded-lg border border-outline-variant text-on-surface font-label-md text-label-md hover:bg-surface-container-low transition-colors flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">arrow_back</span>Kembali
              </button>

              <div className="flex items-center gap-3">
                {activeStep < 6 ? (
                  <button
                    type="button"
                    onClick={() => goToStep(activeStep + 1)}
                    className="px-6 py-2.5 rounded-lg bg-primary text-on-primary font-label-md text-label-md hover:opacity-90 transition-opacity flex items-center gap-2 shadow-sm cursor-pointer"
                  >
                    Lanjut<span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                  </button>
                ) : isEditable && periodDocExists ? (
                  <button
                    type="button"
                    onClick={handleFinalSubmit}
                    disabled={saving}
                    className="px-6 py-2.5 rounded-lg bg-primary-container text-white font-label-md text-label-md hover:bg-primary transition-colors flex items-center gap-2 shadow-sm disabled:opacity-50 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[18px]">save</span>
                    {saving ? 'Menyiapkan Final...' : 'Simpan Laporan ANC'}
                  </button>
                ) : (
                  <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-sm font-medium">
                    <span className="material-symbols-outlined text-[16px]">lock</span>Periode Read-Only (Riwayat)
                  </div>
                )}
              </div>
            </footer>
          </div>
        </>
      )}
    </main>
  );
}