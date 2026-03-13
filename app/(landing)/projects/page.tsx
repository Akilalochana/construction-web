import type { Metadata } from "next";
import ProjectsClient from "./ProjectsClient";

export const metadata: Metadata = {
  title: "Construction Projects | Sri Ranjana Construction | Sri Lanka",
  description:
    "Explore completed house construction, commercial building, interior, and renovation projects by Sri Ranjana Construction across Sri Lanka — including Anuradhapura, Colombo, and beyond.",
  keywords: [
    "construction projects Sri Lanka",
    "house construction Sri Lanka",
    "building construction Anuradhapura",
    "residential construction projects Sri Lanka",
    "commercial building construction Sri Lanka",
    "home builders Sri Lanka portfolio",
    "renovation projects Sri Lanka",
    "turnkey construction Sri Lanka",
    "completed buildings Anuradhapura",
    "Sri Ranjana Construction portfolio",
    "construction company projects Sri Lanka",
  ],
  openGraph: {
    title: "Our Projects | Sri Ranjana Construction | Sri Lanka",
    description:
      "Residential homes, commercial buildings, interior fit-outs, and renovations across Sri Lanka. View our completed construction projects.",
    type: "website",
    images: [
      {
        url: "/assets/hero.jpg",
        width: 1200,
        height: 630,
        alt: "Sri Ranjana Construction — Projects Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Construction Projects | Sri Ranjana Construction",
    description:
      "House construction, commercial buildings, and renovations across Sri Lanka.",
    images: ["/assets/hero.jpg"],
  },
  alternates: {
    canonical: "/projects",
  },
};

export default function ProjectsPage() {
  return <ProjectsClient />;
}