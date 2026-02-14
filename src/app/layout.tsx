import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import { NavAuth } from "@/components/nav/NavAuth";
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
  title: "Booey - AI Tools for Everyday Life",
  description: "Simple, guided AI tools for non-technical people. No prompt engineering required.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="booey">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="flex min-h-screen flex-col">
          {/* Navigation */}
          <nav className="navbar bg-base-100 border-b border-base-300 px-4 md:px-6 lg:px-8">
            <div className="flex-1">
              <Link href="/" className="text-2xl font-bold text-primary">
                Booey
              </Link>
            </div>
            <div className="flex-none">
              <NavAuth />
            </div>
          </nav>

          {/* Main Content */}
          <main className="flex-1">
            {children}
          </main>

          {/* Footer */}
          <footer className="footer footer-center bg-base-200 p-6 text-base-content">
            <aside>
              <p className="text-sm">
                Powered by AI • Built with ❤️
              </p>
            </aside>
          </footer>
        </div>
      </body>
    </html>
  );
}
