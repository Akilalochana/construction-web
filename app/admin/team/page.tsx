"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Pencil, Trash2, X, Save, CheckCircle, Loader2, Upload, UserCircle2 } from "lucide-react";

// ── Types ─────────────────────────────────────────────────────────────────────
type TeamMember = {
  id: number;
  name: string;
  role: string;
  initials: string;
  color: string;
  image: string | null;  // "uploads/team/xxx.jpg" or null
  order: number;
};

type FormState = {
  name: string;
  role: string;
  initials: string;
  color: string;
  order: number;
  imageFile: File | null;
  imagePreview: string; // blob: URL or /api/files/... or ""
  removeImage: boolean;
};

// ── Gradient options ──────────────────────────────────────────────────────────
const gradients = [
  { label: "Navy",    value: "from-[hsl(220,60%,14%)] to-[hsl(220,50%,28%)]" },
  { label: "Amber",   value: "from-amber-700 to-amber-500" },
  { label: "Slate",   value: "from-slate-700 to-slate-500" },
  { label: "Emerald", value: "from-emerald-800 to-emerald-600" },
  { label: "Rose",    value: "from-rose-700 to-rose-500" },
  { label: "Indigo",  value: "from-indigo-700 to-indigo-500" },
];

const emptyForm = (order: number): FormState => ({
  name: "",
  role: "",
  initials: "",
  color: gradients[0].value,
  order,
  imageFile: null,
  imagePreview: "",
  removeImage: false,
});

const autoInitials = (name: string) =>
  name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

// ── Component ─────────────────────────────────────────────────────────────────
export default function AdminTeam() {
  const [team, setTeam]         = useState<TeamMember[]>([]);
  const [loading, setLoading]   = useState(true);
  const [saving, setSaving]     = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError]       = useState<string | null>(null);

  const [showModal, setShowModal]   = useState(false);
  const [editingId, setEditingId]   = useState<number | null>(null);
  const [form, setForm]             = useState<FormState>(emptyForm(1));
  const [deleteId, setDeleteId]     = useState<number | null>(null);
  const [savedId, setSavedId]       = useState<number | "new" | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── Load ────────────────────────────────────────────────────────────────────
  useEffect(() => { fetchTeam(); }, []);

  const fetchTeam = async () => {
    try {
      setLoading(true);
      const res  = await fetch("/api/admin/team");
      const data = await res.json();
      setTeam(data.data?.teamMembers ?? []);
    } catch {
      setError("Failed to load team members.");
    } finally {
      setLoading(false);
    }
  };

  // ── Open modal ──────────────────────────────────────────────────────────────
  const openAdd = () => {
    setForm(emptyForm(team.length + 1));
    setEditingId(null);
    setError(null);
    setShowModal(true);
  };

  const openEdit = (m: TeamMember) => {
    setForm({
      name: m.name,
      role: m.role,
      initials: m.initials,
      color: m.color,
      order: m.order,
      imageFile: null,
      
      imagePreview: m.image ? `/api/files/${m.image}` : "",
      removeImage: false,
    });
    setEditingId(m.id);
    setError(null);
    setShowModal(true);
  };

  // ── Close modal + blob cleanup ──────────────────────────────────────────────
  const closeModal = () => {
    if (form.imagePreview.startsWith("blob:")) {
      URL.revokeObjectURL(form.imagePreview);
    }
    setShowModal(false);
    setError(null);
  };

  // ── Image pick ──────────────────────────────────────────────────────────────
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setForm((prev) => {
      if (prev.imagePreview.startsWith("blob:")) URL.revokeObjectURL(prev.imagePreview);
      return {
        ...prev,
        imageFile: file,
        imagePreview: URL.createObjectURL(file),
        removeImage: false,
      };
    });
  };

  const handleRemoveImage = () => {
    if (form.imagePreview.startsWith("blob:")) URL.revokeObjectURL(form.imagePreview);
    setForm((prev) => ({ ...prev, imageFile: null, imagePreview: "", removeImage: true }));
  };

  // ── Save ────────────────────────────────────────────────────────────────────
  const handleSave = async () => {
    if (!form.name.trim()) { setError("Full name is required."); return; }
    if (!form.role.trim()) { setError("Job title is required."); return; }

    setSaving(true);
    setError(null);

    try {
      const fd = new FormData();
      fd.append("name",     form.name);
      fd.append("role",     form.role);
      fd.append("initials", form.initials || autoInitials(form.name));
      fd.append("color",    form.color);
      fd.append("order",    String(form.order));
      if (form.imageFile)    fd.append("image",       form.imageFile);
      if (form.removeImage)  fd.append("removeImage", "true");

      const isNew = editingId === null;
      const url   = isNew ? "/api/admin/team" : `/api/admin/team/${editingId}`;

      const res  = await fetch(url, { method: isNew ? "POST" : "PUT", body: fd });
      const data = await res.json();

      if (!res.ok) {
        setError(
          data.validations
            ? Object.values(data.validations).join(", ")
            : data.message || "Something went wrong."
        );
        return;
      }

      await fetchTeam();
      setSavedId(isNew ? "new" : editingId!);
      setTimeout(() => setSavedId(null), 2000);
      closeModal();
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
      await fetch(`/api/admin/team/${deleteId}`, { method: "DELETE" });
      setTeam((prev) => prev.filter((m) => m.id !== deleteId));
      setDeleteId(null);
    } catch {
      setError("Failed to delete team member.");
    } finally {
      setDeleting(false);
    }
  };

  // ── Avatar helper — image නැතිනම් initials ──────────────────────────────────
  const MemberAvatar = ({ m, size = "card" }: { m: TeamMember; size?: "card" | "modal" }) => {
    const h = size === "card" ? "h-28" : "w-20 h-20 mx-auto";
    const textSize = size === "card" ? "text-3xl" : "text-2xl";

    if (m.image) {
      return (
        <div className={`${h} ${size === "modal" ? "rounded-2xl overflow-hidden" : ""} relative`}>
          <img src={`/api/files/${m.image}`} alt={m.name}
            className="w-full h-full object-cover object-top" />
        </div>
      );
    }
    return (
      <div className={`${size === "modal" ? "rounded-2xl" : ""} ${h} bg-gradient-to-br ${m.color} flex items-center justify-center`}>
        <span className={`font-heading ${textSize} font-bold text-white/90`}>{m.initials}</span>
      </div>
    );
  };

  // ── Preview in form ──────────────────────────────────────────────────────────
  const FormPreview = () => {
    if (form.imagePreview) {
      return (
        <div className="relative w-20 h-20 rounded-2xl overflow-hidden mx-auto mb-5">
          <img src={form.imagePreview} alt="Preview" className="w-full h-full object-cover object-top" />
          <button onClick={handleRemoveImage}
            className="absolute top-1 right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
            <X size={10} className="text-white" />
          </button>
        </div>
      );
    }
    return (
      <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${form.color} flex items-center justify-center mx-auto mb-5`}>
        <span className="font-heading text-2xl font-bold text-white/90">
          {form.initials || autoInitials(form.name) || "??"}
        </span>
      </div>
    );
  };

  // ── UI ────────────────────────────────────────────────────────────────────
  return (
    <div className="max-w-4xl space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">Team Members</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {team.length} members · Displayed on the About page
          </p>
        </div>
        <div className="flex items-center gap-3">
          {savedId !== null && (
            <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="flex items-center gap-1.5 text-green-600 text-sm font-medium">
              <CheckCircle size={15} /> Saved!
            </motion.span>
          )}
          <button onClick={openAdd}
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-primary/90 transition">
            <Plus size={16} /> Add Member
          </button>
        </div>
      </div>

      {/* Error */}
      {error && !showModal && (
        <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl border border-red-200">{error}</div>
      )}

      {/* Loading */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 size={32} className="animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {team.map((m, i) => (
            <motion.div key={m.id}
              className="bg-white rounded-2xl border border-border overflow-hidden shadow-sm group"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}>

              {/* Avatar / Photo */}
              <div className="relative">
                <MemberAvatar m={m} />
                {/* Action buttons on hover */}
                <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                  <button onClick={() => openEdit(m)}
                    className="w-7 h-7 bg-white/90 rounded-lg flex items-center justify-center hover:bg-white transition">
                    <Pencil size={12} className="text-blue-600" />
                  </button>
                  <button onClick={() => setDeleteId(m.id)}
                    className="w-7 h-7 bg-white/90 rounded-lg flex items-center justify-center hover:bg-white transition">
                    <Trash2 size={12} className="text-red-500" />
                  </button>
                </div>
              </div>

              <div className="p-3 text-center">
                <p className="font-heading font-semibold text-foreground text-sm">{m.name}</p>
                <p className="text-muted-foreground text-xs mt-0.5">{m.role}</p>
              </div>
            </motion.div>
          ))}

          {team.length === 0 && (
            <div className="col-span-4 text-center py-16 text-muted-foreground text-sm">
              No team members yet. Click "Add Member" to get started.
            </div>
          )}
        </div>
      )}

      {/* ── Add / Edit Modal ── */}
      <AnimatePresence>
        {showModal && (
          <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl"
              initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95 }}>

              <div className="flex items-center justify-between mb-5">
                <h2 className="font-heading text-xl font-bold text-foreground">
                  {editingId ? "Edit Member" : "Add Team Member"}
                </h2>
                <button onClick={closeModal}
                  className="w-8 h-8 rounded-lg hover:bg-secondary flex items-center justify-center">
                  <X size={18} />
                </button>
              </div>

              {/* Error */}
              {error && (
                <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl border border-red-200 mb-4">{error}</div>
              )}

              {/* Avatar preview */}
              <FormPreview />

              {/* Image upload */}
              <div className="mb-4">
                <input ref={fileInputRef} type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleImageChange} className="hidden" />
                <button onClick={() => fileInputRef.current?.click()}
                  className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-border rounded-xl py-2.5 text-sm text-muted-foreground hover:border-primary hover:text-primary transition">
                  <Upload size={15} />
                  {form.imagePreview ? "Change Photo" : "Upload Photo (optional)"}
                </button>
              </div>

              <div className="space-y-4">
                {/* Name */}
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">Full Name *</label>
                  <input value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value, initials: autoInitials(e.target.value) })}
                    placeholder="e.g. Ahmed Al-Rashid"
                    className="w-full border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Role */}
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">Job Title *</label>
                    <input value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}
                      placeholder="e.g. Lead Architect"
                      className="w-full border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                  </div>
                  {/* Initials */}
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">Initials</label>
                    <input value={form.initials}
                      onChange={(e) => setForm({ ...form, initials: e.target.value.toUpperCase().slice(0, 2) })}
                      maxLength={2} placeholder="e.g. AR"
                      className="w-full border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 uppercase" />
                  </div>
                </div>

                {/* Order */}
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">Display Order</label>
                  <input type="number" min={1} value={form.order}
                    onChange={(e) => setForm({ ...form, order: Number(e.target.value) })}
                    className="w-full border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                </div>

               
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2 block">
                    Card Color <span className="font-normal text-muted-foreground">(used when no photo)</span>
                  </label>
                  <div className="flex gap-2 flex-wrap">
                    {gradients.map((g) => (
                      <button key={g.value} onClick={() => setForm({ ...form, color: g.value })}
                        className={`relative w-10 h-10 rounded-xl bg-gradient-to-br ${g.value} transition-all ${
                          form.color === g.value ? "ring-2 ring-primary ring-offset-2 scale-95" : "hover:scale-105"
                        }`}>
                        {form.color === g.value && <CheckCircle size={14} className="absolute inset-0 m-auto text-white" />}
                      </button>
                    ))}
                  </div>
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
                  {saving ? "Saving..." : "Save Member"}
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
              initial={{ scale: 0.9 }} animate={{ scale: 1 }}>
              <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 size={24} className="text-red-500" />
              </div>
              <h3 className="font-heading font-bold text-foreground text-lg mb-2">Remove Team Member?</h3>
              <p className="text-muted-foreground text-sm mb-5">
                This member will be removed from the About page. Their photo will also be deleted.
              </p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteId(null)}
                  className="flex-1 py-2.5 rounded-xl border border-border text-sm font-semibold hover:bg-secondary transition">
                  Cancel
                </button>
                <button onClick={handleDelete} disabled={deleting}
                  className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition flex items-center justify-center gap-2 disabled:opacity-60">
                  {deleting ? <Loader2 size={15} className="animate-spin" /> : null}
                  {deleting ? "Removing..." : "Remove"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}