import { validateStructure } from "./StructuralValidator";
import { simulateGovernance } from "./GovernanceHandshake";

export function buildActionProposal({
  actor,
  action,
  agents,
  context = {}
}) {

  // 1. Structural validation
  const validation = validateStructure(agents);

  // 2. Governance handshake
  const governance = simulateGovernance({
    actor,
    action,
    resource: agents,
    context
  });

  // show required logs
  console.log("Governance Request:", governance.request);
  console.log("Governance Response:", governance.response);

  // 3. Decision engine
  const approved =
    validation.valid &&
    governance.response === "allow";

  // 4. Explicit reason generation
  let reason = "";

  if (!validation.valid) {
    reason = validation.errors.join(", ");
  } else if (governance.response === "deny") {
    reason = "Governance denied access";
  } else if (governance.response === "escalate") {
    reason = "Governance escalation required";
  } else {
    reason = "Validation passed and governance allowed";
  }

  return {
    approved,

    actor,

    action,

    agents: [...agents],

    sequence: [...agents],

    constraints: {
      lifecycle_valid: validation.valid,
      governance_status: governance.response
    },

    context,

    reason
  };
}