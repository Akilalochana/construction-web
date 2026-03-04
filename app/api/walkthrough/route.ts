import { ApiResponse } from "@/lib/utils/response";
import { prisma } from "@/lib/prisma";

// GET all walkthrough rooms
export async function GET() {
  try {
    const rooms = await prisma.walkthroughRoom.findMany({
      orderBy: { order: "asc" },
    });

    return ApiResponse.success("Walkthrough rooms retrieved successfully", {
      rooms,
    });
  } catch (error) {
    console.error("Get walkthrough rooms error:", error);
    return ApiResponse.error("Failed to retrieve walkthrough rooms");
  }
}
