import React, { useEffect, useRef } from "react";
import { Rnd } from "react-rnd";
import { useSelector, useDispatch } from "react-redux";
import classnames from "classnames";
import _ from "lodash";

import { updateLane, updateZoneOfLane } from "./../reducers/map-management";
import { select, addSelect } from "./../reducers/selection";

import "./Lane.css";

export default function Lane(props) {
  const selections = useSelector((state) => state.selection.selections);
  const map = useSelector((state) => state.mapManagement.map);
  const keys = useSelector((state) => state.keyboard.keys);
  const dispatch = useDispatch();
  let radRef = useRef(null);

  const lane = { ...props.lane };
  const scale = props.scale;

  let classStyle = ["rect"];

  if (
    _.find(selections, function (o) {
      return o.id === lane.key && o.type === "lane";
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

    lane.x = x;
    lane.y = y;

    dispatch(updateLane(lane));

    if (lane.autoAdjustZone) {
      dispatch(updateZoneOfLane(lane.key));
    }

    return { x, y };
  }

  function updateSize(index, newX, newY, newWidth, newHeight) {
    let [x, y] = snapGrid(map.snapGrid, newX, newY);
    let [width, height] = snapGrid(map.snapGrid, newWidth, newHeight);

    lane.width = width;
    lane.height = height;
    lane.x = x;
    lane.y = y;

    dispatch(updateLane(lane));

    return { x, y };
  }

  function handleOnSelect(e) {
    if (map.freezingLane) return;
    if (keys["Control"]) {
      dispatch(addSelect(lane));
    } else {
      dispatch(select(lane));
    }
  }
  useEffect(() => {
    radRef.current.updatePosition({ x: lane.x, y: lane.y });
  });

  return (
    <Rnd
      disableDragging={map.freezingLane}
      enableResizing={!map.freezingLane}
      className={classnames(classStyle)}
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
      onClick={(e) => handleOnSelect(e)}
      ref={radRef}
    >
      <svg className="item-area" width="100%" height="100%">
        <text x="10" y="20" className="small">
          Lane : {lane.name}
        </text>
      </svg>
    </Rnd>
  );
}
