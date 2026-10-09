"use client";

import Sidebar from "@/components/admin/Sidebar";
import { Menu } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Toaster } from "sonner";
import "../globals.css";
import Providers from "../provider";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login";
  const [mobileOpen, setMobileOpen] = useState(false);

  if (isLoginPage) {
    return (
      <div>
        <Providers>
          {children}
          <Toaster position="top-center" richColors />
        </Providers>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Providers>
        <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
        <div className="lg:ml-64">
          <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-gray-200 bg-white/90 px-4 py-3 backdrop-blur lg:hidden">
            <button
              onClick={() => setMobileOpen(true)}
              className="rounded-md border border-gray-200 p-2 text-gray-700"
              aria-label="Buka menu"
            >
              <Menu className="h-5 w-5" />
            </button>
            <span className="text-sm font-bold text-gray-900">
              SANJAYA <span className="font-normal text-gray-500">Admin</span>
            </span>
          </header>
          <main className="p-4 sm:p-6">{children}</main>
        </div>
        <Toaster position="top-center" richColors />
      </Providers>
    </div>
  );
}
