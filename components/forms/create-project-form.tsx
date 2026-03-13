"use client";

import { useState, FormEvent, ChangeEvent, useRef } from "react";
import imageCompression from "browser-image-compression";
import { AlertCircle, Loader2, Upload } from "lucide-react";

interface FormErrors {
  [key: string]: string;
}

interface ProjectFormData {
  title: string;
  category: string;
  location: string;
  year: string;
  description: string;
  featured: boolean;
  imageFile?: File;
  imagePreview?: string;
}

const CATEGORIES = ["Residential", "Commercial", "Interior", "Renovation"];

interface CreateProjectFormProps {
  onSuccess?: () => void;
}

export default function CreateProjectForm({ onSuccess }: CreateProjectFormProps) {
  const [formData, setFormData] = useState<ProjectFormData>({
    title: "",
    category: "Residential",
    location: "",
    year: new Date().getFullYear().toString(),
    description: "",
    featured: false,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [compressing, setCompressing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrors((prev) => {
      const next = { ...prev };
      delete next.image;
      return next;
    });

    try {
      setCompressing(true);

      // Check file type
      if (!["image/jpeg", "image/png", "image/webp", "image/gif"].includes(file.type)) {
        throw new Error("Only JPEG, PNG, WebP, and GIF images are allowed");
      }

      // Compress image
      const options = {
        maxSizeMB: 2, // Max 2MB after compression
        maxWidthOrHeight: 1920, // Max dimensions
        useWebWorker: true, // Use web worker for better performance
      };

      const compressedFile = await imageCompression(file, options);

      // Create preview
      const preview = URL.createObjectURL(compressedFile);

      setFormData((prev) => ({
        ...prev,
        imageFile: compressedFile,
        imagePreview: preview,
      }));

      console.log(
        `Image compressed: ${(file.size / 1024 / 1024).toFixed(2)}MB → ${(compressedFile.size / 1024 / 1024).toFixed(2)}MB`
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to process image";
      setErrors((prev) => ({
        ...prev,
        image: message,
      }));
    } finally {
      setCompressing(false);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});
    setSuccessMessage("");

    // Validate required fields
    if (!formData.imageFile) {
      setErrors((prev) => ({
        ...prev,
        image: "Please select and compress an image",
      }));
      return;
    }

    setLoading(true);

    try {
      // Create FormData for multipart/form-data
      const submitData = new FormData();
      submitData.append("title", formData.title);
      submitData.append("category", formData.category);
      submitData.append("location", formData.location);
      submitData.append("year", formData.year);
      submitData.append("description", formData.description);
      submitData.append("featured", String(formData.featured));
      submitData.append("image", formData.imageFile);

      const response = await fetch("/api/admin/projects", {
        method: "POST",
        credentials: "include",
        body: submitData,
      });

      const result = await response.json();

      if (!response.ok) {
        if (result.validations) {
          setErrors(result.validations);
        } else {
          setErrors({ submit: result.message || "Failed to create project" });
        }
        return;
      }

      setSuccessMessage("Project created successfully!");

      // Reset form
      setFormData({
        title: "",
        category: "Residential",
        location: "",
        year: new Date().getFullYear().toString(),
        description: "",
        featured: false,
      });

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      // Clear preview
      if (formData.imagePreview) {
        URL.revokeObjectURL(formData.imagePreview);
      }

      setTimeout(() => {
        onSuccess?.();
      }, 1500);
    } catch (error) {
      console.error("Submit error:", error);
      setErrors({
        submit: "Network error occurred. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      {/* Messages */}
      {successMessage && (
        <div className="rounded-lg bg-green-50 border border-green-200 p-4 text-green-800">
          {successMessage}
        </div>
      )}

      {errors.submit && (
        <div className="rounded-lg bg-red-50 border border-red-200 p-4 text-red-800 flex gap-2">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          {errors.submit}
        </div>
      )}

      {/* Title */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium mb-2">
          Project Title
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          placeholder="Modern Residential Complex"
          disabled={loading}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
        />
        {errors.title && <p className="text-red-600 text-sm mt-1">{errors.title}</p>}
      </div>

      {/* Category */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="category" className="block text-sm font-medium mb-2">
            Category
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            disabled={loading}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          {errors.category && <p className="text-red-600 text-sm mt-1">{errors.category}</p>}
        </div>

        <div>
          <label htmlFor="year" className="block text-sm font-medium mb-2">
            Year
          </label>
          <input
            type="text"
            id="year"
            name="year"
            value={formData.year}
            onChange={handleInputChange}
            placeholder="2026"
            disabled={loading}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
          />
          {errors.year && <p className="text-red-600 text-sm mt-1">{errors.year}</p>}
        </div>
      </div>

      {/* Location */}
      <div>
        <label htmlFor="location" className="block text-sm font-medium mb-2">
          Location
        </label>
        <input
          type="text"
          id="location"
          name="location"
          value={formData.location}
          onChange={handleInputChange}
          placeholder="Colombo, Sri Lanka"
          disabled={loading}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
        />
        {errors.location && <p className="text-red-600 text-sm mt-1">{errors.location}</p>}
      </div>

      {/* Image Upload with Compression */}
      <div>
        <label className="block text-sm font-medium mb-2">Project Image</label>
        <div className="space-y-3">
          <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              disabled={loading || compressing}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
            <div className="space-y-2">
              {compressing ? (
                <>
                  <Loader2 className="w-8 h-8 mx-auto text-blue-500 animate-spin" />
                  <p className="text-sm text-gray-600">Compressing image...</p>
                </>
              ) : (
                <>
                  <Upload className="w-8 h-8 mx-auto text-gray-400" />
                  <p className="text-sm text-gray-600">
                    Click to select or drag and drop
                  </p>
                  <p className="text-xs text-gray-500">PNG, JPG, GIF, WebP up to 10MB</p>
                </>
              )}
            </div>
          </div>

          {/* Image Preview */}
          {formData.imagePreview && (
            <div className="space-y-2">
              <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={formData.imagePreview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-xs text-gray-600">
                File size: {(formData.imageFile?.size ?? 0 / 1024).toFixed(1)} KB
              </p>
            </div>
          )}

          {errors.image && <p className="text-red-600 text-sm">{errors.image}</p>}
        </div>
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium mb-2">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          placeholder="Project details..."
          rows={4}
          disabled={loading}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
        />
        {errors.description && (
          <p className="text-red-600 text-sm mt-1">{errors.description}</p>
        )}
      </div>

      {/* Featured Checkbox */}
      <div className="flex items-center">
        <input
          type="checkbox"
          id="featured"
          name="featured"
          checked={formData.featured}
          onChange={handleInputChange}
          disabled={loading}
          className="rounded border-gray-300"
        />
        <label htmlFor="featured" className="ml-2 text-sm font-medium cursor-pointer">
          Mark as featured project
        </label>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading || compressing}
        className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium rounded-lg transition flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Creating project...
          </>
        ) : (
          "Create Project"
        )}
      </button>
    </form>
  );
}
