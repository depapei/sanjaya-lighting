"use client";
import CategoryTable from "@/components/admin/CategoryTable";
import Loading from "@/components/admin/Loading";
import api from "@/lib/axios";
import { queryKeys } from "@/lib/queryKeys";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const CategoriesPage = () => {
  const route = useRouter();
  const queryClient = useQueryClient();

  // 💥 Mutation untuk hapus
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await api.delete(`/api/admin/category/?id=${id}`);
      return res.data;
    },
    onSuccess: () => {
      // Prefix ["categories"] mencakup ["categories", id].
      // Produk memakai nama kategori → ikut invalidate.
      queryClient.invalidateQueries({ queryKey: queryKeys.categories });
      queryClient.invalidateQueries({ queryKey: queryKeys.products });
    },
    onError: (error) => {
      console.error("Delete failed:", error);
      toast.error("Gagal menghapus kategori.");
    },
  });

  const { data, isLoading } = useQuery({
    queryKey: queryKeys.categories,
    queryFn: async () => {
      const res = await api.get("/api/admin/category");
      return res.data;
    },
  });

  if (isLoading) {
    return <Loading />;
  }

  if (!data) {
    return (
      <div className="p-3 bg-red-100 text-red-600">
        Failed to fetch categories
      </div>
    );
  }

  return (
    <CategoryTable
      data={data}
      onEdit={(id) => {
        route.push(`categories/edit/${id}`);
      }}
      onClick={(id) => {
        route.push(`categories/detail/${id}`);
      }}
      onDelete={(id) => {
        if (confirm("Apakah anda yakin ingin hapus kategori ini?")) {
          deleteMutation.mutate(id);
        }
      }}
    />
  );
};

export default CategoriesPage;
