"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import api from "@/lib/axios";
import { queryKeys } from "@/lib/queryKeys";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { Skeleton } from "../ui/skeleton";

interface Product {
  id: string;
  name: string;
  slug: string;
  images: string;
  category: string;
  description: string;
}

function mapProducts(data: unknown): Product[] {
  if (!Array.isArray(data)) return [];
  return data.map((product: Record<string, string>) => ({
    id: product.ProductID,
    name: product.Name,
    description: product.Description || "",
    slug: product.ProductID,
    images: `data:image/jpeg;base64,${product.ImageBase64}`,
    category: product.Category || "Uncategorized",
  }));
}

function SectionHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="mb-[30px] text-left"
    >
      <p className="mb-2 text-xs font-normal uppercase tracking-[0.08em] text-[#6B6B6B]">
        {subtitle}
      </p>
      <h2 className="text-2xl font-bold leading-[1.21] tracking-[0px] text-black md:text-[32px] md:leading-[1.19]">
        {title}
      </h2>
    </motion.div>
  );
}

function ProductCard({ product }: { product: Product }) {
  const router = useRouter();
  return (
    <div
      role="link"
      tabIndex={0}
      onClick={() => router.push(`/products/${product.id}`)}
      onKeyDown={(e) => {
        if (e.key === "Enter") router.push(`/products/${product.id}`);
      }}
      className="group cursor-pointer border border-transparent transition-colors hover:border-black"
    >
      <div className="aspect-[2/3] overflow-hidden border border-[#E5E7EB] bg-[#F6F6F6]">
        <img
          src={product.images}
          alt={product.name}
          className="h-full w-full object-cover"
        />
      </div>
      <div className="flex items-start justify-between gap-2 px-1 pt-4">
        <div>
          <p className="text-base font-normal leading-snug text-black">
            {product.name}
          </p>
          <p className="mt-1 inline-flex rounded-full border border-[#E5E7EB] bg-[#F6F6F6] px-3 py-1.5 text-xs font-normal text-black">
            {product.category}
          </p>
        </div>
        <ArrowUpRight className="mt-1 h-4 w-4 shrink-0 text-black opacity-0 transition-opacity group-hover:opacity-100" />
      </div>
    </div>
  );
}

function CarouselStates({
  isLoading,
  isError,
  products,
  render,
}: {
  isLoading: boolean;
  isError: boolean;
  products: Product[];
  render: (products: Product[]) => React.ReactNode;
}) {
  if (isLoading) {
    return (
      <Carousel opts={{ align: "start" }}>
        <CarouselContent>
          {[1, 2, 3, 4, 5].map((n) => (
            <CarouselItem key={n} className="sm:basis-1/2 md:basis-1/3 lg:basis-1/5">
              <div className="aspect-[2/3]">
                <Skeleton className="flex h-full w-full items-center justify-center rounded-md text-sm font-normal text-[#6B6B6B]">
                  Memuat produk…
                </Skeleton>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    );
  }

  if (isError) {
    return (
      <div className="rounded-md border border-[#E5E7EB] bg-[#F6F6F6] p-4 text-center text-sm font-normal text-[#6B6B6B]">
        Gagal memuat produk. Silakan coba lagi.
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="rounded-md border border-[#E5E7EB] bg-white py-[50px] text-center">
        <p className="text-base font-normal text-[#6B6B6B]">
          Belum ada produk saat ini.
        </p>
      </div>
    );
  }

  return <>{render(products)}</>;
}

export default function FeaturedProductCarousel(props: { title?: string }) {
  const { data, isLoading, isError } = useQuery({
    queryKey: queryKeys.featuredProducts,
    queryFn: async () => {
      const res = await api.get("/api/featured-product");
      return res.data;
    },
  });

  const products = mapProducts(data);

  return (
    <section id="products" className="border-b border-[#E5E7EB] bg-white">
      <div className="mx-auto max-w-7xl px-4 py-[80px] sm:px-6 lg:px-8">
        <SectionHeader
          title={props.title ? props.title : "Produk Unggulan Kami"}
          subtitle="Pilihan Editor"
        />
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          <CarouselStates
            isLoading={isLoading}
            isError={isError}
            products={products}
            render={(items) => (
              <Carousel opts={{ align: "start" }}>
                <CarouselContent>
                  {items.map((product) => (
                    <CarouselItem
                      key={product.id}
                      className="sm:basis-1/2 md:basis-1/3 lg:basis-1/5"
                    >
                      <ProductCard product={product} />
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            )}
          />
        </motion.div>
      </div>
    </section>
  );
}

export const ProductCarousel = (props: { title?: string }) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: queryKeys.products,
    queryFn: async () => {
      const res = await api.get("/api/product");
      return res.data;
    },
  });

  const products = mapProducts(data);

  return (
    <section id="products-carousel" className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-[80px] sm:px-6 lg:px-8">
        <SectionHeader
          title={props.title ? props.title : "Produk Unggulan Kami"}
          subtitle="Katalog"
        />
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          <CarouselStates
            isLoading={isLoading}
            isError={isError}
            products={products}
            render={(items) => (
              <Carousel opts={{ align: "start" }}>
                <CarouselContent>
                  {items.map((product) => (
                    <CarouselItem
                      key={product.id}
                      className="sm:basis-1/2 md:basis-1/3 lg:basis-1/5"
                    >
                      <ProductCard product={product} />
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            )}
          />
        </motion.div>
      </div>
    </section>
  );
};
