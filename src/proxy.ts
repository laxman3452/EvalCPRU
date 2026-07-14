import NextAuth from "next-auth";
import { authConfig } from "../auth.config";
import type { NextRequest } from 'next/server';

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const isAuthRoute = nextUrl.pathname.startsWith("/login");
  const isApiAuthRoute = nextUrl.pathname.startsWith("/api/auth");
  
  if (isApiAuthRoute) return;

  if (isAuthRoute) {
    if (isLoggedIn) {
      const role = req.auth?.user?.role;
      if (role === "admin") return Response.redirect(new URL("/admin", nextUrl));
      if (role === "teacher") return Response.redirect(new URL("/teacher", nextUrl));
      return Response.redirect(new URL("/", nextUrl));
    }
    return;
  }

  if (!isLoggedIn) {
    return Response.redirect(new URL("/login", nextUrl));
  }
  
  const role = req.auth?.user?.role;
  if (nextUrl.pathname.startsWith("/admin") && role !== "admin") {
    return Response.redirect(new URL("/teacher", nextUrl));
  }
  if (nextUrl.pathname.startsWith("/teacher") && role !== "teacher") {
    return Response.redirect(new URL("/admin", nextUrl));
  }
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
