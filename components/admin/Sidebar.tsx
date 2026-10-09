"use client";

import api from "@/lib/axios";
import { cn } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";
import {
  Home,
  LayoutList,
  Lightbulb,
  LogOut,
  Package,
  Plus,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";

const groups = [
  {
    label: "Utama",
    items: [{ title: "Dashboard", href: "/admin", icon: Home }],
  },
  {
    label: "Produk",
    items: [
      { title: "Daftar Produk", href: "/admin/products", icon: Package },
      { title: "Tambah Produk", href: "/admin/products/new", icon: Plus },
    ],
  },
  {
    label: "Kategori",
    items: [
      { title: "Daftar Kategori", href: "/admin/categories", icon: LayoutList },
      { title: "Tambah Kategori", href: "/admin/categories/new", icon: Plus },
    ],
  },
];

export default function Sidebar({
  mobileOpen,
  onClose,
}: {
  mobileOpen: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const queryClient = useQueryClient();

  const handleLogout = async () => {
    if (!window.confirm("Yakin logout?")) return;
    try {
      await api.post("/api/admin/logout");
      queryClient.clear();
      router.push("/admin/login");
      router.refresh();
    } catch {
      toast.error("Gagal logout.");
    }
  };

  const nav = (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-gray-800 p-5">
        <div className="flex items-center gap-2">
          <Lightbulb className="h-8 w-8 text-amber-400" />
          <div>
            <h1 className="text-lg font-bold leading-tight">SANJAYA</h1>
            <p className="text-xs text-gray-400">Admin Panel</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="rounded-md p-1 text-gray-400 hover:bg-gray-800 lg:hidden"
          aria-label="Tutup menu"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <nav className="flex-1 space-y-5 overflow-y-auto p-4">
        {groups.map((g) => (
          <div key={g.label}>
            <p className="mb-1.5 px-2 text-[11px] font-semibold uppercase tracking-wider text-gray-500">
              {g.label}
            </p>
            <div className="space-y-1">
              {g.items.map((item) => {
                const Icon = item.icon;
                const isActive =
                  item.href === "/admin"
                    ? pathname === "/admin"
                    : pathname === item.href ||
                      pathname.startsWith(item.href + "/");
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all",
                      isActive
                        ? "bg-amber-600 font-medium text-white"
                        : "text-gray-400 hover:bg-gray-800 hover:text-white",
                    )}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    {item.title}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="border-t border-gray-800 p-4">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-gray-400 transition-all hover:bg-gray-800 hover:text-white"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop */}
      <aside className="fixed left-0 top-0 hidden min-h-screen w-64 bg-gray-900 text-white lg:block">
        {nav}
      </aside>
      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={onClose}
            aria-hidden
          />
          <aside className="absolute left-0 top-0 h-full w-72 bg-gray-900 text-white shadow-xl">
            {nav}
          </aside>
        </div>
      )}
    </>
  );
}
