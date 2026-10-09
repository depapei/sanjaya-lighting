// app/api/product/route.ts
import { obfuscateId } from "@/idObfuscator";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/slug";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/**
 * GET /api/product
 * Ambil semua produk aktif.
 * Query opsional: ?category={slug|nama} untuk filter per kategori
 * (dipakai halaman /products + dropdown Navbar).
 */
export async function GET(req: NextRequest) {
  try {
    const categoryParam = new URL(req.url).searchParams
      .get("category")
      ?.trim();

    let categoryId: number | undefined;

    if (categoryParam) {
      const categories = await prisma.category.findMany({
        select: { CategoryID: true, Name: true },
      });

      // Samakan dengan slug yang dihasilkan /api/product-category
      // (termasuk fallback suffix -{id} untuk slug duplikat).
      const slugSeen = new Map<string, number>();
      const slugToId = new Map<string, number>();
      const nameToId = new Map<string, number>();
      for (const c of [...categories].sort((a, b) =>
        a.Name.localeCompare(b.Name),
      )) {
        const base = slugify(c.Name) || `kategori-${c.CategoryID}`;
        const count = slugSeen.get(base) ?? 0;
        slugSeen.set(base, count + 1);
        const slug = count === 0 ? base : `${base}-${c.CategoryID}`;
        slugToId.set(slug.toLowerCase(), c.CategoryID);
        nameToId.set(c.Name.toLowerCase(), c.CategoryID);
      }

      const key = categoryParam.toLowerCase();
      categoryId = slugToId.get(key) ?? nameToId.get(key);

      // Slug tidak dikenal → kembalikan list kosong (bukan 404)
      // agar halaman /products bisa tampilkan empty state yang rapi.
      if (!categoryId) {
        return NextResponse.json([]);
      }
    }

    const products = await prisma.product.findMany({
      where: {
        IsActive: true,
        ...(categoryId ? { CategoryID: categoryId } : {}),
      },
      orderBy: { CreatedAt: "desc" },
      select: {
        ProductID: true,
        Description: true,
        Price: true,
        DiscountPrice: true,
        Name: true,
        Stock: true,
        ImageBase64: true,
        Category: {
          select: { Name: true },
        },
      },
    });

    const modifiedProduct = products.map((product) => ({
      ...product,
      ProductID: obfuscateId(product.ProductID),
      Category: product.Category?.Name,
    }));

    return NextResponse.json(modifiedProduct);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Failed to fetch products" },
      { status: 500 },
    );
  }
}
