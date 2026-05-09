import prisma from "@/lib/prisma";
import { requireUser } from "@/lib/requireUser";
import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(req: Request) {
  try {
    const session = await requireUser();

    if (!session.user?.email) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const formData = await req.formData();
    const file = formData.get("image") as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, message: "No image uploaded" },
        { status: 400 }
      );
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { success: false, message: "File must be an image" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadDir, { recursive: true });

    const fileName = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
    const filePath = path.join(uploadDir, fileName);

    await writeFile(filePath, buffer);

    const imageUrl = `/uploads/${fileName}`;

    await prisma.user.update({
      where: {
        email: session.user.email,
      },
      data: {
        image: imageUrl,
      },
    });

    return NextResponse.json({
      success: true,
      imageUrl,
      message: "Profile picture updated!",
    });
  } catch (error) {
    console.error("PROFILE_IMAGE_UPLOAD_ERROR:", error);

    return NextResponse.json(
      { success: false, message: "Failed to update profile picture" },
      { status: 500 }
    );
  }
}