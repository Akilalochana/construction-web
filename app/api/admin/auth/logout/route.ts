import { ApiResponse } from "@/lib/utils/response";
import { NextRequest } from "next/server";

export async function POST(_req: NextRequest) {
  try {
    const response = ApiResponse.success("Logged out successfully.");

    response.cookies.set("token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      expires: new Date(0),
    });

    return response;
  } catch (error) {
    return ApiResponse.serverError(error);
  }
}

export async function GET(req: NextRequest) {
  return POST(req);
}
