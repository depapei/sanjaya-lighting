"use client";

import { Eye, Pencil, Trash2 } from "lucide-react";

export type AdminProductRow = {
  ProductID: number;
  Name: string;
  Description?: string | null;
  Price?: number | string | null;
  Stock?: number;
  IsFeatured?: boolean;
  IsActive?: boolean;
  Category?: { Name: string } | null;
  CategoryID?: number | null;
  ImageBase64?: string | null;
  ImageMimeType?: string | null;
};

type ProductTableProps = {
  data: AdminProductRow[];
  onEdit: (id: number) => void;
  onDetail: (id: number) => void;
  /** alias lama — tetap didukung */
  onClick?: (id: number) => void;
  onDelete: (id: number) => void;
};

function formatPrice(v: AdminProductRow["Price"]): string {
  if (v === null || v === undefined || v === "") return "—";
  const n = typeof v === "number" ? v : parseFloat(String(v));
  if (!Number.isFinite(n)) return "—";
  return `Rp ${n.toLocaleString("id-ID")}`;
}

export default function ProductTable({
  data,
  onEdit,
  onDetail,
  onClick,
  onDelete,
}: ProductTableProps) {
  const goDetail = (id: number) => (onClick ?? onDetail)(id);

  if (data.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-gray-300 bg-white px-4 py-12 text-center">
        <p className="font-medium text-gray-700">Belum ada produk</p>
        <p className="mt-1 text-sm text-gray-500">
          Coba ubah kata kunci / filter, atau tambah produk baru.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-900 text-white">
          <tr>
            <th className="px-4 py-3 text-left font-medium">#</th>
            <th className="px-4 py-3 text-left font-medium">Produk</th>
            <th className="px-4 py-3 text-left font-medium">Kategori</th>
            <th className="px-4 py-3 text-left font-medium">
              Harga <span className="font-normal opacity-60">(internal)</span>
            </th>
            <th className="px-4 py-3 text-left font-medium">Stok</th>
            <th className="px-4 py-3 text-center font-medium">Unggulan</th>
            <th className="px-4 py-3 text-center font-medium">Status</th>
            <th className="px-4 py-3 text-center font-medium">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => {
            const thumb =
              item.ImageBase64 != null && item.ImageBase64 !== ""
                ? `data:${item.ImageMimeType || "image/jpeg"};base64,${item.ImageBase64}`
                : null;
            return (
              <tr
                key={item.ProductID}
                className="border-t border-gray-100 transition-colors hover:bg-amber-50/50"
              >
                <td className="px-4 py-3 text-gray-500">{index + 1}</td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => goDetail(item.ProductID)}
                    className="flex max-w-xs items-center gap-3 text-left truncate"
                    title="Lihat detail"
                  >
                    {thumb ? (
                      <img
                        src={thumb}
                        alt={item.Name}
                        className="h-11 w-11 shrink-0 rounded-lg border border-gray-200 object-cover"
                      />
                    ) : (
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50 text-[10px] text-gray-400">
                        No img
                      </span>
                    )}
                    <span>
                      <span className="block font-medium text-gray-900 hover:underline">
                        {item.Name}
                      </span>
                      {item.Description && (
                        <span className="block truncate text-xs text-gray-500">
                          {item.Description.slice(0, 60)}
                        </span>
                      )}
                    </span>
                  </button>
                </td>
                <td className="px-4 py-3 text-gray-600">
                  {item.Category?.Name ?? "—"}
                </td>
                <td className="whitespace-nowrap px-4 py-3 font-medium text-gray-800">
                  {formatPrice(item.Price)}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={
                      (item.Stock ?? 0) <= 0
                        ? "font-semibold text-red-600"
                        : "text-gray-800"
                    }
                  >
                    {item.Stock ?? 0}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  {item.IsFeatured ? (
                    <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-800">
                      Unggulan
                    </span>
                  ) : (
                    <span className="text-gray-300">—</span>
                  )}
                </td>
                <td className="px-4 py-3 text-center">
                  {item.IsActive ? (
                    <span className="rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-700">
                      Aktif
                    </span>
                  ) : (
                    <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-500">
                      Nonaktif
                    </span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-center gap-1.5">
                    <button
                      onClick={() => goDetail(item.ProductID)}
                      title="Detail"
                      className="rounded-md border border-gray-300 p-1.5 text-gray-600 hover:bg-gray-50"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onEdit(item.ProductID)}
                      title="Edit"
                      className="rounded-md bg-amber-500 p-1.5 text-white hover:bg-amber-600"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onDelete(item.ProductID)}
                      title="Hapus"
                      className="rounded-md border border-red-200 p-1.5 text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
