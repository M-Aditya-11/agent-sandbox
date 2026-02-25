import React from "react";
import { AgentRegistry } from "./registry/AgentRegistry";
import AgentList from "./components/AgentList";
import ChainVisualizer from "./components/ChainVisualizer";
import SelectionBucket from "./components/SelectionBucket";
import ChainPreview from "./components/ChainPreview";
import { useSession } from "./session/useSession";
import "./App.css";

function App() {
  // Layer-3: Session Runtime Surface
  const {
    selectedAgentIds = [],
    runtimeLoadById = {},
    selectAgent,
    deselectAgent,
  } = useSession();

  // UI-only toggle
  const [simulateRefusal, setSimulateRefusal] = React.useState(false);

  // Derive selected agents
  const selectedAgents = AgentRegistry.filter((agent) =>
    selectedAgentIds.includes(agent.id)
  );

  // Show all agents (lifecycle handled inside AgentCard)
  const visibleAgents = AgentRegistry;

  return (
    <div className="container">
      <h1>🧠 Deterministic Agent Registry</h1>

      <div className="system-banner">
        <strong>Layer-2 Context:</strong> Agents are immutable capability definitions.
        Selection does not modify registry state.
      </div>

      <div className="governance-toggle">
        <label>
          <input
            type="checkbox"
            checked={simulateRefusal}
            onChange={() => setSimulateRefusal(!simulateRefusal)}
          />
          Simulate Governance Refusal (UI Only)
        </label>
      </div>

      <h2>Agent Registry</h2>
      <AgentList
        agents={visibleAgents}
        selectedAgentIds={selectedAgentIds}
        selectAgent={selectAgent}
        deselectAgent={deselectAgent}
        simulateRefusal={simulateRefusal}
        runtimeLoadById={runtimeLoadById}
      />

      <SelectionBucket
        selectedAgents={selectedAgents}
        deselectAgent={deselectAgent}
      />

      <h2>Chain Visualization</h2>
      <ChainVisualizer selectedAgents={selectedAgents} />

      <h2>Chain Preview</h2>
      <ChainPreview selectedAgents={selectedAgents} />
    </div>
  );
}

export default App;