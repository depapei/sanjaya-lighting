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
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const menuItems = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: Home,
  },
  {
    title: "Products",
    href: "/admin/products",
    icon: Package,
  },
  {
    title: "Add Product",
    href: "/admin/products/new",
    icon: Plus,
  },
  {
    title: "Categories",
    href: "/admin/categories",
    icon: LayoutList,
  },
  {
    title: "Add Category",
    href: "/admin/categories/new",
    icon: Plus,
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  const router = useRouter(); // ✅ OK: di body komponen
  const queryClient = useQueryClient();

  const handleLogout = async () => {
    if (!confirm("Yakin logout?")) return;
    try {
      await api.post("/api/admin/logout");
      queryClient.clear(); // ✅ OK: pakai instance yang sudah diambil
      router.refresh();
      router.push("/admin/login");
    } catch (error) {
      console.error("Logout failed:", error);
      alert("Gagal logout");
    }
  };

  return (
    <aside className="w-64 bg-gray-900 text-white min-h-screen fixed left-0 top-0 overflow-y-auto">
      {/* Logo */}
      <div className="p-6 border-b border-gray-800">
        <div className="flex items-center gap-2">
          <Lightbulb className="w-8 h-8 text-amber-400" />
          <div>
            <h1 className="text-xl font-bold">SANJAYA</h1>
            <p className="text-xs text-gray-400">Admin Panel</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg transition-all",
                isActive
                  ? "bg-amber-600 text-white"
                  : "text-gray-400 hover:bg-gray-800 hover:text-white",
              )}
            >
              <Icon className="w-5 h-5" />
              {item.title}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-800">
        <button
          onClick={() => handleLogout()}
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white transition-all w-full"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </aside>
  );
}
