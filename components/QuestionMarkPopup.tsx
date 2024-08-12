"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { Fab, Popover, List, ListItem, ListItemText } from "@mui/material";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import Link from "next/link";

const QuestionMarkPopup: React.FC = () => {
  const pathname = usePathname()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  const visibleRoutes = ["/admin", "/owner", "/"];

  if (!visibleRoutes.includes(pathname)) {
    return null;
  }

  return (
    <>
      <Fab
        color="primary"
        aria-label="help"
        onClick={handleClick}
        style={{ position: "fixed", bottom: 16, right: 16 }}
      >
        <HelpOutlineIcon />
      </Fab>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
      >
        <List>
          <Link href="/admin" passHref>
            <ListItem button component="a">
              <ListItemText primary="Login as an admin" />
            </ListItem>
          </Link>
          <Link href="/owner" passHref>
            <ListItem button component="a">
              <ListItemText primary="Login as a book owner" />
            </ListItem>
          </Link>
          <Link href="/" passHref>
            <ListItem button component="a">
              <ListItemText primary="Login as a user" />
            </ListItem>
          </Link>
        </List>
      </Popover>
    </>
  );
};

export default QuestionMarkPopup;