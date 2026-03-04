import { NextRequest } from "next/server";
import * as yup from "yup";
import { ApiResponse } from "@/lib/utils/response";
import { prisma } from "@/lib/prisma";
import { verifyAdminAuth } from "@/lib/utils/auth-middleware";
import { beforeAfterSchema } from "@/lib/validations/before-after";
import { getYupErrorsUF } from "@/lib/utils/yup-errors";

// GET single comparison
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const comparisonId = Number(id);

    if (isNaN(comparisonId)) {
      return ApiResponse.failed("Invalid comparison ID");
    }

    const comparison = await prisma.beforeAfter.findUnique({
      where: { id: comparisonId },
    });

    if (!comparison) {
      return ApiResponse.notFound("Comparison not found");
    }

    return ApiResponse.success("Comparison retrieved successfully", { comparison });
  } catch (error) {
    console.error("Get comparison error:", error);
    return ApiResponse.error("Failed to retrieve comparison");
  }
}

// PUT update comparison
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResult = await verifyAdminAuth(req);
  if ("error" in authResult) return authResult.error;

  try {
    const { id } = await params;
    const comparisonId = Number(id);

    if (isNaN(comparisonId)) {
      return ApiResponse.failed("Invalid comparison ID");
    }

    const body = await req.json();
    const data = await beforeAfterSchema.validate(body, {
      abortEarly: false,
      stripUnknown: true,
    });

    const comparison = await prisma.beforeAfter.update({
      where: { id: comparisonId },
      data,
    });

    return ApiResponse.success("Comparison updated successfully", { comparison });
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      const errors = getYupErrorsUF(error);
      return ApiResponse.failed(
        "Please check the provided information and try again.",
        errors
      );
    }
    console.error("Update comparison error:", error);
    return ApiResponse.error("Failed to update comparison");
  }
}

// DELETE comparison
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResult = await verifyAdminAuth(req);
  if ("error" in authResult) return authResult.error;

  try {
    const { id } = await params;
    const comparisonId = Number(id);

    if (isNaN(comparisonId)) {
      return ApiResponse.failed("Invalid comparison ID");
    }

    await prisma.beforeAfter.delete({
      where: { id: comparisonId },
    });

    return ApiResponse.success("Comparison deleted successfully");
  } catch (error) {
    console.error("Delete comparison error:", error);
    return ApiResponse.error("Failed to delete comparison");
  }
}
