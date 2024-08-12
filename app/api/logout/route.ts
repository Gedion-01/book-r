import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function DELETE(request: Request) {
  try {
    cookies().set("Authorization", "", {
      secure: true,
      httpOnly: true,
      path: "/",
      sameSite: "strict",
      expires: new Date(0),
    });

    return NextResponse.json({ message: "Logged out successfully" });
  } catch (error) {
    console.log("LOGOUT]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
