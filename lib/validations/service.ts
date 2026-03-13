import * as yup from "yup";

// ── Sub-schemas ───────────────────────────────────────────────────────────────

const processStepSchema = yup.object({
  step: yup.string().required("Step is required").max(10),
  // "01", "02" etc — frontend-ඒකෙන් generate කරනවා
  title: yup.string().required("Step title is required").max(100),
  desc: yup.string().required("Description is required").max(500),
  order: yup.number().integer().min(1).default(1),
});

const statSchema = yup.object({
  value: yup.string().required("Stat value is required").max(50),
  // "200+", "4.9★" etc
  label: yup.string().required("Stat label is required").max(100),
  order: yup.number().integer().min(1).default(1),
});

// ── Main service schema ───────────────────────────────────────────────────────

export const serviceSchema = yup.object({
  slug: yup
    .string()
    .required("Slug is required")
    .max(100)
    .matches(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers, and hyphens only"),
  // "turnkey-construction", "interior-finishing" etc

  iconName: yup
    .string()
    .required("Icon name is required")
    .max(50),
  // Lucide icon name string — "Home", "Wrench" etc
  // Frontend component-ඒකේදී string → LucideIcon map කරනවා

  color: yup
    .string()
    .required("Color is required")
    .max(200),
  // Tailwind gradient string — "from-[hsl(...)] to-[hsl(...)]"

  title: yup.string().required("Title is required").max(100),

  tagline: yup.string().required("Tagline is required").max(200),

  description: yup.string().required("Description is required").max(2000),

  highlights: yup
    .array()
    .of(yup.string().required().max(200))
    .min(1, "At least one highlight is required")
    .required("Highlights are required"),

  order: yup.number().integer().min(1).default(1),
  // Services list-ඒකේ sort order

  process: yup
    .array()
    .of(processStepSchema)
    .min(1, "At least one process step is required")
    .required("Process steps are required"),

  stats: yup
    .array()
    .of(statSchema)
    .min(1, "At least one stat is required")
    .required("Stats are required"),
});

export type ServiceInput = yup.InferType<typeof serviceSchema>;