import { NextRequest } from "next/server";
import * as yup from "yup";
import { ApiResponse } from "@/lib/utils/response";
import { prisma } from "@/lib/prisma";
import { verifyAdminAuth } from "@/lib/utils/auth-middleware";
import { projectSchema } from "@/lib/validations/project";
import { getYupErrorsUF } from "@/lib/utils/yup-errors";

// GET single project
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const projectId = Number(id);

    if (isNaN(projectId)) {
      return ApiResponse.failed("Invalid project ID");
    }

    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      return ApiResponse.notFound("Project not found");
    }

    return ApiResponse.success("Project retrieved successfully", { project });
  } catch (error) {
    console.error("Get project error:", error);
    return ApiResponse.error("Failed to retrieve project");
  }
}

// PUT update project
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResult = await verifyAdminAuth(req);
  if ("error" in authResult) return authResult.error;

  try {
    const { id } = await params;
    const projectId = Number(id);

    if (isNaN(projectId)) {
      return ApiResponse.failed("Invalid project ID");
    }

    const body = await req.json();
    const data = await projectSchema.validate(body, {
      abortEarly: false,
      stripUnknown: true,
    });

    const project = await prisma.project.update({
      where: { id: projectId },
      data,
    });

    return ApiResponse.success("Project updated successfully", { project });
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      const errors = getYupErrorsUF(error);
      return ApiResponse.failed(
        "Please check the provided information and try again.",
        errors
      );
    }
    console.error("Update project error:", error);
    return ApiResponse.error("Failed to update project");
  }
}

// DELETE project
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResult = await verifyAdminAuth(req);
  if ("error" in authResult) return authResult.error;

  try {
    const { id } = await params;
    const projectId = Number(id);

    if (isNaN(projectId)) {
      return ApiResponse.failed("Invalid project ID");
    }

    await prisma.project.delete({
      where: { id: projectId },
    });

    return ApiResponse.success("Project deleted successfully");
  } catch (error) {
    console.error("Delete project error:", error);
    return ApiResponse.error("Failed to delete project");
  }
}
