import React from "react";
import AgentCard from "./AgentCard";

const AgentList = ({
  agents,
  selectedAgentIds,
  setSelectedAgentIds,
  simulateRefusal,
  agentRuntime,
}) => {

  const toggleAgent = (agentId) => {

    const isRefused =
      simulateRefusal && agentId === 3;

    if (isRefused) return;

    setSelectedAgentIds((prev) =>
      prev.includes(agentId)
        ? prev.filter((id) => id !== agentId)
        : [...prev, agentId]
    );
  };

  return (
    <div className="grid">
      {agents.map((agent) => {
        const isSelected = selectedAgentIds.includes(agent.id);

        return (
          <AgentCard
            key={agent.id}
            agent={agent}
            runtime={agentRuntime[agent.id]}
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