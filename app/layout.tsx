// app/layout.tsx
"use client";

import { Geist, Geist_Mono } from "next/font/google";
import { usePathname } from "next/navigation";
import "./globals.css";
import HeaderNav from "@/components/HeaderNav";
import Footer from "@/components/Footer";
import { AuthProvider } from "@/context/AuthContext";
import { Analytics } from "@vercel/analytics/react"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isTestPage = pathname.match(
    /^\/exams\/[^/]+\/(listening|reading|writing|speaking)$/
  );

  return (
    <html lang="en">
      <body
        className={`
          ${geistSans.variable} 
          ${geistMono.variable} 
          antialiased 
          min-h-screen 
          flex 
          flex-col 
          bg-gray-50
        `}
      >
        <AuthProvider>
          <Analytics />
          {!isTestPage && <HeaderNav />}
          <main className="flex-grow">
            {children}
          </main>
          {!isTestPage && <Footer />}
        </AuthProvider>
      </body>
    </html>
  );
}
