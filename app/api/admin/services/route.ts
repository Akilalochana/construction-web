import { NextRequest } from "next/server";
import * as yup from "yup";
import { ApiResponse } from "@/lib/utils/response";
import { prisma } from "@/lib/prisma";
import { verifyAdminAuth } from "@/lib/utils/auth-middleware";
import { serviceSchema } from "@/lib/validations/service";
import { getYupErrorsUF } from "@/lib/utils/yup-errors";

// GET all services
export async function GET() {
  try {
    const services = await prisma.service.findMany({
      include: {
        process: {
          orderBy: { order: "asc" },
        },
        stats: {
          orderBy: { order: "asc" },
        },
      },
      orderBy: { order: "asc" },
    });

    return ApiResponse.success("Services retrieved successfully", { services });
  } catch (error) {
    console.error("Get services error:", error);
    return ApiResponse.error("Failed to retrieve services");
  }
}

// POST create new service
export async function POST(req: NextRequest) {
  const authResult = await verifyAdminAuth(req);
  if ("error" in authResult) return authResult.error;

  try {
    const body = await req.json();
    const data = await serviceSchema.validate(body, {
      abortEarly: false,
      stripUnknown: true,
    });

    const { process, stats, ...serviceData } = data;

    const service = await prisma.service.create({
      data: {
        ...serviceData,
        process: {
          create: process,
        },
        stats: {
          create: stats,
        },
      },
      include: {
        process: true,
        stats: true,
      },
    });

    return ApiResponse.success("Service created successfully", { service });
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      const errors = getYupErrorsUF(error);
      return ApiResponse.failed(
        "Please check the provided information and try again.",
        errors
      );
    }
    console.error("Create service error:", error);
    return ApiResponse.error("Failed to create service");
  }
}
