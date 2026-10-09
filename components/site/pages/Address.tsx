import { motion } from "framer-motion";
import EmbedMap from "./EmbedMap";

type addressType = {
  type: string;
  data: string;
};

const Address = () => {
  const dataAddress: addressType[] = [
    {
      type: "Alamat",
      data: "Jl. Raya Pos Pengumben No.5, RT.9/RW.3, Srengseng, Kec. Kembangan, Kota Jakarta Barat 11630, Indonesia",
    },
    {
      type: "Kontak",
      data: "+62 215870733",
    },
    {
      type: "Jam Operasional",
      data: "Setiap hari — Tutup pukul 17:00",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <div className="overflow-hidden rounded-md border border-[#E5E7EB] bg-[#F6F6F6]">
        <EmbedMap />
      </div>
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        className="rounded-md border border-[#E5E7EB] bg-[#F6F6F6] p-4"
      >
        <dl className="divide-y divide-[#E5E7EB]">
          {dataAddress.map((item) => (
            <div key={item.type} className="py-4 first:pt-0 last:pb-0">
              <dt className="mb-1 text-xs font-normal uppercase tracking-[0.08em] text-[#6B6B6B]">
                {item.type}
              </dt>
              <dd className="text-base font-normal leading-[1.5] text-black">
                {item.data}
              </dd>
            </div>
          ))}
        </dl>
      </motion.div>
    </div>
  );
};

export default Address;
