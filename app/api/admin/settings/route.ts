import { NextRequest } from "next/server";
import * as yup from "yup";
import { ApiResponse } from "@/lib/utils/response";
import { prisma } from "@/lib/prisma";
import { verifyAdminAuth } from "@/lib/utils/auth-middleware";
import { getYupErrorsUF } from "@/lib/utils/yup-errors";

const settingsSchema = yup.object({
  waNumber:     yup.string().max(20).default("94771234567"),
  waMessage:    yup.string().max(500).default("Hi! I'm interested in your construction services."),
  phone:        yup.string().max(50).default(""),
  email:        yup.string().email().max(100).default(""),
  address:      yup.string().max(300).default(""),
  businessName: yup.string().max(100).default("Construction Co."),
  tagline:      yup.string().max(200).default("Building Your Dreams Into Reality"),
});

// GET — admin
export async function GET(req: NextRequest) {
  const authResult = await verifyAdminAuth(req);
  if ("error" in authResult) return authResult.error;

  try {
    let settings = await prisma.siteSetting.findUnique({ where: { id: 1 } });
    if (!settings) {
      settings = await prisma.siteSetting.create({ data: { id: 1 } });
    }
    return ApiResponse.success("Settings retrieved successfully", { settings });
  } catch (error) {
    console.error("Get settings error:", error);
    return ApiResponse.error("Failed to retrieve settings");
  }
}

// PUT — save all settings
export async function PUT(req: NextRequest) {
  const authResult = await verifyAdminAuth(req);
  if ("error" in authResult) return authResult.error;

  try {
    const body = await req.json();
    const data = await settingsSchema.validate(body, {
      abortEarly: false,
      stripUnknown: true,
    });

    // upsert — id=1 always singleton
    const settings = await prisma.siteSetting.upsert({
      where:  { id: 1 },
      update: data,
      create: { id: 1, ...data },
    });

    return ApiResponse.success("Settings saved successfully", { settings });
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      return ApiResponse.failed("Validation error", getYupErrorsUF(error));
    }
    console.error("Save settings error:", error);
    return ApiResponse.error("Failed to save settings");
  }
}