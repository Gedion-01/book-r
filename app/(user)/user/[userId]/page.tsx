import { redirect } from "next/navigation";
import { verifyAuth } from "@/lib/auth";
import { defineAbilitiesFor } from "@/lib/casl-ability";
import { fetchBooks } from "@/actions/fetch-books";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  Divider,
  TextField,
  Typography,
} from "@mui/material";
import { AvailableBooks } from "./_components/available-books";
import { RentedBooks } from "./_components/rented-books";
import { fetchRentedBooks } from "@/actions/fetch-rented-books";
import { userInfo } from "os";

export default async function UserPage({
  params,
}: {
  params: { userId: string };
}) {
  const userPayload = await verifyAuth(params.userId);

  console.log(userPayload);

  if (!userPayload) {
    return redirect("/");
  }

  const ability = defineAbilitiesFor(userPayload.role, {
    userId: userPayload.id,
  });

  if (!ability.can("read", "Book")) {
    return redirect("/");
  }

  const books = await fetchBooks();
  const rentedBooks = await fetchRentedBooks(userPayload.id);
  console.log(rentedBooks);

  if (!books) {
    return <div>NO books</div>;
  }
  return (
    <>
      <RentedBooks books={rentedBooks} userId={userPayload.id} />
      <Divider variant="fullWidth" sx={{ }} />
      <AvailableBooks books={books} userId={userPayload.id} />
    </>
  );
}
