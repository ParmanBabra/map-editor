import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import { styled } from "@mui/material/styles";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import ContentPasteIcon from "@mui/icons-material/ContentPaste";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import Collapse from "@mui/material/Collapse";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

import _ from "lodash";
import Color from "color";
import {
  updateLane,
  generateByZone,
  addPriority,
  deletePriority,
  updatePriority,
} from "../reducers/map-management";

import "./PropertyEditor.css";

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
  marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}));

const tableCellSX = { px: "8px", py: "3px" };

export default function SlotProp(props) {
  let lane = props.selecting;

  const dispatch = useDispatch();

  function updateProp(value, propName) {
    if (lane == null) return;
    if (!value || value === "") value = 0;
    const currentLane = { ...lane };
    currentLane[propName] = parseInt(value);
    dispatch(updateLane(currentLane));
  }

  function updateStringProp(value, propName) {
    if (lane == null) return;
    if (!value || value === "") value = 0;
    const currentLane = { ...lane };
    currentLane[propName] = value;
    dispatch(updateLane(currentLane));
  }

  function updatePropBoolean(value, propName) {
    const currentLane = { ...lane };
    currentLane[propName] = Boolean(value);
    dispatch(updateLane(currentLane));
  }

  return (
    <Grid container spacing={2}>
      {/* <Grid item xs={12} sm={6}>
        <FormControlLabel
          control={
            <Checkbox
              checked={lane.autoAdjustZone}
              onChange={(e) =>
                updatePropBoolean(e.target.checked, "autoAdjustZone")
              }
            />
          }
          label="Adjust Zone"
        />
      </Grid> */}
      
    </Grid>
  );
}
