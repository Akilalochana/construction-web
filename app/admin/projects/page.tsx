"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Pencil, Trash2, X, Save, MapPin, Tag, Calendar, Image as ImageIcon, CheckCircle } from "lucide-react";

const categories = ["Residential", "Commercial", "Interior", "Renovation"];

const initialProjects = [
  { id: 1, title: "Modern Villa — Al Raha", category: "Residential", location: "Al Raha, Abu Dhabi", year: "2024", image: "/assets/modern-villa.jpg", description: "A luxury 5-bedroom villa with panoramic views.", featured: true },
  { id: 2, title: "Skyline Apartments", category: "Commercial", location: "Downtown, Dubai", year: "2023", image: "/assets/apartment.jpg", description: "A 12-floor residential tower featuring 48 apartments.", featured: false },
  { id: 3, title: "Luxury Interior Fit-out", category: "Interior", location: "Palm Jumeirah, Dubai", year: "2024", image: "/assets/apartment1.jpg", description: "High-end interior fit-out for a penthouse.", featured: false },
  { id: 4, title: "Heritage Home Renovation", category: "Renovation", location: "Deira, Dubai", year: "2023", image: "/assets/before.jpg", description: "Complete structural renovation of a 1980s villa.", featured: false },
  { id: 5, title: "Palm Estate Compound", category: "Residential", location: "Palm Estate, Sharjah", year: "2022", image: "/assets/hero.jpg", description: "Turnkey construction of a 3-villa compound.", featured: false },
  { id: 6, title: "Executive Office Fit-out", category: "Interior", location: "DIFC, Dubai", year: "2023", image: "/assets/apartment.jpg", description: "Full interior fit-out of a 3200 sqft executive office.", featured: false },
];

const emptyForm = { title: "", category: "Residential", location: "", year: new Date().getFullYear().toString(), image: "/assets/modern-villa.jpg", description: "", featured: false };

export default function AdminProjects() {
  const [projects, setProjects] = useState(initialProjects);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<typeof emptyForm & { id?: number }>(emptyForm);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [saved, setSaved] = useState(false);

  const openAdd = () => { setForm(emptyForm); setEditingId(null); setShowModal(true); };
  const openEdit = (p: typeof initialProjects[0]) => {
    setForm({ title: p.title, category: p.category, location: p.location, year: p.year, image: p.image, description: p.description, featured: p.featured });
    setEditingId(p.id); setShowModal(true);
  };

  const handleSave = () => {
    if (!form.title.trim()) return;
    if (editingId !== null) {
      setProjects((prev) => prev.map((p) => p.id === editingId ? { ...p, ...form } : p));
    } else {
      setProjects((prev) => [...prev, { ...form, id: Date.now() }]);
    }
    setShowModal(false); setSaved(true); setTimeout(() => setSaved(false), 2000);
  };

  const handleDelete = (id: number) => { setProjects((prev) => prev.filter((p) => p.id !== id)); setDeleteId(null); };

  const imageOptions = ["/assets/modern-villa.jpg", "/assets/apartment.jpg", "/assets/apartment1.jpg", "/assets/before.jpg", "/assets/hero.jpg"];

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
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-1.5 text-green-600 text-sm font-medium">
              <CheckCircle size={16} /> Saved!
            </motion.div>
          )}
          <button onClick={openAdd} className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-primary/90 transition">
            <Plus size={16} /> Add Project
          </button>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        {projects.map((p, i) => (
          <motion.div key={p.id} className="bg-white rounded-2xl border border-border overflow-hidden shadow-sm group"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <div className="relative h-40 overflow-hidden">
              <img src={p.image} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <div className="absolute top-3 left-3 flex gap-2">
                <span className="bg-white/90 text-foreground text-xs font-bold px-2.5 py-1 rounded-full">{p.category}</span>
                {p.featured && <span className="bg-accent text-accent-foreground text-xs font-bold px-2.5 py-1 rounded-full">Featured</span>}
              </div>
              <div className="absolute top-3 right-3 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => openEdit(p)} className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow hover:bg-blue-50 transition">
                  <Pencil size={14} className="text-blue-600" />
                </button>
                <button onClick={() => setDeleteId(p.id)} className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow hover:bg-red-50 transition">
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

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl"
              initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95 }}>
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-heading text-xl font-bold text-foreground">{editingId ? "Edit Project" : "Add New Project"}</h2>
                <button onClick={() => setShowModal(false)} className="w-8 h-8 rounded-lg hover:bg-secondary flex items-center justify-center"><X size={18} /></button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">Project Title *</label>
                  <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                    placeholder="e.g. Modern Villa — Al Raha"
                    className="w-full border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">Category</label>
                    <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                      className="w-full border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 bg-white">
                      {categories.map((c) => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">Year</label>
                    <input value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })}
                      placeholder="2024"
                      className="w-full border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">Location</label>
                  <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })}
                    placeholder="e.g. Downtown, Dubai"
                    className="w-full border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">Photo</label>
                  <div className="grid grid-cols-5 gap-2">
                    {imageOptions.map((img) => (
                      <button key={img} onClick={() => setForm({ ...form, image: img })}
                        className={`relative h-14 rounded-lg overflow-hidden border-2 transition-all ${form.image === img ? "border-accent scale-95" : "border-transparent hover:border-border"}`}>
                        <img src={img} alt="" className="w-full h-full object-cover" />
                        {form.image === img && <div className="absolute inset-0 bg-accent/20 flex items-center justify-center"><CheckCircle size={16} className="text-accent" /></div>}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">Description</label>
                  <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                    rows={3} placeholder="Short project description..."
                    className="w-full border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none" />
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} className="w-4 h-4 accent-[hsl(40,90%,55%)] rounded" />
                  <span className="text-sm font-medium text-foreground">Mark as featured (shows larger in grid)</span>
                </label>
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setShowModal(false)} className="flex-1 py-2.5 rounded-xl border border-border text-sm font-semibold text-muted-foreground hover:bg-secondary transition">Cancel</button>
                <button onClick={handleSave} className="flex-1 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition flex items-center justify-center gap-2">
                  <Save size={15} /> Save Project
                </button>
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
              initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}>
              <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 size={24} className="text-red-500" />
              </div>
              <h3 className="font-heading font-bold text-foreground text-lg mb-2">Delete Project?</h3>
              <p className="text-muted-foreground text-sm mb-5">This action cannot be undone.</p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteId(null)} className="flex-1 py-2.5 rounded-xl border border-border text-sm font-semibold hover:bg-secondary transition">Cancel</button>
                <button onClick={() => handleDelete(deleteId)} className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition">Delete</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
