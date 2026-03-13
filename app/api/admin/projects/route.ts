import { NextRequest } from "next/server";
import * as yup from "yup";
import { ApiResponse } from "@/lib/utils/response";
import { prisma } from "@/lib/prisma";
import { verifyAdminAuth } from "@/lib/utils/auth-middleware";
import { projectFormSchema } from "@/lib/validations/project";
import { getYupErrorsUF } from "@/lib/utils/yup-errors";
import {
  saveFile,
  deleteFile,
  generateProjectFilename,
  getProjectImagePath,
  FileError,
} from "@/lib/utils/file-utils";

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

// POST create new project with image upload
export async function POST(req: NextRequest) {
  const authResult = await verifyAdminAuth(req);
  if ("error" in authResult) return authResult.error;

  let uploadedImagePath: string | null = null;

  try {
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

    const imageFile = formData.get("image");
    if (!(imageFile instanceof File)) {
      return ApiResponse.failed("Image is required. Please upload an image.", {
        image: "Image file is missing",
      });
    }


    const filename = generateProjectFilename(imageFile.type);
    uploadedImagePath = getProjectImagePath(filename);

    const savedPath = await saveFile(imageFile, uploadedImagePath, {
      fieldName: "Project image",
      maxSizeMB: 10,
      allowedTypes: ["image/jpeg", "image/png", "image/webp", "image/gif"],
    });

    const project = await prisma.project.create({
      data: {
        ...data,
        image: savedPath,
      },
    });

    return ApiResponse.success("Project created successfully", { project });
  } catch (error) {
    if (uploadedImagePath) {
      await deleteFile(uploadedImagePath);
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

    console.error("Create project error:", error);
    return ApiResponse.error("Failed to create project");
  }
}