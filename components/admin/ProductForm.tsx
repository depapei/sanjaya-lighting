"use client";

import api from "@/lib/axios";
import { queryKeys } from "@/lib/queryKeys";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, ImagePlus, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useRef, useState } from "react";
import { toast } from "sonner";

type AdminProduct = {
  ProductID?: number;
  Name?: string;
  Description?: string | null;
  CategoryID?: number | null;
  Price?: number | string | null;
  DiscountPrice?: number | string | null;
  Stock?: number;
  IsFeatured?: boolean;
  IsActive?: boolean;
  ImageBase64?: string | null;
  ImageMimeType?: string | null;
  tags?: string | null;
};

type Category = { CategoryID: number; Name: string; IsActive?: boolean };

type CreatedCategory = Category & { reactivated?: boolean };

type ProductFormProps = {
  initialData?: AdminProduct;
};

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const ACCEPTED_MIME = ["image/jpeg", "image/png", "image/webp"];

function priceToString(v: unknown): string {
  if (v === null || v === undefined || v === "") return "";
  return String(v);
}

function formatRupiah(n: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(n);
}

const inputCls =
  "w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200";
const labelCls = "mb-1 block text-sm font-medium text-gray-800";
const hintCls = "mt-1 text-xs text-gray-500";
const cardCls = "rounded-xl border border-gray-200 bg-white p-5 shadow-sm";
const errCls = "mt-1 text-xs text-red-600";

export default function ProductForm({ initialData }: ProductFormProps) {
  const isEdit = Boolean(initialData?.ProductID);
  const router = useRouter();
  const queryClient = useQueryClient();
  const fileRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    Name: initialData?.Name ?? "",
    Description: initialData?.Description ?? "",
    CategoryID: initialData?.CategoryID ? String(initialData.CategoryID) : "",
    Price: priceToString(initialData?.Price),
    DiscountPrice: priceToString(initialData?.DiscountPrice),
    Stock: String(initialData?.Stock ?? 0),
    tags: initialData?.tags ?? "",
    IsFeatured: Boolean(initialData?.IsFeatured),
    IsActive: initialData?.IsActive ?? true,
    ImageBase64: initialData?.ImageBase64 ?? "",
    ImageMimeType: initialData?.ImageMimeType ?? "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [catOpen, setCatOpen] = useState(false);
  const [catName, setCatName] = useState("");
  const [catError, setCatError] = useState("");

  const { data: categories, isLoading: catLoading } = useQuery({
    queryKey: queryKeys.categories,
    queryFn: async () => {
      const res = await api.get("/api/admin/category");
      return res.data as Category[];
    },
  });

  const previewUrl = useMemo(() => {
    if (!form.ImageBase64) return null;
    const mime = form.ImageMimeType || "image/jpeg";
    return `data:${mime};base64,${form.ImageBase64}`;
  }, [form.ImageBase64, form.ImageMimeType]);

  const pricePreview = useMemo(() => {
    if (form.Price.trim() === "") return null;
    const n = parseFloat(form.Price);
    if (!Number.isFinite(n) || n < 0) return null;
    return formatRupiah(n);
  }, [form.Price]);

  const set = (patch: Partial<typeof form>) =>
    setForm((f) => ({ ...f, ...patch }));

  const handleImage = (file: File | undefined) => {
    if (!file) return;
    if (!ACCEPTED_MIME.includes(file.type)) {
      setErrors((e) => ({
        ...e,
        image: "Format harus JPG, PNG, atau WebP.",
      }));
      toast.error("Format gambar harus JPG, PNG, atau WebP.");
      return;
    }
    if (file.size > MAX_IMAGE_BYTES) {
      setErrors((e) => ({ ...e, image: "Ukuran maksimal 5MB." }));
      toast.error("Ukuran gambar maksimal 5MB.");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result?.toString().split(",")[1] || "";
      set({ ImageBase64: base64, ImageMimeType: file.type });
      setErrors((e) => {
        const next = { ...e };
        delete next.image;
        return next;
      });
    };
    reader.readAsDataURL(file);
  };

  const validate = (): boolean => {
    const next: Record<string, string> = {};
    if (form.Name.trim().length < 3)
      next.Name = "Nama produk minimal 3 karakter.";
    if (form.Price.trim() !== "") {
      const n = parseFloat(form.Price);
      if (!Number.isFinite(n) || n < 0)
        next.Price = "Harga harus angka ≥ 0, atau kosongkan.";
    }
    if (form.DiscountPrice.trim() !== "") {
      const n = parseFloat(form.DiscountPrice);
      if (!Number.isFinite(n) || n < 0)
        next.DiscountPrice = "Harga diskon harus angka ≥ 0, atau kosongkan.";
    }
    const stock = parseInt(form.Stock, 10);
    if (!Number.isFinite(stock) || stock < 0)
      next.Stock = "Stok harus bilangan bulat ≥ 0.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const createCategoryMutation = useMutation({
    mutationFn: async (name: string) => {
      const res = await api.post("/api/admin/category", { Name: name });
      return res.data as CreatedCategory;
    },
    onSuccess: (created) => {
      queryClient.setQueryData<Category[]>(queryKeys.categories, (old) => {
        const list = Array.isArray(old) ? old : [];
        if (list.some((c) => c.CategoryID === created.CategoryID))
          return list.map((c) =>
            c.CategoryID === created.CategoryID
              ? { ...c, Name: created.Name, IsActive: true }
              : c,
          );
        return [...list, created].sort((a, b) =>
          a.Name.localeCompare(b.Name),
        );
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.categories });
      queryClient.invalidateQueries({
        queryKey: queryKeys.productCategories,
      });
      set({ CategoryID: String(created.CategoryID) });
      setCatOpen(false);
      setCatName("");
      setCatError("");
      toast.success(
        created.reactivated
          ? `Kategori "${created.Name}" diaktifkan kembali & dipilih.`
          : `Kategori "${created.Name}" ditambahkan & dipilih.`,
      );
    },
    onError: (err: unknown) => {
      const status =
        typeof err === "object" && err !== null && "response" in err
          ? (err as { response?: { status?: number } }).response?.status
          : undefined;
      if (status === 409) {
        setCatError("Nama kategori sudah dipakai. Pilih dari dropdown.");
        toast.error("Nama kategori sudah dipakai.");
      } else if (status === 401) {
        setCatError("Sesi habis. Login ulang lalu coba lagi.");
        toast.error("Sesi habis. Silakan login ulang.");
      } else {
        setCatError("Gagal menambah kategori. Coba lagi.");
        toast.error("Gagal menambah kategori.");
      }
    },
  });

  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const name = catName.trim();
    if (name.length < 2) {
      setCatError("Nama kategori minimal 2 karakter.");
      return;
    }
    const dup = (categories ?? []).some(
      (c) => c.Name.toLowerCase() === name.toLowerCase(),
    );
    if (dup) {
      setCatError("Kategori sudah ada. Pilih dari dropdown.");
      return;
    }
    setCatError("");
    createCategoryMutation.mutate(name);
  };

  const saveMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        Name: form.Name.trim(),
        Description: form.Description.trim() === "" ? null : form.Description.trim(),
        CategoryID:
          form.CategoryID === "" ? null : parseInt(form.CategoryID, 10),
        Price: form.Price.trim() === "" ? null : parseFloat(form.Price),
        DiscountPrice:
          form.DiscountPrice.trim() === ""
            ? null
            : parseFloat(form.DiscountPrice),
        Stock: parseInt(form.Stock, 10) || 0,
        tags: form.tags.trim() === "" ? null : form.tags.trim(),
        IsFeatured: form.IsFeatured,
        IsActive: form.IsActive,
        ImageBase64: form.ImageBase64 === "" ? null : form.ImageBase64,
        ImageMimeType:
          form.ImageBase64 === ""
            ? null
            : form.ImageMimeType || "image/jpeg",
        ...(isEdit ? { UpdatedBy: "admin" } : { CreatedBy: "admin" }),
      };
      if (isEdit) {
        const res = await api.put(
          `/api/admin/products?id=${initialData?.ProductID}`,
          payload,
        );
        return res.data;
      }
      const res = await api.post("/api/admin/products", payload);
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.products });
      queryClient.invalidateQueries({
        queryKey: queryKeys.featuredProducts,
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.productCategories,
      });
      const id = data?.ProductID ?? initialData?.ProductID;
      if (id) {
        queryClient.invalidateQueries({
          queryKey: queryKeys.productDetail(String(id)),
        });
      }
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      toast.error("Periksa lagi isian form yang bertanda merah.");
      return;
    }
    try {
      const saved = await saveMutation.mutateAsync();
      toast.success(
        isEdit ? "Produk berhasil diperbarui." : "Produk berhasil ditambahkan.",
      );
      const id = saved?.ProductID ?? initialData?.ProductID;
      router.push(id ? `/admin/products/detail/${id}` : "/admin/products");
      router.refresh();
    } catch {
      toast.error("Gagal menyimpan produk. Coba lagi.");
    }
  };

  const saving = saveMutation.isPending;

  return (
    <div className="mx-auto max-w-5xl">
      <Link
        href="/admin/products"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft className="h-4 w-4" /> Kembali ke daftar produk
      </Link>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isEdit ? "Edit Produk" : "Tambah Produk"}
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            {isEdit
              ? "Ubah info produk, lalu simpan."
              : "Isi info produk di bawah ini. Harga bersifat internal dan tidak tampil di depan."}
          </p>
        </div>
        {isEdit && (
          <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
            ID #{initialData?.ProductID}
          </span>
        )}
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-5 lg:grid-cols-[1fr_340px]">
          {/* Kolom utama */}
          <div className="space-y-5">
            <section className={cardCls}>
              <h2 className="mb-4 text-base font-semibold text-gray-900">
                Informasi produk
              </h2>
              <div className="mb-4">
                <label className={labelCls} htmlFor="Name">
                  Nama produk <span className="text-red-500">*</span>
                </label>
                <input
                  id="Name"
                  name="Name"
                  value={form.Name}
                  onChange={(e) => set({ Name: e.target.value })}
                  placeholder="cth: Lampu Gantung Kristal Gold"
                  className={inputCls}
                />
                {errors.Name && <p className={errCls}>{errors.Name}</p>}
              </div>

              <div className="mb-4">
                <div className="mb-1 flex items-center justify-between">
                  <label className={labelCls} htmlFor="CategoryID">
                    Kategori
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setCatName("");
                      setCatError("");
                      setCatOpen(true);
                    }}
                    className="text-xs font-medium text-amber-700 hover:underline"
                  >
                    + Kategori baru
                  </button>
                </div>
                <select
                  id="CategoryID"
                  name="CategoryID"
                  value={form.CategoryID}
                  onChange={(e) => set({ CategoryID: e.target.value })}
                  className={inputCls}
                >
                  <option value="">Tanpa kategori</option>
                  {catLoading ? (
                    <option disabled>Memuat…</option>
                  ) : (
                    (categories ?? []).map((c) => (
                      <option key={c.CategoryID} value={String(c.CategoryID)}>
                        {c.Name}
                      </option>
                    ))
                  )}
                </select>
                <p className={hintCls}>Boleh kosong. Bisa diubah kapan saja.</p>
              </div>

              <div className="mb-4">
                <label className={labelCls} htmlFor="Description">
                  Deskripsi
                </label>
                <textarea
                  id="Description"
                  name="Description"
                  value={form.Description}
                  onChange={(e) => set({ Description: e.target.value })}
                  rows={5}
                  placeholder="Bahan, ukuran, warna, cocok untuk ruangan apa…"
                  className={inputCls}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className={labelCls} htmlFor="Stock">
                    Stok
                  </label>
                  <input
                    id="Stock"
                    type="number"
                    min={0}
                    step={1}
                    value={form.Stock}
                    onChange={(e) => set({ Stock: e.target.value })}
                    className={inputCls}
                  />
                  {errors.Stock && <p className={errCls}>{errors.Stock}</p>}
                </div>
                <div>
                  <label className={labelCls} htmlFor="tags">
                    Tags <span className="font-normal text-gray-400">(opsional)</span>
                  </label>
                  <input
                    id="tags"
                    value={form.tags}
                    onChange={(e) => set({ tags: e.target.value })}
                    placeholder="cth: kristal, gold, ruang tamu"
                    className={inputCls}
                  />
                </div>
              </div>

              <div className="mt-5 space-y-3 border-t border-gray-100 pt-4">
                <label className="flex cursor-pointer items-center justify-between gap-3">
                  <span>
                    <span className="block text-sm font-medium text-gray-800">
                      Tampilkan di toko
                    </span>
                    <span className="block text-xs text-gray-500">
                      Nonaktif = disembunyikan dari depan tanpa menghapus.
                    </span>
                  </span>
                  <input
                    type="checkbox"
                    checked={form.IsActive}
                    onChange={(e) => set({ IsActive: e.target.checked })}
                    className="h-5 w-5 accent-amber-500"
                  />
                </label>
                <label className="flex cursor-pointer items-center justify-between gap-3">
                  <span>
                    <span className="block text-sm font-medium text-gray-800">
                      Produk unggulan
                    </span>
                    <span className="block text-xs text-gray-500">
                      Muncul di section pilihan editor.
                    </span>
                  </span>
                  <input
                    type="checkbox"
                    checked={form.IsFeatured}
                    onChange={(e) => set({ IsFeatured: e.target.checked })}
                    className="h-5 w-5 accent-amber-500"
                  />
                </label>
              </div>
            </section>
          </div>

          {/* Kolom samping */}
          <div className="space-y-5">
            <section className={cardCls}>
              <h2 className="mb-1 text-base font-semibold text-gray-900">
                Harga internal
              </h2>
              <p className="mb-4 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800">
                Hanya terlihat di admin. Boleh dikosongkan.
              </p>
              <div className="mb-4">
                <label className={labelCls} htmlFor="Price">
                  Harga (Rp)
                </label>
                <input
                  id="Price"
                  type="number"
                  min={0}
                  step={1000}
                  value={form.Price}
                  onChange={(e) => set({ Price: e.target.value })}
                  placeholder="Kosongkan jika tidak perlu"
                  className={inputCls}
                />
                {errors.Price ? (
                  <p className={errCls}>{errors.Price}</p>
                ) : pricePreview ? (
                  <p className="mt-1 text-xs font-medium text-gray-700">
                    {pricePreview}
                  </p>
                ) : (
                  <p className={hintCls}>Contoh: 2500000</p>
                )}
              </div>
              <div>
                <label className={labelCls} htmlFor="DiscountPrice">
                  Harga diskon (Rp){" "}
                  <span className="font-normal text-gray-400">(opsional)</span>
                </label>
                <input
                  id="DiscountPrice"
                  type="number"
                  min={0}
                  step={1000}
                  value={form.DiscountPrice}
                  onChange={(e) => set({ DiscountPrice: e.target.value })}
                  placeholder="Kosongkan jika tidak ada"
                  className={inputCls}
                />
                {errors.DiscountPrice && (
                  <p className={errCls}>{errors.DiscountPrice}</p>
                )}
              </div>
            </section>

            <section className={cardCls}>
              <h2 className="mb-4 text-base font-semibold text-gray-900">
                Foto produk
              </h2>
              {previewUrl ? (
                <div>
                  <img
                    src={previewUrl}
                    alt="Preview produk"
                    className="aspect-square w-full rounded-lg border border-gray-200 object-cover"
                  />
                  <div className="mt-3 flex gap-2">
                    <button
                      type="button"
                      onClick={() => fileRef.current?.click()}
                      className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                      Ganti
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        set({ ImageBase64: "", ImageMimeType: "" })
                      }
                      className="inline-flex items-center gap-1 rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" /> Hapus
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="flex aspect-square w-full flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 text-gray-500 hover:border-amber-400 hover:text-gray-700"
                >
                  <ImagePlus className="h-8 w-8" />
                  <span className="text-sm font-medium">Klik untuk upload</span>
                  <span className="text-xs">JPG / PNG / WebP, maks 5MB</span>
                </button>
              )}
              <input
                ref={fileRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={(e) => handleImage(e.target.files?.[0])}
              />
              {errors.image && <p className={errCls}>{errors.image}</p>}
            </section>
          </div>
        </div>

        <div className="sticky bottom-0 mt-6 flex gap-3 border-t border-gray-200 bg-white/90 py-4 backdrop-blur">
          <button
            type="button"
            onClick={() => router.back()}
            className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={saving}
            className="flex-1 rounded-lg bg-amber-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-amber-600 disabled:opacity-60 sm:flex-none sm:px-10"
          >
            {saving
              ? "Menyimpan…"
              : isEdit
                ? "Simpan perubahan"
                : "Tambah produk"}
          </button>
        </div>
      </form>

      {catOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => {
            if (!createCategoryMutation.isPending) setCatOpen(false);
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Tambah kategori baru"
            className="w-full max-w-sm rounded-xl bg-white p-5 shadow-xl"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => {
              if (e.key === "Escape" && !createCategoryMutation.isPending)
                setCatOpen(false);
            }}
          >
            <h2 className="text-base font-semibold text-gray-900">
              Kategori baru
            </h2>
            <p className="mt-1 text-xs text-gray-500">
              Langsung terpilih di form produk ini setelah disimpan.
            </p>
            <form onSubmit={handleCreateCategory} className="mt-4">
              <label className={labelCls} htmlFor="newCategoryName">
                Nama kategori <span className="text-red-500">*</span>
              </label>
              <input
                id="newCategoryName"
                autoFocus
                value={catName}
                onChange={(e) => setCatName(e.target.value)}
                onKeyDown={(e) => e.stopPropagation()}
                placeholder="cth: Lampu Gantung"
                className={inputCls}
              />
              {catError && <p className={errCls}>{catError}</p>}
              <div className="mt-4 flex gap-2">
                <button
                  type="button"
                  disabled={createCategoryMutation.isPending}
                  onClick={() => setCatOpen(false)}
                  className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-60"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={
                    createCategoryMutation.isPending ||
                    catName.trim().length < 2
                  }
                  className="flex-1 rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-600 disabled:opacity-60"
                >
                  {createCategoryMutation.isPending
                    ? "Menyimpan…"
                    : "Simpan kategori"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
