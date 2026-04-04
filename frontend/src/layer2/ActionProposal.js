import { validateStructure } from "./StructuralValidator";
import { simulateGovernance } from "./GovernanceHandshake";
import { RegistryInterface } from "../registry/RegistryInterface.js";

export function buildActionProposal({
  actor,
  action,
  agents,
  context = {}
}) {

  // registry interface usage — resolve all agent IDs
  const resolved = agents.map((id) => RegistryInterface.getAgentById(id));

  // fail closed — any unresolved agent blocks the proposal
  if (resolved.includes(null)) {
    return {
      approved: false,
      actor,
      action,
      agents,
      sequence: [...agents],
      constraints: {
        lifecycle_valid: false,
        governance_status: "deny"
      },
      context,
      reason: "Agent not found in registry"
    };
  }

  // structural validation — pass resolved agent objects
  const validation = validateStructure(resolved);

  // governance handshake
  const governance = simulateGovernance({
    actor,
    action,
    resource: agents,
    context
  });

  const approved =
    validation.valid &&
    governance.response === "allow";

  return {
    approved,
    actor,
    action,
    agents,
    sequence: [...agents],
    constraints: {
      lifecycle_valid: validation.valid,
      governance_status: governance.response
    },
    context,
    reason: approved
      ? "Validation passed and governance allowed"
      : "Rejected by Layer-2 decision engine"
  };
}