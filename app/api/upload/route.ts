import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { v2 as cloudinary } from "cloudinary";

// Parse CLOUDINARY_URL if set: cloudinary://api_key:api_secret@cloud_name
function parseCloudinaryUrl(url: string) {
  try {
    const match = url.match(/cloudinary:\/\/([^:]+):([^@]+)@(.+)/);
    if (match) {
      return { api_key: match[1], api_secret: match[2], cloud_name: match[3] };
    }
  } catch {}
  return null;
}

const cloudinaryConfig = process.env.CLOUDINARY_URL
  ? parseCloudinaryUrl(process.env.CLOUDINARY_URL)
  : null;

cloudinary.config({
  cloud_name: cloudinaryConfig?.cloud_name ?? process.env.CLOUDINARY_CLOUD_NAME,
  api_key: cloudinaryConfig?.api_key ?? process.env.CLOUDINARY_API_KEY,
  api_secret: cloudinaryConfig?.api_secret ?? process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_SIZE = 10 * 1024 * 1024; // 10MB

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "沒有檔案" }, { status: 400 });
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ error: "不支援的格式，請上傳 JPG/PNG/WebP/GIF" }, { status: 400 });
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: "檔案太大，最大 10MB" }, { status: 400 });
    }

    // Convert to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Check if Cloudinary is configured
    const hasCloudinary = !!(cloudinaryConfig || (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY));
    console.log("[upload] hasCloudinary:", hasCloudinary, "| config:", cloudinaryConfig);

    if (hasCloudinary) {
      // Upload to Cloudinary via base64
      const b64 = buffer.toString("base64");
      const dataUri = `data:${file.type};base64,${b64}`;

      console.log("[upload] Uploading to Cloudinary, file size:", buffer.length);

      const result = await cloudinary.uploader.upload(dataUri, {
        folder: "visual-bait",
        resource_type: "image",
        transformation: [{ quality: "auto", fetch_format: "auto" }],
      });

      console.log("[upload] Cloudinary result:", result.secure_url);

      return NextResponse.json({
        url: result.secure_url,
        publicId: result.public_id,
        width: result.width,
        height: result.height,
      });
    }

    // Fallback: save locally for development
    console.log("[upload] Falling back to local storage");
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, { recursive: true });

    const ext = file.name.split(".").pop() || "jpg";
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const filepath = path.join(uploadDir, filename);

    await writeFile(filepath, buffer);
    console.log("[upload] Saved locally:", filename);

    return NextResponse.json({
      url: `/uploads/${filename}`,
      publicId: filename,
    });
  } catch (err) {
    console.error("[upload] Error:", err);
    return NextResponse.json({ error: "上傳失敗" }, { status: 500 });
  }
}
