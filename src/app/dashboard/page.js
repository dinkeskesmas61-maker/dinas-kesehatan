'use client';

import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const router = useRouter();

  return (
    <main className="flex-1 p-margin-desktop bg-surface max-w-container-max mx-auto w-full flex flex-col gap-gutter">
          <div className="mb-4">
            <h1 className="text-headline-lg font-headline-lg text-on-surface mb-2 tracking-tight">
              Selamat Datang, Puskesmas Wajo
            </h1>
            <p className="text-body-lg font-body-lg text-on-surface-variant">
              Kelola dan pantau data kesehatan ibu dan anak di wilayah Anda bulan ini.
            </p>
          </div>

          {/* Bento Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter">
            {/* Section 1: Status Pelaporan (Spans 2 columns) */}
            <div className="lg:col-span-2 bg-surface-container-lowest border border-outline-variant rounded-xl p-stack-gap flex flex-col">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-headline-sm font-headline-sm text-primary flex items-center gap-2">
                  <span className="material-symbols-outlined">fact_check</span>
                  Status Pelaporan Bulan Ini
                </h2>
                <span className="font-label-md text-label-md text-outline">
                  September 2023
                </span>
              </div>
              <div className="flex flex-col gap-0 divide-y divide-outline-variant">
                {/* Item 1: ANC */}
                <div className="flex justify-between items-center py-3">
                  <div className="flex items-center gap-4">
                    <span className="w-2 h-2 rounded-full bg-primary-fixed block" />
                    <span className="font-body-md text-body-md font-medium text-on-surface">
                      Data ANC (Antenatal Care)
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="bg-primary-fixed text-on-primary-fixed border border-primary-fixed-dim rounded-full px-3 py-1 font-label-md text-label-md flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px]">
                        check_circle
                      </span>
                      Sudah Diisi
                    </div>
                    <button
                      onClick={() => router.push('/dashboard/anc')}
                      className="bg-secondary text-on-secondary px-4 py-1.5 rounded-lg font-label-md text-label-md hover:bg-secondary/90 transition-colors"
                    >
                      Input / Edit
                    </button>
                  </div>
                </div>
                {/* Item 2: PNC */}
                <div className="flex justify-between items-center py-3">
                  <div className="flex items-center gap-4">
                    <span className="w-2 h-2 rounded-full bg-error block" />
                    <span className="font-body-md text-body-md font-medium text-on-surface">
                      Data PNC (Postnatal Care)
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="bg-error-container text-on-error-container border border-error/20 rounded-full px-3 py-1 font-label-md text-label-md flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px]">
                        warning
                      </span>
                      Belum Diisi
                    </div>
                    <button className="bg-secondary text-on-secondary px-4 py-1.5 rounded-lg font-label-md text-label-md hover:bg-secondary/90 transition-colors">
                      Input Sekarang
                    </button>
                  </div>
                </div>
                {/* Item 3: KM */}
                <div className="flex justify-between items-center py-3">
                  <div className="flex items-center gap-4">
                    <span className="w-2 h-2 rounded-full bg-primary-fixed block" />
                    <span className="font-body-md text-body-md font-medium text-on-surface">
                      Kematian Maternal (KM)
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="bg-primary-fixed text-on-primary-fixed border border-primary-fixed-dim rounded-full px-3 py-1 font-label-md text-label-md flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px]">
                        check_circle
                      </span>
                      Sudah Diisi
                    </div>
                  </div>
                </div>
                {/* Item 4: ANC Terpadu */}
                <div className="flex justify-between items-center py-3">
                  <div className="flex items-center gap-4">
                    <span className="w-2 h-2 rounded-full bg-error block" />
                    <span className="font-body-md text-body-md font-medium text-on-surface">
                      Pelayanan ANC Terpadu
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="bg-error-container text-on-error-container border border-error/20 rounded-full px-3 py-1 font-label-md text-label-md flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px]">
                        warning
                      </span>
                      Belum Diisi
                    </div>
                    <button className="bg-secondary text-on-secondary px-4 py-1.5 rounded-lg font-label-md text-label-md hover:bg-secondary/90 transition-colors">
                      Input Sekarang
                    </button>
                  </div>
                </div>
                {/* Item 5: KB */}
                <div className="flex justify-between items-center py-3">
                  <div className="flex items-center gap-4">
                    <span className="w-2 h-2 rounded-full bg-primary-fixed block" />
                    <span className="font-body-md text-body-md font-medium text-on-surface">
                      Pelayanan KB
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="bg-primary-fixed text-on-primary-fixed border border-primary-fixed-dim rounded-full px-3 py-1 font-label-md text-label-md flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px]">
                        check_circle
                      </span>
                      Sudah Diisi
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 3: Riwayat Laporan (Side Column) */}
            <div className="lg:col-span-1 bg-surface-container-low border border-outline-variant rounded-xl p-stack-gap flex flex-col">
              <h2 className="text-headline-sm font-headline-sm text-primary mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined">history</span>
                Riwayat Laporan
              </h2>
              <div className="flex flex-col gap-4">
                {/* History Item 1 */}
                <div className="bg-surface-container-lowest p-4 rounded-lg border border-outline-variant/50 flex justify-between items-center">
                  <div>
                    <p className="font-label-md text-label-md text-on-surface font-semibold">
                      Agustus 2023
                    </p>
                    <p className="font-body-md text-[12px] text-outline mt-1">
                      Disubmit: 5 Sep 2023
                    </p>
                  </div>
                  <div className="flex items-center gap-1 text-tertiary">
                    <span className="material-symbols-outlined text-[18px]">
                      lock
                    </span>
                    <span className="font-label-md text-[12px]">Terkunci</span>
                  </div>
                </div>
                {/* History Item 2 */}
                <div className="bg-surface-container-lowest p-4 rounded-lg border border-outline-variant/50 flex justify-between items-center">
                  <div>
                    <p className="font-label-md text-label-md text-on-surface font-semibold">
                      Juli 2023
                    </p>
                    <p className="font-body-md text-[12px] text-outline mt-1">
                      Disubmit: 4 Agu 2023
                    </p>
                  </div>
                  <div className="flex items-center gap-1 text-tertiary">
                    <span className="material-symbols-outlined text-[18px]">
                      lock
                    </span>
                    <span className="font-label-md text-[12px]">Terkunci</span>
                  </div>
                </div>
                {/* History Item 3 */}
                <div className="bg-surface-container-lowest p-4 rounded-lg border border-outline-variant/50 flex justify-between items-center">
                  <div>
                    <p className="font-label-md text-label-md text-on-surface font-semibold">
                      Juni 2023
                    </p>
                    <p className="font-body-md text-[12px] text-outline mt-1">
                      Disubmit: 3 Jul 2023
                    </p>
                  </div>
                  <div className="flex items-center gap-1 text-tertiary">
                    <span className="material-symbols-outlined text-[18px]">
                      lock
                    </span>
                    <span className="font-label-md text-[12px]">Terkunci</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2: Capaian Indikator Kunci (Full Width Row below) */}
            <div className="lg:col-span-3 bg-transparent">
              <h2 className="text-headline-sm font-headline-sm text-primary mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined">monitoring</span>
                Capaian Indikator Kunci
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Card 1: K1 */}
                <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-5 flex flex-col hover:shadow-[0_8px_16px_rgba(13,124,132,0.08)] transition-shadow">
                  <p className="font-label-md text-label-md text-on-surface-variant mb-2">
                    Cakupan K1
                  </p>
                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-headline-lg font-headline-lg text-primary">
                      85%
                    </span>
                    <span className="font-body-md text-[12px] text-outline">
                      Target: 100%
                    </span>
                  </div>
                  <div className="w-full bg-surface-variant rounded-full h-2">
                    <div
                      className="bg-primary-container h-2 rounded-full"
                      style={{ width: "85%" }}
                    />
                  </div>
                </div>
                {/* Card 2: K4 */}
                <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-5 flex flex-col hover:shadow-[0_8px_16px_rgba(13,124,132,0.08)] transition-shadow">
                  <p className="font-label-md text-label-md text-on-surface-variant mb-2">
                    Cakupan K4
                  </p>
                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-headline-lg font-headline-lg text-primary">
                      72%
                    </span>
                    <span className="font-body-md text-[12px] text-error">
                      Target: 90%
                    </span>
                  </div>
                  <div className="w-full bg-surface-variant rounded-full h-2">
                    <div
                      className="bg-secondary h-2 rounded-full"
                      style={{ width: "72%" }}
                    />
                  </div>
                </div>
                {/* Card 3: Persalinan Nakes */}
                <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-5 flex flex-col hover:shadow-[0_8px_16px_rgba(13,124,132,0.08)] transition-shadow">
                  <p className="font-label-md text-label-md text-on-surface-variant mb-2">
                    Persalinan Nakes
                  </p>
                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-headline-lg font-headline-lg text-primary">
                      96%
                    </span>
                    <span className="font-body-md text-[12px] text-surface-tint">
                      Target: 95%
                    </span>
                  </div>
                  <div className="w-full bg-surface-variant rounded-full h-2">
                    <div
                      className="bg-primary-fixed-dim h-2 rounded-full"
                      style={{ width: "96%" }}
                    />
                  </div>
                </div>
                {/* Card 4: KB Aktif */}
                <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-5 flex flex-col hover:shadow-[0_8px_16px_rgba(13,124,132,0.08)] transition-shadow">
                  <p className="font-label-md text-label-md text-on-surface-variant mb-2">
                    Peserta KB Aktif
                  </p>
                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-headline-lg font-headline-lg text-primary">
                      68%
                    </span>
                    <span className="font-body-md text-[12px] text-outline">
                      Target: 70%
                    </span>
                  </div>
                  <div className="w-full bg-surface-variant rounded-full h-2">
                    <div
                      className="bg-primary-container h-2 rounded-full"
                      style={{ width: "68%" }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
  );
}
