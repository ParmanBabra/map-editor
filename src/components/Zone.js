import React, { useEffect, useRef, Fragment } from "react";
import { Rnd } from "react-rnd";
import { useSelector, useDispatch } from "react-redux";
import classnames from "classnames";

import { updateZone, deleteZone } from "./../reducers/map-management";
import { select, clear } from "./../reducers/selection";

import "./Zone.css";

export default function Zone(props) {
  const selections = useSelector((state) => state.selection.selections);
  const map = useSelector((state) => state.mapManagement.map);
  const dispatch = useDispatch();
  let radRef = useRef(null);

  const zone = { ...props.zone };
  const scale = props.scale;

  let currentZoneId = null;

  if (selections.length > 0) {
    currentZoneId = selections[0].id;
  }

  let classStyle = "rect";

  if (currentZoneId === zone.id) {
    classStyle = classnames("rect", "rect-selected");
  }

  function snapGrid(grid2D, x, y) {
    let gridX = grid2D[0];
    let gridY = grid2D[1];
    x = x - (x % gridX);
    y = y - (y % gridY);

    return [x, y];
  }

  function updateLocation(index, newX, newY) {
    let [x, y] = snapGrid(map.snapGrid, newX, newY);

    zone.x = x;
    zone.y = y;

    dispatch(select(zone));
    dispatch(updateZone(zone));

    return { x, y };
  }

  function updateSize(index, newX, newY, newWidth, newHeight) {
    let [x, y] = snapGrid(map.snapGrid, newX, newY);
    let [width, height] = snapGrid(map.snapGrid, newWidth, newHeight);

    zone.width = width;
    zone.height = height;
    zone.x = x;
    zone.y = y;

    dispatch(select(zone));
    dispatch(updateZone(zone));

    return { x, y };
  }

  function createLineLanes() {
    let maxI = zone.laneDirection === "Vertical" ? zone.width : zone.height;
    let lineLane = [];
    for (let i = 0; i <= maxI; i += zone.laneWidth) {
      if (zone.laneDirection === "Vertical") {
        lineLane.push({
          x1: i,
          y1: 0,
          x2: i,
          y2: zone.height - (zone.height % zone.slotWidth),
          className: "preview-lane-line",
        });
      } else {
        lineLane.push({
          x1: 0,
          y1: i,
          x2: zone.width - (zone.width % zone.slotWidth),
          y2: i,
          className: "preview-lane-line",
        });
      }
    }

    return lineLane;
  }

  function createSlotRect() {
    let slots = [];
    if (zone.laneDirection === "Vertical") {
      for (let i = 0; i <= zone.width - zone.laneWidth; i += zone.laneWidth) {
        for (
          let j = 0;
          j <= zone.height - zone.slotWidth;
          j += zone.slotWidth
        ) {
          slots.push({
            x: i + 0.25,
            y: j + 0.25,
            width: zone.laneWidth - 0.5,
            height: zone.slotWidth - 0.5,
            className: "preview-slot-rect",
          });
        }
      }
    } else {
      for (let i = 0; i <= zone.height - zone.laneWidth; i += zone.laneWidth) {
        for (let j = 0; j <= zone.width - zone.slotWidth; j += zone.slotWidth) {
          slots.push({
            x: j + 0.25,
            y: i + 0.25,
            width: zone.slotWidth - 0.5,
            height: zone.laneWidth - 0.5,
            className: "preview-slot-rect",
          });
        }
      }
    }

    return slots;
  }

  function renderLane(_map, _lineLane) {
    if (map.showLane) {
      return (
        <Fragment>
          {_lineLane.map((item, index) => (
            <line
              key={`L${index}`}
              x1={item.x1}
              y1={item.y1}
              x2={item.x2}
              y2={item.y2}
              className={item.className}
            />
          ))}
        </Fragment>
      );
    }
  }

  function renderSlot(_map, _rectSlot) {
    if (map.showSlot) {
      return (
        <Fragment>
          {_rectSlot.map((item, index) => (
            <rect
              key={`S${index}`}
              x={item.x}
              y={item.y}
              width={item.width}
              height={item.height}
              className={item.className}
            />
          ))}
        </Fragment>
      );
    }
  }

  function handleKeyDown(e) {
    if (e.code === "Delete") {
      dispatch(deleteZone(currentZoneId));
      dispatch(clear());
    }
  }

  useEffect(() => {
    radRef.current.updatePosition({ x: zone.x, y: zone.y });
  });

  const lineLane = createLineLanes();
  const rectSlot = createSlotRect();

  //   radRef.current.updatePosition({ x: zone.x, y: zone.y });

  return (
    <Rnd
      tabIndex={currentZoneId === zone.id ? 0 : 1}
      onKeyDown={handleKeyDown}
      className={classStyle}
      bounds=".content"
      dragGrid={map.snapGrid}
      resizeGrid={map.snapGrid}
      default={{
        x: zone.x,
        y: zone.y,
        width: zone.width,
        height: zone.height,
      }}
      //   position={{ x: zone.x, y: zone.y }}
      scale={scale}
      size={{ width: zone.width, height: zone.height }}
      onDragStop={(e, d) => {
        // console.log(d);
        const location = updateLocation(zone.id, d.x, d.y);
        radRef.current.updatePosition(location);
      }}
      onResizeStop={(e, direction, ref, delta, position) => {
        const width = parseInt(ref.style.width.replace("px", ""));
        const height = parseInt(ref.style.height.replace("px", ""));

        const location = updateSize(
          zone.id,
          position.x,
          position.y,
          width,
          height
        );

        radRef.current.updatePosition(location);
      }}
      ref={radRef}
    >
      <svg className="item-area" width="100%" height="100%">
        {renderSlot(map, rectSlot)}
        {renderLane(map, lineLane)}

        <text x="10" y="20" className="small">
          Zone : {zone.name}
        </text>
      </svg>
    </Rnd>
  );
}
