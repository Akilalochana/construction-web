"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Save, CheckCircle, RefreshCw } from "lucide-react";

const imageOptions = [
  "/assets/modern-villa.jpg",
  "/assets/apartment.jpg",
  "/assets/apartment1.jpg",
  "/assets/before.jpg",
  "/assets/hero.jpg",
];

export default function AdminBeforeAfter() {
  const [beforeImg, setBeforeImg] = useState("/assets/before.jpg");
  const [afterImg, setAfterImg] = useState("/assets/apartment.jpg");
  const [sliderPos] = useState(50);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">Before & After Images</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage the comparison slider on the Portfolio section</p>
        </div>
        <button
          onClick={handleSave}
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-primary/90 transition"
        >
          {saved ? <><CheckCircle size={15} /> Saved!</> : <><Save size={15} /> Save Changes</>}
        </button>
      </div>

      {/* Live Preview */}
      <div className="bg-white rounded-2xl border border-border p-6 shadow-sm">
        <h2 className="font-heading font-semibold text-foreground mb-4">Live Preview</h2>
        <div className="relative rounded-xl overflow-hidden aspect-[16/7] select-none border border-border">
          <img src={afterImg} alt="After" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 overflow-hidden" style={{ width: `${sliderPos}%` }}>
            <img src={beforeImg} alt="Before" className="absolute inset-0 w-full h-full object-cover"
              style={{ minWidth: "100%", width: `${100 / (sliderPos / 100)}%`, maxWidth: "none", position: "absolute", left: 0, top: 0, height: "100%" }} />
          </div>
          <div className="absolute top-0 bottom-0 w-0.5 bg-accent" style={{ left: `${sliderPos}%`, transform: "translateX(-50%)" }}>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-accent rounded-full flex items-center justify-center shadow-lg">
              <span className="text-accent-foreground text-xs font-bold">↔</span>
            </div>
          </div>
          <span className="absolute top-3 left-3 bg-black/70 text-white text-xs font-bold px-2.5 py-1 rounded">BEFORE</span>
          <span className="absolute top-3 right-3 bg-accent text-accent-foreground text-xs font-bold px-2.5 py-1 rounded">AFTER</span>
        </div>
        <p className="text-muted-foreground text-xs mt-3 text-center">Preview shown at 50/50 split. Visitors can drag to compare.</p>
      </div>

      {/* Image Pickers */}
      <div className="grid md:grid-cols-2 gap-5">
        {/* BEFORE */}
        <div className="bg-white rounded-2xl border border-border p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-7 h-7 bg-slate-100 rounded-lg flex items-center justify-center">
              <span className="text-slate-600 text-xs font-bold">B</span>
            </div>
            <h3 className="font-semibold text-foreground">Before Image</h3>
          </div>
          <div className="relative h-40 rounded-xl overflow-hidden mb-4 border border-border">
            <img src={beforeImg} alt="Before" className="w-full h-full object-cover" />
            <span className="absolute top-2 left-2 bg-black/70 text-white text-xs font-bold px-2 py-0.5 rounded">BEFORE</span>
          </div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Choose photo:</p>
          <div className="grid grid-cols-5 gap-2">
            {imageOptions.map((img) => (
              <button key={img} onClick={() => setBeforeImg(img)}
                className={`relative h-12 rounded-lg overflow-hidden border-2 transition-all ${beforeImg === img ? "border-primary scale-95" : "border-transparent hover:border-border"}`}>
                <img src={img} alt="" className="w-full h-full object-cover" />
                {beforeImg === img && <div className="absolute inset-0 bg-primary/30 flex items-center justify-center"><CheckCircle size={12} className="text-white" /></div>}
              </button>
            ))}
          </div>
        </div>

        {/* AFTER */}
        <div className="bg-white rounded-2xl border border-border p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-7 h-7 bg-accent/20 rounded-lg flex items-center justify-center">
              <span className="text-accent text-xs font-bold">A</span>
            </div>
            <h3 className="font-semibold text-foreground">After Image</h3>
          </div>
          <div className="relative h-40 rounded-xl overflow-hidden mb-4 border border-border">
            <img src={afterImg} alt="After" className="w-full h-full object-cover" />
            <span className="absolute top-2 right-2 bg-accent text-accent-foreground text-xs font-bold px-2 py-0.5 rounded">AFTER</span>
          </div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Choose photo:</p>
          <div className="grid grid-cols-5 gap-2">
            {imageOptions.map((img) => (
              <button key={img} onClick={() => setAfterImg(img)}
                className={`relative h-12 rounded-lg overflow-hidden border-2 transition-all ${afterImg === img ? "border-accent scale-95" : "border-transparent hover:border-border"}`}>
                <img src={img} alt="" className="w-full h-full object-cover" />
                {afterImg === img && <div className="absolute inset-0 bg-accent/30 flex items-center justify-center"><CheckCircle size={12} className="text-white" /></div>}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Hint card */}
      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex items-start gap-3">
        <RefreshCw size={18} className="text-blue-500 mt-0.5 shrink-0" />
        <div>
          <p className="text-blue-800 text-sm font-semibold">How it works</p>
          <p className="text-blue-600 text-xs mt-0.5 leading-relaxed">
            Select a "Before" photo and an "After" photo. These will appear as a draggable comparison slider on the Portfolio section of your website. Click "Save Changes" to apply.
          </p>
        </div>
      </div>
    </div>
  );
}
