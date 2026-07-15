import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

import type { NextRequest } from "next/server";

const { auth } = NextAuth(authConfig);

export default async function middleware(req: NextRequest) {
  return await auth(req);
}

export const config = {
  // Skip static files, _next internals, and API auth routes
  matcher: ["/((?!_next|api|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|svg|webp|ico|css|js|woff|woff2|ttf)).*)"],
};
