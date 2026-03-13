import { NextRequest } from "next/server";
import * as yup from "yup";
import { ApiResponse } from "@/lib/utils/response";
import { prisma } from "@/lib/prisma";
import { getYupErrorsUF } from "@/lib/utils/yup-errors";

// GET all approved reviews (public)
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const rating = searchParams.get("rating");

    const where: any = { status: "approved" };
    if (rating) where.rating = Number(rating);

    const reviews = await prisma.review.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    return ApiResponse.success("Reviews retrieved successfully", { reviews });
  } catch (error) {
    console.error("Get reviews error:", error);
    return ApiResponse.error("Failed to retrieve reviews");
  }
}

// POST submit new review (public — no auth)
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

    // Auto-generate initials from name
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
        status: "pending", // Admin approve කළාට පස්සේ public-ඒකේ පෙනෙනවා
      },
    });

    return ApiResponse.success(
      "Review submitted! It will appear after approval.",
      { review }
    );
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      return ApiResponse.failed(
        "Please check the provided information.",
        getYupErrorsUF(error)
      );
    }
    console.error("Submit review error:", error);
    return ApiResponse.error("Failed to submit review");
  }
}