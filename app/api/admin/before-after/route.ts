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

// Validation — FormData fields (images handled separately)
import * as yupLib from "yup";
const beforeAfterFormSchema = yupLib.object({
  title: yupLib.string().required("Title is required").max(200),
  location: yupLib.string().optional().max(200),
  year: yupLib.string().optional().max(10),
  order: yupLib.number().integer().min(1).default(1),
});

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

// POST create new comparison with image upload
export async function POST(req: NextRequest) {
  const authResult = await verifyAdminAuth(req);
  if ("error" in authResult) return authResult.error;

  let beforeImagePath: string | null = null;
  let afterImagePath: string | null = null;

  try {
    const formData = await req.formData();

    const body = {
      title: formData.get("title"),
      location: formData.get("location") || undefined,
      year: formData.get("year") || undefined,
      order: formData.get("order") ? Number(formData.get("order")) : 1,
    };

    const data = await beforeAfterFormSchema.validate(body, {
      abortEarly: false,
      stripUnknown: true,
    });

    // Before image — required
    const beforeFile = formData.get("beforeImage");
    if (!(beforeFile instanceof File) || beforeFile.size === 0) {
      return ApiResponse.failed("Before image is required.", {
        beforeImage: "Before image is missing",
      });
    }

    // After image — required
    const afterFile = formData.get("afterImage");
    if (!(afterFile instanceof File) || afterFile.size === 0) {
      return ApiResponse.failed("After image is required.", {
        afterImage: "After image is missing",
      });
    }

    // Save before image
    const beforeFilename = generateProjectFilename(beforeFile.type);
    beforeImagePath = `uploads/before-after/${beforeFilename}`;
    await saveFile(beforeFile, beforeImagePath, {
      fieldName: "Before image",
      maxSizeMB: 10,
      allowedTypes: ["image/jpeg", "image/png", "image/webp"],
    });

    // Save after image
    const afterFilename = generateProjectFilename(afterFile.type);
    afterImagePath = `uploads/before-after/${afterFilename}`;
    await saveFile(afterFile, afterImagePath, {
      fieldName: "After image",
      maxSizeMB: 10,
      allowedTypes: ["image/jpeg", "image/png", "image/webp"],
    });

    const comparison = await prisma.beforeAfter.create({
      data: {
        ...data,
        beforeImage: beforeImagePath,
        afterImage: afterImagePath,
      },
    });

    return ApiResponse.success("Comparison created successfully", { comparison });
  } catch (error) {
    // Cleanup uploaded files on error
    if (beforeImagePath) await deleteFile(beforeImagePath);
    if (afterImagePath) await deleteFile(afterImagePath);

    if (error instanceof yup.ValidationError) {
      const errors = getYupErrorsUF(error);
      return ApiResponse.failed("Please check the provided information and try again.", errors);
    }
    if (error instanceof FileError) {
      return ApiResponse.failed(error.message, null);
    }
    console.error("Create comparison error:", error);
    return ApiResponse.error("Failed to create comparison");
  }
}