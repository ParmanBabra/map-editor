import "./App.css";


import Designer from "./components/Designer";
import ToolsBar from "./components/ToolsBar";
import PropertyEditor from "./components/PropertyEditor";

function App() {
  return (
    <div
      className="App"
    >
      <ToolsBar />
      <Designer />
      <PropertyEditor />
    </div>
  );
}

export default App;
