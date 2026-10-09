import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

const validateAuthentication = (req: NextRequest) => {
  const isAuthenticated =
    req.cookies.get("admin_session")?.value === "authenticated";

  return isAuthenticated;
};

/** Harga internal: opsional, hanya dipakai di back office. */
function normalizePrice(value: unknown): number | null {
  if (value === undefined || value === null || value === "") return null;
  const n = typeof value === "number" ? value : parseFloat(String(value));
  if (!Number.isFinite(n) || n < 0) return null;
  return n;
}

function normalizeStock(value: unknown): number {
  const n =
    typeof value === "number" ? value : parseInt(String(value ?? "0"), 10);
  if (!Number.isFinite(n) || n < 0) return 0;
  return Math.floor(n);
}

function normalizeCategoryId(value: unknown): number | null {
  if (value === undefined || value === null || value === "") return null;
  const n = typeof value === "number" ? value : parseInt(String(value), 10);
  if (!Number.isFinite(n) || n <= 0) return null;
  return n;
}

function toNullableString(value: unknown): string | null {
  if (value === undefined || value === null) return null;
  const s = String(value);
  return s === "" ? null : s;
}

/**
 * POST /api/admin/products
 * Create product — Price opsional (harga internal, tidak tampil di depan).
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
      IsActive,
      CategoryID,
      tags,
      CreatedBy,
    } = body;

    // Hanya nama yang wajib
    if (!Name || String(Name).trim() === "") {
      return NextResponse.json(
        { message: "Product name is required" },
        { status: 400 },
      );
    }

    const product = await prisma.product.create({
      data: {
        Name: String(Name).trim(),
        Description: toNullableString(Description),
        Price: normalizePrice(Price),
        DiscountPrice: normalizePrice(DiscountPrice),
        Stock: normalizeStock(Stock),
        ImageBase64: toNullableString(ImageBase64),
        ImageMimeType: toNullableString(ImageMimeType),
        IsFeatured: IsFeatured ?? false,
        IsActive: IsActive ?? true,
        CategoryID: normalizeCategoryId(CategoryID),
        tags: toNullableString(tags),
        CreatedBy: toNullableString(CreatedBy) ?? "admin",
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
      select: {
        Name: true,
        CategoryID: true,
        Category: true,
        Description: true,
        DiscountPrice: true,
        ImageBase64: true,
        ImageMimeType: true,
        IsActive: true,
        IsFeatured: true,
        ProductID: true,
        Price: true,
        Stock: true,
        tags: true,
      },
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
 * PUT /api/admin/products?id=1
 * Update product — whitelist field agar aman.
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

    if (
      body.Name !== undefined &&
      (body.Name === null || String(body.Name).trim() === "")
    ) {
      return NextResponse.json(
        { message: "Product name cannot be empty" },
        { status: 400 },
      );
    }

    const data: Record<string, unknown> = { UpdatedAt: new Date() };
    if (body.Name !== undefined) data.Name = String(body.Name).trim();
    if (body.Description !== undefined)
      data.Description = toNullableString(body.Description);
    if (body.Price !== undefined) data.Price = normalizePrice(body.Price);
    if (body.DiscountPrice !== undefined)
      data.DiscountPrice = normalizePrice(body.DiscountPrice);
    if (body.Stock !== undefined) data.Stock = normalizeStock(body.Stock);
    if (body.ImageBase64 !== undefined)
      data.ImageBase64 = toNullableString(body.ImageBase64);
    if (body.ImageMimeType !== undefined)
      data.ImageMimeType = toNullableString(body.ImageMimeType);
    if (body.IsFeatured !== undefined)
      data.IsFeatured = Boolean(body.IsFeatured);
    if (body.IsActive !== undefined) data.IsActive = Boolean(body.IsActive);
    if (body.CategoryID !== undefined)
      data.CategoryID = normalizeCategoryId(body.CategoryID);
    if (body.tags !== undefined) data.tags = toNullableString(body.tags);
    if (body.UpdatedBy !== undefined)
      data.UpdatedBy = toNullableString(body.UpdatedBy);

    const product = await prisma.product.update({
      where: { ProductID: id },
      data: data as never,
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
 * DELETE /api/admin/products?id=1
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
