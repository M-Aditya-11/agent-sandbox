
# ActionProposal Contract

## Objective

Layer-2 produces a deterministic `ActionProposal` object consumed by Core. Every proposal is structurally validated, governance-checked, and schema-complete before leaving Layer-2.

---

## 1. ActionProposal Schema

```javascript
{
  approved: boolean,              // true only if validation + governance both pass
  actor: string,                  // identity initiating the action
  action: string,                 // action key (e.g. "weather.fetch")
  agents: string[],               // agent IDs requested
  sequence: string[],             // ordered execution chain (copy of agents)
  constraints: {
    lifecycle_valid: boolean,     // result of StructuralValidator
    governance_status: "allow" | "deny" | "escalate"  // result of GovernanceHandshake
  },
  context: object,                // arbitrary caller-supplied context
  reason: string                  // human-readable decision explanation
}
```

---

## 2. Validation Rules

### Schema Validation (`validateActionProposal`)

Every field is required. No field may be omitted or mistyped:

| Field | Type | Constraint |
|---|---|---|
| `approved` | `boolean` | required |
| `actor` | `string` | required |
| `action` | `string` | required |
| `agents` | `string[]` | required array |
| `sequence` | `string[]` | required array |
| `constraints` | `object` | required |
| `constraints.lifecycle_valid` | `boolean` | required |
| `constraints.governance_status` | `"allow" \| "deny" \| "escalate"` | must be one of three values |
| `context` | `object` | required |
| `reason` | `string` | required |

### Structural Validation (`validateStructure`)

Applied to the `agents` array before governance:

- No suspended agents — `"suspended.agent"` is permanently blocked
- No duplicate agent IDs in the chain
- `executor.agent` cannot directly precede `planner.agent`
- `system.agent` cannot directly precede `user.agent`

Any violation sets `lifecycle_valid: false` and blocks approval.

---

## 3. Governance Simulation Logic

`simulateGovernance` applies deterministic rules in priority order (last match wins):

```
Default:               deny       ← fail-closed baseline
Rule 1 — action:       if action === "weather.fetch"  → allow
Rule 2 — multi-agent:  if agents.length > 1           → escalate
Rule 3 — system actor: if actor === "system"          → deny
```

`approved` is `true` only when **both** conditions hold:
- `lifecycle_valid === true`
- `governance_status === "allow"`

---

## 4. Failure Scenarios

| Scenario | `lifecycle_valid` | `governance_status` | `approved` | `reason` |
|---|---|---|---|---|
| Agent not found in registry | `false` | `"deny"` | `false` | `"Agent not found in registry"` |
| Suspended agent in chain | `false` | *(governance skipped)* | `false` | `"Rejected by Layer-2 decision engine"` |
| Duplicate agents in chain | `false` | *(governance skipped)* | `false` | `"Rejected by Layer-2 decision engine"` |
| Invalid chain order | `false` | *(governance skipped)* | `false` | `"Rejected by Layer-2 decision engine"` |
| `actor === "system"` | `true` | `"deny"` | `false` | `"Rejected by Layer-2 decision engine"` |
| Multiple agents requested | `true` | `"escalate"` | `false` | `"Rejected by Layer-2 decision engine"` |
| Unknown action (not `weather.fetch`) | `true` | `"deny"` | `false` | `"Rejected by Layer-2 decision engine"` |
| Valid single agent, allowed action | `true` | `"allow"` | `true` | `"Validation passed and governance allowed"` |

---

## Note

- No field omission — all 8 top-level fields are always present
- No schema drift — `validateActionProposal` enforces the contract at runtime
- Same input → same output — all rules are deterministic, no randomness or side effects
- Fail-closed — default governance response is `"deny"`; approval requires explicit pass