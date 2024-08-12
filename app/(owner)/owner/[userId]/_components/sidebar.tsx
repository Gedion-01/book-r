import { Box, ListItem } from "@mui/material";

import SideBarItem from "./link-items";
import Image from "next/image";
import LogOutButton from "./logout-button";
import LogInAsAdmin from "./login-as-admin";

interface PageProps {
  userId: string;
}

export default function Sidebar({ userId }: PageProps) {
  return (
    <Box
      sx={{
        display: { xs: "none", md: "flex" },
        flexDirection: "column",
        width: "279px",
        backgroundColor: "#171B36",
        color: "white",
        padding: "16px",
        gap: "16px",
        borderRadius: "15px",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "1.125rem", // equivalent to text-lg
          fontWeight: "bold",
          marginBottom: "16px", // equivalent to mb-4
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            gap: "16px", // equivalent to gap-4
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Box>
            <Image
              src={`https://res.cloudinary.com/dcrldqkrc/image/upload/v1723064604/logo_t87opg.svg`}
              alt="icon"
              width={38}
              height={22}
            />
          </Box>
          <h1 className="text-[#00ABFF]">Book Rent</h1>
        </Box>
      </Box>
      <Box sx={{ flex: 1 }}>
        <Box
          component="ul"
          sx={{
            borderTop: "1px solid rgba(248, 248, 248, 0.5)",
            borderBottom: "1px solid rgba(248, 248, 248, 0.5)",
            paddingY: "20px",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          <SideBarItem
            title="Dashboard"
            path={`/owner/${userId}`}
            image="https://res.cloudinary.com/dcrldqkrc/image/upload/v1723064603/dashboard_gtmb3w.svg"
          />

          <SideBarItem
            title="Book Upload"
            path={`/owner/${userId}/upload`}
            image="https://res.cloudinary.com/dcrldqkrc/image/upload/v1723064603/book_qmx3vj.svg"
          />
          <SideBarItem
            title="Other"
            path={``}
            image="https://res.cloudinary.com/dcrldqkrc/image/upload/v1723064603/other_wfyomr.svg"
          />
          <SideBarItem
            title="Other"
            path={``}
            image="https://res.cloudinary.com/dcrldqkrc/image/upload/v1723064603/other_wfyomr.svg"
          />
          <SideBarItem
            title="Other"
            path={``}
            image="https://res.cloudinary.com/dcrldqkrc/image/upload/v1723064603/other_wfyomr.svg"
          />
        </Box>
        <Box
          component="ul"
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            borderBottom: "1px solid rgba(248, 248, 248, 0.5)",
            paddingY: "20px",
          }}
        >
          <SideBarItem
            title="Notification"
            path={``}
            image="https://res.cloudinary.com/dcrldqkrc/image/upload/v1723064603/notification_pz1msc.svg"
          />
          <SideBarItem
            title="Setting"
            path={``}
            image="https://res.cloudinary.com/dcrldqkrc/image/upload/v1723064603/setting_anedf2.svg"
          />
          <LogInAsAdmin redirect="/admin" />
        </Box>
      </Box>
      <LogOutButton redirect="/owner" />
    </Box>
  );
}
