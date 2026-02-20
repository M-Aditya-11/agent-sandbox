import React from "react";

const ChainPreview = ({ selectedAgents }) => {
  return (
    <div className="chain-preview">
      <h3>🔗 Chain Preview</h3>

      {selectedAgents.length === 0 ? (
        <p className="chain-empty">No agents in chain.</p>
      ) : (
        <div className="chain-flow">
          {selectedAgents.map((agent, index) => (
            <React.Fragment key={agent.id}>
              <div className="chain-node">
                {agent.name}
              </div>

              {index !== selectedAgents.length - 1 && (
                <div className="chain-arrow">→</div>
              )}
            </React.Fragment>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChainPreview;