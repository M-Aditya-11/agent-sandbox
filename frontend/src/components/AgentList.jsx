import React from "react";
import AgentCard from "./AgentCard";

const AgentList = ({
  agents,
  selectedAgents,
  setSelectedAgents,
  simulateRefusal,
}) => {

  const toggleAgent = (agent) => {

    const isRefused =
      simulateRefusal && agent.id === 3;

    if (isRefused) return;

    const exists = selectedAgents.find((a) => a.id === agent.id);

    if (exists) {
      setSelectedAgents(
        selectedAgents.filter((a) => a.id !== agent.id)
      );
    } else {
      setSelectedAgents([...selectedAgents, agent]);
    }
  };

  return (
    <div className="grid">
      {agents.map((agent) => (
        <AgentCard
          key={agent.id}
          agent={agent}
          isSelected={selectedAgents.some((a) => a.id === agent.id)}
          onToggle={toggleAgent}
          isRefused={
            simulateRefusal && agent.id === 3
          }
        />
      ))}
    </div>
  );
};

export default AgentList;