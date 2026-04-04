import { buildActionProposal } from "./ActionProposal.js";

const proposal = buildActionProposal({
  actor: "intent-router",
  action: "task.route",
  agents: ["6"],
  context: { task: "summarize-and-format" }
});

console.log(proposal);