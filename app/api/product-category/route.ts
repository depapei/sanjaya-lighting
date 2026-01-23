import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

/* eslint-disable @typescript-eslint/no-explicit-any */

export const GET = async () => {
  try {
    const category = await prisma.category.findMany({
      select: {
        Name: true,
      },
    });

    const arrayCategory = category.map((category: any) => {
      return category.Name;
    });

    return NextResponse.json(arrayCategory);
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { message: "Failed to fetch category" },
      { status: 500 },
    );
  }
};
