import React, { Fragment, useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import "./Grid.css";

export default function Grid({ map }) {
  const vLine = [];
  const hLine = [];
  let counting = 0;

  for (var i = 0; i < map.size.height; i += map.snapGrid[0]) {
    if (counting % 5 === 0) {
      vLine.push({
        x1: 0,
        y1: i,
        x2: map.size.width,
        y2: i,
        className: "hard-line",
      });
    } else {
      vLine.push({
        x1: 0,
        y1: i,
        x2: map.size.width,
        y2: i,
        className: "line",
      });
    }

    counting++;
  }

  counting = 0;
  for (var i = 0; i < map.size.width; i += map.snapGrid[1]) {
    if (counting % 5 === 0) {
      hLine.push({
        x1: i,
        y1: 0,
        x2: i,
        y2: map.size.height,
        className: "hard-line",
      });
    } else {
      hLine.push({
        x1: i,
        y1: 0,
        x2: i,
        y2: map.size.height,
        className: "line",
      });
    }
    counting++;
  }

  return (
    <svg width={map.size.width} height={map.size.height}>
      {vLine.map((item, index) => (
        <line
          key={`V${index}`}
          x1={item.x1}
          y1={item.y1}
          x2={item.x2}
          y2={item.y2}
          className={item.className}
        />
      ))}

      {hLine.map((item, index) => (
        <line
          key={`H${index}`}
          x1={item.x1}
          y1={item.y1}
          x2={item.x2}
          y2={item.y2}
          className={item.className}
        />
      ))}
    </svg>
  );
}
