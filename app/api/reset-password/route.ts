import { NextResponse } from "next/server";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { resetPasswordSchema } from "@/lib/validations/auth";

export async function POST(req: Request) {
  const body = await req.json();

  const validation = resetPasswordSchema.safeParse(body);

  if (!validation.success) {
    return NextResponse.json(
      { message: "Fill in the required fields", error: validation.error.flatten() },
      { status: 400 }
    );
  }

  const { email, token, password, confirmPassword } = validation.data;

  if (password !== confirmPassword) {
    return NextResponse.json(
      { message: "Passwords do not match" },
      { status: 400 }
    );
  }

  const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

  const resetToken = await prisma.passwordResetToken.findUnique({
    where: { tokenHash },
    include: { user: true },
  });

  if (
    !resetToken ||
    resetToken.expiresAt < new Date() ||
    resetToken.user.email !== email
  ) {
    return NextResponse.json(
      { message: "This reset link is invalid or has expired." },
      { status: 400 }
    );
  }

  const hashed = await bcrypt.hash(password, 10);

  await prisma.$transaction([
    prisma.user.update({
      where: { id: resetToken.userId },
      data: { password: hashed },
    }),
    prisma.passwordResetToken.deleteMany({
      where: { userId: resetToken.userId },
    }),
  ]);

  return NextResponse.json({ message: "Password reset successfully." });
}
