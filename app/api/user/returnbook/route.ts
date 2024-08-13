import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { defineAbilitiesFor } from "@/lib/casl-ability";
import { ForbiddenError } from "@casl/ability";
import getUserId from "@/lib/auth";

export async function POST(request: NextRequest) {
  const { userId, bookId, quantity } = await request.json();

  if (!userId || !bookId || !quantity || quantity <= 0) {
    return NextResponse.json(
      { message: "Missing or invalid userId, bookId, or quantity" },
      { status: 400 }
    );
  }

  try {
    const myId = await getUserId();

    if (!myId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: {
        id: myId,
      },
      select: { role: true },
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }
    const { role } = user;
    const ability = defineAbilitiesFor(role, { userId });

    ForbiddenError.from(ability).throwUnlessCan("create", "Transaction");

    // Check if the book exists
    const book = await prisma.book.findUnique({
      where: { id: bookId },
    });

    if (!book) {
      return NextResponse.json(
        { message: "Book does not exist" },
        { status: 404 }
      );
    }

    // Find the rented copies to be returned
    const rentedCopies = await prisma.bookCopy.findMany({
      where: {
        bookId: bookId,
        rentedById: userId,
        status: "RENTED",
      },
      take: quantity,
    });

    if (rentedCopies.length < quantity) {
      return NextResponse.json(
        { message: "Not enough rented copies found" },
        { status: 400 }
      );
    }

    // Update the status of the book copies to FREE
    await prisma.$transaction(
      rentedCopies.map((copy) =>
        prisma.bookCopy.update({
          where: { id: copy.id },
          data: {
            status: "FREE",
            rentedById: null,
          },
        })
      )
    );

    // Check if a transaction already exists
    const existingTransaction = await prisma.transaction.findFirst({
      where: {
        bookId: bookId,
        userId: userId,
        type: "RENT",
      },
    });

    if (existingTransaction) {
      const updatedTransaction = await prisma.transaction.update({
        where: {
          id: existingTransaction.id,
        },
        data: {
          returnedAt: new Date(),
        },
      });

      return NextResponse.json(
        {
          message: "Books returned successfully",
          transaction: updatedTransaction,
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { message: "No rental transaction found for this user and book" },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error("Error returning books:", error);
    if (error instanceof ForbiddenError) {
      return new NextResponse("Forbidden", { status: 403 });
    }
    return new NextResponse("Internal Error", { status: 500 });
  }
}
