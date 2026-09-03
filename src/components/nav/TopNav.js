'use client';

export default function TopNav() {
  return (
    <header className="bg-surface-container-low dark:bg-surface-container-lowest border-b border-outline-variant dark:border-outline shadow-none flex justify-between items-center w-full px-margin-desktop h-16 sticky top-0 z-40">
      {/* Left Side: Product Name */}
      <div className="flex items-center gap-4">
        <h2 className="text-headline-sm font-headline-sm font-bold text-primary dark:text-primary-fixed-dim">
          Data Ibu Baubau
        </h2>
      </div>
      {/* Right Side: Search, Actions, Profile */}
      <div className="flex items-center gap-6">
        {/* Search */}
        <div className="relative hidden lg:block">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">
            search
          </span>
          <input
            className="pl-10 pr-4 py-1.5 bg-surface-container-highest border-none rounded-full text-on-surface focus:ring-2 focus:ring-primary-container text-body-md font-body-md w-64"
            placeholder="Search data..."
            type="text"
          />
        </div>
        {/* Trailing Icons */}
        <div className="flex items-center gap-2">
          <button
            aria-label="notifications"
            className="p-2 text-on-surface-variant dark:text-surface-variant hover:bg-surface-container-high dark:hover:bg-surface-container-highest transition-colors rounded-full"
          >
            <span className="material-symbols-outlined">notifications</span>
          </button>
          <button
            aria-label="settings"
            className="p-2 text-on-surface-variant dark:text-surface-variant hover:bg-surface-container-high dark:hover:bg-surface-container-highest transition-colors rounded-full"
          >
            <span className="material-symbols-outlined">settings</span>
          </button>
        </div>
        {/* Profile */}
        <div className="w-8 h-8 rounded-full bg-secondary-container flex items-center justify-center overflow-hidden border border-outline-variant">
          <img
            alt="User Profile Avatar"
            className="w-full h-full object-cover"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuA7a_Fwn5sFjMuzpPP08B0IUK9-CkvUbhlvuJmYtKWMa1OYQ8uL1WQ5dt_4TiiCp1T2Ui6W18ymOwWK-ufGtPrvdFdhtfgmso8_F2-YBZurlLCQ6A_uI9Ut4LDHqjnzbabAFNbJphM9PvUUgigXwxgpuu4wValiU2PHurdg_XQNfSvsdC_EeyTiX97wjQUUeS7CGTEbb1ZkLnwbEHXHrfKAICIdmNqCk4Rp1VcHcC_i8Sa0JDohiaYtxw"
          />
        </div>
      </div>
    </header>
  );
}
