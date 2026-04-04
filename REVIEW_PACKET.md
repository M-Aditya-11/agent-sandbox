# REVIEW_PACKET.md

## What Was Built

A deterministic Layer-2 ActionProposal pipeline that validates agent chains and applies governance rules before producing a schema-complete proposal object consumed by Core.

---

## Entry Point

**File:** `frontend/src/components/Layer2Console.jsx`

This component is the live execution surface. On every render it:
1. Calls `validateStructure` on the agent array
2. Calls `simulateGovernance` with actor, action, and resource
3. Calls `buildActionProposal` to produce the final proposal
4. Renders all intermediate and final outputs in the UI console

It is mounted directly in `App.jsx` under the `Layer-2 Deterministic Debug Console` heading.

---

## Core Execution Flow

### 1. `frontend/src/layer2/StructuralValidator.js` — `validateStructure(resolvedAgents)`

Validates resolved agent objects (from registry) before governance is consulted:

- Blocks any agent with `lifecycle_state: "Suspended"`
- Blocks duplicate agent IDs
- Blocks `Risk Evaluator (id:3) → Text Summarizer (id:1)` ordering
- Blocks `Workflow Router (id:6) → Data Formatter (id:2)` ordering

Returns `{ valid: boolean, errors: string[] }`.

---

### 2. `frontend/src/layer2/GovernanceHandshake.js` — `simulateGovernance({ actor, action, resource, context })`

Applies deterministic rules in priority order (last match wins):

```
Default:               "deny"      ← fail-closed baseline
Rule 1 — action:       "task.route"       → "allow"
Rule 2 — multi-agent:  agents.length > 1  → "escalate"
Rule 3 — system actor: actor === "system" → "deny"
```

Returns `{ request: object, response: "allow" | "deny" | "escalate" }`.

---

### 3. `frontend/src/layer2/ActionProposal.js` — `buildActionProposal({ actor, action, agents, context })`

Orchestrates the full pipeline:

1. Resolves each agent ID via `RegistryInterface.getAgentById`
2. Returns early with `lifecycle_valid: false` if any agent is missing
3. Calls `validateStructure` → sets `lifecycle_valid`
4. Calls `simulateGovernance` → sets `governance_status`
5. Sets `approved = lifecycle_valid && governance_status === "allow"`
6. Returns the complete, schema-valid `ActionProposal` object

---

## Input → Output Example

**Input (from `intentRouterMock.js` — Aditya Sawant's intent router output):**
```json
{
  "actor": "intent-router",
  "action": "task.route",
  "agents": ["6"],
  "context": { "task": "summarize-and-format" }
}
```

**Validation Status:**
```json
{
  "valid": true,
  "errors": []
}
```

**Governance Request:**
```json
{
  "actor": "intent-router",
  "action": "task.route",
  "resource": ["6"],
  "context": { "task": "summarize-and-format" }
}
```

**Governance Response:**
```
allow
```

**Final ActionProposal Output:**
```json
{
  "approved": true,
  "actor": "intent-router",
  "action": "task.route",
  "agents": ["6"],
  "sequence": ["6"],
  "constraints": {
    "lifecycle_valid": true,
    "governance_status": "allow"
  },
  "context": { "task": "summarize-and-format" },
  "reason": "Validation passed and governance allowed"
}
```

---

## Failure Cases

| Scenario | `lifecycle_valid` | `governance_status` | `approved` | `reason` |
|---|---|---|---|---|
| Agent not found in registry | `false` | `"deny"` | `false` | `"Agent not found in registry"` |
| Suspended agent in chain | `false` | *(skipped)* | `false` | `"Rejected by Layer-2 decision engine"` |
| Duplicate agents in chain | `false` | *(skipped)* | `false` | `"Rejected by Layer-2 decision engine"` |
| `Risk Evaluator → Text Summarizer` | `false` | *(skipped)* | `false` | `"Rejected by Layer-2 decision engine"` |
| `Workflow Router → Data Formatter` | `false` | *(skipped)* | `false` | `"Rejected by Layer-2 decision engine"` |
| `actor === "system"` | `true` | `"deny"` | `false` | `"Rejected by Layer-2 decision engine"` |
| Multiple agents requested | `true` | `"escalate"` | `false` | `"Rejected by Layer-2 decision engine"` |
| Unknown action | `true` | `"deny"` | `false` | `"Rejected by Layer-2 decision engine"` |
| Valid single agent, allowed action | `true` | `"allow"` | `true` | `"Validation passed and governance allowed"` |

Governance is **skipped** when `lifecycle_valid` is `false` — the pipeline fails closed without consulting governance.

---

## Proof — UI Output

The `Layer2Console` component renders all pipeline stages live in the browser. The following panels are visible on page load:

```
INPUT
──────────────────────────────────────────
{
  "actor": "intent-router",
  "action": "task.route",
  "agents": ["6"],
  "context": { "task": "summarize-and-format" }
}

VALIDATION STATUS
──────────────────────────────────────────
{
  "valid": true,
  "errors": []
}

GOVERNANCE REQUEST
──────────────────────────────────────────
{
  "actor": "intent-router",
  "action": "task.route",
  "resource": ["6"],
  "context": { "task": "summarize-and-format" }
}

GOVERNANCE RESPONSE
──────────────────────────────────────────
allow

FINAL ACTION PROPOSAL
──────────────────────────────────────────
{
  "approved": true,
  "actor": "intent-router",
  "action": "task.route",
  "agents": ["6"],
  "sequence": ["6"],
  "constraints": {
    "lifecycle_valid": true,
    "governance_status": "allow"
  },
  "context": { "task": "summarize-and-format" },
  "reason": "Validation passed and governance allowed"
}
```

All five panels are rendered deterministically on every page load with no user interaction required.
