import getUserId, { verifyAuth } from "@/lib/auth";
import { defineAbilitiesFor } from "@/lib/casl-ability";
import prisma from "@/lib/prisma";
import { ForbiddenError } from "@casl/ability";
import { Book } from "@prisma/client";
import { NextResponse } from "next/server";

interface FormData {
  bookId?: string;
  bookTitle: string;
  authorName: string;
  bookCategoryId: string;
  bookQuantity: number;
  rentPrice: number;
  bookCoverImageUrl: string;
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    console.log(body);

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

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    const { role } = user;
    const ability = defineAbilitiesFor(role, { userId });

    const {
      bookId,
      bookTitle,
      authorName,
      bookCategoryId,
      bookQuantity,
      rentPrice,
      bookCoverImageUrl,
    } = <FormData>body;

    // validator
    if (
      !bookTitle ||
      !authorName ||
      !bookCategoryId ||
      !bookQuantity ||
      !rentPrice ||
      !bookCoverImageUrl
    ) {
      return Response.json(
        {
          error: "Invalid form data",
        },
        { status: 400 }
      );
    }

    // check if a book exists
    if (bookId) {
      const exitingBook = await prisma.book.findUnique({
        where: {
          id: bookId,
        },
      });
      if (exitingBook) {
        ForbiddenError.from(ability).throwUnlessCan("update", "Book");

        const updatedBook = await prisma.$transaction(async (prisma) => {
          // Update the book details
          const book = await prisma.book.update({
            where: {
              id: exitingBook.id,
            },
            data: {
              title: bookTitle,
              author: authorName,
              quantity: Number(bookQuantity),
              status: "FREE",
              ownerId: userId,
              rentPrice: Number(rentPrice),
              bookImageUrl: bookCoverImageUrl,
              categoryId: bookCategoryId,
            },
          });

          // Get the current number of copies
          const currentCopiesCount = await prisma.bookCopy.count({
            where: {
              bookId: exitingBook.id,
            },
          });

          const newQuantity = Number(bookQuantity);

          if (newQuantity > currentCopiesCount) {
            // Create additional copies
            const copiesToCreate = newQuantity - currentCopiesCount;
            await prisma.bookCopy.createMany({
              data: Array.from({ length: copiesToCreate }, () => ({
                bookId: exitingBook.id,
                status: "FREE",
              })),
            });
          } else if (newQuantity < currentCopiesCount) {
            // Delete excess copies
            const copiesToDelete = currentCopiesCount - newQuantity;
            const copies = await prisma.bookCopy.findMany({
              where: {
                bookId: exitingBook.id,
                status: "FREE",
              },
              take: copiesToDelete,
            });

            const copyIdsToDelete = copies.map((copy) => copy.id);

            await prisma.bookCopy.deleteMany({
              where: {
                id: {
                  in: copyIdsToDelete,
                },
              },
            });
          }

          return book;
        });

        return NextResponse.json("Book updated successfully", { status: 200 });
      }
    }
    ForbiddenError.from(ability).throwUnlessCan("update", "Book");
    // create book
    const book = await prisma.book.create({
      data: {
        title: bookTitle,
        author: authorName,
        quantity: Number(bookQuantity),
        status: "FREE",
        ownerId: userId,
        rentPrice: Number(rentPrice),
        bookImageUrl: bookCoverImageUrl,
        categoryId: bookCategoryId,
        copies: {
          create: Array.from({ length: bookQuantity }, () => ({})),
        },
      },
    });

    return NextResponse.json("Book created successfully", { status: 201 });
  } catch (error) {
    console.log("NEW_BOOK]", error);
    if (error instanceof ForbiddenError) {
      return new NextResponse("Forbidden", { status: 403 });
    }
    return new NextResponse("Internal Error", { status: 500 });
  }
}
