import React from "react";

const SystemContextBanner = ({
  simulateRefusal,
  registryVersion = "v1.0",
  mutationEnabled = false,
}) => {
  const governanceMode = simulateRefusal ? "Simulation" : "Live";

  return (
    <div className="system-banner">
      <div className="system-header">
        <span>System Context</span>
      </div>

      <div className="system-meta">
        <div className="system-item">
          <span className="label">Governance Mode : </span>
          <span
            className={`value pill ${
              simulateRefusal ? "pill-warning" : "pill-success"
            }`}
          >
            {governanceMode}
          </span>
        </div>

        <div className="system-item">
          <span className="label">Registry Version : </span>
          <span className="value pill pill-neutral">
            {registryVersion}
          </span>
        </div>

        <div className="system-item">
          <span className="label">Mutation Mode : </span>
          <span
            className={`value pill ${
              mutationEnabled ? "pill-danger" : "pill-neutral"
            }`}
          >
            {mutationEnabled ? "Enabled" : "Disabled"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default SystemContextBanner;