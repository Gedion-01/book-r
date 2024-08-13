"use client";

import axios from "axios";
import { useState } from "react";

import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import toast from "react-hot-toast";
import { usePathname, useRouter } from "next/navigation";
import { useStore } from "@/store/store";

interface AlertDialogProps {
  open: boolean;
  handleClose: () => void;
  userId: string;
}

export function DeleteDialog({ open, handleClose, userId }: AlertDialogProps) {
  const { toggleRefresh } = useStore();

  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async (bookId: string) => {
    try {
      setIsDeleting(true);
      
      const res = await axios.delete(`/api/admin/deleteuser/${userId}`);
      toast.success("User deleted successfully");
      router.refresh();
      toggleRefresh();
    } catch (error) {
      toast.error("An error has occurred, please try again");
      console.log(error);
    } finally {
      setIsDeleting(false);
      handleClose();
    }
  };

  return (
    <React.Fragment>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        sx={{}}
      >
        <DialogTitle id="alert-dialog-title">
          Are you sure you want to delete this user?
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            This action cannot be undone
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={isDeleting}>
            Cancel
          </Button>
          <Button
            onClick={() => handleDelete(userId)}
            autoFocus
            disabled={isDeleting}
          >
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
