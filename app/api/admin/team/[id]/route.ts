import { NextRequest } from "next/server";
import * as yup from "yup";
import { ApiResponse } from "@/lib/utils/response";
import { prisma } from "@/lib/prisma";
import { verifyAdminAuth } from "@/lib/utils/auth-middleware";
import { teamMemberSchema } from "@/lib/validations/team";
import { getYupErrorsUF } from "@/lib/utils/yup-errors";

// GET single team member
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const memberId = Number(id);

    if (isNaN(memberId)) {
      return ApiResponse.failed("Invalid team member ID");
    }

    const teamMember = await prisma.teamMember.findUnique({
      where: { id: memberId },
    });

    if (!teamMember) {
      return ApiResponse.notFound("Team member not found");
    }

    return ApiResponse.success("Team member retrieved successfully", { teamMember });
  } catch (error) {
    console.error("Get team member error:", error);
    return ApiResponse.error("Failed to retrieve team member");
  }
}

// PUT update team member
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResult = await verifyAdminAuth(req);
  if ("error" in authResult) return authResult.error;

  try {
    const { id } = await params;
    const memberId = Number(id);

    if (isNaN(memberId)) {
      return ApiResponse.failed("Invalid team member ID");
    }

    const body = await req.json();
    const data = await teamMemberSchema.validate(body, {
      abortEarly: false,
      stripUnknown: true,
    });

    const teamMember = await prisma.teamMember.update({
      where: { id: memberId },
      data,
    });

    return ApiResponse.success("Team member updated successfully", { teamMember });
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      const errors = getYupErrorsUF(error);
      return ApiResponse.failed(
        "Please check the provided information and try again.",
        errors
      );
    }
    console.error("Update team member error:", error);
    return ApiResponse.error("Failed to update team member");
  }
}

// DELETE team member
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResult = await verifyAdminAuth(req);
  if ("error" in authResult) return authResult.error;

  try {
    const { id } = await params;
    const memberId = Number(id);

    if (isNaN(memberId)) {
      return ApiResponse.failed("Invalid team member ID");
    }

    await prisma.teamMember.delete({
      where: { id: memberId },
    });

    return ApiResponse.success("Team member deleted successfully");
  } catch (error) {
    console.error("Delete team member error:", error);
    return ApiResponse.error("Failed to delete team member");
  }
}
