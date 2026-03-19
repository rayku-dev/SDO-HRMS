import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import * as jose from "jose";

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;

if (!JWT_ACCESS_SECRET) {
  throw new Error("JWT_ACCESS_SECRET is not defined");
}

const secret = new TextEncoder().encode(JWT_ACCESS_SECRET);

// Public routes that require NO authentication
const PUBLIC_ROUTES = [
  "/login",
  "/register",
  "/api/auth/login",
  "/api/auth/logout",
  "/api/auth/refresh",
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow all public/next.js internal/public folder routes
  if (
    PUBLIC_ROUTES.includes(pathname) ||
    pathname.startsWith("/api/auth/") ||
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/public/") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  const accessToken = request.cookies.get("accessToken")?.value;
  const sessionToken = request.cookies.get("sessionToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;

  // ── ATTEMPT VERIFICATION ──────────────────────────────────────────
  if (accessToken && sessionToken) {
    try {
      const { payload: decoded } = await jose.jwtVerify(accessToken, secret);

      if (decoded && decoded.type === "access") {
        // Role-based route protection
        if (pathname.startsWith("/admin") && decoded.role !== "ADMIN") {
          return NextResponse.redirect(new URL("/dashboard", request.url));
        }

        const requestHeaders = new Headers(request.headers);
        requestHeaders.set("x-user-id", decoded.sub as string);
        requestHeaders.set("x-user-role", decoded.role as string);
        requestHeaders.set("x-session-id", decoded.sessionId as string);

        return NextResponse.next({ request: { headers: requestHeaders } });
      }
    } catch (err: any) {
      if (err.code !== "ERR_JWT_EXPIRED") {
        console.error("[Middleware] Token invalid:", err.code, err.message);
      }
      // Fail through to refresh logic below
    }
  }

  // ── ATTEMPT REFRESH ──────────────────────────────────────────────
  if (refreshToken) {
    console.log(`[Middleware] Session stale for ${pathname}, attempting refresh...`);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";
      const refreshUrl = `${apiUrl}/auth/refresh`;

      const refreshRes = await fetch(refreshUrl, {
        method: "POST",
        headers: {
          cookie: request.headers.get("cookie") || "",
          "user-agent": request.headers.get("user-agent") || "",
        },
      });

      if (refreshRes.ok) {
        console.log(`[Middleware] Token refresh successful, retrying request: ${pathname}`);
        const response = NextResponse.redirect(request.url, 307);

        // Propagate Set-Cookie headers
        const setCookies = refreshRes.headers.getSetCookie?.() || [];
        if (setCookies.length > 0) {
          setCookies.forEach((cookie) =>
            response.headers.append("set-cookie", cookie),
          );
        }

        return response;
      } else {
         console.error(`[Middleware] Refresh failed with status ${refreshRes.status}`);
      }
    } catch (e: any) {
      console.error("[Middleware] Refresh network error:", e.message);
    }
  }

  // ── FINAL FALLBACK: Redirect to login ─────────────────────────────
  console.log(`[Middleware] No valid session or refresh possible for ${pathname}, redirecting to /login`);
  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set("from", pathname);
  const response = NextResponse.redirect(loginUrl);
  response.cookies.delete("accessToken");
  response.cookies.delete("sessionToken");
  response.cookies.delete("refreshToken");
  return response;
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
    "/pds/:path*",
    "/files201/:path*",
  ],
};
