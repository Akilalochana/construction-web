import type { Metadata } from "next";
import HomePageClient from "./HomePageClient";

export const metadata: Metadata = {
  title: "Sri Ranjana Construction | House Building & Construction Company | Anuradhapura, Sri Lanka",
  description:
    "Sri Ranjana Construction — #1 trusted house building and construction company in Anuradhapura, Sri Lanka. Full home construction, plan design, turnkey projects & building construction for Sri Lankans living abroad. 15+ years experience. Free consultation.",
  keywords: [
    // ── Local Sri Lanka keywords ──
    "construction company Sri Lanka",
    "construction company Anuradhapura",
    "house construction Sri Lanka",
    "home builders Sri Lanka",
    "building construction Anuradhapura",
    "house building Anuradhapura",
    "construction Anuradhapura Sri Lanka",
    // ── Service keywords ──
    "full home construction Sri Lanka",
    "turnkey construction Sri Lanka",
    "house plan design Sri Lanka",
    "architectural plan design Sri Lanka",
    "building contractors Sri Lanka",
    "renovation services Sri Lanka",
    // ── Overseas / diaspora keywords ──
    "build house Sri Lanka from abroad",
    "construction Sri Lanka for overseas Sri Lankans",
    "build home Sri Lanka expats",
    "Sri Lankan diaspora home construction",
    "house construction Sri Lanka overseas",
    // ── Brand ──
    "Sri Ranjana Construction",
    "best construction company Anuradhapura",
    "reliable builders Sri Lanka",
  ],
  openGraph: {
    title: "Sri Ranjana Construction | House Building & Construction | Anuradhapura, Sri Lanka",
    description:
      "Trusted house builders in Anuradhapura, Sri Lanka. Full home construction, plan & design, turnkey projects. Building homes for Sri Lankans at home and abroad. Free consultation.",
    type: "website",
    locale: "en_LK",
    images: [
      {
        url: "/assets/hero.jpg",
        width: 1200,
        height: 630,
        alt: "Sri Ranjana Construction — House Building & Construction Company in Anuradhapura, Sri Lanka",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sri Ranjana Construction | House Building | Anuradhapura, Sri Lanka",
    description:
      "Full home construction & building services in Anuradhapura, Sri Lanka. Trusted by Sri Lankans at home and abroad.",
    images: ["/assets/hero.jpg"],
  },
  alternates: {
    canonical: "/",
  },
  // ── Geo tags — Google Local Search ──
  other: {
    "geo.region":      "LK-7",           
    "geo.placename":   "Anuradhapura, Sri Lanka",
    "geo.position":    "8.3114;80.4037", 
    "ICBM":            "8.3114, 80.4037",
  },
};

export default function HomePage() {
  return <HomePageClient />;
}