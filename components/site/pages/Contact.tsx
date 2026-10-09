import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import Address from "./Address";

const ContactPage = () => {
  return (
    <section
      id="contact"
      className="bg-white"
    >
      <div className="mx-auto max-w-7xl px-4 py-[80px] sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="mb-[30px] max-w-2xl text-left"
        >
          <p className="mb-2 text-xs font-normal uppercase tracking-[0.08em] text-[#6B6B6B]">
            Kontak
          </p>
          <h2 className="mb-4 text-2xl font-bold leading-[1.21] text-black md:text-[32px] md:leading-[1.19]">
            Kunjungi atau hubungi kami
          </h2>
          <p className="text-base font-normal leading-[1.5] text-[#333333]">
            Sanjaya Lighting adalah perusahaan lampu terpercaya yang berdiri
            sejak tahun 2004. Selama lebih dari 15 tahun, kami dikenal sebagai
            salah satu merek lampu terkemuka di Indonesia.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="mb-[16px]"
        >
          <Address />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="flex flex-col gap-[6px] sm:flex-row"
        >
          <Link
            href="/#contact"
            className="inline-flex h-9 items-center justify-center gap-2 rounded-sm border border-black bg-transparent px-4 text-base font-normal text-black transition-colors hover:bg-black hover:text-white"
          >
            Chat WhatsApp
            <ArrowUpRight className="h-4 w-4" />
          </Link>
          <Link
            href="/#products"
            className="inline-flex h-9 items-center justify-center rounded-sm border border-[#E5E7EB] bg-transparent px-4 text-base font-normal text-black transition-colors hover:border-black hover:bg-black hover:text-white"
          >
            Lihat Produk
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default ContactPage;
