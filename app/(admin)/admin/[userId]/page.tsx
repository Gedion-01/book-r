import { verifyAuth } from "@/lib/auth";
import { defineAbilitiesFor } from "@/lib/casl-ability";
import { getBooksCountByCategoryForUser } from "@/lib/get-books-by-category";
import { redirect } from "next/navigation";
import { ThisMonthStatus } from "./_components/this-month-status";
import { Box } from "@mui/material";
import LiveBookStatus from "./_components/live-book-status";
import { earningSummary } from "@/actions/admin/earning-summary";
import EarningSummaryChart from "./_components/earnimg-summary";

export default async function OwnerPage({
  params,
}: {
  params: { userId: string };
}) {
  const userPayload = await verifyAuth(params.userId);
  if (!userPayload) {
    return redirect("/admin");
  }

  const ability = defineAbilitiesFor(userPayload.role, {
    userId: userPayload.id,
  });

  if (!ability.can("manage", "all")) {
    return redirect("/admin");
  }

  const data = await earningSummary();
  console.log(data);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 h-full">
      {/* <!-- Stats Card --> */}
      <ThisMonthStatus userPayload={userPayload} />
      <div className="col-span-2 flex flex-col gap-4">
        {/* <!-- Live Book Status --> */}
        <Box sx={{ backgroundColor: "rgba(255, 255, 255, 1)" }}>
          <LiveBookStatus />
        </Box>

        {/* <!-- Additional Content --> */}

        <div className="col-span-2 bg-white p-4 rounded-[14px] shadow-md">
          <div className="flex justify-center items-center">
            {/* <!-- Placeholder for graph --> */}
            <EarningSummaryChart
              data={data}
              title="Earning Summary"
              subtitle="Mar 2022 - Oct 2024"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
