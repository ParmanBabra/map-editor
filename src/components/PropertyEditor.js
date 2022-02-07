import React, { Fragment, useState } from "react";
import { useSelector } from "react-redux";

import Paper from "@mui/material/Paper";
import Slide from "@mui/material/Slide";

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

  function renderAnotherProps(zone) {
    if (type === "zone") {
      return <ZoneProp selecting={zone} />;
    }
  }

  function renderProps(showMap, selection) {
    if (showMap) {
      return <MapProp map={map} defaultValus={defaultValues} />;
    }

    if (selection) {
      return (
        <Fragment>
          <CommonProp selecting={zone} />
          {renderAnotherProps(zone)}
        </Fragment>
      );
    }
  }

  if (!zone && !isMap) {
    return <Fragment></Fragment>;
  }

  return (
    <div className="editor">
      <Slide direction="left" in={true} mountOnEnter unmountOnExit>
        <Paper elevation={3} sx={{ p: 3 }}>
          {renderProps(isMap, zone)}
        </Paper>
      </Slide>
    </div>
  );
}
