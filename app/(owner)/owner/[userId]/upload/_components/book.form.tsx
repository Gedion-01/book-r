"use client";

import React, { useState, useEffect } from "react";
import * as z from "zod";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import Add from "./add";
import { useStore } from "@/store/store";
import { FileUpload } from "@/components/fike-upload";
import Image from "next/image";
import toast from "react-hot-toast";
import axios from "axios";
import { Book } from "@prisma/client";
import { useRouter } from "next/navigation";

const quantity = [
  { id: "1", name: "1" },
  { id: "2", name: "2" },
  { id: "3", name: "3" },
  { id: "4", name: "4" },
  { id: "5", name: "5" },
  { id: "6", name: "6" },
  { id: "7", name: "7" },
  { id: "8", name: "8" },
  { id: "9", name: "9" },
  { id: "10", name: "10" },
];

// Define the Zod schema
const formSchema = z.object({
  rentPrice: z.number().positive("Book Price is required and must be greater than or equal to 0"),
  bookCategoryId: z.string().min(1, "Book quantity is required"),
  bookCoverImageUrl: z.string().min(1, "Image is required"),
});

interface BookFormProps {
  userId: string;
  books: Book[];
  categories: {
    id: string;
    name: string;
  }[];
}

export default function BookForm({ userId, categories, books }: BookFormProps) {
  const router = useRouter();
  const { book, addBook } = useStore();
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [rentPrice, setRentPrice] = useState<number>(0);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  console.log(imageUrl);

  useEffect(() => {
    if (book) {
      setRentPrice(Number(book.bookRentPrice) || 0);
      setSelectedOption(book.bookQuantity || "");
      setImageUrl(book.bookCoverImageUrl || "");
    }
  }, [book]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Construct the form data object
    const formData = {
      ...book,
      rentPrice,
      bookQuantity: selectedOption,
      bookCoverImageUrl: imageUrl,
    };

    // Validate the form data using Zod
    const result = formSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      setErrors({
        rentPrice: fieldErrors.rentPrice?.[0] || "",
        bookCategoryId: fieldErrors.bookCategoryId?.[0] || "",
        bookCoverImageUrl: fieldErrors.bookCoverImageUrl?.[0] || "",
      });
      return;
    }

    // If validation passes, handle the form submission
    try {
      setIsSubmitting(true);
      const res = await axios.patch("/api/owner/new", formData);
      if (res.data === "Book updated successfully") {
        toast.success("Book updated successfully");
      } else {
        toast.success("Book uploaded successfully");
      }
      addBook({
        bookTitle: "",
        authorName: "",
        bookCategoryId: "",
        bookId: "",
        bookQuantity: "",
        bookRentPrice: "",
        bookCoverImageUrl: "",
      });
      router.push(`/owner/${userId}`);
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSelectedOption(event.target.value as string);
  };

  const toggleEdit = () => setIsEditing((current) => !current);

  return (
    <>
      <Add
        books={books}
        options={categories.map((category) => ({
          label: category.name,
          value: category.id,
        }))}
      />
      <Box
        component="form"
        onSubmit={handleSubmit}
        autoComplete="off"
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          marginTop: "150px",
        }}
      >
        <Box
          component="div"
          sx={{
            width: { width: "100%" },
            maxWidth: 686,
            display: "flex",
            flexDirection: "row",
            gap: 2,
            "@media (max-width: 768px)": {
              flexDirection: "column",
            },
          }}
        >
          <FormControl fullWidth>
            <InputLabel id="category-select-label" sx={{ width: "100%" }}>
              Book Quantity
            </InputLabel>
            <Select
              labelId="category-select-label"
              id="bookCategoryId"
              value={selectedOption}
              label="Book Quantity"
              onChange={handleChange}
              error={!!errors.bookCategoryId}
              helperText={errors.bookCategoryId}
            >
              {quantity.map((q) => (
                <MenuItem key={q.id} value={q.name}>
                  {q.name}
                </MenuItem>
              ))}
            </Select>
            {errors.bookCategoryId && (
              <p style={{ color: "red" }}>{errors.bookCategoryId}</p>
            )}
          </FormControl>

          <TextField
            id="rentPrice"
            name="rentPrice"
            type="number"
            label="Rent Price"
            fullWidth
            sx={{ marginBottom: "20px" }}
            value={rentPrice}
            onChange={(e) => setRentPrice(Number(e.target.value))}
            error={!!errors.rentPrice}
            helperText={errors.rentPrice}
          />
        </Box>
        <Button
          onClick={toggleEdit}
          sx={{
            height: "74px",
            width: "287px",
            display: "flex",
            flexDirection: "row",
            gap: "10px",
            alignItems: "center",
            justifyContent: "center",
            padding: "25px 50px",
            marginTop: "30px",
            borderRadius: "20px",
          }}
        >
          {isEditing ? (
            "Cancel"
          ) : (
            <>
              <svg
                width="17"
                height="16"
                viewBox="0 0 17 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clipPath="url(#clip0_27_8041)">
                  <path
                    d="M7.5 12V3.85L4.9 6.45L3.5 5L8.5 0L13.5 5L12.1 6.45L9.5 3.85V12H7.5ZM2.5 16C1.95 16 1.47933 15.8043 1.088 15.413C0.696666 15.0217 0.500667 14.5507 0.5 14V11H2.5V14H14.5V11H16.5V14C16.5 14.55 16.3043 15.021 15.913 15.413C15.5217 15.805 15.0507 16.0007 14.5 16H2.5Z"
                    fill="#00ABFF"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_27_8041">
                    <rect
                      width="16"
                      height="16"
                      fill="white"
                      transform="translate(0.5)"
                    />
                  </clipPath>
                </defs>
              </svg>
              <span>Upload Book Cover</span>
            </>
          )}
        </Button>
        {errors.bookCoverImageUrl && (
          <p style={{ color: "red" }}>{errors.bookCoverImageUrl}</p>
        )}
        {imageUrl && !isEditing && (
          <div className="relative mt-2 mb-[10px]">
            <Image
              alt="Upload"
              width={600}
              height={300}
              className="bg-cover rounded-md w-full h-[300px]"
              src={imageUrl}
            />
          </div>
        )}

        {isEditing && (
          <div>
            <FileUpload
              endpoint="courseImage"
              onChange={(url) => {
                if (url) {
                  setImageUrl(url);
                  setIsEditing(false);
                }
              }}
            />
            <div className="text-xs text-muted-foreground mt-4">
              16:9 aspect ratio recommended
            </div>
          </div>
        )}
        <Button
          type="submit"
          sx={{
            height: "74px",
            width: "287px",
            display: "flex",
            flexDirection: "row",
            gap: "10px",
            alignItems: "center",
            justifyContent: "center",
            padding: "25px 50px",
            backgroundColor: "#00ABFF",
            color: "white",
            "&:hover": {
              backgroundColor: "#00ABFF",
              opacity: "0.8",
            },
            borderRadius: "20px",
            marginTop: "30px",
          }}
          disabled={isSubmitting}
        >
          <span>Submit</span>
        </Button>
      </Box>
    </>
  );
}
