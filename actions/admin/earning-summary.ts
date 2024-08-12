import prisma from "@/lib/prisma";

export async function earningSummary() {
  try {
    const earnings = await prisma.transaction.findMany({
      select: {
        rentedAt: true,
        price: true,
      },
    });
    const currentYear = new Date().getFullYear();

    const data = earnings.map((earning) => {
      const earningYear = earning.rentedAt
        ? earning.rentedAt.getFullYear()
        : null;
      return {
        month: earning.rentedAt
          ? earning.rentedAt.toLocaleString("default", { month: "short" })
          : "Unknown",
        thisYear: earningYear === currentYear ? earning.price : 0,
        lastYear: earningYear === currentYear - 1 ? earning.price : 0,
      };
    });

    return data;
  } catch (error) {
    console.error("Error calculating summary:", error);
    throw error;
  }
}
