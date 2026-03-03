"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Save, CheckCircle, Pencil, Eye, RefreshCw } from "lucide-react";

const imageOptions = [
  "/assets/modern-villa.jpg",
  "/assets/apartment.jpg",
  "/assets/apartment1.jpg",
  "/assets/before.jpg",
  "/assets/hero.jpg",
];

const initialRooms = [
  { id: "living", name: "Living Room", description: "Spacious open-plan living area with hardwood floors and panoramic views.", image: "/assets/modern-villa.jpg" },
  { id: "kitchen", name: "Kitchen", description: "Gourmet kitchen with marble countertops and premium appliances.", image: "/assets/modern-villa.jpg" },
  { id: "bedroom", name: "Master Bedroom", description: "Luxurious master suite with elegant finishes and natural lighting.", image: "/assets/modern-villa.jpg" },
  { id: "bathroom", name: "Bathroom", description: "Spa-inspired bathroom with freestanding tub and marble surfaces.", image: "/assets/modern-villa.jpg" },
];

export default function AdminWalkthrough() {
  const [rooms, setRooms] = useState(initialRooms);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const update = (id: string, field: string, value: string) => {
    setRooms((prev) => prev.map((r) => r.id === id ? { ...r, [field]: value } : r));
  };

  const handleSave = () => {
    setSaved(true);
    setEditingId(null);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">360° Walkthrough Rooms</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage the virtual tour rooms and their preview images</p>
        </div>
        <button onClick={handleSave} className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-primary/90 transition">
          {saved ? <><CheckCircle size={15} /> Saved!</> : <><Save size={15} /> Save Changes</>}
        </button>
      </div>

      {/* Rooms */}
      <div className="space-y-4">
        {rooms.map((room, i) => (
          <motion.div key={room.id} className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden"
            initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
            <div className="flex items-start gap-0">
              {/* Image preview */}
              <div className="relative w-48 h-36 shrink-0">
                <img src={room.image} alt={room.name} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/20" />
                <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm text-white text-xs font-bold px-2 py-1 rounded-lg flex items-center gap-1">
                  <Eye size={10} /> 360°
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 p-5">
                {editingId === room.id ? (
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1 block">Room Name</label>
                      <input value={room.name} onChange={(e) => update(room.id, "name", e.target.value)}
                        className="w-full border border-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1 block">Description</label>
                      <textarea value={room.description} onChange={(e) => update(room.id, "description", e.target.value)}
                        rows={2} className="w-full border border-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none" />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2 block">Background / 360° Image</label>
                      <div className="flex gap-2">
                        {imageOptions.map((img) => (
                          <button key={img} onClick={() => update(room.id, "image", img)}
                            className={`relative w-14 h-10 rounded-lg overflow-hidden border-2 transition-all ${room.image === img ? "border-accent scale-90" : "border-transparent hover:border-border"}`}>
                            <img src={img} alt="" className="w-full h-full object-cover" />
                            {room.image === img && <div className="absolute inset-0 bg-accent/30 flex items-center justify-center"><CheckCircle size={10} className="text-white" /></div>}
                          </button>
                        ))}
                      </div>
                    </div>
                    <button onClick={() => setEditingId(null)} className="text-xs font-semibold text-primary hover:underline">Done editing</button>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-heading font-bold text-foreground">{room.name}</h3>
                        <p className="text-muted-foreground text-sm mt-1 leading-relaxed">{room.description}</p>
                        <div className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
                          <span className="w-3 h-3 rounded-full bg-green-400" />
                          Active in virtual tour
                        </div>
                      </div>
                      <button onClick={() => setEditingId(room.id)}
                        className="w-9 h-9 rounded-xl border border-border flex items-center justify-center hover:bg-blue-50 hover:border-blue-200 transition shrink-0">
                        <Pencil size={15} className="text-blue-600" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Info */}
      <div className="bg-purple-50 border border-purple-100 rounded-2xl p-4 flex items-start gap-3">
        <RefreshCw size={18} className="text-purple-500 mt-0.5 shrink-0" />
        <div>
          <p className="text-purple-800 text-sm font-semibold">About 360° Images</p>
          <p className="text-purple-600 text-xs mt-0.5 leading-relaxed">
            For best results, use equirectangular panoramic photos. Regular photos will still work and display in the 360° sphere viewer. Click the pencil icon to edit a room, then Save Changes to apply.
          </p>
        </div>
      </div>
    </div>
  );
}
