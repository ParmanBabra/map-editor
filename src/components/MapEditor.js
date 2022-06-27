import React from "react";
import Paper from "@mui/material/Paper";
import Slide from "@mui/material/Slide";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

import { useDispatch, useSelector } from "react-redux";

import { updateMap, updateDefault } from "../reducers/map-management";

import { EditorMode } from "../helper/constants";
import { changeEditorMode } from "../reducers/selection";

import "./MapEditor.css";

export default function MapProp(props) {
  const map = useSelector((state) => state.mapManagement.map);
  const defaultValues = useSelector((state) => state.mapManagement.default);

  const dispatch = useDispatch();

  const mode = useSelector((state) => state.selection.editor_mode);
  // const [x, setX] = useState(zone?.x);

  function updateSize(value, propName) {
    // if (map == null) return;
    if (!value || value === "") value = 0;

    const currentSize = { ...map.size };
    const currentGrid = { ...map };
    currentSize[propName] = parseFloat(value);
    currentGrid.size = currentSize;
    dispatch(updateMap(currentGrid));
  }

  function updateSnapGrid(value, propName) {
    // if (map == null) return;
    if (!value || value === "") value = 0;

    const currentSnapGrid = [...map.snapGrid];
    const currentGrid = { ...map };
    currentSnapGrid[propName] = parseFloat(value);
    currentGrid.snapGrid = currentSnapGrid;
    dispatch(updateMap(currentGrid));
  }

  function updatePropBoolean(value, propName) {
    // if (map == null) return;
    // if (!value || value === "") value = 0;
    const currentGrid = { ...map };
    currentGrid[propName] = Boolean(value);
    dispatch(updateMap(currentGrid));
  }

  function updatePropString(value, propName) {
    // if (map == null) return;
    // if (!value || value === "") value = 0;
    const current = { ...map };
    current[propName] = value;
    dispatch(updateMap(current));
  }

  function updatePropNumber(value, propName) {
    if (!value || value === "") value = 0;
    const current = { ...map };
    current[propName] = parseInt(value);
    dispatch(updateMap(current));
  }

  function updateDefaultString(value, propName) {
    // if (map == null) return;
    // if (!value || value === "") value = 0;
    const current = { ...defaultValues };
    current[propName] = value;
    dispatch(updateDefault(current));
  }

  function updateDefaultPropNumber(value, propName) {
    if (!value || value === "") value = 0;
    const current = { ...defaultValues };
    current[propName] = parseInt(value);
    dispatch(updateDefault(current));
  }

  const handleCloseEditor = () => {
    dispatch(changeEditorMode(EditorMode.None));
  };

  return (
    <div className="map-editor">
      <Slide
        direction="right"
        in={mode === EditorMode.Map}
        mountOnEnter
        unmountOnExit
      >
        <Paper elevation={3} sx={{ p: 3 }} className="paper">
          <Grid container spacing={2}>
            <Grid item sm={6} textAlign={"start"}>
              <Typography variant="h5" component="h5">
                Map Property
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

            <Grid item xs={12} sm={12}>
              <TextField
                label="Map Name"
                fullWidth
                size="small"
                value={map.name}
                onChange={(e) => updatePropString(e.target.value, "name")}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Map Id"
                fullWidth
                size="small"
                value={map.id}
                onChange={(e) => updatePropString(e.target.value, "id")}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Warehouse Id"
                fullWidth
                size="small"
                value={map.warehouseId}
                onChange={(e) =>
                  updatePropNumber(e.target.value, "warehouseId")
                }
              />
            </Grid>
            <Grid item xs={12} sm={12}>
              <TextField
                label="Update By"
                fullWidth
                size="small"
                value={map.updateBy}
                onChange={(e) => updatePropNumber(e.target.value, "updateBy")}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Width"
                fullWidth
                size="small"
                value={map.size.width}
                onChange={(e) => updateSize(e.target.value, "width")}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Height"
                fullWidth
                size="small"
                value={map.size.height}
                onChange={(e) => updateSize(e.target.value, "height")}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Snap X"
                fullWidth
                size="small"
                value={map.snapGrid[0]}
                onChange={(e) => updateSnapGrid(e.target.value, 0)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Snap Y"
                fullWidth
                size="small"
                value={map.snapGrid[1]}
                onChange={(e) => updateSnapGrid(e.target.value, 1)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Text Size"
                fullWidth
                size="small"
                value={map.zoneTextSize}
                onChange={(e) =>
                  updatePropNumber(e.target.value, "zoneTextSize")
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Maker Size"
                fullWidth
                size="small"
                value={map.makerSize}
                onChange={(e) => updatePropNumber(e.target.value, "makerSize")}
              />
            </Grid>

            <Grid item xs={12} sm={12} textAlign={"start"}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={map.showGrid}
                    onChange={(e) =>
                      updatePropBoolean(e.target.checked, "showGrid")
                    }
                  />
                }
                label="Show Grid"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={map.showZone}
                    onChange={(e) =>
                      updatePropBoolean(e.target.checked, "showZone")
                    }
                  />
                }
                label="Show Zone"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={map.showLane}
                    onChange={(e) =>
                      updatePropBoolean(e.target.checked, "showLane")
                    }
                  />
                }
                label="Show Lane"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={map.showSlot}
                    onChange={(e) =>
                      updatePropBoolean(e.target.checked, "showSlot")
                    }
                  />
                }
                label="Show Slot"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={map.showMaker}
                    onChange={(e) =>
                      updatePropBoolean(e.target.checked, "showMaker")
                    }
                  />
                }
                label="Show Maker"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={map.showProgress}
                    onChange={(e) =>
                      updatePropBoolean(e.target.checked, "showProgress")
                    }
                  />
                }
                label="Show Progress"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={map.showZoneRealColor}
                    onChange={(e) =>
                      updatePropBoolean(e.target.checked, "showZoneRealColor")
                    }
                  />
                }
                label="Show Zone Color"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={map.showLaneRealColor}
                    onChange={(e) =>
                      updatePropBoolean(e.target.checked, "showLaneRealColor")
                    }
                  />
                }
                label="Show Lane Color"
              />
            </Grid>
            <Grid item xs={12} sm={12} textAlign={"start"}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={map.isRequestForkliftGRProduction}
                    onChange={(e) =>
                      updatePropBoolean(
                        e.target.checked,
                        "isRequestForkliftGRProduction"
                      )
                    }
                  />
                }
                label="Request Forklift GR Production"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={map.isRequestForkliftGRStoPo}
                    onChange={(e) =>
                      updatePropBoolean(
                        e.target.checked,
                        "isRequestForkliftGRStoPo"
                      )
                    }
                  />
                }
                label="Request Forklift GR Sto/Po"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={map.isRequestForkliftGI}
                    onChange={(e) =>
                      updatePropBoolean(e.target.checked, "isRequestForkliftGI")
                    }
                  />
                }
                label="Request Forklift GI"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={map.isTrackingLocation}
                    onChange={(e) =>
                      updatePropBoolean(e.target.checked, "isTrackingLocation")
                    }
                  />
                }
                label="Tracking Location"
              />
            </Grid>

            <Grid item xs={12} sm={12} textAlign={"start"}>
              <Typography variant="h5" component="h5">
                Default Valus
              </Typography>
            </Grid>
            <Grid item xs={12} sm={12}>
              <TextField
                label="Zone Name Format"
                fullWidth
                size="small"
                value={defaultValues.zoneNameFormat}
                onChange={(e) =>
                  updateDefaultString(e.target.value, "zoneNameFormat")
                }
              />
            </Grid>
            <Grid item xs={12} sm={12}>
              <TextField
                label="Lane Name Format"
                fullWidth
                size="small"
                value={defaultValues.laneNameFormat}
                onChange={(e) =>
                  updateDefaultString(e.target.value, "laneNameFormat")
                }
              />
            </Grid>
            <Grid item xs={12} sm={12}>
              <TextField
                label="Slot Name Format"
                fullWidth
                size="small"
                value={defaultValues.slotNameFormat}
                onChange={(e) =>
                  updateDefaultString(e.target.value, "slotNameFormat")
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Default Lane Width"
                fullWidth
                size="small"
                value={defaultValues.laneWidth}
                onChange={(e) =>
                  updateDefaultPropNumber(e.target.value, "laneWidth")
                }
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Default Slot Width"
                fullWidth
                size="small"
                value={defaultValues.slotWidth}
                onChange={(e) =>
                  updateDefaultPropNumber(e.target.value, "slotWidth")
                }
              />
            </Grid>
          </Grid>
        </Paper>
      </Slide>
    </div>
  );
}
