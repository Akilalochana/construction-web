import * as yup from "yup";
import bcrypt from "bcryptjs";
import { NextRequest } from "next/server";
import adminSchema from "@/lib/validations/admin";
import { getYupErrorsUF } from "@/lib/utils/yup-errors";
import { ApiResponse } from "@/lib/utils/response";
import { prisma } from "@/lib/prisma";
import { expiration, generateAdminAuthToken } from "@/lib/utils/jwt";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = await adminSchema.pick(["email", "password"]).validate(body, {
      abortEarly: false,
      stripUnknown: true,
    });

    const admin = await prisma.admin.findUnique({
      where: { email: data.email.toLowerCase() },
    });

    if (!admin || !admin.isActive) {
      return ApiResponse.unauthorized("Invalid email or password.");
    }

    const isPasswordValid = await bcrypt.compare(data.password, admin.password);

    if (!isPasswordValid) {
      return ApiResponse.unauthorized("Invalid email or password.");
    }

    const token = await generateAdminAuthToken(admin);

    return ApiResponse.successWithAuth(
      "Welcome back, you’re all set and ready to go.",
      token,
      expiration,
      {
        admin: {
          id: admin.id,
          name: admin.name,
          email: admin.email,
        },
      }
    );
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      const errors = getYupErrorsUF(error);
      return ApiResponse.failed(
        "Provided some invalid details, please check and submit again.",
        errors
      );
    }
    return ApiResponse.serverError(error);
  }
}
