"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";

// ---- Struktur menu Petugas Puskesmas / Kepala Puskesmas ----
// Dikelompokkan per AREA PROGRAM (Data Ibu, Data Anak, dst), bukan per jenis
// laporan — supaya gampang nambah area baru (mis. Data Anak) tanpa bongkar
// struktur yang sudah ada.
const MENU_PETUGAS = [
  {
    type: "link",
    key: "dashboard",
    label: "Dashboard",
    href: "/dashboard",
    icon: "dashboard",
  },
  {
    type: "group",
    key: "data-ibu",
    label: "Data Ibu",
    icon: "pregnant_woman",
    children: [
      {
        key: "anc",
        label: "ANC",
        href: "/dashboard/anc",
        icon: "monitor_heart",
      },
      { key: "pnc", label: "PNC", href: "/dashboard/pnc", icon: "healing" },
      {
        key: "kematian",
        label: "Kematian Ibu",
        href: "/dashboard/kematian",
        icon: "heart_broken",
      },
      {
        key: "anc-terpadu",
        label: "ANC Terpadu",
        href: "/dashboard/anct",
        icon: "biotech",
      },
      { key: "sdm", label: "SDM", href: "/dashboard/sdm", icon: "groups" },
    ],
  },
  {
    type: "group",
    key: "data-anak",
    label: "Data Anak",
    icon: "child_care",
    children: [
      // Akan diisi menyusul saat modul Data Anak dibangun.
      {
        key: "anak-segera",
        label: "Segera Hadir",
        href: "#",
        icon: "hourglass_empty",
        disabled: true,
      },
    ],
  },
  {
    type: "link",
    key: "profil",
    label: "Profil & Pengaturan",
    href: "/dashboard/profil",
    icon: "person",
  },
];

// ---- Struktur menu Admin Dinas Kesehatan ----
const MENU_ADMIN = [
  {
    type: "link",
    key: "dashboard",
    label: "Dashboard",
    href: "/admin/dashboard",
    icon: "dashboard",
  },
  {
    type: "group",
    key: "manajemen",
    label: "Manajemen",
    icon: "admin_panel_settings",
    children: [
      {
        key: "periode",
        label: "Pengaturan Periode",
        href: "/admin/periode",
        icon: "event_available",
      },
      {
        key: "petugas",
        label: "Manajemen User",
        href: "/admin/petugas",
        icon: "manage_accounts",
      },
    ],
  },
  {
    type: "group",
    key: "data-ibu",
    label: "Data Ibu",
    icon: "pregnant_woman",
    children: [
      {
        key: "rekap-anc",
        label: "Rekap ANC",
        href: "/admin/rekap/anc",
        icon: "monitor_heart",
      },
      {
        key: "rekap-pnc",
        label: "Rekap PNC",
        href: "/admin/rekap/pnc",
        icon: "healing",
      },
      {
        key: "rekap-kematian",
        label: "Rekap Kematian Ibu",
        href: "/admin/rekap/kematian",
        icon: "heart_broken",
      },
      {
        key: "rekap-anc-terpadu",
        label: "Rekap ANC Terpadu",
        href: "/admin/rekap/anc-terpadu",
        icon: "biotech",
      },
      { key: "sdm", label: "Kelola SDM", href: "/admin/sdm", icon: "groups" },
      {
        key: "sasaran",
        label: "Kelola Sasaran",
        href: "/admin/sasaran",
        icon: "target",
      },
    ],
  },
  {
    type: "group",
    key: "data-anak",
    label: "Data Anak",
    icon: "child_care",
    children: [
      {
        key: "anak-segera",
        label: "Segera Hadir",
        href: "#",
        icon: "hourglass_empty",
        disabled: true,
      },
    ],
  },
  {
    type: "link",
    key: "profil",
    label: "Profil & Pengaturan",
    href: "/admin/profil",
    icon: "person",
  },
];

export default function Sidebar({ role = "petugas" }) {
  const router = useRouter();
  const pathname = usePathname();

  const menuItems = role === "admin" ? MENU_ADMIN : MENU_PETUGAS;
  const brandLabel = role === "admin" ? "Admin Dinkes Baubau" : "Dinkes Baubau";

  const [openGroups, setOpenGroups] = useState({});

  // Otomatis buka group yang mengandung halaman aktif saat pertama kali render
  useEffect(() => {
    const initialOpen = {};
    menuItems.forEach((item) => {
      if (
        item.type === "group" &&
        item.children.some((c) => c.href === pathname)
      ) {
        initialOpen[item.key] = true;
      }
    });
    setOpenGroups((prev) => ({ ...initialOpen, ...prev }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const toggleGroup = (key) => {
    setOpenGroups((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const linkClass = (active, disabled) =>
    `flex items-center gap-3 px-4 py-3 rounded-lg font-label-md text-label-md transition-all ${
      disabled
        ? "text-on-surface-variant/40 cursor-not-allowed"
        : active
          ? "bg-primary-container text-on-primary-container font-bold scale-95"
          : "text-on-surface-variant dark:text-surface-variant hover:bg-surface-container-high"
    }`;

  return (
    <nav className="bg-surface-container-low dark:bg-surface-container-lowest border-r border-outline-variant dark:border-outline shadow-none flex flex-col h-screen fixed left-0 top-0 py-stack-gap z-50 w-64 overflow-y-auto">
      {/* Header Brand */}
      <div className="px-gutter mb-8 flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary-container rounded-lg flex items-center justify-center text-on-primary-container">
            <span className="material-symbols-outlined">local_hospital</span>
          </div>
          <div>
            <h1 className="text-headline-sm font-headline-sm font-bold text-primary dark:text-primary-fixed-dim">
              {brandLabel}
            </h1>
          </div>
        </div>
        <p className="font-label-md text-label-md text-on-surface-variant">
          Health Data Management
        </p>
      </div>

      {/* Navigation */}
      <div className="flex flex-col px-4 gap-1 flex-1">
        {menuItems.map((item) => {
          if (item.type === "link") {
            const active = pathname === item.href;
            return (
              <Link
                key={item.key}
                href={item.href}
                className={linkClass(active)}
              >
                <span className="material-symbols-outlined">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          }

          // type === "group"
          const isOpen = !!openGroups[item.key];
          const hasActiveChild = item.children.some((c) => c.href === pathname);

          return (
            <div key={item.key} className="flex flex-col">
              <button
                type="button"
                onClick={() => toggleGroup(item.key)}
                className={`flex items-center justify-between gap-3 px-4 py-3 rounded-lg font-label-md text-label-md transition-all ${
                  hasActiveChild && !isOpen
                    ? "bg-primary-container/40 text-on-surface font-bold"
                    : "text-on-surface-variant dark:text-surface-variant hover:bg-surface-container-high"
                }`}
              >
                <span className="flex items-center gap-3">
                  <span className="material-symbols-outlined">{item.icon}</span>
                  <span>{item.label}</span>
                </span>
                <span
                  className={`material-symbols-outlined text-[18px] transition-transform ${isOpen ? "rotate-180" : ""}`}
                >
                  expand_more
                </span>
              </button>

              {isOpen && (
                <div className="flex flex-col gap-0.5 mt-1 ml-3 pl-3 border-l border-outline-variant">
                  {item.children.map((child) => {
                    const active = pathname === child.href;
                    return (
                      <Link
                        key={child.key}
                        href={child.disabled ? "#" : child.href}
                        onClick={(e) => child.disabled && e.preventDefault()}
                        className={linkClass(active, child.disabled)}
                      >
                        <span className="material-symbols-outlined text-[20px]">
                          {child.icon}
                        </span>
                        <span className="text-sm">{child.label}</span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* CTA Bottom - Logout Button */}
      <div className="mt-auto px-4 pb-6 pt-4 w-full">
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
