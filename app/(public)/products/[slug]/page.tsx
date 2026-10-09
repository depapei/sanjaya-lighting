"use client";
import ProductCarousel from "@/components/site/ProductCarousel";
import api from "@/lib/axios";
import { queryKeys } from "@/lib/queryKeys";

import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { notFound, useRouter } from "next/navigation";

export const dynamic = "force-dynamic";

interface ProductPageProps {
  params: {
    slug: string;
  };
}

export default function ProductPage({ params }: ProductPageProps) {
  const router = useRouter();

  const {
    data: product,
    isLoading,
    isError,
  } = useQuery({
    queryKey: queryKeys.publicProductDetail(params.slug),
    queryFn: async () => {
      const res = await api.get(`/api/product/${params.slug}`);
      return res.data;
    },
  });

  if (isLoading) {
    return (
      <div className="bg-white pb-[80px] pt-[164px]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-[50px] lg:grid-cols-2">
            <div className="aspect-square animate-pulse rounded-md border border-[#E5E7EB] bg-[#F6F6F6]" />
            <div className="space-y-4">
              <div className="h-4 w-24 animate-pulse rounded-sm bg-[#F6F6F6]" />
              <div className="h-8 w-3/4 animate-pulse rounded-sm bg-[#F6F6F6]" />
              <div className="h-24 w-full animate-pulse rounded-md border border-[#E5E7EB] bg-[#F6F6F6]" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !product) {
    return notFound();
  }

  return (
    <>
      <script type="application/ld+json" />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <article className="bg-white pb-[80px] pt-[164px]">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <Link
              href={""}
              onClick={() => router.back()}
              className="mb-[30px] inline-flex items-center gap-2 p-0 text-sm font-normal text-black transition-opacity hover:opacity-60"
            >
              <ArrowLeft className="h-4 w-4" />
              Kembali
            </Link>

            <div className="grid grid-cols-1 gap-[50px] lg:grid-cols-2">
              <div className="overflow-hidden rounded-sm border border-[#E5E7EB] bg-[#F6F6F6]">
                <img
                  src={`data:image/jpeg;base64,${product.ImageBase64}`}
                  alt={product.Name}
                  className="aspect-square w-full object-cover"
                />
              </div>

              <div>
                <p className="mb-2 text-xs font-normal uppercase tracking-[0.08em] text-[#6B6B6B]">
                  Detail Produk
                </p>
                <h1 className="mb-4 text-[32px] font-bold leading-[1.19] tracking-[0px] text-black">
                  {product.Name}
                </h1>

                <div className="mb-[16px] inline-flex rounded-full border border-[#E5E7EB] bg-[#F6F6F6] px-3 py-1.5 text-xs font-normal text-black">
                  Stok Tersedia
                </div>

                <div className="prose prose-lg max-w-none">
                  <p className="whitespace-pre-line text-base font-normal leading-[1.5] text-[#333333]">
                    {product.Description}
                  </p>
                </div>

                <div className="pt-[30px]">
                  <button className="inline-flex h-9 w-full items-center justify-center gap-2 rounded-sm border border-black bg-transparent px-4 text-base font-normal text-black transition-colors hover:bg-black hover:text-white md:w-auto">
                    Hubungi untuk Pembelian
                    <ArrowUpRight className="h-4 w-4" />
                  </button>
                </div>

                <div className="mt-[30px] space-y-0 border-t border-[#E5E7EB]">
                  <div className="flex justify-between border-b border-[#E5E7EB] py-4 text-sm">
                    <span className="font-normal text-[#6B6B6B]">Product ID</span>
                    <span className="font-normal text-black">
                      {product.ProductID}
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-[#E5E7EB] py-4 text-sm">
                    <span className="font-normal text-[#6B6B6B]">Status</span>
                    <span className="font-normal text-black">In Stock</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="mx-auto mt-[80px] max-w-7xl border-t border-[#E5E7EB] px-4 sm:px-6 lg:px-8">
            <ProductCarousel title="Our Featured Collection" />
          </div>
        </article>
      </motion.div>
    </>
  );
}
