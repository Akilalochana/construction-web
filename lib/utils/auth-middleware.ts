import { NextRequest } from "next/server";
import { jwtVerify } from "jose";
import { secretKey } from "./jwt";
import { ApiResponse } from "./response";
import { prisma } from "@/lib/prisma";

export interface AuthenticatedAdmin {
  id: number;
  email: string;
  name: string;
}

export async function verifyAdminAuth(
  req: NextRequest
): Promise<{ error: Response } | { admin: AuthenticatedAdmin }> {
  try {
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return { error: ApiResponse.unauthorized("Not authenticated.") };
    }

    const { payload } = await jwtVerify(token, secretKey);
    const id = Number(payload.id);

    if (!id || Number.isNaN(id)) {
      return { error: ApiResponse.unauthorized("Invalid token.") };
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
      return { error: ApiResponse.unauthorized("Not authenticated.") };
    }

    return { admin };
  } catch {
    return { error: ApiResponse.unauthorized("Invalid or expired token.") };
  }
}
