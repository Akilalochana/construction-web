import { motion } from "framer-motion";
import { Home, Wrench, ClipboardCheck, Ruler, HardHat, Paintbrush } from "lucide-react";

const services = [
  {
    icon: Home,
    title: "Turnkey Construction",
    description:
      "We handle everything from A to Z — architectural planning, government approvals, structural work, and final finishing. Just hand us the land.",
  },
  {
    icon: Wrench,
    title: "Project Completion",
    description:
      "Have an incomplete or partially built house? We take over and finish it to perfection with our expert team.",
  },
  {
    icon: Paintbrush,
    title: "Interior Finishing",
    description:
      "Premium interior finishing including flooring, painting, kitchen fitting, bathroom tiling, and electrical work.",
  },
  {
    icon: Ruler,
    title: "Architectural Design",
    description:
      "Modern architectural plans tailored to your needs, optimizing space, light, and functionality.",
  },
  {
    icon: ClipboardCheck,
    title: "Project Management",
    description:
      "Dedicated project managers ensuring timelines, budgets, and quality standards are met at every stage.",
  },
  {
    icon: HardHat,
    title: "Renovations",
    description:
      "Complete home renovations that transform aging properties into modern, energy-efficient living spaces.",
  },
];

function page() {
  return (
    
    <section id="services" className="section-padding bg-background">
      <div className="container mx-auto">
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

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, i) => (
            <motion.div
              key={service.title}
              className="group bg-card border border-border rounded-lg p-8 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ scale: 1.03 }}
            >
              <motion.div
                className="w-14 h-14 bg-accent/10 rounded-lg flex items-center justify-center mb-6 group-hover:bg-accent/20 transition-colors"
                whileHover={{ rotate: 10 }}
              >
                <service.icon className="text-accent" size={28} />
              </motion.div>
              <h3 className="font-heading text-xl font-semibold text-foreground mb-3">
                {service.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {service.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
  
}

export default page