import React, { Fragment, useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import { useSelector, useDispatch } from "react-redux";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Button from "@mui/material/Button";

import { update } from "./../reducers/map-management";

import "./PropertyEditor.css";

export default function ZoneProp(props) {
  let zone = props.selecting;

  const dispatch = useDispatch();
  // const [x, setX] = useState(zone?.x);

  function updateProp(value, propName) {
    if (zone == null) return;
    if (!value || value === "") value = 0;
    const currentZone = { ...zone };
    currentZone[propName] = parseInt(value);
    dispatch(update(currentZone));
  }

  function updateStringProp(value, propName) {
    if (zone == null) return;
    if (!value || value === "") value = 0;
    const currentZone = { ...zone };
    currentZone[propName] = value;
    dispatch(update(currentZone));
  }

  function updatePropBoolean(value, propName) {
    const currentZone = { ...zone };
    currentZone[propName] = Boolean(value);
    dispatch(update(currentZone));
  }

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={12} textAlign={"start"}>
        <h3>Zone Property</h3>
      </Grid>
      <Grid item xs={12} sm={12}>
        <FormControl fullWidth>
          <InputLabel>Lane Direction</InputLabel>
          <Select
            fullWidth
            size="small"
            label="Lane Direction"
            value={zone.laneDirection}
            onChange={(e) => updateStringProp(e.target.value, "laneDirection")}
          >
            <MenuItem value="Vertical">Vertical</MenuItem>
            <MenuItem value="Horizontal">Horizontal</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          label="Lane Width"
          fullWidth
          size="small"
          value={zone.laneWidth}
          onChange={(e) => updateProp(e.target.value, "laneWidth")}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          label="Slot Width"
          fullWidth
          size="small"
          value={zone.slotWidth}
          onChange={(e) => updateProp(e.target.value, "slotWidth")}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          label="Capacity"
          fullWidth
          size="small"
          value={zone.capacity}
          onChange={(e) => updateProp(e.target.value, "capacity")}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <FormControlLabel
          control={
            <Checkbox
              checked={zone.autoGenerate}
              onChange={(e) =>
                updatePropBoolean(e.target.checked, "autoGenerate")
              }
            />
          }
          label="Auto Generate"
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <Button variant="contained">Genarate</Button>
      </Grid>
    </Grid>
  );
}
