import { useState } from "react";
import { mockAgents } from "./data/mockAgents";
import AgentList from "./components/AgentList";
import ChainVisualizer from "./components/ChainVisualizer";
import SelectionBucket from "./components/SelectionBucket";
import ChainPreview from "./components/ChainPreview";
import "./App.css";

function App() {
  const [selectedAgents, setSelectedAgents] = useState([]);

  return (
    <div className="container">
      <h1>🧠 Agent Sandbox UI</h1>

      <h2>Agent Registry</h2>
      <AgentList
        agents={mockAgents}
        selectedAgents={selectedAgents}
        setSelectedAgents={setSelectedAgents}
      />

      <SelectionBucket
        selectedAgents={selectedAgents}
        setSelectedAgents={setSelectedAgents}
      />

      <h2>Chain Visualization</h2>
      <ChainVisualizer selectedAgents={selectedAgents} />

      <h2>Chain Preview</h2>
      <ChainPreview selectedAgents={selectedAgents} />
    </div>
  );
}

export default App;