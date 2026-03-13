"use client";

import { useState, FormEvent, ChangeEvent, useEffect } from "react";
import { useSession } from "next-auth/react";
import { AlertCircle, Loader2, Send, CheckCircle, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { GoogleSignInButton } from "./google-signin-button";

interface FormErrors {
  [key: string]: string;
}

interface ReviewFormData {
  name: string;
  role: string;
  project: string;
  rating: number;
  text: string;
}

interface ReviewFormProps {
  onSuccess?: () => void;
}

const ROLES = ["Homeowner", "Developer", "Architect", "Engineer", "Designer", "Other"];

export function ReviewFormWithGoogle({ onSuccess }: ReviewFormProps) {
  const { data: session } = useSession();

  const [formData, setFormData] = useState<ReviewFormData>({
    name: session?.user?.name || "",
    role: "",
    project: "",
    rating: 0,
    text: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hover, setHover] = useState(0);

  // Update form when user signs in
  useEffect(() => {
    if (session?.user?.name && !formData.name) {
      setFormData((prev) => ({
        ...prev,
        name: session.user.name || "",
      }));
    }
  }, [session?.user?.name]);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});
    setError(null);

    // Validate
    if (!formData.name.trim()) {
      setErrors((prev) => ({ ...prev, name: "Name is required" }));
      return;
    }
    if (formData.rating === 0) {
      setErrors((prev) => ({ ...prev, rating: "Please select a rating" }));
      return;
    }
    if (!formData.text.trim()) {
      setErrors((prev) => ({ ...prev, text: "Review text is required" }));
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.validations) {
          setErrors(data.validations);
        } else {
          setError(data.message || "Failed to submit review");
        }
        return;
      }

      setSuccess(true);
      setFormData({
        name: session?.user?.name || "",
        role: "",
        project: "",
        rating: 0,
        text: "",
      });

      setTimeout(() => {
        onSuccess?.();
      }, 2000);
    } catch (err) {
      console.error("Submit error:", err);
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <motion.div
        className="text-center py-8"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <div className="w-14 h-14 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
          <CheckCircle size={28} className="text-green-400" />
        </div>
        <p className="text-white font-heading font-bold mb-1">Thank You!</p>
        <p className="text-white/60 text-sm mb-5 leading-relaxed">
          Your review is pending approval and will appear publicly once our team reviews it.
        </p>
        <button
          onClick={() => setSuccess(false)}
          className="px-5 py-2 rounded-xl bg-accent text-accent-foreground text-sm font-semibold hover:brightness-110 transition"
        >
          Submit Another
        </button>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Google Sign-In */}
      {!session?.user && (
        <div className="mb-5 pb-5 border-b border-white/20">
          <p className="text-white/60 text-xs font-semibold uppercase tracking-wide mb-3">
            Sign in to submit a review
          </p>
          <GoogleSignInButton />
        </div>
      )}

      {/* Messages */}
      <AnimatePresence>
        {error && (
          <motion.div
            className="flex items-center justify-between bg-red-500/20 border border-red-400/30 text-red-300 text-xs px-3 py-2.5 rounded-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <span>{error}</span>
            <button
              type="button"
              onClick={() => setError(null)}
              className="text-red-300 hover:text-red-200"
            >
              <X size={13} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Name Field */}
      <div>
        <label className="text-white/60 text-xs font-semibold uppercase tracking-wide mb-1 block">
          Name {session?.user && <span className="text-green-400">✓</span>}
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          placeholder="Your name"
          disabled={loading || !session?.user}
          className="w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-accent disabled:opacity-50"
        />
        {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
      </div>

      {/* Role Field */}
      <div>
        <label className="text-white/60 text-xs font-semibold uppercase tracking-wide mb-1 block">
          Your Role
        </label>
        <select
          name="role"
          value={formData.role}
          onChange={handleInputChange}
          disabled={loading}
          className="w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-accent disabled:opacity-50"
        >
          <option value="">Select a role...</option>
          {ROLES.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </div>

      {/* Project Field */}
      <div>
        <label className="text-white/60 text-xs font-semibold uppercase tracking-wide mb-1 block">
          Project Name
        </label>
        <input
          type="text"
          name="project"
          value={formData.project}
          onChange={handleInputChange}
          placeholder="e.g. Modern Villa — Palm Estate"
          disabled={loading}
          className="w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-accent disabled:opacity-50"
        />
      </div>

      {/* Rating Stars */}
      <div>
        <label className="text-white/60 text-xs font-semibold uppercase tracking-wide mb-2 block">
          Rating {errors.rating && <span className="text-red-400">- {errors.rating}</span>}
        </label>
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            {[1, 2, 3, 4, 5].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setFormData((prev) => ({ ...prev, rating: s }))}
                onMouseEnter={() => setHover(s)}
                onMouseLeave={() => setHover(0)}
                disabled={loading}
                className="transition-transform hover:scale-110 disabled:opacity-50"
              >
                <svg
                  className={`w-6 h-6 transition-colors ${
                    s <= (hover || formData.rating)
                      ? "fill-amber-400 text-amber-400"
                      : "fill-white/10 text-white/20"
                  }`}
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              </button>
            ))}
          </div>
          {formData.rating > 0 && (
            <span className="text-white/50 text-xs">
              {["", "Poor", "Fair", "Good", "Very Good", "Excellent"][formData.rating]}
            </span>
          )}
        </div>
      </div>

      {/* Review Text */}
      <div>
        <label className="text-white/60 text-xs font-semibold uppercase tracking-wide mb-1 block">
          Your Review {errors.text && <span className="text-red-400">- {errors.text}</span>}
        </label>
        <textarea
          name="text"
          value={formData.text}
          onChange={handleInputChange}
          placeholder="Share your experience with BuildCraft..."
          rows={3}
          maxLength={1000}
          disabled={loading}
          className="w-full bg-white/10 border border-white/20 rounded-xl px-3 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-accent disabled:opacity-50 resize-none"
        />
        <p className="text-white/30 text-xs text-right mt-0.5">{formData.text.length}/1000</p>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading || !session?.user}
        className="w-full py-3 rounded-xl bg-accent hover:brightness-110 disabled:opacity-60 text-accent-foreground text-sm font-semibold transition flex items-center justify-center gap-2 shadow-lg"
      >
        {loading ? (
          <>
            <Loader2 size={15} className="animate-spin" />
            Submitting...
          </>
        ) : (
          <>
            <Send size={15} />
            Submit Review
          </>
        )}
      </button>

      {!session?.user && (
        <p className="text-white/30 text-xs text-center">
          Please sign in with Google to submit a review.
        </p>
      )}

      <p className="text-white/30 text-xs text-center">
        Reviews appear publicly after approval.
      </p>
    </form>
  );
}
