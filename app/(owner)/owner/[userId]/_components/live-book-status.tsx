import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Typography,
  Avatar,
  Box,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import FilterListIcon from "@mui/icons-material/FilterList";
import ViewListIcon from "@mui/icons-material/ViewList";
import ViewModuleIcon from "@mui/icons-material/ViewModule";
import ViewComfyIcon from "@mui/icons-material/ViewComfy";
import { red } from "@mui/material/colors";
import { Book } from "@prisma/client";
import BookAction from "./book-action";

interface BookTableProps {
  books: Book[];
  userId: string;
}

const BookTable = ({ books, userId }: BookTableProps) => {
  return (
    <div className="col-span-2 bg-white rounded shadow-md">
      <TableContainer component={Paper} sx={{ boxShadow: 0, paddingX: "28px" }}>
        <Box
          display="flex"
          justifyContent="right"
          alignItems="center"
          sx={{ paddingTop: "32px" }}
        >
          <Box>
            <IconButton aria-label="filter">
              <FilterListIcon />
            </IconButton>
            <IconButton aria-label="view list">
              <ViewListIcon />
            </IconButton>
            <IconButton aria-label="view module">
              <ViewModuleIcon />
            </IconButton>
            <IconButton aria-label="view comfy">
              <ViewComfyIcon />
            </IconButton>
          </Box>
        </Box>
        <Typography
          sx={{ fontWeight: "600", fontSize: "16px;", color: "#1A1919" }}
          gutterBottom
        >
          Live Book Status
        </Typography>
        <Table aria-label="simple table">
          <TableHead sx={{}}>
            <TableRow sx={{}}>
              <TableCell
                sx={{
                  color: "#656575",
                  fontWeight: "light",
                  fontSize: "14px",
                  padding: 0,
                }}
              >
                No.
              </TableCell>
              <TableCell
                sx={{
                  color: "#656575",
                  fontWeight: "light",
                  fontSize: "14px",
                  padding: 0,
                  textAlign: "center",
                  verticalAlign: "middle",
                }}
              >
                Book no.
              </TableCell>
              <TableCell
                sx={{
                  color: "#656575",
                  fontWeight: "light",
                  fontSize: "14px",
                  padding: 0,
                }}
              >
                Book Name
              </TableCell>
              <TableCell
                sx={{
                  color: "#656575",
                  fontWeight: "light",
                  fontSize: "14px",
                  padding: 0,
                }}
              >
                Status
              </TableCell>
              <TableCell
                sx={{
                  color: "#656575",
                  fontWeight: "light",
                  fontSize: "14px",
                  padding: 0,
                }}
              >
                Price
              </TableCell>
              <TableCell
                sx={{
                  color: "#656575",
                  fontWeight: "light",
                  fontSize: "14px",
                  padding: 0,
                  textAlign: "center", // Center-align text horizontally
                  verticalAlign: "middle", // Center-align text vertically
                }}
              >
                Action
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {books.map((row, index) => (
              <TableRow key={row.id}>
                <TableCell sx={{ paddingY: 1, paddingX: 0 }}>
                  {String(index + 1).padStart(2, "0")}
                </TableCell>
                <TableCell
                  sx={{
                    paddingY: 1,
                    paddingX: 0,
                    textAlign: "center",
                    verticalAlign: "middle",
                  }}
                >
                  {index + 1}
                </TableCell>
                <TableCell sx={{ paddingY: 1, paddingX: 0 }}>
                  {row.title}
                </TableCell>
                <TableCell sx={{ paddingY: 1, paddingX: 0 }}>
                  {row.status === "RENTED" ? (
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 1,
                      }}
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <circle cx="8" cy="8" r="7.5" stroke="#FF0000" />
                        <circle
                          cx="8"
                          cy="8"
                          r="5.5"
                          fill="#FF0000"
                          stroke="#FF0000"
                        />
                      </svg>
                      <span className="mt-1">{row.status} </span>
                    </Box>
                  ) : (
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 1,
                      }}
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <circle cx="8" cy="8" r="7.5" stroke="#00ABFF" />
                        <circle
                          cx="8"
                          cy="8"
                          r="5.5"
                          fill="#00ABFF"
                          stroke="#00ABFF"
                        />
                      </svg>

                      <span className="mt-1">{row.status} </span>
                    </Box>
                  )}
                </TableCell>
                <TableCell sx={{ paddingY: 1, paddingX: 0 }}>
                  {row.rentPrice}
                </TableCell>
                <TableCell
                  sx={{
                    paddingY: 1,
                    paddingX: 0,
                    textAlign: "center",
                    verticalAlign: "middle",
                  }}
                >
                  {" "}
                  <BookAction book={row} userId={userId} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default BookTable;
