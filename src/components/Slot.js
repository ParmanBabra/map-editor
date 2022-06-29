import React, { useEffect, useRef } from "react";
import { Rnd } from "react-rnd";
import { useSelector, useDispatch } from "react-redux";
import classnames from "classnames";
import _ from "lodash";

import { updateSlot } from "./../reducers/map-management";
import { select, addSelect } from "./../reducers/selection";

import "./Slot.css";

import { rectBorder } from "./../helper/constants";

export default function Slot(props) {
  const selections = useSelector((state) => state.selection.selections);
  const map = useSelector((state) => state.mapManagement.map);
  const keys = useSelector((state) => state.keyboard.keys);
  const zoomPercent = useSelector((state) => state.selection.zoom.percent);
  const greens = useSelector((state) => state.selection.green.slots);
  const blues = useSelector((state) => state.selection.blue.slots);
  const reds = useSelector((state) => state.selection.red.slots);
  const dispatch = useDispatch();
  let radRef = useRef(null);

  const slot = { ...props.slot };
  const layer = { ...props.layer };
  const scale = props.scale;

  let borderWidth = 1;
  let classStyle = ["rect"];

  if (
    _.find(selections, function (o) {
      return o.id === slot.key && o.type === "slot";
    })
  ) {
    borderWidth =
      (rectBorder.max - rectBorder.min) * (1 - zoomPercent) + rectBorder.min;
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

    slot.x = x;
    slot.y = y;

    dispatch(updateSlot(slot));

    return { x, y };
  }

  function updateSize(index, newX, newY, newWidth, newHeight) {
    let [x, y] = snapGrid(map.snapGrid, newX, newY);
    let [width, height] = snapGrid(map.snapGrid, newWidth, newHeight);

    slot.width = width;
    slot.height = height;
    slot.x = x;
    slot.y = y;

    dispatch(updateSlot(slot));

    return { x, y };
  }

  function handleOnSelect(e) {
    if (map.freezingSlot) return;
    if (keys["Control"]) {
      dispatch(addSelect(slot));
    } else {
      dispatch(select(slot));
    }
  }

  function renderGreenOverlay(_slot) {
    if (!greens.includes(_slot.key)) {
      return;
    }

    return (
      <rect
        x="0"
        y="0"
        width={_slot.width}
        height={_slot.height}
        fill="green"
        className="green-overlay"
      />
    );
  }

  function renderBlueOverlay(_slot) {
    if (!blues.includes(_slot.key)) {
      return;
    }

    return (
      <rect
        x="0"
        y="0"
        width={_slot.width}
        height={_slot.height}
        fill="blue"
        className="green-overlay"
      />
    );
  }

  function renderRedOverlay(_slot) {
    if (!reds.includes(_slot.key)) {
      return;
    }

    return (
      <rect
        x="0"
        y="0"
        width={_slot.width}
        height={_slot.height}
        fill="red"
        className="green-overlay"
      />
    );
  }

  useEffect(() => {
    radRef.current.updatePosition({ x: slot.x, y: slot.y });
  });

  return (
    <Rnd
      disableDragging={map.freezingSlot || map.disableMove}
      enableResizing={!map.freezingZone && !map.disableMove}
      className={classnames(classStyle)}
      bounds=".content"
      style={{
        borderWidth: `${borderWidth}px`,
        opacity: layer.opacity
      }}
      dragGrid={map.snapGrid}
      resizeGrid={map.snapGrid}
      default={{
        x: slot.x,
        y: slot.y,
        width: slot.width,
        height: slot.height,
      }}
      //   position={{ x: zone.x, y: zone.y }}
      scale={scale}
      size={{ width: slot.width, height: slot.height }}
      onDragStop={(e, d) => {
        // console.log(d);
        const location = updateLocation(slot.key, d.x, d.y);
        radRef.current.updatePosition(location);
      }}
      onResizeStop={(e, direction, ref, delta, position) => {
        const width = parseInt(ref.style.width.replace("px", ""));
        const height = parseInt(ref.style.height.replace("px", ""));

        const location = updateSize(
          slot.key,
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
      <svg
        className="item-area"
        style={{
          marginTop: `-${borderWidth}px`,
          marginLeft: `-${borderWidth}px`,
        }}
        width={slot.width}
        height={slot.height}
      >
        {renderGreenOverlay(slot)}
        {renderBlueOverlay(slot)}
        {renderRedOverlay(slot)}
        <text x="10" y="20" className="small">
          Slot : {slot.name}
        </text>
      </svg>
    </Rnd>
  );
}
