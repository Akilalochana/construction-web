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

const walkthroughFormSchema = yup.object({
  name:        yup.string().required("Room name is required").max(100),
  description: yup.string().required("Description is required").max(500),
  order:       yup.number().integer().min(1).default(1),
});

const getRoomImagePath = (filename: string) =>
  `uploads/walkthrough/${filename}`;

// GET single walkthrough room
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const roomId = Number(id);

    if (isNaN(roomId)) return ApiResponse.failed("Invalid room ID");

    const room = await prisma.walkthroughRoom.findUnique({
      where: { id: roomId },
    });

    if (!room) return ApiResponse.notFound("Walkthrough room not found");

    return ApiResponse.success("Walkthrough room retrieved successfully", { room });
  } catch (error) {
    console.error("Get walkthrough room error:", error);
    return ApiResponse.error("Failed to retrieve walkthrough room");
  }
}

// PUT update walkthrough room (FormData + optional new image)
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResult = await verifyAdminAuth(req);
  if ("error" in authResult) return authResult.error;

  let newImagePath: string | null = null;

  try {
    const { id } = await params;
    const roomId = Number(id);

    if (isNaN(roomId)) return ApiResponse.failed("Invalid room ID");

    // Exist check
    const existingRoom = await prisma.walkthroughRoom.findUnique({
      where: { id: roomId },
    });
    if (!existingRoom) return ApiResponse.notFound("Walkthrough room not found");

    const formData = await req.formData();

    const body = {
      name:        formData.get("name"),
      description: formData.get("description"),
      order:       Number(formData.get("order") ?? existingRoom.order),
    };

    const data = await walkthroughFormSchema.validate(body, {
      abortEarly: false,
      stripUnknown: true,
    });

    // Image optional on update — නැතිනම් පරණ image තියෙනවා
    let imagePath = existingRoom.image;
    const imageFile = formData.get("image");

    if (imageFile instanceof File && imageFile.size > 0) {
      const filename = generateProjectFilename(imageFile.type);
      newImagePath = getRoomImagePath(filename);

      // නව image save — success වුනාට පස්සේ පරණ delete
      await saveFile(imageFile, newImagePath, {
        fieldName: "Room image",
        maxSizeMB: 20,
        allowedTypes: ["image/jpeg", "image/png", "image/webp"],
      });

      await deleteFile(existingRoom.image);
      imagePath = newImagePath;
    }

    const room = await prisma.walkthroughRoom.update({
      where: { id: roomId },
      data: { ...data, image: imagePath },
    });

    return ApiResponse.success("Walkthrough room updated successfully", { room });
  } catch (error) {
    // Error නම් නව image cleanup
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
    console.error("Update walkthrough room error:", error);
    return ApiResponse.error("Failed to update walkthrough room");
  }
}

// DELETE walkthrough room
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResult = await verifyAdminAuth(req);
  if ("error" in authResult) return authResult.error;

  try {
    const { id } = await params;
    const roomId = Number(id);

    if (isNaN(roomId)) return ApiResponse.failed("Invalid room ID");

    const existingRoom = await prisma.walkthroughRoom.findUnique({
      where: { id: roomId },
    });
    if (!existingRoom) return ApiResponse.notFound("Walkthrough room not found");

    await prisma.walkthroughRoom.delete({ where: { id: roomId } });

    // DB delete success → filesystem image delete
    await deleteFile(existingRoom.image);

    return ApiResponse.success("Walkthrough room deleted successfully");
  } catch (error) {
    console.error("Delete walkthrough room error:", error);
    return ApiResponse.error("Failed to delete walkthrough room");
  }
}