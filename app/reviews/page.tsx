"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Star, Quote, ArrowLeft, ThumbsUp, Award } from "lucide-react";

const filters = ["All", "5 Stars", "4 Stars", "Residential", "Commercial", "Interior", "Renovation"];

const reviews = [
  {
    name: "Mohammad Al-Farsi",
    initials: "MA",
    rating: 5,
    date: "January 2025",
    project: "Luxury Villa — Palm Estate",
    category: "Residential",
    image: "/assets/modern-villa.jpg",
    text: "BuildCraft transformed our vision into a stunning villa. Their attention to detail and professionalism is unmatched. The team delivered on time and within budget. I've built homes before with other contractors — this was a completely different level of service.",
    helpful: 24,
    verified: true,
    featured: true,
  },
  {
    name: "Layla Ahmed",
    initials: "LA",
    rating: 5,
    date: "March 2025",
    project: "Project Completion — Al Noor District",
    category: "Residential",
    image: "/assets/apartment.jpg",
    text: "We had an incomplete house that sat for 2 years. BuildCraft took over and finished it beautifully in just 4 months. I couldn't be happier with the result! The coordination between trades was flawless and the quality exceeded our expectations.",
    helpful: 18,
    verified: true,
    featured: false,
  },
  {
    name: "Robert & Jane Williams",
    initials: "RW",
    rating: 5,
    date: "November 2024",
    project: "Turnkey Home — Sunset Hills",
    category: "Residential",
    image: "/assets/apartment1.jpg",
    text: "From architectural design to the final handover, everything was seamless. The quality of construction is exceptional. Highly recommend BuildCraft to anyone looking for a reliable contractor. Our home is everything we dreamed of.",
    helpful: 31,
    verified: true,
    featured: false,
  },
  {
    name: "Khalid Al-Mansoori",
    initials: "KM",
    rating: 5,
    date: "August 2024",
    project: "Executive Office Fit-out — DIFC",
    category: "Interior",
    image: "/assets/apartment.jpg",
    text: "Our office transformation was brilliant. The team understood the brand aesthetic perfectly and delivered a sophisticated space that impresses every client who walks in. Finished 3 weeks early too!",
    helpful: 15,
    verified: true,
    featured: false,
  },
  {
    name: "Sarah Thompson",
    initials: "ST",
    rating: 5,
    date: "June 2024",
    project: "Heritage Renovation — Deira",
    category: "Renovation",
    image: "/assets/before.jpg",
    text: "Turning our 1980s villa into a modern family home felt impossible — BuildCraft made it a reality. They respected the character of the original structure while bringing it fully up to date. Stunning result.",
    helpful: 22,
    verified: true,
    featured: false,
  },
  {
    name: "Ahmed & Fatima Noor",
    initials: "AN",
    rating: 5,
    date: "April 2024",
    project: "Skyline Apartments — Downtown Dubai",
    category: "Commercial",
    image: "/assets/modern-villa.jpg",
    text: "We commissioned BuildCraft for our commercial apartment tower and they delivered beyond expectations. Project management was top-notch, costs were transparent, and the finishes are of premium quality.",
    helpful: 19,
    verified: true,
    featured: false,
  },
  {
    name: "James Harrington",
    initials: "JH",
    rating: 4,
    date: "February 2024",
    project: "Penthouse Interior — Palm Jumeirah",
    category: "Interior",
    image: "/assets/apartment1.jpg",
    text: "Excellent craftsmanship and great communication throughout. The marble work and custom joinery are absolutely beautiful. Minor delays in material delivery but the team kept us well informed every step of the way.",
    helpful: 11,
    verified: true,
    featured: false,
  },
  {
    name: "Amira Khalil",
    initials: "AK",
    rating: 5,
    date: "October 2024",
    project: "Villa Compound — Sharjah",
    category: "Residential",
    image: "/assets/hero.jpg",
    text: "Three villas, one compound, delivered perfectly. The landscaping, the pool area, the underground parking — every detail was executed with precision. My family is absolutely in love with our new home.",
    helpful: 27,
    verified: true,
    featured: false,
  },
  {
    name: "David & Monica Chen",
    initials: "DC",
    rating: 5,
    date: "December 2024",
    project: "Modern Home Build — Abu Dhabi",
    category: "Residential",
    image: "/assets/modern-villa.jpg",
    text: "Handed BuildCraft the keys to our land and they returned a masterpiece. Every room was designed with purpose, every material chosen with care. The smart home integration is seamless. Worth every dirham.",
    helpful: 33,
    verified: true,
    featured: false,
  },
];

const ratingBreakdown = [
  { stars: 5, count: 178, pct: 89 },
  { stars: 4, count: 16, pct: 8 },
  { stars: 3, count: 4, pct: 2 },
  { stars: 2, count: 1, pct: 0.5 },
  { stars: 1, count: 1, pct: 0.5 },
];

export default function ReviewsPage() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [helpfulClicked, setHelpfulClicked] = useState<Set<string>>(new Set());

  const filtered = reviews.filter((r) => {
    if (activeFilter === "All") return true;
    if (activeFilter === "5 Stars") return r.rating === 5;
    if (activeFilter === "4 Stars") return r.rating === 4;
    return r.category === activeFilter;
  });

  const toggleHelpful = (name: string) => {
    setHelpfulClicked((prev) => {
      const next = new Set(prev);
      next.has(name) ? next.delete(name) : next.add(name);
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-white">

      {/* Hero Header */}
      <div className="bg-primary py-20 px-6 relative overflow-hidden">
        <div className="absolute inset-0">
          <Image src="/assets/apartment.jpg" alt="Reviews" fill className="object-cover opacity-15" />
        </div>
        <div className="absolute -top-16 -right-16 w-72 h-72 rounded-full bg-accent/10" />
        <div className="absolute -bottom-8 -left-8 w-48 h-48 rounded-full bg-white/5" />

        <div className="container mx-auto relative z-10">
          <Link
            href="/#testimonials"
            className="inline-flex items-center gap-2 text-primary-foreground/60 hover:text-accent text-sm mb-8 transition-colors group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Link>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left — Title */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <p className="text-accent font-semibold tracking-widest uppercase text-sm mb-3">Client Reviews</p>
              <h1 className="font-heading text-4xl md:text-6xl font-bold text-primary-foreground mb-4">
                What Our Clients Say
              </h1>
              <p className="text-primary-foreground/70 text-lg">
                Real reviews from real clients. No filters, no edits — just honest feedback.
              </p>
            </motion.div>

            {/* Right — Rating summary */}
            <motion.div
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-7 border border-white/20"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="flex items-center gap-5 mb-6">
                <div>
                  <div className="font-heading text-6xl font-bold text-white">5.0</div>
                  <div className="flex gap-1 mt-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={16} className="text-accent fill-accent" />
                    ))}
                  </div>
                  <div className="text-primary-foreground/60 text-xs mt-1">200+ reviews</div>
                </div>
                <div className="flex-1 space-y-2">
                  {ratingBreakdown.map((r) => (
                    <div key={r.stars} className="flex items-center gap-2">
                      <span className="text-primary-foreground/60 text-xs w-4">{r.stars}</span>
                      <Star size={10} className="text-accent fill-accent shrink-0" />
                      <div className="flex-1 h-1.5 bg-white/20 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-accent rounded-full"
                          style={{ width: `${r.pct}%` }}
                        />
                      </div>
                      <span className="text-primary-foreground/50 text-xs w-6">{r.count}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2 text-primary-foreground/70 text-xs">
                <Award size={14} className="text-accent" />
                <span>98% of clients would recommend BuildCraft</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-border shadow-sm">
        <div className="container mx-auto px-6 py-4 flex items-center gap-3 overflow-x-auto scrollbar-none">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`shrink-0 px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                activeFilter === f
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "bg-secondary text-muted-foreground hover:bg-accent/10 hover:text-accent"
              }`}
            >
              {f}
            </button>
          ))}
          <span className="ml-auto shrink-0 text-muted-foreground text-sm">
            {filtered.length} review{filtered.length !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      {/* Reviews Grid */}
      <div className="container mx-auto px-6 py-16">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeFilter}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
          >
            {filtered.map((r, i) => (
              <motion.div
                key={r.name}
                className={`flex flex-col rounded-2xl overflow-hidden border transition-all duration-300 group
                  ${r.featured
                    ? "border-accent shadow-2xl ring-2 ring-accent"
                    : "border-border shadow-sm hover:shadow-lg"
                  }`}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
              >
                {/* Project image */}
                <div className="relative h-44 overflow-hidden">
                  <Image
                    src={r.image}
                    alt={r.project}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-black/60" />

                  {r.featured && (
                    <div className="absolute top-4 left-4 bg-accent text-accent-foreground text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1">
                      <Award size={10} /> Top Review
                    </div>
                  )}
                  {r.verified && (
                    <div className="absolute top-4 right-4 bg-white/90 text-foreground text-xs font-semibold px-2.5 py-1 rounded-full">
                      ✓ Verified
                    </div>
                  )}
                  <div className="absolute bottom-3 left-4 right-4">
                    <p className="text-white/80 text-xs">{r.project}</p>
                  </div>
                </div>

                {/* Content */}
                <div className={`flex flex-col flex-1 p-5 gap-3 ${r.featured ? "bg-primary" : "bg-white"}`}>
                  {/* Stars + date */}
                  <div className="flex items-center justify-between">
                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, idx) => (
                        <Star
                          key={idx}
                          size={13}
                          className={idx < r.rating ? "text-accent fill-accent" : "text-border fill-border"}
                        />
                      ))}
                    </div>
                    <span className={`text-xs ${r.featured ? "text-primary-foreground/50" : "text-muted-foreground"}`}>
                      {r.date}
                    </span>
                  </div>

                  {/* Quote */}
                  <Quote size={20} className={r.featured ? "text-accent/50" : "text-accent/30"} />

                  {/* Text */}
                  <p className={`text-sm leading-relaxed italic flex-1 ${r.featured ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                    "{r.text}"
                  </p>

                  {/* Author + helpful */}
                  <div className={`flex items-center justify-between pt-3 border-t ${r.featured ? "border-white/10" : "border-border"}`}>
                    <div className="flex items-center gap-2.5">
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center font-heading font-bold text-xs shrink-0
                        ${r.featured ? "bg-accent/20 text-accent" : "bg-accent/10 text-accent"}`}>
                        {r.initials}
                      </div>
                      <div>
                        <p className={`font-heading font-semibold text-xs ${r.featured ? "text-primary-foreground" : "text-foreground"}`}>
                          {r.name}
                        </p>
                        <p className={`text-xs ${r.featured ? "text-primary-foreground/50" : "text-muted-foreground"}`}>
                          {r.category}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => toggleHelpful(r.name)}
                      className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border transition-all ${
                        helpfulClicked.has(r.name)
                          ? "bg-accent text-accent-foreground border-accent"
                          : r.featured
                            ? "border-white/20 text-primary-foreground/50 hover:border-accent hover:text-accent"
                            : "border-border text-muted-foreground hover:border-accent hover:text-accent"
                      }`}
                    >
                      <ThumbsUp size={11} />
                      {helpfulClicked.has(r.name) ? r.helpful + 1 : r.helpful}
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {filtered.length === 0 && (
          <div className="text-center py-24 text-muted-foreground">No reviews found.</div>
        )}
      </div>

      {/* Leave a Review CTA */}
      <div className="bg-[hsl(215,20%,97%)] py-20 px-6">
        <div className="container mx-auto">
          <motion.div
            className="grid md:grid-cols-2 gap-8 items-center bg-white rounded-3xl p-10 shadow-md border border-border"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div>
              <p className="text-accent font-semibold tracking-widest uppercase text-xs mb-2">Share Your Experience</p>
              <h2 className="font-heading text-3xl font-bold text-foreground mb-3">
                Worked With Us?
              </h2>
              <p className="text-muted-foreground text-sm leading-relaxed">
                We'd love to hear about your experience with BuildCraft. Your feedback helps us grow and helps future clients make confident decisions.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 md:justify-end">
              <Link
                href="/#contact"
                className="inline-flex items-center justify-center gap-2 bg-accent text-accent-foreground px-7 py-3.5 rounded-xl font-semibold text-sm hover:brightness-110 transition shadow-md group"
              >
                Leave a Review
                <Star size={15} className="fill-accent-foreground" />
              </Link>
              <Link
                href="/#contact"
                className="inline-flex items-center justify-center gap-2 border-2 border-primary text-primary px-7 py-3.5 rounded-xl font-semibold text-sm hover:bg-primary hover:text-primary-foreground transition group"
              >
                Get a Free Quote
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

    </div>
  );
}
