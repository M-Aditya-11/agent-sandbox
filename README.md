# Sūtradhāra — Control Plane (Layer-2)

## What This Is

Sūtradhāra is the structural control plane for the BHIV Tantra agent pipeline.

It receives agent selection output from **Chayan**, validates the agent chain, and produces a governance-ready `ActionProposal`. It makes no governance decisions. It forwards a request.

---

## System Architecture

```
Intent
  └─→ Chayan (chayan-agent-selection)
          └─→ agent_selection_output
                  └─→ Sūtradhāra (this repo)
                          └─→ ActionProposal
                                  └─→ External Governance Engine (KESHAV / Sarathi)
```

Two repos. Two responsibilities. One contract between them.

| Repo | Role |
|---|---|
| `chayan-agent-selection` | Maps intent to ordered agent IDs — selection only |
| `agent-sandbox` (this repo) | Validates agent chain, assembles ActionProposal — control only |

---

## ActionProposal Schema

```json
{
  "actor": "string",
  "action": "string",
  "agents": ["string"],
  "sequence": ["string"],
  "constraints": {
    "lifecycle_valid": true
  },
  "context": {},
  "governance_request": {
    "actor": "string",
    "action": "string",
    "resource": ["string"],
    "context": {}
  }
}
```

### Field Reference

| Field | Type | Description |
|---|---|---|
| `actor` | `string` | Identity initiating the action |
| `action` | `string` | Action key (e.g. `"task.route"`) |
| `agents` | `string[]` | Agent IDs from Chayan |
| `sequence` | `string[]` | Ordered execution chain (independent copy of agents) |
| `constraints.lifecycle_valid` | `boolean` | Result of structural validation |
| `context` | `object` | Caller-supplied context, passed through unchanged |
| `governance_request` | `object \| null` | Forwarded to governance engine — `null` if structure is invalid |

### Prohibited Fields

`validateActionProposal` will return `false` if any of these are present:

- `approved` — no verdict is made here
- `reason` — no decision explanation belongs in this layer
- `governance_request.response` — governance has not responded yet

---

## Structural Validation

`validateStructure` runs three checks in guaranteed order before the governance request is assembled:

### 1. Lifecycle — `AGENT_SUSPENDED`
Any agent with `lifecycle_state: "Suspended"` blocks the chain.

### 2. Duplicates — `DUPLICATE_AGENTS`
Repeated agent IDs in the chain are blocked.

### 3. Ordering — `INVALID_CHAIN`
Forbidden adjacent pairs are blocked:

| Blocked pair | Rule |
|---|---|
| `Risk Evaluator (id:3)` → `Text Summarizer (id:1)` | Cannot directly precede |
| `Workflow Router (id:6)` → `Data Formatter (id:2)` | Cannot directly precede |

Each error is `{ code, message }`. Order is deterministic: lifecycle → duplicates → chaining.

Adding a new forbidden pair is one line in `FORBIDDEN_CHAINS` in `StructuralValidator.js`.

---

## Failure Scenarios

| Scenario | `lifecycle_valid` | `governance_request` |
|---|---|---|
| Agent not found in registry | `false` | `null` |
| Suspended agent in chain | `false` | `null` |
| Duplicate agent IDs | `false` | `null` |
| Risk Evaluator → Text Summarizer | `false` | `null` |
| Workflow Router → Data Formatter | `false` | `null` |
| Unknown task (empty agents from Chayan) | `true` | populated (empty resource) |
| Valid chain | `true` | populated |

Governance is never contacted when `lifecycle_valid` is `false`.

---

## Core Files

| File | Purpose |
|---|---|
| `frontend/src/layer2/ActionProposal.js` | Entry point — resolves agents, runs validation, assembles proposal |
| `frontend/src/layer2/StructuralValidator.js` | Lifecycle, duplicate, and ordering checks with error codes |
| `frontend/src/layer2/validateActionProposal.js` | Runtime schema enforcement — rejects decision fields |
| `frontend/src/layer2/GovernanceHandshake.js` | Pure passthrough — builds governance request, no rules |
| `frontend/src/layer2/governanceInterface.js` | External governance stub — integration target for live engine |

---

## Running Tests

```bash
cd frontend
npm test
```

10 tests. All pass.

---

## Contract Guarantees

- No field omission — all 7 top-level fields are always present
- No decision fields — `validateActionProposal` enforces this at runtime
- Same input → same output — no randomness, no side effects
- Governance is never simulated — `governance_request` is forwarded, not evaluated
- Fail-closed structurally — invalid chain blocks the proposal before governance is contacted

---

## Integration Points

| Surface | File | Status |
|---|---|---|
| Live intent router | `src/layer2/intentRouterMock.js` | Stub — replace with Aditya Sawant's output |
| Live governance engine | `src/layer2/governanceInterface.js` | Stub — replace when KESHAV / Sarathi is ready |

---

## Related Docs

- `CONTRACT_BOUNDARY.md` — what each system owns and must not do
- `SUTRADHARA_VS_CHAYAN.md` — side-by-side comparison of both systems
- `REVIEW_PACKET.md` — full build record, schema, failure cases, test summary
- `review-packets/phase2.md` — phase-by-phase decision log for Phases 1–8
