import { validateStructure } from "./StructuralValidator";
import { buildGovernanceRequest } from "./GovernanceHandshake";
import { RegistryInterface } from "../registry/RegistryInterface.js";

export function buildActionProposal({ actor, action, agents, context = {} }) {
  const resolved = agents.map((id) => RegistryInterface.getAgentById(id));
  const structurallyValid = !resolved.includes(null) && validateStructure(resolved).valid;

  if (!structurallyValid) {
    return {
      actor,
      action,
      agents,
      sequence: [...agents],
      constraints: { lifecycle_valid: false },
      context,
      governance_request: null,
    };
  }

  return {
    actor,
    action,
    agents,
    sequence: [...agents],
    constraints: { lifecycle_valid: true },
    context,
    governance_request: buildGovernanceRequest({ actor, action, resource: agents, context }),
  };
}
