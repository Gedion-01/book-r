"use client";

import React, { useMemo, useState, useEffect } from "react";
import {
  MaterialReactTable,
  type MRT_ColumnDef,
  type MRT_SortingState,
} from "material-react-table";
import { Box, Typography } from "@mui/material";
import BookAction from "./book-action";
import { Book } from "@prisma/client";
import axios from "axios";
import { useStore } from "@/store/store";

type BookStatus = "RENTED" | "FREE"

interface LiveBookStatusProps {
  userId: string;
}

const LiveBookStatus = ({ userId }: LiveBookStatusProps) => {
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
        const response = await axios.get("/api/owner/books", {
          params: {
            page: pageIndex,
            size: pageSize,
            sort: JSON.stringify(sorting),
            filter: globalFilter,
          },
        });
        setBooks(response.data.books);
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
      { header: "No.", accessorKey: "no", size: 50 },
      { header: "Book no.", accessorKey: "bookNo", size: 100 },
      { header: "Book Name", accessorKey: "title", size: 250 },
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
              <span className="mt-1">{status}</span>
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
              <span className="mt-1">{status}</span>
            </Box>
          );
        },
      },
      { header: "Price", accessorKey: "rentPrice", size: 100 },
      {
        header: "Action",
        id: "actions",
        size: 100,
        Cell: ({ row }) => (
          <>
            <BookAction book={row.original} userId={userId} />
          </>
        ),
      },
    ],
    [userId]
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
            paddingY: 0,
          },
        }}
        muiTableHeadCellProps={{
          sx: {
            boxShadow: 100,
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
        renderTopToolbarCustomActions={() => (
          <Typography
            sx={{
              fontWeight: "600",
              fontSize: "16px",
              marginTop: "52px",
              color:"rgba(26, 25, 25, 1)"
            }}
          >
            Book Status Table
          </Typography>
        )}
      />
    </div>
  );
};

export default LiveBookStatus;
