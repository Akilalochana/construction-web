"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowUpRight, Loader2 } from "lucide-react";

type Project = {
  id: number;
  title: string;
  category: string;
  image: string;
};

type Comparison = {
  id: number;
  title: string;
  location?: string;
  year?: string;
  beforeImage: string;
  afterImage: string;
  order: number;
};

export default function PortfolioSection() {
  const [sliderPos, setSliderPos] = useState(50);
  const [projects, setProjects] = useState<Project[]>([]);
  const [comparisons, setComparisons] = useState<Comparison[]>([]);
  const [activeComparison, setActiveComparison] = useState<Comparison | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projectsRes, comparisonsRes] = await Promise.all([
          fetch("/api/projects?featured=true"),
          fetch("/api/before-after"),
        ]);

        const projectsData = await projectsRes.json();
        const comparisonsData = await comparisonsRes.json();

        if (projectsData.data?.projects) {
          setProjects(projectsData.data.projects.slice(0, 3));
        }

        if (comparisonsData.data?.comparisons?.length > 0) {
          setComparisons(comparisonsData.data.comparisons);
          setActiveComparison(comparisonsData.data.comparisons[0]);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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

        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {loading ? (
            <div className="col-span-3 flex justify-center py-20">
              <Loader2 size={40} className="animate-spin text-accent" />
            </div>
          ) : projects.length === 0 ? (
            <div className="col-span-3 text-center text-muted-foreground py-10">
              No featured projects available at the moment.
            </div>
          ) : (
            projects.map((project, i) => (
              <motion.div
                key={project.id}
                className="group relative rounded-lg overflow-hidden shadow-md"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: i * 0.15 }}
                whileHover={{ y: -8 }}
              >
                <img
                  src={`/api/files/${project.image}`}
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
            ))
          )}
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

          {loading ? (
            <div className="flex justify-center py-10">
              <Loader2 size={32} className="animate-spin text-accent" />
            </div>
          ) : activeComparison ? (
            <>
              {/* Slider */}
              <div className="relative rounded-lg overflow-hidden shadow-lg aspect-[4/3] select-none">
                <img
                  src={`/api/files/${activeComparison.afterImage}`}
                  alt="After"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div
                  className="absolute inset-0 overflow-hidden"
                  style={{ width: `${sliderPos}%` }}
                >
                  <img
                    src={`/api/files/${activeComparison.beforeImage}`}
                    alt="Before"
                    className="w-full h-full object-cover"
                    style={{
                      minWidth: "100%",
                      width: `${100 / (sliderPos / 100)}%`,
                      maxWidth: "none",
                      position: "absolute",
                      left: 0,
                      top: 0,
                      height: "100%",
                    }}
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

              {/* Title + location */}
              <div className="text-center mt-3">
                <p className="font-heading font-semibold text-foreground text-sm">
                  {activeComparison.title}
                </p>
                {(activeComparison.location || activeComparison.year) && (
                  <p className="text-muted-foreground text-xs mt-0.5">
                    {[activeComparison.location, activeComparison.year]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>
                )}
              </div>

             
              {comparisons.length > 1 && (
                <div className="flex gap-2 justify-center mt-4 flex-wrap">
                  {comparisons.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => { setActiveComparison(c); setSliderPos(50); }}
                      className={`w-14 h-10 rounded-md overflow-hidden border-2 transition ${
                        activeComparison.id === c.id
                          ? "border-accent"
                          : "border-transparent opacity-60 hover:opacity-90"
                      }`}
                    >
                      <img
                        src={`/api/files/${c.afterImage}`}
                        alt={c.title}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="text-center text-muted-foreground text-sm py-10">
              No before & after comparisons available.
            </div>
          )}
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
            className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-xl font-semibold text-sm hover:bg-primary/90 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 group w-full sm:w-auto"
          >
            See All Projects
            <ArrowUpRight size={18} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}