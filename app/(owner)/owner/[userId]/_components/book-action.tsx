"use client";

import { IconButton } from "@mui/material";
import { red } from "@mui/material/colors";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Book } from "@prisma/client";

import { useStore } from "@/store/store";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { DeleteDialog } from "./delete-dialog";

interface BookTableProps {
  book: Book;
  userId: string;
}

export default function BookAction({ book, userId }: BookTableProps) {
  const { addBook } = useStore();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [bookId, setBookId] = useState("");

  const handleClickOpen = () => {
    setOpen(true);
    setBookId(book.id);
  };

  const handleClose = () => {
    setOpen(false);
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
    addBook(newBook);
    router.push(`/owner/${userId}/upload`);
  }
  return (
    <>
      <IconButton aria-label="edit">
        <EditIcon
          onClick={() =>
            onClick({
              bookId: book.id,
              bookTitle: book.title,
              authorName: book.author,
              bookCategoryId: book.categoryId!,
              bookQuantity: String(book.quantity),
              bookRentPrice: String(book.rentPrice),
              bookCoverImageUrl: book.bookImageUrl,
            })
          }
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
      <DeleteDialog open={open} handleClose={handleClose} bookId={book.id} />
    </>
  );
}
