import * as yup from "yup";

export const reviewSchema = yup.object({
  name: yup.string().required("Name is required").max(100),
  role: yup.string().max(100).default(""),
  rating: yup
    .number()
    .required("Rating is required")
    .min(1, "Rating must be at least 1")
    .max(5, "Rating must be at most 5"),
  project: yup.string().max(200).default(""),
  text: yup.string().required("Review text is required").max(1000),
  status: yup
    .string()
    .oneOf(["pending", "approved", "rejected"], "Invalid status")
    .default("pending"),
  helpful: yup.number().default(0),
});

export type ReviewInput = yup.InferType<typeof reviewSchema>;
