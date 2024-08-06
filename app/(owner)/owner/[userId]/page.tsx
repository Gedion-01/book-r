import { verifyAuth } from "@/lib/auth";
import { defineAbilitiesFor } from "@/lib/casl-ability";
import { redirect } from "next/navigation";
import Sidebar from "./_components/sidebar";
import Navbar from "./_components/navbar";
import LiveBookStatus from "./_components/live-book-status";
import prisma from "@/lib/prisma";
import EarningSummaryChart from "./_components/earnimg-summary";
import PieChartWithCenterLabel from "./_components/available-books";
import { getBooksByCategory, getBooksCountByCategoryForUser } from "@/lib/get-books-by-category";

export default async function OwnerPage({
  params,
}: {
  params: { userId: string };
}) {
  const userPayload = await verifyAuth(params.userId);

  if (!userPayload) {
    return redirect("/owner");
  }

  const ability = defineAbilitiesFor(userPayload.role, {
    userId: userPayload.id,
  });

  if (!ability.can("manage", "Book")) {
    return redirect("/owner");
  }

  const books = await prisma.book.findMany({
    where: {
      ownerId: userPayload.id,
    },
  });

  const data = await getBooksCountByCategoryForUser(userPayload.id);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 h-full">
        {/* <!-- Stats Card --> */}
        <div className="">
          <div className="bg-white p-4 rounded shadow-md h-full">
            <h3 className="text-xl font-semibold">This Month Statistics</h3>
            <h3 className="text-sm font-thin">Tue, 14 Nov, 2024, 11.30 AM </h3>
            <div className="w-full px-[15px] shadow-lg rounded-[15px] p-[24px] mt-[38px]">
              <div className="text-[#656575] flex flex-row justify-between border-b border-[#A3A3A3] mb-[29px] pb-[12px]">
                <div className="text-xl font-bold">Income</div>
                <div className="bg-[#F4F5F7] px-[8px] py-[4px]">This month</div>
              </div>

              <p className="text-2xl font-bold my-8">
                ETB 9460.00 <span className="text-red-600 text-sm">↓1.5%</span>
              </p>
              <p className="text-gray-500 mt-1">
                Compared to ETB8940 last month
              </p>
              <div className="text-[#656575] flex flex-row justify-between pb-[12px] mt-[8px]">
                <div className="text-xl font-bold">Last Month Income</div>
                <div className="">ETB 25658.00</div>
              </div>
            </div>
            <div className="col-span-1 bg-white shadow-lg rounded-[15px] p-[24px] mt-[38px]">
            <div className="text-[#656575] flex flex-row justify-between mb-[29px] pb-[12px]">
                <div className="text-xl font-bold">Available Books</div>
                <div className="bg-[#F4F5F7] px-[8px] py-[4px]">Today</div>
              </div>
            <div className="flex justify-center items-center">
              {/* <!-- Placeholder for chart --> */}
              <PieChartWithCenterLabel data={data} />
            </div>
          </div>
          </div>
         
        </div>
        <div className="col-span-2 flex flex-col gap-4">
          {/* <!-- Live Book Status --> */}
          <LiveBookStatus books={books} />

          {/* <!-- Additional Content --> */}

          <div className="col-span-2 bg-white p-4 rounded shadow-md">
            <h3 className="text-xl font-semibold">Earning Summary</h3>
            <div className="flex justify-center items-center">
              {/* <!-- Placeholder for graph --> */}
              <EarningSummaryChart />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
