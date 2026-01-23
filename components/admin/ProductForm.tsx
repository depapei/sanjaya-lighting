"use client";

import api from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";

type ProductFormProps = {
  initialData?: any;
  onSuccess?: () => void;
};

export default function ProductForm({
  initialData,
  onSuccess,
}: ProductFormProps) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    Name: initialData?.Name || "",
    Description: initialData?.Description || "",
    CategoryID: initialData?.CategoryID || 0,
    Price: initialData?.Price || "",
    Stock: initialData?.Stock || 0,
    IsFeatured: initialData?.IsFeatured || false,
    ImageBase64: initialData?.ImageBase64 || "",
    ImageMimeType: initialData?.ImageMimeType || "",
    CreatedBy: initialData?.CreatedBy || "admin",
  });

  const router = useRouter();

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;

    if (name === "Stock" || name === "Price" || name === "CategoryID") {
      setForm({
        ...form,
        [name]: parseFloat(value),
      });
      return;
    }

    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleImage = (e: any) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setForm({
        ...form,
        ImageBase64: reader.result?.toString().split(",")[1] || "",
        ImageMimeType: file.type,
      });
    };
    reader.readAsDataURL(file);
  };

  const {
    data: categories,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["categories-object"],
    queryFn: async () => {
      const res = await api.get("/api/admin/category");
      return res.data;
    },
  });

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    const res = await fetch(
      "/api/admin/products" +
        (initialData ? `?id=${initialData.ProductID}` : ""),
      {
        method: initialData ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      },
    );

    setLoading(false);

    if (res.ok) {
      onSuccess?.();

      if (initialData) {
        router.push(`/admin/products/detail/${initialData.ProductID}`);
      }

      alert("Product saved successfully");
    } else {
      alert("Failed to save product");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl rounded-xl bg-white p-6 shadow-md border border-gray-200"
    >
      <h2 className="mb-6 text-2xl font-semibold text-gray-800">
        {initialData ? "Edit Product" : "Add Product"}
      </h2>

      {/* NAME */}
      <div className="mb-4">
        <label className="block mb-1 text-sm font-medium text-gray-800">
          Product Name
        </label>
        <input
          name="Name"
          value={form.Name}
          onChange={handleChange}
          required
          className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-amber-400 focus:ring-amber-400"
        />
      </div>

      {/* CATEGORY */}
      <div className="mb-4">
        <label className="block mb-1 text-sm font-medium text-gray-800">
          Category
        </label>
        <select
          name="CategoryID" // pastikan name sesuai dengan properti di form
          value={form.CategoryID ?? ""} // handle null/undefined
          onChange={handleChange}
          required
          className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-amber-400 focus:ring-amber-400"
        >
          <option value="">Pilih Kategori</option>
          {isLoading ? (
            <option disabled>Loading...</option>
          ) : isError ? (
            <option disabled>Error memuat kategori</option>
          ) : categories && Array.isArray(categories) ? (
            categories.map((category: { CategoryID: number; Name: string }) => (
              <option key={category.CategoryID} value={category.CategoryID}>
                {category.Name}
              </option>
            ))
          ) : (
            <option disabled>Tidak ada kategori</option>
          )}
        </select>
      </div>

      {/* DESCRIPTION */}
      <div className="mb-4">
        <label className="block mb-1 text-sm font-medium text-gray-800">
          Description
        </label>
        <textarea
          name="Description"
          value={form.Description}
          onChange={handleChange}
          rows={3}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-amber-400 focus:ring-amber-400"
        />
      </div>

      {/* PRICE & STOCK */}
      <div className="mb-4 grid grid-cols-2 gap-4">
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-800">
            Price
          </label>
          <input
            type="number"
            name="Price"
            value={form.Price}
            onChange={handleChange}
            required
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-amber-400 focus:ring-amber-400"
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium text-gray-800">
            Stock
          </label>
          <input
            type="number"
            name="Stock"
            value={form.Stock}
            onChange={handleChange}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-amber-400 focus:ring-amber-400"
          />
        </div>
      </div>

      {/* IMAGE */}
      <div className="mb-4">
        <label className="block mb-1 text-sm font-medium text-gray-800">
          Product Image
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImage}
          className="w-full text-sm text-gray-600"
        />
      </div>

      {/* FEATURED */}
      <div className="mb-6 flex items-center gap-2">
        <input
          type="checkbox"
          name="IsFeatured"
          checked={form.IsFeatured}
          onChange={handleChange}
          className="h-4 w-4 accent-amber-400"
        />
        <label className="text-sm text-gray-800">Featured Product</label>
      </div>

      {/* SUBMIT */}
      <button
        disabled={loading}
        className="w-full rounded-lg bg-amber-400 py-2 font-semibold text-gray-800 hover:bg-amber-500 disabled:opacity-60"
      >
        {loading ? "Saving..." : "Save Product"}
      </button>
    </form>
  );
}
