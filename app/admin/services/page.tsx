"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home, Wrench, ClipboardCheck, Ruler, HardHat, Paintbrush,
  Pencil, Save, CheckCircle, Plus, Trash2, X, ChevronDown, ChevronUp,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

/* ─── Types ──────────────────────────────────────────────── */
interface ProcessStep { step: string; title: string; desc: string }
interface Stat         { value: string; label: string }
interface ServiceData {
  slug: string;
  icon: LucideIcon;
  color: string;
  title: string;
  tagline: string;
  description: string;
  highlights: string[];
  process: ProcessStep[];
  stats: Stat[];
}

/* ─── Initial data (mirrors [slug]/page.tsx) ─────────────── */
const initialServices: ServiceData[] = [
  {
    slug: "turnkey-construction", icon: Home,
    color: "from-[hsl(220,60%,14%)] to-[hsl(220,50%,28%)]",
    title: "Turnkey Construction", tagline: "Complete Build, Zero Stress",
    description: "We handle everything from A to Z — from the first architectural sketch to handing you the keys. Our turnkey service covers planning permissions, structural work, MEP installations, and premium finishing. You stay informed at every milestone; we handle every detail.",
    highlights: ["Architectural design & planning approvals","Full structural & civil works","Electrical, plumbing & HVAC installations","Premium interior finishing","Landscaping & external works","Defects liability & after-handover support"],
    process: [
      { step:"01", title:"Consultation & Design", desc:"We understand your vision, budget, and timeline to create a tailored architectural plan." },
      { step:"02", title:"Approvals & Permits",   desc:"Our team handles all government approvals and building permits on your behalf." },
      { step:"03", title:"Construction Phase",    desc:"Experienced crews execute structural, MEP, and finishing works to exacting standards." },
      { step:"04", title:"Handover",              desc:"Final inspections, punch-list resolution, and keys-in-hand delivery to you." },
    ],
    stats: [{ value:"200+", label:"Completed Builds" },{ value:"15+", label:"Years Experience" },{ value:"100%", label:"On-Time Delivery" },{ value:"4.9★", label:"Client Rating" }],
  },
  {
    slug: "project-completion", icon: Wrench,
    color: "from-amber-700 to-amber-500",
    title: "Project Completion", tagline: "We Finish What Others Started",
    description: "Have a partially built or stalled property? We perform a thorough structural and quality audit, then take full ownership of completing the project — fast, cleanly, and to the highest standard. No hidden costs, no more delays.",
    highlights: ["Free structural & quality audit","Transparent completion cost estimate","Seamless handover from previous contractor","Rectification of substandard work","Dedicated completion manager","Fixed-price completion contracts available"],
    process: [
      { step:"01", title:"Site Audit",          desc:"We inspect existing work, identify defects, and assess what remains to be done." },
      { step:"02", title:"Scope & Pricing",      desc:"A clear, itemised quote is provided — no surprises mid-project." },
      { step:"03", title:"Remediation & Build",  desc:"Defective work is rectified before continuing the build to our standards." },
      { step:"04", title:"Final Completion",     desc:"Full finishing, snagging, and handover at your convenience." },
    ],
    stats: [{ value:"80+", label:"Completions" },{ value:"3–6", label:"Month Avg. Delivery" },{ value:"0", label:"Hidden Fees" },{ value:"100%", label:"Satisfaction" }],
  },
  {
    slug: "interior-finishing", icon: Paintbrush,
    color: "from-rose-700 to-rose-500",
    title: "Interior Finishing", tagline: "Spaces That Tell Your Story",
    description: "We transform bare concrete shells into beautifully finished living or working spaces. From bespoke kitchen cabinetry to large-format floor tiling and designer bathroom suites, every finish is selected and installed with precision.",
    highlights: ["Flooring — tile, hardwood, vinyl & marble","Custom kitchen and joinery fitting","Bathroom tiling & sanitary ware installation","Plastering, skimming & decorative painting","False ceilings & feature lighting","Built-in wardrobes & storage solutions"],
    process: [
      { step:"01", title:"Design Consultation", desc:"Material boards, mood boards, and 3D visualisations to align with your taste." },
      { step:"02", title:"Material Selection",  desc:"Access to our curated catalogue of premium local and imported finishes." },
      { step:"03", title:"Installation",        desc:"Skilled tradespeople carry out each finish with meticulous attention to detail." },
      { step:"04", title:"Styling & Handover",  desc:"Final styling walk-through and snag-free handover." },
    ],
    stats: [{ value:"150+", label:"Interiors Finished" },{ value:"30+", label:"Finish Options" },{ value:"5yr", label:"Workmanship Warranty" },{ value:"4.8★", label:"Client Rating" }],
  },
  {
    slug: "architectural-design", icon: Ruler,
    color: "from-indigo-700 to-indigo-500",
    title: "Architectural Design", tagline: "Form Meets Function",
    description: "Our in-house architects create modern, context-sensitive designs that maximise natural light, optimise space, and reflect your personality. Every plan is engineered for both beauty and buildability.",
    highlights: ["Concept & schematic design","Detailed construction drawings","3D visualisations & walkthroughs","Structural engineering coordination","Planning permission packages","Interior design integration"],
    process: [
      { step:"01", title:"Brief & Discovery",      desc:"Deep-dive session to understand your lifestyle, budget, and site constraints." },
      { step:"02", title:"Concept Design",         desc:"Sketch options and spatial studies refined into a preferred scheme." },
      { step:"03", title:"Developed Design",       desc:"Detailed drawings, material schedules, and submission-ready documents." },
      { step:"04", title:"Construction Support",   desc:"On-site architect oversight during build to ensure design intent is realised." },
    ],
    stats: [{ value:"120+", label:"Designs Completed" },{ value:"100%", label:"Permit Success Rate" },{ value:"15+", label:"Award Nominations" },{ value:"4.9★", label:"Client Rating" }],
  },
  {
    slug: "project-management", icon: ClipboardCheck,
    color: "from-emerald-800 to-emerald-600",
    title: "Project Management", tagline: "On Time. On Budget. Every Time.",
    description: "A dedicated project manager is your single point of contact throughout the entire build. We coordinate contractors, track milestones, manage budgets, and ensure quality at every stage so you never have to worry.",
    highlights: ["Dedicated project manager from day one","Weekly progress reports & site visits","Contractor procurement & management","Budget tracking & cost control","Risk identification & mitigation","Real-time project dashboard access"],
    process: [
      { step:"01", title:"Project Briefing",    desc:"Define scope, budget, programme, and success criteria together." },
      { step:"02", title:"Procurement",         desc:"We source and vet the best-value contractors for each trade." },
      { step:"03", title:"Execution & Control", desc:"Daily on-site coordination with weekly client reporting." },
      { step:"04", title:"Closeout",            desc:"Final inspections, contract closeout, and lessons-learned documentation." },
    ],
    stats: [{ value:"500+", label:"Projects Managed" },{ value:"97%", label:"On-Time Completion" },{ value:"12%", label:"Avg. Cost Saving" },{ value:"4.9★", label:"Client Rating" }],
  },
  {
    slug: "renovations", icon: HardHat,
    color: "from-[hsl(220,60%,14%)] to-[hsl(220,50%,28%)]",
    title: "Renovations", tagline: "Old Bones, New Life",
    description: "We breathe new life into aging properties — whether a full-gut renovation, a kitchen and bathroom refresh, or an energy-efficiency upgrade. Our renovation specialists respect the original character while modernising every inch.",
    highlights: ["Full-gut and partial renovations","Kitchen & bathroom remodels","Structural changes & extensions","Energy efficiency upgrades (insulation, windows)","Heritage & period property specialists","Minimal disruption scheduling"],
    process: [
      { step:"01", title:"Survey & Assessment", desc:"Thorough condition survey to understand the building's existing structure and services." },
      { step:"02", title:"Design & Planning",   desc:"Renovation design, material selection, and where required, planning applications." },
      { step:"03", title:"Demolition & Build",  desc:"Controlled strip-out followed by high-quality build works." },
      { step:"04", title:"Finishing & Reveal",  desc:"Premium finishing and a stunning reveal — minimal mess, maximum impact." },
    ],
    stats: [{ value:"180+", label:"Renovations Done" },{ value:"40%", label:"Avg. Value Added" },{ value:"8wk", label:"Avg. Turnaround" },{ value:"4.8★", label:"Client Rating" }],
  },
];

/* ─── Small helpers ──────────────────────────────────────── */
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">{label}</label>
      {children}
    </div>
  );
}
const inputCls = "w-full border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/25 bg-white";
const textareaCls = `${inputCls} resize-none`;

/* ─── Main page ──────────────────────────────────────────── */
export default function AdminServices() {
  const [services, setServices] = useState<ServiceData[]>(initialServices);
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [draft, setDraft] = useState<ServiceData | null>(null);
  const [savedSlug, setSavedSlug] = useState<string | null>(null);
  const [expandedSection, setExpandedSection] = useState<string>("basics");

  const openEdit = (s: ServiceData) => {
    setDraft(JSON.parse(JSON.stringify(s))); // deep clone
    setEditingSlug(s.slug);
    setExpandedSection("basics");
  };
  const closeEdit = () => { setEditingSlug(null); setDraft(null); };

  const save = () => {
    if (!draft) return;
    setServices((prev) => prev.map((s) => s.slug === draft.slug ? draft : s));
    setSavedSlug(draft.slug);
    setTimeout(() => setSavedSlug(null), 2000);
    closeEdit();
  };

  /* Draft mutators */
  const setField = <K extends keyof ServiceData>(k: K, v: ServiceData[K]) =>
    setDraft((d) => d ? { ...d, [k]: v } : d);

  const setHighlight = (i: number, v: string) =>
    setDraft((d) => { if (!d) return d; const h = [...d.highlights]; h[i] = v; return { ...d, highlights: h }; });
  const addHighlight   = () => setDraft((d) => d ? { ...d, highlights: [...d.highlights, ""] } : d);
  const removeHighlight = (i: number) =>
    setDraft((d) => d ? { ...d, highlights: d.highlights.filter((_, idx) => idx !== i) } : d);

  const setProcess = (i: number, k: keyof ProcessStep, v: string) =>
    setDraft((d) => { if (!d) return d; const p = d.process.map((s,idx) => idx===i ? {...s,[k]:v} : s); return {...d,process:p}; });

  const setStat = (i: number, k: keyof Stat, v: string) =>
    setDraft((d) => { if (!d) return d; const st = d.stats.map((s,idx) => idx===i ? {...s,[k]:v} : s); return {...d,stats:st}; });

  const toggle = (sec: string) => setExpandedSection((prev) => prev === sec ? "" : sec);

  return (
    <div className="max-w-5xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">Services</h1>
          <p className="text-muted-foreground text-sm mt-1">Edit service details shown on the Services page and individual service pages</p>
        </div>
      </div>

      {/* Service cards grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {services.map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.div key={s.slug} className="bg-white border border-border rounded-2xl overflow-hidden shadow-sm group"
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
              {/* Color band */}
              <div className={`h-16 bg-gradient-to-br ${s.color} flex items-center px-5 gap-3`}>
                <div className="w-9 h-9 bg-white/15 rounded-xl flex items-center justify-center border border-white/20">
                  <Icon size={18} className="text-white" />
                </div>
                {savedSlug === s.slug && (
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

      {/* ── Edit Drawer Modal ── */}
      <AnimatePresence>
        {editingSlug && draft && (
          <motion.div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-sm"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {/* Click outside to close */}
            <div className="flex-1" onClick={closeEdit} />

            <motion.aside className="w-full max-w-xl bg-white h-full overflow-y-auto flex flex-col shadow-2xl"
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", damping: 28, stiffness: 260 }}>

              {/* Drawer header */}
              <div className={`bg-gradient-to-br ${draft.color} px-6 py-5 flex items-center justify-between`}>
                <div className="flex items-center gap-3">
                  <draft.icon size={20} className="text-white" />
                  <div>
                    <p className="font-heading font-bold text-white text-base leading-none">{draft.title}</p>
                    <p className="text-white/60 text-xs mt-0.5">Editing service content</p>
                  </div>
                </div>
                <button onClick={closeEdit} className="w-8 h-8 bg-white/15 rounded-lg flex items-center justify-center hover:bg-white/25 transition">
                  <X size={16} className="text-white" />
                </button>
              </div>

              <div className="flex-1 p-6 space-y-4">

                {/* ── Basics ── */}
                <AccordionSection title="Basic Info" open={expandedSection === "basics"} onToggle={() => toggle("basics")}>
                  <div className="space-y-4">
                    <Field label="Service Title">
                      <input className={inputCls} value={draft.title} onChange={(e) => setField("title", e.target.value)} />
                    </Field>
                    <Field label="Tagline">
                      <input className={inputCls} value={draft.tagline} onChange={(e) => setField("tagline", e.target.value)} />
                    </Field>
                    <Field label="Description">
                      <textarea className={textareaCls} rows={4} value={draft.description} onChange={(e) => setField("description", e.target.value)} />
                    </Field>
                  </div>
                </AccordionSection>

                {/* ── Highlights ── */}
                <AccordionSection title={`Highlights (${draft.highlights.length})`} open={expandedSection === "highlights"} onToggle={() => toggle("highlights")}>
                  <div className="space-y-2">
                    {draft.highlights.map((h, i) => (
                      <div key={i} className="flex gap-2 items-center">
                        <input className={`${inputCls} flex-1`} value={h} onChange={(e) => setHighlight(i, e.target.value)} placeholder={`Highlight ${i + 1}`} />
                        <button onClick={() => removeHighlight(i)} className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center hover:bg-red-100 transition shrink-0">
                          <Trash2 size={13} className="text-red-500" />
                        </button>
                      </div>
                    ))}
                    <button onClick={addHighlight} className="flex items-center gap-2 text-sm text-primary font-semibold hover:underline mt-1">
                      <Plus size={14} /> Add Highlight
                    </button>
                  </div>
                </AccordionSection>

                {/* ── Process ── */}
                <AccordionSection title={`How It Works (${draft.process.length} steps)`} open={expandedSection === "process"} onToggle={() => toggle("process")}>
                  <div className="space-y-4">
                    {draft.process.map((p, i) => (
                      <div key={i} className="bg-secondary/40 rounded-xl p-4 space-y-3">
                        <div className="flex items-center gap-2">
                          <span className="font-heading font-bold text-2xl text-border leading-none">{p.step}</span>
                          <span className="text-xs text-muted-foreground font-semibold">Step {i + 1}</span>
                        </div>
                        <Field label="Step Title">
                          <input className={inputCls} value={p.title} onChange={(e) => setProcess(i, "title", e.target.value)} />
                        </Field>
                        <Field label="Step Description">
                          <textarea className={textareaCls} rows={2} value={p.desc} onChange={(e) => setProcess(i, "desc", e.target.value)} />
                        </Field>
                      </div>
                    ))}
                  </div>
                </AccordionSection>

                {/* ── Stats ── */}
                <AccordionSection title={`Stats (${draft.stats.length})`} open={expandedSection === "stats"} onToggle={() => toggle("stats")}>
                  <div className="grid grid-cols-2 gap-3">
                    {draft.stats.map((st, i) => (
                      <div key={i} className="bg-secondary/40 rounded-xl p-3 space-y-2">
                        <Field label="Value">
                          <input className={inputCls} value={st.value} onChange={(e) => setStat(i, "value", e.target.value)} placeholder="e.g. 200+" />
                        </Field>
                        <Field label="Label">
                          <input className={inputCls} value={st.label} onChange={(e) => setStat(i, "label", e.target.value)} placeholder="e.g. Projects" />
                        </Field>
                      </div>
                    ))}
                  </div>
                </AccordionSection>

              </div>

              {/* Footer */}
              <div className="sticky bottom-0 bg-white border-t border-border px-6 py-4 flex gap-3">
                <button onClick={closeEdit} className="flex-1 py-2.5 rounded-xl border border-border text-sm font-semibold text-muted-foreground hover:bg-secondary transition">
                  Cancel
                </button>
                <button onClick={save} className="flex-1 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition flex items-center justify-center gap-2">
                  <Save size={15} /> Save Changes
                </button>
              </div>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── Accordion helper component ────────────────────────── */
function AccordionSection({ title, open, onToggle, children }: {
  title: string; open: boolean; onToggle: () => void; children: React.ReactNode;
}) {
  return (
    <div className="border border-border rounded-2xl overflow-hidden">
      <button onClick={onToggle}
        className="w-full flex items-center justify-between px-5 py-3.5 bg-secondary/30 hover:bg-secondary/50 transition text-left">
        <span className="font-semibold text-sm text-foreground">{title}</span>
        {open ? <ChevronUp size={16} className="text-muted-foreground" /> : <ChevronDown size={16} className="text-muted-foreground" />}
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
