"use client";

import * as React from "react";
import {
  TextField,
  List,
  ListItem,
  ListItemText,
  Button,
  Box,
} from "@mui/material";
import { useStore } from "@/store/store";
import FormDialog from "./book-dialog";
import Item from "./items";
import { SeparatorHorizontal } from "lucide-react";
import { Book } from "@prisma/client";

interface BookDialogProps {
  options: { label: string; value: string }[];
  books: Book[];
}

export default function BookSearch({ options, books }: BookDialogProps) {
  const { book, addBook } = useStore();
  const [showList, setShowList] = React.useState(false);
  const [timeoutId, setTimeoutId] = React.useState<NodeJS.Timeout | null>(null);
  const { setOpenDialog } = useStore();

  // Check if the `book` object exists in the `books` array
  const bookExists = books.some(
    (existingBook) => existingBook.id === book?.bookId
  );

  const handleFocus = () => {
    setShowList(true);
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  };

  const handleBlur = () => {
    // Set a timeout to hide the list after the user has had a chance to interact with it
    const id = setTimeout(() => setShowList(false), 150);
    setTimeoutId(id);
  };

  const handleListItemClick = () => {
    // Clear the timeout when interacting with the list to prevent immediate hide
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  };

  function onClick(newBook: {
    bookId?: string;
    bookTitle: string;
    authorName: string;
    bookCategoryId: string;
    bookQuantity?: string;
    bookRentPrice?: string;
    bookCoverImageUrl?: string;
  }) {
    if (book?.bookId === newBook.bookId) {
      console.log("exists");
      return;
    } else {
      addBook(newBook);
    }
  }

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 0,
          position: "relative",
        }}
      >
        <TextField
          id="search-book"
          placeholder="Search..."
          variant="outlined"
          fullWidth
          onFocus={handleFocus}
          onBlur={handleBlur}
          sx={{ position: "relative" }}
          value={book?.bookTitle}
        />
        {showList && (
          <List
            sx={{
              boxShadow: 4,
              position: "absolute",
              top: "100%",
              left: 0,
              width: "100%",
              zIndex: 1,
            }}
            onMouseDown={handleListItemClick} // Handle mouse down to prevent blur from closing the list
          >
            {books.map((book) => (
              <button
                className="w-full"
                onClick={() => {
                  setOpenDialog(true);
                  onClick({
                    bookTitle: book.title,
                    authorName: book.author,
                    bookCategoryId: book.categoryId!,
                    bookId: book.id,
                    bookQuantity: String(book.quantity!),
                    bookRentPrice: String(book.rentPrice!),
                    bookCoverImageUrl: book.bookImageUrl!,
                  });
                }}
              >
                <Item title={book.title} />
              </button>
            ))}

            {/* {book && <Item title={book.bookTitle} />} */}
            {!bookExists && book && <Item title={book.bookTitle} />}
            <Button
              onClick={() => {
                setOpenDialog(true);
                addBook({
                  bookTitle: "",
                  authorName: "",
                  bookCategoryId: "",
                  bookId: "",
                  bookQuantity: "",
                  bookRentPrice: "",
                  bookCoverImageUrl: "",
                });
              }}
              type="submit"
              variant="contained"
              sx={{
                width: "100%",
                bgcolor: "white",
                "&:hover": {
                  bgcolor: "grey.100",
                },
                paddingY: "4px",
                color: "#00ABFF",
                boxShadow: 0,
                textAlign: "left",
              }}
            >
              Add
            </Button>
          </List>
        )}
      </Box>
      <FormDialog options={options} books={books} />
    </>
  );
}
