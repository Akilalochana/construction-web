import { NextRequest } from "next/server";
import * as yup from "yup";
import { ApiResponse } from "@/lib/utils/response";
import { prisma } from "@/lib/prisma";
import { verifyAdminAuth } from "@/lib/utils/auth-middleware";
import { siteSettingsSchema } from "@/lib/validations/settings";
import { getYupErrorsUF } from "@/lib/utils/yup-errors";

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

// PUT update site settings
export async function PUT(req: NextRequest) {
  const authResult = await verifyAdminAuth(req);
  if ("error" in authResult) return authResult.error;

  try {
    const body = await req.json();
    const data = await siteSettingsSchema.validate(body, {
      abortEarly: false,
      stripUnknown: true,
    });

    const settings = await prisma.siteSetting.upsert({
      where: { id: 1 },
      update: data,
      create: { id: 1, ...data },
    });

    return ApiResponse.success("Settings updated successfully", { settings });
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      const errors = getYupErrorsUF(error);
      return ApiResponse.failed(
        "Please check the provided information and try again.",
        errors
      );
    }
    console.error("Update settings error:", error);
    return ApiResponse.error("Failed to update settings");
  }
}
