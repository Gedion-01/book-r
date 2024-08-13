import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { defineAbilitiesFor } from "@/lib/casl-ability";
import getUserId from "@/lib/auth";
import { ForbiddenError } from "@casl/ability";

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

    // Check how many free copies are available
    const freeCopies = await prisma.bookCopy.findMany({
      where: {
        bookId: bookId,
        status: "FREE",
      },
    });

    const totalAvailableCopies = freeCopies.length;

    console.log("Requested quantity:", quantity);
    console.log("Total available copies:", totalAvailableCopies);

    if (quantity > totalAvailableCopies) {
      return NextResponse.json(
        { message: "Not enough free copies available" },
        { status: 400 }
      );
    }

    // Update the status of the book copies to RENTED
    const rentedCopies = await prisma.$transaction(
      freeCopies.slice(0, quantity).map((copy) =>
        prisma.bookCopy.update({
          where: { id: copy.id },
          data: {
            status: "RENTED",
            rentedById: userId,
          },
        })
      )
    );

    // Check if a transaction already exists
    const existingTransaction = await prisma.transaction.findFirst({
      where: {
        bookId: bookId,
        userId: userId,
      },
    });

    let transaction;
    if (existingTransaction) {
      // Update the existing transaction
      transaction = await prisma.transaction.update({
        where: {
          id: existingTransaction.id,
        },
        data: {
          price: existingTransaction.price + book.rentPrice * quantity,
        },
      });
    } else {
      // Create new transaction record
      transaction = await prisma.transaction.create({
        data: {
          type: "RENT",
          bookId: bookId,
          userId: userId,
          price: book.rentPrice * quantity,
        },
      });
    }

    return NextResponse.json(
      { message: "Books rented successfully", transaction },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error renting books:", error);
    if (error instanceof ForbiddenError) {
      return new NextResponse("Forbidden", { status: 403 });
    }
    return new NextResponse("Internal Error", { status: 500 });
  }
}
