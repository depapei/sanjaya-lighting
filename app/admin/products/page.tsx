"use client";
import Loading from "@/components/admin/Loading";
import ProductTable from "@/components/admin/ProductTable";
import api from "@/lib/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

const ProductsPage = () => {
  const route = useRouter();
  const queryClient = useQueryClient();

  // 💥 Mutation untuk hapus
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await api.delete(`/api/admin/products/?id=${id}`);
      return res.data;
    },
    onSuccess: () => {
      // 🔁 Invalidate cache → refresh daftar produk
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (error) => {
      console.error("Delete failed:", error);
      alert("Gagal menghapus produk");
    },
  });

  const { data, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const res = await api.get("/api/admin/products");
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
    <ProductTable
      data={data}
      onEdit={(id) => {
        route.push(`products/edit/${id}`);
      }}
      onClick={(id) => {
        route.push(`products/detail/${id}`);
      }}
      onDelete={(id) => {
        if (confirm("Apakah anda yakin ingin hapus produk ini?")) {
          deleteMutation.mutate(id);
        }
      }}
    />
  );
};

export default ProductsPage;
