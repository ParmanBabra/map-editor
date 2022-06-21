import React, { useEffect, useRef, Fragment } from "react";
import { Rnd } from "react-rnd";
import { useSelector, useDispatch } from "react-redux";
import classnames from "classnames";
import _ from "lodash";
import Color from "color";

import { updateZone, updateLanesOfZone } from "./../reducers/map-management";
import { select, addSelect } from "./../reducers/selection";

import "./Zone.css";

export default function Zone(props) {
  const selections = useSelector((state) => state.selection.selections);
  const map = useSelector((state) => state.mapManagement.map);
  const keys = useSelector((state) => state.keyboard.keys);
  const dispatch = useDispatch();
  let radRef = useRef(null);

  const zone = { ...props.zone };
  const scale = props.scale;

  let classStyle = ["rect"];

  if (
    _.find(selections, function (o) {
      return o.id === zone.id && o.type === "zone";
    })
  ) {
    classStyle.push("rect-selected");
  }

  if (map.freezingZone) {
    classStyle.push("react-freezing");
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

    dispatch(updateZone(zone));
    dispatch(updateLanesOfZone(zone.id));

    return { x, y };
  }

  function updateSize(index, newX, newY, newWidth, newHeight) {
    let [x, y] = snapGrid(map.snapGrid, newX, newY);
    let [width, height] = snapGrid(map.snapGrid, newWidth, newHeight);

    zone.width = width;
    zone.height = height;
    zone.x = x;
    zone.y = y;

    dispatch(updateZone(zone));

    return { x, y };
  }

  function handleOnSelect(e) {
    if (map.freezingZone) return;

    if (keys["Control"]) {
      dispatch(addSelect(zone));
    } else {
      dispatch(select(zone));
    }
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
    if (zone.autoGenerate) {
      if (zone.onlyOneSlot) {
        return (
          <Fragment>
            <rect
              key={`S${1}`}
              x={0}
              y={0}
              width={zone.width - 1.75}
              height={zone.height - 1.75}
              className={"preview-lane-line"}
            />
            ;
          </Fragment>
        );
      } else {
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
  }

  function renderSlot(_map, _rectSlot) {
    if (zone.autoGenerate) {
      if (zone.onlyOneSlot) {
        return (
          <Fragment>
            <rect
              key={`S${1}`}
              x={0.25}
              y={0.25}
              width={zone.width - 2.5}
              height={zone.height - 2.5}
              className={"preview-slot-rect"}
            />
          </Fragment>
        );
      } else {
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
  }

  function renderWalls(_map, _zone) {
    function renderVertical(_zone) {
      if (_zone.wallVertical === "top") {
        return (
          <rect
            x="0"
            y="0"
            width={_zone.width - 2}
            height="5"
            className="wall"
          />
        );
      } else {
        return (
          <rect
            x="0"
            y={_zone.height - 7}
            width={_zone.width - 2}
            height="5"
            className="wall"
          />
        );
      }
    }

    function renderHorizontal(_zone) {
      if (_zone.wallHorizontal === "left") {
        return (
          <rect
            x="0"
            y="0"
            width="5"
            height={_zone.height - 2}
            className="wall"
          />
        );
      } else {
        return (
          <rect
            x={_zone.width - 7}
            y="0"
            width="5"
            height={_zone.height - 2}
            className="wall"
          />
        );
      }
    }

    return (
      <Fragment>
        {renderVertical(_zone)}
        {renderHorizontal(_zone)}
      </Fragment>
    );
  }

  useEffect(() => {
    radRef.current.updatePosition({ x: zone.x, y: zone.y });
  });

  const lineLane = createLineLanes();
  const rectSlot = createSlotRect();

  return (
    <Rnd
      disableDragging={map.freezingZone || map.disableMove}
      enableResizing={!map.freezingZone || map.disableMove}
      className={classnames(classStyle)}
      style={{
        backgroundColor: map.showZoneRealColor
          ? `${zone.color}FF`
          : `${zone.color}96`,
      }}
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
      onClick={(e) => handleOnSelect(e)}
      ref={radRef}
    >
      <svg className="item-area" width="100%" height="100%">
        {renderSlot(map, rectSlot)}
        {renderLane(map, lineLane)}
        {zone.localtionType === "storage" ? renderWalls(map, zone) : null}
        {zone.localtionType === "storage" && map.showMaker ? (
          <svg
            viewBox="0 0 24 24"
            width={map.makerSize}
            height={map.makerSize}
            style={{ overflow: "visible" }}
            x={zone.markLocationX}
            y={zone.markLocationY}
          >
            <path
              style={{ transform: "translate(-12px, -24px)" }}
              d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"
            ></path>
          </svg>
        ) : null}

        {zone.localtionType === "storage" && map.showProgress ? (
          <rect
            x={zone.progressX}
            y={zone.progressY}
            width={zone.progressWidth}
            height={zone.progressHeight}
            rx="20"
            ry="20"
          />
        ) : null}
        <text
          x={zone.labelLocationX}
          y={zone.labelLocationY}
          className="small lable-text"
          style={{ fontSize: `${map.zoneTextSize}px`, fill: zone.labelColor }}
        >
          Zone {zone.name}
        </text>
      </svg>
    </Rnd>
  );
}
