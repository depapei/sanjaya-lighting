import { ProductModel } from '@/lib/models';
import { ArrowLeft, ShoppingCart } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

interface ProductPageProps {
  params: {
    slug: string;
  };
}

// interface Product {
//   id: string;
//   name: string;
//   slug: string;
//   price: number;
//   images: string[];
//   category: string;
//   description: string;
// };

interface OgImage {
  url: string;
  width?: number;
  height?: number;
  type?: string;
}

async function getProduct(slug: string) {
  try {
    const product = await ProductModel.findBySlug(slug);
    return product;
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

export async function generateMetadata({params}: ProductPageProps): Promise<Metadata> {
  const product = await getProduct(params.slug);
  // const product = products;
  
  if (!product) {
    return {
      title: 'Product Not Found',
    };
  }

  return {
    title: `${product.name} - Sanjaya Lighting`,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: product.images,
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await getProduct(params.slug);

  if (!product) {
    notFound();
  };

  // JSON-LD Schema for SEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.images,
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: 'IDR',
      availability: 'https://schema.org/InStock',
    },
  };

  return (
    <>
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <article className='min-h-screen pt-24 pb-16 bg-white'>
        <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
          {/* Back Button */}
          <Link
            href='/#products'
            className='inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-8 transition-colors'
          >
            <ArrowLeft className='w-5 h-5' />
            Back to Products
          </Link>

          <div className='grid grid-cols-1 lg:grid-cols-2 gap-12'>
            {/* Images */}
            <div className='space-y-4'>
              <div className='aspect-square bg-gray-100 rounded-2xl overflow-hidden'>
                <img
                  src={product.images[0] || 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=800&q=80'}
                  alt={product.name}
                  className='w-full h-full object-cover'
                />
              </div>
              
              {/* Thumbnail images */}
              {product.images.length > 1 && (
                <div className='grid grid-cols-4 gap-4'>
                  {product.images.slice(1, 5).map((image: OgImage, index: number) => (
                    <div key={index} className='aspect-square bg-gray-100 rounded-lg overflow-hidden'>
                      <img
                        src={image.url}
                        alt={`${product.name} ${index + 2}`}
                        className='w-full h-full object-cover'
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Product Details */}
            <div className='space-y-6'>
              {/* Category */}
              <div className='inline-block px-4 py-2 bg-amber-100 text-amber-800 rounded-full text-sm font-medium'>
                {product.category}
              </div>

              {/* Title */}
              <h1 className='text-4xl md:text-5xl font-bold text-gray-900'>
                {product.name}
              </h1>

              {/* Price */}
              <div className='text-4xl font-bold text-gray-900'>
                Rp {product.price.toLocaleString('id-ID')}
              </div>

              {/* Description */}
              <div className='prose prose-lg'>
                <p className='text-gray-600 leading-relaxed'>{product.description}</p>
              </div>

              {/* CTA Button */}
              <div className='pt-6'>
                <button className='w-full md:w-auto px-8 py-4 bg-gray-900 text-white rounded-md font-medium hover:bg-gray-800 transition-all flex items-center justify-center gap-2'>
                  <ShoppingCart className='w-5 h-5' />
                  Contact for Purchase
                </button>
              </div>

              {/* Product Info */}
              <div className='border-t border-gray-200 pt-6 space-y-4'>
                <div className='flex justify-between text-sm'>
                  <span className='text-gray-600'>Product ID:</span>
                  <span className='font-medium text-gray-900'>{product.id}</span>
                </div>
                <div className='flex justify-between text-sm'>
                  <span className='text-gray-600'>Status:</span>
                  <span className='font-medium text-green-600'>In Stock</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </article>
    </>
  );
}
