"use client";
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  Save, CheckCircle, Pencil, Eye, RefreshCw,
  Loader2, Upload, Trash2, Plus, X,
} from "lucide-react";

// ── Type ──────────────────────────────────────────────────────────────────────
type Room = {
  id: number;
  name: string;
  description: string;
  image: string;   // "uploads/walkthrough/xxx.jpg"
  order: number;
};

// Edit form state
type RoomDraft = {
  name: string;
  description: string;
  order: number;
  imageFile: File | null;
  imagePreview: string;
};

const emptyDraft = (order: number): RoomDraft => ({
  name: "",
  description: "",
  order,
  imageFile: null,
  imagePreview: "",
});

// ── Component ─────────────────────────────────────────────────────────────────
export default function AdminWalkthrough() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [editingId, setEditingId] = useState<number | "new" | null>(null);
  // "new" → Add modal, number → Edit modal, null → closed

  const [draft, setDraft] = useState<RoomDraft | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [savedId, setSavedId] = useState<number | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── Load rooms ──────────────────────────────────────────────────────────────
  useEffect(() => { fetchRooms(); }, []);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/walkthrough");
      const data = await res.json();
      setRooms(data.data?.rooms ?? []);
    } catch {
      setError("Failed to load rooms.");
    } finally {
      setLoading(false);
    }
  };

  // ── Open edit ───────────────────────────────────────────────────────────────
  const openEdit = (room: Room) => {
    setDraft({
      name: room.name,
      description: room.description,
      order: room.order,
      imageFile: null,
      imagePreview: `/api/files/${room.image}`, 
    });
    setEditingId(room.id);
    setError(null);
  };

  const openAdd = () => {
    setDraft(emptyDraft(rooms.length + 1));
    setEditingId("new");
    setError(null);
  };

  // ── Close modal + blob cleanup ──────────────────────────────────────────────
  const closeModal = () => {
    if (draft?.imagePreview.startsWith("blob:")) {
      URL.revokeObjectURL(draft.imagePreview);
    }
    setEditingId(null);
    setDraft(null);
    setError(null);
  };

  // ── Image pick ──────────────────────────────────────────────────────────────
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setDraft((prev) => {
      if (!prev) return prev;
      if (prev.imagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(prev.imagePreview);
      }
      return {
        ...prev,
        imageFile: file,
        imagePreview: URL.createObjectURL(file),
      };
    });
  };

  // ── Save (add or edit) ──────────────────────────────────────────────────────
  const handleSave = async () => {
    if (!draft) return;

    if (!draft.name.trim()) { setError("Room name is required."); return; }
    if (editingId === "new" && !draft.imageFile) {
      setError("Please upload a 360° image."); return;
    }

    setSaving(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("name", draft.name);
      formData.append("description", draft.description);
      formData.append("order", String(draft.order));
      if (draft.imageFile) formData.append("image", draft.imageFile);

      const isNew = editingId === "new";
      const url   = isNew ? "/api/admin/walkthrough" : `/api/admin/walkthrough/${editingId}`;

      const res = await fetch(url, {
        method: isNew ? "POST" : "PUT",
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

      await fetchRooms();
      if (!isNew) { setSavedId(editingId as number); setTimeout(() => setSavedId(null), 2000); }
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
      await fetch(`/api/admin/walkthrough/${deleteId}`, { method: "DELETE" });
      setRooms((prev) => prev.filter((r) => r.id !== deleteId));
      setDeleteId(null);
    } catch {
      setError("Failed to delete room.");
    } finally {
      setDeleting(false);
    }
  };

  // ── UI ───────────────────────────────────────────────────────────────────────
  return (
    <div className="max-w-4xl space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">360° Walkthrough Rooms</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage the virtual tour rooms and their 360° images</p>
        </div>
        <button onClick={openAdd}
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-primary/90 transition">
          <Plus size={15} /> Add Room
        </button>
      </div>

      {/* Error */}
      {error && !editingId && (
        <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl border border-red-200">{error}</div>
      )}

      {/* Loading */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 size={32} className="animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="space-y-4">
          {rooms.map((room, i) => (
            <motion.div key={room.id}
              className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden"
              initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}>
              <div className="flex items-start">

                {/* Image preview */}
                <div className="relative w-48 h-36 shrink-0">
                  <img src={`/api/files/${room.image}`} alt={room.name}
                    className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/20" />
                  <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm text-white text-xs font-bold px-2 py-1 rounded-lg flex items-center gap-1">
                    <Eye size={10} /> 360°
                  </div>
                  {/* Order badge */}
                  <div className="absolute bottom-2 left-2 bg-accent text-accent-foreground text-xs font-bold px-2 py-0.5 rounded-lg">
                    #{room.order}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-heading font-bold text-foreground">{room.name}</h3>
                      <p className="text-muted-foreground text-sm mt-1 leading-relaxed">{room.description}</p>
                      <div className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
                        {savedId === room.id
                          ? <><CheckCircle size={12} className="text-green-500" /> Saved!</>
                          : <><span className="w-2 h-2 rounded-full bg-green-400" /> Active in virtual tour</>
                        }
                      </div>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <button onClick={() => openEdit(room)}
                        className="w-9 h-9 rounded-xl border border-border flex items-center justify-center hover:bg-blue-50 hover:border-blue-200 transition">
                        <Pencil size={15} className="text-blue-600" />
                      </button>
                      <button onClick={() => setDeleteId(room.id)}
                        className="w-9 h-9 rounded-xl border border-border flex items-center justify-center hover:bg-red-50 hover:border-red-200 transition">
                        <Trash2 size={15} className="text-red-500" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}

          {rooms.length === 0 && (
            <div className="text-center py-16 text-muted-foreground text-sm">
              No rooms yet. Click "Add Room" to get started.
            </div>
          )}
        </div>
      )}

      {/* Info */}
      <div className="bg-purple-50 border border-purple-100 rounded-2xl p-4 flex items-start gap-3">
        <RefreshCw size={18} className="text-purple-500 mt-0.5 shrink-0" />
        <div>
          <p className="text-purple-800 text-sm font-semibold">About 360° Images</p>
          <p className="text-purple-600 text-xs mt-0.5 leading-relaxed">
            For best results, use equirectangular panoramic photos (2:1 ratio). Regular photos will still work. Max 20MB per image.
          </p>
        </div>
      </div>

      {/* ── Add / Edit Modal ── */}
      {editingId !== null && draft && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <motion.div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl"
            initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }}>

            <div className="flex items-center justify-between mb-5">
              <h2 className="font-heading text-xl font-bold text-foreground">
                {editingId === "new" ? "Add New Room" : "Edit Room"}
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

            <div className="space-y-4">

              {/* Name */}
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">Room Name *</label>
                <input value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                  placeholder="e.g. Living Room"
                  className="w-full border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
              </div>

              {/* Description */}
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">Description</label>
                <textarea value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })}
                  rows={2} placeholder="Short room description..."
                  className="w-full border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none" />
              </div>

              {/* Order */}
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">Display Order</label>
                <input type="number" min={1} value={draft.order}
                  onChange={(e) => setDraft({ ...draft, order: Number(e.target.value) })}
                  className="w-full border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
              </div>

              {/* Image upload */}
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">
                  360° Image {editingId === "new" && "*"}
                </label>

                {/* Preview */}
                {draft.imagePreview && (
                  <div className="relative h-36 rounded-xl overflow-hidden mb-2 border border-border">
                    <img src={draft.imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    <div className="absolute top-2 left-2 bg-black/60 text-white text-xs font-bold px-2 py-1 rounded-lg flex items-center gap-1">
                      <Eye size={10} /> 360°
                    </div>
                  </div>
                )}

                <input ref={fileInputRef} type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleImageChange} className="hidden" />

                <button onClick={() => fileInputRef.current?.click()}
                  className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-border rounded-xl py-3 text-sm text-muted-foreground hover:border-primary hover:text-primary transition">
                  <Upload size={16} />
                  {draft.imagePreview ? "Change Image" : "Upload 360° Image"}
                </button>
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
                {saving ? "Saving..." : "Save Room"}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* ── Delete Confirm ── */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <motion.div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl text-center"
            initial={{ scale: 0.9 }} animate={{ scale: 1 }}>
            <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 size={24} className="text-red-500" />
            </div>
            <h3 className="font-heading font-bold text-foreground text-lg mb-2">Delete Room?</h3>
            <p className="text-muted-foreground text-sm mb-5">This will also delete the 360° image. Cannot be undone.</p>
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
        </div>
      )}

    </div>
  );
}