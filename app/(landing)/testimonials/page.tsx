import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";

const testimonials = [
  {
    name: "Mohammad Al-Farsi",
    text: "BuildCraft transformed our vision into a stunning villa. Their attention to detail and professionalism is unmatched. The team delivered on time and within budget.",
    rating: 5,
    project: "Luxury Villa — Palm Estate",
  },
  {
    name: "Layla Ahmed",
    text: "We had an incomplete house that sat for 2 years. BuildCraft took over and finished it beautifully. I couldn't be happier with the result!",
    rating: 5,
    project: "Project Completion — Al Noor District",
  },
  {
    name: "Robert & Jane Williams",
    text: "From architectural design to the final handover, everything was seamless. The quality of construction is exceptional. Highly recommend!",
    rating: 5,
    project: "Turnkey Home — Sunset Hills",
  },
];

export default function page() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);

  const next = () => { setDirection(1); setCurrent((p) => (p + 1) % testimonials.length); };
  const prev = () => { setDirection(-1); setCurrent((p) => (p - 1 + testimonials.length) % testimonials.length); };

  const t = testimonials[current];

  const variants = {
    enter: (dir: number) => ({ x: dir > 0 ? 200 : -200, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -200 : 200, opacity: 0 }),
  };

  return (
    <section id="testimonials" className="section-padding bg-navy-gradient">
      <div className="container mx-auto max-w-3xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-accent font-semibold tracking-widest uppercase text-sm mb-2">
            Testimonials
          </p>
          <h2 className="font-heading text-3xl md:text-5xl font-bold text-primary-foreground mb-12">
            What Our Clients Say
          </h2>
        </motion.div>

        <div className="relative overflow-hidden">
          <AnimatePresence custom={direction} mode="wait">
            <motion.div
              key={current}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="bg-card rounded-xl p-8 md:p-12 shadow-2xl"
            >
              <div className="flex justify-center gap-1 mb-6">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} className="text-accent fill-accent" size={20} />
                ))}
              </div>
              <p className="text-foreground text-lg md:text-xl leading-relaxed italic mb-6">
                "{t.text}"
              </p>
              <p className="font-heading text-lg font-bold text-foreground">{t.name}</p>
              <p className="text-muted-foreground text-sm">{t.project}</p>
            </motion.div>
          </AnimatePresence>

          {/* Controls */}
          <div className="flex justify-center gap-4 mt-8">
            <button
              onClick={prev}
              className="w-12 h-12 rounded-full border-2 border-primary-foreground/30 flex items-center justify-center text-primary-foreground hover:bg-primary-foreground/10 transition"
              aria-label="Previous testimonial"
            >
              <ChevronLeft size={20} />
            </button>
            <div className="flex items-center gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => { setDirection(i > current ? 1 : -1); setCurrent(i); }}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    i === current ? "bg-accent" : "bg-primary-foreground/30"
                  }`}
                  aria-label={`Go to testimonial ${i + 1}`}
                />
              ))}
            </div>
            <button
              onClick={next}
              className="w-12 h-12 rounded-full border-2 border-primary-foreground/30 flex items-center justify-center text-primary-foreground hover:bg-primary-foreground/10 transition"
              aria-label="Next testimonial"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
