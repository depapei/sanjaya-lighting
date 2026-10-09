import { prisma } from "@/lib/prisma";
import { Prisma } from "@/generated/prisma/client";
import { NextRequest, NextResponse } from "next/server";

const validateAuthentication = (req: NextRequest) => {
  const isAuthenticated =
    req.cookies.get("admin_session")?.value === "authenticated";

  return isAuthenticated;
};

/**
 * POST /api/category
 * Create category
 */
export async function POST(req: NextRequest) {
  try {
    const body: { Name: string } = await req.json();

    if (!validateAuthentication(req)) {
      return NextResponse.json(
        { message: "Please Login First" },
        { status: 401 },
      );
    }

    const { Name } = body;

    // Validasi wajib
    const trimmed = typeof Name === "string" ? Name.trim() : "";
    if (!trimmed) {
      return NextResponse.json(
        { message: "Name are required" },
        { status: 400 },
      );
    }

    // Nama yang pernah di-soft-delete: aktifkan kembali, bukan duplikat.
    const existing = await prisma.category.findUnique({
      where: { Name: trimmed },
    });
    if (existing) {
      if (!existing.IsActive) {
        const reactivated = await prisma.category.update({
          where: { CategoryID: existing.CategoryID },
          data: { IsActive: true },
        });
        return NextResponse.json(
          { ...reactivated, reactivated: true },
          { status: 200 },
        );
      }
      return NextResponse.json(
        { message: "Category name already exists" },
        { status: 409 },
      );
    }

    const category = await prisma.category.create({
      data: {
        Name: trimmed,
      },
    });

    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return NextResponse.json(
        { message: "Category name already exists" },
        { status: 409 },
      );
    }
    console.error(error);
    return NextResponse.json(
      { message: "Failed to create category" },
      { status: 500 },
    );
  }
}

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      where: { IsActive: true },
      orderBy: { Name: "desc" },
    });

    return NextResponse.json(categories);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Failed to fetch categories" },
      { status: 500 },
    );
  }
}

/**
 * PUT /api/category?id=1
 * Update category
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
        { message: "Category ID is required" },
        { status: 400 },
      );
    }

    const body = await req.json();

    const data: { Name?: string; IsActive?: boolean } = {};
    if (body.Name !== undefined) {
      const trimmed = String(body.Name).trim();
      if (trimmed === "") {
        return NextResponse.json(
          { message: "Category name cannot be empty" },
          { status: 400 },
        );
      }
      data.Name = trimmed;
    }
    if (body.IsActive !== undefined) data.IsActive = Boolean(body.IsActive);

    const category = await prisma.category.update({
      where: { CategoryID: id },
      data,
    });

    return NextResponse.json(category);
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return NextResponse.json(
        { message: "Category name already exists" },
        { status: 409 },
      );
    }
    console.error(error);
    return NextResponse.json(
      { message: "Failed to update category" },
      { status: 500 },
    );
  }
}

/**
 * DELETE /api/admin/category?id=1
 * Soft delete category (IsActive = false).
 * Produk di dalamnya tetap ada & tampil sebagai "Tanpa kategori" di depan.
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
        { message: "Category ID is required" },
        { status: 400 },
      );
    }

    const category = await prisma.category.update({
      where: { CategoryID: id },
      data: { IsActive: false },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Failed to delete category" },
      { status: 500 },
    );
  }
}
