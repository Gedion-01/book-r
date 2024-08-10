import getUserId from "@/lib/auth";
import { defineAbilitiesFor } from "@/lib/casl-ability";
import prisma from "@/lib/prisma";
import { UserStatus } from "@prisma/client";
import { NextResponse } from "next/server";

interface Formdata {
  toBeUpdatedUserId: string;
  userStatus: UserStatus;
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();

    console.log(body);

    const { toBeUpdatedUserId, userStatus } = <Formdata>body;

    if (!userStatus) {
      return NextResponse.json(
        {
          error: "Invalid form data",
        },
        { status: 400 }
      );
    }

    const userId = await getUserId();

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true },
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const { role } = user;
    const ability = defineAbilitiesFor(role, { userId });

    if (!ability.can("manage", "User")) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const userS = await prisma.user.update({
      where: {
        id: toBeUpdatedUserId,
      },
      data: {
        status: userStatus, // Use the provided userStatus
      },
    });

    return NextResponse.json(
      {
        userId: toBeUpdatedUserId,
        status: userS.status,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating user status:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
