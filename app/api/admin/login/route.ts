import { prisma } from "@/lib/prisma";
import { compare } from "bcryptjs";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    // Cari admin di database
    const admin = await prisma.admin.findUnique({
      where: { username },
    });

    if (!admin || !(await compare(password, admin.password_hash))) {
      return NextResponse.json(
        { error: "Username atau password salah" },
        { status: 401 },
      );
    }

    // Set session cookie (aman, HTTP-only)
    cookies().set({
      name: "admin_session",
      value: "authenticated",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 24 * 60 * 60, // 1 hari
      path: "/",
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  } finally {
    await prisma.$disconnect();
  }
}
