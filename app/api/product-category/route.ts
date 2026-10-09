import { prisma } from "@/lib/prisma";
import { withUniqueSlugs } from "@/lib/slug";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/**
 * GET /api/product-category
 * Kembalikan daftar kategori public untuk dropdown Navbar & filter /products.
 * Shape: [{ id, name, slug, productCount }]
 * productCount = jumlah produk aktif per kategori.
 */
export const GET = async () => {
  try {
    const categories = await prisma.category.findMany({
      select: {
        CategoryID: true,
        Name: true,
        _count: {
          select: { Product: { where: { IsActive: true } } },
        },
      },
      orderBy: { Name: "asc" },
    });

    const shaped = withUniqueSlugs(
      categories.map((c) => ({
        id: c.CategoryID,
        name: c.Name,
        productCount: c._count.Product,
      })),
    );

    return NextResponse.json(shaped);
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { message: "Failed to fetch category" },
      { status: 500 },
    );
  }
};
