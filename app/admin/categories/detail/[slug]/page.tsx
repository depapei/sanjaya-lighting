"use client";
import Loading from "@/components/admin/Loading";
import api from "@/lib/axios";
import { queryKeys } from "@/lib/queryKeys";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";

interface Category {
  Name: string;
}

const NavigateToDetail = () => {
  const params = useParams();
  const id = params.slug;

  const { data, isLoading } = useQuery({
    queryKey: queryKeys.categoryDetail(String(id)),
    queryFn: async () => {
      const res = await api.get(`/api/admin/category/${id}`);
      return res.data;
    },
  });

  if (isLoading) {
    return <Loading />;
  }

  if (data) {
    return <CategoryDetail data={data} />;
  } else {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg border border-dashed border-gray-300">
        <p className="text-gray-500 italic">No product data available</p>
      </div>
    );
  }
};

const CategoryDetail = ({ data }: { data: Category }) => {
  // Bangun URL gambar dari base64

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-4xl">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{data.Name}</h1>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavigateToDetail;
