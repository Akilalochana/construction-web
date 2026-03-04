import * as yup from "yup";

export const walkthroughRoomSchema = yup.object({
  roomKey: yup
    .string()
    .required("Room key is required")
    .oneOf(
      ["living", "kitchen", "bedroom", "bathroom"],
      "Invalid room key"
    ),
  name: yup.string().required("Room name is required").max(100),
  description: yup.string().required("Description is required"),
  image: yup
    .string()
    .required("Panoramic image is required")
    .url("Must be a valid URL"),
  order: yup.number().default(0),
});

export type WalkthroughRoomInput = yup.InferType<typeof walkthroughRoomSchema>;
