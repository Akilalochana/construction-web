"use client";
import { motion } from "framer-motion";
import { Home, Wrench, ClipboardCheck, Ruler, HardHat, Paintbrush, ArrowUpRight, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const services = [
  {
    icon: Home,
    title: "Turnkey Construction",
    description:
      "We handle everything from A to Z — architectural planning, government approvals, structural work, and final finishing. Just hand us the land.",
    image: "/assets/hero.jpg",
    tag: "Most Popular",
    size: "featured",
    slug: "turnkey-construction",
  },
  {
    icon: Wrench,
    title: "Project Completion",
    description:
      "Have an incomplete or partially built house? We take over and finish it to perfection.",
    image: "/assets/before.jpg",
    size: "medium",
    slug: "project-completion",
  },
  {
    icon: Paintbrush,
    title: "Interior Finishing",
    description:
      "Premium interior finishing including flooring, painting, kitchen fitting, and bathroom tiling.",
    image: "/assets/apartment.jpg",
    size: "medium",
    slug: "interior-finishing",
  },
  {
    icon: Ruler,
    title: "Architectural Design",
    description:
      "Modern architectural plans tailored to your needs, optimizing space, light, and functionality.",
    image: "/assets/apartment1.jpg",
    size: "small",
    slug: "architectural-design",
  },
  {
    icon: ClipboardCheck,
    title: "Project Management",
    description:
      "Dedicated project managers ensuring timelines, budgets, and quality standards are met at every stage.",
    image: "/assets/modern-villa.jpg",
    size: "small",
    slug: "project-management",
  },
  {
    icon: HardHat,
    title: "Renovations",
    description:
      "Complete home renovations that transform aging properties into modern, energy-efficient living spaces.",
    image: null,
    size: "small",
    slug: "renovations",
  },
];

function page() {
  return (
    <section id="services" className="section-padding bg-background">
      <div className="container mx-auto px-4">

        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-accent font-semibold tracking-widest uppercase text-sm mb-2">
            What We Offer
          </p>
          <h2 className="font-heading text-3xl md:text-5xl font-bold text-foreground">
            Our Services
          </h2>
          <div className="w-16 h-1 bg-accent mx-auto mt-4 rounded-full" />
        </motion.div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 auto-rows-[200px] md:auto-rows-[280px] gap-4">

          {/* Featured Card — Turnkey Construction (col-span-2, row-span-2) */}
          <Link href={`/services/${services[0].slug}`} className="contents">
          <motion.div
            className="relative md:col-span-2 md:row-span-2 col-span-1 row-span-2 rounded-2xl overflow-hidden group cursor-pointer"
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Image
              src="/assets/hero.jpg"
              alt="Turnkey Construction"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            {/* Dark gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

            {/* Tag */}
            <div className="absolute top-5 left-5 flex items-center gap-1.5 bg-accent text-accent-foreground text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
              <Star size={12} fill="currentColor" /> Most Popular
            </div>

            {/* Arrow icon top-right */}
            <div className="absolute top-5 right-5 w-10 h-10 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <ArrowUpRight size={18} className="text-white" />
            </div>

            {/* Content */}
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <div className="w-12 h-12 bg-accent/20 backdrop-blur-sm rounded-xl flex items-center justify-center mb-4 border border-accent/30">
                <Home className="text-accent" size={24} />
              </div>
              <h3 className="font-heading text-3xl font-bold text-white mb-3">
                Turnkey Construction
              </h3>
              <p className="text-white/75 text-sm leading-relaxed max-w-md">
                We handle everything from A to Z — architectural planning, government approvals, structural work, and final finishing. Just hand us the land.
              </p>
              <div className="mt-5 inline-flex items-center gap-2 text-accent font-semibold text-sm group-hover:gap-3 transition-all">
                Learn More <ArrowUpRight size={16} />
              </div>
            </div>
          </motion.div>
          </Link>

          {/* Medium Cards — Project Completion & Interior Finishing */}
          {[services[1], services[2]].map((service, i) => (
            <Link key={service.title} href={`/services/${service.slug}`} className="contents">
            <motion.div
              className="relative rounded-2xl overflow-hidden group cursor-pointer"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
            >
              <Image
                src={service.image!}
                alt={service.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

              {/* Hover arrow */}
              <div className="absolute top-4 right-4 w-9 h-9 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <ArrowUpRight size={16} className="text-white" />
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-5">
                <div className="w-10 h-10 bg-accent/20 backdrop-blur-sm rounded-lg flex items-center justify-center mb-3 border border-accent/30">
                  <service.icon className="text-accent" size={20} />
                </div>
                <h3 className="font-heading text-xl font-bold text-white mb-1">
                  {service.title}
                </h3>
                <p className="text-white/70 text-xs leading-relaxed line-clamp-2">
                  {service.description}
                </p>
              </div>
            </motion.div>
            </Link>
          ))}

          {/* Small Cards — Architectural, Project Management, Renovations */}
          {[services[3], services[4], services[5]].map((service, i) => (
            <Link key={service.title} href={`/services/${service.slug}`} className="contents">
            <motion.div
              className="relative rounded-2xl overflow-hidden group cursor-pointer"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              {service.image ? (
                <>
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                </>
              ) : (
                /* Renovations — stylish navy gradient */
                <div className="absolute inset-0 bg-gradient-to-br from-[hsl(220,60%,14%)] via-[hsl(220,55%,20%)] to-[hsl(220,50%,28%)]">
                  {/* Decorative circle */}
                  <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-accent/10" />
                  <div className="absolute -bottom-8 -left-8 w-36 h-36 rounded-full bg-accent/5" />
                </div>
              )}

              {/* Hover arrow */}
              <div className="absolute top-4 right-4 w-9 h-9 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <ArrowUpRight size={16} className="text-white" />
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-5">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 border ${service.image ? "bg-accent/20 backdrop-blur-sm border-accent/30" : "bg-accent/20 border-accent/40"}`}>
                  <service.icon className="text-accent" size={20} />
                </div>
                <h3 className="font-heading text-lg font-bold text-white mb-1">
                  {service.title}
                </h3>
                <p className="text-white/70 text-xs leading-relaxed line-clamp-2">
                  {service.description}
                </p>
              </div>
            </motion.div>
            </Link>
          ))}

        </div>

        {/* Bottom stats bar */}
        <motion.div
          className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-6 bg-primary rounded-2xl px-8 py-8"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {[
            { value: "15+", label: "Years Experience" },
            { value: "200+", label: "Projects Completed" },
            { value: "50+", label: "Expert Team Members" },
            { value: "100%", label: "Client Satisfaction" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              className="text-center"
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
            >
              <div className="font-heading text-4xl font-bold text-accent mb-1">
                {stat.value}
              </div>
              <div className="text-primary-foreground/70 text-sm">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}

export default page