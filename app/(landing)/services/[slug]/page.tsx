"use client";
import { use } from "react";
import { notFound } from "next/navigation";
import { motion } from "framer-motion";
import { Home, Wrench, ClipboardCheck, Ruler, HardHat, Paintbrush, ArrowLeft, CheckCircle } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const servicesData: Record<string, {
  icon: LucideIcon;
  title: string;
  tagline: string;
  description: string;
  image: string | null;
  color: string;
  highlights: string[];
  process: { step: string; title: string; desc: string }[];
  stats: { value: string; label: string }[];
}> = {
  "turnkey-construction": {
    icon: Home,
    title: "Turnkey Construction",
    tagline: "Complete Build, Zero Stress",
    description:
      "We handle everything from A to Z — from the first architectural sketch to handing you the keys. Our turnkey service covers planning permissions, structural work, MEP installations, and premium finishing. You stay informed at every milestone; we handle every detail.",
    image: "/assets/hero.jpg",
    color: "from-[hsl(220,60%,14%)] to-[hsl(220,50%,28%)]",
    highlights: [
      "Architectural design & planning approvals",
      "Full structural & civil works",
      "Electrical, plumbing & HVAC installations",
      "Premium interior finishing",
      "Landscaping & external works",
      "Defects liability & after-handover support",
    ],
    process: [
      { step: "01", title: "Consultation & Design", desc: "We understand your vision, budget, and timeline to create a tailored architectural plan." },
      { step: "02", title: "Approvals & Permits",   desc: "Our team handles all government approvals and building permits on your behalf." },
      { step: "03", title: "Construction Phase",    desc: "Experienced crews execute structural, MEP, and finishing works to exacting standards." },
      { step: "04", title: "Handover",              desc: "Final inspections, punch-list resolution, and keys-in-hand delivery to you." },
    ],
    stats: [
      { value: "200+", label: "Completed Builds" },
      { value: "15+",  label: "Years Experience" },
      { value: "100%", label: "On-Time Delivery" },
      { value: "4.9★", label: "Client Rating" },
    ],
  },
  "project-completion": {
    icon: Wrench,
    title: "Project Completion",
    tagline: "We Finish What Others Started",
    description:
      "Have a partially built or stalled property? We perform a thorough structural and quality audit, then take full ownership of completing the project — fast, cleanly, and to the highest standard. No hidden costs, no more delays.",
    image: "/assets/before.jpg",
    color: "from-amber-700 to-amber-500",
    highlights: [
      "Free structural & quality audit",
      "Transparent completion cost estimate",
      "Seamless handover from previous contractor",
      "Rectification of substandard work",
      "Dedicated completion manager",
      "Fixed-price completion contracts available",
    ],
    process: [
      { step: "01", title: "Site Audit",          desc: "We inspect existing work, identify defects, and assess what remains to be done." },
      { step: "02", title: "Scope & Pricing",      desc: "A clear, itemised quote is provided — no surprises mid-project." },
      { step: "03", title: "Remediation & Build",  desc: "Defective work is rectified before continuing the build to our standards." },
      { step: "04", title: "Final Completion",     desc: "Full finishing, snagging, and handover at your convenience." },
    ],
    stats: [
      { value: "80+",  label: "Completions" },
      { value: "3–6",  label: "Month Avg. Delivery" },
      { value: "0",    label: "Hidden Fees" },
      { value: "100%", label: "Satisfaction" },
    ],
  },
  "interior-finishing": {
    icon: Paintbrush,
    title: "Interior Finishing",
    tagline: "Spaces That Tell Your Story",
    description:
      "We transform bare concrete shells into beautifully finished living or working spaces. From bespoke kitchen cabinetry to large-format floor tiling and designer bathroom suites, every finish is selected and installed with precision.",
    image: "/assets/apartment.jpg",
    color: "from-rose-700 to-rose-500",
    highlights: [
      "Flooring — tile, hardwood, vinyl & marble",
      "Custom kitchen and joinery fitting",
      "Bathroom tiling & sanitary ware installation",
      "Plastering, skimming & decorative painting",
      "False ceilings & feature lighting",
      "Built-in wardrobes & storage solutions",
    ],
    process: [
      { step: "01", title: "Design Consultation", desc: "Material boards, mood boards, and 3D visualisations to align with your taste." },
      { step: "02", title: "Material Selection",  desc: "Access to our curated catalogue of premium local and imported finishes." },
      { step: "03", title: "Installation",        desc: "Skilled tradespeople carry out each finish with meticulous attention to detail." },
      { step: "04", title: "Styling & Handover",  desc: "Final styling walk-through and snag-free handover." },
    ],
    stats: [
      { value: "150+", label: "Interiors Finished" },
      { value: "30+",  label: "Finish Options" },
      { value: "5yr",  label: "Workmanship Warranty" },
      { value: "4.8★", label: "Client Rating" },
    ],
  },
  "architectural-design": {
    icon: Ruler,
    title: "Architectural Design",
    tagline: "Form Meets Function",
    description:
      "Our in-house architects create modern, context-sensitive designs that maximise natural light, optimise space, and reflect your personality. Every plan is engineered for both beauty and buildability.",
    image: "/assets/apartment1.jpg",
    color: "from-indigo-700 to-indigo-500",
    highlights: [
      "Concept & schematic design",
      "Detailed construction drawings",
      "3D visualisations & walkthroughs",
      "Structural engineering coordination",
      "Planning permission packages",
      "Interior design integration",
    ],
    process: [
      { step: "01", title: "Brief & Discovery", desc: "Deep-dive session to understand your lifestyle, budget, and site constraints." },
      { step: "02", title: "Concept Design",    desc: "Sketch options and spatial studies refined into a preferred scheme." },
      { step: "03", title: "Developed Design",  desc: "Detailed drawings, material schedules, and submission-ready documents." },
      { step: "04", title: "Construction Support", desc: "On-site architect oversight during build to ensure design intent is realised." },
    ],
    stats: [
      { value: "120+", label: "Designs Completed" },
      { value: "100%", label: "Permit Success Rate" },
      { value: "15+",  label: "Award Nominations" },
      { value: "4.9★", label: "Client Rating" },
    ],
  },
  "project-management": {
    icon: ClipboardCheck,
    title: "Project Management",
    tagline: "On Time. On Budget. Every Time.",
    description:
      "A dedicated project manager is your single point of contact throughout the entire build. We coordinate contractors, track milestones, manage budgets, and ensure quality at every stage so you never have to worry.",
    image: "/assets/modern-villa.jpg",
    color: "from-emerald-800 to-emerald-600",
    highlights: [
      "Dedicated project manager from day one",
      "Weekly progress reports & site visits",
      "Contractor procurement & management",
      "Budget tracking & cost control",
      "Risk identification & mitigation",
      "Real-time project dashboard access",
    ],
    process: [
      { step: "01", title: "Project Briefing",    desc: "Define scope, budget, programme, and success criteria together." },
      { step: "02", title: "Procurement",         desc: "We source and vet the best-value contractors for each trade." },
      { step: "03", title: "Execution & Control", desc: "Daily on-site coordination with weekly client reporting." },
      { step: "04", title: "Closeout",            desc: "Final inspections, contract closeout, and lessons-learned documentation." },
    ],
    stats: [
      { value: "500+", label: "Projects Managed" },
      { value: "97%",  label: "On-Time Completion" },
      { value: "12%",  label: "Avg. Cost Saving" },
      { value: "4.9★", label: "Client Rating" },
    ],
  },
  "renovations": {
    icon: HardHat,
    title: "Renovations",
    tagline: "Old Bones, New Life",
    description:
      "We breathe new life into aging properties — whether a full-gut renovation, a kitchen and bathroom refresh, or an energy-efficiency upgrade. Our renovation specialists respect the original character while modernising every inch.",
    image: null,
    color: "from-[hsl(220,60%,14%)] via-[hsl(220,55%,20%)] to-[hsl(220,50%,28%)]",
    highlights: [
      "Full-gut and partial renovations",
      "Kitchen & bathroom remodels",
      "Structural changes & extensions",
      "Energy efficiency upgrades (insulation, windows)",
      "Heritage & period property specialists",
      "Minimal disruption scheduling",
    ],
    process: [
      { step: "01", title: "Survey & Assessment", desc: "Thorough condition survey to understand the building's existing structure and services." },
      { step: "02", title: "Design & Planning",   desc: "Renovation design, material selection, and where required, planning applications." },
      { step: "03", title: "Demolition & Build",  desc: "Controlled strip-out followed by high-quality build works." },
      { step: "04", title: "Finishing & Reveal",  desc: "Premium finishing and a stunning reveal — minimal mess, maximum impact." },
    ],
    stats: [
      { value: "180+", label: "Renovations Done" },
      { value: "40%",  label: "Avg. Value Added" },
      { value: "8wk",  label: "Avg. Turnaround" },
      { value: "4.8★", label: "Client Rating" },
    ],
  },
};

export default function ServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const service = servicesData[slug];
  if (!service) notFound();

  const Icon = service.icon;

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className={`relative h-[50vh] min-h-[340px] bg-gradient-to-br ${service.color} overflow-hidden`}>
        {service.image && (
          <>
            <Image src={service.image} alt={service.title} fill className="object-cover opacity-30" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          </>
        )}
        {/* Decorative circles */}
        <div className="absolute -top-16 -right-16 w-80 h-80 rounded-full bg-white/5" />
        <div className="absolute -bottom-10 -left-10 w-60 h-60 rounded-full bg-white/5" />

        <div className="relative z-10 h-full flex flex-col justify-between px-4 sm:px-6 md:px-12 py-6 sm:py-8 max-w-5xl mx-auto">
          <Link href="/#services"
            className="inline-flex items-center gap-2 text-white/80 hover:text-white text-sm font-medium transition-colors w-fit">
            <ArrowLeft size={16} /> Back to Services
          </Link>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="w-14 h-14 bg-white/15 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-5 border border-white/20">
              <Icon className="text-white" size={28} />
            </div>
            <p className="text-white/60 text-sm font-semibold uppercase tracking-widest mb-2">{service.tagline}</p>
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-white">{service.title}</h1>
          </motion.div>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 md:px-12 py-10 sm:py-14 space-y-12 sm:space-y-16">

        {/* Description + Highlights */}
        <motion.div className="grid md:grid-cols-2 gap-10 items-start"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <div>
            <h2 className="font-heading text-2xl font-bold text-foreground mb-4">Overview</h2>
            <p className="text-muted-foreground leading-relaxed">{service.description}</p>
          </div>
          <div className="bg-secondary/40 rounded-2xl p-6 space-y-3">
            <h3 className="font-heading font-bold text-foreground text-base mb-1">What&apos;s Included</h3>
            {service.highlights.map((h) => (
              <div key={h} className="flex items-start gap-3">
                <CheckCircle size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-foreground">{h}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div className={`grid grid-cols-2 md:grid-cols-4 gap-4 bg-gradient-to-br ${service.color} rounded-2xl p-8`}
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          {service.stats.map((s) => (
            <div key={s.label} className="text-center">
              <div className="font-heading text-3xl font-bold text-white mb-1">{s.value}</div>
              <div className="text-white/60 text-xs">{s.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Process */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <h2 className="font-heading text-2xl font-bold text-foreground mb-8">How It Works</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
            {service.process.map((p, i) => (
              <div key={p.step} className="relative bg-white border border-border rounded-2xl p-5 shadow-sm">
                <div className="text-4xl font-heading font-bold text-border mb-3 leading-none">{p.step}</div>
                <h4 className="font-heading font-semibold text-foreground mb-2">{p.title}</h4>
                <p className="text-muted-foreground text-sm leading-relaxed">{p.desc}</p>
                {i < service.process.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-5 w-6 h-px bg-border" />
                )}
              </div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div className="bg-primary rounded-2xl p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <div>
            <h3 className="font-heading text-2xl font-bold text-primary-foreground mb-2">Ready to get started?</h3>
            <p className="text-primary-foreground/70 text-sm">Talk to our team today — free consultation, no obligation.</p>
          </div>
          <div className="flex gap-3 flex-wrap">
            <Link href="/#contact"
              className="px-6 py-3 bg-accent text-accent-foreground font-semibold rounded-xl text-sm hover:bg-accent/90 transition">
              Get Free Quote
            </Link>
            <Link href="/#services"
              className="px-6 py-3 bg-white/10 text-primary-foreground font-semibold rounded-xl text-sm hover:bg-white/20 transition border border-white/15">
              View All Services
            </Link>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
