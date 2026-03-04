import { NextRequest } from "next/server";
import * as yup from "yup";
import { ApiResponse } from "@/lib/utils/response";
import { prisma } from "@/lib/prisma";
import { verifyAdminAuth } from "@/lib/utils/auth-middleware";
import { walkthroughRoomSchema } from "@/lib/validations/walkthrough";
import { getYupErrorsUF } from "@/lib/utils/yup-errors";

// GET all walkthrough rooms
export async function GET() {
  try {
    const rooms = await prisma.walkthroughRoom.findMany({
      orderBy: { order: "asc" },
    });

    return ApiResponse.success("Walkthrough rooms retrieved successfully", {
      rooms,
    });
  } catch (error) {
    console.error("Get walkthrough rooms error:", error);
    return ApiResponse.error("Failed to retrieve walkthrough rooms");
  }
}

// POST create new walkthrough room
export async function POST(req: NextRequest) {
  const authResult = await verifyAdminAuth(req);
  if ("error" in authResult) return authResult.error;

  try {
    const body = await req.json();
    const data = await walkthroughRoomSchema.validate(body, {
      abortEarly: false,
      stripUnknown: true,
    });

    const room = await prisma.walkthroughRoom.create({
      data,
    });

    return ApiResponse.success("Walkthrough room created successfully", { room });
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      const errors = getYupErrorsUF(error);
      return ApiResponse.failed(
        "Please check the provided information and try again.",
        errors
      );
    }
    console.error("Create walkthrough room error:", error);
    return ApiResponse.error("Failed to create walkthrough room");
  }
}
