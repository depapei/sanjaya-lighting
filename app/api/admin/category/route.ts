import { prisma } from "@/lib/prisma";
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
    if (!Name) {
      return NextResponse.json(
        { message: "Name are required" },
        { status: 400 },
      );
    }

    const category = await prisma.category.create({
      data: {
        Name,
      },
    });

    return NextResponse.json(category, { status: 201 });
  } catch (error) {
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

    const category = await prisma.category.update({
      where: { CategoryID: id },
      data: {
        ...body,
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Failed to update category" },
      { status: 500 },
    );
  }
}

/**
 * DELETE /api/category?id=1
 * Soft delete category
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

    const category = await prisma.category.delete({
      where: { CategoryID: id },
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
