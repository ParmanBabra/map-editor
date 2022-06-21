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
  exportSql,
  updateMap,
  importLanes,
} from "./../reducers/map-management";
import {
  importShipToGroup,
  save,
  load,
} from "./../reducers/ship-to-group-management";
import { selectMap } from "./../reducers/selection";
import selectFiles from "select-files";

import LoadLocalDialog from "./LoadLocalDialog";
import ExportDialog from "./ExportDialog";
import ShipToGroupDialog from "./ShipToGroupDialog";

export default function ToolsBar(props) {
  const map = useSelector((state) => state.mapManagement.map);

  const [anchorElFile, setAnchorElFile] = useState(null);
  const [anchorElMap, setAnchorElMap] = useState(null);

  const [openExport, setOpenExport] = useState(false);
  const [exportSQLs, setExportSQLs] = useState([]);
  const [openLoad, setOpenLoad] = useState(false);
  const [openShipToGroup, setOpenShipToGroup] = useState(false);

  const dispatch = useDispatch();

  const handleCloseShipToGroup = (e) => {
    setOpenShipToGroup(false);
  };

  const handleOpenShipToGroup = (e) => {
    setAnchorElMap(null);
    setOpenShipToGroup(true);
  };

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

  const handleClickExport = async () => {
    let sqls = await dispatch(exportSql());
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

  const handleClickLoadLanes = async () => {
    setAnchorElFile(null);
    let files = await selectFiles({ accept: ".csv" });

    dispatch(importLanes(files[0]));
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
              <MenuItem>Load Json</MenuItem>
              <MenuItem onClick={(e) => handleClickLoadLanes()}>
                Load Lanes CSV
              </MenuItem>
              <MenuItem onClick={(e) => handleClickLoadShipToGroups()}>
                Load Ship To Group CSV
              </MenuItem>
              <Divider light />
              <MenuItem onClick={handleClickExport}>Export SQL</MenuItem>
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
                  handleCloseNavMap();
                  dispatch(selectMap());
                }}
              >
                Map Information
              </MenuItem>

              <MenuItem onClick={(e) => handleOpenShipToGroup()}>
                Ship To Groups
              </MenuItem>
              <Divider light />
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
          </Box>
        </Toolbar>
      </Container>

      <ExportDialog
        open={openExport}
        onClose={() => setOpenExport(false)}
        exportSQLs={exportSQLs}
      />
      <LoadLocalDialog open={openLoad} onClose={handleCloseLoad} />

      <ShipToGroupDialog
        open={openShipToGroup}
        onClose={handleCloseShipToGroup}
      />
    </AppBar>
  );
}
