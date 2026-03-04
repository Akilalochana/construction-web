import * as yup from "yup";

const adminSchema = yup.object({
  email: yup
    .string()
    .required("Email is required")
    .email("Please provide a valid email"),
  password: yup
    .string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters"),
  name: yup.string().optional(),
});

export default adminSchema;
