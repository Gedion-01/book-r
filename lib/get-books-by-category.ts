import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function getBooksCountByCategoryForUser(userId: string) {
  // Fetch the count of books per category and their names for the specific user
  const booksCountByCategory = await prisma.book.findMany({
    where: { ownerId: userId },
    select: {
      category: {
        select: {
          id: true,
          name: true
        }
      }
    }
  });

  // Aggregate the counts by category
  const categoryCounts = booksCountByCategory.reduce((acc, book) => {
    const categoryName = book.category.name as string;
    if (categoryName) {
      acc[categoryName] = (acc[categoryName] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  return Object.entries(categoryCounts).map(([categoryName, bookCount]) => ({
    label: categoryName,
    value: bookCount
  }));
}

// Call the function with the logged-in user's ID
const loggedInUserId = 'USER_ID_HERE'; // Replace with actual user ID
getBooksCountByCategoryForUser(loggedInUserId).then(data => console.log(data));
