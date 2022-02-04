import { useState } from "react";
import _ from "lodash";
import { useSelector, useDispatch } from "react-redux";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialAction from "@mui/material/SpeedDialAction";
import SettingsIcon from "@mui/icons-material/Settings";
import AddIcon from "@mui/icons-material/Add";

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
  const [zoomInformation, setZoomInformation] = useState({
    scale: 1,
  });

  const dispatch = useDispatch();
  const mapSize = map.size;

  function addZone() {
    dispatch(addZone());
  }

  function renderGrid() {
    if (map.showGrid) {
      return <Grid map={map} />;
    }
  }

  return (
    <div id="map">
      <TransformWrapper
        panning={{ excluded: ["rect", "item-area"] }}
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
          onClick={(e) => addZone()}
        />
      </SpeedDial>
    </div>
  );
}
