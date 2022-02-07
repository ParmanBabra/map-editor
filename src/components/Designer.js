import { useState, useEffect } from "react";
import _ from "lodash";
import { useSelector, useDispatch } from "react-redux";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialAction from "@mui/material/SpeedDialAction";
import SettingsIcon from "@mui/icons-material/Settings";
import AddIcon from "@mui/icons-material/Add";

import { addZone, deleteZones } from "./../reducers/map-management";
import { clear } from "./../reducers/selection";

import Grid from "./Grid";
import "./Designer.css";
import Zone from "./Zone";
import Lane from "./Lane";
import Slot from "./Slot";

export default function Designer(props) {
  const zones = useSelector((state) => state.mapManagement.zones);
  const lanes = useSelector((state) => state.mapManagement.lanes);
  const slots = useSelector((state) => state.mapManagement.slots);
  const map = useSelector((state) => state.mapManagement.map);
  const keys = useSelector((state) => state.keyboard.keys);
  const mouse = useSelector((state) => state.keyboard.mouse);
  const selections = useSelector((state) => state.selection.selections);

  const [zoomInformation, setZoomInformation] = useState({
    scale: 1,
  });

  const [canPanning, setCanPanning] = useState(true);

  const dispatch = useDispatch();
  const mapSize = map.size;

  function handleAddZone() {
    dispatch(addZone());
  }

  function renderGrid() {
    if (map.showGrid) {
      return <Grid map={map} />;
    }
  }

  useEffect(() => {
    if (keys["Delete"]) {
      if (selections.length > 0) {
        let zones = selections.map((x) => x.id);
        dispatch(deleteZones(zones));
        dispatch(clear());
      }
    }

    if (mouse[4]) {
      setCanPanning(false);
    }
    else {
      setCanPanning(true);
    }
  });

  console.log(canPanning);

  return (
    <div id="map">
      <TransformWrapper
        panning={{ excluded: ["rect", "item-area"], disabled: canPanning }}
        minScale={0.2}
        maxScale={8}
        centerZoomedOut={true}
        centerOnInit={true}
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
          <div
            style={{ width: "100%", height: "100%", position: "absolute" }}
            onClick={(e) => dispatch(clear())}
          ></div>
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

          {_.map(lanes, (lane) => {
            return (
              <Lane
                key={lane.key}
                lane={lane}
                scale={zoomInformation.scale}
              ></Lane>
            );
          })}

          {_.map(slots, (slot) => {
            return (
              <Slot
                key={slot.key}
                slot={slot}
                scale={zoomInformation.scale}
              ></Slot>
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
          icon={<AddIcon />}
          tooltipTitle="Add Zone"
          onClick={(e) => handleAddZone()}
        />
      </SpeedDial>
    </div>
  );
}
