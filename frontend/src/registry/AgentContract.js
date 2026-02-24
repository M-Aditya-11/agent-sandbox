/**
 * AgentContract.js
 *
 * Defines the formal Layer-2 Agent Definition Contract.
 * This enforces structural integrity and immutability
 * for all registered agents.
 *
 * Layer-2 defines capability — not runtime behavior.
 */

export const LIFECYCLE_STATES = Object.freeze({
  ACTIVE: "Active",
  DEPRECATED: "Deprecated",
  SUSPENDED: "Suspended",
});

/**
 * Factory to create a deterministic, immutable Agent definition.
 * Authority fields are frozen to prevent runtime mutation.
 */
export function createAgentContract({
  id,
  name,
  description,
  authority_scope,
  capability_type,
  lifecycle_state,
  load_visibility,
  governance_eligible = true,
  why_exists,
}) {
  // Basic structural validation
  if (
    !id ||
    !name ||
    !description ||
    !authority_scope ||
    !capability_type ||
    !lifecycle_state ||
    load_visibility === undefined ||
    !why_exists
  ) {
    throw new Error("AgentContract: Missing required fields.");
  }

  if (!Object.values(LIFECYCLE_STATES).includes(lifecycle_state)) {
    throw new Error("AgentContract: Invalid lifecycle_state.");
  }

  const agent = {
    id,
    name,
    description,
    authority_scope,
    capability_type,
    lifecycle_state,
    load_visibility,
    governance_eligible,
    why_exists,
  };

  return Object.freeze(agent);
}