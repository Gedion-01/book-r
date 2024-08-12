import prisma from "@/lib/prisma";

export const fetchBooks = async () => {
  try {
    const books = await prisma.book.findMany({
      where: {
        isApproved: true,
        owner: {
          isApproved: true,
          status: {
            not: "DISABLED",
          },
        },
      },
      include: {
        owner: {
          select: {
            isApproved: true,
            status: true,
          },
        },
        category: {
          select: {
            name: true,
          },
        },
        copies: {
          select: {
            status: true,
          },
        },
      },
    });

    const booksWithAvailableQuantity = books.map((book) => ({
      ...book,
      availableQuantity: book.copies.filter((copy) => copy.status === "FREE")
        .length,
    }));

    return booksWithAvailableQuantity;
  } catch (error) {
    console.error("Error fetching books:", error);

    throw new Error("Failed to fetch books");
  }
};
