'use client';

import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { motion } from 'framer-motion';
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

interface ProductCarouselProps {
  products: Product[];
  isLoading?: boolean;
  isError?: boolean;
}

export default function ProductCarousel({ products, isLoading, isError }: ProductCarouselProps) {
  return (

    <section id='products' className='bg-gray-50'>
      <div className='bg-white overflow-hidden'>
        <div className='text-center max-w-7xl mx-auto'>
          <div className='py-20 bg-white'>
            <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
              {/* Section Header */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className='text-center mb-16'
              >
                <h2 className='text-4xl md:text-5xl font-bold text-gray-900 mb-4'>
                  Our Product Showcase
                </h2>
                <p className='text-xl text-gray-600 max-w-2xl mx-auto'>
                  Handpicked selection of our most exquisite lighting pieces
                </p>
              </motion.div>

              {/* Products Carousel */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                { !isLoading && (
                  <Carousel
                    opts={{
                      align: "start",
                    }}
                  >
                      <CarouselContent>
                        { products.map((product, index) => (
                          <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                              <div className='aspect-square max-w-full'>
                                  <img
                                    src={product.images[0]}
                                    alt='Luxury Lighting'
                                    className='w-full h-full object-cover'
                                  />
                              </div>
                          </CarouselItem>
                        ))}
                      </CarouselContent>
                    <CarouselPrevious />
                    <CarouselNext />
                  </Carousel>
                )}

              {/* Show loading while waiting for data */}
              { isLoading && (
                <Carousel
                  opts={{
                    align: "start",
                  }}
                >
                  <CarouselContent>
                    {[1, 2, 3].map((_, index) => (
                      <CarouselItem
                        key={index}
                        className="md:basis-1/2 lg:basis-1/3"
                      >
                        <div className="aspect-square max-w-full">
                          <Skeleton className="h-full w-full bg-gray-400 flex justify-center items-center text-white text-xl">
                            Loading Products ...
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
