import type { Metadata } from "next";
import ServicesPageClient from "./ServicesPageClient";

export const metadata: Metadata = {
  title: "Construction Services | House Building, Plan Design & Renovation | Sri Lanka",
  description:
    "Sri Ranjana Construction offers full house construction, architectural plan & design, turnkey building projects, and renovation services in Anuradhapura and across Sri Lanka. Trusted by Sri Lankans living abroad to build their dream homes. Free quote.",
  keywords: [
    // ── Service keywords ──
    "house construction services Sri Lanka",
    "full home construction Sri Lanka",
    "turnkey construction services Sri Lanka",
    "house plan design Sri Lanka",
    "architectural design Sri Lanka",
    "building construction services Anuradhapura",
    "home renovation Sri Lanka",
    "commercial building construction Sri Lanka",
    "residential construction Sri Lanka",
    "construction company services Anuradhapura",
    // ── Overseas / diaspora keywords ──
    "build house Sri Lanka from overseas",
    "construction services Sri Lanka expats",
    "manage home construction Sri Lanka abroad",
    "Sri Lankan home builders for diaspora",
    "build home in Sri Lanka from UK Australia",
    // ── Long-tail keywords ──
    "affordable house construction Sri Lanka",
    "licensed building contractors Anuradhapura",
    "best home builders Anuradhapura Sri Lanka",
    "construction company North Central Province",
    "how to build a house in Sri Lanka",
    // ── Brand ──
    "Sri Ranjana Construction services",
  ],
  openGraph: {
    title: "Construction Services | Sri Ranjana Construction | Sri Lanka",
    description:
      "Full house construction, plan design, turnkey projects & renovation services in Anuradhapura, Sri Lanka. We build your dream home — even if you're living abroad. Free consultation.",
    type: "website",
    locale: "en_LK",
    images: [
      {
        url: "/assets/hero.jpg",
        width: 1200,
        height: 630,
        alt: "Sri Ranjana Construction Services — House Building & Construction in Sri Lanka",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Construction Services | Sri Ranjana Construction | Anuradhapura",
    description:
      "House construction, plan design & renovation services in Sri Lanka. Building homes for Sri Lankans at home and abroad.",
    images: ["/assets/hero.jpg"],
  },
  alternates: {
    canonical: "/services",
  },
  // ── Geo tags ──
  other: {
    "geo.region":    "LK-7",
    "geo.placename": "Anuradhapura, Sri Lanka",
    "geo.position":  "8.3114;80.4037",
    "ICBM":          "8.3114, 80.4037",
  },
};

export default function ServicesPage() {
  return <ServicesPageClient />;
}