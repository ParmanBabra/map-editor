import React, { useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";

import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Menu from "@mui/material/Menu";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";
import ListItemIcon from "@mui/material/ListItemIcon";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import EditIcon from "@mui/icons-material/Edit";
import EditOffIcon from "@mui/icons-material/EditOff";

import {
  saveLocal,
  loadLocal,
  saveJson,
  loadJson,
  exportSql,
  updateMap,
  importLanes,
} from "./../reducers/map-management";
import {
  importShipToGroup,
  save,
  load,
  exportSql as exportSqlShipToGroup,
} from "./../reducers/ship-to-group-management";
import { selectMap, changeEditorMode } from "./../reducers/selection";
import { EditorMode } from "./../helper/constants";
import selectFiles from "select-files";

import LoadLocalDialog from "./LoadLocalDialog";
import ExportDialog from "./ExportDialog";

export default function ToolsBar(props) {
  const map = useSelector((state) => state.mapManagement.map);
  const currentLayer = useSelector((state) => state.selection.currentLayer);

  const [anchorElFile, setAnchorElFile] = useState(null);
  const [anchorElMap, setAnchorElMap] = useState(null);
  const [anchorElEditor, setAnchorElEditor] = useState(null);

  const [openExport, setOpenExport] = useState(false);
  const [exportSQLs, setExportSQLs] = useState([]);
  const [openLoad, setOpenLoad] = useState(false);

  const dispatch = useDispatch();

  const handleOpenNavFile = (event) => {
    setAnchorElFile(event.currentTarget);
  };

  const handleCloseNavFile = () => {
    setAnchorElFile(null);
  };

  const handleOpenNavMap = (event) => {
    setAnchorElMap(event.currentTarget);
  };

  const handleCloseNavMap = () => {
    setAnchorElMap(null);
  };

  const handleOpenNavEditor = (event) => {
    setAnchorElEditor(event.currentTarget);
  };

  const handleCloseNavEditor = () => {
    setAnchorElEditor(null);
  };

  const handleClickExport = async () => {
    let sqls = await dispatch(exportSql());
    handleCloseNavFile();

    setOpenExport(true);
    setExportSQLs(sqls.payload);
  };

  const handleClickShipToGroupExport = async () => {
    let sqls = await dispatch(exportSqlShipToGroup());
    handleCloseNavFile();

    setOpenExport(true);
    setExportSQLs(sqls.payload);
  };

  const handleClickOpenLoad = () => {
    setAnchorElFile(null);
    setOpenLoad(true);
  };

  const handleCloseLoad = async (value) => {
    setOpenLoad(false);
    if (!value) return;

    let result = await dispatch(loadLocal(value)).unwrap();

    dispatch(load(result.map.warehouseId));
  };

  const handleUpdateMap = (value, fieldName) => {
    setAnchorElMap(null);

    let currentMap = { ...map };

    currentMap[fieldName] = value;
    dispatch(updateMap(currentMap));
  };

  const handleClickLoadJson = async () => {
    setAnchorElFile(null);
    let files = await selectFiles({ accept: ".json" });

    dispatch(loadJson(files[0]));
  };

  const handleClickLoadLanes = async () => {
    setAnchorElFile(null);
    let files = await selectFiles({ accept: ".csv" });

    dispatch(importLanes({ file: files[0], layer: currentLayer }));
  };

  const handleClickLoadShipToGroups = async () => {
    setAnchorElFile(null);
    let files = await selectFiles({ accept: ".csv" });

    dispatch(importShipToGroup(files[0]));
  };

  const renderVisibility = (value) => {
    if (!value)
      return (
        <ListItemIcon>
          <VisibilityOffIcon />
        </ListItemIcon>
      );

    return (
      <ListItemIcon>
        <VisibilityIcon />
      </ListItemIcon>
    );
  };

  const rendeFreezing = (value) => {
    if (value)
      return (
        <ListItemIcon>
          <EditOffIcon />
        </ListItemIcon>
      );

    return (
      <ListItemIcon>
        <EditIcon />
      </ListItemIcon>
    );
  };

  return (
    <AppBar position="static">
      <Container>
        <Toolbar disableGutters>
          <Box sx={{ flexGrow: 1, display: { xs: "flex" } }}>
            <Button
              sx={{ color: "white", display: "block" }}
              onClick={handleOpenNavFile}
            >
              File
            </Button>
            <Button
              sx={{ color: "white", display: "block" }}
              onClick={handleOpenNavMap}
            >
              Map
            </Button>

            <Button
              sx={{ color: "white", display: "block" }}
              onClick={handleOpenNavEditor}
            >
              Editors
            </Button>

            <Menu
              id="menu-appbar"
              anchorEl={anchorElFile}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElFile)}
              onClose={handleCloseNavFile}
            >
              <MenuItem>New</MenuItem>
              <Divider light />
              <MenuItem
                onClick={(e) => {
                  handleCloseNavFile();
                  dispatch(saveLocal());
                  dispatch(save(map.warehouseId));
                }}
              >
                Save
              </MenuItem>
              <MenuItem
                onClick={(e) => {
                  handleCloseNavFile();
                  dispatch(saveJson());
                }}
              >
                Save Json
              </MenuItem>
              <MenuItem onClick={(e) => handleClickOpenLoad()}>Load</MenuItem>
              <MenuItem onClick={(e) => handleClickLoadJson()}>
                Load Json
              </MenuItem>
              <MenuItem onClick={(e) => handleClickLoadLanes()}>
                Load Lanes CSV
              </MenuItem>
              <MenuItem onClick={(e) => handleClickLoadShipToGroups()}>
                Load Ship To Group CSV
              </MenuItem>
              <Divider light />
              <MenuItem onClick={handleClickExport}>Export SQL</MenuItem>
              <MenuItem onClick={handleClickShipToGroupExport}>
                Export Ship To Group SQL
              </MenuItem>
            </Menu>

            <Menu
              id="menu-appbar"
              anchorEl={anchorElMap}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElMap)}
              onClose={handleCloseNavMap}
            >
              <MenuItem
                onClick={(e) => {
                  handleUpdateMap(!map.showGrid, "showGrid");
                }}
              >
                {renderVisibility(map.showGrid)}
                Show Grid
              </MenuItem>

              <MenuItem
                onClick={(e) => {
                  handleUpdateMap(!map.showZone, "showZone");
                }}
              >
                {renderVisibility(map.showZone)}
                Show Zone
              </MenuItem>

              <MenuItem
                onClick={(e) => {
                  handleUpdateMap(!map.showLane, "showLane");
                }}
              >
                {renderVisibility(map.showLane)}
                Show Lane
              </MenuItem>

              <MenuItem
                onClick={(e) => {
                  handleUpdateMap(!map.showSlot, "showSlot");
                }}
              >
                {renderVisibility(map.showSlot)}
                Show Slot
              </MenuItem>

              <MenuItem
                onClick={(e) => {
                  handleUpdateMap(!map.showMaker, "showMaker");
                }}
              >
                {renderVisibility(map.showMaker)}
                Show Maker
              </MenuItem>

              <MenuItem
                onClick={(e) => {
                  handleUpdateMap(!map.showProgress, "showProgress");
                }}
              >
                {renderVisibility(map.showProgress)}
                Show Progress
              </MenuItem>

              <MenuItem
                onClick={(e) => {
                  handleUpdateMap(!map.showZoneRealColor, "showZoneRealColor");
                }}
              >
                {renderVisibility(map.showZoneRealColor)}
                Show Zone Color
              </MenuItem>

              <MenuItem
                onClick={(e) => {
                  handleUpdateMap(!map.showLaneRealColor, "showLaneRealColor");
                }}
              >
                {renderVisibility(map.showLaneRealColor)}
                Show Lane Color
              </MenuItem>

              <Divider light />
              <MenuItem
                onClick={(e) => {
                  handleUpdateMap(!map.freezingZone, "freezingZone");
                }}
              >
                {rendeFreezing(map.freezingZone)}
                Freezing Zone
              </MenuItem>

              <MenuItem
                onClick={(e) => {
                  handleUpdateMap(!map.freezingLane, "freezingLane");
                }}
              >
                {rendeFreezing(map.freezingLane)}
                Freezing Lane
              </MenuItem>

              <MenuItem
                onClick={(e) => {
                  handleUpdateMap(!map.freezingSlot, "freezingSlot");
                }}
              >
                {rendeFreezing(map.freezingSlot)}
                Freezing Slot
              </MenuItem>

              <MenuItem
                onClick={(e) => {
                  handleUpdateMap(!map.disableMove, "disableMove");
                }}
              >
                {rendeFreezing(map.disableMove)}
                Disable Move
              </MenuItem>
            </Menu>

            <Menu
              anchorEl={anchorElEditor}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElEditor)}
              onClose={handleCloseNavEditor}
            >
              <MenuItem
                onClick={(e) => {
                  handleCloseNavEditor();
                  dispatch(changeEditorMode(EditorMode.Map));
                }}
              >
                Map Information
              </MenuItem>

              <MenuItem
                onClick={(e) => {
                  handleCloseNavEditor();
                  dispatch(changeEditorMode(EditorMode.ShipToGroup));
                }}
              >
                Ship To Groups
              </MenuItem>
              <MenuItem
                onClick={(e) => {
                  handleCloseNavEditor();
                  dispatch(changeEditorMode(EditorMode.Layers));
                }}
              >
                Layers Editors
              </MenuItem>

              <MenuItem
                onClick={(e) => {
                  handleCloseNavEditor();
                  dispatch(changeEditorMode(EditorMode.MergeTool));
                }}
              >
                Merge Tool
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </Container>

      <ExportDialog
        open={openExport}
        onClose={() => setOpenExport(false)}
        exportSQLs={exportSQLs}
      />
      <LoadLocalDialog open={openLoad} onClose={handleCloseLoad} />
    </AppBar>
  );
}
