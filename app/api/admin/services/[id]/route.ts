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
        process: { orderBy: { order: "asc" } },
        stats: { orderBy: { order: "asc" } },
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

    // ✅ Bug 3 Fix: exist check — නැතිනම් early return
    const existing = await prisma.service.findUnique({
      where: { id: serviceId },
    });

    if (!existing) {
      return ApiResponse.notFound("Service not found");
    }

    const body = await req.json();
    const data = await serviceSchema.validate(body, {
      abortEarly: false,
      stripUnknown: true,
    });

    const { process, stats, ...serviceData } = data;

    // ✅ Bug 1 Fix: Transaction use කරනවා
    // deleteMany + update ඔක්කොම එක atomic operation ඒකේ වෙනවා
    // ඕනෑම step-ඒකක් fail වුනොත් ඔක්කොම rollback — data loss නැහැ
    const service = await prisma.$transaction(async (tx: Parameters<Parameters<typeof prisma.$transaction>[0]>[0]) => {

      // Step 1: පරණ process records delete
      await tx.serviceProcess.deleteMany({
        where: { serviceId },
      });

      // Step 2: පරණ stat records delete
      await tx.serviceStat.deleteMany({
        where: { serviceId },
      });

      // Step 3: Service update + නව records create
      // මේ ඔක්කොම fail වුනොත් step 1 සහ 2 ද rollback වෙනවා
      return tx.service.update({
        where: { id: serviceId },
        data: {
          ...serviceData,
          process: {
            create: process.map((p: any, i: number) => ({
              ...p,
              order: p.order ?? i + 1,
            })),
          },
          stats: {
            create: stats.map((s: any, i: number) => ({
              ...s,
              order: s.order ?? i + 1,
            })),
          },
        },
        include: {
          process: { orderBy: { order: "asc" } },
          stats: { orderBy: { order: "asc" } },
        },
      });
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

    // ✅ exist check
    const existing = await prisma.service.findUnique({
      where: { id: serviceId },
    });

    if (!existing) {
      return ApiResponse.notFound("Service not found");
    }

    // ✅ Bug 2 Fix: Transaction-ඒකෙන් manually cascade delete කරනවා
    // Prisma schema-ඒකේ onDelete: Cascade set නොකළොත් ද safe
    await prisma.$transaction(async (tx: Parameters<Parameters<typeof prisma.$transaction>[0]>[0]) => {
      // Child records මුලින් delete — parent delete කරන්න කලින්
      await tx.serviceProcess.deleteMany({ where: { serviceId } });
      await tx.serviceStat.deleteMany({ where: { serviceId } });
      await tx.service.delete({ where: { id: serviceId } });
    });

    return ApiResponse.success("Service deleted successfully");
  } catch (error) {
    console.error("Delete service error:", error);
    return ApiResponse.error("Failed to delete service");
  }
}