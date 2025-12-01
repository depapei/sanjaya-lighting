'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  images: string[];
  category: string;
  description: string;
}

interface ProductGridProps {
  products: Product[];
}

export default function ProductGrid({ products }: ProductGridProps) {
  return (
    <section id='products' className='py-20 bg-white'>
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
            Featured Collection
          </h2>
          <p className='text-xl text-gray-600 max-w-2xl mx-auto'>
            Handpicked selection of our most exquisite lighting pieces
          </p>
        </motion.div>

        {/* Products Grid */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Link href={`/products/${product.slug}`}>
                <div className='group cursor-pointer'>
                  {/* Image Container */}
                  <div className='relative aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4'>
                    <img
                      src={product.images[0] || 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=600&q=80'}
                      alt={product.name}
                      className='w-full h-full object-cover transition-transform duration-500 group-hover:scale-110'
                    />
                    
                    {/* Overlay on hover */}
                    <div className='absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300' />
                    
                    {/* Category badge */}
                    <div className='absolute top-4 left-4 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium text-gray-900'>
                      {product.category}
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className='space-y-2'>
                    <h3 className='text-lg font-semibold text-gray-900 group-hover:text-amber-600 transition-colors'>
                      {product.name}
                    </h3>
                    <p className='text-2xl font-bold text-gray-900'>
                      Rp {product.price.toLocaleString('id-ID')}
                    </p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {products.length === 0 && (
          <div className='text-center py-20'>
            <p className='text-xl text-gray-500'>No products available at the moment.</p>
          </div>
        )}
      </div>
    </section>
  );
}
