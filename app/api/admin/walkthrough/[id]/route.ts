import { NextRequest } from "next/server";
import * as yup from "yup";
import { ApiResponse } from "@/lib/utils/response";
import { prisma } from "@/lib/prisma";
import { verifyAdminAuth } from "@/lib/utils/auth-middleware";
import { walkthroughRoomSchema } from "@/lib/validations/walkthrough";
import { getYupErrorsUF } from "@/lib/utils/yup-errors";

// GET single walkthrough room
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const roomId = Number(id);

    if (isNaN(roomId)) {
      return ApiResponse.failed("Invalid room ID");
    }

    const room = await prisma.walkthroughRoom.findUnique({
      where: { id: roomId },
    });

    if (!room) {
      return ApiResponse.notFound("Walkthrough room not found");
    }

    return ApiResponse.success("Walkthrough room retrieved successfully", { room });
  } catch (error) {
    console.error("Get walkthrough room error:", error);
    return ApiResponse.error("Failed to retrieve walkthrough room");
  }
}

// PUT update walkthrough room
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResult = await verifyAdminAuth(req);
  if ("error" in authResult) return authResult.error;

  try {
    const { id } = await params;
    const roomId = Number(id);

    if (isNaN(roomId)) {
      return ApiResponse.failed("Invalid room ID");
    }

    const body = await req.json();
    const data = await walkthroughRoomSchema.validate(body, {
      abortEarly: false,
      stripUnknown: true,
    });

    const room = await prisma.walkthroughRoom.update({
      where: { id: roomId },
      data,
    });

    return ApiResponse.success("Walkthrough room updated successfully", { room });
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      const errors = getYupErrorsUF(error);
      return ApiResponse.failed(
        "Please check the provided information and try again.",
        errors
      );
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

    if (isNaN(roomId)) {
      return ApiResponse.failed("Invalid room ID");
    }

    await prisma.walkthroughRoom.delete({
      where: { id: roomId },
    });

    return ApiResponse.success("Walkthrough room deleted successfully");
  } catch (error) {
    console.error("Delete walkthrough room error:", error);
    return ApiResponse.error("Failed to delete walkthrough room");
  }
}
