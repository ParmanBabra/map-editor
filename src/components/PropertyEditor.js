import React, { Fragment, useState } from "react";
import { useSelector } from "react-redux";

import Paper from "@mui/material/Paper";
import Slide from "@mui/material/Slide";

import CommonProp from "./CommonProp";
import ZoneProp from "./ZoneProp";
import LaneProp from "./LaneProp";

import "./PropertyEditor.css";

export default function PropertyEditor(props) {
  const zones = useSelector((state) => state.mapManagement.zones);
  const lanes = useSelector((state) => state.mapManagement.lanes);
  const slots = useSelector((state) => state.mapManagement.slots);

  const selections = useSelector((state) => state.selection.selections);

  let selecting = null;
  let type = null;

  if (selections.length > 0) {
    type = selections[0].type;

    if (type === "zone") {
      selecting = zones[selections[0].id];
    } else if (type === "lane") {
      selecting = lanes[selections[0].id];
    } else if (type === "slot") {
      selecting = slots[selections[0].id];
    }
  }

  function renderAnotherProps(selecting) {
    if (type === "zone") {
      return <ZoneProp selecting={selecting} />;
    } else if (type === "lane") {
      return <LaneProp selecting={selecting} />;
    }
  }

  function renderProps(selection) {
    if (selection) {
      return (
        <Fragment>
          <CommonProp selecting={selection} />
          {renderAnotherProps(selection)}
        </Fragment>
      );
    }
  }

  if (!selecting) {
    return <Fragment></Fragment>;
  }

  return (
    <div className="editor">
      <Slide direction="left" in={true} mountOnEnter unmountOnExit>
        <Paper elevation={3} sx={{ p: 3 }} className="paper">
          {renderProps(selecting)}
        </Paper>
      </Slide>
    </div>
  );
}
