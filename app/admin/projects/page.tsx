"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Pencil, Trash2, X, Save, MapPin, Calendar, CheckCircle, Loader2, Upload } from "lucide-react";


type Project = {
  id: number;
  title: string;
  category: string;
  location: string;
  year: string;
  image: string;      
  description: string;
  featured: boolean;
};


type FormState = {
  title: string;
  category: string;
  location: string;
  year: string;
  description: string;
  featured: boolean;
  imageFile: File | null;   
  imagePreview: string;     
};

const categories = ["Residential", "Commercial", "Interior", "Renovation"];

const emptyForm: FormState = {
  title: "",
  category: "Residential",
  location: "",
  year: new Date().getFullYear().toString(),
  description: "",
  featured: false,
  imageFile: null,
  imagePreview: "",
};

// ─── Component ─────────────────────────────────────────────────────────────
export default function AdminProjects() {
  // ── State ──────────────────────────────────────────────────────────────────

  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  // Hidden file input-ඒකට reference

  // ── Load Projects ───────────────────────────────────────────────────────────
  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/projects");
      const data = await res.json();
      setProjects(data.data?.projects ?? []);
    } catch {
      setError("Failed to load projects.");
    } finally {
      setLoading(false);
    }
  };

  // ── Open Add Modal ──────────────────────────────────────────────────────────
  const openAdd = () => {
    setForm(emptyForm);   
    setEditingId(null); 
    setError(null);
    setShowModal(true);
  };

  // ── Open Edit Modal ─────────────────────────────────────────────────────────
  const openEdit = (p: Project) => {
    setForm({
      title: p.title,
      category: p.category,
      location: p.location,
      year: p.year,
      description: p.description,
      featured: p.featured,
      imageFile: null,                   
      imagePreview: `/api/files/${p.image}`, 
    });
    setEditingId(p.id);  // Edit mode
    setError(null);
    setShowModal(true);
  };

  // ── Handle Image Pick ───────────────────────────────────────────────────────
  // User file select කළාම run වෙනවා
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setForm((prev) => ({
      ...prev,
      imageFile: file,
      imagePreview: URL.createObjectURL(file),
      // createObjectURL → browser-ඒකේ temporary URL → preview-ඒකේ පෙන්වනවා
    }));
  };

  // ── Save (Add or Edit) ──────────────────────────────────────────────────────
  const handleSave = async () => {
    if (!form.title.trim()) {
      setError("Title is required.");
      return;
    }
    if (!editingId && !form.imageFile) {
      // Add mode-ඒකේදී image required
      setError("Please select an image.");
      return;
    }

    setSaving(true);
    setError(null);

    try {
      // FormData හදනවා — file upload-ට JSON-ට වෙනුවට FormData use කරනවා
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("category", form.category);
      formData.append("location", form.location);
      formData.append("year", form.year);
      formData.append("description", form.description);
      formData.append("featured", String(form.featured));
      // String() — boolean "true"/"false" string ඒකට convert කරනවා

      if (form.imageFile) {
        formData.append("image", form.imageFile);
        // image file select කළොත් viitarak append කරනවා
        // Edit-ඒකේ image නොවෙනස් කළොත් imageFile null — skip
      }

      // Add නම් POST, Edit නම් PUT
      const url = editingId
        ? `/api/admin/projects/${editingId}`
        : "/api/admin/projects";

      const res = await fetch(url, {
        method: editingId ? "PUT" : "POST",
        body: formData,
        // Headers දෙන්නේ නැහැ — browser automatically "multipart/form-data" set කරනවා
      });

      const data = await res.json();

      if (!res.ok) {
        // Validation errors
        if (data.validations) {
          const msgs = Object.values(data.validations).join(", ");
          setError(msgs);
        } else {
          setError(data.message || "Something went wrong.");
        }
        return;
      }

      // Success — projects list refresh කරනවා
      await fetchProjects();
      setShowModal(false);
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
      const res = await fetch(`/api/admin/projects/${deleteId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        setError("Failed to delete project.");
        return;
      }

      // Success — list-ඒකෙන් remove කරනවා (refetch නොකර faster)
      setProjects((prev) => prev.filter((p) => p.id !== deleteId));
      setDeleteId(null);

    } catch {
      setError("Network error. Please try again.");
    } finally {
      setDeleting(false);
    }
  };

  // ── UI ──────────────────────────────────────────────────────────────────────
  return (
    <div className="max-w-6xl space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">Projects</h1>
          <p className="text-muted-foreground text-sm mt-1">{projects.length} projects total</p>
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
            <Plus size={16} /> Add Project
          </button>
        </div>
      </div>

      {/* Global error */}
      {error && !showModal && (
        <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl border border-red-200">
          {error}
        </div>
      )}

      {/* Loading state */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 size={32} className="animate-spin text-muted-foreground" />
        </div>
      ) : (

        /* Projects Grid */
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
          {projects.map((p, i) => (
            <motion.div key={p.id}
              className="bg-white rounded-2xl border border-border overflow-hidden shadow-sm group"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}>
              <div className="relative h-40 overflow-hidden">
                {/* /api/files/ → ඔයාගේ file serving route */}
                <img src={`/api/files/${p.image}`} alt={p.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute top-3 left-3 flex gap-2">
                  <span className="bg-white/90 text-foreground text-xs font-bold px-2.5 py-1 rounded-full">{p.category}</span>
                  {p.featured && <span className="bg-accent text-accent-foreground text-xs font-bold px-2.5 py-1 rounded-full">Featured</span>}
                </div>
                <div className="absolute top-3 right-3 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => openEdit(p)}
                    className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow hover:bg-blue-50 transition">
                    <Pencil size={14} className="text-blue-600" />
                  </button>
                  <button onClick={() => setDeleteId(p.id)}
                    className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow hover:bg-red-50 transition">
                    <Trash2 size={14} className="text-red-500" />
                  </button>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-heading font-bold text-foreground text-sm">{p.title}</h3>
                <div className="flex items-center gap-3 mt-1.5">
                  <span className="flex items-center gap-1 text-muted-foreground text-xs"><MapPin size={11} />{p.location}</span>
                  <span className="flex items-center gap-1 text-muted-foreground text-xs"><Calendar size={11} />{p.year}</span>
                </div>
                <p className="text-muted-foreground text-xs mt-2 line-clamp-2">{p.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* ── Add / Edit Modal ── */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div
              className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95 }}>

              <div className="flex items-center justify-between mb-5">
                <h2 className="font-heading text-xl font-bold text-foreground">
                  {editingId ? "Edit Project" : "Add New Project"}
                </h2>
                <button onClick={() => setShowModal(false)}
                  className="w-8 h-8 rounded-lg hover:bg-secondary flex items-center justify-center">
                  <X size={18} />
                </button>
              </div>

              {/* Modal error */}
              {error && (
                <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl border border-red-200 mb-4">
                  {error}
                </div>
              )}

              <div className="space-y-4">

                {/* Title */}
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">
                    Project Title *
                  </label>
                  <input value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    placeholder="e.g. Modern Villa — Al Raha"
                    className="w-full border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                </div>

                {/* Category + Year */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">Category</label>
                    <select value={form.category}
                      onChange={(e) => setForm({ ...form, category: e.target.value })}
                      className="w-full border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 bg-white">
                      {categories.map((c) => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">Year</label>
                    <input value={form.year}
                      onChange={(e) => setForm({ ...form, year: e.target.value })}
                      placeholder="2024"
                      className="w-full border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                  </div>
                </div>

                {/* Location */}
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">Location</label>
                  <input value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                    placeholder="e.g. Downtown, Dubai"
                    className="w-full border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                </div>

                {/* Image Upload */}
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">
                    Photo {!editingId && "*"}
                  </label>

                  {/* Preview — file select කළොත් හෝ edit mode-ඒකේ පරණ image */}
                  {form.imagePreview && (
                    <div className="relative h-32 rounded-xl overflow-hidden mb-2 border border-border">
                      <img src={form.imagePreview} alt="Preview"
                        className="w-full h-full object-cover" />
                    </div>
                  )}

                  {/* Hidden real file input */}
                  <input ref={fileInputRef} type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    onChange={handleImageChange}
                    className="hidden" />

                  {/* Custom styled button */}
                  <button onClick={() => fileInputRef.current?.click()}
                    className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-border rounded-xl py-3 text-sm text-muted-foreground hover:border-primary hover:text-primary transition">
                    <Upload size={16} />
                    {form.imagePreview ? "Change Photo" : "Upload Photo"}
                  </button>
                </div>

                {/* Description */}
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">Description</label>
                  <textarea value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    rows={3} placeholder="Short project description..."
                    className="w-full border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none" />
                </div>

                {/* Featured */}
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.featured}
                    onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                    className="w-4 h-4 accent-[hsl(40,90%,55%)] rounded" />
                  <span className="text-sm font-medium text-foreground">Mark as featured</span>
                </label>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 mt-6">
                <button onClick={() => setShowModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-border text-sm font-semibold text-muted-foreground hover:bg-secondary transition">
                  Cancel
                </button>
                <button onClick={handleSave} disabled={saving}
                  className="flex-1 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition flex items-center justify-center gap-2 disabled:opacity-60">
                  {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
                  {saving ? "Saving..." : "Save Project"}
                </button>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Delete Confirm Modal ── */}
      <AnimatePresence>
        {deleteId && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div
              className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl text-center"
              initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}>
              <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 size={24} className="text-red-500" />
              </div>
              <h3 className="font-heading font-bold text-foreground text-lg mb-2">Delete Project?</h3>
              <p className="text-muted-foreground text-sm mb-5">This action cannot be undone.</p>
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