import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isAdminPage = path.startsWith("/admin");
  const isAdminApi =
    path.startsWith("/api/admin") && !path.startsWith("/api/admin/login");
  const isLoginPage = path === "/admin/login";
  const isAuthenticated =
    request.cookies.get("admin_session")?.value === "authenticated";

  // API admin: tolak langsung 401 agar tidak bocor, jangan redirect.
  if (isAdminApi && !isAuthenticated) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

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
