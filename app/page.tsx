"use client";
import Hero from "@/components/site/Hero";
import ProductBento from "@/components/site/ProductBento";
import ProductCarousel from "@/components/site/ProductCarousel";
import AboutPage from "@/components/site/pages/About";
import ContactPage from "@/components/site/pages/Contact";
import ReviewPage from "@/components/site/pages/reviews/Reviews";
import api from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

export const dynamic = "force-dynamic";

interface OgImage {
  url: string;
  width?: number;
  height?: number;
  type?: string;
}

export default function HomePage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const res = await api.get("/posts");
      return res.data;
    },
  });

  const products = Array.isArray(data)
    ? data.map((post) => ({
        id: post.id,
        name: post.title?.rendered,
        description: post.excerpt?.rendered || "",
        slug: post.slug,
        price: 0, // kalau ada harga dari ACF, kasih tau nanti aku integrasikan
        images:
          post.yoast_head_json?.og_image?.map((img: OgImage) => img.url) || [],
        category: post.category || "Uncategorized",
      }))
    : [];

  return (
    <>
      <Hero />
      <ProductBento
        products={products}
        isLoading={isLoading}
        isError={isError}
      />
      <ProductCarousel
        products={products}
        isLoading={isLoading}
        isError={isError}
      />
      <div className="mt-20">
        <ReviewPage />
      </div>
      <AboutPage />
      <ContactPage />

      {/* <div>
        <pre>
          {JSON.stringify(data[0]?.yoast_head_json.og_title, null, 2)}
        </pre>
      </div> */}
      {/* <Hero /> */}

      {/* {
        isLoading || !isSuccess ?
        <section id='loading' className='py-20 bg-white'>
          <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
            <div className="space-y-3">
              <Skeleton className="h-24 w-full bg-gray-400 text-center text-white text-xl flex justify-center items-center">Loading Products   ...</Skeleton>
              <Skeleton className="h-4 w-full bg-gray-400" />
              <Skeleton className="h-4 w-full bg-gray-400" />
            </div>
          </div>
        </section>
        :
        <>
          <ProductGrid products={products} />
        </>
      } */}
    </>
  );
}
