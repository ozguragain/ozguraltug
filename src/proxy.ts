import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { decodeSession, validateSession, AUTH_COOKIE_NAME } from "@/lib/session";

const PROTECTED_PATHS = ["/writing/new", "/writing/edit"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isProtectedPath = PROTECTED_PATHS.some((path) =>
    pathname.startsWith(path)
  );

  if (!isProtectedPath) {
    return NextResponse.next();
  }

  const authCookie = request.cookies.get(AUTH_COOKIE_NAME);

  if (!authCookie) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  const session = decodeSession(authCookie.value);

  if (!session) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    const response = NextResponse.redirect(loginUrl);
    response.cookies.delete(AUTH_COOKIE_NAME);
    return response;
  }

  const { valid } = validateSession(session);

  if (!valid) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    const response = NextResponse.redirect(loginUrl);
    response.cookies.delete(AUTH_COOKIE_NAME);
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/writing/new", "/writing/new/:path*", "/writing/edit/:path*"],
};
