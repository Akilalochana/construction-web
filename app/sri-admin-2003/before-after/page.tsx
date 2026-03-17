"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, Pencil, Trash2, X, Save, Upload, Loader2, CheckCircle, MapPin, Calendar,
} from "lucide-react";

// ── Type ──────────────────────────────────────────────────────────────────────
type Comparison = {
  id: number;
  title: string;
  location?: string;
  year?: string;
  beforeImage: string;
  afterImage: string;
  order: number;
};

type FormState = {
  title: string;
  location: string;
  year: string;
  order: string;
  beforeFile: File | null;
  beforePreview: string;
  afterFile: File | null;
  afterPreview: string;
};

const emptyForm: FormState = {
  title: "",
  location: "",
  year: new Date().getFullYear().toString(),
  order: "1",
  beforeFile: null,
  beforePreview: "",
  afterFile: null,
  afterPreview: "",
};

// ── Component ─────────────────────────────────────────────────────────────────
export default function AdminBeforeAfter() {
  const [comparisons, setComparisons] = useState<Comparison[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  // Hidden file inputs
  const beforeInputRef = useRef<HTMLInputElement>(null);
  const afterInputRef = useRef<HTMLInputElement>(null);

  // ── Load ────────────────────────────────────────────────────────────────────
  useEffect(() => { fetchComparisons(); }, []);

  const fetchComparisons = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/before-after");
      const data = await res.json();
      setComparisons(data.data?.comparisons ?? []);
    } catch {
      setError("Failed to load comparisons.");
    } finally {
      setLoading(false);
    }
  };

  // ── Open modals ─────────────────────────────────────────────────────────────
  const openAdd = () => {
    setForm(emptyForm);
    setEditingId(null);
    setError(null);
    setShowModal(true);
  };

  const openEdit = (c: Comparison) => {
    setForm({
      title: c.title,
      location: c.location ?? "",
      year: c.year ?? "",
      order: String(c.order),
      beforeFile: null,
      beforePreview: `/api/files/${c.beforeImage}`,
      afterFile: null,
      afterPreview: `/api/files/${c.afterImage}`,
    });
    setEditingId(c.id);
    setError(null);
    setShowModal(true);
  };

  const closeModal = () => {
    // Blob URLs free 
    if (form.beforePreview.startsWith("blob:")) URL.revokeObjectURL(form.beforePreview);
    if (form.afterPreview.startsWith("blob:")) URL.revokeObjectURL(form.afterPreview);
    setShowModal(false);
    setEditingId(null);
    setError(null);
  };

  // ── Image pick ──────────────────────────────────────────────────────────────
  const handleImageChange = (
    type: "before" | "after",
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setForm((prev) => {
      // Revoke old blob URL
      const oldPreview = type === "before" ? prev.beforePreview : prev.afterPreview;
      if (oldPreview.startsWith("blob:")) URL.revokeObjectURL(oldPreview);

      return type === "before"
        ? { ...prev, beforeFile: file, beforePreview: URL.createObjectURL(file) }
        : { ...prev, afterFile: file, afterPreview: URL.createObjectURL(file) };
    });
  };

  // ── Save ────────────────────────────────────────────────────────────────────
  const handleSave = async () => {
    if (!form.title.trim()) { setError("Title is required."); return; }
    if (!editingId && !form.beforeFile) { setError("Before image is required."); return; }
    if (!editingId && !form.afterFile) { setError("After image is required."); return; }

    setSaving(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("location", form.location);
      formData.append("year", form.year);
      formData.append("order", form.order || "1");
      if (form.beforeFile) formData.append("beforeImage", form.beforeFile);
      if (form.afterFile) formData.append("afterImage", form.afterFile);

      const url = editingId
        ? `/api/admin/before-after/${editingId}`
        : "/api/admin/before-after";

      const res = await fetch(url, {
        method: editingId ? "PUT" : "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.validations) {
          setError(Object.values(data.validations).join(", "));
        } else {
          setError(data.message || "Something went wrong.");
        }
        return;
      }

      await fetchComparisons();
      closeModal();
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  // ── Delete ──────────────────────────────────────────────────────────────────
  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/before-after/${deleteId}`, { method: "DELETE" });
      if (!res.ok) { setError("Failed to delete."); return; }
      setComparisons((prev) => prev.filter((c) => c.id !== deleteId));
      setDeleteId(null);
    } catch {
      setError("Network error.");
    } finally {
      setDeleting(false);
    }
  };

  // ── UI ───────────────────────────────────────────────────────────────────────
  return (
    <div className="max-w-5xl space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">Before & After</h1>
          <p className="text-muted-foreground text-sm mt-1">{comparisons.length} comparisons total</p>
        </div>
        <div className="flex items-center gap-3">
          {saved && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="flex items-center gap-1.5 text-green-600 text-sm font-medium">
              <CheckCircle size={16} /> Saved!
            </motion.div>
          )}
          <button onClick={openAdd}
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-primary/90 transition">
            <Plus size={16} /> Add Comparison
          </button>
        </div>
      </div>

      {error && !showModal && (
        <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl border border-red-200">{error}</div>
      )}

      {/* Grid */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 size={32} className="animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {comparisons.map((c, i) => (
            <motion.div key={c.id}
              className="bg-white border border-border rounded-2xl overflow-hidden shadow-sm group"
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}>

              {/* Before/After image preview — side by side */}
              <div className="relative h-44 flex">
                <div className="relative w-1/2 overflow-hidden">
                  <img src={`/api/files/${c.beforeImage}`} alt="Before"
                    className="w-full h-full object-cover" />
                  <span className="absolute top-2 left-2 bg-primary/80 text-primary-foreground text-[10px] font-bold px-2 py-0.5 rounded">
                    BEFORE
                  </span>
                </div>
                {/* Divider line */}
                <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-accent z-10" />
                <div className="relative w-1/2 overflow-hidden">
                  <img src={`/api/files/${c.afterImage}`} alt="After"
                    className="w-full h-full object-cover" />
                  <span className="absolute top-2 right-2 bg-accent text-accent-foreground text-[10px] font-bold px-2 py-0.5 rounded">
                    AFTER
                  </span>
                </div>

                {/* Edit/Delete buttons */}
                <div className="absolute top-2 left-1/2 -translate-x-1/2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                  <button onClick={() => openEdit(c)}
                    className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow hover:bg-blue-50 transition">
                    <Pencil size={13} className="text-blue-600" />
                  </button>
                  <button onClick={() => setDeleteId(c.id)}
                    className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow hover:bg-red-50 transition">
                    <Trash2 size={13} className="text-red-500" />
                  </button>
                </div>
              </div>

              {/* Info */}
              <div className="p-4">
                <p className="font-heading font-bold text-foreground text-sm">{c.title}</p>
                <div className="flex items-center gap-3 mt-1">
                  {c.location && (
                    <span className="flex items-center gap-1 text-muted-foreground text-xs">
                      <MapPin size={11} />{c.location}
                    </span>
                  )}
                  {c.year && (
                    <span className="flex items-center gap-1 text-muted-foreground text-xs">
                      <Calendar size={11} />{c.year}
                    </span>
                  )}
                  <span className="ml-auto text-xs text-muted-foreground">Order: {c.order}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {!loading && comparisons.length === 0 && (
        <div className="text-center py-20 text-muted-foreground text-sm">
          No comparisons yet. Click "Add Comparison" to create one.
        </div>
      )}

      {/* ── Add/Edit Modal ── */}
      <AnimatePresence>
        {showModal && (
          <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95 }}>

              <div className="flex items-center justify-between mb-5">
                <h2 className="font-heading text-xl font-bold text-foreground">
                  {editingId ? "Edit Comparison" : "Add New Comparison"}
                </h2>
                <button onClick={closeModal}
                  className="w-8 h-8 rounded-lg hover:bg-secondary flex items-center justify-center">
                  <X size={18} />
                </button>
              </div>

              {error && (
                <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl border border-red-200 mb-4">
                  {error}
                </div>
              )}

              <div className="space-y-4">

                {/* Title */}
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">Title *</label>
                  <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                    placeholder="e.g. Heritage Villa Renovation"
                    className="w-full border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                </div>

                {/* Location + Year */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">Location</label>
                    <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })}
                      placeholder="e.g. Dubai"
                      className="w-full border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">Year</label>
                    <input value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })}
                      placeholder="2024"
                      className="w-full border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                  </div>
                </div>

                {/* Before + After image upload — side by side */}
                <div className="grid grid-cols-2 gap-3">
                  {(["before", "after"] as const).map((type) => {
                    const preview = type === "before" ? form.beforePreview : form.afterPreview;
                    const inputRef = type === "before" ? beforeInputRef : afterInputRef;
                    const label = type === "before" ? "Before Image" : "After Image";
                    const required = !editingId;

                    return (
                      <div key={type}>
                        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">
                          {label} {required && "*"}
                        </label>
                        {preview && (
                          <div className="relative h-24 rounded-xl overflow-hidden mb-2 border border-border">
                            <img src={preview} alt={label} className="w-full h-full object-cover" />
                            <span className={`absolute top-1.5 left-1.5 text-[10px] font-bold px-2 py-0.5 rounded ${type === "before" ? "bg-primary/80 text-white" : "bg-accent text-accent-foreground"}`}>
                              {type.toUpperCase()}
                            </span>
                          </div>
                        )}
                        <input ref={inputRef} type="file"
                          accept="image/jpeg,image/png,image/webp"
                          onChange={(e) => handleImageChange(type, e)}
                          className="hidden" />
                        <button onClick={() => inputRef.current?.click()}
                          className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-border rounded-xl py-2.5 text-xs text-muted-foreground hover:border-primary hover:text-primary transition">
                          <Upload size={14} />
                          {preview ? "Change" : "Upload"}
                        </button>
                      </div>
                    );
                  })}
                </div>

                {/* Order */}
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">Display Order</label>
                  <input type="number" min="1" value={form.order}
                    onChange={(e) => setForm({ ...form, order: e.target.value })}
                    className="w-full border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                </div>

              </div>

              {/* Buttons */}
              <div className="flex gap-3 mt-6">
                <button onClick={closeModal}
                  className="flex-1 py-2.5 rounded-xl border border-border text-sm font-semibold text-muted-foreground hover:bg-secondary transition">
                  Cancel
                </button>
                <button onClick={handleSave} disabled={saving}
                  className="flex-1 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition flex items-center justify-center gap-2 disabled:opacity-60">
                  {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
                  {saving ? "Saving..." : "Save"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Delete Confirm ── */}
      <AnimatePresence>
        {deleteId && (
          <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl text-center"
              initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}>
              <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 size={24} className="text-red-500" />
              </div>
              <h3 className="font-heading font-bold text-foreground text-lg mb-2">Delete Comparison?</h3>
              <p className="text-muted-foreground text-sm mb-5">Both images will be permanently deleted.</p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteId(null)}
                  className="flex-1 py-2.5 rounded-xl border border-border text-sm font-semibold hover:bg-secondary transition">
                  Cancel
                </button>
                <button onClick={handleDelete} disabled={deleting}
                  className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition flex items-center justify-center gap-2 disabled:opacity-60">
                  {deleting ? <Loader2 size={15} className="animate-spin" /> : null}
                  {deleting ? "Deleting..." : "Delete"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}