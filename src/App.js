import "./App.css";

import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";


import Designer from "./components/Designer";
import ToolsBar from "./components/ToolsBar";
import PropertyEditor from "./components/PropertyEditor";
import LayersEditor from "./components/LayersEditor";
import MergeTool from "./components/MergeTool";

import { up, down, mouseDown, mouseUp } from "./reducers/keyboard-management";

function App() {
  const dispatch = useDispatch();

  const handleKeyDown = (e) => {
    dispatch(down(e.key));
  };

  const handleKeyUp = (e) => {
    dispatch(up(e.key));
  };

  const handleMouseDown = (e) => {
    dispatch(mouseDown(e.buttons));
  };
  const handleMouseUp = (e) => {
    dispatch(mouseUp());
  };

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);

    return function cleanup() {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
    };
  });
  return (
    <div
      className="App"
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
    >
      <ToolsBar />
      <Designer />
      <PropertyEditor />
      <LayersEditor />
      <MergeTool />
    </div>
  );
}

export default App;
