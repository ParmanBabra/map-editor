import React from "react";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useDispatch } from "react-redux";

import { updateZone } from "./../reducers/map-management";

import "./PropertyEditor.css";

export default function CommonProp(props) {
  let zone = props.selecting;

  const dispatch = useDispatch();
  // const [x, setX] = useState(zone?.x);

  function updateProp(value, propName) {
    if (zone == null) return;
    if (!value || value === "") value = 0;
    // console.log(value);
    const currentZone = { ...zone };
    currentZone[propName] = parseFloat(value);
    dispatch(updateZone(currentZone));
  }

  function updatePropString(value, propName) {
    // console.log(value);
    const currentZone = { ...zone };
    currentZone[propName] = value;
    dispatch(updateZone(currentZone));
  }

  return (
    <Grid container spacing={2}>
      <Grid item sm={12} textAlign={"start"}>
        <Typography variant="h5" component="h5">
          Geometry Property
        </Typography>
      </Grid>
      <Grid item sm={12}>
        <TextField
          label="Name"
          fullWidth
          size="small"
          value={zone.name}
          onChange={(e) => updatePropString(e.target.value, "name")}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          label="X"
          fullWidth
          size="small"
          value={zone.x}
          onChange={(e) => updateProp(e.target.value, "x")}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          label="Y"
          fullWidth
          size="small"
          value={zone.y}
          onChange={(e) => updateProp(e.target.value, "y")}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          label="Width"
          fullWidth
          size="small"
          value={zone.width}
          onChange={(e) => updateProp(e.target.value, "width")}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          label="Height"
          fullWidth
          size="small"
          value={zone.height}
          onChange={(e) => updateProp(e.target.value, "height")}
        />
      </Grid>
    </Grid>
  );
}
