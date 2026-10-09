"use client";

import api from "@/lib/axios";
import { queryKeys } from "@/lib/queryKeys";
import type { ProductCategory } from "@/lib/slug";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export const dynamic = "force-dynamic";

interface ApiProduct {
  ProductID: string;
  Name: string;
  Description?: string | null;
  ImageBase64?: string | null;
  Category?: string | null;
}

interface CardProduct {
  id: string;
  name: string;
  image: string;
  category: string;
}

function mapProduct(p: ApiProduct): CardProduct {
  return {
    id: p.ProductID,
    name: p.Name,
    image: p.ImageBase64 ? `data:image/jpeg;base64,${p.ImageBase64}` : "",
    category: p.Category || "Uncategorized",
  };
}

function ProductCard({ product }: { product: CardProduct }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
    >
      <Link href={`/products/${product.id}`}>
        <div className="group cursor-pointer">
          <div className="relative aspect-[2/3] overflow-hidden rounded-md border border-[#E5E7EB] bg-[#F6F6F6]">
            {product.image ? (
              <img
                src={product.image}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-sm font-normal text-[#6B6B6B]">
                Tanpa gambar
              </div>
            )}
            <div className="absolute left-4 top-4 rounded-full border border-[#E5E7EB] bg-white px-3 py-1.5 text-xs font-normal text-black">
              {product.category}
            </div>
          </div>
          <div className="flex items-start justify-between gap-2 px-1 pt-4">
            <div className="space-y-1">
              <h3 className="text-base font-normal leading-snug text-black group-hover:opacity-60">
                {product.name}
              </h3>
            </div>
            <ArrowUpRight className="mt-1 h-4 w-4 shrink-0 text-black opacity-0 transition-opacity group-hover:opacity-100" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

function ProductsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeSlug = searchParams.get("category")?.trim() || "";

  const {
    data: categoriesData,
    isLoading: catLoading,
    isError: catError,
  } = useQuery({
    queryKey: queryKeys.productCategories,
    queryFn: async () => {
      const res = await api.get("/api/product-category");
      return res.data as ProductCategory[];
    },
    staleTime: 5 * 60 * 1000,
  });

  const categories: ProductCategory[] = Array.isArray(categoriesData)
    ? categoriesData
    : [];
  const activeCategory = activeSlug
    ? categories.find(
        (c) => c.slug.toLowerCase() === activeSlug.toLowerCase(),
      )
    : undefined;
  // Slug di URL tapi tidak dikenal → tampilkan notice + empty state
  const unknownSlug =
    activeSlug !== "" && !catLoading && !catError && !activeCategory;

  const {
    data: productsData,
    isLoading: prodLoading,
    isError: prodError,
    refetch: refetchProducts,
  } = useQuery({
    // Kalau slug tidak dikenal, API kembalikan [] → empty state yang rapi
    queryKey: queryKeys.productsByCategory(activeSlug || "all"),
    queryFn: async () => {
      const url = activeSlug
        ? `/api/product?category=${encodeURIComponent(activeSlug)}`
        : "/api/product";
      const res = await api.get(url);
      return res.data as ApiProduct[];
    },
    staleTime: 60 * 1000,
  });

  const products: CardProduct[] = Array.isArray(productsData)
    ? productsData.map(mapProduct)
    : [];

  const goTo = (slug: string) => {
    router.replace(slug ? `/products?category=${encodeURIComponent(slug)}` : "/products", {
      scroll: false,
    });
  };

  return (
    <div className="bg-white pb-[80px] pt-[120px] sm:pt-[140px]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="mb-[30px] text-left"
        >
          <p className="mb-2 text-xs font-normal uppercase tracking-[0.08em] text-[#6B6B6B]">
            Katalog
          </p>
          <h1 className="text-2xl font-bold leading-[1.21] text-black md:text-[32px] md:leading-[1.19]">
            {activeCategory ? activeCategory.name : "Jelajahi Produk Kami"}
          </h1>
          <p className="mt-2 max-w-2xl text-base font-normal leading-[1.5] text-[#6B6B6B]">
            {prodLoading
              ? "Memuat produk…"
              : `${products.length} produk${activeCategory ? ` dalam ${activeCategory.name}` : " tersedia"}`}
          </p>
        </motion.div>

        {/* Filter kategori */}
        <div className="mb-[30px] flex flex-wrap gap-2">
          {catLoading ? (
            [0, 1, 2, 3].map((n) => (
              <Skeleton key={n} className="h-9 w-28 rounded-full" />
            ))
          ) : catError ? (
            <p className="text-sm font-normal text-[#6B6B6B]">
              Gagal memuat kategori.
            </p>
          ) : (
            <>
              <button
                onClick={() => goTo("")}
                className={`rounded-full border px-4 py-2 text-sm font-normal transition-colors ${
                  activeSlug === ""
                    ? "border-black bg-black text-white"
                    : "border-[#E5E7EB] bg-white text-black hover:border-black"
                }`}
              >
                Semua
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.slug}
                  onClick={() => goTo(cat.slug)}
                  className={`rounded-full border px-4 py-2 text-sm font-normal transition-colors ${
                    activeCategory?.slug === cat.slug
                      ? "border-black bg-black text-white"
                      : "border-[#E5E7EB] bg-white text-black hover:border-black"
                  }`}
                >
                  {cat.name}
                  <span className="ml-2 text-xs opacity-60">
                    {cat.productCount}
                  </span>
                </button>
              ))}
            </>
          )}
        </div>

        {unknownSlug && (
          <div className="mb-[30px] rounded-md border border-[#E5E7EB] bg-[#F6F6F6] p-4 text-center">
            <p className="text-sm font-normal text-[#6B6B6B]">
              Kategori &ldquo;{activeSlug}&rdquo; tidak ditemukan.
            </p>
            <button
              onClick={() => goTo("")}
              className="mt-1 p-0 text-sm font-normal text-black underline underline-offset-2 hover:opacity-60"
            >
              Lihat semua produk
            </button>
          </div>
        )}

        {prodLoading ? (
          <div className="grid grid-cols-1 gap-[30px] sm:grid-cols-2 lg:grid-cols-4">
            {[0, 1, 2, 3, 4, 5, 6, 7].map((n) => (
              <div key={n} className="space-y-3">
                <Skeleton className="aspect-[2/3] w-full rounded-md" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            ))}
          </div>
        ) : prodError ? (
          <div className="rounded-md border border-[#E5E7EB] bg-[#F6F6F6] p-4 text-center">
            <p className="text-sm font-normal text-[#6B6B6B]">
              Gagal memuat produk. Silakan coba lagi.
            </p>
            <button
              onClick={() => refetchProducts()}
              className="mt-2 rounded-sm border border-black bg-transparent px-4 py-2 text-sm font-normal text-black transition-colors hover:bg-black hover:text-white"
            >
              Coba lagi
            </button>
          </div>
        ) : products.length === 0 ? (
          <div className="rounded-md border border-[#E5E7EB] bg-white py-[50px] text-center">
            <p className="text-base font-normal text-[#6B6B6B]">
              Belum ada produk{activeCategory ? ` dalam ${activeCategory.name}` : ""} saat ini.
            </p>
            {activeSlug !== "" && (
              <button
                onClick={() => goTo("")}
                className="mt-4 rounded-sm border border-black bg-transparent px-4 py-2 text-sm font-normal text-black transition-colors hover:bg-black hover:text-white"
              >
                Lihat semua produk
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-[30px] sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="bg-white pb-[80px] pt-[120px]">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Skeleton className="h-8 w-64" />
          </div>
        </div>
      }
    >
      <ProductsContent />
    </Suspense>
  );
}
