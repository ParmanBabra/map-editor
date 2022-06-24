import React from "react";
import Paper from "@mui/material/Paper";
import Slide from "@mui/material/Slide";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import EditIcon from "@mui/icons-material/Edit";
import EditOffIcon from "@mui/icons-material/EditOff";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreVertIcon from "@mui/icons-material/MoreVert";

import { useSelector, useDispatch } from "react-redux";

import {
  deleteLayer,
  toggleLayerVisible,
  toggleLayerEditable,
  addLayer,
} from "./../reducers/map-management";
import {
  changeEditorMode,
  updateCurrentLayer,
  selectionToCurrentLayer,
} from "./../reducers/selection";
import { EditorMode } from "./../helper/constants";

import "./LayersEditor.css";
import _ from "lodash";

export default function LayersEditor() {
  const [anchorElMenu, setAnchorElMenu] = React.useState(null);
  const menuOpen = Boolean(anchorElMenu);

  const dispatch = useDispatch();
  const mode = useSelector((state) => state.selection.editor_mode);
  const currentLayer = useSelector((state) => state.selection.currentLayer);
  const layers = useSelector((state) =>
    _.orderBy(_.values(state.mapManagement.layers), "key")
  );

  const handleCloseEditor = () => {
    dispatch(changeEditorMode(EditorMode.None));
  };

  const handleMenuClick = (event) => {
    event.stopPropagation();
    setAnchorElMenu(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorElMenu(null);
  };

  return (
    <div className="layers-editor">
      <Slide
        direction="right"
        in={mode === EditorMode.Layers}
        mountOnEnter
        unmountOnExit
      >
        <Paper elevation={3} sx={{ p: 3 }} className="paper">
          <Grid container spacing={2}>
            <Grid item sm={6} textAlign={"start"}>
              <Typography variant="h6" component="h6">
                Layers Editor
              </Typography>
            </Grid>
            <Grid item sm={6} textAlign={"end"}>
              <IconButton
                aria-label="add"
                size="small"
                onClick={() => dispatch(addLayer())}
              >
                <AddIcon />
              </IconButton>
              <IconButton
                aria-label="close"
                size="small"
                onClick={handleCloseEditor}
              >
                <CloseIcon />
              </IconButton>
            </Grid>
            <Grid item sm={12}>
              <TableContainer component={Paper}>
                <Table size="small" aria-label="a dense table">
                  <TableBody>
                    {layers.map((layer) => {
                      return (
                        <TableRow
                          key={layer.key}
                          sx={{
                            "&:last-child td, &:last-child th": { border: 0 },
                            backgroundColor:
                              currentLayer === layer.key
                                ? "#cdcdcd"
                                : "#FFFFFF",
                          }}
                          onClick={() =>
                            dispatch(updateCurrentLayer(layer.key))
                          }
                        >
                          <TableCell align="left" sx={{ width: 70 }}>
                            <IconButton
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation();
                                dispatch(toggleLayerVisible(layer.key));
                              }}
                            >
                              {layer.visible === true ? (
                                <VisibilityIcon />
                              ) : (
                                <VisibilityOffIcon />
                              )}
                            </IconButton>
                            <IconButton
                              size="small"
                              onClick={(e) => {
                                e.stopPropagation();
                                dispatch(toggleLayerEditable(layer.key));
                              }}
                            >
                              {layer.editable === true ? (
                                <EditIcon />
                              ) : (
                                <EditOffIcon />
                              )}
                            </IconButton>
                          </TableCell>
                          <TableCell align="left" component="th" scope="row">
                            {layer.name}
                          </TableCell>
                          <TableCell align="center" sx={{ width: 70 }}>
                            <IconButton
                              size="small"
                              disabled={layer.isDefault}
                              onClick={(e) => {
                                e.stopPropagation();
                                dispatch(deleteLayer(layer.key));
                              }}
                            >
                              <RemoveIcon />
                            </IconButton>
                            <IconButton size="small" onClick={handleMenuClick}>
                              <MoreVertIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>

              <Menu
                id="basic-menu"
                anchorEl={anchorElMenu}
                open={menuOpen}
                onClose={handleMenuClose}
                MenuListProps={{
                  "aria-labelledby": "basic-button",
                }}
              >
                <MenuItem
                  onClick={() => {
                    handleMenuClose();
                    dispatch(selectionToCurrentLayer());
                  }}
                >
                  To Layer
                </MenuItem>
              </Menu>
            </Grid>
          </Grid>
        </Paper>
      </Slide>
    </div>
  );
}
