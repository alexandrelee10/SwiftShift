import  prisma  from "@/lib/prisma";
import { signUpSchema } from "@/lib/validations/auth";
import bcrypt from "bcryptjs";
import {  NextResponse } from "next/server";

export async function POST (req: Request) {
    const body = await req.json();

    const validation = await signUpSchema.safeParse(body);
    if (!validation.success) {
        return NextResponse.json(
            { message: "Fill in required fields", error: validation.error.flatten() },
            { status: 400 }
        );
    };

    const { firstName, lastName, email, phoneNum, password} = validation.data

    const existingUser = await prisma.user.findUnique({
        where: { email }
    });

    if (existingUser) {
        return NextResponse.json(
            { message: "User already exists" },
            { status: 409 }
        )
    }

    const hashed = await bcrypt.hash(password, 10);

    await prisma.user.create({
        data: {
            firstName: firstName,
            lastName: lastName,
            email: email,
            phoneNum: phoneNum,
            password: hashed,
            role: "DRIVER" // fix later
        },
    });

    return NextResponse.json(
        { message: "Account successfully created" },
        { status: 200 },
    );
}