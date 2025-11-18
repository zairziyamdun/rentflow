import "./globals.css";
import type { ReactNode } from "react";
import Header from "@/components/Header";
import { Providers } from "./providers";

export const metadata = { title: "MonDiva" };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ru">
      <body className="min-h-dvh bg-white text-gray-900">
        <Providers>
          <Header />
          <main className="container mx-auto px-4 py-6">{children}</main>
          {/* Footer */}
        </Providers>
      </body>
    </html>
  );
}
