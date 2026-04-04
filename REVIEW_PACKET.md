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

### 1. `frontend/src/layer2/StructuralValidator.js` — `validateStructure(agents)`

Validates the agent chain before governance is consulted:

- Blocks `"suspended.agent"` (permanently blocked)
- Blocks duplicate agent IDs
- Blocks `executor.agent → planner.agent` ordering
- Blocks `system.agent → user.agent` ordering

Returns `{ valid: boolean, errors: string[] }`.

---

### 2. `frontend/src/layer2/GovernanceHandshake.js` — `simulateGovernance({ actor, action, resource, context })`

Applies deterministic rules in priority order (last match wins):

```
Default:               "deny"      ← fail-closed baseline
Rule 1 — action:       "weather.fetch"    → "allow"
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

**Input:**
```json
{
  "actor": "intent-router",
  "action": "weather.fetch",
  "agents": ["weather.agent"],
  "context": { "city": "Mumbai" }
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
  "action": "weather.fetch",
  "resource": ["weather.agent"],
  "context": { "city": "Mumbai" }
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
  "action": "weather.fetch",
  "agents": ["weather.agent"],
  "sequence": ["weather.agent"],
  "constraints": {
    "lifecycle_valid": true,
    "governance_status": "allow"
  },
  "context": { "city": "Mumbai" },
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
| `executor.agent → planner.agent` | `false` | *(skipped)* | `false` | `"Rejected by Layer-2 decision engine"` |
| `system.agent → user.agent` | `false` | *(skipped)* | `false` | `"Rejected by Layer-2 decision engine"` |
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
  "action": "weather.fetch",
  "agents": ["weather.agent"],
  "context": { "city": "Mumbai" }
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
  "action": "weather.fetch",
  "resource": ["weather.agent"],
  "context": { "city": "Mumbai" }
}

GOVERNANCE RESPONSE
──────────────────────────────────────────
allow

FINAL ACTION PROPOSAL
──────────────────────────────────────────
{
  "approved": true,
  "actor": "intent-router",
  "action": "weather.fetch",
  "agents": ["weather.agent"],
  "sequence": ["weather.agent"],
  "constraints": {
    "lifecycle_valid": true,
    "governance_status": "allow"
  },
  "context": { "city": "Mumbai" },
  "reason": "Validation passed and governance allowed"
}
```

All five panels are rendered deterministically on every page load with no user interaction required.
