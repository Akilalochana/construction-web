import { ApiResponse } from "@/lib/utils/response";
import { prisma } from "@/lib/prisma";

// GET all approved services with process and stats
export async function GET() {
  try {
    const services = await prisma.service.findMany({
      include: {
        process: {
          orderBy: { order: "asc" },
        },
        stats: {
          orderBy: { order: "asc" },
        },
      },
      orderBy: { order: "asc" },
    });

    return ApiResponse.success("Services retrieved successfully", { services });
  } catch (error) {
    console.error("Get services error:", error);
    return ApiResponse.error("Failed to retrieve services");
  }
}
