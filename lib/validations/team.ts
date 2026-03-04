import * as yup from "yup";

export const teamMemberSchema = yup.object({
  name: yup.string().required("Name is required").max(100),
  role: yup.string().required("Role is required").max(100),
  initials: yup.string().required("Initials are required").max(5),
  color: yup.string().required("Color is required").max(200),
  order: yup.number().default(0),
});

export type TeamMemberInput = yup.InferType<typeof teamMemberSchema>;
