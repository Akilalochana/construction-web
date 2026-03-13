import { NextRequest } from "next/server";
import { ApiResponse } from "@/lib/utils/response";
import { prisma } from "@/lib/prisma";
import { verifyAdminAuth } from "@/lib/utils/auth-middleware";

// GET single review
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResult = await verifyAdminAuth(req);
  if ("error" in authResult) return authResult.error;

  try {
    const { id } = await params;
    const reviewId = Number(id);
    if (isNaN(reviewId)) return ApiResponse.failed("Invalid review ID");

    const review = await prisma.review.findUnique({ where: { id: reviewId } });
    if (!review) return ApiResponse.notFound("Review not found");

    return ApiResponse.success("Review retrieved successfully", { review });
  } catch (error) {
    console.error("Get review error:", error);
    return ApiResponse.error("Failed to retrieve review");
  }
}

// PATCH — approve or reject a review
// Body: { status: "approved" | "rejected" }
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResult = await verifyAdminAuth(req);
  if ("error" in authResult) return authResult.error;

  try {
    const { id } = await params;
    const reviewId = Number(id);
    if (isNaN(reviewId)) return ApiResponse.failed("Invalid review ID");

    const body = await req.json();
    const { status } = body;

    if (!["approved", "rejected", "pending"].includes(status)) {
      return ApiResponse.failed("Status must be 'approved', 'rejected', or 'pending'");
    }

    const existing = await prisma.review.findUnique({ where: { id: reviewId } });
    if (!existing) return ApiResponse.notFound("Review not found");

    const review = await prisma.review.update({
      where: { id: reviewId },
      data: { status },
    });

    return ApiResponse.success(`Review ${status} successfully`, { review });
  } catch (error) {
    console.error("Update review status error:", error);
    return ApiResponse.error("Failed to update review status");
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
    if (isNaN(reviewId)) return ApiResponse.failed("Invalid review ID");

    const existing = await prisma.review.findUnique({ where: { id: reviewId } });
    if (!existing) return ApiResponse.notFound("Review not found");

    await prisma.review.delete({ where: { id: reviewId } });

    return ApiResponse.success("Review deleted successfully");
  } catch (error) {
    console.error("Delete review error:", error);
    return ApiResponse.error("Failed to delete review");
  }
}