
import { motion } from 'framer-motion';
import { BrushCleaning, LampCeiling, ThumbsUp, Users } from 'lucide-react';
import ReviewCard from './Card';

const ReviewPage = () => {
  return (
    <section
      id="review"
      className="relative flex items-center justify-center bg-gradient-to-b from-white to-gray-50 overflow-hidden mt-20"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-7xl mx-auto">
          {/* Main heading */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Ulasan Pelanggan Kami
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Informasi dari pelanggan yang telah menggunakan produk dan jasa
              kami.
            </p>
          </motion.div>

          {/* Subtitle */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-sm md:text-lg text-gray-600 max-w-7xl mx-auto"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 justify-center gap-6 mb-12">
              <ReviewCard title="Produk Terjual" content="2,5jt">
                <LampCeiling size={65} className="text-gray-200" />
              </ReviewCard>
              <ReviewCard title="Jasa Cuci Lampu" content="6,5rb+">
                <BrushCleaning size={65} className="text-gray-200" />
              </ReviewCard>
              <ReviewCard title="Pelanggan Kami" content="9rb+">
                <Users size={65} className="text-gray-200" />
              </ReviewCard>
              <ReviewCard title="Ulasan Positif" content="2rb+">
                <ThumbsUp size={65} className="text-gray-200" />
              </ReviewCard>
            </div>
          </motion.div>

          {/* CTA Buttons */}
          {/* <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className='flex flex-col sm:flex-row gap-4 justify-center items-center'
          >
            <Link
              href='/#contact'
              className='group px-8 py-4 bg-green-500 text-gray-600 rounded-md font-medium hover:bg-green-400 transition-all flex items-center gap-2'
            >
              Whatsapp
              <MessageCircleMore className='w-5 h-5' />
            </Link>
            <Link
              href='/#contact'
              className='group px-8 py-4 bg-gray-900 text-white rounded-md font-medium hover:bg-gray-800 transition-all flex items-center gap-2'
            >
              Alamat Toko
              <MapPin className='w-5 h-5 group-hover:translate-x-1 transition-transform' />
            </Link>
            <Link
              href='/about'
              className='px-8 py-4 border-2 border-gray-900 text-gray-900 rounded-md font-medium hover:bg-gray-900 hover:text-white transition-all'
            >
              Learn More
            </Link>
          </motion.div> */}
        </div>
      </div>
    </section>
  );
}

export default ReviewPage;