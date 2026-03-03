"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, Clock, Star, Trash2, Filter, Eye } from "lucide-react";

type Status = "pending" | "approved" | "rejected";

interface Review {
  id: number;
  name: string;
  initials: string;
  role: string;
  rating: number;
  project: string;
  text: string;
  date: string;
  status: Status;
}

const initialReviews: Review[] = [
  { id: 1, name: "Sarah Mitchell", initials: "SM", role: "Homeowner", rating: 5, project: "Modern Villa",      text: "Absolutely stunning results. The team transformed our house beyond expectations — every detail was perfect.", date: "2024-03-10", status: "approved" },
  { id: 2, name: "James Thornton", initials: "JT", role: "Developer",   rating: 5, project: "City Center",    text: "Professional, on time, and within budget. The commercial fit-out exceeded expectations.", date: "2024-03-05", status: "approved" },
  { id: 3, name: "Fatima Al-Said",  initials: "FA", role: "Investor",   rating: 4, project: "Penthouse Reno",  text: "Beautiful finishes and craftsmanship. A few minor delays but the outcome was worth every day.", date: "2024-03-01", status: "approved" },
  { id: 4, name: "Carlos Rivera",   initials: "CR", role: "Homeowner",  rating: 5, project: "Kitchen Remodel",  text: "Our kitchen is now the centrepiece of the home. Highly recommend — these guys truly care about quality.", date: "2024-04-20", status: "pending" },
  { id: 5, name: "Layla Hassan",    initials: "LH", role: "Buyer",      rating: 5, project: "Hillside Estate", text: "From design to handover the experience was seamless. Will definitely use them for our next project.", date: "2024-04-18", status: "pending" },
  { id: 6, name: "Tom Nguyen",      initials: "TN", role: "Developer",  rating: 3, project: "Office Fit-Out", text: "Good work overall but communication could be improved. End product looks great though.", date: "2024-04-15", status: "pending" },
  { id: 7, name: "Aisha Karim",     initials: "AK", role: "Homeowner",  rating: 5, project: "Living Room",    text: "Incredible attention to detail. They listened to our ideas and delivered something even better.", date: "2024-02-22", status: "approved" },
  { id: 8, name: "Ravi Patel",      initials: "RP", role: "Investor",   rating: 2, project: "Storage Unit",   text: "Disappointed with the timeline — 4 weeks late. Quality is fine but not worth the wait.", date: "2024-04-12", status: "rejected" },
  { id: 9, name: "Emily Ford",      initials: "EF", role: "Homeowner",  rating: 4, project: "Master Bath",    text: "Love the new bathroom. Very clean work. There were a few items on the punch list but resolved quickly.", date: "2024-03-28", status: "approved" },
];

const statusConfig: Record<Status, { label: string; bg: string; text: string; icon: React.ReactNode }> = {
  pending:  { label: "Pending",  bg: "bg-amber-50",  text: "text-amber-700",  icon: <Clock size={13}    className="text-amber-500" /> },
  approved: { label: "Approved", bg: "bg-green-50",  text: "text-green-700",  icon: <CheckCircle size={13} className="text-green-500" /> },
  rejected: { label: "Rejected", bg: "bg-red-50",    text: "text-red-600",    icon: <XCircle size={13}  className="text-red-500" /> },
};

const filters: { label: string; value: Status | "all" }[] = [
  { label: "All",      value: "all" },
  { label: "Pending",  value: "pending" },
  { label: "Approved", value: "approved" },
  { label: "Rejected", value: "rejected" },
];

function StarRow({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map((s) => (
        <Star key={s} size={13} className={s <= rating ? "fill-amber-400 text-amber-400" : "text-gray-200"} />
      ))}
    </div>
  );
}

export default function AdminReviews() {
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [filter, setFilter] = useState<Status | "all">("all");
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [viewId, setViewId] = useState<number | null>(null);

  const filtered = filter === "all" ? reviews : reviews.filter((r) => r.status === filter);
  const counts = { all: reviews.length, pending: reviews.filter((r)=>r.status==="pending").length, approved: reviews.filter((r)=>r.status==="approved").length, rejected: reviews.filter((r)=>r.status==="rejected").length };

  const setStatus = (id: number, status: Status) => setReviews((prev) => prev.map((r) => r.id === id ? { ...r, status } : r));
  const deleteReview = (id: number) => { setReviews((prev) => prev.filter((r) => r.id !== id)); setDeleteId(null); };

  const viewReview = reviews.find((r) => r.id === viewId);

  return (
    <div className="max-w-5xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">Reviews</h1>
          <p className="text-muted-foreground text-sm mt-1">Approve or reject customer reviews before they appear publicly</p>
        </div>
      </div>

      {/* Stat chips */}
      <div className="flex gap-3 flex-wrap">
        {[
          { label: "Pending", count: counts.pending,  bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-400" },
          { label: "Approved", count: counts.approved, bg: "bg-green-50", text: "text-green-700", dot: "bg-green-400" },
          { label: "Rejected", count: counts.rejected, bg: "bg-red-50",   text: "text-red-600",   dot: "bg-red-400" },
        ].map((s) => (
          <div key={s.label} className={`${s.bg} ${s.text} px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2`}>
            <span className={`w-2 h-2 rounded-full ${s.dot}`} />
            {s.count} {s.label}
          </div>
        ))}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 bg-secondary/40 rounded-xl p-1 w-fit">
        <Filter size={14} className="text-muted-foreground ml-2" />
        {filters.map((f) => (
          <button key={f.value} onClick={() => setFilter(f.value)}
            className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${filter === f.value ? "bg-white shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}>
            {f.label} <span className="ml-1 text-xs opacity-60">{counts[f.value]}</span>
          </button>
        ))}
      </div>

      {/* Review Cards */}
      <div className="space-y-3">
        <AnimatePresence>
          {filtered.map((r, i) => {
            const cfg = statusConfig[r.status];
            return (
              <motion.div key={r.id} className="bg-white rounded-2xl border border-border p-5 shadow-sm"
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ delay: i * 0.04 }}>
                <div className="flex items-start gap-4">
                  {/* Avatar */}
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[hsl(220,60%,14%)] to-[hsl(220,50%,28%)] flex items-center justify-center flex-shrink-0">
                    <span className="font-heading font-bold text-white/90 text-sm">{r.initials}</span>
                  </div>
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="font-heading font-semibold text-foreground text-sm">{r.name}</span>
                      <span className="text-muted-foreground text-xs">{r.role}</span>
                      <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-semibold ${cfg.bg} ${cfg.text}`}>
                        {cfg.icon} {cfg.label}
                      </div>
                    </div>
                    <div className="flex items-center gap-3 mb-2">
                      <StarRow rating={r.rating} />
                      <span className="text-muted-foreground text-xs">Project: <strong className="text-foreground">{r.project}</strong></span>
                      <span className="text-muted-foreground text-xs">{new Date(r.date).toLocaleDateString("en-GB", { day:"numeric", month:"short", year:"numeric" })}</span>
                    </div>
                    <p className="text-muted-foreground text-sm line-clamp-2">{r.text}</p>
                  </div>
                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                    <button onClick={() => setViewId(r.id)} title="View" className="w-8 h-8 rounded-lg border border-border hover:bg-secondary flex items-center justify-center transition">
                      <Eye size={14} className="text-muted-foreground" />
                    </button>
                    {r.status !== "approved" && (
                      <button onClick={() => setStatus(r.id, "approved")} title="Approve"
                        className="w-8 h-8 rounded-lg bg-green-50 hover:bg-green-100 flex items-center justify-center transition">
                        <CheckCircle size={15} className="text-green-600" />
                      </button>
                    )}
                    {r.status !== "rejected" && (
                      <button onClick={() => setStatus(r.id, "rejected")} title="Reject"
                        className="w-8 h-8 rounded-lg bg-red-50 hover:bg-red-100 flex items-center justify-center transition">
                        <XCircle size={15} className="text-red-500" />
                      </button>
                    )}
                    <button onClick={() => setDeleteId(r.id)} title="Delete"
                      className="w-8 h-8 rounded-lg bg-red-50 hover:bg-red-100 flex items-center justify-center transition">
                      <Trash2 size={14} className="text-red-500" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
        {filtered.length === 0 && (
          <div className="text-center py-16 text-muted-foreground text-sm">No reviews in this category.</div>
        )}
      </div>

      {/* View Modal */}
      <AnimatePresence>
        {viewReview && (
          <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setViewId(null)}>
            <motion.div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl"
              initial={{ scale: 0.95 }} animate={{ scale: 1 }} onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-heading font-bold text-lg text-foreground">Review Detail</h2>
                <button onClick={() => setViewId(null)} className="w-8 h-8 rounded-lg hover:bg-secondary flex items-center justify-center">✕</button>
              </div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[hsl(220,60%,14%)] to-[hsl(220,50%,28%)] flex items-center justify-center">
                  <span className="font-heading font-bold text-white text-sm">{viewReview.initials}</span>
                </div>
                <div>
                  <p className="font-heading font-semibold text-foreground">{viewReview.name}</p>
                  <p className="text-muted-foreground text-xs">{viewReview.role} · {viewReview.project}</p>
                </div>
              </div>
              <StarRow rating={viewReview.rating} />
              <p className="text-foreground text-sm mt-3 leading-relaxed">{viewReview.text}</p>
              <p className="text-muted-foreground text-xs mt-3">{new Date(viewReview.date).toLocaleDateString("en-GB", { weekday:"long", day:"numeric", month:"long", year:"numeric" })}</p>
              <div className="flex gap-3 mt-5">
                {viewReview.status !== "approved" && (
                  <button onClick={() => { setStatus(viewReview.id, "approved"); setViewId(null); }}
                    className="flex-1 py-2.5 rounded-xl bg-green-600 text-white text-sm font-semibold hover:bg-green-700 transition flex items-center justify-center gap-2">
                    <CheckCircle size={15} /> Approve
                  </button>
                )}
                {viewReview.status !== "rejected" && (
                  <button onClick={() => { setStatus(viewReview.id, "rejected"); setViewId(null); }}
                    className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition flex items-center justify-center gap-2">
                    <XCircle size={15} /> Reject
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirm */}
      <AnimatePresence>
        {deleteId && (
          <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl text-center"
              initial={{ scale: 0.9 }} animate={{ scale: 1 }}>
              <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4"><Trash2 size={24} className="text-red-500" /></div>
              <h3 className="font-heading font-bold text-foreground text-lg mb-2">Delete Review?</h3>
              <p className="text-muted-foreground text-sm mb-5">This review will be permanently removed and cannot be recovered.</p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteId(null)} className="flex-1 py-2.5 rounded-xl border border-border text-sm font-semibold hover:bg-secondary transition">Cancel</button>
                <button onClick={() => deleteReview(deleteId)} className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition">Delete</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
