import * as yup from "yup";

export const beforeAfterSchema = yup.object({
  label: yup.string().default("Portfolio Comparison").max(200),
  beforeImage: yup
    .string()
    .required("Before image is required")
    .url("Must be a valid URL"),
  afterImage: yup
    .string()
    .required("After image is required")
    .url("Must be a valid URL"),
  order: yup.number().default(0),
});

export type BeforeAfterInput = yup.InferType<typeof beforeAfterSchema>;
