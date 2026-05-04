import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { SESSION_COOKIE_NAME, verifySessionValue } from "@/lib/session";

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const session = verifySessionValue(
    request.cookies.get(SESSION_COOKIE_NAME)?.value,
  );

  const isAuthenticated = Boolean(session);

  if (pathname.startsWith("/login") && isAuthenticated) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  if (
    (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) &&
    !isAuthenticated
  ) {
    const loginUrl = new URL("/login", request.url);

    if (!pathname.startsWith("/api/admin")) {
      loginUrl.searchParams.set("from", pathname);
    }

    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/login", "/admin/:path*", "/api/admin/:path*"],
};
