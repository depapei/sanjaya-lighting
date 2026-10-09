"use client";
import ProductTable from "@/components/admin/ProductTable";
import api from "@/lib/axios";
import { queryKeys } from "@/lib/queryKeys";
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
      // Prefix ["products"] mencakup ["products", id], jadi detail ikut fresh.
      // Featured + list public memakai key yang sama / terpisah → invalidate juga.
      queryClient.invalidateQueries({ queryKey: queryKeys.products });
      queryClient.invalidateQueries({
        queryKey: queryKeys.featuredProducts,
      });
    },
    onError: (error) => {
      console.error("Delete failed:", error);
      alert("Gagal menghapus produk");
    },
  });

  const { data, isLoading } = useQuery({
    queryKey: queryKeys.products,
    queryFn: async () => {
      const res = await api.get("/api/admin/products");
      return res.data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center gap-3 p-12">
        <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-600">Loading Data...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-3 bg-red-100 text-red-600">Failed to fetch products</div>
    );
  }

  return (
    <ProductTable
      isLoading={isLoading}
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
