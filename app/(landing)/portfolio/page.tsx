"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";



const projects = [
  {  title: "Modern Villa — Al Raha", category: "Residential" },
  {  title: "Skyline Apartments", category: "Commercial" },
  {  title: "Luxury Interior Fit-out", category: "Interior" },
];


function page() {

     const [sliderPos, setSliderPos] = useState(50);
  return (
    <section id="portfolio" className="section-padding bg-secondary">
      <div className="container mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-accent font-semibold tracking-widest uppercase text-sm mb-2">
            Our Work
          </p>
          <h2 className="font-heading text-3xl md:text-5xl font-bold text-foreground">
            Featured Projects
          </h2>
          <div className="w-16 h-1 bg-accent mx-auto mt-4 rounded-full" />
        </motion.div>

        {/* Project Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {projects.map((project, i) => (
            <motion.div
              key={project.title}
              className="group relative rounded-lg overflow-hidden shadow-md"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              whileHover={{ y: -8 }}
            >
              <img
                src="/assets/modern-villa.jpg"
                alt={project.title}
                className="w-full h-72 object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/60 transition-colors duration-300 flex items-end">
                <div className="p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <span className="text-accent text-xs font-semibold uppercase tracking-wider">
                    {project.category}
                  </span>
                  <h3 className="font-heading text-xl font-bold text-primary-foreground mt-1">
                    {project.title}
                  </h3>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Before / After Slider */}
        <motion.div
          className="max-w-2xl mx-auto"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.7 }}
        >
          <h3 className="font-heading text-2xl font-bold text-foreground text-center mb-6">
            Before & After
          </h3>
          <div className="relative rounded-lg overflow-hidden shadow-lg aspect-[4/3] select-none">
            <img
              src="/assets/apartment.jpg"
              alt="After renovation"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div
              className="absolute inset-0 overflow-hidden"
              style={{ width: `${sliderPos}%` }}
            >
              <img
                src="/assets/before.jpg"
                alt="Before renovation"
                className="w-full h-full object-cover"
                style={{ minWidth: "100%", width: `${100 / (sliderPos / 100)}%`, maxWidth: "none", position: "absolute", left: 0, top: 0, height: "100%" }}
              />
            </div>
            <div
              className="absolute top-0 bottom-0 w-1 bg-accent cursor-ew-resize z-10"
              style={{ left: `${sliderPos}%`, transform: "translateX(-50%)" }}
            >
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-accent rounded-full flex items-center justify-center shadow-lg">
                <span className="text-accent-foreground font-bold text-xs">↔</span>
              </div>
            </div>
            <span className="absolute top-4 left-4 bg-primary/80 text-primary-foreground text-xs font-semibold px-3 py-1 rounded">
              BEFORE
            </span>
            <span className="absolute top-4 right-4 bg-accent/90 text-accent-foreground text-xs font-semibold px-3 py-1 rounded">
              AFTER
            </span>
            <input
              type="range"
              min={0}
              max={100}
              value={sliderPos}
              onChange={(e) => setSliderPos(Number(e.target.value))}
              className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-20"
              aria-label="Before and after comparison slider"
            />
          </div>
        </motion.div>

        {/* See All Projects Button */}
        <motion.div
          className="text-center mt-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-xl font-semibold text-sm hover:bg-primary/90 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 group"
          >
            See All Projects
            <ArrowUpRight size={18} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </motion.div>

      </div>
    </section>
  );
}

export default page