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
        <div className="">
          <div className="bg-white rounded shadow-md h-full">
            <Box component="div" sx={{ paddingTop: "32px", paddingX: "15px" }}>
              <Typography
                sx={{
                  fontSize: "20px",
                  fontWeight: "500",
                  color: "#525256",
                }}
              >
                This Month Statistics
              </Typography>
              <Typography
                sx={{
                  color: "#A3A3A3",
                  fontSize: "14px",
                  fontWeight: "400",
                }}
              >
                {" "}
                Tue, 14 Nov, 2024, 11.30 AM
              </Typography>
            </Box>
            <Box
              component={"div"}
              sx={{
                paddingTop: "38px",
                paddingX: "15px",
              }}
            >
              <Box
                component={"div"}
                sx={{
                  padding: "24px",
                  boxShadow: "0px 8px 24px rgba(69, 69, 80, 0.2)",
                  borderRadius: "8px",
                }}
              >
                <Box
                  component={"div"}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    height: "36px",
                    borderBottom: "1px solid rgba(163, 163, 163, 0.2)",
                    paddingBottom: "12px",
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: "18px",
                      fontWeight: "500",
                      color: "#525256",
                    }}
                  >
                    Income
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: "12px",
                      fontWeight: "400",
                      color: "#525256",
                      paddingX: "8px",
                      paddingY: "4px",
                      bgcolor: "#F4F5F7",
                      borderRadius: "2px",
                    }}
                  >
                    This Month
                  </Typography>
                </Box>
                <Box
                  component={"div"}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    marginTop: "24px",
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: "28px",
                      fontWeight: "700",
                      color: "#01150C",
                      display: "inline",
                      lineHeight: "40px",
                    }}
                  >
                    ETB 9460.00
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: "16px",
                      fontWeight: "500",
                      color: "#FF2727",
                      lineHeight: "28px",
                      letterSpacing: "-0.9%",
                      marginTop: "12px",
                      marginLeft: "4px",
                    }}
                  >
                    ↓ 1.5%
                  </Typography>
                </Box>
                <Box
                  component={"div"}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    marginTop: "8px",
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: "14px",
                      fontWeight: "300",
                      color: "#656575",
                      lineHeight: "24px",
                    }}
                  >
                    Compared to ETB9940 last month
                  </Typography>

                  <Box
                    component={"div"}
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: "14px",
                        fontWeight: "700",
                        color: "#525256",
                        lineHeight: "24px",
                      }}
                    >
                      Last Month Income
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: "14px",
                        fontWeight: "700",
                        color: "#525256",
                        lineHeight: "24px",
                        marginTop: "2px",
                      }}
                    >
                      ETB 25658.00
                    </Typography>
                  </Box>
                </Box>
              </Box>
              <Box
                component={"div"}
                sx={{
                  padding: "24px",
                  boxShadow: "0px 8px 24px rgba(69, 69, 80, 0.2)",
                  borderRadius: "8px",
                  marginTop: "38px",
                }}
              >
                <Box
                  component={"div"}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    height: "36px",
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: "18px",
                      fontWeight: "500",
                      color: "#525256",
                    }}
                  >
                    Available Books
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: "12px",
                      fontWeight: "400",
                      color: "#525256",
                      paddingX: "8px",
                      paddingY: "4px",
                      bgcolor: "#F4F5F7",
                      borderRadius: "2px",
                    }}
                  >
                    Today
                  </Typography>
                </Box>
                <Box
                  component={"div"}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    marginTop: "30px",
                  }}
                >
                  <PieChartWithCenterLabel data={data!} />
                </Box>
              </Box>
            </Box>
          </div>
        </div>
        <div className="col-span-2 flex flex-col gap-4">
          {/* <!-- Live Book Status --> */}
          <Box sx={{ backgroundColor: "rgba(255, 255, 255, 1)" }}>
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
