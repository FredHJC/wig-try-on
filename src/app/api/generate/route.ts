import { NextRequest, NextResponse } from "next/server";
import { generateTryOn } from "@/lib/gemini";
import { getWigById } from "@/lib/wigs";
import { readFileSync } from "fs";
import { join } from "path";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const userImage = formData.get("userImage") as File | null;
    const wigId = formData.get("wigId") as string | null;

    if (!userImage || !wigId) {
      return NextResponse.json(
        { error: "Missing user image or wig ID" },
        { status: 400 }
      );
    }

    const wig = getWigById(wigId);
    if (!wig) {
      return NextResponse.json({ error: "Wig not found" }, { status: 404 });
    }

    // Convert user image to base64
    const userImageBuffer = Buffer.from(await userImage.arrayBuffer());
    const userImageBase64 = userImageBuffer.toString("base64");
    const userImageMimeType = userImage.type || "image/jpeg";

    // Read wig image from public directory
    const wigImagePath = join(process.cwd(), "public", wig.imageUrl);
    const wigImageBuffer = readFileSync(wigImagePath);
    const wigImageBase64 = wigImageBuffer.toString("base64");
    const wigImageMimeType = "image/jpeg";

    const result = await generateTryOn(
      userImageBase64,
      userImageMimeType,
      wigImageBase64,
      wigImageMimeType
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error("Generation error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to generate image";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
