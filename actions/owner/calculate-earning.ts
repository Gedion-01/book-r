import prisma from "@/lib/prisma";

export async function calculateEarnings(ownerId: string) {
  try {
    const transactions = await prisma.transaction.findMany({
      where: {
        book: {
          ownerId: ownerId,
        },
      },
      select: {
        price: true,
      },
    });

    const totalEarnings = transactions.reduce(
      (sum, transaction) => sum + transaction.price,
      0
    );

    return totalEarnings;
  } catch (error) {
    console.error("Error calculating earnings:", error);
    throw error;
  }
}