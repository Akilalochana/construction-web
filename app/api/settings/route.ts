import { ApiResponse } from "@/lib/utils/response";
import { prisma } from "@/lib/prisma";

// GET site settings
export async function GET() {
  try {
    let settings = await prisma.siteSetting.findUnique({
      where: { id: 1 },
    });

    // Create default settings if not exists
    if (!settings) {
      settings = await prisma.siteSetting.create({
        data: { id: 1 },
      });
    }

    return ApiResponse.success("Settings retrieved successfully", { settings });
  } catch (error) {
    console.error("Get settings error:", error);
    return ApiResponse.error("Failed to retrieve settings");
  }
}
