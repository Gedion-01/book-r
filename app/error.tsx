"use client";
import { useRouter } from "next/navigation";
import { Button, Typography, Container } from "@mui/material";

export default function ErrorPage() {
  const router = useRouter();
  const handleRefresh = () => {
    location.reload()
  };

  return (
    <Container style={{ textAlign: "center", marginTop: "50px" }}>
      <Typography variant="h4" gutterBottom>
        An error has occurred on server
      </Typography>
      <Typography variant="body1" gutterBottom>
        Something went wrong. Please try refreshing the page.
      </Typography>
      <Button variant="contained" color="primary" onClick={handleRefresh}>
        Refresh Page
      </Button>
    </Container>
  );
}
