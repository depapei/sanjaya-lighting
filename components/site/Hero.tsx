"use client";

import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import Link from "next/link";

type HeroProps = {
  children?: React.ReactNode;
};

export default function Hero(props: HeroProps) {
  const { children } = props;

  return (
    <section className="relative overflow-hidden border-b border-[#E5E7EB] bg-white pt-[129px]">
      <img
        src="/assets/image/store-pic.jpg"
        alt="Toko Sanjaya Lighting — toko lampu hias di Jakarta"
        className="absolute inset-0 h-full w-full object-cover object-center"
      />
      <div className="absolute inset-0 bg-black/25" />

      <div className="relative flex min-h-[85vh] items-center justify-center px-4 py-[80px] sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-xl rounded-[8px] border border-[#E5E7EB] bg-white/80 backdrop-blur-sm p-[16px] text-center md:p-[30px]"
        >
          {children}

          <h1 className="text-[32px] font-bold leading-[1.19] tracking-[0px] text-black">
            Terangi Ruang Hidup Anda
          </h1>

          <p className="mx-auto mt-[16px] text-base font-normal leading-relaxed text-[#6B6B6B]">
            Koleksi lampu dekoratif pilihan untuk ruang yang tenang.
          </p>

          <div className="mt-[30px] flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/#products"
              className="group inline-flex h-9 items-center gap-2 rounded-[4px] border border-black bg-transparent px-4 text-base font-normal text-black transition-colors hover:bg-black hover:text-white"
            >
              Jelajahi koleksi
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="#contact"
              className="group inline-flex h-9 items-center gap-2 rounded-[4px] border border-black bg-transparent px-4 text-base font-normal text-black transition-colors hover:bg-black hover:text-white"
            >
              Hubungi Kami
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
