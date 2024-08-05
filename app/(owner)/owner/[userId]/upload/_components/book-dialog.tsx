"use client";

import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { useStore } from "@/store/store";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { z } from "zod";

interface FormDialogProps {
  options: { label: string; value: string }[];
}

// Define the Zod schema
const formSchema = z.object({
  bookName: z.string().min(1, "Book Name is required"),
  authorName: z.string().min(1, "Author Name is required"),
  category: z.string().min(1, "Category is required"),
});

export default function FormDialog({ options }: FormDialogProps) {
  const { addBook, books } = useStore();
  const { openDialog, setOpenDialog } = useStore();
  const [selectedOption, setSelectedOption] = React.useState("");
  const [errors, setErrors] = React.useState<{ [key: string]: string }>({});

  const handleClose = () => {
    setOpenDialog(false);
  };

  const handleChange = (event: any) => {
    setSelectedOption(event.target.value as string);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const formJson = Object.fromEntries(formData.entries());

    // Validate the form data using Zod
    const result = formSchema.safeParse({
      bookName: formJson.bookName,
      authorName: formJson.authorName,
      category: formJson.category,
    });

    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      setErrors(fieldErrors);
      return;
    }

    // If validation passes, handle the form submission
    console.log(result.data);
    addBook(result.data);
    handleClose();
  };
  console.log(books);
  

  return (
    <React.Fragment>
      <Dialog
        open={openDialog}
        onClose={handleClose}
        PaperProps={{
          component: "form",
          onSubmit: handleSubmit,
        }}
        sx={{}}
      >
        <DialogTitle>Add Book</DialogTitle>
        <DialogContent sx={{}}>
          <TextField
            id="bookName"
            name="bookName"
            label="Book Name"
            variant="filled"
            fullWidth
            sx={{ marginBottom: "20px" }}
            error={!!errors.bookName}
            helperText={errors.bookName}
          />
          <TextField
            id="authorName"
            name="authorName"
            label="Author Name"
            variant="filled"
            fullWidth
            sx={{ marginBottom: "20px" }}
            error={!!errors.authorName}
            helperText={errors.authorName}
          />
          <FormControl variant="filled" fullWidth error={!!errors.category}>
            <InputLabel id="demo-simple-select-filled-label">
              Category
            </InputLabel>
            <Select
              labelId="demo-simple-select-filled-label"
              id="demo-simple-select-filled"
              name="category"
              value={selectedOption}
              onChange={handleChange}
              fullWidth
            >
              {options.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
            {errors.category && (
              <p style={{ color: "red" }}>{errors.category}</p>
            )}
          </FormControl>
        </DialogContent>
        <DialogActions sx={{ padding: "0px 20px 20px 20px" }}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{
              backgroundColor: "#00ABFF",
              "&:hover": {
                backgroundColor: "#00ABFF",
              },
              width: "100%",
              height: "69px",
            }}
            disabled={false}
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
