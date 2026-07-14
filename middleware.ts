import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

// Use only the edge-compatible authConfig (no Mongoose) in middleware
export const { auth: middleware } = NextAuth(authConfig);

export const config = {
  // Skip static files, _next internals, and API auth routes
  matcher: ["/((?!_next|api|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|svg|webp|ico|css|js|woff|woff2|ttf)).*)"],
};
