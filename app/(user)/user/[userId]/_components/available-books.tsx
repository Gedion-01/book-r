"use client";

import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { z } from "zod";

interface Book {
  id: string;
  title: string;
  author: string;
  category: {
    name: string;
  } | null;
  owner: {
    isApproved: boolean;
    status: string;
  };
  copies: {
    status: string;
  }[];
  availableQuantity: number;
}

interface AvailableBooksProps {
  books: Book[];
  userId: string;
}

const rentSchema = z
  .object({
    bookId: z.string(),
    quantity: z.number().min(1, "Quantity must be at least 1"),
    availableQuantity: z.number(),
  })
  .refine((data) => data.quantity <= data.availableQuantity, {
    message: "Cannot rent more than available quantity",
    path: ["quantity"],
  });

export function AvailableBooks({ books, userId }: AvailableBooksProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleRent = async (
    bookId: string,
    quantity: number,
    userId: string
  ) => {
    try {
      setIsLoading(true);
      const book = books.find((b) => b.id === bookId);
      if (!book) {
        setErrors((prev) => ({ ...prev, [bookId]: "Book not found" }));
        return;
      }

      const validationResult = rentSchema.safeParse({
        bookId,
        quantity,
        availableQuantity: book.availableQuantity,
      });

      if (!validationResult.success) {
        setErrors((prev) => ({
          ...prev,
          [bookId]: validationResult.error.errors
            .map((e) => e.message)
            .join(", "),
        }));
        return;
      }

      console.log(bookId, quantity);

      const res = await axios.post("/api/user/rent", {
        userId: userId,
        bookId: bookId,
        quantity: quantity,
      });

      toast.success("You have successfully rented Book");
      router.refresh();
    } catch (error) {
      console.error("Error renting the book:", error);
      setErrors((prev) => ({ ...prev, [bookId]: "Failed to rent the book" }));
      toast.error("An error has occured");
    } finally {
      setIsLoading(false);
    }
  };

  if (books.length === 0) {
    return (
      <Box
        sx={{
          padding: "20px",
          backgroundColor: "#f5f5f5",
        }}
      >
        <Typography
          variant="h4"
          gutterBottom
          sx={{ textAlign: "center", marginBottom: "20px" }}
        >
          Available Books
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "20px",
          }}
        >
          Empty
        </Box>
      </Box>
    );
  }

  return (
    <div
      style={{
        padding: "20px",
        backgroundColor: "#f5f5f5",
      }}
    >
      <Typography
        variant="h4"
        gutterBottom
        style={{ textAlign: "center", marginBottom: "20px" }}
      >
        Available Books
      </Typography>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "20px",
        }}
      >
        {books.map((book) => (
          <Card
            key={book.id}
            sx={{
              width: 300,
              minWidth: 300,
              marginBottom: 2,
              backgroundColor: "background.paper",
              boxShadow: 3,
              "&:hover": {
                boxShadow: 6,
              },
              height: "100%",
            }}
          >
            <CardContent
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <Typography variant="h6" gutterBottom>
                {book.title}
              </Typography>
              <Typography variant="subtitle1" color="textSecondary">
                Author: {book.author}
              </Typography>
              <Chip
                label={book.category?.name}
                variant="outlined"
                size="small"
                sx={{ marginTop: 1 }}
              />
              <Typography variant="body2" sx={{ marginTop: 2 }}>
                Available: {book.availableQuantity}
              </Typography>
              <TextField
                label="Quantity"
                type="number"
                inputProps={{ min: 1, max: book.availableQuantity }}
                defaultValue={1}
                sx={{ marginTop: 2 }}
                id={`quantity-${book.id}`}
                error={!!errors[book.id]}
                helperText={errors[book.id]}
              />
            </CardContent>
            <CardActions sx={{ justifyContent: "center" }}>
              <Button
                variant="contained"
                sx={{
                  backgroundColor: "primary.main",
                  color: "primary.contrastText",
                  "&:hover": {
                    backgroundColor: "primary.dark",
                  },
                  width: "100%",
                }}
                disabled={book.availableQuantity === 0}
                onClick={() => {
                  const quantity = parseInt(
                    (
                      document.getElementById(
                        `quantity-${book.id}`
                      ) as HTMLInputElement
                    ).value,
                    10
                  );
                  handleRent(book.id, quantity, userId);
                }}
              >
                {book.availableQuantity > 0 ? "Rent" : "Unavailable"}
              </Button>
            </CardActions>
          </Card>
        ))}
      </div>
    </div>
  );
}
