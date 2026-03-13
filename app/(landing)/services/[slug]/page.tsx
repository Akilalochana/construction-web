"use client";
import { use, useState, useEffect } from "react";
import { notFound } from "next/navigation";
import { motion } from "framer-motion";
import {
  Home, Wrench, ClipboardCheck, Ruler, HardHat, Paintbrush,
  ArrowLeft, CheckCircle, Loader2,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

// ── Icon map ──────────────────────────────────────────────────────────────────
const ICON_MAP: Record<string, LucideIcon> = {
  Home, Wrench, ClipboardCheck, Ruler, HardHat, Paintbrush,
};

// ── Type ──────────────────────────────────────────────────────────────────────
type Service = {
  id: number;
  slug: string;
  iconName: string;
  color: string;
  title: string;
  tagline: string;
  description: string;
  image: string | null;
  highlights: string[];
  process: { step: string; title: string; desc: string; order: number }[];
  stats: { value: string; label: string; order: number }[];
};

// ── Component ─────────────────────────────────────────────────────────────────
export default function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);

  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFoundState, setNotFoundState] = useState(false);

  useEffect(() => {
    const fetchService = async () => {
      try {
        const res = await fetch(`/api/services/${slug}`);

        if (res.status === 404) {
          // Service-ඒකක් නැතිනම් notFound page
          setNotFoundState(true);
          return;
        }

        const data = await res.json();
        setService(data.data?.service ?? null);
      } catch {
        setNotFoundState(true);
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [slug]);

  // notFound() — Next.js-ඒකේ built-in 404 page
  if (notFoundState) notFound();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 size={32} className="animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!service) notFound();

  const Icon = ICON_MAP[service.iconName] ?? Home;

  return (
    <div className="min-h-screen bg-background">

      {/* Hero */}
      <div className={`relative h-[50vh] min-h-[340px] bg-gradient-to-br ${service.color} overflow-hidden`}>
        {service.image && (
          <>
            {/* /api/files/ — file serving route */}
            <Image src={`/api/files/${service.image}`} alt={service.title}
              fill className="object-cover opacity-30" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          </>
        )}
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
            {service.highlights.map((h, i) => (
              <div key={i} className="flex items-start gap-3">
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