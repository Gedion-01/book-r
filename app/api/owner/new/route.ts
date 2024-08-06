import getUserId, { verifyAuth } from "@/lib/auth";
import prisma from "@/lib/prisma";
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
    const exitingBook = await prisma.book.findUnique({
      where: {
        id: bookId,
      },
    });
    // if book exists, update it
    if (exitingBook) {
      const updatedBook = await prisma.book.update({
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

      return NextResponse.json("Book updated successfully", { status: 200 });
    }

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
      },
    });

    return NextResponse.json("Book created successfully", { status: 201 });
  } catch (error) {
    console.log("BOOK]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
