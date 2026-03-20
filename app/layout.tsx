import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import WhatsAppWrapper from "@/components/whatsapp-wrapper";
import StructuredData from "@/components/structured-data";
import { Providers } from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfairDisplay = Playfair_Display({
  variable: "--font-heading-var",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
});

const inter = Inter({
  variable: "--font-body-var",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.sriranjanaconstruction.lk"), // 🔥 CHANGE THIS

  title: {
    default: "Sri Ranjana Construction | Construction Company in Anuradhapura",
    template: "%s | Sri Ranjana Construction",
  },

  description:
    "Looking for a trusted construction company in Anuradhapura? Sri Ranjana Construction offers house construction, renovations, turnkey projects & commercial building services in Sri Lanka.",

  keywords: [
    "construction Anuradhapura",
    "Anuradhapura construction company",
    "house builders Anuradhapura",
    "Sri Ranjana Construction",
    "construction companies Sri Lanka",
    "home construction Anuradhapura",
    "building contractors Anuradhapura",
    "renovation services Anuradhapura",
    "turnkey construction Sri Lanka",
    "commercial construction Anuradhapura"
  ],

  authors: [{ name: "Sri Ranjana Construction" }],
  creator: "Sri Ranjana Construction",
  publisher: "Sri Ranjana Construction",

  alternates: {
    canonical: "https://www.sriranjanaconstruction.lk",
  },

  openGraph: {
    title: "Best Construction Company in Anuradhapura | Sri Ranjana Construction",
    description:
      "Expert house builders in Anuradhapura offering turnkey construction, renovations & commercial projects. 15+ years experience in Sri Lanka.",
    url: "https://www.sriranjanaconstruction.lk",
    siteName: "Sri Ranjana Construction",
    locale: "en_LK",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Construction Company in Anuradhapura | Sri Ranjana Construction",
    description:
      "Trusted builders in Anuradhapura for house construction, renovations & turnkey projects.",
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  verification: {
    google: "ChRPXct7US1_cp5-IpmxlekwwVx9_H7j3reUmvpKkLo",
  },

  other: {
    "geo.region": "LK-7",
    "geo.placename": "Anuradhapura, Sri Lanka",
    "geo.position": "8.3114;80.4037",
    "ICBM": "8.3114, 80.4037",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-LK">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${playfairDisplay.variable} ${inter.variable} antialiased`}
      >
        <StructuredData />
        <Providers>{children}</Providers>
        <WhatsAppWrapper />
      </body>
    </html>
  );
}