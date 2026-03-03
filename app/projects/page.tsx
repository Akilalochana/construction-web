"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, MapPin } from "lucide-react";

const categories = ["All", "Residential", "Commercial", "Interior", "Renovation"];

const projects = [
  {
    title: "Modern Villa — Al Raha",
    category: "Residential",
    image: "/assets/modern-villa.jpg",
    location: "Al Raha, Abu Dhabi",
    year: "2024",
    description: "A luxury 5-bedroom villa with panoramic views, smart home integration, and bespoke interior finishes.",
    featured: true,
  },
  {
    title: "Skyline Apartments",
    category: "Commercial",
    image: "/assets/apartment.jpg",
    location: "Downtown, Dubai",
    year: "2023",
    description: "A 12-floor residential tower featuring 48 premium apartments with rooftop amenities.",
    featured: false,
  },
  {
    title: "Luxury Interior Fit-out",
    category: "Interior",
    image: "/assets/apartment1.jpg",
    location: "Palm Jumeirah, Dubai",
    year: "2024",
    description: "High-end interior fit-out for a penthouse — marble flooring, custom joinery, and designer lighting throughout.",
    featured: false,
  },
  {
    title: "Heritage Home Renovation",
    category: "Renovation",
    image: "/assets/before.jpg",
    location: "Deira, Dubai",
    year: "2023",
    description: "Complete structural renovation of a 1980s villa into a contemporary family home while preserving its character.",
    featured: false,
  },
  {
    title: "Palm Estate Compound",
    category: "Residential",
    image: "/assets/hero.jpg",
    location: "Palm Estate, Sharjah",
    year: "2022",
    description: "Turnkey construction of a 3-villa compound with shared pool, landscaping, and underground parking.",
    featured: false,
  },
  {
    title: "Al Noor Apartments",
    category: "Commercial",
    image: "/assets/apartment1.jpg",
    location: "Al Noor District, Sharjah",
    year: "2022",
    description: "Project completion of a partially built 8-floor apartment block, delivered 2 months ahead of schedule.",
    featured: false,
  },
  {
    title: "Sunset Hills Villa",
    category: "Residential",
    image: "/assets/modern-villa.jpg",
    location: "Sunset Hills, Abu Dhabi",
    year: "2021",
    description: "Architectural design and build of a contemporary 4-bedroom villa with eco-friendly features.",
    featured: false,
  },
  {
    title: "Executive Office Fit-out",
    category: "Interior",
    image: "/assets/apartment.jpg",
    location: "DIFC, Dubai",
    year: "2023",
    description: "Full interior fit-out of a 3,200 sqft executive office space with custom millwork and acoustic panelling.",
    featured: false,
  },
];

export default function ProjectsPage() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered = activeCategory === "All"
    ? projects
    : projects.filter((p) => p.category === activeCategory);

  return (
    <div className="min-h-screen bg-white">

      {/* Header */}
      <div className="bg-primary py-20 px-6 relative overflow-hidden">
        {/* Background image with overlay */}
        <div className="absolute inset-0">
          <Image src="/assets/hero.jpg" alt="Projects" fill className="object-cover opacity-20" />
        </div>
        {/* Decorative circles */}
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-accent/10" />
        <div className="absolute -bottom-10 -left-10 w-56 h-56 rounded-full bg-white/5" />

        <div className="container mx-auto relative z-10">
          <Link
            href="/#portfolio"
            className="inline-flex items-center gap-2 text-primary-foreground/60 hover:text-accent text-sm mb-8 transition-colors group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Link>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-accent font-semibold tracking-widest uppercase text-sm mb-3">Our Portfolio</p>
            <h1 className="font-heading text-4xl md:text-6xl font-bold text-primary-foreground mb-4">
              All Projects
            </h1>
            <p className="text-primary-foreground/70 text-lg max-w-xl">
              Explore our complete portfolio of residential, commercial, interior, and renovation projects.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-border shadow-sm">
        <div className="container mx-auto px-6 py-4 flex items-center gap-3 overflow-x-auto scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`shrink-0 px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
                activeCategory === cat
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "bg-secondary text-muted-foreground hover:bg-accent/10 hover:text-accent"
              }`}
            >
              {cat}
            </button>
          ))}
          <span className="ml-auto shrink-0 text-muted-foreground text-sm">
            {filtered.length} project{filtered.length !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="container mx-auto px-6 py-16">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
          >
            {filtered.map((project, i) => (
              <motion.div
                key={project.title}
                className={`group relative rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer bg-white border border-border
                  ${project.featured ? "md:col-span-2 md:row-span-1" : ""}`}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.07 }}
                whileHover={{ y: -4 }}
              >
                {/* Image */}
                <div className={`relative overflow-hidden ${project.featured ? "h-72" : "h-56"}`}>
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                  {/* Category badge */}
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-foreground text-xs font-bold px-3 py-1.5 rounded-full">
                    {project.category}
                  </div>

                  {/* Arrow */}
                  <div className="absolute top-4 right-4 w-9 h-9 bg-accent rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 scale-75 group-hover:scale-100">
                    <ArrowUpRight size={16} className="text-accent-foreground" />
                  </div>

                  {/* Year over image */}
                  <div className="absolute bottom-4 right-4 text-white/70 text-xs font-medium">
                    {project.year}
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-heading text-lg font-bold text-foreground leading-tight">
                      {project.title}
                    </h3>
                  </div>
                  <div className="flex items-center gap-1.5 text-muted-foreground text-xs mb-3">
                    <MapPin size={12} />
                    {project.location}
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2">
                    {project.description}
                  </p>
                  <div className="mt-4 h-0.5 w-8 bg-accent rounded-full group-hover:w-16 transition-all duration-300" />
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Empty state */}
        {filtered.length === 0 && (
          <div className="text-center py-24 text-muted-foreground">
            No projects found in this category.
          </div>
        )}
      </div>

      {/* CTA */}
      <div className="bg-[hsl(215,20%,97%)] py-20 px-6">
        <div className="container mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
              Have a Project in Mind?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Let's bring your vision to life. Get a free consultation and quote from our expert team.
            </p>
            <Link
              href="/#contact"
              className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-8 py-4 rounded-xl font-semibold hover:brightness-110 transition shadow-lg group"
            >
              Get a Free Quote
              <ArrowUpRight size={18} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </div>

    </div>
  );
}
