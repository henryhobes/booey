import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { NavAuth } from "@/components/nav/NavAuth";
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
  metadataBase: new URL('https://booey.ai'),
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
              <Link href="/" className="flex items-center">
                <Image
                  src="/text-logo.png"
                  alt="Booey"
                  width={403}
                  height={174}
                  className="h-8 w-auto md:h-9"
                  priority
                />
              </Link>
            </div>
            <div className="flex-none flex items-center gap-4">
              <NavAuth />
            </div>
          </nav>

          {/* Main Content */}
          <main id="main-content" className="flex-1">
            {children}
          </main>

        </div>
      </body>
    </html>
  );
}
