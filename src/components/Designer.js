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
import { clear, selectWithRect } from "./../reducers/selection";

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
    dispatch(addZone());
  }

  function handleAddLane() {
    dispatch(addLane());
  }

  function handleGroupZone() {
    dispatch(addZoneWithSelections(selections));
  }

  // const handleMouseDown = (e) => {
  //   if (e.buttons !== 1) return;

  //   setSelectRect({
  //     x1: e.nativeEvent.offsetX,
  //     y1: e.nativeEvent.offsetY,
  //     x2: e.nativeEvent.offsetX,
  //     y2: e.nativeEvent.offsetY,
  //   });
  //   setDragging(true);
  //   return true;
  // };
  // const handleMouseMove = (e) => {
  //   if (!dragging) return; //Not Start

  //   setSelectRect({
  //     x1: selectRect.x1,
  //     y1: selectRect.y1,
  //     x2: e.nativeEvent.offsetX,
  //     y2: e.nativeEvent.offsetY,
  //   });
  //   return true;
  // };
  // const handleMouseUp = (e) => {
  //   let zoneElements = _.map(zones, (item) => ({
  //     key: item.key,
  //     id: item.id,
  //     type: item.type,
  //     x: item.x,
  //     y: item.y,
  //     width: item.width,
  //     height: item.height,
  //   }));

  //   let laneElements = _.map(lanes, (item) => ({
  //     key: item.key,
  //     id: item.id,
  //     type: item.type,
  //     x: item.x,
  //     y: item.y,
  //     width: item.width,
  //     height: item.height,
  //   }));

  //   let slotElements = _.map(slots, (item) => ({
  //     key: item.key,
  //     id: item.id,
  //     type: item.type,
  //     x: item.x,
  //     y: item.y,
  //     width: item.width,
  //     height: item.height,
  //   }));

  //   let rect = {
  //     x: Math.min(selectRect.x1, selectRect.x2),
  //     y: Math.min(selectRect.y1, selectRect.y2),
  //     width:
  //       Math.max(selectRect.x1, selectRect.x2) -
  //       Math.min(selectRect.x1, selectRect.x2),
  //     height:
  //       Math.max(selectRect.y1, selectRect.y2) -
  //       Math.min(selectRect.y1, selectRect.y2),
  //   };

  //   let elements = _.union(zoneElements, laneElements, slotElements);

  //   if (rect.width !== 0 && rect.height !== 0) {
  //     dispatch(
  //       selectWithRect({
  //         elements: elements,
  //         rect: rect,
  //       })
  //     );
  //   }

  //   setSelectRect({
  //     x1: null,
  //     y1: null,
  //     x2: null,
  //     y2: null,
  //   });

  //   setDragging(false);
  //   return true;
  // };

  function renderGrid() {
    if (map.showGrid) {
      return <Grid map={map} />;
    }
  }

  function renderZones(zones, map) {
    if (!map.showZone) return;

    return _.map(zones, (zone) => {
      return (
        <Zone key={zone.id} zone={zone} scale={zoomInformation.scale}></Zone>
      );
    });
  }

  function renderLanes(lanes, map) {
    if (!map.showLane) return;

    return _.map(lanes, (lane) => {
      return (
        <Lane key={lane.key} lane={lane} scale={zoomInformation.scale}></Lane>
      );
    });
  }

  function renderSlots(slots, map) {
    if (!map.showSlot) return;

    return _.map(slots, (slot) => {
      return (
        <Slot key={slot.key} slot={slot} scale={zoomInformation.scale}></Slot>
      );
    });
  }

  // function renderSelectRect() {
  //   if (!dragging) return;

  //   return (
  //     <Fragment>
  //       <div
  //         className="selection-rect"
  //         onMouseUp={handleMouseUp}
  //         style={{
  //           top: Math.min(selectRect.y1, selectRect.y2),
  //           left: Math.min(selectRect.x1, selectRect.x2),
  //           width:
  //             Math.max(selectRect.x1, selectRect.x2) -
  //             Math.min(selectRect.x1, selectRect.x2),
  //           height:
  //             Math.max(selectRect.y1, selectRect.y2) -
  //             Math.min(selectRect.y1, selectRect.y2),
  //         }}
  //       ></div>
  //     </Fragment>
  //   );
  // }

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

          {renderZones(zones, map)}

          {renderLanes(lanes, map)}

          {renderSlots(slots, map)}

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
