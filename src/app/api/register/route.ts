// app/api/auth/register/route.ts
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "../../../../lib/mongodb";
import User from "../../../../models/User";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "All fields required" },
        { status: 400 },
      );
    }

    await dbConnect();

    const normalizedEmail = email.toLowerCase().trim();
    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists with this email" },
        { status: 409 },
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      role: "user",
    });

    return NextResponse.json(
      {
        message: "User registered successfully",
        email: user.email,
      },
      { status: 201 },
    );
  } catch (error) {
    const err = error as Error;
    console.error("Registration error:", err.message, err.stack);
    return NextResponse.json(
      { message: "Internal server error. Please try again later." },
      { status: 500 },
    );
  }
}
