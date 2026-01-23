import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

const validateAuthentication = (req: NextRequest) => {
  const isAuthenticated =
    req.cookies.get("admin_session")?.value === "authenticated";

  return isAuthenticated;
};

/**
 * POST /api/product
 * Create product
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!validateAuthentication(req)) {
      return NextResponse.json(
        { message: "Please Login First" },
        { status: 401 },
      );
    }

    const {
      Name,
      Description,
      Price,
      DiscountPrice,
      Stock,
      ImageBase64,
      ImageMimeType,
      IsFeatured,
      CategoryID,
    } = body;

    // Validasi wajib
    if (!Name || !Price) {
      return NextResponse.json(
        { message: "Name and Price are required" },
        { status: 400 },
      );
    }

    const product = await prisma.product.create({
      data: {
        Name,
        Description,
        Price,
        DiscountPrice,
        Stock: Stock ?? 0,
        ImageBase64,
        ImageMimeType,
        IsFeatured: IsFeatured ?? false,
        IsActive: true,
        CategoryID,
        CreatedAt: new Date(),
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Failed to create product" },
      { status: 500 },
    );
  }
}

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      where: { IsActive: true },
      orderBy: { CreatedAt: "desc" },
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Failed to fetch products" },
      { status: 500 },
    );
  }
}

/**
 * PUT /api/product?id=1
 * Update product
 */
export async function PUT(req: NextRequest) {
  try {
    if (!validateAuthentication(req)) {
      return NextResponse.json(
        { message: "Please Login First" },
        { status: 401 },
      );
    }
    const { searchParams } = new URL(req.url);
    const id = Number(searchParams.get("id"));

    if (!id) {
      return NextResponse.json(
        { message: "Product ID is required" },
        { status: 400 },
      );
    }

    const body = await req.json();

    const product = await prisma.product.update({
      where: { ProductID: id },
      data: {
        ...body,
        UpdatedAt: new Date(),
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Failed to update product" },
      { status: 500 },
    );
  }
}

/**
 * DELETE /api/product?id=1
 * Soft delete product
 */
export async function DELETE(req: NextRequest) {
  try {
    if (!validateAuthentication(req)) {
      return NextResponse.json(
        { message: "Please Login First" },
        { status: 401 },
      );
    }
    const { searchParams } = new URL(req.url);
    const id = Number(searchParams.get("id"));

    if (!id) {
      return NextResponse.json(
        { message: "Product ID is required" },
        { status: 400 },
      );
    }

    const product = await prisma.product.update({
      where: { ProductID: id },
      data: {
        IsActive: false,
        UpdatedAt: new Date(),
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Failed to delete product" },
      { status: 500 },
    );
  }
}
