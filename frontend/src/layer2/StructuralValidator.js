const FORBIDDEN_CHAINS = [
  [3, 1], // Risk Evaluator cannot directly precede Text Summarizer
  [6, 2], // Workflow Router cannot directly precede Data Formatter
];

export function validateStructure(resolvedAgents = []) {
  const errors = [];

  for (const agent of resolvedAgents) {
    if (agent.lifecycle_state === "Suspended") {
      errors.push(`Suspended agent detected: ${agent.id}`);
    }
  }

  const ids = resolvedAgents.map((a) => a.id);
  if (new Set(ids).size !== ids.length) {
    errors.push("Duplicate agents detected");
  }

  for (let i = 0; i < resolvedAgents.length - 1; i++) {
    const pair = [resolvedAgents[i].id, resolvedAgents[i + 1].id];
    for (const [from, to] of FORBIDDEN_CHAINS) {
      if (pair[0] === from && pair[1] === to) {
        errors.push(
          `Invalid chaining: ${resolvedAgents[i].name} cannot precede ${resolvedAgents[i + 1].name}`
        );
      }
    }
  }

  return { valid: errors.length === 0, errors };
}
