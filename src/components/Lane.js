import React, { useEffect, useRef } from "react";
import { Rnd } from "react-rnd";
import { useSelector, useDispatch } from "react-redux";
import classnames from "classnames";

import { updateLane, deleteLane } from "./../reducers/map-management";
import { select, clear } from "./../reducers/selection";

import "./Lane.css";

export default function Lane(props) {
  const selections = useSelector((state) => state.selection.selections);
  const map = useSelector((state) => state.mapManagement.map);
  const dispatch = useDispatch();
  let radRef = useRef(null);

  const lane = { ...props.lane };
  const scale = props.scale;

  let currentId = null;

  if (selections.length > 0) {
    currentId = selections[0].id;
  }

  let classStyle = "rect";

  if (currentId === lane.key) {
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

    lane.x = x;
    lane.y = y;

    dispatch(select(lane));
    dispatch(updateLane(lane));

    return { x, y };
  }

  function updateSize(index, newX, newY, newWidth, newHeight) {
    let [x, y] = snapGrid(map.snapGrid, newX, newY);
    let [width, height] = snapGrid(map.snapGrid, newWidth, newHeight);

    lane.width = width;
    lane.height = height;
    lane.x = x;
    lane.y = y;

    dispatch(select(lane));
    dispatch(updateLane(lane));

    return { x, y };
  }

  function handleKeyDown(e) {
    if (e.code === "Delete") {
      dispatch(deleteLane(lane));
      dispatch(clear());
    }
  }

  useEffect(() => {
    radRef.current.updatePosition({ x: lane.x, y: lane.y });
  });

  return (
    <Rnd
      tabIndex={currentId === lane.key ? 0 : 1}
      onKeyDown={handleKeyDown}
      className={classStyle}
      bounds=".content"
      dragGrid={map.snapGrid}
      resizeGrid={map.snapGrid}
      default={{
        x: lane.x,
        y: lane.y,
        width: lane.width,
        height: lane.height,
      }}
      //   position={{ x: zone.x, y: zone.y }}
      scale={scale}
      size={{ width: lane.width, height: lane.height }}
      onDragStop={(e, d) => {
        // console.log(d);
        const location = updateLocation(lane.key, d.x, d.y);
        radRef.current.updatePosition(location);
      }}
      onResizeStop={(e, direction, ref, delta, position) => {
        const width = parseInt(ref.style.width.replace("px", ""));
        const height = parseInt(ref.style.height.replace("px", ""));

        const location = updateSize(
          lane.key,
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

        <text x="10" y="20" className="small">
          Slot : {lane.name}
        </text>
      </svg>
    </Rnd>
  );
}
