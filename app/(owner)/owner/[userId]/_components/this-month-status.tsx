import { Box, Typography } from "@mui/material";
import PieChartWithCenterLabel from "./available-books";
import { Role } from "@prisma/client";
import { JWTPayload } from "jose";
import { getBooksCountByCategoryForUser } from "@/lib/get-books-by-category";
import PieChartCard from "@/components/av-books";

interface ThisMonthStatusProps {
  userPayload: {
    payload: JWTPayload;
    role: Role;
    id: string;
  };
}
export async function ThisMonthStatus({ userPayload }: ThisMonthStatusProps) {
  const data = await getBooksCountByCategoryForUser(
    userPayload.id,
    userPayload.role
  );
  return (
    <div className="col-span-2 lg:col-span-1 bg-white rounded-[14px] shadow-md h-full w-full">
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
          {/* <PieChartWithCenterLabel data={data!} /> */}
          <PieChartCard data={data!} />
        </Box>
      </Box>
    </div>
  );
}
