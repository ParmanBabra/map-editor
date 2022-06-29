import React, { useState } from "react";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";

import { useSelector, useDispatch } from "react-redux";

import Grid from "@mui/material/Grid";
import _ from "lodash";

import { moveProduct, updateMarker } from "./../reducers/marker";
import { convertOriginYToOnboardY } from "./../helper/export-zone";

import "./PropertyEditor.css";
import { Fragment } from "react";

export default function MarkerProp(props) {
  let marker = props.selecting;

  const map = useSelector((state) => state.mapManagement.map);
  const folklifts = useSelector((state) => state.marker.folklifts);

  const dispatch = useDispatch();

  function updateStringProp(value, propName) {
    if (marker == null) return;
    const current = { ...marker };

    current[propName] = value;
    dispatch(updateMarker(current));
  }

  return (
    <Grid container spacing={2}>
      <Grid item sm={12} textAlign={"start"}>
        <Typography variant="h5" component="h5">
          Marker Property
        </Typography>
      </Grid>
      <Grid item sm={6}>
        <TextField
          label="Pallet Id"
          fullWidth
          size="small"
          value={marker.product_id}
          onChange={(e) => updateStringProp(e.target.value, "product_id")}
        />
      </Grid>
      <Grid item sm={6}>
        <FormControl fullWidth>
          <InputLabel>Folklift</InputLabel>
          <Select
            fullWidth
            size="small"
            label="Folklift"
            value={marker.forklift_name}
            onChange={(e) => {
              updateStringProp(e.target.value, "forklift_name");
            }}
          >
            {_.values(folklifts).map((item) => {
              return (
                <MenuItem key={item.key} value={item.key}>
                  [{item.key}] {item.name}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
      </Grid>

      <Grid item sm={12}>
        <Typography variant="h6" component="h6">
          OnBoard Location
        </Typography>

        <Typography variant="body1">
          {`(${marker.x}, ${
            convertOriginYToOnboardY(marker.y, map.size.height)[0]
          })`}
        </Typography>
      </Grid>
      <Grid item sm={12}>
        <Typography variant="h6" component="h6">
          OnBoard Command
        </Typography>
      </Grid>

      <Grid item sm={6}>
        <Button
          fullWidth
          variant="contained"
          onClick={() => {
            dispatch(moveProduct({ key: marker.key }));
            // console.log(result);
          }}
        >
          Move
        </Button>
      </Grid>
    </Grid>
  );
}
