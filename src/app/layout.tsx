import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import SessionProvider from "@/components/SessionProvider";
import SessionHeader from "@/components/SessionHeader";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Reporte de prácticas",
  description: "Reporte de actividad durante las prácticas",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-100 text-gray-900`}>
        <SessionProvider>
          <SessionHeader />
          {/* Main Content */}
          <main className="container mx-auto p-6 bg-white shadow-md rounded-lg mt-4">{children}</main>
          {/* Footer */}
          <footer className="mt-6 py-4 text-center text-gray-500 text-sm">
            © {new Date().getFullYear()} <span><a href="https://codeartssolutions.com/">CodeArts Solutions</a></span>. Todos los derechos reservados.
          </footer>
        </SessionProvider>
      </body>
    </html>
  );
}
