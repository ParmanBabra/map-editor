import { useState, useEffect } from "react";
import _ from "lodash";
import { useSelector, useDispatch } from "react-redux";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialAction from "@mui/material/SpeedDialAction";
import SettingsIcon from "@mui/icons-material/Settings";
import AddIcon from "@mui/icons-material/Add";

import {
  addZone,
  addLane,
  deleteZones,
  deleteLanes,
  deleteSlots,
  addZoneWithSelections,
} from "./../reducers/map-management";
import {
  clear,
  selectWithRect,
  updateZoomScale,
} from "./../reducers/selection";

import Grid from "./Grid";
import "./Designer.css";
import Zone from "./Zone";
import Lane from "./Lane";
import Slot from "./Slot";

export default function Designer(props) {
  const zones = useSelector((state) => state.mapManagement.zones);
  const lanes = useSelector((state) => state.mapManagement.lanes);
  const slots = useSelector((state) => state.mapManagement.slots);
  const layers = useSelector((state) => state.mapManagement.layers);
  const map = useSelector((state) => state.mapManagement.map);
  const keys = useSelector((state) => state.keyboard.keys);
  const mouse = useSelector((state) => state.keyboard.mouse);
  const selections = useSelector((state) => state.selection.selections);
  const currentLayer = useSelector((state) => state.selection.currentLayer);

  const [zoomInformation, setZoomInformation] = useState({
    scale: 1,
  });

  // const [selectRect, setSelectRect] = useState({
  //   x1: null,
  //   y1: null,
  //   x2: null,
  //   y2: null,
  // });

  // const [dragging, setDragging] = useState(false);

  const [canPanning, setCanPanning] = useState(true);

  const dispatch = useDispatch();
  const mapSize = map.size;

  function handleAddZone() {
    dispatch(addZone({ currentLayer }));
  }

  function handleAddLane() {
    dispatch(addLane({ currentLayer }));
  }

  function handleGroupZone() {
    dispatch(addZoneWithSelections({ selections, layer: currentLayer }));
  }

  function renderGrid() {
    if (map.showGrid) {
      return <Grid map={map} />;
    }
  }

  function renderZones(zones, layers, map) {
    if (!map.showZone) return;

    return _.map(zones, (zone) => {
      let layer = layers[zone.layer];

      if (!layer.visible) return;

      return (
        <Zone key={zone.id} zone={zone} scale={zoomInformation.scale} layer={layer}></Zone>
      );
    });
  }

  function renderLanes(lanes, layers, map) {
    if (!map.showLane) return;

    return _.map(lanes, (lane) => {
      let layer = layers[lane.layer];

      if (!layer.visible) return;

      return (
        <Lane key={lane.key} lane={lane} scale={zoomInformation.scale} layer={layer}></Lane>
      );
    });
  }

  function renderSlots(slots, layers, map) {
    if (!map.showSlot) return;

    return _.map(slots, (slot) => {
      let layer = layers[slot.layer];

      if (!layer.visible) return;

      return (
        <Slot key={slot.key} slot={slot} scale={zoomInformation.scale} layer={layer}></Slot>
      );
    });
  }

  useEffect(() => {
    if (keys["Delete"]) {
      if (selections.length > 0) {
        let zones = selections
          .filter((x) => x.type === "zone")
          .map((x) => x.id);

        let lanes = selections
          .filter((x) => x.type === "lane")
          .map((x) => x.id);

        let slots = selections
          .filter((x) => x.type === "slot")
          .map((x) => x.id);

        dispatch(deleteZones(zones));
        dispatch(deleteLanes(lanes));
        dispatch(deleteSlots(slots));

        dispatch(clear());
      }
    }
  }, [keys, selections, dispatch]);

  useEffect(() => {
    if (mouse[4]) {
      setCanPanning(false);
    } else {
      setCanPanning(true);
    }
  }, [mouse, dispatch]);

  useEffect(() => {
    dispatch(updateZoomScale(zoomInformation.scale));
  }, [zoomInformation]);

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
            onClick={(e) => {
              dispatch(clear());
            }}
            // onMouseUp={handleMouseUp}
            // onMouseMove={handleMouseMove}
            // onMouseDown={handleMouseDown}
          ></div>

          {renderGrid()}

          {renderZones(zones, layers, map)}

          {renderLanes(lanes, layers, map)}

          {renderSlots(slots, layers, map)}

          {/* {renderSelectRect()} */}

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

        <SpeedDialAction
          icon={<AddIcon />}
          tooltipTitle="Add Lane"
          onClick={(e) => handleAddLane()}
        />

        <SpeedDialAction
          icon={<AddIcon />}
          tooltipTitle="Group Zone"
          onClick={(e) => handleGroupZone()}
        />

        <SpeedDialAction icon={<AddIcon />} tooltipTitle="Add Slot" />
      </SpeedDial>
    </div>
  );
}
