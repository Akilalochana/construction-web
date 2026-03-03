"use client";
import { motion } from "framer-motion";
import { Shield, Target, Users, CheckCircle2, ArrowUpRight, Award, Clock, Hammer } from "lucide-react";
import Image from "next/image";

const team = [
  { name: "Ahmed Al-Rashid", role: "CEO & Founder", initials: "AR", color: "from-navy to-navy-light" },
  { name: "Sara Mahmoud", role: "Lead Architect", initials: "SM", color: "from-amber-700 to-amber-500" },
  { name: "James Mitchell", role: "Project Manager", initials: "JM", color: "from-slate-700 to-slate-500" },
  { name: "Fatima Hassan", role: "Structural Engineer", initials: "FH", color: "from-emerald-800 to-emerald-600" },
];

const values = [
  {
    icon: Target,
    title: "Our Mission",
    text: "To build structures that stand the test of time, delivering quality, safety, and innovation in every project we undertake.",
    color: "border-l-accent",
  },
  {
    icon: Shield,
    title: "Trust & Safety",
    text: "Licensed, insured, and committed to the highest safety standards. Your investment is protected at every stage.",
    color: "border-l-blue-500",
  },
  {
    icon: Users,
    title: "Client First",
    text: "We believe in transparent communication, on-time delivery, and exceeding expectations — every single time.",
    color: "border-l-emerald-500",
  },
];

const milestones = [
  { icon: Hammer, year: "2009", label: "Company Founded" },
  { icon: Award, label: "100+ Projects", year: "2015" },
  { icon: Clock, label: "15+ Years Experience", year: "2024" },
];

function page() {
  return (
    <section id="about" className="bg-white">

      {/* ── HERO SPLIT ─────────────────────────────────────── */}
      <div className="container mx-auto px-4 sm:px-6 pt-16 sm:pt-24 pb-12 sm:pb-20">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">

          {/* Left — Photo collage */}
          <motion.div
            className="relative h-[260px] sm:h-[380px] lg:h-[520px]"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            {/* Main large image */}
            <div className="absolute top-0 left-0 w-[72%] h-[80%] rounded-2xl overflow-hidden shadow-2xl">
              <Image src="/assets/modern-villa.jpg" alt="Modern Villa" fill className="object-cover" />
            </div>
            {/* Secondary image bottom-right */}
            <div className="absolute bottom-0 right-0 w-[52%] h-[52%] rounded-2xl overflow-hidden shadow-xl border-4 border-white">
              <Image src="/assets/apartment1.jpg" alt="Apartment" fill className="object-cover" />
            </div>
            {/* Floating stat badge — hidden on very small screens */}
            <motion.div
              className="absolute top-4 right-0 bg-white rounded-xl shadow-lg px-3 sm:px-5 py-2 sm:py-4 border border-border hidden sm:block"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: 0.4 }}
            >
              <div className="font-heading text-2xl sm:text-3xl font-bold text-primary">15+</div>
              <div className="text-muted-foreground text-xs mt-0.5">Years of Excellence</div>
            </motion.div>
            {/* Floating stat badge 2 — hidden on small screens */}
            <motion.div
              className="absolute bottom-[54%] left-[68%] bg-accent rounded-xl shadow-lg px-3 sm:px-5 py-2 sm:py-4 hidden sm:block"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.65, duration: 0.4 }}
            >
              <div className="font-heading text-2xl sm:text-3xl font-bold text-accent-foreground">200+</div>
              <div className="text-accent-foreground/80 text-xs mt-0.5">Projects Delivered</div>
            </motion.div>
            {/* Accent dot */}
            <div className="absolute top-[42%] left-[70%] w-4 h-4 rounded-full bg-accent opacity-80 hidden sm:block" />
          </motion.div>

          {/* Right — Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <p className="text-accent font-semibold tracking-widest uppercase text-sm mb-3">
              Who We Are
            </p>
            <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold text-foreground leading-tight mb-6">
              Building Dreams <br />
              <span className="text-accent">Since 2009</span>
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6 text-[15px]">
              BuildCraft is a full-service construction company with over 15 years of proven experience. From turnkey residential builds to complex commercial renovations, we bring precision, craftsmanship, and integrity to every project.
            </p>
            <ul className="space-y-3 mb-8">
              {["Licensed & fully insured contractors", "End-to-end project management", "Transparent pricing, no hidden costs", "On-time delivery guarantee"].map((point) => (
                <li key={point} className="flex items-center gap-3 text-foreground text-sm">
                  <CheckCircle2 size={18} className="text-accent shrink-0" />
                  {point}
                </li>
              ))}
            </ul>

            {/* Milestones */}
            <div className="flex gap-6 flex-wrap">
              {milestones.map((m) => (
                <div key={m.label} className="flex items-center gap-2">
                  <div className="w-9 h-9 bg-accent/10 rounded-lg flex items-center justify-center">
                    <m.icon size={18} className="text-accent" />
                  </div>
                  <div>
                    <div className="font-heading font-bold text-foreground text-sm">{m.year}</div>
                    <div className="text-muted-foreground text-xs">{m.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── VALUES ─────────────────────────────────────────── */}
      <div className="bg-[hsl(215,20%,97%)] py-20">
        <div className="container mx-auto px-6">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="font-heading text-3xl font-bold text-foreground">What Drives Us</h3>
            <div className="w-12 h-1 bg-accent mx-auto mt-3 rounded-full" />
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6">
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                className={`bg-white rounded-2xl p-7 shadow-sm border-l-4 ${v.color} hover:shadow-md transition-shadow`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.12 }}
              >
                <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mb-5">
                  <v.icon className="text-accent" size={24} />
                </div>
                <h4 className="font-heading text-lg font-semibold text-foreground mb-2">{v.title}</h4>
                <p className="text-muted-foreground text-sm leading-relaxed">{v.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* ── CEO QUOTE ──────────────────────────────────────── */}
      <div className="container mx-auto px-4 sm:px-6 py-12 sm:py-20">
        <motion.div
          className="grid lg:grid-cols-5 gap-6 lg:gap-8 items-center bg-white rounded-3xl overflow-hidden shadow-md border border-border"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          {/* Photo side */}
          <div className="lg:col-span-2 relative h-48 sm:h-64 lg:h-full min-h-[220px] lg:min-h-[280px]">
            <Image src="/assets/hero.jpg" alt="CEO" fill className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-white/10 lg:to-white hidden lg:block" />
          </div>

          {/* Quote side */}
          <div className="lg:col-span-3 px-8 py-10">
            <div className="text-6xl font-heading text-accent/20 leading-none mb-2">"</div>
            <p className="text-foreground/80 leading-relaxed text-[15px] mb-6 -mt-4">
              With over 15 years of experience in the construction industry, my vision has always been to build not just structures, but lasting relationships with our clients. Every project we take on is a reflection of our commitment to quality and integrity. We don't just build houses — we build homes.
            </p>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
                <span className="font-heading font-bold text-primary-foreground text-sm">AR</span>
              </div>
              <div>
                <div className="font-heading font-bold text-foreground">Ahmed Al-Rashid</div>
                <div className="text-accent text-sm font-medium">CEO & Founder</div>
              </div>
              <div className="ml-auto">
                <div className="w-9 h-9 bg-accent/10 rounded-full flex items-center justify-center">
                  <ArrowUpRight size={16} className="text-accent" />
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ── TEAM ───────────────────────────────────────────── */}
      <div className="bg-[hsl(215,20%,97%)] py-20">
        <div className="container mx-auto px-6">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-accent font-semibold tracking-widest uppercase text-sm mb-2">The People Behind It</p>
            <h3 className="font-heading text-3xl font-bold text-foreground">Meet Our Team</h3>
            <div className="w-12 h-1 bg-accent mx-auto mt-3 rounded-full" />
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {team.map((member, i) => (
              <motion.div
                key={member.name}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow group border border-border"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                {/* Avatar area */}
                <div className={`h-36 bg-gradient-to-br ${member.color} flex items-center justify-center relative overflow-hidden`}>
                  <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-2 right-2 w-20 h-20 rounded-full border-2 border-white/40" />
                    <div className="absolute -bottom-4 -left-4 w-28 h-28 rounded-full border-2 border-white/20" />
                  </div>
                  <span className="font-heading text-4xl font-bold text-white/90 z-10">{member.initials}</span>
                </div>
                {/* Info */}
                <div className="p-5 text-center">
                  <h4 className="font-heading font-semibold text-foreground text-sm">{member.name}</h4>
                  <p className="text-muted-foreground text-xs mt-1">{member.role}</p>
                  <div className="mt-3 w-8 h-0.5 bg-accent mx-auto rounded-full group-hover:w-14 transition-all duration-300" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

    </section>
  );
}

export default page