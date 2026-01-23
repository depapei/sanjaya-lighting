"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useRouter } from "next/navigation";
import { useState } from "react";

type ProductFormProps = {
  initialData?: any;
  onSuccess?: () => void;
};

export default function CategoryForm({
  initialData,
  onSuccess,
}: ProductFormProps) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    Name: initialData?.Name || "",
  });

  const router = useRouter();

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;

    if (name === "Stock" || name === "Price") {
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

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    const res = await fetch(
      "/api/admin/category" +
        (initialData ? `?id=${initialData.CategoryID}` : ""),
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
        router.push(`/admin/categories/detail/${initialData.ProductID}`);
      }

      alert("Category saved successfully");
    } else {
      alert("Failed to save category");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl rounded-xl bg-white p-6 shadow-md border border-gray-200"
    >
      <h2 className="mb-6 text-2xl font-semibold text-gray-800">
        {initialData ? "Edit Category" : "Add Category"}
      </h2>

      {/* NAME */}
      <div className="mb-4">
        <label className="block mb-1 text-sm font-medium text-gray-800">
          Category Name
        </label>
        <input
          name="Name"
          value={form.Name}
          onChange={handleChange}
          required
          className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-amber-400 focus:ring-amber-400"
        />
      </div>

      {/* SUBMIT */}
      <button
        disabled={loading}
        className="w-full rounded-lg bg-amber-400 py-2 font-semibold text-gray-800 hover:bg-amber-500 disabled:opacity-60"
      >
        {loading ? "Saving..." : "Save Category"}
      </button>
    </form>
  );
}
