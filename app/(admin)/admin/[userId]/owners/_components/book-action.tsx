"use client";

import { Box, Button, IconButton } from "@mui/material";
import { red } from "@mui/material/colors";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import { Book } from "@prisma/client";

import { useStore } from "@/store/store";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { DeleteDialog } from "./delete-dialog";
import axios from "axios";
import toast from "react-hot-toast";

interface BookTableProps {
  userId: string;
  isApproved: boolean;
}

export default function BookAction({ userId, isApproved }: BookTableProps) {
  const { addBook, toggleRefresh } = useStore();

  const [isLoading, setIsLoading] = useState(false);

  const [open, setOpen] = useState(false);
  const [bookId, setBookId] = useState("");

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  async function onClick(isApproved: boolean) {
    try {
      setIsLoading(true);
      const res = await axios.patch("/api/admin/approvebookowner", {
        toBeUpdatedUserId: userId,
        isApproved: isApproved,
      });
      console.log(res.data);
      if (res.data.isApproved === true) {
        toast.error("Owner disapproved");
      } else {
        toast.success("Owner approved");
      }
      toggleRefresh();
    } catch (error) {
      toast.error("An error has occured");
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
      }}
    >
      <Box>
        <IconButton aria-label="edit">
          <VisibilityIcon
            sx={{
              color: "black",
            }}
          />
        </IconButton>
        <IconButton aria-label="delete" onClick={handleClickOpen}>
          <DeleteIcon
            sx={{
              color: red[500],
            }}
          />
        </IconButton>
      </Box>
      <DeleteDialog open={open} handleClose={handleClose} bookId={""} />
      {isApproved ? (
        <Button
          disabled={isLoading}
          onClick={() => onClick(isApproved)}
          sx={{
            bgcolor: "rgba(0, 171, 255, 1)",
            "&:hover": {
              bgcolor: "rgba(0, 171, 255, 0.8)",
            },
            color: "white",
            padding: "4px 16px",
            fontWeight: 400,
            borderRadius: "4px",
            textTransform: "none",
          }}
        >
          Approved
        </Button>
      ) : (
        <Button
          disabled={isLoading}
          onClick={() => onClick(isApproved)}
          sx={{
            bgcolor: "rgba(175, 175, 175, 1)",
            "&:hover": {
              bgcolor: "rgba(175, 175, 175, 0.8)",
            },
            color: "white",
            padding: "4px 16px",
            fontWeight: 400,
            borderRadius: "4px",
            textTransform: "none",
          }}
        >
          Approve
        </Button>
      )}
    </Box>
  );
}
