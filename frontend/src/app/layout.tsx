import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Providers } from "@/components/providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Artist Factory | Book Top Artists for Your Events in Pakistan",
  description: "Pakistan's premier platform for booking artists and entertainers. Find singers, musicians, DJs, photographers, makeup artists, and more for weddings, corporate events, and parties.",
  keywords: "book artists Pakistan, wedding singers, DJ booking, photographers Lahore, makeup artists Karachi, event entertainers",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth dark" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased bg-[#0a0a0b] text-white`} suppressHydrationWarning>
        <Providers>
          <Header />
          <main className="pt-24 lg:pt-[104px]">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
