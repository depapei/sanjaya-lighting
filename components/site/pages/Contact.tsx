import { motion } from "framer-motion";
import { MessageCircleMore } from "lucide-react";
import Link from "next/link";
import Address from "./Address";

const ContactPage = () => {
  return (
    <section
      id="contact"
      className="relative min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-gray-50 overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-amber-100 rounded-full blur-3xl opacity-20" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gray-200 rounded-full blur-3xl opacity-20" />
      </div>

      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        <div className="text-center max-w-4xl mx-auto">
          {/* Main heading */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-gray-900 mb-6">
              Kontak
            </h1>
          </motion.div>

          {/* Subtitle */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-sm md:text-lg text-gray-600 mb-6 max-w-7xl mx-auto"
          >
            <p className="text-gray-600 leading-relaxed">
              Sanjaya Lighting adalah perusahaan lampu terpercaya yang berdiri
              sejak tahun 2004. Selama lebih dari 15 tahun, kami dikenal sebagai
              salah satu merek lampu terkemuka di Indonesia, menyediakan produk
              berkualitas tinggi untuk rumah dan bisnis.
            </p>
          </motion.div>

          {/* Address */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-start mb-6"
          >
            <Address />
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-start mb-6"
          >
            {/* Whatsapp contact */}
            <Link
              href="/#contact"
              className="group px-8 py-4 bg-green-500 text-gray-600 rounded-md font-medium hover:bg-green-400 transition-all flex items-center gap-2"
            >
              Whatsapp
              <MessageCircleMore className="w-5 h-5" />
            </Link>

            {/* <Link
              href="/#contact"
              className="group px-8 py-4 bg-gray-900 text-white rounded-md font-medium hover:bg-gray-800 transition-all flex items-center gap-2"
            >
              Alamat Toko
              <MapPin className="w-5 h-5" />
            </Link> */}
            {/* <Link
              href='/about'
              className='px-8 py-4 border-2 border-gray-900 text-gray-900 rounded-md font-medium hover:bg-gray-900 hover:text-white transition-all'
            >
              Learn More
            </Link> */}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactPage;
