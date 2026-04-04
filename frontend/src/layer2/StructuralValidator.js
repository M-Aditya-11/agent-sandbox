export function validateStructure(resolvedAgents = []) {
  const errors = [];

  // Rule 1: no suspended agents (checked via registry lifecycle_state)
  resolvedAgents.forEach(agent => {
    if (agent.lifecycle_state === "Suspended") {
      errors.push(`Suspended agent detected: ${agent.id}`);
    }
  });

  // Rule 2: no duplicates
  const ids = resolvedAgents.map(a => a.id);
  const unique = new Set(ids);
  if (unique.size !== ids.length) {
    errors.push("Duplicate agents detected");
  }

  // Rule 3: Risk Evaluator (id:3) cannot directly precede Text Summarizer (id:1)
  for (let i = 0; i < resolvedAgents.length - 1; i++) {
    if (resolvedAgents[i].id === 3 && resolvedAgents[i + 1].id === 1) {
      errors.push("Invalid chaining: Risk Evaluator cannot precede Text Summarizer");
    }
  }

  // Rule 4: Workflow Router (id:6) cannot directly precede Data Formatter (id:2)
  for (let i = 0; i < resolvedAgents.length - 1; i++) {
    if (resolvedAgents[i].id === 6 && resolvedAgents[i + 1].id === 2) {
      errors.push("Invalid chaining: Workflow Router cannot precede Data Formatter");
    }
  }

  return {
    valid: errors.length === 0,
    errors
  };
}