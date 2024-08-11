import { verifyAuth } from "@/lib/auth";
import { defineAbilitiesFor } from "@/lib/casl-ability";
import { redirect } from "next/navigation";
import Sidebar from "./_components/sidebar";
import Navbar from "./_components/navbar";
import LiveBookStatus from "./_components/live-book-status";
import prisma from "@/lib/prisma";
import EarningSummaryChart from "./_components/earnimg-summary";
import PieChartWithCenterLabel from "./_components/available-books";
import { getBooksCountByCategoryForUser } from "@/lib/get-books-by-category";

import { Box, Divider, Typography } from "@mui/material";
import { red } from "@mui/material/colors";
import { ThisMonthStatus } from "./_components/this-month-status";

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

  const data = await getBooksCountByCategoryForUser(userPayload.id, userPayload.role);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 h-full">
        {/* <!-- Stats Card --> */}
        <ThisMonthStatus userPayload={userPayload} />
        <div className="col-span-2 flex flex-col gap-4">
          {/* <!-- Live Book Status --> */}
          <Box sx={{  }}>
            <LiveBookStatus userId={userPayload.id} />
          </Box>

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
