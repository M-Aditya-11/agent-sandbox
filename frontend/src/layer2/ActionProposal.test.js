import { describe, it, expect, vi, beforeEach } from "vitest";
import { buildActionProposal } from "./ActionProposal.js";
import { validateStructure } from "./StructuralValidator.js";
import { simulateGovernance } from "./GovernanceHandshake.js";
import { validateActionProposal } from "./validateActionProposal.js";

// Mock registry so tests are self-contained
vi.mock("../registry/RegistryInterface.js", () => ({
  RegistryInterface: {
    getAgentById: (id) => {
      const registry = {
        1: { id: 1, name: "Text Summarizer",    lifecycle_state: "Active" },
        2: { id: 2, name: "Data Formatter",      lifecycle_state: "Active" },
        3: { id: 3, name: "Risk Evaluator",      lifecycle_state: "Active" },
        4: { id: 4, name: "Document Classifier", lifecycle_state: "Suspended" },
        5: { id: 5, name: "Language Translator", lifecycle_state: "Active" },
        6: { id: 6, name: "Workflow Router",     lifecycle_state: "Active" },
      };
      return registry[id] ?? null;
    },
  },
}));

beforeEach(() => vi.clearAllMocks());

// ─── helpers ────────────────────────────────────────────────────────────────

function base(overrides = {}) {
  return {
    actor: "intent-router",
    action: "weather.fetch",
    agents: [1],
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
      base({ agents: [1, 2] })
    );

    expect(proposal.approved).toBe(false);
    expect(proposal.constraints.lifecycle_valid).toBe(true);
    expect(proposal.constraints.governance_status).toBe("escalate");
  });
});

// ─── TC-05  Invalid structure — suspended agent ──────────────────────────────

describe("TC-05 — invalid structure: suspended agent", () => {
  it("returns lifecycle_valid=false, approved=false", () => {
    const result = validateStructure([
      { id: 4, name: "Document Classifier", lifecycle_state: "Suspended" }
    ]);

    expect(result.valid).toBe(false);
    expect(result.errors).toContain("Suspended agent detected: 4");
  });
});

// ─── TC-06  Invalid structure — duplicate agents ─────────────────────────────

describe("TC-06 — invalid structure: duplicate agents", () => {
  it("returns lifecycle_valid=false with duplicate error", () => {
    const agent = { id: 1, name: "Text Summarizer", lifecycle_state: "Active" };
    const result = validateStructure([agent, agent]);

    expect(result.valid).toBe(false);
    expect(result.errors).toContain("Duplicate agents detected");
  });
});

// ─── TC-07  Invalid structure — Risk Evaluator → Text Summarizer ─────────────

describe("TC-07 — invalid structure: Risk Evaluator → Text Summarizer", () => {
  it("returns lifecycle_valid=false with chaining error", () => {
    const result = validateStructure([
      { id: 3, name: "Risk Evaluator",   lifecycle_state: "Active" },
      { id: 1, name: "Text Summarizer",  lifecycle_state: "Active" },
    ]);

    expect(result.valid).toBe(false);
    expect(result.errors).toContain(
      "Invalid chaining: Risk Evaluator cannot precede Text Summarizer"
    );
  });
});

// ─── TC-08  Invalid structure — Workflow Router → Data Formatter ─────────────

describe("TC-08 — invalid structure: Workflow Router → Data Formatter", () => {
  it("returns lifecycle_valid=false with chaining error", () => {
    const result = validateStructure([
      { id: 6, name: "Workflow Router",  lifecycle_state: "Active" },
      { id: 2, name: "Data Formatter",   lifecycle_state: "Active" },
    ]);

    expect(result.valid).toBe(false);
    expect(result.errors).toContain(
      "Invalid chaining: Workflow Router cannot precede Data Formatter"
    );
  });
});

// ─── TC-09  Agent not found in registry ──────────────────────────────────────

describe("TC-09 — agent not found in registry", () => {
  it("returns approved=false, reason=Agent not found in registry", () => {
    const proposal = buildActionProposal(base({ agents: [999] }));

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
