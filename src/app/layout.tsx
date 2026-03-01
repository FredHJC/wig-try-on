import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
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
  title: "GlamWig - Virtual Wig Try-On & Shop",
  description:
    "Shop premium wigs online. Try on any wig virtually with AI before you buy. Free shipping on orders over $50.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white`}
      >
        {/* Top announcement bar */}
        <div className="bg-gray-900 text-white text-center text-xs sm:text-sm py-2 px-4">
          FREE SHIPPING on orders over $50 | Use code <span className="font-bold">GLAM20</span> for 20% off your first order
        </div>

        {/* Main header */}
        <header className="sticky top-0 z-50 border-b border-gray-200 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="h-16 flex items-center justify-between">
              {/* Logo */}
              <Link href="/" className="flex items-center gap-2">
                <span className="text-2xl font-bold tracking-tight text-gray-900">
                  Glam<span className="text-pink-600">Wig</span>
                </span>
              </Link>

              {/* Navigation */}
              <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
                <Link href="/" className="hover:text-gray-900 transition-colors">
                  Shop All
                </Link>
                <Link href="/#new" className="hover:text-gray-900 transition-colors">
                  New Arrivals
                </Link>
                <Link href="/#bestsellers" className="hover:text-gray-900 transition-colors">
                  Best Sellers
                </Link>
              </nav>

              {/* Right side */}
              <div className="flex items-center gap-4">
                <span className="hidden sm:inline text-xs text-gray-500 bg-pink-50 px-3 py-1.5 rounded-full font-medium">
                  AI Try-On Available
                </span>
              </div>
            </div>
          </div>
        </header>

        <main className="min-h-[calc(100vh-10rem)]">{children}</main>

        {/* Footer */}
        <footer className="bg-gray-50 border-t border-gray-200 mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  Glam<span className="text-pink-600">Wig</span>
                </h3>
                <p className="text-sm text-gray-500 mt-2">
                  AI-powered virtual try-on. See exactly how a wig looks on you before purchasing.
                </p>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Shop</h4>
                <ul className="mt-3 space-y-2 text-sm text-gray-500">
                  <li><Link href="/" className="hover:text-gray-700">All Wigs</Link></li>
                  <li><Link href="/#new" className="hover:text-gray-700">New Arrivals</Link></li>
                  <li><Link href="/#bestsellers" className="hover:text-gray-700">Best Sellers</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Support</h4>
                <ul className="mt-3 space-y-2 text-sm text-gray-500">
                  <li>Free Shipping on $50+</li>
                  <li>30-Day Returns</li>
                  <li>Secure Checkout via Amazon</li>
                </ul>
              </div>
            </div>
            <div className="mt-8 pt-8 border-t border-gray-200 text-center text-xs text-gray-400">
              &copy; 2026 GlamWig. All rights reserved. Products fulfilled by Amazon.
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
