import * as yup from "yup";

export const siteSettingsSchema = yup.object({
  waNumber: yup.string().required("WhatsApp number is required").max(20),
  waMessage: yup.string().required("WhatsApp message is required"),
  phone: yup.string().required("Phone number is required").max(20),
  email: yup.string().required("Email is required").email("Invalid email"),
  address: yup.string().default(""),
  businessName: yup.string().required("Business name is required").max(200),
  tagline: yup.string().required("Tagline is required").max(300),
});

export type SiteSettingsInput = yup.InferType<typeof siteSettingsSchema>;
