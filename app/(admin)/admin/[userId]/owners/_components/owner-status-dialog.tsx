"use client";

import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";

interface OwnerStatusDialogProps {
  email: string;
  location: string;
  phone: string;
  open: boolean;
  setOpen: (open: boolean) => void;
}

export function OwnerStatusDialog({
  email,
  location,
  phone,
  open,
  setOpen,
}: OwnerStatusDialogProps) {
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: "form",
          sx: {
            borderRadius: "20px", // Apply border radius here
          },
        }}
      >
        <DialogContent sx={{ padding: "50px" }}>
          <TextField
            id="email"
            label="Email"
            fullWidth
            sx={{ marginBottom: "20px" }}
            value={email}
          />
          <TextField
            id="location"
            label="Location"
            fullWidth
            sx={{ marginBottom: "20px" }}
            value={location}
          />
          <TextField
            id="Phone"
            label="Phone Number"
            fullWidth
            sx={{ marginBottom: "20px" }}
            value={phone}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
