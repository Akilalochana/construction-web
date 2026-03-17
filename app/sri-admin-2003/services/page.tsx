"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home, Wrench, ClipboardCheck, Ruler, HardHat, Paintbrush,
  Pencil, Save, CheckCircle, Plus, Trash2, X, ChevronDown, ChevronUp, Loader2,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";


const ICON_MAP: Record<string, LucideIcon> = {
  Home, Wrench, ClipboardCheck, Ruler, HardHat, Paintbrush,
};

// ── Types ─────────────────────────────────────────────────────────────────────
interface ProcessStep {
  step: string;
  title: string;
  desc: string;
  order: number;
}
interface Stat {
  value: string;
  label: string;
  order: number;
}

interface Service {
  id: number;
  slug: string;
  iconName: string; 
  color: string;
  title: string;
  tagline: string;
  description: string;
  highlights: string[];
  order: number;
  process: ProcessStep[];
  stats: Stat[];
}

type Draft = Omit<Service, "id">;

// ── Helpers ───────────────────────────────────────────────────────────────────
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">
        {label}
      </label>
      {children}
    </div>
  );
}
const inputCls = "w-full border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/25 bg-white";
const textareaCls = `${inputCls} resize-none`;

// ── Component ─────────────────────────────────────────────────────────────────
export default function AdminServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [savedId, setSavedId] = useState<number | null>(null);
  const [expandedSection, setExpandedSection] = useState("basics");

  // ── Load services ───────────────────────────────────────────────────────────
  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/services");
      const data = await res.json();
      setServices(data.data?.services ?? []);
    } catch {
      setError("Failed to load services.");
    } finally {
      setLoading(false);
    }
  };

  // ── Open edit drawer ────────────────────────────────────────────────────────
  const openEdit = (s: Service) => {
    
    setDraft(JSON.parse(JSON.stringify(s)));
    setEditingId(s.id);
    setExpandedSection("basics");
    setError(null);
  };

  const closeEdit = () => {
    setEditingId(null);
    setDraft(null);
    setError(null);
  };

  // ── Save ────────────────────────────────────────────────────────────────────
  const save = async () => {
    if (!draft || !editingId) return;
    setSaving(true);
    setError(null);

    try {
      const res = await fetch(`/api/admin/services/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...draft,
          // process step numbers auto-generate — "01", "02" etc
          process: draft.process.map((p, i) => ({
            ...p,
            step: String(i + 1).padStart(2, "0"),
            order: i + 1,
          })),
          stats: draft.stats.map((s, i) => ({
            ...s,
            order: i + 1,
          })),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.validations) {
          const msgs = Object.values(data.validations).join(", ");
          setError(msgs);
        } else {
          setError(data.message || "Something went wrong.");
        }
        return;
      }

      // Success — list update
      await fetchServices();
      setSavedId(editingId);
      setTimeout(() => setSavedId(null), 2000);
      closeEdit();

    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  // ── Draft mutators ──────────────────────────────────────────────────────────
  const setField = <K extends keyof Draft>(k: K, v: Draft[K]) =>
    setDraft((d) => d ? { ...d, [k]: v } : d);

  const setHighlight = (i: number, v: string) =>
    setDraft((d) => {
      if (!d) return d;
      const h = [...d.highlights];
      h[i] = v;
      return { ...d, highlights: h };
    });
  const addHighlight = () =>
    setDraft((d) => d ? { ...d, highlights: [...d.highlights, ""] } : d);
  const removeHighlight = (i: number) =>
    setDraft((d) => d ? { ...d, highlights: d.highlights.filter((_, idx) => idx !== i) } : d);

  const setProcess = (i: number, k: keyof ProcessStep, v: string) =>
    setDraft((d) => {
      if (!d) return d;
      const p = d.process.map((s, idx) => idx === i ? { ...s, [k]: v } : s);
      return { ...d, process: p };
    });
  const addProcess = () =>
    setDraft((d) => d ? {
      ...d,
      process: [...d.process, { step: "", title: "", desc: "", order: d.process.length + 1 }]
    } : d);
  const removeProcess = (i: number) =>
    setDraft((d) => d ? { ...d, process: d.process.filter((_, idx) => idx !== i) } : d);

  const setStat = (i: number, k: keyof Stat, v: string) =>
    setDraft((d) => {
      if (!d) return d;
      const st = d.stats.map((s, idx) => idx === i ? { ...s, [k]: v } : s);
      return { ...d, stats: st };
    });
  const addStat = () =>
    setDraft((d) => d ? {
      ...d,
      stats: [...d.stats, { value: "", label: "", order: d.stats.length + 1 }]
    } : d);
  const removeStat = (i: number) =>
    setDraft((d) => d ? { ...d, stats: d.stats.filter((_, idx) => idx !== i) } : d);

  const toggle = (sec: string) =>
    setExpandedSection((prev) => prev === sec ? "" : sec);

  // ── UI ───────────────────────────────────────────────────────────────────────
  return (
    <div className="max-w-5xl space-y-6">

      {/* Header */}
      <div>
        <h1 className="font-heading text-2xl font-bold text-foreground">Services</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Edit service details shown on the Services page and individual service pages
        </p>
      </div>

      {/* Global error */}
      {error && !editingId && (
        <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl border border-red-200">
          {error}
        </div>
      )}

      {/* Loading */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 size={32} className="animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((s, i) => {
        
            const Icon = ICON_MAP[s.iconName] ?? Home;
            return (
              <motion.div key={s.id}
                className="bg-white border border-border rounded-2xl overflow-hidden shadow-sm group"
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}>
                <div className={`h-16 bg-gradient-to-br ${s.color} flex items-center px-5 gap-3`}>
                  <div className="w-9 h-9 bg-white/15 rounded-xl flex items-center justify-center border border-white/20">
                    <Icon size={18} className="text-white" />
                  </div>
                  {savedId === s.id && (
                    <span className="ml-auto flex items-center gap-1 text-white text-xs font-semibold">
                      <CheckCircle size={13} /> Saved
                    </span>
                  )}
                </div>
                <div className="p-5">
                  <p className="font-heading font-bold text-foreground text-sm mb-0.5">{s.title}</p>
                  <p className="text-muted-foreground text-xs mb-3 italic">{s.tagline}</p>
                  <p className="text-muted-foreground text-xs line-clamp-2 mb-4">{s.description}</p>
                  <div className="flex gap-2 text-xs text-muted-foreground mb-4">
                    <span className="bg-secondary px-2 py-1 rounded-lg">{s.highlights.length} highlights</span>
                    <span className="bg-secondary px-2 py-1 rounded-lg">{s.process.length} steps</span>
                    <span className="bg-secondary px-2 py-1 rounded-lg">{s.stats.length} stats</span>
                  </div>
                  <button onClick={() => openEdit(s)}
                    className="w-full flex items-center justify-center gap-2 py-2 rounded-xl border border-border text-sm font-semibold text-foreground hover:bg-secondary transition">
                    <Pencil size={14} /> Edit Service
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* ── Edit Drawer ── */}
      <AnimatePresence>
        {editingId && draft && (
          <motion.div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-sm"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="flex-1" onClick={closeEdit} />

            <motion.aside
              className="w-full max-w-xl bg-white h-full overflow-y-auto flex flex-col shadow-2xl"
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 260 }}>

              {/* Drawer header */}
              <div className={`bg-gradient-to-br ${draft.color} px-6 py-5 flex items-center justify-between`}>
                <div className="flex items-center gap-3">
                  {(() => { const Icon = ICON_MAP[draft.iconName] ?? Home; return <Icon size={20} className="text-white" />; })()}
                  <div>
                    <p className="font-heading font-bold text-white text-base leading-none">{draft.title}</p>
                    <p className="text-white/60 text-xs mt-0.5">Editing service content</p>
                  </div>
                </div>
                <button onClick={closeEdit}
                  className="w-8 h-8 bg-white/15 rounded-lg flex items-center justify-center hover:bg-white/25 transition">
                  <X size={16} className="text-white" />
                </button>
              </div>

              <div className="flex-1 p-6 space-y-4">

                {/* Error inside drawer */}
                {error && (
                  <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl border border-red-200">
                    {error}
                  </div>
                )}

                {/* Basics */}
                <AccordionSection title="Basic Info" open={expandedSection === "basics"} onToggle={() => toggle("basics")}>
                  <div className="space-y-4">
                    <Field label="Service Title">
                      <input className={inputCls} value={draft.title}
                        onChange={(e) => setField("title", e.target.value)} />
                    </Field>
                    <Field label="Tagline">
                      <input className={inputCls} value={draft.tagline}
                        onChange={(e) => setField("tagline", e.target.value)} />
                    </Field>
                    <Field label="Description">
                      <textarea className={textareaCls} rows={4} value={draft.description}
                        onChange={(e) => setField("description", e.target.value)} />
                    </Field>
                  </div>
                </AccordionSection>

                {/* Highlights */}
                <AccordionSection title={`Highlights (${draft.highlights.length})`} open={expandedSection === "highlights"} onToggle={() => toggle("highlights")}>
                  <div className="space-y-2">
                    {draft.highlights.map((h, i) => (
                      <div key={i} className="flex gap-2 items-center">
                        <input className={`${inputCls} flex-1`} value={h}
                          onChange={(e) => setHighlight(i, e.target.value)}
                          placeholder={`Highlight ${i + 1}`} />
                        <button onClick={() => removeHighlight(i)}
                          className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center hover:bg-red-100 transition shrink-0">
                          <Trash2 size={13} className="text-red-500" />
                        </button>
                      </div>
                    ))}
                    <button onClick={addHighlight}
                      className="flex items-center gap-2 text-sm text-primary font-semibold hover:underline mt-1">
                      <Plus size={14} /> Add Highlight
                    </button>
                  </div>
                </AccordionSection>

                {/* Process */}
                <AccordionSection title={`How It Works (${draft.process.length} steps)`} open={expandedSection === "process"} onToggle={() => toggle("process")}>
                  <div className="space-y-4">
                    {draft.process.map((p, i) => (
                      <div key={i} className="bg-secondary/40 rounded-xl p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="font-heading font-bold text-2xl text-border leading-none">
                            {String(i + 1).padStart(2, "0")}
                          </span>
                          <button onClick={() => removeProcess(i)}
                            className="w-7 h-7 bg-red-50 rounded-lg flex items-center justify-center hover:bg-red-100 transition">
                            <Trash2 size={12} className="text-red-500" />
                          </button>
                        </div>
                        <Field label="Step Title">
                          <input className={inputCls} value={p.title}
                            onChange={(e) => setProcess(i, "title", e.target.value)} />
                        </Field>
                        <Field label="Step Description">
                          <textarea className={textareaCls} rows={2} value={p.desc}
                            onChange={(e) => setProcess(i, "desc", e.target.value)} />
                        </Field>
                      </div>
                    ))}
                    <button onClick={addProcess}
                      className="flex items-center gap-2 text-sm text-primary font-semibold hover:underline mt-1">
                      <Plus size={14} /> Add Step
                    </button>
                  </div>
                </AccordionSection>

                {/* Stats */}
                <AccordionSection title={`Stats (${draft.stats.length})`} open={expandedSection === "stats"} onToggle={() => toggle("stats")}>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      {draft.stats.map((st, i) => (
                        <div key={i} className="bg-secondary/40 rounded-xl p-3 space-y-2 relative">
                          <button onClick={() => removeStat(i)}
                            className="absolute top-2 right-2 w-6 h-6 bg-red-50 rounded-md flex items-center justify-center hover:bg-red-100 transition">
                            <Trash2 size={11} className="text-red-500" />
                          </button>
                          <Field label="Value">
                            <input className={inputCls} value={st.value}
                              onChange={(e) => setStat(i, "value", e.target.value)}
                              placeholder="e.g. 200+" />
                          </Field>
                          <Field label="Label">
                            <input className={inputCls} value={st.label}
                              onChange={(e) => setStat(i, "label", e.target.value)}
                              placeholder="e.g. Projects" />
                          </Field>
                        </div>
                      ))}
                    </div>
                    <button onClick={addStat}
                      className="flex items-center gap-2 text-sm text-primary font-semibold hover:underline">
                      <Plus size={14} /> Add Stat
                    </button>
                  </div>
                </AccordionSection>

              </div>

              {/* Footer */}
              <div className="sticky bottom-0 bg-white border-t border-border px-6 py-4 flex gap-3">
                <button onClick={closeEdit}
                  className="flex-1 py-2.5 rounded-xl border border-border text-sm font-semibold text-muted-foreground hover:bg-secondary transition">
                  Cancel
                </button>
                <button onClick={save} disabled={saving}
                  className="flex-1 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition flex items-center justify-center gap-2 disabled:opacity-60">
                  {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Accordion helper ───────────────────────────────────────────────────────────
function AccordionSection({ title, open, onToggle, children }: {
  title: string; open: boolean; onToggle: () => void; children: React.ReactNode;
}) {
  return (
    <div className="border border-border rounded-2xl overflow-hidden">
      <button onClick={onToggle}
        className="w-full flex items-center justify-between px-5 py-3.5 bg-secondary/30 hover:bg-secondary/50 transition text-left">
        <span className="font-semibold text-sm text-foreground">{title}</span>
        {open
          ? <ChevronUp size={16} className="text-muted-foreground" />
          : <ChevronDown size={16} className="text-muted-foreground" />}
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }}
            transition={{ duration: 0.22 }} className="overflow-hidden">
            <div className="px-5 py-4">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}