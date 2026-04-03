import { buildActionProposal } from "./ActionProposal.js";

const proposal = buildActionProposal({
  actor: "intent-router",
  action: "weather.fetch",
  agents: ["weather.agent"],
  context: { city: "Mumbai" }
});

console.log(proposal);