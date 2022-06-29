import React, { useEffect, useRef } from "react";
import { Rnd } from "react-rnd";
import { useSelector, useDispatch } from "react-redux";
import classnames from "classnames";
import _ from "lodash";

import { updateMarker } from "./../reducers/marker";
import { select, addSelect } from "./../reducers/selection";

import "./Slot.css";

import { rectBorder } from "./../helper/constants";

export default function Marker(props) {
  const selections = useSelector((state) => state.selection.selections);
  const map = useSelector((state) => state.mapManagement.map);
  const keys = useSelector((state) => state.keyboard.keys);
  const dispatch = useDispatch();

  let radRef = useRef(null);

  const marker = { ...props.marker };
  const scale = props.scale;
  let selected = false;

  let classStyle = ["rect"];

  if (
    _.find(selections, function (o) {
      return o.id === marker.key && o.type === "marker";
    })
  ) {
    selected = true;
  }

  function snapGrid(grid2D, x, y) {
    let gridX = grid2D[0];
    let gridY = grid2D[1];
    x = Math.round(x / gridX) * gridX;
    y = Math.round(y / gridY) * gridY;

    return [x, y];
  }

  function updateLocation(index, newX, newY) {
    let [x, y] = snapGrid(map.snapGrid, newX, newY);

    marker.x = x;
    marker.y = y;

    dispatch(updateMarker(marker));

    return { newX, newY };
  }

  function handleOnSelect(e) {
    dispatch(select(marker));
  }

  useEffect(() => {
    radRef.current.updatePosition({ x: marker.x, y: marker.y });
  });

  return (
    <Rnd
      disableDragging={false}
      enableResizing={false}
      className={classnames(classStyle)}
      bounds=".content"
      dragGrid={map.snapGrid}
      resizeGrid={map.snapGrid}
      default={{
        x: marker.x,
        y: marker.y,
        width: "1px",
        height: "1px",
      }}
      position={{ x: marker.x, y: marker.y }}
      scale={scale}
      size={{ width: 1, height: 1 }}
      onDragStop={(e, d) => {
        const location = updateLocation(marker.key, d.x, d.y);
        radRef.current.updatePosition(location);
      }}
      onClick={(e) => handleOnSelect(e)}
      ref={radRef}
    >
      <svg
        viewBox="0 0 24 24"
        width={map.makerSize}
        height={map.makerSize}
        style={{ overflow: "visible", position: "relative" }}
      >
        <path
          stroke={selected ? "black" : "none"}
          fill="red"
          style={{ transform: "translate(-12px, -24px)" }}
          d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"
        ></path>
      </svg>
    </Rnd>
  );
}
