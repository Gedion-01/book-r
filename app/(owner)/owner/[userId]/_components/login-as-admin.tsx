"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { Box, Button } from "@mui/material";
import { useState } from "react";
import toast from "react-hot-toast";
import Image from "next/image";

interface LogOutButtonProps {
  redirect: string;
}

export default function LogInAsAdmin({ redirect }: LogOutButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const logout = async () => {
    try {
      setIsLoading(true);
      const response = await axios.delete("/api/logout");
      router.push(redirect);
    } catch (error) {
      console.error("Error logging out:", error);
      toast.error("Error logging out try again later");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
      <Box sx={{ mt: "auto" }}>
        <Button
          disabled={isLoading}
          onClick={logout}
          variant="contained"
          color="primary"
          fullWidth
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-start",
            backgroundColor: "transparent",
            opacity: 0.75,
            "&:hover": {
              backgroundColor: "#00ABFF",
              opacity: 1,
            },
            boxShadow: "none",
            textTransform: "none",
            fontWeight: 500,
            textSize: "18px",
            height: "48px",

            paddingY: "10px",
            paddingX: "15px",
            gap: "16px",
            borderRadius: "4px",
          }}
        >
          <Image
            src="https://res.cloudinary.com/dcrldqkrc/image/upload/v1723064603/account_jqwxtr.svg"
            alt="icon"
            width={24}
            height={24}
          />
          Log in as Admin
        </Button>
      </Box>
    </>
  );
}
