// app/api/product/route.ts
import { deobfuscateId } from "@/idObfuscator";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } },
) {
  const paramsId = Array.isArray(params.slug) ? params.slug[0] : params.slug;
  const id = deobfuscateId(paramsId);

  if (id === null) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  try {
    const product = await prisma.product.findUnique({
      where: { ProductID: id, IsActive: true },
    });

    if (product) {
      const encryptedId_product = {
        ...product,
        ProductID: paramsId,
      };
      return NextResponse.json(encryptedId_product);
    } else {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 500 },
      );
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Failed to fetch products" },
      { status: 500 },
    );
  }
}
