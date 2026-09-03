'use client';

import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

export default function AdminTopNav() {
  const [adminProfile, setAdminProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userRef = doc(db, 'users', user.email);
          const userSnap = await getDoc(userRef);

          if (userSnap.exists()) {
            setAdminProfile({
              name: userSnap.data().name || user.displayName || 'Administrator',
              email: user.email,
              photoURL: user.photoURL,
              role: userSnap.data().role || 'dinkes',
            });
          } else {
            setAdminProfile({
              name: user.displayName || 'Administrator Dinkes',
              email: user.email,
              photoURL: user.photoURL,
              role: 'dinkes',
            });
          }
        } catch (err) {
          console.error('Error fetching admin topnav profile:', err);
        }
      } else {
        setAdminProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <header className="bg-surface-container-low dark:bg-surface-container-lowest border-b border-outline-variant dark:border-outline shadow-none flex justify-between items-center w-full px-6 h-16 sticky top-0 z-40">
      {/* Left Side: Product Name & Admin Badge */}
      <div className="flex items-center gap-3">
        <h2 className="text-headline-sm font-headline-sm font-bold text-primary dark:text-primary-fixed-dim">
          Data Ibu Baubau
        </h2>
        
        <span className="bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1 border border-blue-200 dark:border-blue-800">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse"></span>
        </span>
      </div>

      {/* Right Side: Search, Actions, Profile */}
      <div className="flex items-center gap-4 lg:gap-6">
        {/* Search Input for Admin */}
        <div className="relative hidden lg:block">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-lg">
            search
          </span>
          <input
            className="pl-10 pr-4 py-1.5 bg-surface-container-highest border-none rounded-full text-on-surface focus:ring-2 focus:ring-primary-container text-body-md font-body-md w-72 text-xs"
            placeholder="Cari puskesmas, petugas, atau data..."
            type="text"
          />
        </div>

        {/* Trailing Icons */}
        <div className="flex items-center gap-1">
          <button
            aria-label="notifications"
            className="p-2 text-on-surface-variant dark:text-surface-variant hover:bg-surface-container-high dark:hover:bg-surface-container-highest transition-colors rounded-full relative"
          >
            <span className="material-symbols-outlined text-xl">notifications</span>
            {/* Indikator Notifikasi Masuk */}
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          <button
            aria-label="settings"
            className="p-2 text-on-surface-variant dark:text-surface-variant hover:bg-surface-container-high dark:hover:bg-surface-container-highest transition-colors rounded-full"
          >
            <span className="material-symbols-outlined text-xl">settings</span>
          </button>
        </div>

        {/* Profile Details & Avatar */}
        <div className="flex items-center gap-3 pl-2 border-l border-outline-variant">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-bold text-on-surface leading-none">
              {loading ? 'Memuat...' : adminProfile?.name || 'Admin Dinkes'}
            </p>
            <p className="text-[10px] text-on-surface-variant mt-0.5">
              {loading ? '' : adminProfile?.email || 'admin@dinkes.baubaukota.go.id'}
            </p>
          </div>

          <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-900 dark:bg-blue-900 dark:text-blue-100 flex items-center justify-center overflow-hidden border border-blue-200 dark:border-blue-700 shrink-0">
            {adminProfile?.photoURL ? (
              <img
                alt={adminProfile?.name || 'Admin Profile'}
                className="w-full h-full object-cover"
                src={adminProfile.photoURL}
                referrerPolicy="no-referrer"
              />
            ) : (
              <span className="material-symbols-outlined text-xl">
                admin_panel_settings
              </span>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}