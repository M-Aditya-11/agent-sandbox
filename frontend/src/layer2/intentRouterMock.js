/**
 * intentRouterMock.js
 *
 * Mock output of Aditya Sawant's Deterministic Intent Router.
 * Represents the structured intent + initial agent mapping
 * that Layer-2 (Sūtradhāra) consumes as its entry point.
 *
 * Integration target: replace with live output when available.
 */

export const intentRouterOutput = Object.freeze({
  actor: "intent-router",
  action: "task.route",
  agents: ["6"],
  context: { task: "summarize-and-format" },
});
