import { NextRequest } from "next/server";
import * as yup from "yup";
import { ApiResponse } from "@/lib/utils/response";
import { prisma } from "@/lib/prisma";
import { verifyAdminAuth } from "@/lib/utils/auth-middleware";
import { serviceSchema } from "@/lib/validations/service";
import { getYupErrorsUF } from "@/lib/utils/yup-errors";

// GET single service
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const serviceId = Number(id);

    if (isNaN(serviceId)) {
      return ApiResponse.failed("Invalid service ID");
    }

    const service = await prisma.service.findUnique({
      where: { id: serviceId },
      include: {
        process: {
          orderBy: { order: "asc" },
        },
        stats: {
          orderBy: { order: "asc" },
        },
      },
    });

    if (!service) {
      return ApiResponse.notFound("Service not found");
    }

    return ApiResponse.success("Service retrieved successfully", { service });
  } catch (error) {
    console.error("Get service error:", error);
    return ApiResponse.error("Failed to retrieve service");
  }
}

// PUT update service
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResult = await verifyAdminAuth(req);
  if ("error" in authResult) return authResult.error;

  try {
    const { id } = await params;
    const serviceId = Number(id);

    if (isNaN(serviceId)) {
      return ApiResponse.failed("Invalid service ID");
    }

    const body = await req.json();
    const data = await serviceSchema.validate(body, {
      abortEarly: false,
      stripUnknown: true,
    });

    const { process, stats, ...serviceData } = data;

    // Delete existing related records and recreate them
    await prisma.serviceProcess.deleteMany({
      where: { serviceId },
    });

    await prisma.serviceStat.deleteMany({
      where: { serviceId },
    });

    const service = await prisma.service.update({
      where: { id: serviceId },
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

    return ApiResponse.success("Service updated successfully", { service });
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      const errors = getYupErrorsUF(error);
      return ApiResponse.failed(
        "Please check the provided information and try again.",
        errors
      );
    }
    console.error("Update service error:", error);
    return ApiResponse.error("Failed to update service");
  }
}

// DELETE service
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResult = await verifyAdminAuth(req);
  if ("error" in authResult) return authResult.error;

  try {
    const { id } = await params;
    const serviceId = Number(id);

    if (isNaN(serviceId)) {
      return ApiResponse.failed("Invalid service ID");
    }

    await prisma.service.delete({
      where: { id: serviceId },
    });

    return ApiResponse.success("Service deleted successfully");
  } catch (error) {
    console.error("Delete service error:", error);
    return ApiResponse.error("Failed to delete service");
  }
}
