"use client";

import api from "@/lib/axios";
import { queryKeys } from "@/lib/queryKeys";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";

type HeroProps = {
  children?: React.ReactNode;
};

interface ApiProduct {
  ProductID: string;
  Name: string;
  Description?: string | null;
  ImageBase64?: string | null;
  Category?: string | null;
}

interface HeroPanel {
  category: string;
  productId: string;
  productName: string;
  description: string;
  image: string;
  alt: string;
}

const STORE_IMAGE = "/assets/image/store-pic.jpg";

function stripHtml(value?: string | null): string {
  if (!value) return "";
  return value
    .replace(/<[^>]+>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export default function Hero({ children }: HeroProps) {
  const { data, isLoading, isError } = useQuery({
    queryKey: queryKeys.products,
    queryFn: async () => {
      const res = await api.get("/api/product");
      return res.data as ApiProduct[];
    },
  });

  const panels: HeroPanel[] = useMemo(() => {
    if (!Array.isArray(data)) return [];
    const byCategory = new Map<string, ApiProduct[]>();
    for (const product of data) {
      const key = (product.Category || "Lainnya").trim() || "Lainnya";
      if (!byCategory.has(key)) byCategory.set(key, []);
      byCategory.get(key)!.push(product);
    }
    const grouped: Array<{ category: string; items: ApiProduct[] }> = [];
    byCategory.forEach((items, category) => {
      grouped.push({ category, items });
    });
    return grouped
      .sort((a, b) => b.items.length - a.items.length)
      .slice(0, 3)
      .map(({ category, items }) => {
        const rep = items[0];
        const clean = stripHtml(rep.Description).slice(0, 110);
        return {
          category,
          productId: rep.ProductID,
          productName: rep.Name,
          description: clean ? `${clean}...` : "",
          image: rep.ImageBase64
            ? `data:image/jpeg;base64,${rep.ImageBase64}`
            : STORE_IMAGE,
          alt: `${rep.Name} — ${category}`,
        };
      });
  }, [data]);

  const showFallback = !isLoading && (isError || panels.length === 0);

  return (
    <section
      aria-labelledby="hero-heading"
      className="border-b border-[#E5E7EB] bg-white"
    >

      {showFallback ? (
        <div className="relative border-t border-[#E5E7EB] bg-black">
          <img
            src={STORE_IMAGE}
            alt="Toko Sanjaya Lighting — toko lampu hias di Jakarta"
            className="h-[62vh] w-full object-cover object-center lg:h-[74vh]"
          />
          <div aria-hidden className="absolute inset-0 bg-black/20" />
          <div className="absolute inset-x-0 bottom-0 bg-black/45 p-5 backdrop-blur-md">
            <p className="text-lg font-semibold leading-[1.22] text-white">
              Kunjungi toko kami
            </p>
            <p className="mt-2 max-w-md text-sm font-normal leading-[1.43] text-white/70">
              Koleksi sedang dimuat. Lihat pilihan lampu hias di katalog.
            </p>
            <Link
              href="/#koleksi"
              className="mt-4 inline-flex h-9 w-fit items-center rounded-[4px] border border-white bg-transparent px-4 text-base font-normal text-white transition-colors hover:bg-white hover:text-black"
            >
              Jelajahi koleksi
            </Link>
          </div>
        </div>
      ) : (
        <div className="border-t border-[#E5E7EB] bg-black">
          <div className="flex flex-col lg:flex-row">
            {isLoading
              ? [0, 1, 2].map((n) => (
                  <div
                    key={n}
                    aria-hidden
                    className={cn(
                      "min-h-[62vh] flex-1 animate-pulse bg-[#F6F6F6] lg:min-h-[74vh]",
                      n > 0 && "hidden lg:block",
                    )}
                  />
                ))
              : panels.map((panel, index) => (
                  <Link
                    key={panel.category}
                    href={`/products/${panel.productId}`}
                    aria-label={`Lihat koleksi ${panel.category} — ${panel.productName}`}
                    className="group relative block min-h-[62vh] flex-1 overflow-hidden border-t border-white/20 bg-black first:border-t-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white lg:min-h-[74vh] lg:border-l lg:border-t-0 lg:first:border-l-0"
                  >
                    <img
                      src={panel.image}
                      alt={panel.alt}
                      loading={index === 0 ? "eager" : "lazy"}
                      className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.03] motion-reduce:transform-none motion-reduce:transition-none"
                    />
                    <div aria-hidden className="absolute inset-0 bg-black/20" />

                    <div
                      aria-hidden
                      className="absolute inset-x-0 bottom-0 flex items-center justify-between px-5 py-4 transition-opacity duration-300 motion-reduce:transition-none lg:group-hover:opacity-0 lg:group-focus-within:opacity-0"
                    >
                      <p className="text-base font-normal text-white">
                        {panel.category}
                      </p>
                      <ArrowUpRight className="h-4 w-4 text-white" />
                    </div>

                    <div className="absolute inset-0 flex flex-col justify-end bg-black/45 p-5 backdrop-blur-md transition-opacity duration-300 motion-reduce:transition-none lg:opacity-0 lg:group-hover:opacity-100 lg:group-focus-within:opacity-100 [@media(hover:none)]:opacity-100">
                      <p className="mb-2 text-sm font-normal text-white/60">
                        {panel.category}
                      </p>
                      <p className="text-lg font-semibold leading-[1.22] text-white">
                        {panel.productName}
                      </p>
                      {panel.description ? (
                        <p className="mt-2 max-w-md text-sm font-normal leading-[1.43] text-white/70">
                          {panel.description}
                        </p>
                      ) : null}
                      <span className="mt-4 inline-flex h-9 w-fit items-center rounded-[4px] border border-white bg-transparent px-4 text-base font-normal text-white transition-colors group-hover:bg-white group-hover:text-black">
                        Lihat koleksi
                      </span>
                    </div>
                  </Link>
                ))}
          </div>
        </div>
      )}
      
      <div className="mx-auto max-w-7xl px-4 py-[50px] sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-[30px] lg:grid-cols-2 lg:items-end">
          <div>
            {children}
            <h1
              id="hero-heading"
              className="max-w-xl text-[32px] font-bold leading-[1.19] tracking-[0px] text-black"
            >
              Lampu hias pilihan di Jakarta
            </h1>
          </div>
          <div className="lg:justify-self-end">
            <p className="max-w-md text-base font-normal leading-[1.5] text-[#6B6B6B]">
              Kristal, pendant, dan downlight asli dari Kebon Jeruk untuk ruang
              yang tenang.
            </p>
            <Link
              href="/#koleksi"
              className="mt-[16px] inline-flex h-9 items-center rounded-[4px] border border-black bg-transparent px-4 text-base font-normal text-black transition-colors hover:bg-black hover:text-white"
            >
              Jelajahi koleksi
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
