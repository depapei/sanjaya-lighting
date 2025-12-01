
import { motion } from 'framer-motion';
import { ArrowDown } from 'lucide-react';
import Link from 'next/link';

const AboutPage = () => {
  return (
    <section className='relative min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white overflow-hidden' id='about'>
      {/* Background decoration */}
      <div className='absolute inset-0 overflow-hidden'>
        <div className='absolute -bottom-40 -left-40 w-80 h-80 bg-gray-200 rounded-full blur-3xl opacity-20' />
        <div className='absolute -top-40 -right-40 w-80 h-80 bg-amber-100 rounded-full blur-3xl opacity-20' />
      </div>

      <div className='relative container mx-auto px-4 sm:px-6 lg:px-8 pt-20'>
        <div className='text-start max-w-7xl mx-auto'>
          {/* Main heading */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className='text-2xl md:text-4xl lg:text-6xl font-bold tracking-tight text-gray-900 mb-6'>
              Siapa <span className='underline'><Link href='/#home'>kami</Link></span>?
              <span className='text-5xl md:text-7xl lg:text-8xl block mt-2 bg-gradient-to-r from-amber-600 to-amber-400 bg-clip-text text-transparent pb-4'>
                Sanjaya Lighting
              </span>
            </h1>
          </motion.div>

          {/* Subtitle */}
          {/* <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className='text-sm md:text-lg text-gray-600 mb-12 max-w-7xl mx-auto'
          >
            <div className='mt-20'>
              <TextReveal text='merupakan toko online yang bergerak dibidang Elektrik perlengkapan Rumah Tangga beserta Aksesoris nya. Selain untuk memasarkan produk kami dalam jangkauan Daerah yang lebih luas, kami senantiasa siap membantu para Pelanggan untuk menemukan produk-produk berupa Lampu Hemat Energy dan aksesoris nya agar dapat lebih hemat pemakaian Listrik di rumah serta informasi-informasi seputar Lampu Hemat Energy secara ONLINE dengan harga yang TERJANGKAU dan BERSAING.'
              />
            </div>
          </motion.div> */}

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className='text-lg md:text-xl text-gray-600 mb-6 max-w-7xl mx-auto text-start'
          >
            Sanjaya Lighting adalah toko online perlengkapan elektrik dan aksesoris rumah tangga. Kami membantu pelanggan menemukan lampu hemat energi dan aksesorisnya dengan harga terjangkau. Berlokasi di Kebon Jeruk, Jakarta Barat, kami menawarkan produk asli berkualitas, termasuk lampu hias, LED, PLC, dan TLD.
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className='text-lg md:text-xl text-gray-600 mb-12 max-w-7xl mx-auto text-start'
          >
            Selain menjual berbagai lampu hias mewah, Sanjaya Lighting juga menyediakan jasa cuci lampu hias dan kristal di Jakarta dengan tenaga ahli berpengalaman. Kami juga menjadi distributor lampu hias berkualitas untuk rumah dan bisnis.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className='flex flex-col sm:flex-row gap-4 justify-start items-center'
          >
            <Link
              href='/#contact'
              className='group px-8 py-4 bg-gray-900 text-white rounded-md font-medium hover:bg-gray-800 transition-all flex items-center gap-2'
            >
              Hubungi Kami
              <ArrowDown className='w-5 h-5 group-hover:translate-x-1 transition-transform' />
            </Link>
            {/* <Link
              href='/about'
              className='px-8 py-4 border-2 border-gray-900 text-gray-900 rounded-md font-medium hover:bg-gray-900 hover:text-white transition-all'
            >
              Learn More
            </Link> */}
          </motion.div>

          {/* Featured Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            className='mt-16 relative'
          >
            {/* <div className='aspect-video max-w-3xl mx-auto rounded-2xl overflow-hidden shadow-2xl'>
              <img
                src='https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=1200&q=80'
                alt='Luxury Lighting'
                className='w-full h-full object-cover'
              />
            </div> */}

            {/* Decorative elements */}
            <div className='absolute -top-6 -left-6 w-24 h-24 bg-amber-400 rounded-full blur-2xl opacity-30' />
            <div className='absolute -bottom-6 -right-6 w-32 h-32 bg-gray-400 rounded-full blur-2xl opacity-20' />
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1 }}
        className='absolute bottom-8 left-1/2 transform -translate-x-1/2'
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className='w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center'
        >
          <motion.div className='w-1 h-3 bg-gray-400 rounded-full mt-2' />
        </motion.div>
      </motion.div>
    </section>
  );
}

export default AboutPage;