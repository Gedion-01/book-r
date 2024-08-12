import prisma from "@/lib/prisma";

export async function calculateEarnings() {
  try {
    const transactions = await prisma.transaction.findMany({
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
