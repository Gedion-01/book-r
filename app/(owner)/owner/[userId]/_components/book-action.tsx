"use client";

import { IconButton } from "@mui/material";
import { red } from "@mui/material/colors";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Book } from "@prisma/client";

import { useStore } from "@/store/store";
import { useRouter } from "next/navigation";

interface BookTableProps {
  book: Book;
  userId: string;
}

export default function BookAction({ book, userId }: BookTableProps) {
  const { addBook } = useStore();
  const router = useRouter();

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
      <IconButton aria-label="delete">
        <DeleteIcon
          sx={{
            color: red[500],
          }}
        />
      </IconButton>
    </>
  );
}
