import { NextRequest } from "next/server";
import * as yup from "yup";
import { ApiResponse } from "@/lib/utils/response";
import { prisma } from "@/lib/prisma";
import { verifyAdminAuth } from "@/lib/utils/auth-middleware";
import { teamMemberSchema } from "@/lib/validations/team";
import { getYupErrorsUF } from "@/lib/utils/yup-errors";

// GET all team members
export async function GET() {
  try {
    const teamMembers = await prisma.teamMember.findMany({
      orderBy: { order: "asc" },
    });

    return ApiResponse.success("Team members retrieved successfully", {
      teamMembers,
    });
  } catch (error) {
    console.error("Get team members error:", error);
    return ApiResponse.error("Failed to retrieve team members");
  }
}

// POST create new team member
export async function POST(req: NextRequest) {
  const authResult = await verifyAdminAuth(req);
  if ("error" in authResult) return authResult.error;

  try {
    const body = await req.json();
    const data = await teamMemberSchema.validate(body, {
      abortEarly: false,
      stripUnknown: true,
    });

    const teamMember = await prisma.teamMember.create({
      data,
    });

    return ApiResponse.success("Team member created successfully", { teamMember });
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      const errors = getYupErrorsUF(error);
      return ApiResponse.failed(
        "Please check the provided information and try again.",
        errors
      );
    }
    console.error("Create team member error:", error);
    return ApiResponse.error("Failed to create team member");
  }
}
