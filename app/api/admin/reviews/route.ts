import { NextRequest } from "next/server";
import * as yup from "yup";
import { ApiResponse } from "@/lib/utils/response";
import { prisma } from "@/lib/prisma";
import { verifyAdminAuth } from "@/lib/utils/auth-middleware";
import { reviewSchema } from "@/lib/validations/review";
import { getYupErrorsUF } from "@/lib/utils/yup-errors";

// GET all reviews
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");

    const where = status ? { status: status as any } : {};

    const reviews = await prisma.review.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    return ApiResponse.success("Reviews retrieved successfully", { reviews });
  } catch (error) {
    console.error("Get reviews error:", error);
    return ApiResponse.error("Failed to retrieve reviews");
  }
}

// POST create new review
export async function POST(req: NextRequest) {
  const authResult = await verifyAdminAuth(req);
  if ("error" in authResult) return authResult.error;

  try {
    const body = await req.json();
    const data = await reviewSchema.validate(body, {
      abortEarly: false,
      stripUnknown: true,
    });

    const review = await prisma.review.create({
      data,
    });

    return ApiResponse.success("Review created successfully", { review });
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      const errors = getYupErrorsUF(error);
      return ApiResponse.failed(
        "Please check the provided information and try again.",
        errors
      );
    }
    console.error("Create review error:", error);
    return ApiResponse.error("Failed to create review");
  }
}
