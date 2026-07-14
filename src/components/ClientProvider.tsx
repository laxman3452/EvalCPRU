"use client";

import { SessionProvider } from "next-auth/react";

export function ClientProvider({ children }: { children: React.ReactNode }) {
  const Provider = SessionProvider as any;
  return <Provider>{children}</Provider>;
}
