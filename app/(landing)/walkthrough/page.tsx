import type { Metadata } from "next";
import WalkthroughClient from "./WalkthroughClient";

export const metadata: Metadata = {
  title: "360° Virtual House Walkthrough | Sri Ranjana Construction | Sri Lanka",
  description:
    "Take a 360° virtual tour of completed houses and buildings by Sri Ranjana Construction in Anuradhapura, Sri Lanka. Explore every room before you build — ideal for Sri Lankans living abroad planning their dream home.",
  keywords: [
    // ── Virtual tour keywords ──
    "360 virtual house tour Sri Lanka",
    "virtual walkthrough construction Sri Lanka",
    "3D house tour Sri Lanka",
    "virtual home tour Anuradhapura",
    "360 degree house walkthrough Sri Lanka",
    "interactive house tour Sri Lanka",
    // ── Construction + location ──
    "house construction virtual tour Anuradhapura",
    "completed house tour Sri Lanka",
    "new home walkthrough Sri Lanka",
    "construction project virtual tour Sri Lanka",
    // ── Overseas diaspora ──
    "virtual house tour Sri Lanka for overseas",
    "view house remotely Sri Lanka",
    "build home Sri Lanka see before you build",
    "Sri Lankan expats virtual house tour",
    // ── Brand ──
    "Sri Ranjana Construction virtual tour",
    "construction Sri Lanka 360 view",
  ],
  openGraph: {
    title: "360° Virtual House Walkthrough | Sri Ranjana Construction | Sri Lanka",
    description:
      "Explore our completed homes in 360° from anywhere in the world. Perfect for Sri Lankans abroad planning to build their dream home in Anuradhapura or across Sri Lanka.",
    type: "website",
    locale: "en_LK",
    images: [
      {
        url: "/assets/hero.jpg",
        width: 1200,
        height: 630,
        alt: "Sri Ranjana Construction — 360° Virtual House Walkthrough",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "360° Virtual House Tour | Sri Ranjana Construction | Sri Lanka",
    description:
      "Explore completed homes in 360°. Ideal for Sri Lankans abroad building their dream home in Sri Lanka.",
    images: ["/assets/hero.jpg"],
  },
  alternates: {
    canonical: "/walkthrough",
  },
  other: {
    "geo.region":    "LK-7",
    "geo.placename": "Anuradhapura, Sri Lanka",
    "geo.position":  "8.3114;80.4037",
    "ICBM":          "8.3114, 80.4037",
  },
};

export default function WalkthroughPage() {
  return <WalkthroughClient />;
}