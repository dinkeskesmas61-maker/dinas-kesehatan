"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function Sidebar({ activeTab }) {
  const router = useRouter();
  const pathname = usePathname();

  const currentTab =
    activeTab || (pathname === "/dashboard/anc" ? "anc" : "dashboard");

  return (
    <nav className="bg-surface-container-low dark:bg-surface-container-lowest border-r border-outline-variant dark:border-outline shadow-none flex flex-col h-screen fixed left-0 top-0 py-stack-gap z-50 w-64">
      {/* Header Brand */}
      <div className="px-gutter mb-8 flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary-container rounded-lg flex items-center justify-center text-on-primary-container">
            <span className="material-symbols-outlined">local_hospital</span>
          </div>
          <div>
            <h1 className="text-headline-sm font-headline-sm font-bold text-primary dark:text-primary-fixed-dim">
              Dinkes Baubau
            </h1>
          </div>
        </div>
        <p className="font-label-md text-label-md text-on-surface-variant">
          Health Data Management
        </p>
      </div>

      {/* Navigation Links */}
      <div className="flex flex-col px-4 gap-unit">
        {/* Dashboard */}
        <Link
          className={`flex items-center gap-3 px-4 py-3 rounded-lg font-label-md text-label-md transition-all ${
            currentTab === "dashboard"
              ? "bg-primary-container text-on-primary-container font-bold scale-95"
              : "text-on-surface-variant dark:text-surface-variant hover:bg-surface-container-high"
          }`}
          href="/dashboard"
        >
          <span className="material-symbols-outlined">dashboard</span>
          <span>Dashboard</span>
        </Link>

        {/* Data Ibu (ANC) */}
        <Link
          className={`flex items-center gap-3 px-4 py-3 rounded-lg font-label-md text-label-md transition-all ${
            currentTab === "anc"
              ? "bg-primary-container text-on-primary-container font-bold scale-95"
              : "text-on-surface-variant dark:text-surface-variant hover:bg-surface-container-high"
          }`}
          href="/dashboard/anc"
        >
          <span className="material-symbols-outlined">pregnant_woman</span>
          <span>Data Ibu</span>
        </Link>

        {/* Inactive Items */}
        <a
          className="flex items-center gap-3 px-4 py-3 text-on-surface-variant dark:text-surface-variant hover:bg-surface-container-high rounded-lg transition-all font-label-md text-label-md"
          href="#"
        >
          <span className="material-symbols-outlined">child_care</span>
          <span>Data Anak</span>
        </a>
        <a
          className="flex items-center gap-3 px-4 py-3 text-on-surface-variant dark:text-surface-variant hover:bg-surface-container-high rounded-lg transition-all font-label-md text-label-md"
          href="#"
        >
          <span className="material-symbols-outlined">local_hospital</span>
          <span>Health Facilities</span>
        </a>
        <a
          className="flex items-center gap-3 px-4 py-3 text-on-surface-variant dark:text-surface-variant hover:bg-surface-container-high rounded-lg transition-all font-label-md text-label-md"
          href="#"
        >
          <span className="material-symbols-outlined">location_city</span>
          <span>Districts</span>
        </a>
        <a
          className="flex items-center gap-3 px-4 py-3 text-on-surface-variant dark:text-surface-variant hover:bg-surface-container-high rounded-lg transition-all font-label-md text-label-md"
          href="#"
        >
          <span className="material-symbols-outlined">settings</span>
          <span>Settings</span>
        </a>
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