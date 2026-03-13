"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

export default function WhatsAppButton() {
  const [waNumber,  setWaNumber]  = useState("94771234567");
  const [waMessage, setWaMessage] = useState("Hi! I'm interested in your construction services. Could you please provide more information?");
  const [showTooltip, setShowTooltip] = useState(false);
  const [dismissed,   setDismissed]   = useState(false);

  // ── Fetch settings from public API ─────────────────────────────────────────
  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((d) => {
        if (d.data?.settings?.waNumber)  setWaNumber(d.data.settings.waNumber);
        if (d.data?.settings?.waMessage) setWaMessage(d.data.settings.waMessage);
      })
      .catch(() => {}); // silent — fallback defaults
  }, []);

  const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(waMessage)}`;

  return (
    <div className="fixed bottom-6 right-8 sm:right-10 md:right-14 z-50 flex flex-col items-end gap-3">

      {/* Chat bubble tooltip */}
      <AnimatePresence>
        {!dismissed && (
          <motion.div
            className="relative bg-white rounded-2xl shadow-xl border border-gray-100 px-4 py-3 max-w-[220px]"
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            transition={{ delay: 1.5, duration: 0.35 }}>
            <button onClick={() => setDismissed(true)}
              className="absolute -top-2 -right-2 w-5 h-5 bg-gray-400 hover:bg-gray-500 rounded-full flex items-center justify-center transition">
              <X size={10} className="text-white" />
            </button>
            <div className="absolute -bottom-2 right-7 w-4 h-4 bg-white border-r border-b border-gray-100 rotate-45" />
            <p className="text-xs font-semibold text-gray-800 leading-snug">💬 Chat with us on WhatsApp!</p>
            <p className="text-xs text-gray-500 mt-0.5">We typically reply within minutes.</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FAB */}
      <motion.a href={waUrl} target="_blank" rel="noopener noreferrer"
        onHoverStart={() => setShowTooltip(true)} onHoverEnd={() => setShowTooltip(false)}
        onClick={() => setDismissed(true)}
        className="relative flex items-center justify-center w-14 h-14 rounded-full shadow-lg shadow-green-500/30 bg-[#25D366] hover:bg-[#20BA5A] transition-colors"
        initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1, type: "spring", stiffness: 260, damping: 20 }}
        whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}
        aria-label="Chat with us on WhatsApp">
        <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-30" />
        <svg viewBox="0 0 32 32" className="w-7 h-7 fill-white relative z-10" xmlns="http://www.w3.org/2000/svg">
          <path d="M16.003 2.667C8.638 2.667 2.667 8.638 2.667 16c0 2.364.636 4.681 1.845 6.715L2.667 29.333l6.8-1.784A13.29 13.29 0 0 0 16.003 29.333C23.365 29.333 29.333 23.362 29.333 16c0-7.362-5.968-13.333-13.33-13.333zm0 24.267a11 11 0 0 1-5.618-1.54l-.403-.24-4.034 1.058 1.077-3.934-.265-.41A10.96 10.96 0 0 1 5.067 16c0-6.03 4.906-10.933 10.936-10.933S26.933 9.97 26.933 16c0 6.03-4.897 10.934-10.93 10.934zm5.997-8.186c-.327-.165-1.937-.956-2.237-1.065-.298-.11-.515-.165-.733.164-.217.33-.842 1.065-1.032 1.283-.19.22-.38.247-.707.082-.328-.165-1.383-.51-2.635-1.626-.974-.869-1.63-1.942-1.82-2.27-.19-.328-.02-.505.143-.668.147-.147.328-.382.491-.573.164-.19.218-.328.328-.546.109-.218.055-.41-.027-.573-.082-.165-.733-1.77-.1-2.428-.268-.615-.552-.614-.807-.625l-.688-.012c-.218 0-.572.082-.872.41-.3.327-1.143 1.115-1.143 2.72 0 1.604 1.17 3.154 1.333 3.373.164.218 2.303 3.513 5.58 4.928.78.336 1.388.537 1.862.688.782.249 1.494.214 2.058.13.628-.094 1.937-.792 2.209-1.557.273-.764.273-1.42.19-1.557-.08-.137-.297-.22-.624-.384z"/>
        </svg>
      </motion.a>

      {/* Hover label */}
      <AnimatePresence>
        {showTooltip && (
          <motion.span
            className="absolute right-16 bottom-3 bg-gray-900 text-white text-xs font-semibold px-3 py-1.5 rounded-xl whitespace-nowrap shadow-lg pointer-events-none"
            initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 8 }} transition={{ duration: 0.18 }}>
            Chat on WhatsApp
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
}