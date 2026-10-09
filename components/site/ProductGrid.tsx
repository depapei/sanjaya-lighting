'use client';

import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

interface Product {
  id: string;
  name: string;
  slug: string;
  images: string[];
  category: string;
  description: string;
}

interface ProductGridProps {
  products: Product[];
}

export default function ProductGrid({ products }: ProductGridProps) {
  return (
    <section id='products' className='border-b border-[#E5E7EB] bg-white'>
      <div className='mx-auto max-w-7xl px-4 py-[80px] sm:px-6 lg:px-8'>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className='mb-[30px] text-left'
        >
          <p className='mb-2 text-xs font-normal uppercase tracking-[0.08em] text-[#6B6B6B]'>
            Pilihan Editor
          </p>
          <h2 className='text-2xl font-bold leading-[1.21] text-black md:text-[32px] md:leading-[1.19]'>
            Featured Collection
          </h2>
          <p className='mt-2 max-w-2xl text-base font-normal leading-[1.5] text-[#6B6B6B]'>
            Handpicked selection of our most exquisite lighting pieces
          </p>
        </motion.div>

        <div className='grid grid-cols-1 gap-[30px] lg:grid-cols-2'>
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.2) }}
            >
              <Link href={`/products/${product.slug}`}>
                <div className='group cursor-pointer'>
                  <div className='relative aspect-square overflow-hidden rounded-md border border-[#E5E7EB] bg-[#F6F6F6]'>
                    <img
                      src={product.images[0] || 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=600&q=80'}
                      alt={product.name}
                      className='h-full w-full object-cover'
                    />
                    <div className='absolute left-4 top-4 rounded-full border border-[#E5E7EB] bg-white px-3 py-1.5 text-xs font-normal text-black'>
                      {product.category}
                    </div>
                  </div>

                  <div className='flex items-start justify-between gap-2 px-1 pt-4'>
                    <div className='space-y-1'>
                      <h3 className='text-lg font-semibold leading-[1.22] text-black group-hover:opacity-60'>
                        {product.name}
                      </h3>
                    </div>
                    <ArrowUpRight className='mt-1 h-4 w-4 shrink-0 text-black opacity-0 transition-opacity group-hover:opacity-100' />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {products.length === 0 && (
          <div className='rounded-md border border-[#E5E7EB] bg-white py-[50px] text-center'>
            <p className='text-base font-normal text-[#6B6B6B]'>No products available at the moment.</p>
          </div>
        )}
      </div>
    </section>
  );
}
