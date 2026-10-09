"use client";
import Loading from "@/components/admin/Loading";
import api from "@/lib/axios";
import { queryKeys } from "@/lib/queryKeys";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";

interface Product {
  Name: string;
  Description: string;
  Price: number | string;
  Stock: number;
  IsFeatured: boolean;
  ImageBase64: string;
  ImageMimeType: string;
  CreatedBy: string;
}

const NavigateToDetail = () => {
  const params = useParams();
  const id = params.slug;

  const { data, isLoading } = useQuery({
    queryKey: queryKeys.productDetail(String(id)),
    queryFn: async () => {
      const res = await api.get(`/api/admin/product/${id}`);
      return res.data;
    },
  });

  if (isLoading) {
    return <Loading />;
  }

  if (data) {
    return <ProductDetail data={data} />;
  } else {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg border border-dashed border-gray-300">
        <p className="text-gray-500 italic">No product data available</p>
      </div>
    );
  }
};

const ProductDetail = ({ data }: { data: Product }) => {
  // Bangun URL gambar dari base64
  const imageUrl =
    data.ImageBase64 && data.ImageMimeType
      ? `data:${data.ImageMimeType};base64,${data.ImageBase64}`
      : null;

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-4xl">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{data.Name}</h1>
            <p className="text-sm text-gray-500 mt-1">
              Created by: {data.CreatedBy}
            </p>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-xs font-semibold ${
              data.IsFeatured
                ? "bg-yellow-100 text-yellow-800"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            {data.IsFeatured ? "Featured" : "Standard"}
          </span>
        </div>
      </div>

      {/* Gambar */}
      <div className="p-6 flex justify-center bg-gray-50">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={data.Name}
            className="w-full max-w-md h-auto object-contain rounded-lg border border-gray-200"
          />
        ) : (
          <div className="w-full max-w-md h-64 flex items-center justify-center bg-gray-100 rounded-lg border-2 border-dashed border-gray-300">
            <span className="text-gray-400">No image</span>
          </div>
        )}
      </div>

      {/* Info Utama */}
      <div className="p-6 space-y-4">
        {/* Harga & Stok */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-700 font-medium">Price</p>
            <p className="text-xl font-bold text-blue-900">
              {typeof data.Price === "number"
                ? new Intl.NumberFormat("id-ID", {
                    style: "currency",
                    currency: "IDR",
                    minimumFractionDigits: 0,
                  }).format(data.Price)
                : data.Price}
            </p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-sm text-green-700 font-medium">Stock</p>
            <p className="text-xl font-bold text-green-900">{data.Stock} pcs</p>
          </div>
        </div>

        {/* Deskripsi */}
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-2">
            Description
          </h2>
          <p className="text-gray-600 leading-relaxed whitespace-pre-line">
            {data.Description || (
              <span className="text-gray-400 italic">
                No description provided
              </span>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default NavigateToDetail;
