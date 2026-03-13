import type { Metadata } from "next";
import ContactClient from "./ContactClient";

export const metadata: Metadata = {
  title: "Contact Us | Sri Ranjana Construction | Anuradhapura, Sri Lanka",
  description:
    "Contact Sri Ranjana Construction for house construction, building projects, and renovations in Anuradhapura and across Sri Lanka. Get a free quote today — call or email us now.",
  keywords: [
    "contact construction company Sri Lanka",
    "construction company Anuradhapura",
    "house construction contact Sri Lanka",
    "building contractors Anuradhapura",
    "free construction quote Sri Lanka",
    "Sri Ranjana Construction contact",
    "construction inquiry Sri Lanka",
    "hire builders Anuradhapura",
  ],
  openGraph: {
    title: "Contact Sri Ranjana Construction | Anuradhapura, Sri Lanka",
    description:
      "Get in touch with Sri Ranjana Construction for house building, commercial construction, and renovation projects across Sri Lanka. Free consultation available.",
    type: "website",
    images: [
      {
        url: "/assets/hero.jpg",
        width: 1200,
        height: 630,
        alt: "Sri Ranjana Construction — Contact Us",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Sri Ranjana Construction | Anuradhapura",
    description:
      "Construction company in Anuradhapura, Sri Lanka. Contact us for a free quote.",
    images: ["/assets/hero.jpg"],
  },
  alternates: {
    canonical: "/contact",
  },
};

export default function ContactPage() {
  return <ContactClient />;
}