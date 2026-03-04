import { ApiResponse } from "@/lib/utils/response";
import { prisma } from "@/lib/prisma";

// GET all team members
export async function GET() {
  try {
    const teamMembers = await prisma.teamMember.findMany({
      orderBy: { order: "asc" },
    });

    return ApiResponse.success("Team members retrieved successfully", {
      teamMembers,
    });
  } catch (error) {
    console.error("Get team members error:", error);
    return ApiResponse.error("Failed to retrieve team members");
  }
}
