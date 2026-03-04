import { NextRequest } from "next/server";
import { ApiResponse } from "@/lib/utils/response";
import { prisma } from "@/lib/prisma";

// GET all projects (public access)
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const featured = searchParams.get("featured");

    const where: any = {};
    
    if (category && category !== "All") {
      where.category = category;
    }
    
    if (featured === "true") {
      where.featured = true;
    }

    const projects = await prisma.project.findMany({
      where,
      orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
    });

    return ApiResponse.success("Projects retrieved successfully", { projects });
  } catch (error) {
    console.error("Get projects error:", error);
    return ApiResponse.error("Failed to retrieve projects");
  }
}
