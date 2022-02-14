import React, { useState } from "react";
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
} from "./../reducers/map-management";
import { selectMap } from "./../reducers/selection";

import LoadLocalDialog from "./LoadLocalDialog";
import ExportDialog from "./ExportDialog";

export default function ToolsBar(props) {
  const map = useSelector((state) => state.mapManagement.map);

  const [anchorElFile, setAnchorElFile] = useState(null);
  const [anchorElMap, setAnchorElMap] = useState(null);

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

  const handleCloseLoad = (value) => {
    setOpenLoad(false);
    if (!value) return;

    dispatch(loadLocal(value));
  };

  const handleUpdateMap = (value, fieldName) => {
    setAnchorElMap(null);

    let currentMap = { ...map };

    currentMap[fieldName] = value;
    dispatch(updateMap(currentMap));
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
