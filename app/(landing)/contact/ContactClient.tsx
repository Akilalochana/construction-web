"use client";
import { useState, useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Phone, Mail, MapPin, Send } from "lucide-react";

type Settings = {
  phone: string;
  email: string;
  address: string;
};

function Page() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [settings, setSettings] = useState<Settings>({
    phone: "+94 77 123 4567",
    email: "info@example.lk",
    address: "No. 42, Main Street, Colombo 05, Sri Lanka",
  });

  const prefersReduced = useReducedMotion();
  const shouldAnimate = !prefersReduced;

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((d) => {
        if (d.data?.settings) {
          const s = d.data.settings;
          setSettings({
            phone: s.phone || settings.phone,
            email: s.email || settings.email,
            address: s.address || settings.address,
          });
        }
      })
      .catch(() => {});
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Thank you! We'll get back to you shortly.");
    setForm({ name: "", email: "", phone: "", message: "" });
  };

  const contactItems = [
    { icon: Phone, label: settings.phone, href: `tel:${settings.phone.replace(/\s/g, "")}` },
    { icon: Mail, label: settings.email, href: `mailto:${settings.email}` },
    { icon: MapPin, label: settings.address, href: "#" },
  ];

  // Animation Variants 
  const fadeInUp = {
    initial: { opacity: shouldAnimate ? 0 : 1, y: shouldAnimate ? 30 : 0 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.1 },
    transition: { duration: 0.6 }
  };

  return (
    <section id="contact" className="py-16 md:py-24 bg-background overflow-x-hidden">
      <div className="container mx-auto px-4 md:px-6">

        {/* ── Heading ── */}
        <motion.div
          className="text-center mb-16"
          {...fadeInUp}
        >
          <p className="text-accent font-semibold tracking-widest uppercase text-sm mb-2">Get In Touch</p>
          <h2 className="font-heading text-3xl md:text-5xl font-bold text-foreground">Contact Us</h2>
          <div className="w-16 h-1 bg-accent mx-auto mt-4 rounded-full" />
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">

          {/* ── Contact Form ── */}
          <motion.form 
            onSubmit={handleSubmit} 
            className="space-y-6"
            {...fadeInUp}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="grid sm:grid-cols-2 gap-4">
              <input 
                type="text" 
                placeholder="Your Name" 
                required 
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-4 py-3 rounded-md border border-input bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent transition-all" 
              />
              <input 
                type="email" 
                placeholder="Email Address" 
                required 
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-4 py-3 rounded-md border border-input bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent transition-all" 
              />
            </div>
            <input 
              type="tel" 
              placeholder="Phone Number" 
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full px-4 py-3 rounded-md border border-input bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent transition-all" 
            />
            <textarea 
              placeholder="Tell us about your project..." 
              required 
              rows={5} 
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              className="w-full px-4 py-3 rounded-md border border-input bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent resize-none transition-all" 
            />
            <motion.button 
              type="submit"
              className="w-full sm:w-auto bg-accent text-accent-foreground px-8 py-3 rounded-md font-semibold hover:brightness-110 transition flex items-center justify-center gap-2"
              whileHover={shouldAnimate ? { scale: 1.02 } : {}}
              whileTap={shouldAnimate ? { scale: 0.98 } : {}}
            >
              <Send size={18} /> Send Message
            </motion.button>
          </motion.form>

          {/* ── Info + Map ── */}
          <motion.div 
            className="space-y-8"
            {...fadeInUp}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="space-y-6">
              {contactItems.map((item, i) => (
                <motion.a 
                  key={i} 
                  href={item.href}
                  className="flex items-start gap-4 text-foreground hover:text-accent transition-colors group"
                  whileHover={shouldAnimate ? { x: 5 } : {}}
                >
                  <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center shrink-0 group-hover:bg-accent/20 transition-colors">
                    <item.icon className="text-accent" size={22} />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-medium leading-relaxed">{item.label}</span>
                  </div>
                </motion.a>
              ))}
            </div>

            <div className="rounded-xl overflow-hidden shadow-lg border border-border h-[300px] w-full">
              <iframe 
                title="Office Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126743.5829045838!2d79.8083196886364!3d6.921837363437505!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae253d10f7a7003%3A0x320b2e4d32d3838d!2sColombo!5e0!3m2!1sen!2slk!4v1700000000000!5m2!1sen!2slk" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen 
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade" 
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default Page;