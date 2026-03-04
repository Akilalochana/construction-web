import { NextRequest } from "next/server";
import * as yup from "yup";
import { ApiResponse } from "@/lib/utils/response";
import { prisma } from "@/lib/prisma";
import { verifyAdminAuth } from "@/lib/utils/auth-middleware";
import { reviewSchema } from "@/lib/validations/review";
import { getYupErrorsUF } from "@/lib/utils/yup-errors";

// GET single review
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const reviewId = Number(id);

    if (isNaN(reviewId)) {
      return ApiResponse.failed("Invalid review ID");
    }

    const review = await prisma.review.findUnique({
      where: { id: reviewId },
    });

    if (!review) {
      return ApiResponse.notFound("Review not found");
    }

    return ApiResponse.success("Review retrieved successfully", { review });
  } catch (error) {
    console.error("Get review error:", error);
    return ApiResponse.error("Failed to retrieve review");
  }
}

// PUT update review
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResult = await verifyAdminAuth(req);
  if ("error" in authResult) return authResult.error;

  try {
    const { id } = await params;
    const reviewId = Number(id);

    if (isNaN(reviewId)) {
      return ApiResponse.failed("Invalid review ID");
    }

    const body = await req.json();
    const data = await reviewSchema.validate(body, {
      abortEarly: false,
      stripUnknown: true,
    });

    const review = await prisma.review.update({
      where: { id: reviewId },
      data,
    });

    return ApiResponse.success("Review updated successfully", { review });
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      const errors = getYupErrorsUF(error);
      return ApiResponse.failed(
        "Please check the provided information and try again.",
        errors
      );
    }
    console.error("Update review error:", error);
    return ApiResponse.error("Failed to update review");
  }
}

// DELETE review
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResult = await verifyAdminAuth(req);
  if ("error" in authResult) return authResult.error;

  try {
    const { id } = await params;
    const reviewId = Number(id);

    if (isNaN(reviewId)) {
      return ApiResponse.failed("Invalid review ID");
    }

    await prisma.review.delete({
      where: { id: reviewId },
    });

    return ApiResponse.success("Review deleted successfully");
  } catch (error) {
    console.error("Delete review error:", error);
    return ApiResponse.error("Failed to delete review");
  }
}
