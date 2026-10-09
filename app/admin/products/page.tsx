"use client";

import ProductTable, {
  type AdminProductRow,
} from "@/components/admin/ProductTable";
import api from "@/lib/axios";
import { queryKeys } from "@/lib/queryKeys";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Search } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { toast } from "sonner";

type Category = { CategoryID: number; Name: string };

export default function ProductsPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("");
  const [status, setStatus] = useState<"all" | "featured" | "inactive">("all");
  const [confirmId, setConfirmId] = useState<number | null>(null);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: queryKeys.products,
    queryFn: async () => {
      const res = await api.get("/api/admin/products");
      return res.data as AdminProductRow[];
    },
  });

  const { data: categories } = useQuery({
    queryKey: queryKeys.categories,
    queryFn: async () => {
      const res = await api.get("/api/admin/category");
      return res.data as Category[];
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await api.delete(`/api/admin/products/?id=${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products });
      queryClient.invalidateQueries({
        queryKey: queryKeys.featuredProducts,
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.productCategories,
      });
      toast.success("Produk dihapus.");
    },
    onError: () => toast.error("Gagal menghapus produk."),
  });

  const rows = useMemo(() => {
    const list = Array.isArray(data) ? data : [];
    const keyword = q.trim().toLowerCase();
    return list.filter((p) => {
      if (keyword && !p.Name.toLowerCase().includes(keyword)) return false;
      if (cat !== "" && String(p.CategoryID ?? "") !== cat) return false;
      if (status === "featured" && !p.IsFeatured) return false;
      if (status === "inactive" && p.IsActive) return false;
      return true;
    });
  }, [data, q, cat, status]);

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Produk</h1>
          <p className="mt-1 text-sm text-gray-500">
            {isLoading
              ? "Memuat…"
              : `${rows.length} dari ${(data ?? []).length} produk`}
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-1.5 rounded-lg bg-amber-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-amber-600"
        >
          <Plus className="h-4 w-4" /> Tambah Produk
        </Link>
      </div>

      <div className="mb-4 grid gap-2 rounded-xl border border-gray-200 bg-white p-3 shadow-sm sm:grid-cols-[1fr_200px_180px]">
        <label className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 focus-within:border-amber-500">
          <Search className="h-4 w-4 shrink-0 text-gray-400" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Cari nama produk…"
            className="w-full bg-transparent text-sm outline-none placeholder:text-gray-400"
          />
        </label>
        <select
          value={cat}
          onChange={(e) => setCat(e.target.value)}
          className="rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 outline-none focus:border-amber-500"
        >
          <option value="">Semua kategori</option>
          {(categories ?? []).map((c) => (
            <option key={c.CategoryID} value={String(c.CategoryID)}>
              {c.Name}
            </option>
          ))}
        </select>
        <select
          value={status}
          onChange={(e) =>
            setStatus(e.target.value as "all" | "featured" | "inactive")
          }
          className="rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 outline-none focus:border-amber-500"
        >
          <option value="all">Semua status</option>
          <option value="featured">Unggulan saja</option>
          <option value="inactive">Nonaktif saja</option>
        </select>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center gap-3 rounded-xl border border-gray-200 bg-white p-12">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-amber-500 border-t-transparent" />
          <p className="text-sm text-gray-600">Memuat produk…</p>
        </div>
      ) : isError ? (
        <div className="rounded-xl border border-gray-200 bg-white p-8 text-center">
          <p className="text-sm text-gray-600">Gagal memuat produk.</p>
          <button
            onClick={() => refetch()}
            className="mt-3 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-50"
          >
            Coba lagi
          </button>
        </div>
      ) : (
        <ProductTable
          data={rows}
          onEdit={(id) => router.push(`products/edit/${id}`)}
          onDetail={(id) => router.push(`products/detail/${id}`)}
          onClick={(id) => router.push(`products/detail/${id}`)}
          onDelete={(id) => setConfirmId(id)}
        />
      )}

      {confirmId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-sm rounded-xl bg-white p-5 shadow-xl">
            <h2 className="text-base font-semibold text-gray-900">
              Hapus produk?
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Produk akan dinonaktifkan (tidak tampil di depan) dan bisa
              dikembalikan dari database bila perlu.
            </p>
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => setConfirmId(null)}
                className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Batal
              </button>
              <button
                disabled={deleteMutation.isPending}
                onClick={() => {
                  if (confirmId !== null)
                    deleteMutation.mutate(confirmId, {
                      onSettled: () => setConfirmId(null),
                    });
                }}
                className="flex-1 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"
              >
                {deleteMutation.isPending ? "Menghapus…" : "Ya, hapus"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
