import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { protectedRoutes, authRoutes } from "@/lib/config/routes";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const refreshToken = request.cookies.get("refreshToken")?.value;

  // Protect dashboard and admin routes
  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    if (!refreshToken) {
      const url = new URL("/login", request.url);
      url.searchParams.set("from", pathname);
      return NextResponse.redirect(url);
    }
  }

  // Redirect authenticated users away from auth pages
  if (authRoutes.some((route) => pathname.startsWith(route))) {
    if (refreshToken) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
