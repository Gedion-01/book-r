import { Autocomplete, TextField, Typography } from "@mui/material";
import Box from "@mui/material/Box";

import prisma from "@/lib/prisma";
import { z } from "zod";
import BookForm from "./_components/book.form";
import getUserId from "@/lib/auth";
import { redirect } from "next/navigation";

// Define the Zod schema
const formSchema = z.object({
  bookName: z.string().min(1, "Book Name is required"),
  authorName: z.string().min(1, "Author Name is required"),
  category: z.string().min(1, "Category is required"),
});

export default async function UploadPage({
  params,
}: {
  params: { userId: string };
}) {
  const userId = await getUserId();

  if (!userId) {
    return redirect("/owner");
  }
  const categories = await prisma.category.findMany({
    orderBy: {
      name: "asc",
    },
  });
  const books = await prisma.book.findMany({
    where: {
      ownerId: userId,
    },
  });
  return (
    <Box
      component="section"
      sx={{
        padding: "1rem",
        borderRadius: "15px",
        bgcolor: "white",
        height: "100%",
      }}
    >
      <Box
        component="div"
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          marginTop: "50px",
        }}
      >
        <Typography variant="h5" sx={{ marginBottom: "40px" }}>
          {" "}
          Upload New Book
        </Typography>
        <BookForm categories={categories} books={books} userId={userId} />
      </Box>
    </Box>
  );
}
