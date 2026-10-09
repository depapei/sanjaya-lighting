"use client";

import api from "@/lib/axios";
import { queryKeys } from "@/lib/queryKeys";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, LayoutList, Package, Plus, Star } from "lucide-react";
import Link from "next/link";

type Row = {
  ProductID: number;
  Name: string;
  IsFeatured?: boolean;
  IsActive?: boolean;
  Stock?: number;
  Category?: { Name: string } | null;
};

export default function AdminDashboard() {
  const productsQ = useQuery({
    queryKey: queryKeys.products,
    queryFn: async () => (await api.get("/api/admin/products")).data as Row[],
  });
  const categoriesQ = useQuery({
    queryKey: queryKeys.categories,
    queryFn: async () =>
      (await api.get("/api/admin/category")).data as {
        CategoryID: number;
        Name: string;
      }[],
  });

  const products = Array.isArray(productsQ.data) ? productsQ.data : [];
  const categories = Array.isArray(categoriesQ.data) ? categoriesQ.data : [];
  const loading = productsQ.isLoading || categoriesQ.isLoading;

  const stats = [
    {
      label: "Produk aktif",
      value: products.length,
      icon: Package,
      href: "/admin/products",
    },
    {
      label: "Kategori",
      value: categories.length,
      icon: LayoutList,
      href: "/admin/categories",
    },
    {
      label: "Produk unggulan",
      value: products.filter((p) => p.IsFeatured).length,
      icon: Star,
      href: "/admin/products",
    },
  ];

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">
            Ringkasan toko & jalan pintas kerja harian.
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/admin/products/new"
            className="inline-flex items-center gap-1.5 rounded-lg bg-amber-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-amber-600"
          >
            <Plus className="h-4 w-4" /> Tambah Produk
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Lihat Toko <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="grid gap-3 sm:grid-cols-3">
          {[0, 1, 2].map((n) => (
            <div
              key={n}
              className="h-24 animate-pulse rounded-xl border border-gray-200 bg-white"
            />
          ))}
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-3">
          {stats.map((s) => {
            const Icon = s.icon;
            return (
              <Link
                key={s.label}
                href={s.href}
                className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow"
              >
                <span className="rounded-lg bg-amber-100 p-3 text-amber-700">
                  <Icon className="h-5 w-5" />
                </span>
                <span>
                  <span className="block text-2xl font-bold text-gray-900">
                    {s.value}
                  </span>
                  <span className="block text-sm text-gray-500">{s.label}</span>
                </span>
              </Link>
            );
          })}
        </div>
      )}

      <div className="mt-5 rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-gray-100 p-4">
          <h2 className="text-sm font-semibold text-gray-900">
            Produk terbaru
          </h2>
          <Link
            href="/admin/products"
            className="inline-flex items-center gap-1 text-sm font-medium text-amber-700 hover:underline"
          >
            Semua produk <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        {products.length === 0 && !loading ? (
          <p className="p-6 text-center text-sm text-gray-500">
            Belum ada produk.{" "}
            <Link
              href="/admin/products/new"
              className="font-medium text-amber-700 hover:underline"
            >
              Tambah yang pertama
            </Link>
            .
          </p>
        ) : (
          <ul className="divide-y divide-gray-100">
            {products.slice(0, 5).map((p) => (
              <li key={p.ProductID}>
                <Link
                  href={`/admin/products/detail/${p.ProductID}`}
                  className="flex items-center justify-between gap-3 px-4 py-3 hover:bg-amber-50/50"
                >
                  <span>
                    <span className="block text-sm font-medium text-gray-900">
                      {p.Name}
                    </span>
                    <span className="block text-xs text-gray-500">
                      {p.Category?.Name ?? "Tanpa kategori"} · Stok{" "}
                      {p.Stock ?? 0}
                    </span>
                  </span>
                  {p.IsFeatured && (
                    <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-800">
                      Unggulan
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
