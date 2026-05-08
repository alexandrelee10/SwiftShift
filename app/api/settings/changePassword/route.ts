import { authOptions } from "@/lib/auth-options";
import prisma from "@/lib/prisma";
import { changePasswordSchema } from "@/lib/validations/auth";
import bcrypt from "bcryptjs";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const body = await req.json();

    // Validations
    const validation = await changePasswordSchema.safeParse(body);

    if (!validation.success) {
        return NextResponse.json(
            { message: "Fill in the required fields and ensure new passwords match", error: validation.error.flatten() },
            { status: 400 }
        );
    };

    const { originalPassword, newPassword, confirmNewPassword } = validation.data;

    if (newPassword !== confirmNewPassword) {
        return NextResponse.json(
            { message: "Passwords do not match "},
            { status: 401 }
        )
    }

    // Session
    const session = await getServerSession(authOptions);
    
    if (!session?.user.email) {
        return NextResponse.json(
            { message: "Username or password is invalid" },
            { status: 400 }
        );
    };

    // Specific User
    const dbUser = await prisma.user.findUnique({
        where: {
            email: session?.user.email,
        }
    });

    if (!dbUser) {
        return NextResponse.json({
            message: "Username or password is invalid"
        });
    };

    // Verify Passwords
    const passwordCheck = await bcrypt.compare(originalPassword, dbUser?.password);

    if (!passwordCheck) {
        return NextResponse.json(
            { message: "Passwords do not match" },
            { status: 401 }
        );
    };

    // Hash new password 
    const hashed = await bcrypt.hash(newPassword, 10);

    // Update password
    await prisma.user.update({
        data: {
            password: hashed
        },
        where: {
            email: dbUser.email
        }
    });

    return NextResponse.json(
        { message: "Password updated" },
        { status: 200 }
    )


    
}