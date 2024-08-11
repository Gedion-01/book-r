import prisma from "@/lib/prisma";

export const fetchRentedBooks = async (userId: string) => {
  try {
    const books = await prisma.book.findMany({
        where: {
          copies: {
            some: {
              status: "RENTED",
            },
          },
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
  
      // Calculate the available quantity for each book
      const booksWithAvailableQuantity = books.map(book => ({
        ...book,
        rentedQuantity: book.copies.filter(copy => copy.status === "RENTED").length,
      }));
  
      return booksWithAvailableQuantity;
  } catch (error) {
    console.error('Error fetching rented books:', error);
    throw new Error('Internal server error');
  }
};