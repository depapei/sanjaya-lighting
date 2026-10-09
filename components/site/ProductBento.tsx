"use client";

import api from "@/lib/axios";
import { queryKeys } from "@/lib/queryKeys";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { BentoCard, BentoGrid } from "../magicui/bento-grid";

interface Product {
  id: string;
  name: string;
  slug: string;
  images: string;
  category: string;
  description: string;
}

export default function ProductBento() {
  const { data, isLoading, isError } = useQuery({
    queryKey: queryKeys.products,
    queryFn: async () => {
      const res = await api.get("/api/product");
      return res.data;
    },
  });

  const products: Product[] = Array.isArray(data)
    ? data.map((product) => ({
        id: product.ProductID,
        name: product.Name,
        description: product.Description || "",
        slug: product.ProductID,
        images: `data:image/jpeg;base64,${product.ImageBase64}`,
        category: product.Category || "Uncategorized",
      }))
    : [];

  const spanClasses = [
    "lg:col-span-1",
    "lg:col-span-2",
    "lg:col-span-1",
    "lg:col-span-1",
    "lg:col-span-2",
    "lg:col-span-1",
  ];

  const BentoSkeleton = ({ className }: { className: string }) => (
    <div
      className={cn(
        "rounded-md border border-[#E5E7EB] bg-[#F6F6F6] animate-pulse",
        className
      )}
    />
  );
  return (
    <section id="koleksi" className="border-b border-[#E5E7EB] bg-white">
      <div className="mx-auto max-w-7xl px-4 py-[80px] sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="mb-[30px] text-left"
        >
          <p className="mb-2 text-xs font-normal uppercase tracking-[0.08em] text-[#6B6B6B]">
            Koleksi
          </p>
          <h2 className="max-w-3xl text-2xl font-bold leading-[1.21] tracking-[0px] text-black md:text-[32px] md:leading-[1.19]">
            Koleksi pilihan lampu kami yang paling indah dan premium.
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          {!isLoading && !isError && products.length > 0 && (
            <BentoGrid className="grid-cols-3">
              {products.map((product, index) => (
                <BentoCard
                  key={product.slug}
                  name={product.name}
                  description={
                    product.description?.replace(/<[^>]+>/g, "").slice(0, 100) +
                    "..."
                  }
                  href={`/products/${product.slug}`}
                  cta="Lihat Produk"
                  background={
                    <img
                      src={product.images}
                      alt={product.name}
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  }
                  className={cn(`${spanClasses[index % spanClasses.length]}`)}
                />
              ))}
            </BentoGrid>
          )}

          {isLoading && (
            <BentoGrid className="mt-0">
              {spanClasses.map((span, index) => (
                <BentoSkeleton key={index} className={span} />
              ))}
            </BentoGrid>
          )}

          {isError && (
            <div className="rounded-md border border-[#E5E7EB] bg-[#F6F6F6] p-4 text-center text-sm font-normal text-[#6B6B6B]">
              Gagal memuat koleksi. Silakan coba lagi.
            </div>
          )}

          {products.length === 0 && !isLoading && !isError && (
            <div className="rounded-md border border-[#E5E7EB] bg-white py-[50px] text-center">
              <p className="text-base font-normal text-[#6B6B6B]">
                Belum ada produk saat ini.
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
