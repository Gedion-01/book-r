import { validateEmail, validatePassword } from "@/helper/validate";
import prisma from "@/lib/prisma";
import bycrypt from "bcryptjs";
import { NextResponse } from "next/server";

interface Formdata {
  email: string;
  password: string;
  location: string;
  phoneNumber: string;
  role: "ADMIN" | "OWNER" | "USER";
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log(body);
    
    const { email, password, location, phoneNumber, role } = <Formdata>body;

    // validator
    if (
      !validateEmail(email) ||
      !validatePassword(password) ||
      location.length == 0 ||
      phoneNumber.length == 0 ||
      !role
    ) {
        console.log('dfdfdf');
        
      return Response.json(
        {
          error: "Invalid form data",
        },
        { status: 400 }
      );
    }

    // hash the password
    const hash = bycrypt.hashSync(password, 8);

    // create user
    const user = await prisma.user.create({
      data: {
        email: email,
        password: hash,
        location: location,
        phone: phoneNumber,
        role: role,
        status: "ACTIVE"
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.log("SIGNUP]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
