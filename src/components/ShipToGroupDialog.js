import React, { Fragment, FunctionComponent } from "react";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

import { update } from "./../reducers/ship-to-group-management";

import { useSelector, useDispatch } from "react-redux";
import { ColorField } from "./ColorField";
import _ from "lodash";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 750,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function ShipToGroupDialog({ open, onClose }) {
  const shipToGroupsDic = useSelector(
    (state) => state.shipToGroupsManagement.shipToGroups
  );
  const dispatch = useDispatch();

  const shipToGroups = _.values(shipToGroupsDic);

  return (
    <Fragment>
      <Modal
        open={open}
        onClose={onClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <Box sx={style}>
            <Typography id="transition-modal-title" variant="h6" component="h2">
              Ship To Group List
            </Typography>
            <TableContainer component={Paper}>
              <Table size="small" aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell align="left">Name</TableCell>
                    <TableCell align="center">Color</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {shipToGroups.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell component="th" scope="row">
                        {row.id}
                      </TableCell>
                      <TableCell align="left">{row.name}</TableCell>
                      <TableCell align="center">
                        <ColorField
                          fullWidth
                          value={row.color}
                          onChange={(e) => {
                            let shipToGroup = { ...shipToGroupsDic[row.id] };
                            shipToGroup.color = e;
                            dispatch(update(shipToGroup));
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Fade>
      </Modal>
    </Fragment>
  );
}
