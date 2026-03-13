import type { Metadata } from "next";
import ReviewsClient from "./ReviewsClient";

export const metadata: Metadata = {
  title: "Client Reviews | Sri Ranjana Construction | Sri Lanka",
  description:
    "Read verified client reviews for Sri Ranjana Construction — trusted house builders and construction company in Anuradhapura and across Sri Lanka. 5-star rated construction services.",
  keywords: [
    "construction company reviews Sri Lanka",
    "Sri Ranjana Construction reviews",
    "best construction company Sri Lanka",
    "trusted builders Anuradhapura",
    "house construction reviews Sri Lanka",
    "5 star construction company Sri Lanka",
    "client testimonials construction Sri Lanka",
    "reliable builders Sri Lanka",
    "top rated construction Anuradhapura",
    "construction company feedback Sri Lanka",
  ],
  openGraph: {
    title: "Client Reviews | Sri Ranjana Construction | Sri Lanka",
    description:
      "5-star rated construction company in Sri Lanka. Read what our clients say about our house building, commercial construction, and renovation services.",
    type: "website",
    images: [
      {
        url: "/assets/apartment.jpg",
        width: 1200,
        height: 630,
        alt: "Sri Ranjana Construction — Client Reviews",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Client Reviews | Sri Ranjana Construction",
    description:
      "Verified reviews from clients across Sri Lanka. Trusted construction company in Anuradhapura.",
    images: ["/assets/apartment.jpg"],
  },
  alternates: {
    canonical: "/reviews",
  },
};

export default function ReviewsPage() {
  return <ReviewsClient />;
}