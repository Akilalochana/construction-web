import { NextRequest } from "next/server";
import * as yup from "yup";
import { ApiResponse } from "@/lib/utils/response";
import { prisma } from "@/lib/prisma";
import { verifyAdminAuth } from "@/lib/utils/auth-middleware";
import { getYupErrorsUF } from "@/lib/utils/yup-errors";

// ── Admin GET — filter by status ──────────────────────────────────────────────
export async function GET(req: NextRequest) {
  const authResult = await verifyAdminAuth(req);
  if ("error" in authResult) return authResult.error;

  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");

    const reviews = await prisma.review.findMany({
      where: status ? { status: status as any } : {},
      orderBy: { createdAt: "desc" },
    });

    return ApiResponse.success("Reviews retrieved successfully", { reviews });
  } catch (error) {
    console.error("Get reviews error:", error);
    return ApiResponse.error("Failed to retrieve reviews");
  }
}

// ── Public POST — customer review submit ──────────────────────────────────────
// Auth නැහැ — ඕනෑම කෙනෙකුට submit කරන්න පුළුවන්
// Status automatically "pending" — admin approve කළාට පස්සේ public-ඒකේ පෙනෙනවා
const reviewSubmitSchema = yup.object({
  name:    yup.string().required("Name is required").max(100),
  role:    yup.string().max(100).default(""),
  rating:  yup.number().integer().min(1).max(5).required("Rating is required"),
  project: yup.string().max(200).default(""),
  text:    yup.string().required("Review text is required").max(1000),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = await reviewSubmitSchema.validate(body, {
      abortEarly: false,
      stripUnknown: true,
    });

    // Initials auto-generate
    const initials = data.name
      .split(" ")
      .map((n: string) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

    const review = await prisma.review.create({
      data: {
        ...data,
        initials,
        status: "pending", // Always starts as pending
      },
    });

    return ApiResponse.success("Review submitted successfully. It will appear after approval.", { review });
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      return ApiResponse.failed(
        "Please check the provided information and try again.",
        getYupErrorsUF(error)
      );
    }
    console.error("Submit review error:", error);
    return ApiResponse.error("Failed to submit review");
  }
}