import { useState } from "react";
import { AgentRegistry } from "./registry/AgentRegistry";
import AgentList from "./components/AgentList";
import ChainVisualizer from "./components/ChainVisualizer";
import SelectionBucket from "./components/SelectionBucket";
import ChainPreview from "./components/ChainPreview";
import "./App.css";

function App() {
  // UI-only selection state (separate from registry)
  const [selectedAgentIds, setSelectedAgentIds] = useState([]);

  // UI simulation only (Layer-1 concept, not Layer-2)
  const [simulateRefusal, setSimulateRefusal] = useState(false);

  // Derive selected agents from immutable registry
  const selectedAgents = AgentRegistry.filter((agent) =>
    selectedAgentIds.includes(agent.id)
  );

  // Only Active agents should appear selectable
  const visibleAgents = AgentRegistry.filter(
    (agent) => agent.lifecycle_state === "Active"
  );

  const [agentRuntime, setAgentRuntime] = useState({
    1: { load: 12 },
    2: { load: 34 },
    3: { load: 5 },
    4: { load: 0 },
    5: { load: 18 },
  });

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
        setSelectedAgentIds={setSelectedAgentIds}
        simulateRefusal={simulateRefusal}
        agentRuntime={agentRuntime}
      />

      <SelectionBucket
        selectedAgents={selectedAgents}
        setSelectedAgentIds={setSelectedAgentIds}
        isGovernanceRefused={simulateRefusal}
      />

      <h2>Chain Visualization</h2>
      <ChainVisualizer selectedAgents={selectedAgents} />

      <h2>Chain Preview</h2>
      <ChainPreview selectedAgents={selectedAgents} />
    </div>
  );
}

export default App;