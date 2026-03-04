import * as yup from "yup";

export const projectSchema = yup.object({
  title: yup.string().required("Title is required").max(200),
  category: yup
    .string()
    .required("Category is required")
    .oneOf(
      ["Residential", "Commercial", "Interior", "Renovation"],
      "Invalid category"
    ),
  location: yup.string().required("Location is required").max(200),
  year: yup.string().required("Year is required").max(10),
  image: yup.string().required("Image is required").url("Must be a valid URL"),
  description: yup.string().required("Description is required"),
  featured: yup.boolean().default(false),
});

export type ProjectInput = yup.InferType<typeof projectSchema>;
