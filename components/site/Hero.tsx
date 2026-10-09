"use client";

import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";
import Link from "next/link";

type HeroProps = {
  children?: React.ReactNode;
};

export default function Hero(props: HeroProps) {
  const { children } = props;

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-gray-50 overflow-hidden">
      {/* Background decoration */}

      {/* Gambar hero utama */}
      <img
        src="/assets/image/store-pic.jpg"
        alt="Toko Sanjaya – Toko kelontong terpercaya sejak 1990"
        className="absolute inset-0 w-full h-full object-cover object-center"
      />
      <div className="absolute inset-0 bg-black bg-opacity-40"></div>

      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        <div className="text-center max-w-4xl mx-auto">
          {/* Additional Content */}
          {children}

          {/* Main heading */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-white mb-6">
              <span className="underline">Terangi</span> Ruang
              <span className="block mt-2 bg-gradient-to-r from-amber-600 to-amber-400 bg-clip-text text-transparent pb-4">
                Hidup Anda
              </span>
            </h1>
          </motion.div>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl text-white mb-12 max-w-2xl mx-auto"
          >
            Temukan koleksi pilihan lampu dekoratif mewah kami. Setiap produk
            dibuat untuk mengubah ruang Anda menjadi sebuah mahakarya yang
            elegan.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Link
              href="/#products"
              className="group px-8 py-4 bg-black text-white rounded-md font-medium hover:bg-gray-950 transition-all flex items-center gap-2"
            >
              Jelajahi koleksi
              <ArrowDown className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="#contact"
              className="px-8 py-4 bg-gradient-to-r from-amber-600 to-amber-400 text-white rounded-md font-medium hover:bg-gray-900 hover:text-white transition-all"
            >
              Hubungi Kami
            </Link>
          </motion.div>

          {/* Featured Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="mt-16 relative"
          >
            {/* <div className='aspect-video max-w-3xl mx-auto rounded-2xl overflow-hidden shadow-2xl'>
              <img
                src='https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=1200&q=80'
                alt='Luxury Lighting'
                className='w-full h-full object-cover'
              />
            </div> */}

            {/* Decorative elements */}
            <div className="absolute -top-6 -left-6 w-24 h-24 bg-amber-400 rounded-full blur-2xl opacity-30" />
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-gray-400 rounded-full blur-2xl opacity-20" />
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center"
        >
          <motion.div className="w-1 h-3 bg-gray-400 rounded-full mt-2" />
        </motion.div>
      </motion.div>
    </section>
  );
}
