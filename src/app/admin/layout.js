"use client";

import SidebarAdmin from "@/components/SidebarAdmin";
import TopNavAdmin from "@/components/TopNavAdmin";

export default function DashboardLayout({ children }) {
  return (
    <div className="bg-surface text-on-surface font-body-md text-body-md antialiased overflow-x-hidden min-h-screen">
      {/* Persistent SideNavBar */}
      <SidebarAdmin />

      {/* Main Content Wrapper (Offset for SideNav) */}
      <div className="ml-64 flex flex-col min-h-screen">
        {/* Persistent TopNavBar */}
        <div className="fixed left-0 top-0 right-0 bg-surface-container-low z- ">
          <TopNavAdmin />
        </div>

        {/* Dynamic Page Content */}

        <div className="mt-16 px-2 py-4">{children}</div>
      </div>
    </div>
  );
}
