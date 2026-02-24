import React from "react";
import { AgentRegistry } from "./registry/AgentRegistry";
import AgentList from "./components/AgentList";
import ChainVisualizer from "./components/ChainVisualizer";
import SelectionBucket from "./components/SelectionBucket";
import ChainPreview from "./components/ChainPreview";
import { useSession } from "./session/useSession";
import { LIFECYCLE_STATES } from "./registry/AgentContract";
import "./App.css";

function App() {
  // Session Layer (Layer-3 Runtime State)
  const {
    state,
    selectAgent,
    deselectAgent,
    setRuntimeLoad,
  } = useSession();

  // UI-only toggle (not part of registry or session)
  const [simulateRefusal, setSimulateRefusal] = React.useState(false);

  // Derive selected agents from immutable registry
  const selectedAgents = AgentRegistry.filter((agent) =>
    state.selectedAgentIds.includes(agent.id)
  );

  // Only ACTIVE agents are selectable
  const visibleAgents = AgentRegistry.filter(
    (agent) =>
      agent.lifecycle_state === LIFECYCLE_STATES.ACTIVE
  );

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
            onChange={() =>
              setSimulateRefusal(!simulateRefusal)
            }
          />
          Simulate Governance Refusal (UI Only)
        </label>
      </div>

      <h2>Agent Registry</h2>
      <AgentList
        agents={visibleAgents}
        selectedAgentIds={state.selectedAgentIds}
        selectAgent={selectAgent}
        deselectAgent={deselectAgent}
        simulateRefusal={simulateRefusal}
        runtimeLoadById={state.runtimeLoadById}
      />

      <SelectionBucket
        selectedAgents={selectedAgents}
        deselectAgent={deselectAgent}
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