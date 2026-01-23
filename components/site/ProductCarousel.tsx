"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import api from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Skeleton } from "../ui/skeleton";

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  images: string;
  category: string;
  description: string;
}

export default function FeaturedProductCarousel(props: { title?: string }) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["featured-products"],
    queryFn: async () => {
      const res = await api.get("/api/featured-product");
      return res.data;
    },
  });

  const products: Product[] = Array.isArray(data)
    ? data.map((product) => ({
        id: product.ProductID,
        name: product.Name,
        description: product.Description || "",
        slug: product.ProductID,
        price: parseInt(product.Price),
        images: `data:image/jpeg;base64,${product.ImageBase64}`,
        category: product.Category || "Uncategorized",
      }))
    : [];

  const router = useRouter();
  return (
    <section id="products" className="bg-gray-50">
      <div className="bg-white overflow-hidden">
        <div className="text-center max-w-7xl mx-auto">
          <div className="py-20 bg-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              {/* Section Header */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-center mb-16"
              >
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                  {props.title ? props.title : "Produk Unggulan Kami"}
                </h2>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                  Koleksi pilihan pencahayaan unggulan kami.
                </p>
              </motion.div>

              {/* Products Carousel */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                {!isLoading && !isError && (
                  <Carousel
                    opts={{
                      align: "start",
                    }}
                  >
                    <CarouselContent>
                      {products.map((product, index) => (
                        <CarouselItem
                          key={index}
                          className="sm:basis-1/2 md:basis-1/3 lg:basis-1/5 hover:cursor-pointer hover:animate-pulse hover:scale-95 transition-all"
                          onClick={() => {
                            router.push(`/products/${product.id}`);
                          }}
                        >
                          <div className="aspect-[2/3] max-w-full">
                            <img
                              src={product.images}
                              alt="Luxury Lighting"
                              className="w-full h-full object-cover rounded-xl"
                            />
                            <p className="text-start text-lg text-gray-700">
                              {product.name}
                            </p>
                            <p className="text-start text-sm font-semibold text-gray-600">
                              {product.category}
                            </p>
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <CarouselPrevious />
                    <CarouselNext />
                  </Carousel>
                )}

                {/* Show loading while waiting for data */}
                {isLoading && (
                  <Carousel
                    opts={{
                      align: "start",
                    }}
                  >
                    <CarouselContent>
                      {[1, 2, 3, 4, 5].map((_, index) => (
                        <CarouselItem
                          key={index}
                          className="sm:basis-1/2 md:basis-1/3 lg:basis-1/5"
                        >
                          <div className="aspect-[2/3] max-w-full">
                            <Skeleton className="h-full w-full bg-gray-400 flex justify-center items-center text-white text-xl">
                              <p className="animate-pulse">
                                Loading Products ...
                              </p>
                            </Skeleton>
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>

                    <CarouselPrevious />
                    <CarouselNext />
                  </Carousel>
                )}

                {/* Show error if api call is failed */}
                {isError && (
                  <div id="loading" className="max-w-7xl">
                    <Skeleton className="h-52 w-full bg-gray-400 text-center text-white text-xl flex justify-center items-center">
                      Error while loading the products ...
                    </Skeleton>
                  </div>
                )}

                {products.length === 0 && !isLoading && !isError && (
                  <div className="text-center py-20">
                    <p className="text-xl text-gray-500">
                      No products available at the moment.
                    </p>
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export const ProductCarousel = (props: { title?: string }) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["products"],
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
        price: parseInt(product.Price),
        images: `data:image/jpeg;base64,${product.ImageBase64}`,
        category: product.Category || "Uncategorized",
      }))
    : [];

  const router = useRouter();
  return (
    <section id="products" className="bg-gray-50">
      <div className="bg-white overflow-hidden">
        <div className="text-center max-w-7xl mx-auto">
          <div className="py-20 bg-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              {/* Section Header */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-center mb-16"
              >
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                  {props.title ? props.title : "Produk Unggulan Kami"}
                </h2>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                  Koleksi pilihan pencahayaan unggulan kami.
                </p>
              </motion.div>

              {/* Products Carousel */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                {!isLoading && !isError && (
                  <Carousel
                    opts={{
                      align: "start",
                    }}
                  >
                    <CarouselContent>
                      {products.map((product, index) => (
                        <CarouselItem
                          key={index}
                          className="sm:basis-1/2 md:basis-1/3 lg:basis-1/5 hover:cursor-pointer hover:animate-pulse hover:scale-95 transition-all"
                          onClick={() => {
                            router.push(`/products/${product.id}`);
                          }}
                        >
                          <div className="aspect-[2/3] max-w-full">
                            <img
                              src={product.images}
                              alt="Luxury Lighting"
                              className="w-full h-full object-cover rounded-xl"
                            />
                            <p className="text-start text-lg text-gray-700">
                              {product.name}
                            </p>
                            <p className="text-start text-sm font-semibold text-gray-600">
                              {product.category}
                            </p>
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <CarouselPrevious />
                    <CarouselNext />
                  </Carousel>
                )}

                {/* Show loading while waiting for data */}
                {isLoading && (
                  <Carousel
                    opts={{
                      align: "start",
                    }}
                  >
                    <CarouselContent>
                      {[1, 2, 3, 4, 5].map((_, index) => (
                        <CarouselItem
                          key={index}
                          className="sm:basis-1/2 md:basis-1/3 lg:basis-1/5"
                        >
                          <div className="aspect-[2/3] max-w-full">
                            <Skeleton className="h-full w-full bg-gray-400 flex justify-center items-center text-white text-xl">
                              <p className="animate-pulse">
                                Loading Products ...
                              </p>
                            </Skeleton>
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>

                    <CarouselPrevious />
                    <CarouselNext />
                  </Carousel>
                )}

                {/* Show error if api call is failed */}
                {isError && (
                  <div id="loading" className="max-w-7xl">
                    <Skeleton className="h-52 w-full bg-gray-400 text-center text-white text-xl flex justify-center items-center">
                      Error while loading the products ...
                    </Skeleton>
                  </div>
                )}

                {products.length === 0 && !isLoading && !isError && (
                  <div className="text-center py-20">
                    <p className="text-xl text-gray-500">
                      No products available at the moment.
                    </p>
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
