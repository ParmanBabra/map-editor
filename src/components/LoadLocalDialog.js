import * as React from "react";
import Avatar from "@mui/material/Avatar";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import DialogTitle from "@mui/material/DialogTitle";
import Dialog from "@mui/material/Dialog";
import MapIcon from "@mui/icons-material/Map";
import { blue } from "@mui/material/colors";

import { useSelector, useDispatch } from "react-redux";

const emails = ["username@gmail.com", "user02@gmail.com"];

export default function LoadLocalDialog(props) {
  const { onClose, selectedValue, open } = props;

  const mapList = useSelector((state) => state.mapManagement.mapList);

  const handleClose = () => {
    onClose(selectedValue);
  };

  const handleListItemClick = (value) => {
    onClose(value);
  };

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>Load Map on Locat</DialogTitle>
      <List sx={{ pt: 0 }}>
        {mapList.map((map) => (
          <ListItem button onClick={() => handleListItemClick(map)} key={map}>
            <ListItemAvatar>
              <Avatar sx={{ bgcolor: blue[100], color: blue[600] }}>
                <MapIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary={map} />
          </ListItem>
        ))}
      </List>
    </Dialog>
  );
}
