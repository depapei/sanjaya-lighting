import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    const category = await prisma.cATEGORY.findMany({
      select: {
        Name: true,
      },
    });

    const arrayCategory = category.map((category) => {
      return category.Name;
    });

    return NextResponse.json(arrayCategory);
  } catch (err) {
    return NextResponse.json(
      { message: "Failed to fetch category" },
      { status: 500 },
    );
  }
};
