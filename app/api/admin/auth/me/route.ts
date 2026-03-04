import { NextRequest } from "next/server";
import { ApiResponse } from "@/lib/utils/response";
import { prisma } from "@/lib/prisma";
import { secretKey } from "@/lib/utils/jwt";
import { jwtVerify } from "jose";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return ApiResponse.unauthorized("Not authenticated.");
    }

    const { payload } = await jwtVerify(token, secretKey);
    const id = Number(payload.id);

    if (!id || Number.isNaN(id)) {
      return ApiResponse.unauthorized("Invalid token payload.");
    }

    const admin = await prisma.admin.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        isActive: true,
      },
    });

    if (!admin || !admin.isActive) {
      return ApiResponse.unauthorized("Not authenticated.");
    }

    return ApiResponse.success("Authenticated", { admin });
  } catch {
    return ApiResponse.unauthorized("Not authenticated.");
  }
}
