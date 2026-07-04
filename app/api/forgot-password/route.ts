import { NextResponse } from "next/server";
import { Resend } from "resend";
import crypto from "crypto";
import prisma from "@/lib/prisma";

const resend = new Resend(process.env.RESEND_API_KEY);

const RESET_TOKEN_TTL_MS = 60 * 60 * 1000; // 1 hour

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { message: "Email is required." },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    // Always return a generic success response so this endpoint can't be
    // used to enumerate which emails have accounts.
    if (!user) {
      return NextResponse.json({
        message: "Password reset email sent successfully.",
      });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const tokenHash = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    await prisma.passwordResetToken.deleteMany({
      where: { userId: user.id },
    });

    await prisma.passwordResetToken.create({
      data: {
        tokenHash,
        userId: user.id,
        expiresAt: new Date(Date.now() + RESET_TOKEN_TTL_MS),
      },
    });

    const resetLink = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${resetToken}&email=${encodeURIComponent(
      email
    )}`;

    await resend.emails.send({
      from: "Swift Shift <onboarding@resend.dev>",
      to: email,
      subject: "Reset your Swift Shift password",
      html: `
        <h2>Reset your password</h2>
        <p>You requested to reset your Swift Shift password.</p>
        <p>Click the link below to reset it. This link expires in 1 hour.</p>
        <a href="${resetLink}">Reset Password</a>
        <p>If you did not request this, you can ignore this email.</p>
      `,
    });

    return NextResponse.json({
      message: "Password reset email sent successfully.",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Failed to send password reset email." },
      { status: 500 }
    );
  }
}
