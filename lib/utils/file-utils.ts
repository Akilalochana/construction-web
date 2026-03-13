import fs from "fs";
import path from "path";
import { writeFile, mkdir } from "fs/promises";

export class FileError extends Error {
  constructor(message: string, public statusCode: number = 500) {
    super(message);
    this.name = "FileError";
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

/**
 * Save uploaded file to filesystem
 * @param file File data
 * @param savePath Target path, eg: uploads/projects/123.jpg
 * @param validations Validate file size and type
 */
export const saveFile = async (
  file: File,
  savePath: string,
  validations: {
    fieldName: string;
    maxSizeMB?: number;
    allowedTypes?: string[];
  }
) => {
  if (!file || file.size === 0) {
    throw new FileError(
      `The ${validations.fieldName} is not uploaded or is empty.`,
      400
    );
  }

  if (
    validations.maxSizeMB &&
    file.size > validations.maxSizeMB * 1024 * 1024
  ) {
    throw new FileError(
      `The ${validations.fieldName} cannot exceed ${validations.maxSizeMB}MB.`,
      400
    );
  }

  if (
    validations.allowedTypes &&
    !validations.allowedTypes.includes(file.type)
  ) {
    throw new FileError(
      `The ${validations.fieldName} type is invalid. Only ${validations.allowedTypes.join(", ")} are allowed.`,
      400
    );
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const fullPath = path.join(process.cwd(), "public", savePath);

    const directory = path.dirname(fullPath);
    if (!fs.existsSync(directory)) {
      await mkdir(directory, { recursive: true });
    }

    await writeFile(fullPath, buffer);
    return savePath;
  } catch (error) {
    console.error("File save error:", error);
    throw new FileError("Failed to save file. Please try again later.", 500);
  }
};

/**
 * Delete file from filesystem
 */
export const deleteFile = async (filePath: string) => {
  try {
    const fullPath = path.join(process.cwd(), "public", filePath);
    if (fs.existsSync(fullPath)) {
      await fs.promises.unlink(fullPath);
    }
  } catch (error) {
    console.error("Error deleting file:", error);
  }
};

/**
 * Get extension from MIME type
 */
export const getFileExtension = (mimeType: string): string => {
  const extensions: { [key: string]: string } = {
    "image/jpeg": "jpg",
    "image/jpg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "image/gif": "gif",
  };
  return extensions[mimeType] || "jpg";
};

/**
 * Generate unique filename with timestamp + random string + extension
 * eg: project-1741651234567-x4k9mz.jpg
 */
export const generateProjectFilename = (mimeType: string): string => {
  const ext = getFileExtension(mimeType);
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  return `project-${timestamp}-${random}.${ext}`;
};


export const getProjectImagePath = (filename: string) => {
  return `uploads/projects/${filename}`;
};