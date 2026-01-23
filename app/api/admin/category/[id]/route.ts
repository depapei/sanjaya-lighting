import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const id = parseInt(params.id, 10);

    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const category = await prisma.category.findUnique({
      where: { CategoryID: id },
    });

    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(category);
  } catch (error) {
    console.error("Get category by ID error:", error);
    return NextResponse.json(
      { error: "Failed to fetch category" },
      { status: 500 },
    );
  }
}
