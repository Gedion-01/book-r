import getUserId from "@/lib/auth";
import { defineAbilitiesFor } from "@/lib/casl-ability";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

interface Formdata {
  toBeUpdatedBookId: string;
  isApproved: boolean;
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();

    console.log(body);

    const { toBeUpdatedBookId, isApproved } = <Formdata>body;

    if (!toBeUpdatedBookId) {
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

    if (!ability.can("manage", "Book")) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const bookS = await prisma.book.update({
      where: {
        id: toBeUpdatedBookId,
      },
      data: {
        isApproved: isApproved,
      },
    });

    return NextResponse.json(
      {
        bookId: toBeUpdatedBookId,
        isApproved: bookS.isApproved,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error Approving user status:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
