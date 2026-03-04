import { NextRequest } from "next/server";
import { ApiResponse } from "@/lib/utils/response";
import { prisma } from "@/lib/prisma";

// GET service by slug
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const service = await prisma.service.findUnique({
      where: { slug },
      include: {
        process: {
          orderBy: { order: "asc" },
        },
        stats: {
          orderBy: { order: "asc" },
        },
      },
    });

    if (!service) {
      return ApiResponse.notFound("Service not found");
    }

    return ApiResponse.success("Service retrieved successfully", { service });
  } catch (error) {
    console.error("Get service error:", error);
    return ApiResponse.error("Failed to retrieve service");
  }
}
