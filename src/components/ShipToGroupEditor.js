import React, { Fragment, FunctionComponent } from "react";
import Paper from "@mui/material/Paper";
import Slide from "@mui/material/Slide";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";

import { update } from "../reducers/ship-to-group-management";

import { useSelector, useDispatch } from "react-redux";
import { ColorField } from "./ColorField";

import _ from "lodash";

import { EditorMode } from "../helper/constants";
import { changeEditorMode } from "../reducers/selection";

import "./ShipToGroupEditor.css"

export default function ShipToGroupEditor() {
  const shipToGroupsDic = useSelector(
    (state) => state.shipToGroupsManagement.shipToGroups
  );
  const mode = useSelector((state) => state.selection.editor_mode);

  const dispatch = useDispatch();

  const shipToGroups = _.values(shipToGroupsDic);

  const handleCloseEditor = () => {
    dispatch(changeEditorMode(EditorMode.None));
  };

  return (
    <Fragment>
      <div className="ship-to-group-editor">
        <Slide
          direction="right"
          in={mode === EditorMode.ShipToGroup}
          mountOnEnter
          unmountOnExit
        >
          <Paper elevation={3} sx={{ p: 3 }} className="paper">
            <Grid container spacing={2}>
              <Grid item sm={6} textAlign={"start"}>
                <Typography variant="h6" component="h2">
                  Ship To Group List
                </Typography>
              </Grid>
              <Grid item sm={6} textAlign={"end"}>
                <IconButton
                  aria-label="close"
                  size="small"
                  onClick={handleCloseEditor}
                >
                  <CloseIcon />
                </IconButton>
              </Grid>
            </Grid>

            <TableContainer
              component={Paper}
              sx={{ height: "calc(100% - 30px)" }}
            >
              <Table size="small" aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell align="left">Name</TableCell>
                    <TableCell align="center">PP Color</TableCell>
                    <TableCell align="center">PM Color</TableCell>
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
                          value={row.ppColor}
                          onChange={(e) => {
                            let shipToGroup = { ...shipToGroupsDic[row.id] };
                            shipToGroup.ppColor = e;
                            dispatch(update(shipToGroup));
                          }}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <ColorField
                          fullWidth
                          value={row.pmColor}
                          onChange={(e) => {
                            let shipToGroup = { ...shipToGroupsDic[row.id] };
                            shipToGroup.pmColor = e;
                            dispatch(update(shipToGroup));
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Slide>
      </div>
    </Fragment>
  );
}
