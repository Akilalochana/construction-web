"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Save, CheckCircle, MessageCircle, Phone, Mail, MapPin, ExternalLink, Loader2 } from "lucide-react";

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

type Settings = {
  waNumber: string;
  waMessage: string;
  phone: string;
  email: string;
  address: string;
  businessName: string;
  tagline: string;
};

const defaults: Settings = {
  waNumber:     "94771234567",
  waMessage:    "Hi! I'm interested in your construction services. Could you please provide more information?",
  phone:        "+94 77 123 4567",
  email:        "info@example.lk",
  address:      "",
  businessName: "Construction Co.",
  tagline:      "Building Your Dreams Into Reality",
};

export default function AdminSettings() {
  const [settings, setSettings] = useState<Settings>(defaults);
  const [loading, setLoading]   = useState(true);
  const [saving, setSaving]     = useState<string | null>(null); // which section is saving
  const [saved,  setSaved]      = useState<string | null>(null);
  const [error,  setError]      = useState<string | null>(null);

  // ── Load from DB ────────────────────────────────────────────────────────────
  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then((d) => {
        if (d.data?.settings) setSettings(d.data.settings);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // ── Save section to DB ──────────────────────────────────────────────────────
  const saveSection = async (section: string) => {
    setSaving(section);
    setError(null);
    try {
      const res  = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings), // send all settings — DB upsert
      });
      const data = await res.json();
      if (!res.ok) { setError(data.message || "Save failed."); return; }
      setSaved(section);
      setTimeout(() => setSaved(null), 2400);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSaving(null);
    }
  };

  const set = (key: keyof Settings, val: string) =>
    setSettings((prev) => ({ ...prev, [key]: val }));

  const previewUrl = `https://wa.me/${settings.waNumber}?text=${encodeURIComponent(settings.waMessage)}`;

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 size={32} className="animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <h1 className="font-heading text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground text-sm mt-1">Configure contact details, WhatsApp button, and site information</p>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl border border-red-200">{error}</div>
      )}

      {/* ── WhatsApp ── */}
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
            hint="Country code + number, no spaces or + sign. e.g. 94771234567">
            <div className="flex gap-2">
              <span className="flex items-center px-3 bg-secondary border border-border rounded-xl text-sm text-muted-foreground font-mono select-none">wa.me/</span>
              <input className={`${inputCls} flex-1 font-mono`} value={settings.waNumber}
                onChange={(e) => set("waNumber", e.target.value.replace(/\D/g, ""))}
                placeholder="94771234567" />
            </div>
          </Field>
          <Field label="Pre-filled Chat Message"
            hint="This message is auto-typed when the customer opens the chat">
            <textarea className={textareaCls} rows={3} value={settings.waMessage}
              onChange={(e) => set("waMessage", e.target.value)} />
          </Field>
          <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl px-4 py-3">
            <MessageCircle size={16} className="text-[#25D366] shrink-0" />
            <p className="text-xs text-green-800 flex-1 break-all font-mono">{previewUrl}</p>
            <a href={previewUrl} target="_blank" rel="noopener noreferrer"
              className="shrink-0 text-[#25D366] hover:text-[#1da851] transition">
              <ExternalLink size={15} />
            </a>
          </div>
          <div className="flex items-center justify-between pt-1">
            {saved === "wa"
              ? <span className="flex items-center gap-1.5 text-green-600 text-sm font-medium"><CheckCircle size={15} /> Saved!</span>
              : <span />}
            <button onClick={() => saveSection("wa")} disabled={saving === "wa"}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#25D366] hover:bg-[#20BA5A] text-white rounded-xl text-sm font-semibold transition disabled:opacity-60">
              {saving === "wa" ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
              Save WhatsApp Settings
            </button>
          </div>
        </div>
      </motion.section>

      {/* ── Contact Info ── */}
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
              <input className={`${inputCls} pl-9`} value={settings.phone}
                onChange={(e) => set("phone", e.target.value)} placeholder="+94 77 123 4567" />
            </div>
          </Field>
          <Field label="Email Address">
            <div className="relative">
              <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input className={`${inputCls} pl-9`} value={settings.email}
                onChange={(e) => set("email", e.target.value)} placeholder="info@example.lk" />
            </div>
          </Field>
          <Field label="Office Address">
            <div className="relative">
              <MapPin size={15} className="absolute left-3.5 top-3.5 text-muted-foreground" />
              <textarea className={`${textareaCls} pl-9`} rows={2} value={settings.address}
                onChange={(e) => set("address", e.target.value)} />
            </div>
          </Field>
          <div className="flex items-center justify-between pt-1">
            {saved === "contact"
              ? <span className="flex items-center gap-1.5 text-green-600 text-sm font-medium"><CheckCircle size={15} /> Saved!</span>
              : <span />}
            <button onClick={() => saveSection("contact")} disabled={saving === "contact"}
              className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:bg-primary/90 transition disabled:opacity-60">
              {saving === "contact" ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
              Save Contact Info
            </button>
          </div>
        </div>
      </motion.section>

      {/* ── Business Info ── */}
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
            <input className={inputCls} value={settings.businessName}
              onChange={(e) => set("businessName", e.target.value)} placeholder="Sri Ranjana Construction" />
          </Field>
          <Field label="Tagline">
            <input className={inputCls} value={settings.tagline}
              onChange={(e) => set("tagline", e.target.value)} placeholder="Building Your Dreams Into Reality" />
          </Field>
          <div className="flex items-center justify-between pt-1">
            {saved === "biz"
              ? <span className="flex items-center gap-1.5 text-green-600 text-sm font-medium"><CheckCircle size={15} /> Saved!</span>
              : <span />}
            <button onClick={() => saveSection("biz")} disabled={saving === "biz"}
              className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:bg-primary/90 transition disabled:opacity-60">
              {saving === "biz" ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
              Save Business Info
            </button>
          </div>
        </div>
      </motion.section>
    </div>
  );
}