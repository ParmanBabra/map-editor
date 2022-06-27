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
  generateByLane,
  addPriority,
  deletePriority,
  updatePriority,
  pasteLanePriorites,
  pasteLaneProperties,
} from "./../reducers/map-management";
import { ContentType, ShipToGroupType } from "./../helper/constants";

import { copyLanePriorites, copyLaneProperties } from "./../reducers/selection";

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

export default function LaneProp(props) {
  const shipToGroups = useSelector(
    (state) => state.shipToGroupsManagement.shipToGroups
  );

  const contantsType = useSelector((state) => state.selection.contents.type);

  let lane = props.selecting;
  let priorites = _.values(lane.priorites);
  let selectedShipToGroups = priorites.map((item) => item.shipToGroup);

  const dispatch = useDispatch();
  const [showPriorites, setShowPriorites] = useState(false);

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
      <Grid item sm={8} textAlign={"start"}>
        <Typography variant="h5" component="h5">
          Lane Property
        </Typography>
      </Grid>
      <Grid item sm={4} textAlign={"end"}>
        <IconButton
          onClick={(e) => {
            dispatch(copyLaneProperties(lane.key));
          }}
        >
          <ContentCopyIcon />
        </IconButton>
        <IconButton
          disabled={contantsType !== ContentType.LaneProperties}
          onClick={(e) => {
            dispatch(pasteLaneProperties(lane.key));
          }}
        >
          <ContentPasteIcon />
        </IconButton>
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
        <FormControlLabel
          control={
            <Checkbox
              checked={lane.onlyOneSlot}
              onChange={(e) =>
                updatePropBoolean(e.target.checked, "onlyOneSlot")
              }
            />
          }
          label="Only One Slot"
        />
      </Grid>
      {lane.zone_id ? (
        <Grid item xs={12} sm={12} textAlign={"start"}>
          <Button
            variant="contained"
            onClick={() => dispatch(generateByLane(lane.key))}
          >
            Genarate
          </Button>
        </Grid>
      ) : null}
      <Grid item sm={4} textAlign={"start"}>
        <Typography variant="h5" component="h5">
          Priorites
        </Typography>
      </Grid>
      <Grid item sm={8} textAlign={"end"}>
        <IconButton
          onClick={(e) => {
            dispatch(copyLanePriorites(lane.key));
          }}
        >
          <ContentCopyIcon />
        </IconButton>
        <IconButton
          disabled={contantsType !== ContentType.LanePriorites}
          onClick={(e) => {
            dispatch(pasteLanePriorites(lane.key));
          }}
        >
          <ContentPasteIcon />
        </IconButton>
        <IconButton
          onClick={(e) => {
            dispatch(addPriority(lane.key));
          }}
        >
          <AddIcon />
        </IconButton>
        <ExpandMore
          expand={showPriorites}
          onClick={() => {
            setShowPriorites(!showPriorites);
          }}
        >
          <ExpandMoreIcon />
        </ExpandMore>
      </Grid>

      <Grid item xs={12} sm={12}>
        <Collapse in={showPriorites} timeout="auto" unmountOnExit>
          <TableContainer component={Paper}>
            <Table size="small" aria-label="a dense table">
              <TableBody>
                {_.values(lane.priorites).map((row, index) => {
                  let shipColor = Color("#FFFFFF");
                  if (row.shipToGroup && row.type) {
                    let selectingShipToGroup = shipToGroups[row.shipToGroup];
                    if (row.type == ShipToGroupType.PM) {
                      shipColor = Color(selectingShipToGroup.pmColor);
                    } else {
                      shipColor = Color(selectingShipToGroup.ppColor);
                    }
                  }

                  let textShipColor = shipColor.grayscale().negate();

                  return (
                    <TableRow
                      key={row.key}
                      sx={{
                        "&:last-child td, &:last-child th": { border: 0 },
                      }}
                    >
                      <TableCell
                        sx={tableCellSX}
                        align="center"
                        component="th"
                        scope="row"
                      >
                        {index + 1}
                      </TableCell>
                      <TableCell sx={tableCellSX}>
                        <FormControl sx={{ width: 120 }} size="small">
                          <InputLabel>Ship Group</InputLabel>
                          <Select
                            inputProps={{
                              sx: {
                                backgroundColor: shipColor.hex(),
                                color: textShipColor.hex(),
                              },
                            }}
                            label="Ship Group"
                            value={
                              row.shipToGroup == null ? "" : row.shipToGroup
                            }
                            onChange={(e) => {
                              let priority = { ...lane.priorites[row.key] };
                              priority.shipToGroup =
                                e.target.value == "" ? null : e.target.value;
                              dispatch(
                                updatePriority({
                                  id: lane.key,
                                  key: row.key,
                                  data: priority,
                                })
                              );
                            }}
                          >
                            <MenuItem value="">
                              <em>None</em>
                            </MenuItem>
                            {_.values(shipToGroups).map((item) => {
                              return (
                                <MenuItem
                                  key={item.id}
                                  disabled={selectedShipToGroups.includes(
                                    item.id
                                  )}
                                  value={item.id}
                                >
                                  [{item.id}] {item.name}
                                </MenuItem>
                              );
                            })}
                          </Select>
                        </FormControl>
                      </TableCell>
                      <TableCell sx={tableCellSX}>
                        <FormControl sx={{ width: 80 }} size="small">
                          <InputLabel>PP/PM</InputLabel>
                          <Select
                            label="PP/PM"
                            value={row.type == null ? "" : row.type}
                            onChange={(e) => {
                              let priority = { ...lane.priorites[row.key] };
                              priority.type =
                                e.target.value == "" ? null : e.target.value;
                              dispatch(
                                updatePriority({
                                  id: lane.key,
                                  key: row.key,
                                  data: priority,
                                })
                              );
                            }}
                          >
                            <MenuItem value="">
                              <em>None</em>
                            </MenuItem>
                            <MenuItem value={"10"}>PP</MenuItem>
                            <MenuItem value={"20"}>PM</MenuItem>
                          </Select>
                        </FormControl>
                      </TableCell>
                      <TableCell sx={{ ...tableCellSX, ...{ width: 40 } }}>
                        <IconButton
                          size="small"
                          onClick={(e) => {
                            dispatch(
                              deletePriority({ id: lane.key, key: row.key })
                            );
                          }}
                        >
                          <RemoveIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Collapse>
      </Grid>
    </Grid>
  );
}
