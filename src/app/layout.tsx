import type { Metadata } from "next";
import { Mukta } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { ClientProvider } from "@/components/ClientProvider";
import NextTopLoader from "nextjs-toploader";

import type { Viewport } from "next";

const mukta = Mukta({ 
  weight: ['200', '300', '400', '500', '600', '700', '800'],
  subsets: ["latin", "devanagari"],
  display: "swap"
});

export const viewport: Viewport = {
  themeColor: "#2563eb",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export const metadata: Metadata = {
  title: "School Student Evaluation System",
  description: "Chaitanya Pathashala Rapti Upatyaka",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "CPRU Evaluation",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" style={{ colorScheme: "light" }}>
      <body className={mukta.className + " bg-slate-50 text-slate-900"} style={{ colorScheme: "light" }}>
        <NextTopLoader
          color="#2563eb"
          initialPosition={0.08}
          crawlSpeed={200}
          height={4}
          crawl={true}
          showSpinner={true}
          easing="ease"
          speed={200}
          shadow="0 0 10px #2563eb,0 0 5px #2563eb"
          zIndex={1600}
          showAtBottom={false}
        />
        <ClientProvider>
          {children}
          <Toaster position="top-right" />
        </ClientProvider>
      </body>
    </html>
  );
}
