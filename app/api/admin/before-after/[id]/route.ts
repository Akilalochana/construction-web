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

import * as yupLib from "yup";
const beforeAfterFormSchema = yupLib.object({
  title: yupLib.string().required("Title is required").max(200),
  location: yupLib.string().optional().max(200),
  year: yupLib.string().optional().max(10),
  order: yupLib.number().integer().min(1).default(1),
});

// GET single comparison
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const comparisonId = Number(id);
    if (isNaN(comparisonId)) return ApiResponse.failed("Invalid comparison ID");

    const comparison = await prisma.beforeAfter.findUnique({
      where: { id: comparisonId },
    });

    if (!comparison) return ApiResponse.notFound("Comparison not found");

    return ApiResponse.success("Comparison retrieved successfully", { comparison });
  } catch (error) {
    console.error("Get comparison error:", error);
    return ApiResponse.error("Failed to retrieve comparison");
  }
}

// PUT update comparison (images optional)
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResult = await verifyAdminAuth(req);
  if ("error" in authResult) return authResult.error;

  let newBeforePath: string | null = null;
  let newAfterPath: string | null = null;

  try {
    const { id } = await params;
    const comparisonId = Number(id);
    if (isNaN(comparisonId)) return ApiResponse.failed("Invalid comparison ID");

    const existing = await prisma.beforeAfter.findUnique({
      where: { id: comparisonId },
    });
    if (!existing) return ApiResponse.notFound("Comparison not found");

    const formData = await req.formData();

    const body = {
      title: formData.get("title"),
      location: formData.get("location") || undefined,
      year: formData.get("year") || undefined,
      order: formData.get("order") ? Number(formData.get("order")) : existing.order,
    };

    const data = await beforeAfterFormSchema.validate(body, {
      abortEarly: false,
      stripUnknown: true,
    });

    // Before image — optional on update
    let beforeImagePath = existing.beforeImage;
    const beforeFile = formData.get("beforeImage");
    if (beforeFile instanceof File && beforeFile.size > 0) {
      const filename = generateProjectFilename(beforeFile.type);
      newBeforePath = `uploads/before-after/${filename}`;
      await saveFile(beforeFile, newBeforePath, {
        fieldName: "Before image",
        maxSizeMB: 10,
        allowedTypes: ["image/jpeg", "image/png", "image/webp"],
      });
      await deleteFile(existing.beforeImage); // delete old
      beforeImagePath = newBeforePath;
    }

    // After image — optional on update
    let afterImagePath = existing.afterImage;
    const afterFile = formData.get("afterImage");
    if (afterFile instanceof File && afterFile.size > 0) {
      const filename = generateProjectFilename(afterFile.type);
      newAfterPath = `uploads/before-after/${filename}`;
      await saveFile(afterFile, newAfterPath, {
        fieldName: "After image",
        maxSizeMB: 10,
        allowedTypes: ["image/jpeg", "image/png", "image/webp"],
      });
      await deleteFile(existing.afterImage); // delete old
      afterImagePath = newAfterPath;
    }

    const comparison = await prisma.beforeAfter.update({
      where: { id: comparisonId },
      data: {
        ...data,
        beforeImage: beforeImagePath,
        afterImage: afterImagePath,
      },
    });

    return ApiResponse.success("Comparison updated successfully", { comparison });
  } catch (error) {
    // Cleanup new uploads on error
    if (newBeforePath) await deleteFile(newBeforePath);
    if (newAfterPath) await deleteFile(newAfterPath);

    if (error instanceof yup.ValidationError) {
      const errors = getYupErrorsUF(error);
      return ApiResponse.failed("Please check the provided information and try again.", errors);
    }
    if (error instanceof FileError) {
      return ApiResponse.failed(error.message, null);
    }
    console.error("Update comparison error:", error);
    return ApiResponse.error("Failed to update comparison");
  }
}

// DELETE comparison + cleanup images
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResult = await verifyAdminAuth(req);
  if ("error" in authResult) return authResult.error;

  try {
    const { id } = await params;
    const comparisonId = Number(id);
    if (isNaN(comparisonId)) return ApiResponse.failed("Invalid comparison ID");

    const existing = await prisma.beforeAfter.findUnique({
      where: { id: comparisonId },
    });
    if (!existing) return ApiResponse.notFound("Comparison not found");

    await prisma.beforeAfter.delete({ where: { id: comparisonId } });

    // Cleanup both images
    await deleteFile(existing.beforeImage);
    await deleteFile(existing.afterImage);

    return ApiResponse.success("Comparison deleted successfully");
  } catch (error) {
    console.error("Delete comparison error:", error);
    return ApiResponse.error("Failed to delete comparison");
  }
}