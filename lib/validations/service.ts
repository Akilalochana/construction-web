import * as yup from "yup";

export const serviceProcessSchema = yup.object({
  step: yup.string().required("Step is required").max(10),
  title: yup.string().required("Title is required").max(200),
  desc: yup.string().required("Description is required"),
  order: yup.number().default(0),
});

export const serviceStatSchema = yup.object({
  value: yup.string().required("Value is required").max(50),
  label: yup.string().required("Label is required").max(100),
  order: yup.number().default(0),
});

export const serviceSchema = yup.object({
  slug: yup.string().required("Slug is required").max(100),
  iconName: yup.string().required("Icon name is required").max(100),
  color: yup.string().required("Color is required").max(200),
  title: yup.string().required("Title is required").max(200),
  tagline: yup.string().required("Tagline is required").max(200),
  description: yup.string().required("Description is required"),
  highlights: yup
    .array()
    .of(yup.string().required())
    .required("Highlights are required"),
  order: yup.number().default(0),
  process: yup.array().of(serviceProcessSchema).default([]),
  stats: yup.array().of(serviceStatSchema).default([]),
});

export type ServiceInput = yup.InferType<typeof serviceSchema>;
export type ServiceProcessInput = yup.InferType<typeof serviceProcessSchema>;
export type ServiceStatInput = yup.InferType<typeof serviceStatSchema>;
