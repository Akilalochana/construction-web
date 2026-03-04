import { ApiResponse } from "@/lib/utils/response";
import { prisma } from "@/lib/prisma";

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
