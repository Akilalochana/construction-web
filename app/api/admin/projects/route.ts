import { NextRequest } from "next/server";
import * as yup from "yup";
import { ApiResponse } from "@/lib/utils/response";
import { prisma } from "@/lib/prisma";
import { verifyAdminAuth } from "@/lib/utils/auth-middleware";
import { projectSchema } from "@/lib/validations/project";
import { getYupErrorsUF } from "@/lib/utils/yup-errors";

// GET all projects
export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
    });

    return ApiResponse.success("Projects retrieved successfully", { projects });
  } catch (error) {
    console.error("Get projects error:", error);
    return ApiResponse.error("Failed to retrieve projects");
  }
}

// POST create new project
export async function POST(req: NextRequest) {
  const authResult = await verifyAdminAuth(req);
  if ("error" in authResult) return authResult.error;

  try {
    const body = await req.json();
    const data = await projectSchema.validate(body, {
      abortEarly: false,
      stripUnknown: true,
    });

    const project = await prisma.project.create({
      data,
    });

    return ApiResponse.success("Project created successfully", { project });
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      const errors = getYupErrorsUF(error);
      return ApiResponse.failed(
        "Please check the provided information and try again.",
        errors
      );
    }
    console.error("Create project error:", error);
    return ApiResponse.error("Failed to create project");
  }
}
