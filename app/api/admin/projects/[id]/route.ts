import { NextRequest } from "next/server";
import * as yup from "yup";
import { ApiResponse } from "@/lib/utils/response";
import { prisma } from "@/lib/prisma";
import { verifyAdminAuth } from "@/lib/utils/auth-middleware";
import { projectFormSchema } from "@/lib/validations/project"; // ✅ projectSchema → projectFormSchema
import { getYupErrorsUF } from "@/lib/utils/yup-errors";
import {
  saveFile,
  deleteFile,
  generateProjectFilename,
  getProjectImagePath,
  FileError,
} from "@/lib/utils/file-utils";

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

// PUT update project (FormData with optional new image)
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResult = await verifyAdminAuth(req);
  if ("error" in authResult) return authResult.error;

  let newImagePath: string | null = null;

  try {
    const { id } = await params;
    const projectId = Number(id);

    if (isNaN(projectId)) {
      return ApiResponse.failed("Invalid project ID");
    }

   
    const existingProject = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!existingProject) {
      return ApiResponse.notFound("Project not found");
    }

    const formData = await req.formData();

    const body = {
      title: formData.get("title"),
      category: formData.get("category"),
      location: formData.get("location"),
      year: formData.get("year"),
      description: formData.get("description"),
      featured: formData.get("featured") === "true",
    };

    const data = await projectFormSchema.validate(body, {
      abortEarly: false,
      stripUnknown: true,
    });

  
    let imagePath = existingProject.image;
    const imageFile = formData.get("image");

    if (imageFile instanceof File && imageFile.size > 0) {
      const filename = generateProjectFilename(imageFile.type);
      newImagePath = getProjectImagePath(filename);

      await saveFile(imageFile, newImagePath, {
        fieldName: "Project image",
        maxSizeMB: 10,
        allowedTypes: ["image/jpeg", "image/png", "image/webp", "image/gif"],
      });

     
      await deleteFile(existingProject.image);
      imagePath = newImagePath;
    }

    const project = await prisma.project.update({
      where: { id: projectId },
      data: {
        ...data,
        image: imagePath,
      },
    });

    return ApiResponse.success("Project updated successfully", { project });
  } catch (error) {
   
    if (newImagePath) {
      await deleteFile(newImagePath);
    }

    if (error instanceof yup.ValidationError) {
      const errors = getYupErrorsUF(error);
      return ApiResponse.failed(
        "Please check the provided information and try again.",
        errors
      );
    }

    if (error instanceof FileError) {
      return ApiResponse.failed(error.message, null);
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

  
    const existingProject = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!existingProject) {
      return ApiResponse.notFound("Project not found");
    }

    await prisma.project.delete({
      where: { id: projectId },
    });

 
    await deleteFile(existingProject.image);

    return ApiResponse.success("Project deleted successfully");
  } catch (error) {
    console.error("Delete project error:", error);
    return ApiResponse.error("Failed to delete project");
  }
}