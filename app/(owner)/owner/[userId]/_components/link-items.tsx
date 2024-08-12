"use client";

import { Box } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface ListItemsProps {
  title: string;
  path: string;
  image: string;
}

export default function SideBarItem({ title, path, image }: ListItemsProps) {
  const pathname = usePathname();
  return (
    <Link href={path}>
      <Box
        component="li"
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          paddingY: "10px",
          paddingX: "15px",
          gap: "16px",
          borderRadius: "4px",
          backgroundColor: pathname === path ? "#00ABFF" : "transparent",
          opacity: pathname === path ? 1 : 0.75,
          "&:hover": {
            backgroundColor: "#00ABFF",
            opacity: 1,
          },
          fontWeight: 500,
          fontSize: "14px",
          LineHeight: "16.94px",
        }}
      >
        <Box>
          <Image src={image} alt="icon" width={24} height={24} />
        </Box>
        <h1>{title}</h1>
      </Box>
    </Link>
  );
}
