
import { motion } from 'framer-motion';
import { BrushCleaning, LampCeiling, ThumbsUp, Users } from 'lucide-react';
import ReviewCard from './Card';

const ReviewPage = () => {
  return (
    <section
      id="review"
      className="border-b border-[#E5E7EB] bg-white"
    >
      <div className="mx-auto max-w-7xl px-4 py-[80px] sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="mb-[30px] text-left"
        >
          <p className="mb-2 text-xs font-normal uppercase tracking-[0.08em] text-[#6B6B6B]">
            Bukti
          </p>
          <h2 className="text-2xl font-bold leading-[1.21] text-black md:text-[32px] md:leading-[1.19]">
            Ulasan Pelanggan Kami
          </h2>
          <p className="mt-2 max-w-2xl text-base font-normal leading-[1.5] text-[#6B6B6B]">
            Informasi dari pelanggan yang telah menggunakan produk dan jasa
            kami.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="grid grid-cols-2 gap-4 md:grid-cols-4"
        >
          <ReviewCard title="Produk Terjual" content="2,5jt">
            <LampCeiling className="text-black" />
          </ReviewCard>
          <ReviewCard title="Jasa Cuci Lampu" content="6,5rb+">
            <BrushCleaning className="text-black" />
          </ReviewCard>
          <ReviewCard title="Pelanggan Kami" content="9rb+">
            <Users className="text-black" />
          </ReviewCard>
          <ReviewCard title="Ulasan Positif" content="2rb+">
            <ThumbsUp className="text-black" />
          </ReviewCard>
        </motion.div>
      </div>
    </section>
  );
}

export default ReviewPage;
