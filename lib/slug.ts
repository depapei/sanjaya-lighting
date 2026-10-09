/**
 * Slug helpers — isomorphic (aman dipakai di server route & client component).
 * Satu sumber kebenaran agar slug kategori konsisten antara
 * `GET /api/product-category`, `GET /api/product?category=` dan link Navbar.
 */
export function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

export interface ProductCategory {
  id: number;
  name: string;
  slug: string;
  productCount: number;
}

/**
 * Beri suffix `-{id}` bila ada slug duplikat
 * (mis. "Lampu Gantung" vs "lampu-gantung").
 */
export function withUniqueSlugs<T extends { id: number; name: string }>(
  items: T[],
): (T & { slug: string })[] {
  const seen = new Map<string, number>();
  return items.map((item) => {
    const base = slugify(item.name) || `kategori-${item.id}`;
    const count = seen.get(base) ?? 0;
    seen.set(base, count + 1);
    return { ...item, slug: count === 0 ? base : `${base}-${item.id}` };
  });
}
