import React from "react";
import AgentCard from "./AgentCard";

const AgentList = ({
  agents,
  selectedAgentIds,
  selectAgent,
  deselectAgent,
  simulateRefusal,
  runtimeLoadById,
}) => {
  const toggleAgent = (agentId) => {
    const isRefused =
      simulateRefusal && agentId === 3;

    if (isRefused) return;

    if (selectedAgentIds.includes(agentId)) {
      deselectAgent(agentId);
    } else {
      selectAgent(agentId);
    }
  };

  return (
    <div className="grid">
      {agents.map((agent) => {
        const isSelected =
          selectedAgentIds.includes(agent.id);

        // Correct runtime value (number)
        const load =
          runtimeLoadById?.[agent.id] ?? 0;

        return (
          <AgentCard
            key={agent.id}
            agent={agent}
            load={load}   // ✅ pass number
            isSelected={isSelected}
            onToggle={() => toggleAgent(agent.id)}
            isRefused={
              simulateRefusal && agent.id === 3
            }
          />
        );
      })}
    </div>
  );
};

export default AgentList;