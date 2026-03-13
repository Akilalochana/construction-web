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

// Validation schema — FormData-ඒකෙන් text fields
const teamFormSchema = yup.object({
  name:     yup.string().required("Name is required").max(100),
  role:     yup.string().required("Role is required").max(100),
  initials: yup.string().required("Initials are required").max(2),
  color:    yup.string().required("Color is required").max(200),
  order:    yup.number().integer().min(1).default(1),
});

const getMemberImagePath = (filename: string) =>
  `uploads/team/${filename}`;

// GET all team members
export async function GET() {
  try {
    const teamMembers = await prisma.teamMember.findMany({
      orderBy: { order: "asc" },
    });
    return ApiResponse.success("Team members retrieved successfully", { teamMembers });
  } catch (error) {
    console.error("Get team members error:", error);
    return ApiResponse.error("Failed to retrieve team members");
  }
}

// POST create new team member (FormData + optional image)
export async function POST(req: NextRequest) {
  const authResult = await verifyAdminAuth(req);
  if ("error" in authResult) return authResult.error;

  let uploadedImagePath: string | null = null;

  try {
    const formData = await req.formData();

    const body = {
      name:     formData.get("name"),
      role:     formData.get("role"),
      initials: formData.get("initials"),
      color:    formData.get("color"),
      order:    Number(formData.get("order") ?? 1),
    };

    const data = await teamFormSchema.validate(body, {
      abortEarly: false,
      stripUnknown: true,
    });

    // Image optional — නැතිනම් initials avatar use කරනවා
    let imagePath: string | null = null;
    const imageFile = formData.get("image");

    if (imageFile instanceof File && imageFile.size > 0) {
      const filename = generateProjectFilename(imageFile.type);
      uploadedImagePath = getMemberImagePath(filename);

      imagePath = await saveFile(imageFile, uploadedImagePath, {
        fieldName: "Member photo",
        maxSizeMB: 5,
        allowedTypes: ["image/jpeg", "image/png", "image/webp"],
      });
    }

    const teamMember = await prisma.teamMember.create({
      data: {
        ...data,
        image: imagePath, // null නම් DB-ඒකේ null → frontend-ඒකේ initials avatar show කරනවා
      },
    });

    return ApiResponse.success("Team member created successfully", { teamMember });
  } catch (error) {
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
    console.error("Create team member error:", error);
    return ApiResponse.error("Failed to create team member");
  }
}