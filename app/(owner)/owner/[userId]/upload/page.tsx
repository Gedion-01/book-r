import { Autocomplete, TextField, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Add from "./_components/add";
import prisma from "@/lib/prisma";

export default async function UploadPage() {
  const categories = await prisma.category.findMany({
    orderBy: {
      name: "asc",
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
        <Typography variant="h5" sx={{marginBottom: "40px"}}> Upload New Book</Typography>
        <Add
          options={categories.map((category) => ({
            label: category.name,
            value: category.id,
          }))}
        />
      </Box>
      
    </Box>
  );
}
