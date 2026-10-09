/**
 * Standardisasi queryKey React Query.
 *
 * Aturan:
 * - List memakai key tunggal: ["products"], ["categories"], ["featured-products"]
 * - Detail memakai bentuk hirarkis: ["products", id], ["categories", id]
 *   supaya invalidateQueries({ queryKey: ["products"] }) otomatis
 *   mencakup semua detail (prefix match, exact: false default).
 *
 * Jangan lagi memakai bentuk string tunggal seperti [`product/${id}`]
 * karena tidak akan ke-match oleh invalidate list.
 */
export const queryKeys = {
  // Admin + public product list (endpoint berbeda tapi data sama,
  // invalidate bersamaan agar storefront ikut fresh)
  products: ["products"] as const,
  productDetail: (id: string | number) => ["products", String(id)] as const,

  featuredProducts: ["featured-products"] as const,

  categories: ["categories"] as const,
  categoryDetail: (id: string | number) => ["categories", String(id)] as const,

  // Public product detail — disamakan dengan admin agar satu invalidate cukup.
  // Kalau nanti endpoint public/admin divergen, pisahkan lagi di sini saja.
  publicProductDetail: (slug: string | number) =>
    ["products", String(slug)] as const,
} as const;
