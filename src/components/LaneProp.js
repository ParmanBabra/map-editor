import React from "react";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import { useDispatch } from "react-redux";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

import { updateLane, generateByZone } from "./../reducers/map-management";

import "./PropertyEditor.css";

export default function LaneProp(props) {
  let lane = props.selecting;

  const dispatch = useDispatch();
  // const [x, setX] = useState(zone?.x);

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
      <Grid item sm={12} textAlign={"start"}>
        <Typography variant="h5" component="h5">
          Lane Property
        </Typography>
      </Grid>
      
      <Grid item xs={12} sm={6}>
        <TextField
          label="Slot Width"
          fullWidth
          size="small"
          value={lane.slotWidth}
          onChange={(e) => updateProp(e.target.value, "slotWidth")}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          label="Capacity"
          fullWidth
          size="small"
          value={lane.capacity}
          onChange={(e) => updateProp(e.target.value, "capacity")}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <FormControl fullWidth>
          <InputLabel>Localtion Type</InputLabel>
          <Select
            fullWidth
            size="small"
            label="Localtion Type"
            value={lane.localtionType}
            onChange={(e) => updateStringProp(e.target.value, "localtionType")}
          >
            <MenuItem value="storage">Storage</MenuItem>
            <MenuItem value="rack">Rack</MenuItem>
            <MenuItem value="wrapper">Wrapper</MenuItem>
            <MenuItem value="gr_area">GR Area</MenuItem>
            <MenuItem value="skip_conveyer">Skip Conveyer</MenuItem>
            <MenuItem value="qa_area">QA Area</MenuItem>
            <MenuItem value="docker">Docker</MenuItem>
            <MenuItem value="production_line">Production Line</MenuItem>
            <MenuItem value="wrapper_buffer">Wrapper Buffer</MenuItem>
            <MenuItem value="Transfer">Transfer</MenuItem>
            <MenuItem value="counting_wip">Counting WIP</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12} sm={6}>
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
      </Grid>
      <Grid item xs={12} sm={6}>
        <FormControlLabel
          control={
            <Checkbox
              checked={lane.autoGenerate}
              onChange={(e) =>
                updatePropBoolean(e.target.checked, "autoGenerate")
              }
            />
          }
          label="Auto Generate"
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <Button
          variant="contained"
          onClick={() => dispatch(generateByZone(lane.id))}
        >
          Genarate
        </Button>
      </Grid>
    </Grid>
  );
}
