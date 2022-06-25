import React, { useEffect, useRef, Fragment } from "react";
import { Rnd } from "react-rnd";
import { useSelector, useDispatch } from "react-redux";
import classnames from "classnames";
import _ from "lodash";

import { updateLane, updateZoneOfLane } from "./../reducers/map-management";
import { select, addSelect } from "./../reducers/selection";

import "./Lane.css";

import { rectBorder } from "./../helper/constants";

export default function Lane(props) {
  const selections = useSelector((state) => state.selection.selections);
  const map = useSelector((state) => state.mapManagement.map);
  const shipToGroups = useSelector(
    (state) => state.shipToGroupsManagement.shipToGroups
  );
  const zone = useSelector(
    (state) => state.mapManagement.zones[props.lane.zone_id]
  );
  const keys = useSelector((state) => state.keyboard.keys);
  const zoomPercent = useSelector((state) => state.selection.zoom.percent);
  const greens = useSelector((state) => state.selection.green.lanes);
  const blues = useSelector((state) => state.selection.blue.lanes);
  const reds = useSelector((state) => state.selection.red.lanes);
  const dispatch = useDispatch();
  let radRef = useRef(null);

  const lane = { ...props.lane };
  const layer = { ...props.layer };
  const scale = props.scale;
  const color = getShipToGroupColor(lane, shipToGroups);
  let borderWidth = 1;

  let classStyle = ["rect"];

  if (
    _.find(selections, function (o) {
      return o.id === lane.key && o.type === "lane";
    })
  ) {
    borderWidth =
      (rectBorder.max - rectBorder.min) * (1 - zoomPercent) + rectBorder.min;
    classStyle.push("rect-selected");
  }

  if (map.freezingZone) {
    classStyle.push("react-freezing");
  }

  function getShipToGroupColor(_lane, _shipToGroups) {
    let priorites = _.values(_lane.priorites);
    let firstShipToGroup = null;

    if (priorites.length > 0) {
      const firstPriority = _.values(_lane.priorites)[0];
      firstShipToGroup = _shipToGroups[firstPriority.shipToGroup];
    }

    if (firstShipToGroup) {
      return `${firstShipToGroup.color}AA`;
    } else {
      return `#FFFFFF96`;
    }
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

  function createSlotRect(_zone) {
    let slots = [];

    if (!_zone) return slots;

    if (_zone.laneDirection === "Vertical") {
      for (
        let j = 0;
        j <= lane.height - _zone.slotWidth;
        j += _zone.slotWidth
      ) {
        slots.push({
          x: 0.25,
          y: j + 0.25,
          width: lane.width - 0.5,
          height: _zone.slotWidth - 0.5,
          className: "preview-slot-rect",
        });
      }
    } else {
      for (let j = 0; j <= lane.width - _zone.slotWidth; j += _zone.slotWidth) {
        slots.push({
          x: j + 0.25,
          y: 0 + 0.25,
          width: _zone.slotWidth - 0.5,
          height: lane.height - 0.5,
          className: "preview-slot-rect",
        });
      }
    }

    return slots;
  }

  function renderGreenOverlay(_lane) {
    if (!greens.includes(_lane.key)) {
      return;
    }

    return (
      <rect
        x="0"
        y="0"
        width={_lane.width}
        height={_lane.height}
        fill="green"
        className="green-overlay"
      />
    );
  }

  function renderBlueOverlay(_lane) {
    if (!blues.includes(_lane.key)) {
      return;
    }

    return (
      <rect
        x="0"
        y="0"
        width={_lane.width}
        height={_lane.height}
        fill="blue"
        className="green-overlay"
      />
    );
  }

  function renderRedOverlay(_lane) {
    if (!reds.includes(_lane.key)) {
      return;
    }

    return (
      <rect
        x="0"
        y="0"
        width={_lane.width}
        height={_lane.height}
        fill="red"
        className="green-overlay"
      />
    );
  }

  function renderSlot(_map, _zone, _rectSlot) {
    if (!_zone) {
      return <Fragment />;
    }

    if (lane.autoGenerate) {
      if (lane.onlyOneSlot) {
        return (
          <Fragment>
            <rect
              key={`S${1}`}
              x={0.25}
              y={0.25}
              width={lane.width - 2.5}
              height={lane.height - 2.5}
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

  const rectSlot = createSlotRect(zone);

  useEffect(() => {
    radRef.current.updatePosition({ x: lane.x, y: lane.y });
  });

  return (
    <Rnd
      disableDragging={map.freezingLane || map.disableMove}
      enableResizing={!map.freezingLane || map.disableMove}
      className={classnames(classStyle)}
      style={{
        borderWidth: `${borderWidth}px`,
        backgroundColor: map.showLaneRealColor ? `${color}` : `#FFFFFF96`,
        opacity: layer.opacity
      }}
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
      <svg
        className="item-area"
        style={{
          marginTop: `-${borderWidth}px`,
          marginLeft: `-${borderWidth}px`,
        }}
        width={lane.width}
        height={lane.height}
      >
        {renderGreenOverlay(lane)}
        {renderBlueOverlay(lane)}
        {renderRedOverlay(lane)}

        {renderSlot(map, zone, rectSlot)}
        <text x="10" y="20" className="small">
          Lane : {lane.name}
        </text>
      </svg>
    </Rnd>
  );
}
