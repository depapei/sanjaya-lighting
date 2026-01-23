"use client";
import CategoryTable from "@/components/admin/CategoryTable";
import Loading from "@/components/admin/Loading";
import api from "@/lib/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

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
      // 🔁 Invalidate cache → refresh daftar produk
      queryClient.invalidateQueries({ queryKey: ["category"] });
    },
    onError: (error) => {
      console.error("Delete failed:", error);
      alert("Gagal menghapus produk");
    },
  });

  const { data, isLoading } = useQuery({
    queryKey: ["category"],
    queryFn: async () => {
      const res = await api.get("/api/admin/category");
      return res.data;
    },
  });

  if (!data) {
    return;
  }

  if (isLoading) {
    return <Loading />;
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
