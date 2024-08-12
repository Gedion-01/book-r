import getUserId from "@/lib/auth";
import { defineAbilitiesFor } from "@/lib/casl-ability";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { BookStatus } from "@prisma/client";

export async function GET(request: Request) {
  try {
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

    if (!ability.can("read", "Book")) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);

    const page = parseInt(searchParams.get("page") || "0", 10);
    const size = parseInt(searchParams.get("size") || "10", 10);
    const sort = searchParams.get("sort") || "title";
    const filter = searchParams.get("filter") || "";

    console.log("page", page, "size", size, "sort", sort, "filter", filter);

    const validSortFields = [
      "id",
      "title",
      "author",
      "quantity",
      "status",
      "ownerId",
      "rentPrice",
      "bookImageUrl",
      "isApproved",
      "createdAt",
      "categoryId",
      "updatedAt",
    ];

    let orderBy = [];
    try {
      const sortArray = JSON.parse(sort);
      orderBy = sortArray
        .filter((sortItem: any) => validSortFields.includes(sortItem.id))
        .map((sortItem: any) => ({
          [sortItem.id]: sortItem.desc ? "desc" : "asc",
        }));
    } catch (error) {
      console.error("Error parsing sort parameter:", error);
      orderBy = [{ title: "asc" }];
    }

    console.log("orderBy", orderBy);

    const books = await prisma.book.findMany({
      where: {
        OR: [
          { title: { contains: filter, mode: "insensitive" } },
          { author: { contains: filter, mode: "insensitive" } },
          { owner: { email: { contains: filter, mode: "insensitive" } } },
          { category: { name: { contains: filter, mode: "insensitive" } } },
        ],
      },
      orderBy,
      skip: page * size,
      take: size,
      select: {
        id: true,
        ownerId: true,
        title: true,
        rentPrice: true,
        quantity: true,
        bookImageUrl: true,
        author: true,
        categoryId: true,
        isApproved: true,
        category: {
          select: {
            name: true,
          },
        },

        copies: {
          select: {
            id: true,
            status: true,
          },
        },
        owner: {
          select: {
            email: true,
          },
        },
      },
    });

    const totalBooks = await prisma.book.count({
      where: {
        OR: [
          { title: { contains: filter, mode: "insensitive" } },
          { author: { contains: filter, mode: "insensitive" } },
          { owner: { email: { contains: filter, mode: "insensitive" } } },
          { category: { name: { contains: filter, mode: "insensitive" } } },
        ],
      },
    });
    // Format the response to flatten the copies into the main object

    const formattedBooks = books
      .map((book) =>
        book.copies.map((copy) => ({
          id: book.id,
          ownerId: book.ownerId,
          title: book.title,
          rentPrice: book.rentPrice,
          copyId: copy.id,
          status: copy.status,
          email: book.owner.email,
          book: book,
          owner: book.owner.email,
          category: book.category?.name,
          BookStatus: book.isApproved,
          author: book.author,
        }))
      )
      .flat();

    return NextResponse.json({ books: formattedBooks, totalBooks });
  } catch (error) {
    console.error("Error fetching books:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
