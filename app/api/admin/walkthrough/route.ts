import { NextRequest } from "next/server";
import * as yup from "yup";
import { ApiResponse } from "@/lib/utils/response";
import { prisma } from "@/lib/prisma";
import { verifyAdminAuth } from "@/lib/utils/auth-middleware";
import { getYupErrorsUF } from "@/lib/utils/yup-errors";
import {
  saveFile,
  deleteFile,
  generateProjectFilename,
  FileError,
} from "@/lib/utils/file-utils";
import { randomUUID } from "crypto";



// Walkthrough room validation schema
// JSON-ඒකෙන් නෙමේ — FormData-ඒකෙන් image file එනවා
const walkthroughFormSchema = yup.object({
  name:        yup.string().required("Room name is required").max(100),
  description: yup.string().required("Description is required").max(500),
  order:       yup.number().integer().min(1).default(1),
});

// Helper — image path
const getRoomImagePath = (filename: string) =>
  `uploads/walkthrough/${filename}`;

// GET all walkthrough rooms
export async function GET() {
  try {
    const rooms = await prisma.walkthroughRoom.findMany({
      orderBy: { order: "asc" },
    });

    return ApiResponse.success("Walkthrough rooms retrieved successfully", { rooms });
  } catch (error) {
    console.error("Get walkthrough rooms error:", error);
    return ApiResponse.error("Failed to retrieve walkthrough rooms");
  }
}

// POST create new walkthrough room (FormData + image)
export async function POST(req: NextRequest) {
  const authResult = await verifyAdminAuth(req);
  if ("error" in authResult) return authResult.error;

  let uploadedImagePath: string | null = null;

  try {
    const formData = await req.formData();

    const body = {
      name:        formData.get("name"),
      description: formData.get("description"),
      order:       Number(formData.get("order") ?? 1),
    };

    const data = await walkthroughFormSchema.validate(body, {
      abortEarly: false,
      stripUnknown: true,
    });

    // Image required for new room
    const imageFile = formData.get("image");
    if (!(imageFile instanceof File)) {
      return ApiResponse.failed("Image is required.", { image: "Image file is missing" });
    }

    const filename = generateProjectFilename(imageFile.type);
    uploadedImagePath = getRoomImagePath(filename);

    const savedPath = await saveFile(imageFile, uploadedImagePath, {
      fieldName: "Room image",
      maxSizeMB: 20, // 360° images ලොකු වෙන්න පුළුවන්
      allowedTypes: ["image/jpeg", "image/png", "image/webp"],
    });

    const room = await prisma.walkthroughRoom.create({
      data: {
        ...data,
        roomKey: randomUUID(),
        image: savedPath,
      },
    });

    return ApiResponse.success("Walkthrough room created successfully", { room });
  } catch (error) {
    // Error නම් upload කළ image cleanup
    if (uploadedImagePath) await deleteFile(uploadedImagePath);

    if (error instanceof yup.ValidationError) {
      return ApiResponse.failed(
        "Please check the provided information and try again.",
        getYupErrorsUF(error)
      );
    }
    if (error instanceof FileError) {
      return ApiResponse.failed(error.message, null);
    }
    console.error("Create walkthrough room error:", error);
    return ApiResponse.error("Failed to create walkthrough room");
  }
}