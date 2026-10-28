import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { APP_STORE_ID, DESCRIPTION, KEYWORDS, OG_ALT, SITE_URL, TITLE } from "@/components/landing/content";
import "./globals.css";
import "./experience.css";

/** Same body face as the app. The hand-lettered display face is SVG, not a font. */
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: TITLE, template: "%s | Tempo" },
  description: DESCRIPTION,
  applicationName: "Tempo",
  itunes: { appId: APP_STORE_ID },
  keywords: KEYWORDS,
  category: "lifestyle",
  authors: [{ name: "Tempo Software Pty Ltd", url: SITE_URL }],
  creator: "Tempo Software Pty Ltd",
  publisher: "Tempo Software Pty Ltd",
  alternates: { canonical: "/" },
  robots: { index: true, follow: true, googleBot: { "max-image-preview": "large" } },
  openGraph: {
    type: "website",
    siteName: "Tempo",
    locale: "en_AU",
    url: "/",
    title: TITLE,
    description: DESCRIPTION,
    images: [{ url: "/og.png", width: 1200, height: 630, alt: OG_ALT }],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/og.png"],
  },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon-32x32.png", type: "image/png", sizes: "32x32" },
      { url: "/favicon-16x16.png", type: "image/png", sizes: "16x16" },
    ],
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#F7F4ED",
  colorScheme: "light",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-AU" className={jakarta.variable} data-scroll-behavior="smooth">
      <body>{children}</body>
    </html>
  );
}
