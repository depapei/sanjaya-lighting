import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isAdminPage = path.startsWith("/admin");
  const isLoginPage = path === "/admin/login";
  const isAuthenticated =
    request.cookies.get("admin_session")?.value === "authenticated";

  if (isAdminPage && !isAuthenticated) {
    if (!isLoginPage) {
      // ✅ Lebih aman: gunakan origin + path
      return NextResponse.redirect(
        new URL("/admin/login", request.nextUrl.origin),
      );
    }
  }

  if (isLoginPage && isAuthenticated) {
    return NextResponse.redirect(new URL("/admin", request.nextUrl.origin));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
