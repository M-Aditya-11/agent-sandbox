import { describe, it, expect, vi, beforeEach } from "vitest";
import { buildActionProposal } from "./ActionProposal.js";
import { validateStructure } from "./StructuralValidator.js";
import { simulateGovernance } from "./GovernanceHandshake.js";
import { validateActionProposal } from "./validateActionProposal.js";

// Mock registry so tests are self-contained
vi.mock("../registry/RegistryInterface.js", () => ({
  RegistryInterface: {
    getAgentById: (id) => {
      const known = ["weather.agent", "planner.agent", "executor.agent", "system.agent", "user.agent"];
      return known.includes(id) ? { id, name: id } : null;
    },
  },
}));

beforeEach(() => vi.clearAllMocks());

// ─── helpers ────────────────────────────────────────────────────────────────

function base(overrides = {}) {
  return {
    actor: "intent-router",
    action: "weather.fetch",
    agents: ["weather.agent"],
    context: { city: "Mumbai" },
    ...overrides,
  };
}

// ─── TC-01  Valid case ───────────────────────────────────────────────────────

describe("TC-01 — valid single agent, allowed action", () => {
  it("returns approved=true with allow governance", () => {
    const proposal = buildActionProposal(base());

    expect(proposal.approved).toBe(true);
    expect(proposal.constraints.lifecycle_valid).toBe(true);
    expect(proposal.constraints.governance_status).toBe("allow");
    expect(proposal.reason).toBe("Validation passed and governance allowed");
    expect(validateActionProposal(proposal)).toBe(true);
  });
});

// ─── TC-02  Governance deny — unknown action ─────────────────────────────────

describe("TC-02 — governance deny: unknown action", () => {
  it("returns approved=false, governance_status=deny", () => {
    const proposal = buildActionProposal(base({ action: "data.delete" }));

    expect(proposal.approved).toBe(false);
    expect(proposal.constraints.lifecycle_valid).toBe(true);
    expect(proposal.constraints.governance_status).toBe("deny");
    expect(proposal.reason).toBe("Rejected by Layer-2 decision engine");
  });
});

// ─── TC-03  Governance deny — system actor ───────────────────────────────────

describe("TC-03 — governance deny: actor=system", () => {
  it("returns approved=false, governance_status=deny", () => {
    const proposal = buildActionProposal(base({ actor: "system" }));

    expect(proposal.approved).toBe(false);
    expect(proposal.constraints.lifecycle_valid).toBe(true);
    expect(proposal.constraints.governance_status).toBe("deny");
  });
});

// ─── TC-04  Governance escalate — multi-agent ────────────────────────────────

describe("TC-04 — governance escalate: multiple agents", () => {
  it("returns approved=false, governance_status=escalate", () => {
    const proposal = buildActionProposal(
      base({ agents: ["weather.agent", "planner.agent"] })
    );

    expect(proposal.approved).toBe(false);
    expect(proposal.constraints.lifecycle_valid).toBe(true);
    expect(proposal.constraints.governance_status).toBe("escalate");
  });
});

// ─── TC-05  Invalid structure — suspended agent ──────────────────────────────

describe("TC-05 — invalid structure: suspended agent", () => {
  it("returns lifecycle_valid=false, approved=false", () => {
    const result = validateStructure(["suspended.agent"]);

    expect(result.valid).toBe(false);
    expect(result.errors).toContain("Suspended agent detected: suspended.agent");
  });
});

// ─── TC-06  Invalid structure — duplicate agents ─────────────────────────────

describe("TC-06 — invalid structure: duplicate agents", () => {
  it("returns lifecycle_valid=false with duplicate error", () => {
    const result = validateStructure(["weather.agent", "weather.agent"]);

    expect(result.valid).toBe(false);
    expect(result.errors).toContain("Duplicate agents detected");
  });
});

// ─── TC-07  Invalid structure — executor → planner chain ─────────────────────

describe("TC-07 — invalid structure: executor.agent → planner.agent", () => {
  it("returns lifecycle_valid=false with chaining error", () => {
    const result = validateStructure(["executor.agent", "planner.agent"]);

    expect(result.valid).toBe(false);
    expect(result.errors).toContain(
      "Invalid chaining: executor.agent cannot precede planner.agent"
    );
  });
});

// ─── TC-08  Invalid structure — system → user chain ──────────────────────────

describe("TC-08 — invalid structure: system.agent → user.agent", () => {
  it("returns lifecycle_valid=false with chaining error", () => {
    const result = validateStructure(["system.agent", "user.agent"]);

    expect(result.valid).toBe(false);
    expect(result.errors).toContain(
      "Invalid chaining: system.agent cannot precede user.agent"
    );
  });
});

// ─── TC-09  Agent not found in registry ──────────────────────────────────────

describe("TC-09 — agent not found in registry", () => {
  it("returns approved=false, reason=Agent not found in registry", () => {
    const proposal = buildActionProposal(base({ agents: ["ghost.agent"] }));

    expect(proposal.approved).toBe(false);
    expect(proposal.constraints.lifecycle_valid).toBe(false);
    expect(proposal.constraints.governance_status).toBe("deny");
    expect(proposal.reason).toBe("Agent not found in registry");
  });
});

// ─── TC-10  Empty agents array ───────────────────────────────────────────────

describe("TC-10 — empty agents array", () => {
  it("passes structure (no violations), governance denies unknown action default", () => {
    const structureResult = validateStructure([]);
    expect(structureResult.valid).toBe(true);

    const govResult = simulateGovernance({
      actor: "intent-router",
      action: "unknown.action",
      resource: [],
      context: {},
    });
    expect(govResult.response).toBe("deny");
  });
});
