"use client";

import React, { useState } from "react";
import { Box, Drawer, IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SideBarItem from "./link-items";
import Image from "next/image";
import LogInAsBookOwner from "./login-as-book-owner";
import LogOutButton from "./logout-button";

interface SidebarProps {
  userId: string;
}

export function SidebarMobile({ userId }: SidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const onClose = () => {
    setMobileOpen(false);
  };

  return (
    <>
      <IconButton
        color="inherit"
        aria-label="open drawer"
        edge="start"
        onClick={handleDrawerToggle}
        sx={{ display: { md: "none" } }}
      >
        <MenuIcon />
      </IconButton>
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": { boxSizing: "border-box", width: "279px" },
        }}
      >
        <Box
          sx={{
            display: "flex",
            height: "100%",
            flexDirection: "column",
            width: "279px",
            backgroundColor: "#171B36",
            color: "white",
            padding: "16px",
            gap: "16px",
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
              <Box onClick={onClose}>
                <SideBarItem
                  title="Dashboard"
                  path={`/admin/${userId}`}
                  image="https://res.cloudinary.com/dcrldqkrc/image/upload/v1723064603/dashboard_gtmb3w.svg"
                />
              </Box>
              <Box onClick={onClose}>
                <SideBarItem
                  title="Books"
                  path={`/admin/${userId}/books`}
                  image="https://res.cloudinary.com/dcrldqkrc/image/upload/v1723064603/book_qmx3vj.svg"
                />
              </Box>
              <Box onClick={onClose}>
                <SideBarItem
                  title="Owners"
                  path={`/admin/${userId}/owners`}
                  image="https://res.cloudinary.com/dcrldqkrc/image/upload/v1723198704/Book-R/qwwnaklc218ry0yawloz.svg"
                />
              </Box>
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
              <LogInAsBookOwner redirect="/owner" />
            </Box>
          </Box>
          <LogOutButton redirect="/admin" />
        </Box>
      </Drawer>
    </>
  );
}
