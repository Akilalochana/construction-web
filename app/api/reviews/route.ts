import { NextRequest } from "next/server";
import { ApiResponse } from "@/lib/utils/response";
import { prisma } from "@/lib/prisma";

// GET all approved reviews (public access)
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const rating = searchParams.get("rating");

    const where: any = {
      status: "approved", // Only show approved reviews to public
    };
    
    if (rating) {
      where.rating = Number(rating);
    }

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
