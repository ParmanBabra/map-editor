import React from "react";
import { useSelector, useDispatch } from "react-redux";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Slide from "@mui/material/Slide";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import MenuItem from "@mui/material/MenuItem";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import Slider from "@mui/material/Slider";
import Button from "@mui/material/Button";

import _ from "lodash";

import { changeEditorMode } from "./../reducers/selection";
import {
  updateParams,
  processing,
  merge,
  resetParams,
} from "./../reducers/merge-tool";
import { EditorMode, SourceMatchedLayerOptions } from "./../helper/constants";

import "./MergeTool.css";

export default function MergeTool() {
  const params = useSelector((state) => state.mergeTool.params);
  const mode = useSelector((state) => state.selection.editor_mode);
  const layers = useSelector((state) => _.values(state.mapManagement.layers));

  const dispatch = useDispatch();

  const handleCloseEditor = () => {
    dispatch(changeEditorMode(EditorMode.None));
    dispatch(resetParams());
  };

  function updatePropBoolean(value, propName) {
    const current = { ...params };
    current[propName] = Boolean(value);
    dispatch(updateParams(current));
    dispatch(processing());
  }

  function updatePropNumber(value, propName) {
    if (!value || value === "") value = 0;
    const current = { ...params };
    current[propName] = parseInt(value);
    dispatch(updateParams(current));
    dispatch(processing());
  }

  function updateDefaultString(value, propName) {
    const current = { ...params };
    current[propName] = value;
    dispatch(updateParams(current));
    dispatch(processing());
  }

  return (
    <div className="merge-tool">
      <Slide
        direction="right"
        in={mode === EditorMode.MergeTool}
        mountOnEnter
        unmountOnExit
      >
        <Paper elevation={3} sx={{ p: 3 }} className="paper">
          <Grid container spacing={2}>
            <Grid item sm={6} textAlign={"start"}>
              <Typography variant="h6" component="h6">
                Merge Tool
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
            <Grid item xs={12} sm={12} textAlign={"start"}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={params.zone}
                    onChange={(e) =>
                      updatePropBoolean(e.target.checked, "zone")
                    }
                  />
                }
                label="Zone"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={params.lane}
                    onChange={(e) =>
                      updatePropBoolean(e.target.checked, "lane")
                    }
                  />
                }
                label="Lane"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={params.slot}
                    onChange={(e) =>
                      updatePropBoolean(e.target.checked, "slot")
                    }
                  />
                }
                label="Slot"
              />
            </Grid>
            <Grid item xs={12} sm={12}>
              <FormControl fullWidth size="small">
                <InputLabel>Source</InputLabel>
                <Select
                  label="Source"
                  value={params.sourceLayer == null ? "" : params.sourceLayer}
                  onChange={(e) => {
                    updateDefaultString(
                      e.target.value === "" ? null : e.target.value,
                      "sourceLayer"
                    );
                  }}
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  {_.values(layers).map((item) => {
                    return (
                      <MenuItem
                        key={item.key}
                        disabled={[
                          params.destinationLayer,
                          params.sourceMatchedLayer,
                        ].includes(item.key)}
                        value={item.key}
                      >
                        {item.name}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={12}>
              <FormControl fullWidth size="small">
                <InputLabel>Destination</InputLabel>
                <Select
                  label="Destination"
                  value={
                    params.destinationLayer == null
                      ? ""
                      : params.destinationLayer
                  }
                  onChange={(e) => {
                    updateDefaultString(
                      e.target.value === "" ? null : e.target.value,
                      "destinationLayer"
                    );
                  }}
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  {_.values(layers).map((item) => {
                    return (
                      <MenuItem
                        key={item.key}
                        disabled={[
                          params.sourceLayer,
                          params.sourceMatchedLayer,
                        ].includes(item.key)}
                        value={item.key}
                      >
                        {item.name}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={12}>
              <FormControl fullWidth size="small">
                <InputLabel>Source Matched</InputLabel>
                <Select
                  label="Source Matched"
                  value={
                    params.sourceMatchedLayer == null
                      ? ""
                      : params.sourceMatchedLayer
                  }
                  onChange={(e) => {
                    updateDefaultString(
                      e.target.value === "" ? null : e.target.value,
                      "sourceMatchedLayer"
                    );
                  }}
                >
                  <MenuItem value={SourceMatchedLayerOptions.NewLayer}>
                    <em>New Layer</em>
                  </MenuItem>
                  <MenuItem
                    value={SourceMatchedLayerOptions.DeleteSourceElement}
                  >
                    <em>Delete Source</em>
                  </MenuItem>
                  {_.values(layers).map((item) => {
                    return (
                      <MenuItem
                        key={item.key}
                        disabled={[
                          params.destinationLayer,
                          params.sourceLayer,
                        ].includes(item.key)}
                        value={item.key}
                      >
                        {item.name}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={12}>
              <Slider
                aria-label="Threshold"
                valueLabelDisplay="auto"
                value={params.threshold}
                onChange={(e) => {
                  updatePropNumber(e.target.value, "threshold");
                }}
              />
            </Grid>
          </Grid>
          <Grid item xs={12} sm={12}>
            <Button
              variant="contained"
              disabled={!params.sourceLayer || !params.destinationLayer}
              onClick={async () => {
                await dispatch(processing());
                await dispatch(merge());
                handleCloseEditor();
              }}
            >
              Merge
            </Button>
          </Grid>
        </Paper>
      </Slide>
    </div>
  );
}
