import { motion } from 'framer-motion'

function page() {
  return (
     <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0">
        <motion.img
          src="/assets/hero.jpg"
          alt="Modern house under construction at golden hour"
          className="w-full h-full object-cover"
          loading="eager"
          initial={{ scale: 1.15 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.8, ease: "easeOut" }}
        />
        <div className="absolute inset-0 bg-primary/70" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto text-center px-4">
        <motion.p
          className="text-accent font-semibold tracking-widest uppercase text-sm mb-4 bg-amber-500"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          Excellence in Every Brick
        </motion.p>
        <motion.h1
          className="font-heading text-4xl sm:text-5xl md:text-7xl font-bold text-primary-foreground leading-tight mb-6"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          Building Your Dreams
          <br />
          <span className="text-gradient-gold">Into Reality</span>
        </motion.h1>
        <motion.p
          className="text-primary-foreground/80 text-lg md:text-xl max-w-2xl mx-auto mb-10"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.7 }}
        >
          From architectural planning to final handover — we deliver turnkey
          construction with uncompromising quality and craftsmanship.
        </motion.p>
        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.9 }}
        >
          <a
            href="#contact"
            className="bg-accent text-accent-foreground px-8 py-4 rounded-md text-lg font-semibold hover:brightness-110 transition shadow-lg"
          >
            Get a Free Quote
          </a>
          <a
            href="#portfolio"
            className="border-2 border-primary-foreground/30 text-primary-foreground px-8 py-4 rounded-md text-lg font-semibold hover:bg-primary-foreground/10 transition"
          >
            View Our Work
          </a>
        </motion.div>

        {/* Stats */}
        <motion.div
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.1 }}
        >
          {[
            { num: "250+", label: "Projects Completed" },
            { num: "15+", label: "Years Experience" },
            { num: "50+", label: "Expert Engineers" },
            { num: "98%", label: "Client Satisfaction" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              className="text-center"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 1.3 + i * 0.1 }}
            >
              <p className="text-3xl md:text-4xl font-heading font-bold text-accent">{stat.num}</p>
              <p className="text-primary-foreground/60 text-sm mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

export default page