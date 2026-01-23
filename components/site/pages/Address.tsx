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
      data: "Jl. Raya Pos Pengumben No.5, RT.9/RW.3, Srengseng, Kec. Kembangan, Kota Jakarta Barat, Daerah Khusus Ibukota Jakarta 11630, Indonesia",
    },
    {
      type: "Kontak",
      data: "+62 215870733",
    },
    {
      type: "Tutup",
      data: "Pukul 17:00",
    },
  ];

  const fnRenderAddress = (Address: addressType) => {
    const { type, data } = Address;

    return (
      <>
        <motion.p
          key={type}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-md text-gray-600 mb-1 max-w-7xl mx-auto text-start"
        >
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-sm text-gray-700 text-start font-bold"
          >
            {type}
          </motion.span>
          <br />
          {data}
        </motion.p>
      </>
    );
  };

  return (
    <motion.div className="flex flex-col sm:flex-row gap-3">
      <EmbedMap />
      <motion.div>
        {dataAddress.map((addres: addressType) => fnRenderAddress(addres))}
      </motion.div>
    </motion.div>
  );
};

export default Address;
