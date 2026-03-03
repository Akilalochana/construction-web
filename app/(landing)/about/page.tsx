import { motion } from "framer-motion";
import { Shield, Target, Users } from "lucide-react";

const team = [
  { name: "Ahmed Al-Rashid", role: "CEO & Founder", initials: "AR" },
  { name: "Sara Mahmoud", role: "Lead Architect", initials: "SM" },
  { name: "James Mitchell", role: "Project Manager", initials: "JM" },
  { name: "Fatima Hassan", role: "Structural Engineer", initials: "FH" },
];


function page() {
return (
    <section id="about" className="section-padding bg-background">
      <div className="container mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-accent font-semibold tracking-widest uppercase text-sm mb-2">
            Who We Are
          </p>
          <h2 className="font-heading text-3xl md:text-5xl font-bold text-foreground">
            About BuildCraft
          </h2>
          <div className="w-16 h-1 bg-accent mx-auto mt-4 rounded-full" />
        </motion.div>

        {/* Mission cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {[
            { icon: Target, title: "Our Mission", text: "To build structures that stand the test of time, delivering quality, safety, and innovation in every project we undertake." },
            { icon: Shield, title: "Trust & Safety", text: "Licensed, insured, and committed to the highest safety standards. Your investment is protected at every stage." },
            { icon: Users, title: "Client First", text: "We believe in transparent communication, on-time delivery, and exceeding expectations — every single time." },
          ].map((item, i) => (
            <motion.div
              key={item.title}
              className="text-center"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
            >
              <motion.div
                className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4"
                whileHover={{ scale: 1.15, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <item.icon className="text-accent" size={30} />
              </motion.div>
              <h3 className="font-heading text-xl font-semibold text-foreground mb-2">{item.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{item.text}</p>
            </motion.div>
          ))}
        </div>

        {/* CEO Feature */}
        <motion.div
          className="bg-primary rounded-xl p-8 md:p-12 flex flex-col md:flex-row items-center gap-8 mb-20"
          initial={{ opacity: 0, x: -60 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <motion.div
            className="w-32 h-32 bg-accent/20 rounded-full flex items-center justify-center shrink-0"
            whileHover={{ scale: 1.1 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <span className="font-heading text-4xl font-bold text-accent">AR</span>
          </motion.div>
          <div>
            <h3 className="font-heading text-2xl font-bold text-primary-foreground mb-1">
              Ahmed Al-Rashid
            </h3>
            <p className="text-accent font-semibold text-sm mb-4">CEO & Founder</p>
            <p className="text-primary-foreground/80 leading-relaxed">
              "With over 15 years of experience in the construction industry, my vision has always been to build not just structures, but lasting relationships with our clients. Every project we take on is a reflection of our commitment to quality and integrity. We don't just build houses — we build homes."
            </p>
          </div>
        </motion.div>

        {/* Team */}
        <motion.h3
          className="font-heading text-2xl font-bold text-foreground text-center mb-10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          Meet Our Team
        </motion.h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {team.map((member, i) => (
            <motion.div
              key={member.name}
              className="text-center group"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <motion.div
                className="w-24 h-24 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-accent/20 transition-colors"
                whileHover={{ scale: 1.12, y: -5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <span className="font-heading text-2xl font-bold text-muted-foreground group-hover:text-accent transition-colors">
                  {member.initials}
                </span>
              </motion.div>
              <h4 className="font-heading font-semibold text-foreground">{member.name}</h4>
              <p className="text-muted-foreground text-sm">{member.role}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default page