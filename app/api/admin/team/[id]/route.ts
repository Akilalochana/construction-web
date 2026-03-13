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

const teamFormSchema = yup.object({
  name:     yup.string().required("Name is required").max(100),
  role:     yup.string().required("Role is required").max(100),
  initials: yup.string().required("Initials are required").max(2),
  color:    yup.string().required("Color is required").max(200),
  order:    yup.number().integer().min(1).default(1),
});

const getMemberImagePath = (filename: string) =>
  `uploads/team/${filename}`;

// GET single team member
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const memberId = Number(id);
    if (isNaN(memberId)) return ApiResponse.failed("Invalid team member ID");

    const teamMember = await prisma.teamMember.findUnique({
      where: { id: memberId },
    });
    if (!teamMember) return ApiResponse.notFound("Team member not found");

    return ApiResponse.success("Team member retrieved successfully", { teamMember });
  } catch (error) {
    console.error("Get team member error:", error);
    return ApiResponse.error("Failed to retrieve team member");
  }
}

// PUT update team member (FormData + optional new image)
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResult = await verifyAdminAuth(req);
  if ("error" in authResult) return authResult.error;

  let newImagePath: string | null = null;

  try {
    const { id } = await params;
    const memberId = Number(id);
    if (isNaN(memberId)) return ApiResponse.failed("Invalid team member ID");

    const existing = await prisma.teamMember.findUnique({ where: { id: memberId } });
    if (!existing) return ApiResponse.notFound("Team member not found");

    const formData = await req.formData();

    const body = {
      name:     formData.get("name"),
      role:     formData.get("role"),
      initials: formData.get("initials"),
      color:    formData.get("color"),
      order:    Number(formData.get("order") ?? existing.order),
    };

    const data = await teamFormSchema.validate(body, {
      abortEarly: false,
      stripUnknown: true,
    });

    // Image optional — නොදුන්නොත් existing image-ම
    let imagePath = existing.image; // string | null
    const imageFile = formData.get("image");

    if (imageFile instanceof File && imageFile.size > 0) {
      const filename = generateProjectFilename(imageFile.type);
      newImagePath = getMemberImagePath(filename);

      await saveFile(imageFile, newImagePath, {
        fieldName: "Member photo",
        maxSizeMB: 5,
        allowedTypes: ["image/jpeg", "image/png", "image/webp"],
      });

      // නව image saved → පරණ image delete (null නම් skip)
      if (existing.image) await deleteFile(existing.image);
      imagePath = newImagePath;
    }

    // "remove" flag — admin-ඒකෙන් image remove කරන්න option දෙනවා
    const removeImage = formData.get("removeImage") === "true";
    if (removeImage && existing.image) {
      await deleteFile(existing.image);
      imagePath = null;
    }

    const teamMember = await prisma.teamMember.update({
      where: { id: memberId },
      data: { ...data, image: imagePath },
    });

    return ApiResponse.success("Team member updated successfully", { teamMember });
  } catch (error) {
    if (newImagePath) await deleteFile(newImagePath);

    if (error instanceof yup.ValidationError) {
      return ApiResponse.failed(
        "Please check the provided information and try again.",
        getYupErrorsUF(error)
      );
    }
    if (error instanceof FileError) {
      return ApiResponse.failed(error.message, null);
    }
    console.error("Update team member error:", error);
    return ApiResponse.error("Failed to update team member");
  }
}

// DELETE team member
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResult = await verifyAdminAuth(req);
  if ("error" in authResult) return authResult.error;

  try {
    const { id } = await params;
    const memberId = Number(id);
    if (isNaN(memberId)) return ApiResponse.failed("Invalid team member ID");

    const existing = await prisma.teamMember.findUnique({ where: { id: memberId } });
    if (!existing) return ApiResponse.notFound("Team member not found");

    await prisma.teamMember.delete({ where: { id: memberId } });

    // Image තිබ්බොත් delete — null නම් skip
    if (existing.image) await deleteFile(existing.image);

    return ApiResponse.success("Team member deleted successfully");
  } catch (error) {
    console.error("Delete team member error:", error);
    return ApiResponse.error("Failed to delete team member");
  }
}