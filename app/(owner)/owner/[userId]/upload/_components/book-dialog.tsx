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

import { Book } from "@prisma/client";

interface FormDialogProps {
  options: { label: string; value: string }[];
  books: Book[];
}

// Define the Zod schema
const formSchema = z.object({
  bookTitle: z.string().min(1, "Book Name is required"),
  authorName: z.string().min(1, "Author Name is required"),
  bookCategoryId: z.string().min(1, "Category is required"),
});

export default function FormDialog({ options, books }: FormDialogProps) {
  const { addBook, book } = useStore();
  const { openDialog, setOpenDialog } = useStore();
  const [selectedOption, setSelectedOption] = React.useState("");
  const [errors, setErrors] = React.useState<{ [key: string]: string }>({});

  React.useEffect(() => {
    // Set the selectedOption if book exists and bookCategoryId is available
    if (book?.bookCategoryId) {
      setSelectedOption(book.bookCategoryId);
    }
  }, [book]);

  const handleClose = () => {
    setOpenDialog(false);
  };

  const handleChange = (event: any) => {
    setSelectedOption(event.target.value as string);
    addBook({ ...book!, bookCategoryId: event.target.value });
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const formJson = Object.fromEntries(formData.entries());

    // Validate the form data using Zod
    const result = formSchema.safeParse({
      bookTitle: formJson.bookTitle,
      authorName: formJson.authorName,
      bookCategoryId: formJson.bookCategoryId,
    });

    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      setErrors(fieldErrors);
      return;
    }

    // If validation passes, handle the form submission
    console.log(result.data);
    addBook({ bookId: book?.bookId, ...result.data });
    handleClose();
  };
  console.log(book);

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
            id="bookTitle"
            name="bookTitle"
            label="Book Name"
            variant="filled"
            fullWidth
            sx={{ marginBottom: "20px" }}
            error={!!errors.bookTitle}
            helperText={errors.bookTitle}
            value={book?.bookTitle}
            onChange={(e) => addBook({ ...book!, bookTitle: e.target.value })}
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
            value={book?.authorName}
            onChange={(e) => addBook({ ...book!, authorName: e.target.value })}
          />
          <FormControl variant="filled" fullWidth error={!!errors.category}>
            <InputLabel id="demo-simple-select-filled-label">
              Category
            </InputLabel>
            <Select
              labelId="demo-simple-select-filled-label"
              id="demo-simple-select-filled"
              name="bookCategoryId"
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
            {errors.bookCategoryId && (
              <p style={{ color: "red" }}>{errors.bookCategoryId}</p>
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
