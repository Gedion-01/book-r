import getUserId from "@/lib/auth";
import { defineAbilitiesFor } from "@/lib/casl-ability";
import prisma from "@/lib/prisma";
import { ForbiddenError } from "@casl/ability";
import { NextResponse } from "next/server";

export async function DELETE(
  request: Request,
  {
    params,
  }: {
    params: {
      bookId: string;
    };
  }
) {
  try {
    const userId = await getUserId();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: { role: true },
    });

    console.log("user", user);
    

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    const { role } = user;
    const ability = defineAbilitiesFor(role, { userId });

    const book = await prisma.book.findUnique({
      where: {
        id: params.bookId,
        ownerId: userId,
      },
    });

    if (!book) {
      return new NextResponse("Book not found", { status: 404 });
    }

    ForbiddenError.from(ability).throwUnlessCan("update", "Book");

    const deletedBook = await prisma.book.delete({
      where: {
        id: params.bookId,
      },
    });

    return NextResponse.json(deletedBook);
  } catch (error) {
    console.log("DELETE_BOOK]", error);
    if (error instanceof ForbiddenError) {
      return new NextResponse("Forbidden", { status: 403 });
    }
    return new NextResponse("Internal Error", { status: 500 });
  }
}
