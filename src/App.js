import { useState } from "react";
import { useSelector } from "react-redux";
import "./App.css";

import Designer from "./components/Designer";
import PropertyEditor from "./components/PropertyEditor";

function App() {
  return (
    <div
      className="App"
      
    >
      <Designer />
      <PropertyEditor />
    </div>
  );
}

export default App;
