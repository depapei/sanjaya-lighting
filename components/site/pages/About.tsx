import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const AboutPage = () => {
  return (
    <section
      className="border-b border-[#E5E7EB] bg-white"
      id="about"
    >
      <div className="mx-auto max-w-7xl px-4 py-[80px] sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-[50px] lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            <p className="mb-2 text-xs font-normal uppercase tracking-[0.08em] text-[#6B6B6B]">
              Tentang Kami
            </p>
            <h2 className="mb-4 text-2xl font-bold leading-[1.21] tracking-[0px] text-black md:text-[32px] md:leading-[1.19]">
              Siapa kami?{" "}
              <span className="block">Sanjaya Lighting</span>
            </h2>

            <p className="mb-4 max-w-xl text-base font-normal leading-[1.5] text-[#333333]">
              Sanjaya Lighting adalah toko perlengkapan elektrik dan aksesoris
              rumah tangga. Kami membantu pelanggan menemukan lampu hemat
              energi dan aksesorisnya dengan harga terjangkau. Berlokasi di
              Kebon Jeruk, Jakarta Barat, kami menawarkan produk asli
              berkualitas, termasuk lampu hias, LED, PLC, dan TLD.
            </p>
            <p className="mb-[30px] max-w-xl text-base font-normal leading-[1.5] text-[#333333]">
              Selain menjual berbagai lampu hias, Sanjaya Lighting juga
              menyediakan jasa cuci lampu hias dan kristal di Jakarta dengan
              tenaga ahli berpengalaman.
            </p>

            <Link
              href="/#contact"
              className="inline-flex h-9 items-center gap-2 rounded-sm border border-black bg-transparent px-4 text-base font-normal text-black transition-colors hover:bg-black hover:text-white"
            >
              Hubungi Kami
              <ArrowDown className="h-4 w-4" />
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="overflow-hidden rounded-md border border-[#E5E7EB] bg-[#F6F6F6]"
          >
            <Image
              src="/assets/image/store-pic.jpg"
              alt="Toko Sanjaya Lighting"
              height={700}
              width={620}
              className="aspect-[4/3] w-full object-cover"
            />
            <div className="flex items-center justify-between border-t border-[#E5E7EB] bg-white px-4 py-4">
              <p className="text-sm font-normal text-black">Toko Kami</p>
              <p className="text-xs font-normal text-[#6B6B6B]">
                Kebon Jeruk, Jakarta Barat
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutPage;
