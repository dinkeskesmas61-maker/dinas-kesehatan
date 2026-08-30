"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function AdminSidebar({ activeTab }) {
  const router = useRouter();
  const pathname = usePathname();

  // Memeriksa URL secara dinamis menggunakan startsWith agar match 100%
  const getIsActive = (tabKey, targetPath) => {
    if (activeTab) return activeTab === tabKey;
    if (targetPath === "/admin/dashboard") {
      return pathname === "/admin/dashboard" || pathname === "/admin";
    }
    return pathname.startsWith(targetPath);
  };

  return (
    <nav className="bg-surface-container-low dark:bg-surface-container-lowest border-r border-outline-variant dark:border-outline shadow-none flex flex-col h-screen fixed left-0 top-0 py-stack-gap z-50 w-64">
      {/* Header Brand Admin */}
      <div className="px-gutter mb-8 flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary-container rounded-lg flex items-center justify-center text-on-primary-container">
            <span className="material-symbols-outlined">admin_panel_settings</span>
          </div>
          <div>
            <h1 className="text-headline-sm font-headline-sm font-bold text-primary dark:text-primary-fixed-dim">
              Dinkes Baubau
            </h1>
          </div>
        </div>
        <p className="font-label-md text-label-md text-on-surface-variant font-medium">
          Panel Administrator
        </p>
      </div>

      {/* Navigation Links untuk Admin */}
      <div className="flex flex-col px-4 gap-unit">

        {/* Pengaturan Periode Pelaporan */}
        <Link
          className={`flex items-center gap-3 px-4 py-3 rounded-lg font-label-md text-label-md transition-all ${
            getIsActive("settings", "/admin/periode")
              ? "bg-primary-container text-on-primary-container font-bold scale-95"
              : "text-on-surface-variant dark:text-surface-variant hover:bg-surface-container-high"
          }`}
          href="/admin/periode"
        >
          <span className="material-symbols-outlined">calendar_month</span>
          <span>Periode Pelaporan</span>
        </Link>

        {/* Menu Peninjau Data Ibu (ANC) */}
        <Link
          className={`flex items-center gap-3 px-4 py-3 rounded-lg font-label-md text-label-md transition-all ${
            getIsActive("anc", "/admin/dataAnc")
              ? "bg-primary-container text-on-primary-container font-bold scale-95"
              : "text-on-surface-variant dark:text-surface-variant hover:bg-surface-container-high"
          }`}
          href="/admin/dataAnc"
        >
          <span className="material-symbols-outlined">pregnant_woman</span>
          <span>Lihat Form ANC</span>
        </Link>

        {/* Kelola Pengguna / User */}
        <Link
          className={`flex items-center gap-3 px-4 py-3 rounded-lg font-label-md text-label-md transition-all ${
            getIsActive("users", "/admin/petugas")
              ? "bg-primary-container text-on-primary-container font-bold scale-95"
              : "text-on-surface-variant dark:text-surface-variant hover:bg-surface-container-high"
          }`}
          href="/admin/petugas"
        >
          <span className="material-symbols-outlined">group</span>
          <span>Manajemen User</span>
        </Link>

      </div>

      {/* CTA Bottom - Logout Button */}
      <div className="mt-auto px-4 pb-6 w-full">
        <button
          onClick={async () => {
            try {
              await signOut(auth);
              router.push("/");
            } catch (err) {
              console.error("Gagal keluar akun:", err);
            }
          }}
          className="w-full bg-red-50 text-red-600 hover:bg-red-100 font-label-md text-label-md py-3 rounded-xl transition-colors flex justify-center items-center gap-2 border border-red-100 shadow-sm"
        >
          <span className="material-symbols-outlined text-lg">logout</span>
          Keluar Akun
        </button>
      </div>
    </nav>
  );
}