"use client";

import api from "@/lib/axios";
import { queryKeys } from "@/lib/queryKeys";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Pencil } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

type Detail = {
  ProductID: number;
  Name: string;
  Description?: string | null;
  Price?: number | string | null;
  DiscountPrice?: number | string | null;
  Stock?: number;
  IsFeatured?: boolean;
  IsActive?: boolean;
  ImageBase64?: string | null;
  ImageMimeType?: string | null;
  CategoryID?: number | null;
  Category?: { Name: string } | null;
  tags?: string | null;
  CreatedAt?: string;
  UpdatedAt?: string | null;
  CreatedBy?: string | null;
};

function formatPrice(v: Detail["Price"]): string {
  if (v === null || v === undefined || v === "") return "Belum diisi";
  const n = typeof v === "number" ? v : parseFloat(String(v));
  if (!Number.isFinite(n)) return "Belum diisi";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(n);
}

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.slug as string;

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: queryKeys.productDetail(String(id)),
    queryFn: async () => {
      const res = await api.get(`/api/admin/product/${id}`);
      return res.data as Detail;
    },
  });

  if (isLoading) {
    return (
      <div className="mx-auto max-w-4xl">
        <div className="animate-pulse space-y-4">
          <div className="h-6 w-40 rounded bg-gray-200" />
          <div className="h-64 rounded-xl bg-gray-100" />
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="mx-auto max-w-4xl rounded-xl border border-gray-200 bg-white p-8 text-center">
        <p className="text-sm text-gray-600">Produk tidak ditemukan.</p>
        <div className="mt-3 flex justify-center gap-2">
          <button
            onClick={() => router.back()}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50"
          >
            Kembali
          </button>
          <button
            onClick={() => refetch()}
            className="rounded-lg bg-gray-900 px-4 py-2 text-sm text-white"
          >
            Coba lagi
          </button>
        </div>
      </div>
    );
  }

  const imageUrl =
    data.ImageBase64 != null && data.ImageBase64 !== ""
      ? `data:${data.ImageMimeType || "image/jpeg"};base64,${data.ImageBase64}`
      : null;

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4" /> Kembali
        </button>
        <Link
          href={`/admin/products/edit/${data.ProductID}`}
          className="inline-flex items-center gap-1.5 rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-600"
        >
          <Pencil className="h-4 w-4" /> Edit produk
        </Link>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-3 border-b border-gray-100 p-6">
          <div>
            <div className="mb-2 flex flex-wrap gap-1.5">
              <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs text-gray-600">
                {data.Category?.Name ?? "Tanpa kategori"}
              </span>
              {data.IsFeatured && (
                <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-800">
                  Unggulan
                </span>
              )}
              {data.IsActive ? (
                <span className="rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-700">
                  Aktif
                </span>
              ) : (
                <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-500">
                  Nonaktif
                </span>
              )}
            </div>
            <h1 className="text-2xl font-bold text-gray-900">{data.Name}</h1>
            <p className="mt-1 text-xs text-gray-500">
              ID #{data.ProductID}
              {data.CreatedBy ? ` · dibuat oleh ${data.CreatedBy}` : ""}
            </p>
          </div>
        </div>

        <div className="grid gap-6 p-6 md:grid-cols-[280px_1fr]">
          <div>
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={data.Name}
                className="aspect-square w-full rounded-lg border border-gray-200 object-cover"
              />
            ) : (
              <div className="flex aspect-square w-full items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 text-sm text-gray-400">
                Tanpa foto
              </div>
            )}
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg bg-amber-50 p-4">
                <p className="text-xs font-medium text-amber-800">
                  Harga internal
                </p>
                <p className="mt-1 text-lg font-bold text-gray-900">
                  {formatPrice(data.Price)}
                </p>
                {data.DiscountPrice != null && data.DiscountPrice !== "" && (
                  <p className="mt-1 text-xs text-gray-500">
                    Diskon: {formatPrice(data.DiscountPrice)}
                  </p>
                )}
              </div>
              <div className="rounded-lg bg-green-50 p-4">
                <p className="text-xs font-medium text-green-800">Stok</p>
                <p className="mt-1 text-lg font-bold text-gray-900">
                  {data.Stock ?? 0} pcs
                </p>
              </div>
            </div>
            <div>
              <h2 className="mb-1 text-sm font-semibold text-gray-900">
                Deskripsi
              </h2>
              <p className="whitespace-pre-line text-sm leading-relaxed text-gray-600">
                {data.Description || (
                  <span className="italic text-gray-400">
                    Belum ada deskripsi.
                  </span>
                )}
              </p>
            </div>
            {data.tags && (
              <div>
                <h2 className="mb-1 text-sm font-semibold text-gray-900">
                  Tags
                </h2>
                <p className="text-sm text-gray-600">{data.tags}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
