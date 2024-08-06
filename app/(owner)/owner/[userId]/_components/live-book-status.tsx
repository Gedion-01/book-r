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

const data = [
  {
    id: 1,
    number: "6465",
    name: "Derto Gada",
    status: "Rented",
    price: "40 Birr",
  },
  {
    id: 2,
    number: "6465",
    name: "Fikr Eske Mekabr",
    status: "Rented",
    price: "40 Birr",
  },
  {
    id: 3,
    number: "6465",
    name: "The Power of Now",
    status: "Rented",
    price: "40 Birr",
  },
  {
    id: 4,
    number: "5665",
    name: "Derto Gada",
    status: "Free",
    price: "0.0 Birr",
  },
  {
    id: 5,
    number: "5665",
    name: "Derto Gada",
    status: "Free",
    price: "0.0 Birr",
  },
  {
    id: 6,
    number: "1755",
    name: "Derto Gada",
    status: "Free",
    price: "0.0 Birr",
  },
];

interface BookTableProps {
  books: Book[];
}

const BookTable = ({books}: BookTableProps) => {
  return (
    <div className="col-span-2 bg-white p-4 rounded shadow-md">
      <TableContainer component={Paper} sx={{boxShadow: 0}}>
        <Box
          display="flex"
          justifyContent="right"
          alignItems="center"
          padding={2}
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
        <Typography sx={{fontWeight: "bold"}} variant="h6" gutterBottom>
            Live Book Status
          </Typography>
        <Table aria-label="simple table">
          <TableHead sx={{}}>
            <TableRow>
              <TableCell
                sx={{
                  color: "#656575",
                  fontWeight: "light",
                }}
              >
                No.
              </TableCell>
              <TableCell sx={{ color: "#656575", fontWeight: "light" }}>
                Book no.
              </TableCell>
              <TableCell sx={{ color: "#656575", fontWeight: "light" }}>
                Book Name
              </TableCell>
              <TableCell sx={{ color: "#656575", fontWeight: "light" }}>
                Status
              </TableCell>
              <TableCell sx={{ color: "#656575", fontWeight: "light" }}>
                Price
              </TableCell>
              <TableCell sx={{ color: "#656575", fontWeight: "light" }}>
                Action
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {books.map((row, index) => (
              <TableRow key={row.id}>
                <TableCell>{String(index + 1).padStart(2, "0")}</TableCell>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{row.title}</TableCell>
                <TableCell>
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
                <TableCell>{row.rentPrice}</TableCell>
                <TableCell>
                  <IconButton aria-label="edit">
                    <EditIcon sx={{
                      color: "black"
                    }} />
                  </IconButton>
                  <IconButton aria-label="delete">
                    <DeleteIcon sx={{
                      color: red[500],
                    }} />
                  </IconButton>
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
