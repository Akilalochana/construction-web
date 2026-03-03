import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import WhatsAppWrapper from "@/components/whatsapp-wrapper";

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
  title: "Sri Ranjana Construction — Building Your Dreams Into Reality",
  description: "Sri Ranjana Construction offers turnkey construction, renovations, and project completion services. 15+ years building quality homes.",
  authors: [{ name: "Sri Ranjana Construction" }],
  openGraph: {
    title: "Sri Ranjana Construction",
    description: "Turnkey construction, renovations, and project completion. Building dreams into reality.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${playfairDisplay.variable} ${inter.variable} antialiased`}
      >
        {children}
        <WhatsAppWrapper />
      </body>
    </html>
  );
}
