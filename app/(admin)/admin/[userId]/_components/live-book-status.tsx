"use client";

import axios from "axios";
import React, { useMemo, useState, useEffect } from "react";
import {
  MaterialReactTable,
  type MRT_ColumnDef,
  type MRT_SortingState,
} from "material-react-table";
import { Box, Typography } from "@mui/material";

import { useStore } from "@/store/store";

type BookStatus = "RENTED" | "FREE";

interface Book {
  no: number;
  bookNo: number;
  id: string;
  title: string;
  author: string;
  quantity: number;
  status: BookStatus;
  ownerId: string;
  rentPrice: number;
  bookImageUrl: string;
  isApproved: boolean;
  createdAt: Date;
  categoryId: string | null;
  updatedAt: Date;
  owner: {
    email: string;
  };
}

const LiveBookStatus = () => {
  const { refreshKey } = useStore();
  const [books, setBooks] = useState<Book[]>([]);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [sorting, setSorting] = useState<MRT_SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  useEffect(() => {
    console.log("Fetching books...");

    const fetchBooks = async () => {
      try {
        const response = await axios.get("/api/admin/books", {
          params: {
            page: pageIndex,
            size: pageSize,
            sort: JSON.stringify(sorting),
            filter: globalFilter,
          },
        });
        setBooks(response.data.books);
        console.log("Fetched books:", response.data.books);
      } catch (error) {
        console.error("Error fetching books:", error);
      }
    };

    fetchBooks();
  }, [pageIndex, pageSize, sorting, globalFilter, refreshKey]);

  const booksWithNumbers = books.map((book, index) => ({
    ...book,
    no: index + 1 + pageIndex * pageSize,
    bookNo: index + 1 + pageIndex * pageSize,
  }));

  const columns = useMemo<MRT_ColumnDef<Book>[]>(
    () => [
      {
        header: "No.",
        accessorKey: "no",
        size: 50,
        Cell: ({ cell }) => {
          return (
            <Typography
              sx={{
                fontWeight: 400,
                fontSize: "16px",
                lineHeight: "19.36px",
                color: "rgba(26, 25, 25, 1)",
              }}
            >
              {cell.row.original.no}
            </Typography>
          );
        },
      },
      {
        header: "Book no.",
        accessorKey: "bookNo",
        size: 50,
        Cell: ({ cell }) => {
          return (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <Typography
                sx={{
                  fontWeight: 400,
                  fontSize: "16px",
                  lineHeight: "19.36px",
                  color: "rgba(26, 25, 25, 1)",
                  bgcolor: "red",
                  padding: "4px 12px",
                  backgroundColor: "rgba(153, 153, 153, 0.1)",
                  borderRadius: "4px",
                }}
              >
                {cell.row.original.bookNo}
              </Typography>
            </Box>
          );
        },
      },
      {
        header: "Owner",
        accessorKey: "owner.email",
        size: 250,
        Cell: ({ cell }) => {
          return (
            <Typography
              sx={{
                fontWeight: 400,
                fontSize: "16px",
                lineHeight: "19.36px",
                color: "rgba(26, 25, 25, 1)",
              }}
            >
              {cell.row.original.owner.email}
            </Typography>
          );
        },
      },
      {
        header: "Status",
        accessorKey: "status",
        size: 100,
        Cell: ({ cell }) => {
          const status: BookStatus = cell.row.original.status;
          return status === "RENTED" ? (
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
                <circle cx="8" cy="8" r="5.5" fill="#FF0000" stroke="#FF0000" />
              </svg>
              <Typography
                sx={{
                  fontWeight: 300, // Example font weight
                  fontSize: "14px", // Example font size
                  lineHeight: "18px",
                  marginTop: "2px",
                  color: "rgba(101, 101, 117, 1)",
                }}
              >
                {status}
              </Typography>
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
                <circle cx="8" cy="8" r="7.5" stroke="#0000FF" />
                <circle cx="8" cy="8" r="5.5" fill="#0000FF" stroke="#0000FF" />
              </svg>
              <Typography
                sx={{
                  fontWeight: 300, // Example font weight
                  fontSize: "14px", // Example font size
                  lineHeight: "18px",
                  marginTop: "2px",
                  color: "rgba(101, 101, 117, 1)",
                }}
              >
                {status}
              </Typography>
            </Box>
          );
        },
      },
      {
        header: "Price",
        accessorKey: "rentPrice",
        size: 100,
        Cell: ({ cell }) => {
          return (
            <Typography
              sx={{
                fontWeight: 300,
                fontSize: "16px",
                lineHeight: "19.36px",
                color: "rgba(101, 101, 117, 1)",
              }}
            >
              {cell.row.original.rentPrice}
            </Typography>
          );
        },
      },
    ],
    []
  );

  return (
    <div className="px-[28px] pt-[32px]">
      <MaterialReactTable
        columns={columns}
        data={booksWithNumbers}
        manualPagination
        manualSorting
        manualFiltering
        onPaginationChange={(updaterOrValue) => {
          if (typeof updaterOrValue === "function") {
            const newState = updaterOrValue({ pageIndex, pageSize });
            setPageIndex(newState.pageIndex);
            setPageSize(newState.pageSize);
          } else {
            setPageIndex(updaterOrValue.pageIndex);
            setPageSize(updaterOrValue.pageSize);
          }
        }}
        onSortingChange={setSorting}
        onGlobalFilterChange={setGlobalFilter}
        muiTableBodyCellProps={{
          sx: {
            boxShadow: "none",
            paddingY: "16px",
          },
        }}
        muiTablePaperProps={{
          sx: {
            boxShadow: "none",
            border: "none",
          },
        }}
        muiTableBodyProps={{
          sx: {
            boxShadow: 0,
          },
        }}
        muiTableHeadProps={{
          sx: {
            boxShadow: 0,
          },
        }}
        muiTableHeadCellProps={{
          sx: {
            fontWeight: 300, // Example font weight
            fontSize: "14px", // Example font size
            lineHeight: "18px",
            color: "rgba(101, 101, 117, 1)", // Example text color
          },
        }}
        renderTopToolbarCustomActions={() => (
          <Typography
            sx={{
              fontWeight: "600",
              fontSize: "16px",
              marginTop: "52px",
              color: "rgba(26, 25, 25, 1)",
            }}
          >
            Live Book Status
          </Typography>
        )}
      />
    </div>
  );
};

export default LiveBookStatus;
