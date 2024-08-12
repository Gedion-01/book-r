import { Box } from "@mui/material";
import LogOutButton from "./logout-button";

export default function Navbar() {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "center",
        px: 2,
        py: 1,
      }}
    >
      <LogOutButton redirect="/" />
    </Box>
  );
}
