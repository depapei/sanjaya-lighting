"use client";
import CategoryForm from "@/components/admin/CategoryForm";
import api from "@/lib/axios";
import { queryKeys } from "@/lib/queryKeys";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";

const EditCategory = () => {
  const params = useParams();

  const id = params.slug;

  const { data, isLoading } = useQuery({
    queryKey: queryKeys.categoryDetail(String(id)),
    queryFn: async () => {
      const res = await api.get(`/api/admin/category/${id}`);
      return res.data;
    },
  });

  if (data) {
    return <CategoryForm initialData={data} />;
  } else if (isLoading) {
    return (
      <div className="flex items-center justify-center gap-3 p-12">
        <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-600">Loading Data...</p>
      </div>
    );
  } else {
    return (
      <div className="p-3 bg-red-100 text-red-600">
        Failed to fetch category
      </div>
    );
  }
};

export default EditCategory;
