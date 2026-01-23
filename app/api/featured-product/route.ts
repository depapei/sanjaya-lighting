// app/api/product/route.ts
import { obfuscateId } from "@/idObfuscator";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

/**
 * GET /api/product
 * Ambil semua produk aktif
 */
export async function GET() {
  try {
    const products = await prisma.product.findMany({
      where: { IsActive: true, IsFeatured: true },
      orderBy: { CreatedAt: "desc" },
      select: {
        ProductID: true,
        Description: true,
        DiscountPrice: true,
        Name: true,
        Stock: true,
        ImageBase64: true,
        Category: {
          select: { Name: true },
        },
      },
    });

    const encryptedProducts = products.map((product) => ({
      ...product,
      ProductID: obfuscateId(product.ProductID),
      Category: product.Category?.Name,
    }));

    return NextResponse.json(encryptedProducts);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Failed to fetch products" },
      { status: 500 },
    );
  }
}
