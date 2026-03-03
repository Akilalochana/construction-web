"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Save, CheckCircle, MessageCircle, Phone, Mail, MapPin, ExternalLink } from "lucide-react";

const inputCls = "w-full border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/25 bg-white";
const textareaCls = `${inputCls} resize-none`;

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wide">{label}</label>
      {children}
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

export default function AdminSettings() {
  /* WhatsApp */
  const [waNumber,  setWaNumber]  = useState("94771234567");
  const [waMessage, setWaMessage] = useState("Hi! I'm interested in your construction services. Could you please provide more information?");
  const [waSaved,   setWaSaved]   = useState(false);

  /* Contact info */
  const [phone,   setPhone]   = useState("+94 77 123 4567");
  const [email,   setEmail]   = useState("info@sriranjanaconstruction.lk");
  const [address, setAddress] = useState("No. 42, Main Street, Colombo 05, Sri Lanka");
  const [contactSaved, setContactSaved] = useState(false);

  /* Business */
  const [bizName,   setBizName]   = useState("Sri Ranjana Construction");
  const [tagline,   setTagline]   = useState("Building Your Dreams Into Reality");
  const [bizSaved,  setBizSaved]  = useState(false);

  const saveSec = (setter: (v: boolean) => void) => { setter(true); setTimeout(() => setter(false), 2400); };

  const previewUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(waMessage)}`;

  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <h1 className="font-heading text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground text-sm mt-1">Configure contact details, WhatsApp button, and site information</p>
      </div>

      {/* ── WhatsApp Button ─────────────────────────────────── */}
      <motion.section className="bg-white border border-border rounded-2xl overflow-hidden shadow-sm"
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
        <div className="flex items-center gap-3 px-6 py-4 border-b border-border bg-[#25D366]/8">
          <div className="w-9 h-9 bg-[#25D366] rounded-xl flex items-center justify-center">
            <svg viewBox="0 0 32 32" className="w-5 h-5 fill-white" xmlns="http://www.w3.org/2000/svg">
              <path d="M16.003 2.667C8.638 2.667 2.667 8.638 2.667 16c0 2.364.636 4.681 1.845 6.715L2.667 29.333l6.8-1.784A13.29 13.29 0 0 0 16.003 29.333C23.365 29.333 29.333 23.362 29.333 16c0-7.362-5.968-13.333-13.33-13.333zm0 24.267a11 11 0 0 1-5.618-1.54l-.403-.24-4.034 1.058 1.077-3.934-.265-.41A10.96 10.96 0 0 1 5.067 16c0-6.03 4.906-10.933 10.936-10.933S26.933 9.97 26.933 16c0 6.03-4.897 10.934-10.93 10.934zm5.997-8.186c-.327-.165-1.937-.956-2.237-1.065-.298-.11-.515-.165-.733.164-.217.33-.842 1.065-1.032 1.283-.19.22-.38.247-.707.082-.328-.165-1.383-.51-2.635-1.626-.974-.869-1.63-1.942-1.82-2.27-.19-.328-.02-.505.143-.668.147-.147.328-.382.491-.573.164-.19.218-.328.328-.546.109-.218.055-.41-.027-.573-.082-.165-.733-1.77-.1-2.428-.268-.615-.552-.614-.807-.625l-.688-.012c-.218 0-.572.082-.872.41-.3.327-1.143 1.115-1.143 2.72 0 1.604 1.17 3.154 1.333 3.373.164.218 2.303 3.513 5.58 4.928.78.336 1.388.537 1.862.688.782.249 1.494.214 2.058.13.628-.094 1.937-.792 2.209-1.557.273-.764.273-1.42.19-1.557-.08-.137-.297-.22-.624-.384z"/>
            </svg>
          </div>
          <div>
            <p className="font-semibold text-foreground text-sm">WhatsApp Button</p>
            <p className="text-xs text-muted-foreground">Floating chat button shown on all public pages</p>
          </div>
        </div>

        <div className="px-6 py-5 space-y-5">
          <Field label="WhatsApp Business Number"
            hint="Country code + number, no spaces or + sign. e.g. Sri Lanka 077 123 4567 → 94771234567">
            <div className="flex gap-2">
              <span className="flex items-center px-3 bg-secondary border border-border rounded-xl text-sm text-muted-foreground font-mono select-none">wa.me/</span>
              <input className={`${inputCls} flex-1 font-mono`} value={waNumber}
                onChange={(e) => setWaNumber(e.target.value.replace(/\D/g, ""))}
                placeholder="94771234567" />
            </div>
          </Field>

          <Field label="Pre-filled Chat Message"
            hint="This message is auto-typed when the customer opens the chat">
            <textarea className={textareaCls} rows={3} value={waMessage} onChange={(e) => setWaMessage(e.target.value)} />
          </Field>

          {/* Preview link */}
          <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl px-4 py-3">
            <MessageCircle size={16} className="text-[#25D366] shrink-0" />
            <p className="text-xs text-green-800 flex-1 break-all font-mono">{previewUrl}</p>
            <a href={previewUrl} target="_blank" rel="noopener noreferrer"
              className="shrink-0 text-[#25D366] hover:text-[#1da851] transition">
              <ExternalLink size={15} />
            </a>
          </div>

          <div className="flex items-center justify-between pt-1">
            {waSaved
              ? <span className="flex items-center gap-1.5 text-green-600 text-sm font-medium"><CheckCircle size={15} /> Saved!</span>
              : <span />}
            <button onClick={() => saveSec(setWaSaved)}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#25D366] hover:bg-[#20BA5A] text-white rounded-xl text-sm font-semibold transition">
              <Save size={14} /> Save WhatsApp Settings
            </button>
          </div>
        </div>
      </motion.section>

      {/* ── Contact Info ────────────────────────────────────── */}
      <motion.section className="bg-white border border-border rounded-2xl overflow-hidden shadow-sm"
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <div className="flex items-center gap-3 px-6 py-4 border-b border-border bg-secondary/30">
          <Phone size={18} className="text-primary" />
          <div>
            <p className="font-semibold text-foreground text-sm">Contact Information</p>
            <p className="text-xs text-muted-foreground">Shown in the footer and contact section</p>
          </div>
        </div>
        <div className="px-6 py-5 space-y-4">
          <Field label="Phone Number">
            <div className="relative">
              <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input className={`${inputCls} pl-9`} value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+94 77 123 4567" />
            </div>
          </Field>
          <Field label="Email Address">
            <div className="relative">
              <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input className={`${inputCls} pl-9`} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="info@example.lk" />
            </div>
          </Field>
          <Field label="Office Address">
            <div className="relative">
              <MapPin size={15} className="absolute left-3.5 top-3.5 text-muted-foreground" />
              <textarea className={`${textareaCls} pl-9`} rows={2} value={address} onChange={(e) => setAddress(e.target.value)} />
            </div>
          </Field>
          <div className="flex items-center justify-between pt-1">
            {contactSaved
              ? <span className="flex items-center gap-1.5 text-green-600 text-sm font-medium"><CheckCircle size={15} /> Saved!</span>
              : <span />}
            <button onClick={() => saveSec(setContactSaved)}
              className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:bg-primary/90 transition">
              <Save size={14} /> Save Contact Info
            </button>
          </div>
        </div>
      </motion.section>

      {/* ── Business Info ───────────────────────────────────── */}
      <motion.section className="bg-white border border-border rounded-2xl overflow-hidden shadow-sm"
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
        <div className="flex items-center gap-3 px-6 py-4 border-b border-border bg-secondary/30">
          <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center">
            <span className="font-heading font-bold text-primary-foreground text-xs">BC</span>
          </div>
          <div>
            <p className="font-semibold text-foreground text-sm">Business Identity</p>
            <p className="text-xs text-muted-foreground">Site title, logo text, and tagline</p>
          </div>
        </div>
        <div className="px-6 py-5 space-y-4">
          <Field label="Business Name">
            <input className={inputCls} value={bizName} onChange={(e) => setBizName(e.target.value)} placeholder="Sri Ranjana Construction" />
          </Field>
          <Field label="Tagline">
            <input className={inputCls} value={tagline} onChange={(e) => setTagline(e.target.value)} placeholder="Building Your Dreams Into Reality" />
          </Field>
          <div className="flex items-center justify-between pt-1">
            {bizSaved
              ? <span className="flex items-center gap-1.5 text-green-600 text-sm font-medium"><CheckCircle size={15} /> Saved!</span>
              : <span />}
            <button onClick={() => saveSec(setBizSaved)}
              className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:bg-primary/90 transition">
              <Save size={14} /> Save Business Info
            </button>
          </div>
        </div>
      </motion.section>
    </div>
  );
}
