import React from "react";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useDispatch } from "react-redux";

import {
  updateZone,
  updateLane,
  updateSlot,
  updateZoneOfLane,
} from "./../reducers/map-management";

import "./PropertyEditor.css";

export default function CommonProp(props) {
  let element = props.selecting;

  const dispatch = useDispatch();
  // const [x, setX] = useState(zone?.x);

  function updateProp(value, propName) {
    if (element == null) return;
    if (!value || value === "") value = 0;
    // console.log(value);
    const currentElement = { ...element };
    currentElement[propName] = parseFloat(value);

    if (currentElement.type === "zone") {
      dispatch(updateZone(currentElement));
    } else if (currentElement.type === "lane") {
      dispatch(updateLane(currentElement));

      if (currentElement.autoAdjustZone) {
        dispatch(updateZoneOfLane(currentElement.key));
      }
    } else {
      dispatch(updateSlot(currentElement));
    }
  }

  function updatePropString(value, propName) {
    // console.log(value);
    const currentElement = { ...element };
    currentElement[propName] = value;
    if (currentElement.type === "zone") {
      dispatch(updateZone(currentElement));
    } else if (currentElement.type === "lane") {
      dispatch(updateLane(currentElement));
    } else {
      dispatch(updateSlot(currentElement));
    }
  }

  return (
    <Grid container spacing={2}>
      <Grid item sm={12} textAlign={"start"}>
        <Typography variant="h5" component="h5">
          Geometry Property
        </Typography>
      </Grid>
      {element.name ? (
        <Grid item sm={12}>
          <TextField
            label="Name"
            fullWidth
            size="small"
            value={element.name}
            onChange={(e) => updatePropString(e.target.value, "name")}
          />
        </Grid>
      ) : null}

      <Grid item xs={12} sm={6}>
        <TextField
          label="X"
          fullWidth
          size="small"
          value={element.x}
          onChange={(e) => updateProp(e.target.value, "x")}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          label="Y"
          fullWidth
          size="small"
          value={element.y}
          onChange={(e) => updateProp(e.target.value, "y")}
        />
      </Grid>
      {element.width ? (
        <Grid item xs={12} sm={6}>
          <TextField
            label="Width"
            fullWidth
            size="small"
            value={element.width}
            onChange={(e) => updateProp(e.target.value, "width")}
          />
        </Grid>
      ) : null}
      {element.height ? (
        <Grid item xs={12} sm={6}>
          <TextField
            label="Height"
            fullWidth
            size="small"
            value={element.height}
            onChange={(e) => updateProp(e.target.value, "height")}
          />
        </Grid>
      ) : null}
    </Grid>
  );
}
