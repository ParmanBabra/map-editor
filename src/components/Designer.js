import { useState } from "react";
import _ from "lodash";
import { useSelector, useDispatch } from "react-redux";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialAction from "@mui/material/SpeedDialAction";
import SettingsIcon from "@mui/icons-material/Settings";
import AddIcon from "@mui/icons-material/Add";
import MapSharpIcon from "@mui/icons-material/MapSharp";
import SaveIcon from "@mui/icons-material/Save";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import PlaylistAddCheckIcon from "@mui/icons-material/PlaylistAddCheck";

import {
  add,
  saveLocal,
  loadLocal,
  saveJson,
  exportSql,
} from "./../reducers/map-management";
import { selectMap } from "./../reducers/selection";

import Grid from "./Grid";
import "./Designer.css";
import Zone from "./Zone";
import LoadLocalDialog from "./LoadLocalDialog";
import ExportDialog from "./ExportDialog";

export default function Designer(props) {
  const zones = useSelector((state) => state.mapManagement.zones);
  const map = useSelector((state) => state.mapManagement.map);
  const selections = useSelector((state) => state.selection.selections);
  const [zoomInformation, setZoomInformation] = useState({
    scale: 1,
  });

  const [openLoad, setOpenLoad] = useState(false);
  const [openExport, setOpenExport] = useState(false);
  const [exportSQLs, setExportSQLs] = useState([]);

  const dispatch = useDispatch();
  const mapSize = map.size;

  function addZone() {
    dispatch(add());
  }

  function renderGrid() {
    if (map.showGrid) {
      return <Grid map={map} />;
    }
  }

  const handleClickOpen = () => {
    setOpenLoad(true);
  };

  const handleClose = (value) => {
    setOpenLoad(false);
    if (!value) return;

    dispatch(loadLocal(value));
  };

  const handleClickExport = async () => {
    let sqls = await dispatch(exportSql());
    setOpenExport(true);
    setExportSQLs(sqls.payload);
  };

  return (
    <div
      id="map"
      
    >
      <TransformWrapper
        panning={{ excluded: ["rect", "item-area"] }}
        minScale={0.2}
        maxScale={8}
        centerZoomedOut={true}
        onZoomStop={(e) => {
          setZoomInformation({
            scale: e.state.scale,
          });
        }}
      >
        <TransformComponent
          wrapperClass="wrapper"
          contentClass="content"
          contentStyle={{
            width: `${mapSize.width}px`,
            height: `${mapSize.height}px`,
          }}
        >
          {renderGrid()}

          {_.map(zones, (zone) => {
            return (
              <Zone
                key={zone.id}
                zone={zone}
                scale={zoomInformation.scale}
              ></Zone>
            );
          })}

          <h1 className="map-name">Map : {map.name}</h1>
        </TransformComponent>
      </TransformWrapper>

      <SpeedDial
        ariaLabel="SpeedDial basic example"
        sx={{ position: "absolute", bottom: 16, right: 16 }}
        icon={<SettingsIcon />}
      >
        <SpeedDialAction
          icon={<PlaylistAddCheckIcon />}
          tooltipTitle="Export"
          onClick={(e) => handleClickExport()}
        />
        <SpeedDialAction
          icon={<SaveIcon />}
          tooltipTitle="Save"
          onClick={(e) => dispatch(saveLocal())}
        />
        <SpeedDialAction
          icon={<SaveIcon />}
          tooltipTitle="Save Json"
          onClick={(e) => dispatch(saveJson())}
        />
        <SpeedDialAction
          icon={<FileUploadIcon />}
          tooltipTitle="Load"
          onClick={(e) => handleClickOpen()}
        />
        <SpeedDialAction
          icon={<MapSharpIcon />}
          tooltipTitle="Map Infomation"
          onClick={(e) => dispatch(selectMap())}
        />
        <SpeedDialAction
          icon={<AddIcon />}
          tooltipTitle="Add Zone"
          onClick={(e) => addZone()}
        />
      </SpeedDial>

      <LoadLocalDialog open={openLoad} onClose={handleClose} />
      <ExportDialog
        open={openExport}
        onClose={() => setOpenExport(false)}
        exportSQLs={exportSQLs}
      />
    </div>
  );
}
