"use client";

import React, { useMemo, useState, useEffect } from "react";
import {
  MaterialReactTable,
  type MRT_ColumnDef,
  type MRT_SortingState,
} from "material-react-table";
import { Box, FormControlLabel, Switch, Typography } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
// import BookAction from "./book-action";
// import { Book } from "@prisma/client";
import axios from "axios";
import { useStore } from "@/store/store";
import toast from "react-hot-toast";
import BookAction from "./book-action";

type UserStatus = "ACTIVE" | "DISABLED";

interface Owner {
  id: string;
  email: string;
  totalBooks: number;
  location: string;
  status: UserStatus;
  isApproved: boolean;
}

const ListOfOwners = () => {
  const { refreshKey, toggleRefresh } = useStore();
  const [owners, setOwners] = useState<Owner[]>([]);
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [sorting, setSorting] = useState<MRT_SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    console.log("Fetching books...");

    const fetchBooks = async () => {
      try {
        const response = await axios.get("/api/admin/owners", {
          params: {
            page: pageIndex,
            size: pageSize,
            sort: JSON.stringify(sorting),
            filter: globalFilter,
          },
        });
        setOwners(response.data.owners);
        console.log("Fetched owners:", response.data.books);
      } catch (error) {
        console.error("Error fetching books:", error);
      }
    };

    fetchBooks();
  }, [pageIndex, pageSize, sorting, globalFilter, refreshKey]);

  const handleSwitchChange = async (userId: string, status: UserStatus) => {
    try {
      setIsLoading(true);
      const res = await axios.patch("/api/admin/changeuserstatus", {
        toBeUpdatedUserId: userId,
        userStatus: status,
      });
      toggleRefresh();
      toast.success("Status updated");
    } catch (error) {
      toast.error("An error has occured");
    } finally {
      setIsLoading(false);
    }
  };

  const booksWithNumbers = owners.map((owner, index) => ({
    ...owner,
    no: index + 1 + pageIndex * pageSize,
    bookNo: index + 1 + pageIndex * pageSize,
  }));

  const columns = useMemo<MRT_ColumnDef<Owner>[]>(
    () => [
      { header: "No.", accessorKey: "no", size: 50 },
      { header: "Owner", accessorKey: "email", size: 100 },
      { header: "Upload", accessorKey: "totalBooks", size: 150 },
      { header: "Location", accessorKey: "location", size: 100 },
      {
        header: "Status",
        accessorKey: "status",
        size: 200,
        muiTableHeadCellProps: {
          align: "center", // Center align the header
        },
        Cell: ({ cell }) => {
          const userId = cell.row.original.id;
          const status: UserStatus = cell.row.original.status;
          return status === "ACTIVE" ? (
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
                    checked={status === "ACTIVE"}
                    onChange={(event) => handleSwitchChange(userId, "DISABLED")}
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
                    {status === "ACTIVE" && (
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
                    checked={status === "DISABLED" && false}
                    onChange={(event) => handleSwitchChange(userId, "ACTIVE")}
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
                    {status === "DISABLED" && (
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
      {
        header: "Action",
        id: "actions",
        size: 100,
        Cell: ({ row }) => {
          const userId = row.original.id;
          return (
            <Box>
              <BookAction userId={userId} isApproved={row.original.isApproved} />
            </Box>
          );
        },
      },
    ],
    []
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

export default ListOfOwners;
