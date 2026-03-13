import type { Metadata } from "next";
import AboutClient from "./AboutClient";

// ✅ SEO Metadata 
export const metadata: Metadata = {
  title: "About Us | Sri Ranjana Construction",
  description:
    "Sri Ranjana Construction — 15+ years of trusted building experience in Sri Lanka. Meet our team and learn our mission, values, and commitment to quality construction.",
  keywords: [
    "about Sri Ranjana Construction",
    "construction company Sri Lanka",
    "building contractors Sri Lanka",
    "experienced construction team",
    "licensed contractors Sri Lanka",
    "turnkey construction company",
  ],
  openGraph: {
    title: "About Us | Sri Ranjana Construction",
    description:
      "15+ years of trusted construction experience. Licensed, insured, and committed to delivering quality homes and buildings across Sri Lanka.",
    type: "website",
    images: [
      {
        url: "/assets/modern-villa.jpg",
        width: 1200,
        height: 630,
        alt: "Sri Ranjana Construction — Our Work",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "About Us | Sri Ranjana Construction",
    description:
      "15+ years of trusted construction experience in Sri Lanka.",
    images: ["/assets/modern-villa.jpg"],
  },
  alternates: {
    canonical: "/about",
  },
};

// ✅ Server component
export default function AboutPage() {
  return <AboutClient />;
}