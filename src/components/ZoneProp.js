import React from "react";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import { useDispatch, useSelector } from "react-redux";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormLabel from "@mui/material/FormLabel";
import IconButton from "@mui/material/IconButton";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import ContentPasteIcon from "@mui/icons-material/ContentPaste";
import { ColorField } from "./ColorField";
import _ from "lodash";

import {
  updateZone,
  generateByZone,
  makerToCenter,
  progressAdjust,
  updateLanesOfZone,
  pasteZoneProperties,
} from "./../reducers/map-management";
import { copyZoneProperties } from "./../reducers/selection";
import { ContentType } from "./../helper/constants";

import "./PropertyEditor.css";

export default function ZoneProp(props) {
  let zone = props.selecting;

  const dispatch = useDispatch();
  const contantsType = useSelector((state) => state.selection.contents.type);
  // const [x, setX] = useState(zone?.x);

  function updateProp(value, propName) {
    if (zone == null) return;
    if (!value || value === "") value = 0;
    let currentZone = { ...zone };
    currentZone = _.set(currentZone, propName, parseInt(value));
    dispatch(updateZone(currentZone));
  }

  function updateStringProp(currentZone, value, propName) {
    if (zone == null) return;
    if (!value || value === "") value = 0;
    // const currentZone = { ...zone };
    currentZone[propName] = value;
    dispatch(updateZone(currentZone));
  }

  function updatePropBoolean(currentZone, value, propName) {
    currentZone[propName] = Boolean(value);
    dispatch(updateZone(currentZone));
  }

  return (
    <Grid container spacing={2}>
      <Grid item sm={8} textAlign={"start"}>
        <Typography variant="h5" component="h5">
          Zone Property
        </Typography>
      </Grid>
      <Grid item sm={4} textAlign={"end"}>
        <IconButton
          onClick={(e) => {
            dispatch(copyZoneProperties(zone.key));
          }}
        >
          <ContentCopyIcon />
        </IconButton>
        <IconButton
          disabled={contantsType !== ContentType.ZoneProperties}
          onClick={(e) => {
            dispatch(pasteZoneProperties(zone.key));
          }}
        >
          <ContentPasteIcon />
        </IconButton>
      </Grid>
      <Grid item sm={12}>
        <FormControl fullWidth>
          <InputLabel>Lane Direction</InputLabel>
          <Select
            fullWidth
            size="small"
            label="Lane Direction"
            value={zone.laneDirection}
            onChange={(e) => {
              let currentZone = { ...zone };
              updateStringProp(currentZone, e.target.value, "laneDirection");
            }}
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
          disabled
          value={zone.capacity}
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
            value={zone.localtionType}
            onChange={(e) => {
              let currentZone = { ...zone };
              if (e.target.value !== "gr_area") {
                currentZone.isConveyor = false;
              }

              updateStringProp(currentZone, e.target.value, "localtionType");
            }}
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
      {zone.localtionType === "storage" ? (
        <React.Fragment>
          <Grid item xs={12} sm={12}>
            <FormControl fullWidth>
              <InputLabel>Wall Horizontal</InputLabel>
              <Select
                fullWidth
                size="small"
                label="Wall Horizontal"
                value={zone.wallHorizontal}
                onChange={(e) => {
                  let currentZone = { ...zone };

                  updateStringProp(
                    currentZone,
                    e.target.value,
                    "wallHorizontal"
                  );
                  dispatch(updateLanesOfZone(currentZone.id));
                }}
              >
                <MenuItem value="left">Left</MenuItem>
                <MenuItem value="right">Right</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={12}>
            <FormControl fullWidth>
              <InputLabel>Wall Vertical</InputLabel>
              <Select
                fullWidth
                size="small"
                label="Wall Vertical"
                value={zone.wallVertical}
                onChange={(e) => {
                  let currentZone = { ...zone };

                  updateStringProp(currentZone, e.target.value, "wallVertical");
                  dispatch(updateLanesOfZone(currentZone.id));
                }}
              >
                <MenuItem value="top">Top</MenuItem>
                <MenuItem value="bottom">Bottom</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </React.Fragment>
      ) : null}
      <Grid item xs={12} sm={6}>
        <TextField
          label="Label X"
          fullWidth
          type="number"
          inputProps={{ step: 10 }}
          size="small"
          value={zone.labelLocationX}
          onChange={(e) => updateProp(e.target.value, "labelLocationX")}
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <TextField
          label="Label Y"
          fullWidth
          type="number"
          size="small"
          inputProps={{ step: 10 }}
          value={zone.labelLocationY}
          onChange={(e) => updateProp(e.target.value, "labelLocationY")}
        />
      </Grid>
      {zone.localtionType === "storage" ? (
        <React.Fragment>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Maker X"
              fullWidth
              type="number"
              inputProps={{ step: 10 }}
              size="small"
              value={zone.markLocationX}
              onChange={(e) => updateProp(e.target.value, "markLocationX")}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Maker Y"
              fullWidth
              type="number"
              size="small"
              inputProps={{ step: 10 }}
              value={zone.markLocationY}
              onChange={(e) => updateProp(e.target.value, "markLocationY")}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Progress X"
              fullWidth
              type="number"
              inputProps={{ step: 10 }}
              size="small"
              value={zone.progressX}
              onChange={(e) => updateProp(e.target.value, "progressX")}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Progress Y"
              fullWidth
              type="number"
              size="small"
              inputProps={{ step: 10 }}
              value={zone.progressY}
              onChange={(e) => updateProp(e.target.value, "progressY")}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Progress Width"
              fullWidth
              type="number"
              inputProps={{ step: 10 }}
              size="small"
              value={zone.progressWidth}
              onChange={(e) => updateProp(e.target.value, "progressWidth")}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Progress Height"
              fullWidth
              type="number"
              size="small"
              inputProps={{ step: 10 }}
              value={zone.progressHeight}
              onChange={(e) => updateProp(e.target.value, "progressHeight")}
            />
          </Grid>
        </React.Fragment>
      ) : null}
      <Grid item xs={12} sm={6}>
        <ColorField
          label="Color"
          fullWidth
          value={zone.color}
          onChange={(e) => {
            let currentZone = { ...zone };
            updateStringProp(currentZone, e, "color");
          }}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <ColorField
          label="Label Color"
          fullWidth
          value={zone.labelColor}
          onChange={(e) => {
            let currentZone = { ...zone };
            updateStringProp(currentZone, e, "labelColor");
          }}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <FormControlLabel
          control={
            <Checkbox
              checked={zone.autoGenerate}
              onChange={(e) => {
                let currentZone = { ...zone };

                if (!e.target.checked) {
                  currentZone.onlyOneSlot = false;
                }
                updatePropBoolean(
                  currentZone,
                  e.target.checked,
                  "autoGenerate"
                );
              }}
            />
          }
          label="Auto Generate"
        />
      </Grid>

      <Grid item xs={12} sm={6}>
        <FormControlLabel
          control={
            <Checkbox
              checked={zone.onlyOneSlot}
              onChange={(e) => {
                updatePropBoolean({ ...zone }, e.target.checked, "onlyOneSlot");
              }}
            />
          }
          label="Only One Slot"
        />
      </Grid>

      {zone.localtionType === "gr_area" && (
        <Grid item xs={12} sm={6}>
          <FormControlLabel
            control={
              <Checkbox
                checked={zone.isConveyor}
                onChange={(e) => {
                  updatePropBoolean(
                    { ...zone },
                    e.target.checked,
                    "isConveyor"
                  );
                }}
              />
            }
            label="Is Conveyor"
          />
        </Grid>
      )}

      <Grid item xs={12} sm={6}>
        <Button
          variant="contained"
          onClick={() => dispatch(generateByZone(zone.id))}
        >
          Genarate
        </Button>
      </Grid>
      <Grid item xs={12} sm={6}>
        <Button
          variant="contained"
          onClick={() => dispatch(updateLanesOfZone(zone.id))}
        >
          Update Lane
        </Button>
      </Grid>
      {zone.localtionType === "storage" ? (
        <React.Fragment>
          <Grid item xs={12} sm={6}>
            <Button
              variant="contained"
              onClick={() => dispatch(makerToCenter(zone.id))}
            >
              Auto Maker
            </Button>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Button
              variant="contained"
              onClick={() => dispatch(progressAdjust(zone.id))}
            >
              Auto Progress
            </Button>
          </Grid>
        </React.Fragment>
      ) : null}
    </Grid>
  );
}
