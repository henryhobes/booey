import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { NavAuth } from "@/components/nav/NavAuth";
import { MobileBottomNav } from "@/components/nav/MobileBottomNav";
import { ScrollToTop } from "@/components/ScrollToTop";
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
  title: "Booey - Get Things Done Faster, No Tech Skills Needed",
  description: "Simple, guided tools that help you write, plan, create, and organize. Answer a few questions, get helpful results. No confusing prompts, no wrong answers.",
  icons: {
    icon: '/favicon.png',
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    images: [{ url: '/og-image.png', width: 1200, height: 630 }],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  userScalable: true,
  viewportFit: 'cover',
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
        {/* Scroll to top on route change */}
        <ScrollToTop />
        
        {/* Skip to content link for keyboard users */}
        <a href="#main-content" className="skip-to-content">
          Skip to main content
        </a>

        <div className="flex min-h-screen flex-col">
          {/* Navigation */}
          <nav className="navbar bg-base-100 border-b border-base-300 px-4 md:px-6 lg:px-8" aria-label="Main navigation">
            <div className="flex-1">
              <Link href="/" className="flex items-center gap-2 text-2xl font-bold text-primary">
                <Image
                  src="/logo.png"
                  alt="Booey"
                  width={32}
                  height={46}
                  className="h-7 w-auto md:h-8"
                  priority
                />
                Booey
              </Link>
            </div>
            <div className="flex-none hidden md:flex items-center gap-4">
              <Link href="/explore" className="btn btn-ghost btn-sm text-base">
                Explore
              </Link>
              <NavAuth />
            </div>
          </nav>

          {/* Main Content */}
          <main id="main-content" className="flex-1">
            {children}
          </main>

          {/* Mobile Bottom Navigation */}
          <MobileBottomNav />
        </div>
      </body>
    </html>
  );
}
