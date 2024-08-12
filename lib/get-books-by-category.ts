import { Role } from "@prisma/client";
import prisma from "./prisma";

export async function getBooksCountByCategoryForUser(
  userId: string,
  role: Role
) {
  // Define the query condition based on the role
  if (role === "ADMIN") {
    // Fetch the count of books per category and their names for the specific user
    const booksCountByCategory = await prisma.book.findMany({
      select: {
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    // Aggregate the counts by category
    const categoryCounts = booksCountByCategory.reduce((acc, book) => {
      if (book.category) {
        const categoryName = book.category.name as string;
        acc[categoryName] = (acc[categoryName] || 0) + 1;
      }

      return acc;
    }, {} as Record<string, number>);

    return Object.entries(categoryCounts).map(([categoryName, bookCount]) => ({
      label: categoryName,
      value: bookCount,
    }));
  }
  if (role === "OWNER") {
    // Fetch the count of books per category and their names for the specific user
    const booksCountByCategory = await prisma.book.findMany({
      where: { ownerId: userId },
      select: {
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    // Aggregate the counts by category
    const categoryCounts = booksCountByCategory.reduce((acc, book) => {
      if (book.category) {
        const categoryName = book.category.name as string;
        acc[categoryName] = (acc[categoryName] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(categoryCounts).map(([categoryName, bookCount]) => ({
      label: categoryName,
      value: bookCount,
    }));
  }
}
