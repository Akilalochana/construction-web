import type { Metadata } from "next";
import PortfolioSection from "./PortfolioSection";

// ✅ SEO Metadata
export const metadata: Metadata = {
  title: "Our Portfolio | Sri Ranjana Construction",
  description:
    "Explore Sri Ranjana Construction's featured projects — residential villas, apartments, and commercial buildings built across Sri Lanka with 15+ years of expertise.",
  keywords: [
    "construction portfolio Sri Lanka",
    "building projects Sri Lanka",
    "residential construction projects",
    "commercial construction Sri Lanka",
    "before after renovation Sri Lanka",
    "Sri Ranjana Construction projects",
    "home construction gallery",
  ],
  openGraph: {
    title: "Our Portfolio | Sri Ranjana Construction",
    description:
      "See our completed residential and commercial construction projects across Sri Lanka.",
    type: "website",
    images: [
      {
        url: "/assets/modern-villa.jpg",
        width: 1200,
        height: 630,
        alt: "Sri Ranjana Construction — Featured Projects",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Our Portfolio | Sri Ranjana Construction",
    description:
      "Residential and commercial construction projects across Sri Lanka.",
    images: ["/assets/modern-villa.jpg"],
  },
  alternates: {
    canonical: "/portfolio",
  },
};

// ✅ Server component wrapper
export default function PortfolioPage() {
  return <PortfolioSection />;
}