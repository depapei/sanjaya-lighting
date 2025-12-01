'use client';

import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Lamp } from 'lucide-react';
import { BentoCard, BentoGrid } from '../magicui/bento-grid';
import { Skeleton } from '../ui/skeleton';

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  images: string[];
  category: string;
  description: string;
}

interface ProductBentoProps {
  products: Product[];
  isLoading?: boolean;
  isError?: boolean;
}

export default function ProductBento({ products, isLoading, isError }: ProductBentoProps) {
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
      className={`rounded-xl bg-gray-200 dark:bg-neutral-800 animate-pulse ${className}`}
    />
  );
  return (

    <section id='products' className=' bg-gradient-to-b from-gray-50 to-white'>
      <div className='bg-white overflow-hidden'>
        <div className='text-center max-w-full mx-auto'>
          <div className='py-20 bg-white'>
            <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
              {/* Section Header */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className='text-start mb-8 flex flex-col gap-0'
              >
                <h2 className='text-2xl font-bold text-gray-900 underline'>
                  Koleksi
                </h2>
                <p className='text-4xl md:text-5xl text-gray-600 max-w-5xl'>
                  Koleksi pilihan dari produk lampu kami yang paling indah dan premium.
                </p>
              </motion.div>

              {/* Products Bento */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                { !isLoading && (
                  <BentoGrid className="grid-cols-3">
                    {products.map((product, index) => (
                      <BentoCard
                        key={product.slug}
                        name={product.name}
                        description={
                          product.description
                            ?.replace(/<[^>]+>/g, "")
                            .slice(0, 100) + "..."
                        }
                        Icon={Lamp}
                        href={`/products/${product.slug}`}
                        cta="View Products"
                        background={
                          <img
                            src={product.images[0]}
                            className="absolute inset-0 h-full w-full object-cover"
                          />
                        }
                        className={cn(
                          `${spanClasses[index % spanClasses.length]}`
                        )}
                      />
                    ))}
                  </BentoGrid>
                )}

              {/* Show loading while waiting for data */}
              {isLoading && (
                <BentoGrid className="mt-10">
                  {spanClasses.map((span, index) => (
                    <BentoSkeleton key={index} className={span} />
                  ))}
                </BentoGrid>
              )}

              {/* Show error if api call is failed */}
              { isError && (
                  <div id='loading' className='max-w-7xl'>
                    <Skeleton className="h-52 w-full bg-gray-400 text-center text-white text-xl flex justify-center items-center">Error while loading the products   ...</Skeleton>
                  </div>
                )
              }

              {products.length === 0 && !isLoading && (
                <div className='text-center py-20'>
                  <p className='text-xl text-gray-500'>No products available at the moment.</p>
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
