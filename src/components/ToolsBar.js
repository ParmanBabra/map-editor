import React, { useState, Fragment } from "react";
import { useSelector, useDispatch } from "react-redux";

import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import Divider from "@mui/material/Divider";

import {
  saveLocal,
  loadLocal,
  saveJson,
  exportSql,
} from "./../reducers/map-management";
import { selectMap } from "./../reducers/selection";

import LoadLocalDialog from "./LoadLocalDialog";
import ExportDialog from "./ExportDialog";

export default function ToolsBar(props) {
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
                  handleCloseNavMap();
                  dispatch(saveLocal());
                }}
              >
                Save
              </MenuItem>
              <MenuItem
                onClick={(e) => {
                  handleCloseNavMap();
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
