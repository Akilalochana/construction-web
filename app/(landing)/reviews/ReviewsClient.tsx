"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Star, Quote, ArrowLeft, ThumbsUp, Award, Loader2 } from "lucide-react";
import { ReviewFormWithGoogle } from "@/components/review-form-with-google";

type Review = {
  id: number;
  name: string;
  initials: string;
  role: string;
  rating: number;
  project: string;
  text: string;
  createdAt: string;
};

const FILTERS = ["All", "5 Stars", "4 Stars", "3 Stars"];

const ratingBreakdown = [
  { stars: 5, count: 178, pct: 89 },
  { stars: 4, count: 16,  pct: 8  },
  { stars: 3, count: 4,   pct: 2  },
  { stars: 2, count: 1,   pct: 0.5 },
  { stars: 1, count: 1,   pct: 0.5 },
];

// ── Star row helper ───────────────────────────────────────────────────────────
function Stars({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map((s) => (
        <Star key={s} size={size}
          className={s <= rating ? "fill-amber-400 text-amber-400" : "fill-gray-200 text-gray-200"} />
      ))}
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function ReviewsPage() {
  const [reviews, setReviews]               = useState<Review[]>([]);
  const [loading, setLoading]               = useState(true);
  const [activeFilter, setActiveFilter]     = useState("All");
  const [helpfulClicked, setHelpfulClicked] = useState<Set<number>>(new Set());

  useEffect(() => {
    fetch("/api/reviews")
      .then((r) => r.json())
      .then((d) => setReviews(d.data?.reviews ?? []))
      .catch(() => setReviews([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = reviews.filter((r) => {
    if (activeFilter === "5 Stars") return r.rating === 5;
    if (activeFilter === "4 Stars") return r.rating === 4;
    if (activeFilter === "3 Stars") return r.rating === 3;
    return true;
  });

  const toggleHelpful = (id: number) =>
    setHelpfulClicked((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  return (
    <div className="min-h-screen bg-[hsl(215,20%,97%)]">

      {/* ── Hero ── */}
      <div className="bg-primary py-14 sm:py-20 px-4 sm:px-6 relative overflow-hidden">
        <div className="absolute inset-0">
          <Image src="/assets/apartment.jpg" alt="" fill className="object-cover opacity-10" />
        </div>
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-accent/10" />
        <div className="absolute -bottom-10 -left-10 w-52 h-52 rounded-full bg-white/5" />

        <div className="container mx-auto relative z-10">
          <Link href="/#testimonials"
            className="inline-flex items-center gap-2 text-primary-foreground/50 hover:text-accent text-sm mb-8 transition-colors group">
            <ArrowLeft size={15} className="group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Link>

          <div className="grid lg:grid-cols-2 gap-10 items-start">
            {/* Left */}
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <p className="text-accent font-semibold tracking-widest uppercase text-xs mb-3">Client Reviews</p>
              <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
                What Our Clients Say
              </h1>
              <p className="text-primary-foreground/60 mb-8 leading-relaxed">
                Real reviews from real clients. No filters, no edits — just honest feedback.
              </p>

              {/* Rating card */}
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/15">
                <div className="flex items-center gap-5 mb-4">
                  <div>
                    <div className="font-heading text-5xl font-bold text-white leading-none">5.0</div>
                    <div className="flex gap-0.5 mt-2">
                      {[1,2,3,4,5].map((s) => <Star key={s} size={14} className="fill-accent text-accent" />)}
                    </div>
                    <div className="text-white/40 text-xs mt-1.5">
                      {loading ? "—" : `${reviews.length} verified reviews`}
                    </div>
                  </div>
                  <div className="flex-1 space-y-1.5">
                    {ratingBreakdown.map((rb) => (
                      <div key={rb.stars} className="flex items-center gap-2">
                        <span className="text-white/40 text-xs w-3">{rb.stars}</span>
                        <Star size={9} className="fill-accent text-accent shrink-0" />
                        <div className="flex-1 h-1.5 bg-white/15 rounded-full overflow-hidden">
                          <div className="h-full bg-accent rounded-full transition-all" style={{ width: `${rb.pct}%` }} />
                        </div>
                        <span className="text-white/30 text-xs w-5 text-right">{rb.count}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-2 text-white/50 text-xs border-t border-white/10 pt-3">
                  <Award size={13} className="text-accent" />
                  98% of clients would recommend BuildCraft
                </div>
              </div>
            </motion.div>

            {/* Right — Submit form */}
            <motion.div
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 sm:p-6 border border-white/15"
              initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}>
              <div className="flex items-start justify-between mb-5">
                <div>
                  <h2 className="font-heading font-bold text-white text-lg leading-tight">Share Your Experience</h2>
                  <p className="text-white/40 text-xs mt-1">Sign in with Google and submit a review</p>
                </div>
                <div className="flex gap-0.5 mt-1">
                  {[1,2,3,4,5].map((s) => <Star key={s} size={13} className="fill-accent text-accent" />)}
                </div>
              </div>
              <ReviewFormWithGoogle />
            </motion.div>
          </div>
        </div>
      </div>

      {/* ── Filter ── */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-border shadow-sm">
        <div className="container mx-auto px-6 py-3.5 flex items-center gap-2.5 overflow-x-auto scrollbar-none">
          {FILTERS.map((f) => (
            <button key={f} onClick={() => setActiveFilter(f)}
              className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${
                activeFilter === f
                  ? "bg-primary text-primary-foreground shadow"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}>
              {f}
            </button>
          ))}
          <span className="ml-auto shrink-0 text-muted-foreground text-sm">
            {loading ? "—" : `${filtered.length} review${filtered.length !== 1 ? "s" : ""}`}
          </span>
        </div>
      </div>

      {/* ── Cards ── */}
      <div className="container mx-auto px-6 py-14">
        {loading && (
          <div className="flex justify-center py-20">
            <Loader2 size={32} className="animate-spin text-muted-foreground" />
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="text-center py-24 text-muted-foreground text-sm">No reviews yet.</div>
        )}

        {!loading && filtered.length > 0 && (
          <AnimatePresence mode="wait">
            <motion.div key={activeFilter} className="grid md:grid-cols-2 lg:grid-cols-3 gap-5"
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
              {filtered.map((r, i) => (
                <motion.div key={r.id}
                  className="bg-white rounded-2xl border border-border shadow-sm hover:shadow-md transition-shadow flex flex-col"
                  initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: i * 0.05 }}>

                  {/* Card header */}
                  <div className="p-5 pb-4 flex items-start gap-3 border-b border-border">
                    {/* Initials avatar */}
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[hsl(220,60%,14%)] to-[hsl(220,50%,28%)] flex items-center justify-center shrink-0">
                      <span className="font-heading font-bold text-white text-sm">{r.initials}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-heading font-semibold text-foreground text-sm leading-tight">{r.name}</p>
                      {r.role && <p className="text-muted-foreground text-xs mt-0.5">{r.role}</p>}
                      <div className="flex items-center gap-2 mt-1.5">
                        <Stars rating={r.rating} size={12} />
                        <span className="text-muted-foreground text-xs">
                          {new Date(r.createdAt).toLocaleDateString("en-GB", { month: "short", year: "numeric" })}
                        </span>
                      </div>
                    </div>
                    {/* Verified badge */}
                    <span className="shrink-0 bg-green-50 text-green-700 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-green-200">
                      ✓ Verified
                    </span>
                  </div>

                  {/* Review body */}
                  <div className="p-5 flex-1 flex flex-col gap-3">
                    <Quote size={18} className="text-accent/25" />
                    <p className="text-muted-foreground text-sm leading-relaxed italic flex-1">
                      "{r.text}"
                    </p>
                    {r.project && (
                      <p className="text-xs text-accent font-medium truncate">📋 {r.project}</p>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="px-5 pb-4 flex items-center justify-between">
                    <span className="text-muted-foreground text-xs">Was this helpful?</span>
                    <button onClick={() => toggleHelpful(r.id)}
                      className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border transition-all ${
                        helpfulClicked.has(r.id)
                          ? "bg-accent text-accent-foreground border-accent"
                          : "border-border text-muted-foreground hover:border-accent hover:text-accent"
                      }`}>
                      <ThumbsUp size={11} />
                      {helpfulClicked.has(r.id) ? i + 13 : i + 12}
                    </button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}