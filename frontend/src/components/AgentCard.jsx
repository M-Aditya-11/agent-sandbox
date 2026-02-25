import React, { useState } from "react";
import { LIFECYCLE_STATES } from "../registry/AgentContract";

const AgentCard = ({
  agent,
  isSelected,
  onToggle,
  isRefused,
  load,   // ✅ receive number directly
}) => {
  const isDisabled =
    agent.lifecycle_state === LIFECYCLE_STATES.SUSPENDED;

  const [showWhy, setShowWhy] = useState(false);

  const handleClick = () => {
    if (!isDisabled && !isRefused) {
      onToggle();
    }
  };

  const toggleWhy = (e) => {
    e.stopPropagation();
    setShowWhy(!showWhy);
  };

  return (
    <div
      className={`card 
        ${isSelected ? "selected" : ""} 
        ${isDisabled ? "disabled" : ""} 
        ${isRefused ? "governance-refused" : ""}
      `}
      onClick={handleClick}
    >
      <h3>{agent.name}</h3>
      <p>{agent.description}</p>

      <p className="authority">
        <strong>Authority:</strong> {agent.authority_scope}
      </p>

      <div className="meta">
        <span
          className={`lifecycle_state ${agent.lifecycle_state.toLowerCase()}`}
        >
          {agent.lifecycle_state}
        </span>
        <span className="load">
          Load: {load ?? 0}%
        </span>
      </div>

      <div className="why-toggle" onClick={toggleWhy}>
        {showWhy
          ? "▲ Hide explanation"
          : "▼ Why this agent exists"}
      </div>

      {showWhy && (
        <div className="why-section">
          {agent.why_exists}
        </div>
      )}

      {isDisabled && (
        <div className="refusal">
          ⚠ Agent Suspended
        </div>
      )}

      {isRefused && (
        <div className="governance-refusal">
          🚫 Governance Refused<br />
          Not eligible in current context
        </div>
      )}
    </div>
  );
};

export default AgentCard;