export function simulateGovernance({ actor, action, resource, context }) {

  const request = {
    actor,
    action,
    resource,
    context
  };

  // deterministic rules
  let response = "deny"; //  fail-closed default

  // Rule 1 — task routing allowed
  if (action === "task.route") {
    response = "allow";
  }

  // Rule 2 — multi-agent escalation
  if (resource.length > 1) {
    response = "escalate";
  }

  // Rule 3 — system actor deny
  if (actor === "system") {
    response = "deny";
  }

  return {
    request,
    response
  };
}