import * as yup from "yup";

export const reviewSchema = yup.object({
  name: yup.string().required("Name is required").max(100),
  initials: yup.string().required("Initials are required").max(5),
  role: yup.string().required("Role is required").max(100),
  rating: yup
    .number()
    .required("Rating is required")
    .min(1, "Rating must be at least 1")
    .max(5, "Rating must be at most 5"),
  project: yup.string().required("Project name is required").max(200),
  text: yup.string().required("Review text is required"),
  status: yup
    .string()
    .oneOf(["pending", "approved", "rejected"], "Invalid status")
    .default("pending"),
  helpful: yup.number().default(0),
});

export type ReviewInput = yup.InferType<typeof reviewSchema>;
