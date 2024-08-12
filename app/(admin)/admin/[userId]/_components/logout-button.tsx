"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { Box, Button } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import { useState } from "react";
import toast from "react-hot-toast";

interface LogOutButtonProps {
  redirect: string;
}

export default function LogOutButton({ redirect }: LogOutButtonProps) {
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
          startIcon={<LogoutIcon />}
          sx={{
            backgroundColor: "rgba(255, 255, 255, 0.2)",
            py: 2,
            px: 3,
            borderRadius: 1,
            textTransform: "none",
            fontWeight: 500,
            textSize: "18px",
            height: "48px",
          }}
        >
          Logout
        </Button>
      </Box>
    </>
  );
}
