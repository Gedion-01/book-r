"use client";

import React, { useMemo, useState, useEffect, useCallback } from "react";
import {
  MaterialReactTable,
  type MRT_ColumnDef,
  type MRT_SortingState,
} from "material-react-table";
import { Box, FormControlLabel, Switch, Typography } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";

import axios from "axios";
import { useStore } from "@/store/store";
import toast from "react-hot-toast";

type BookStatus = "RENTED" | "FREE";
type UserStatus = "ACTIVE" | "DISABLED";

interface Book {
  no: number;
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
  owner: string;
  category: string;
  BookStatus: boolean;
}

const ListOfBooks = () => {
  const { refreshKey, toggleRefresh } = useStore();
  const [books, setBooks] = useState<Book[]>([]);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [sorting, setSorting] = useState<MRT_SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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
        console.log("Fetched owners:", response.data.books);
      } catch (error) {
        console.error("Error fetching books:", error);
      }
    };

    fetchBooks();
  }, [pageIndex, pageSize, sorting, globalFilter, refreshKey]);

  const handleSwitchChange = useCallback(
    async (bookId: string, status: boolean) => {
      try {
        setIsLoading(true);
        const res = await axios.patch("/api/admin/approvebook", {
          toBeUpdatedBookId: bookId,
          isApproved: !status,
        });
        toggleRefresh();
        toast.success("Book status updated");
      } catch (error) {
        toast.error("An error has occured");
      } finally {
        setIsLoading(false);
      }
    },
    [toggleRefresh]
  );

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
        header: "Author",
        accessorKey: "author",
        size: 100,
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
              {cell.row.original.author}
            </Typography>
          );
        },
      },
      {
        header: "Owner",
        accessorKey: "owner",
        size: 150,
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
              {cell.row.original.owner}
            </Typography>
          );
        },
      },
      {
        header: "Category",
        accessorKey: "category",
        size: 150,
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
              {cell.row.original.category}
            </Typography>
          );
        },
      },
      {
        header: "Book Name",
        accessorKey: "title",
        size: 150,
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
              {cell.row.original.title}
            </Typography>
          );
        },
      },
      {
        header: "Status",
        accessorKey: "BookStatus",
        size: 200,
        muiTableHeadCellProps: {
          align: "center", // Center align the header
        },
        Cell: ({ cell }) => {
          const bookId = cell.row.original.id;
          const status = cell.row.original.BookStatus;
          return status === true ? (
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: 1,
                height: "38px",
              }}
            >
              <FormControlLabel
                value="start"
                sx={{
                  margin: 0,
                  backgroundColor: "rgba(0, 128, 0, 0.1)",
                  borderRadius: "15px",
                  paddingX: "6px",
                }}
                control={
                  <Switch
                    disabled={isLoading}
                    checked={status === true}
                    onChange={(event) => handleSwitchChange(bookId, status)}
                    sx={{
                      width: "71px",
                      "& .MuiSwitch-switchBase.Mui-checked": {
                        width: "70px",
                        color: "#4caf50",
                        "& + .MuiSwitch-track": {
                          backgroundColor: "rgba(0, 128, 0, 0.4)",
                          opacity: 1,
                          border: 0,
                        },
                      },
                    }}
                  />
                }
                label={
                  <Typography
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      fontWeight: 400,
                      fontSize: "16px",
                      marginTop: "3px",
                      color: "rgba(0, 128, 0, 1)",
                    }}
                  >
                    {status === true && (
                      <>
                        <CheckIcon
                          sx={{
                            marginX: "4px",
                            width: "17px",
                            marginBottom: "2px",
                          }}
                        />
                        Active
                      </>
                    )}
                  </Typography>
                }
                labelPlacement="start"
              />
            </Box>
          ) : (
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: 1,
                height: "38px",
              }}
            >
              <FormControlLabel
                value="start"
                sx={{
                  margin: 0,
                  backgroundColor: "rgba(120, 0, 0, 0.1)",
                  borderRadius: "15px",
                  paddingX: "6px",
                }}
                control={
                  <Switch
                    disabled={isLoading}
                    checked={status === false && false}
                    onChange={(event) => handleSwitchChange(bookId, status)}
                    sx={{
                      width: "70px",
                      "& .MuiSwitch-switchBase.Mui-checked": {
                        width: "70px",
                        color: "rgba(176, 76, 80, 1)",
                        "& + .MuiSwitch-track": {
                          backgroundColor: "rgba(128, 0, 0, 0.4)",
                          opacity: 1,
                          border: 0,
                        },
                      },
                    }}
                  />
                }
                label={
                  <Typography
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      fontWeight: 400,
                      fontSize: "16px",
                      marginTop: "3px",
                      color: "rgba(128, 0, 0, 1)",
                    }}
                  >
                    {status === false && (
                      <>
                        <CheckIcon
                          sx={{
                            marginX: "4px",
                            width: "17px",
                            marginBottom: "2px",
                          }}
                        />
                        Disabled
                      </>
                    )}
                  </Typography>
                }
                labelPlacement="start"
              />
            </Box>
          );
        },
      },
    ],
    [handleSwitchChange, isLoading]
  );

  return (
    <div className="px-[28px] pt-[32px] bg-white rounded-[16px] h-full">
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
        muiTableContainerProps={{
          sx: {
            maxWidth: "1300px",
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
            List of books
          </Typography>
        )}
      />
    </div>
  );
};

export default ListOfBooks;
