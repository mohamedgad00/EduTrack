import { NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAdminSession = request.cookies.get("admin_auth")?.value === "true";

  if (pathname.startsWith("/admin") && !isAdminSession) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (pathname === "/login" && isAdminSession) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/login"],
};
