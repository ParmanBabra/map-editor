import React, { Fragment, useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import { useSelector, useDispatch } from "react-redux";

import { update } from "./../reducers/map-management";

import CommonProp from "./CommonProp";
import MapProp from "./MapProp";
import ZoneProp from "./ZoneProp";

import "./PropertyEditor.css";

export default function PropertyEditor(props) {
  const zones = useSelector((state) => state.mapManagement.zones);
  const map = useSelector((state) => state.mapManagement.map);
  const defaultValues = useSelector((state) => state.mapManagement.default);
  const selections = useSelector((state) => state.selection.selections);
  const isMap = useSelector((state) => state.selection.isMap);

  let zone = null;
  let type = null;

  if (selections.length > 0) {
    zone = zones[selections[0].id];
    type = selections[0].type;
  }

  if (isMap) {
    return (
      <div className="tools">
        <MapProp map={map} defaultValus={defaultValues} />
      </div>
    );
  }

  if (!zone) {
    return <Fragment></Fragment>;
  }

  function renderProps(zone) {
    if (type === "zone") {
      return <ZoneProp selecting={zone} />;
    }
  }

  return (
    <div className="tools">
      <CommonProp selecting={zone} />
      {renderProps(zone)}
    </div>
  );
}
