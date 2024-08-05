import { ListItem, ListItemText } from "@mui/material";

interface ItemProps {
  title: string;
}

export default function Item({ title }: ItemProps) {
  return (
    <ListItem
      sx={{
        width: "100%",
        bgcolor: "white",
        "&:hover": {
          bgcolor: "grey.100",
        },
        paddingY: "4px",
      }}
    >
      <ListItemText>{title}</ListItemText>
    </ListItem>
  );
}
