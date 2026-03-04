import { NextRequest } from "next/server";
import * as yup from "yup";
import { ApiResponse } from "@/lib/utils/response";
import { prisma } from "@/lib/prisma";
import { verifyAdminAuth } from "@/lib/utils/auth-middleware";
import { beforeAfterSchema } from "@/lib/validations/before-after";
import { getYupErrorsUF } from "@/lib/utils/yup-errors";

// GET all before/after comparisons
export async function GET() {
  try {
    const comparisons = await prisma.beforeAfter.findMany({
      orderBy: { order: "asc" },
    });

    return ApiResponse.success("Before/After comparisons retrieved successfully", {
      comparisons,
    });
  } catch (error) {
    console.error("Get before/after error:", error);
    return ApiResponse.error("Failed to retrieve comparisons");
  }
}

// POST create new comparison
export async function POST(req: NextRequest) {
  const authResult = await verifyAdminAuth(req);
  if ("error" in authResult) return authResult.error;

  try {
    const body = await req.json();
    const data = await beforeAfterSchema.validate(body, {
      abortEarly: false,
      stripUnknown: true,
    });

    const comparison = await prisma.beforeAfter.create({
      data,
    });

    return ApiResponse.success("Comparison created successfully", { comparison });
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      const errors = getYupErrorsUF(error);
      return ApiResponse.failed(
        "Please check the provided information and try again.",
        errors
      );
    }
    console.error("Create comparison error:", error);
    return ApiResponse.error("Failed to create comparison");
  }
}
