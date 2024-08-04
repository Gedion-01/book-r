import { NextResponse } from "next/server";
import { validateEmail, validatePassword } from "@/helper/validate";
import prisma from "@/lib/prisma";
import bycrypt from "bcryptjs";
import * as jose from "jose";
import { cookies } from "next/headers";

interface Formdata {
  email: string;
  password: string;
  remember_me: boolean;
  role: "ADMIN" | "OWNER" | "USER";
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log(body);

    const { email, password, role, remember_me } = <Formdata>body;

    // validator
    if (!validateEmail(email) || !validatePassword(password) || !role) {
      console.log("sdsd");
      return Response.json(
        {
          error: "Invalid form data",
        },
        { status: 400 }
      );
    }

    // look for the user
    const user = await prisma.user.findFirst({
      where: {
        email: email,
      },
    });
    console.log(user);

    if (!user) {
      console.log("Invalid");

      return Response.json(
        {
          error: "Invalid email or password",
        },
        { status: 400 }
      );
    }

    // compare the password
    const isCorrectPassword = bycrypt.compareSync(password, user.password);

    if (!isCorrectPassword) {
      return Response.json(
        {
          error: "Invalid email or password",
        },
        { status: 400 }
      );
    }

    // create a jwt
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const alg = "HS256";

    const jwt = await new jose.SignJWT()
      .setProtectedHeader({ alg })
      .setExpirationTime("72h")
      .setSubject(user.id.toString())
      .sign(secret);

    cookies().set("Authorization", jwt, {
      secure: true,
      httpOnly: true,
      path: "/",
      sameSite: "strict",
      expires: remember_me
        ? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        : undefined, // 7 days or session cookie
    });
    const id = user.id;
    return NextResponse.json({ jwt, id });
  } catch (error) {
    console.log("SIGNIN]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
