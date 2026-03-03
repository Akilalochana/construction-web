"use client";
import { motion } from "framer-motion";

function footer() {
 return (
    <footer className="bg-primary py-12 px-4">
      <div className="container mx-auto">
        <motion.div
          className="grid md:grid-cols-3 gap-8 mb-8"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div>
            <h3 className="font-heading text-2xl font-bold text-primary-foreground mb-4">
              BUILD<span className="text-accent">CRAFT</span>
            </h3>
            <p className="text-primary-foreground/60 leading-relaxed">
              Building dreams into reality since 2009. Licensed, insured, and committed to excellence in every project.
            </p>
          </div>
          <div>
            <h4 className="font-heading text-lg font-semibold text-primary-foreground mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {["Services", "Portfolio", "About", "Contact"].map((link) => (
                <li key={link}>
                  <a href={`#${link.toLowerCase()}`} className="text-primary-foreground/60 hover:text-accent transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-heading text-lg font-semibold text-primary-foreground mb-4">Working Hours</h4>
            <ul className="space-y-2 text-primary-foreground/60">
              <li>Mon - Fri: 8:00 AM - 6:00 PM</li>
              <li>Saturday: 9:00 AM - 2:00 PM</li>
              <li>Sunday: Closed</li>
            </ul>
          </div>
        </motion.div>
        <div className="border-t border-primary-foreground/10 pt-8 text-center">
          <p className="text-primary-foreground/40 text-sm">
            © {new Date().getFullYear()} BuildCraft Construction. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default footer