"use client";
import Loading from "@/components/admin/Loading";
import ProductCarousel from "@/components/site/ProductCarousel";
import api from "@/lib/axios";

import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ArrowLeft, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { notFound, useRouter } from "next/navigation";

export const dynamic = "force-dynamic";

interface ProductPageProps {
  params: {
    slug: string;
  };
}

export default function ProductPage({ params }: ProductPageProps) {
  // const [jsonLd, setJsonLd] = useState({
  //   "@context": "https://schema.org",
  //   "@type": "Product",
  //   offers: {
  //     "@type": "Offer",
  //   },
  // });

  const router = useRouter();

  const {
    data: product,
    isLoading,
    isError,
    isSuccess,
  } = useQuery({
    queryKey: [`product/${params.slug}`],
    queryFn: async () => {
      const res = await api.get(`/api/product/${params.slug}`);
      console.log(res.data);
      return res.data;
    },
  });
  // return;

  if (isLoading) {
    return <Loading />;
  }

  if (isError || !product) {
    return notFound();
  }

  // JSON-LD Schema for SEO
  // useEffect(() => {
  //   setJsonLd ({
  //     "@context": "https://schema.org",
  //     "@type": "Product",
  //     name: product.Name,
  //     description: product.Description,
  //     image: product.ImageBase64,
  //     offers: {
  //       "@type": "Offer",
  //       price: product.price,
  //       priceCurrency: "IDR",
  //       availability: "https://schema.org/InStock",
  //     },
  //   });
  // }, [isSuccess])

  return (
    <>
      <script
        type="application/ld+json"
        // dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <article className="min-h-screen pt-24 pb-16 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            {/* Back Button */}
            <Link
              href={""}
              onClick={() => router.back()}
              className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Back
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Images */}
              <div className="space-y-4">
                <div className="aspect-square bg-gray-100 rounded-2xl overflow-hidden">
                  <img
                    src={`data:image/jpeg;base64,${product.ImageBase64}`}
                    alt={product.Name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Thumbnail images */}
                {/* <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    src={`data:image/jpeg;base64,${product.ImageBase64}`}
                    alt={`${product.Name} Picture`}
                    className="w-full h-full object-cover"
                  />
                </div> */}
              </div>

              {/* Product Details */}
              <div className="space-y-6">
                {/* Category */}
                {/* <div className="inline-block px-4 py-2 bg-amber-100 text-amber-800 rounded-full text-sm font-medium">
                  {product.category}
                </div> */}

                {/* Title */}
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
                  {product.Name}
                </h1>

                {/* Price */}
                {/* <div className="text-4xl font-bold text-gray-900">
                  Rp {parseFloat(product.Price).toLocaleString("id-ID")}
                </div> */}

                {/* Description */}
                <div className="prose prose-lg">
                  <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                    {product.Description}
                  </p>
                </div>

                {/* CTA Button */}
                <div className="pt-6">
                  <button className="w-full md:w-auto px-8 py-4 bg-gray-900 text-white rounded-md font-medium hover:bg-gray-800 transition-all flex items-center justify-center gap-2 hover:animate-pulse">
                    <ShoppingCart className="w-5 h-5" />
                    Contact for Purchase
                  </button>
                </div>

                {/* Product Info */}
                <div className="border-t border-gray-200 pt-6 space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Product ID:</span>
                    <span className="font-medium text-gray-900">
                      {product.ProductID}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Status:</span>
                    <span className="font-medium text-green-600">In Stock</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <hr className="border border-gray-800 mt-20 container mx-auto px-4 sm:px-6 lg:px-8" />
          <ProductCarousel title="Our Featured Collection" />
        </article>
      </motion.div>
    </>
  );
}
