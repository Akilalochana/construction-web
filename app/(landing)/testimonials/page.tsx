import type { Metadata } from "next";
import TestimonialsClient from "./TestimonialsClient";

export const metadata: Metadata = {
  title: "Client Testimonials | Sri Ranjana Construction | Anuradhapura, Sri Lanka",
  description:
    "Read what our clients say about Sri Ranjana Construction — trusted house builders and construction company in Anuradhapura, Sri Lanka. 200+ happy clients. 5-star rated construction services for Sri Lankans at home and abroad.",
  keywords: [
    // ── Review / trust keywords ──
    "construction company reviews Anuradhapura",
    "best construction company Sri Lanka reviews",
    "Sri Ranjana Construction testimonials",
    "trusted builders Sri Lanka",
    "reliable construction company Anuradhapura",
    "5 star construction company Sri Lanka",
    "happy clients construction Sri Lanka",
    "house construction testimonials Sri Lanka",
    // ── Local keywords ──
    "construction company Anuradhapura Sri Lanka",
    "home builders reviews Sri Lanka",
    "building contractors reviews Sri Lanka",
    // ── Overseas diaspora ──
    "construction company Sri Lanka overseas clients",
    "build house Sri Lanka reviews expats",
  ],
  openGraph: {
    title: "Client Testimonials | Sri Ranjana Construction | Sri Lanka",
    description:
      "200+ happy clients across Sri Lanka. See what homeowners and Sri Lankans living abroad say about building their dream homes with Sri Ranjana Construction.",
    type: "website",
    locale: "en_LK",
    images: [
      {
        url: "/assets/hero.jpg",
        width: 1200,
        height: 630,
        alt: "Sri Ranjana Construction — Happy Clients Testimonials",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Client Testimonials | Sri Ranjana Construction | Anuradhapura",
    description:
      "200+ happy clients. Trusted construction company in Sri Lanka.",
    images: ["/assets/hero.jpg"],
  },
  alternates: {
    canonical: "/testimonials",
  },
  other: {
    "geo.region":    "LK-7",
    "geo.placename": "Anuradhapura, Sri Lanka",
    "geo.position":  "8.3114;80.4037",
    "ICBM":          "8.3114, 80.4037",
  },
};

export default function TestimonialsPage() {
  return <TestimonialsClient />;
}