import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs";

/**
 * Serve uploaded files from public/uploads directory
 * Example: GET /api/files/uploads/projects/1234/image.jpg
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path: pathSegments } = await params;
    const filePath = pathSegments.join("/");

    // Security: prevent directory traversal
    if (filePath.includes("..")) {
      return new NextResponse("Invalid file path", { status: 400 });
    }

    const fullPath = path.join(process.cwd(), "public", filePath);

    // Verify file exists
    if (!fs.existsSync(fullPath)) {
      return new NextResponse("File not found", { status: 404 });
    }

    // Read file
    const fileBuffer = await fs.promises.readFile(fullPath);

    // Determine content type
    const ext = path.extname(fullPath).toLowerCase();
    let contentType = "application/octet-stream";

    const mimeTypes: { [key: string]: string } = {
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
      ".png": "image/png",
      ".webp": "image/webp",
      ".gif": "image/gif",
      ".pdf": "application/pdf",
    };

    contentType = mimeTypes[ext] || contentType;

    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error("Error serving file:", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
