"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Pencil, Trash2, X, Save, CheckCircle } from "lucide-react";

const gradients = [
  { label: "Navy", value: "from-[hsl(220,60%,14%)] to-[hsl(220,50%,28%)]" },
  { label: "Amber", value: "from-amber-700 to-amber-500" },
  { label: "Slate", value: "from-slate-700 to-slate-500" },
  { label: "Emerald", value: "from-emerald-800 to-emerald-600" },
  { label: "Rose", value: "from-rose-700 to-rose-500" },
  { label: "Indigo", value: "from-indigo-700 to-indigo-500" },
];

const initialTeam = [
  { id: 1, name: "Ahmed Al-Rashid", role: "CEO & Founder", initials: "AR", color: "from-[hsl(220,60%,14%)] to-[hsl(220,50%,28%)]" },
  { id: 2, name: "Sara Mahmoud", role: "Lead Architect", initials: "SM", color: "from-amber-700 to-amber-500" },
  { id: 3, name: "James Mitchell", role: "Project Manager", initials: "JM", color: "from-slate-700 to-slate-500" },
  { id: 4, name: "Fatima Hassan", role: "Structural Engineer", initials: "FH", color: "from-emerald-800 to-emerald-600" },
];

const emptyForm = { name: "", role: "", initials: "", color: gradients[0].value };

export default function AdminTeam() {
  const [team, setTeam] = useState(initialTeam);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<typeof emptyForm>(emptyForm);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [saved, setSaved] = useState(false);

  const openAdd = () => { setForm(emptyForm); setEditingId(null); setShowModal(true); };
  const openEdit = (m: typeof initialTeam[0]) => {
    setForm({ name: m.name, role: m.role, initials: m.initials, color: m.color });
    setEditingId(m.id); setShowModal(true);
  };

  const autoInitials = (name: string) => name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  const handleSave = () => {
    if (!form.name.trim()) return;
    const initials = form.initials || autoInitials(form.name);
    if (editingId !== null) {
      setTeam((prev) => prev.map((m) => m.id === editingId ? { ...m, ...form, initials } : m));
    } else {
      setTeam((prev) => [...prev, { ...form, initials, id: Date.now() }]);
    }
    setShowModal(false); setSaved(true); setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">Team Members</h1>
          <p className="text-muted-foreground text-sm mt-1">{team.length} members · Displayed on the About page</p>
        </div>
        <div className="flex items-center gap-3">
          {saved && (
            <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-1.5 text-green-600 text-sm font-medium">
              <CheckCircle size={15} /> Saved!
            </motion.span>
          )}
          <button onClick={openAdd} className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-primary/90 transition">
            <Plus size={16} /> Add Member
          </button>
        </div>
      </div>

      {/* Team Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {team.map((m, i) => (
          <motion.div key={m.id} className="bg-white rounded-2xl border border-border overflow-hidden shadow-sm group"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
            {/* Avatar */}
            <div className={`h-28 bg-gradient-to-br ${m.color} flex items-center justify-center relative overflow-hidden`}>
              <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                <button onClick={() => openEdit(m)} className="w-7 h-7 bg-white/90 rounded-lg flex items-center justify-center hover:bg-white transition">
                  <Pencil size={12} className="text-blue-600" />
                </button>
                <button onClick={() => setDeleteId(m.id)} className="w-7 h-7 bg-white/90 rounded-lg flex items-center justify-center hover:bg-white transition">
                  <Trash2 size={12} className="text-red-500" />
                </button>
              </div>
              <span className="font-heading text-3xl font-bold text-white/90">{m.initials}</span>
            </div>
            <div className="p-3 text-center">
              <p className="font-heading font-semibold text-foreground text-sm">{m.name}</p>
              <p className="text-muted-foreground text-xs mt-0.5">{m.role}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl"
              initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95 }}>
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-heading text-xl font-bold text-foreground">{editingId ? "Edit Member" : "Add Team Member"}</h2>
                <button onClick={() => setShowModal(false)} className="w-8 h-8 rounded-lg hover:bg-secondary flex items-center justify-center"><X size={18} /></button>
              </div>

              {/* Avatar Preview */}
              <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${form.color} flex items-center justify-center mx-auto mb-5`}>
                <span className="font-heading text-2xl font-bold text-white/90">
                  {form.initials || autoInitials(form.name) || "??"}
                </span>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">Full Name *</label>
                  <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value, initials: autoInitials(e.target.value) })}
                    placeholder="e.g. Ahmed Al-Rashid"
                    className="w-full border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">Job Title *</label>
                    <input value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}
                      placeholder="e.g. Lead Architect"
                      className="w-full border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5 block">Initials</label>
                    <input value={form.initials} onChange={(e) => setForm({ ...form, initials: e.target.value.toUpperCase().slice(0, 2) })}
                      maxLength={2} placeholder="e.g. AR"
                      className="w-full border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 uppercase" />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2 block">Card Color</label>
                  <div className="flex gap-2 flex-wrap">
                    {gradients.map((g) => (
                      <button key={g.value} onClick={() => setForm({ ...form, color: g.value })}
                        className={`relative w-10 h-10 rounded-xl bg-gradient-to-br ${g.value} transition-all ${form.color === g.value ? "ring-2 ring-primary ring-offset-2 scale-95" : "hover:scale-105"}`}>
                        {form.color === g.value && <CheckCircle size={14} className="absolute inset-0 m-auto text-white" />}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={() => setShowModal(false)} className="flex-1 py-2.5 rounded-xl border border-border text-sm font-semibold text-muted-foreground hover:bg-secondary transition">Cancel</button>
                <button onClick={handleSave} className="flex-1 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition flex items-center justify-center gap-2">
                  <Save size={15} /> Save Member
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
              initial={{ scale: 0.9 }} animate={{ scale: 1 }}>
              <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4"><Trash2 size={24} className="text-red-500" /></div>
              <h3 className="font-heading font-bold text-foreground text-lg mb-2">Remove Team Member?</h3>
              <p className="text-muted-foreground text-sm mb-5">This member will be removed from the About page.</p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteId(null)} className="flex-1 py-2.5 rounded-xl border border-border text-sm font-semibold hover:bg-secondary transition">Cancel</button>
                <button onClick={() => { setTeam((prev) => prev.filter((m) => m.id !== deleteId)); setDeleteId(null); }}
                  className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition">Remove</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
