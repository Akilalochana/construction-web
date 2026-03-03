"use client";
import { motion } from "framer-motion";
import { Star, Quote, ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const testimonials = [
  {
    name: "Mohammad Al-Farsi",
    initials: "MA",
    text: "BuildCraft transformed our vision into a stunning villa. Their attention to detail and professionalism is unmatched. The team delivered on time and within budget.",
    rating: 5,
    project: "Luxury Villa — Palm Estate",
    image: "/assets/modern-villa.jpg",
    featured: false,
  },
  {
    name: "Layla Ahmed",
    initials: "LA",
    text: "We had an incomplete house that sat for 2 years. BuildCraft took over and finished it beautifully in just 4 months. I couldn't be happier with the result!",
    rating: 5,
    project: "Project Completion — Al Noor District",
    image: "/assets/apartment.jpg",
    featured: true,
  },
  {
    name: "Robert & Jane Williams",
    initials: "RW",
    text: "From architectural design to the final handover, everything was seamless. The quality of construction is exceptional. Highly recommend BuildCraft!",
    rating: 5,
    project: "Turnkey Home — Sunset Hills",
    image: "/assets/apartment1.jpg",
    featured: false,
  },
];

export default function page() {
  return (
    <section id="testimonials" className="bg-white py-24">
      <div className="container mx-auto px-6">

        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-accent font-semibold tracking-widest uppercase text-sm mb-2">
            Testimonials
          </p>
          <h2 className="font-heading text-3xl md:text-5xl font-bold text-foreground mb-5">
            What Our Clients Say
          </h2>
          <div className="w-16 h-1 bg-accent mx-auto rounded-full mb-8" />

          {/* Overall rating badge */}
          <motion.div
            className="inline-flex items-center gap-3 bg-[hsl(215,20%,97%)] border border-border rounded-2xl px-6 py-3"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.4 }}
          >
            <div className="flex gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={16} className="text-accent fill-accent" />
              ))}
            </div>
            <span className="font-heading font-bold text-foreground text-lg">5.0</span>
            <span className="text-muted-foreground text-sm">— from 200+ happy clients</span>
          </motion.div>
        </motion.div>

        {/* Cards Grid */}
        <div className="grid md:grid-cols-3 gap-6 items-start">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              className={`relative rounded-2xl overflow-hidden flex flex-col group transition-all duration-300
                ${t.featured
                  ? "shadow-2xl ring-2 ring-accent md:-mt-4 md:mb-4"
                  : "shadow-md hover:shadow-xl border border-border"
                }`}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
            >
              {/* Project photo */}
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={t.image}
                  alt={t.project}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/50" />

                {/* Featured badge */}
                {t.featured && (
                  <div className="absolute top-4 left-4 bg-accent text-accent-foreground text-xs font-bold px-3 py-1.5 rounded-full">
                    ★ Top Review
                  </div>
                )}

                {/* Project label bottom */}
                <div className="absolute bottom-4 left-4 right-4">
                  <p className="text-white/90 text-xs font-medium">{t.project}</p>
                </div>
              </div>

              {/* Content */}
              <div className={`p-6 flex flex-col gap-4 flex-1 ${t.featured ? "bg-primary" : "bg-white"}`}>

                {/* Quote icon */}
                <Quote size={24} className={t.featured ? "text-accent" : "text-accent/40"} />

                {/* Stars */}
                <div className="flex gap-1">
                  {Array.from({ length: t.rating }).map((_, idx) => (
                    <Star key={idx} size={14} className="text-accent fill-accent" />
                  ))}
                </div>

                {/* Text */}
                <p className={`text-sm leading-relaxed flex-1 italic ${t.featured ? "text-primary-foreground/85" : "text-muted-foreground"}`}>
                  "{t.text}"
                </p>

                {/* Author */}
                <div className="flex items-center gap-3 pt-2 border-t border-border/30">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 font-heading font-bold text-sm
                    ${t.featured ? "bg-accent/20 text-accent" : "bg-accent/10 text-accent"}`}>
                    {t.initials}
                  </div>
                  <div>
                    <p className={`font-heading font-semibold text-sm ${t.featured ? "text-primary-foreground" : "text-foreground"}`}>
                      {t.name}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* See All Reviews Button */}
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <Link
            href="/reviews"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-xl font-semibold text-sm hover:bg-primary/90 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 group"
          >
            See All Reviews
            <ArrowUpRight size={18} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </motion.div>

        {/* Bottom CTA strip */}
        <motion.div
          className="mt-16 rounded-2xl overflow-hidden relative"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="relative h-56">
            <Image src="/assets/hero.jpg" alt="Our Work" fill className="object-cover" />
            <div className="absolute inset-0 bg-primary/80" />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
              <p className="text-accent font-semibold tracking-widest uppercase text-xs mb-2">Join Our Happy Clients</p>
              <h3 className="font-heading text-2xl md:text-3xl font-bold text-primary-foreground mb-5">
                Ready to Build Your Dream Home?
              </h3>
              <a
                href="#contact"
                className="bg-accent text-accent-foreground px-7 py-3 rounded-lg text-sm font-semibold hover:brightness-110 transition"
              >
                Get a Free Quote
              </a>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}

