import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Providers } from "@/components/providers";
import FloatingWhatsAppButton from "@/components/home/FloatingWhatsAppButton";
import SmoothScroll from "@/components/providers/SmoothScroll";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const SITE_NAME = "The Artist Factory";
const SITE_URL = "https://www.artistfactory.co";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  // Drives Google's "site name" line (also emits <meta name="application-name">).
  applicationName: SITE_NAME,
  title: "Artist Factory | Book Top Artists for Your Events in Pakistan",
  description: "Pakistan's premier platform for booking artists and entertainers. Find singers, musicians, DJs, photographers, makeup artists, and more for weddings, corporate events, and parties.",
  keywords: "book artists Pakistan, wedding singers, DJ booking, photographers Lahore, makeup artists Karachi, event entertainers",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: SITE_NAME, // -> og:site_name, a site-name signal for Google
    title: "Artist Factory | Book Top Artists for Your Events in Pakistan",
    description: "Pakistan's premier platform for booking artists and entertainers. Find singers, musicians, DJs, photographers, makeup artists, and more for weddings, corporate events, and parties.",
  },
};

// Strongest site-name signal: WebSite structured data on the homepage.
const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_NAME,
  url: `${SITE_URL}/`,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth dark" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased bg-[#0a0a0b] text-white`} suppressHydrationWarning>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <Providers>
          <SmoothScroll>
            <Header />
            <main className="pt-24 lg:pt-[104px]">
              {children}
            </main>
            <Footer />
            <FloatingWhatsAppButton />
          </SmoothScroll>
        </Providers>
      </body>
    </html>
  );
}
