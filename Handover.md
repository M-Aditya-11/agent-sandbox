# HANDOVER.md — Sūtradhāra (agent-sandbox)

## What This Repo Is

Sūtradhāra is Layer-2 of the BHIV Tantra agent pipeline. It receives agent selection output from Chayan, validates the agent chain, and produces a governance-ready `ActionProposal`. It makes no governance decisions.

**It does not select agents. It does not evaluate governance. It forwards a validated request.**

---

## Pipeline Position

```
Intent
  └─→ Chayan (chayan-agent-selection)
          └─→ agent_selection_output
                  └─→ Sūtradhāra (this repo) — buildActionProposal()
                          └─→ ActionProposal
                                  └─→ Mandala / RAJYA (governance)
                                          └─→ Sarathi (enforcement)
```

---

## Current State (Phase 3 complete)

All 45 tests pass across both repos.

| Repo | Tests |
|---|---|
| `agent-sandbox` — `ActionProposal.test.js` | 22 ✅ |
| `chayan-agent-selection` — `selectAgents.test.js` | 8 ✅ |
| `chayan-agent-selection` — `pipeline.test.js` | 6 ✅ |
| `chayan-agent-selection` — `pipeline_replay.test.js` | 9 ✅ |

Run tests: `cd frontend && npm test`

---

## Core Files

| File | Purpose |
|---|---|
| `frontend/src/layer2/ActionProposal.js` | Entry point — resolves agents, runs all validation gates, assembles proposal |
| `frontend/src/layer2/StructuralValidator.js` | Lifecycle, duplicate, and ordering checks with error codes |
| `frontend/src/layer2/validateActionProposal.js` | Runtime schema enforcement — rejects decision fields, returns structured errors |
| `frontend/src/layer2/GovernanceHandshake.js` | Pure passthrough — builds governance request, no rules |
| `frontend/src/layer2/governanceInterface.js` | External governance stub — integration target for Mandala / RAJYA |
| `frontend/src/layer2/intentRouterMock.js` | Intent router stub — replace with Aditya Sawant's output |

---

## ActionProposal Schema (contract_version: v1.1)

```json
{
  "proposal_id": "ap-<hash>",
  "timestamp": "ISO-8601",
  "contract_version": "v1.1",
  "actor": "string",
  "action": "string",
  "agents": ["string"],
  "sequence": ["string"],
  "constraints": { "lifecycle_valid": true },
  "context": {},
  "failure": null,
  "governance_request": {
    "actor": "string",
    "action": "string",
    "resource": ["string"],
    "context": {}
  }
}
```

On failure: `failure` is populated, `governance_request` is `null`.

```json
{
  "failure": {
    "stage": "STRUCTURAL_VALIDATION",
    "codes": ["AGENT_SUSPENDED"],
    "message": "Suspended agent detected: 4"
  },
  "governance_request": null
}
```

### Forbidden fields (enforced at runtime by `validateActionProposal`)

- `approved` — no verdict is made here
- `reason` — no decision explanation belongs here
- `governance_request.response` — governance has not responded yet
- Any unknown field — contract is closed; no silent extensions

---

## Validation Pipeline (in order)

`buildActionProposal()` runs these gates sequentially and stops at the first failure:

1. **Empty chain** — `agents = []` → `EMPTY_CHAIN` / `EMPTY_AGENT_CHAIN`
2. **Registry resolution** — unknown agent ID → `REGISTRY_RESOLUTION` / `AGENT_NOT_FOUND`
3. **Structural validation** (all three run, errors collected):
   - Lifecycle — suspended agent → `AGENT_SUSPENDED`
   - Duplicates — repeated agent ID → `DUPLICATE_AGENTS`
   - Ordering — forbidden adjacent pair → `INVALID_CHAIN`

Forbidden chain pairs (in `StructuralValidator.js` → `FORBIDDEN_CHAINS`):
- `Risk Evaluator (id:3)` → `Text Summarizer (id:1)`
- `Workflow Router (id:6)` → `Data Formatter (id:2)`

---

## Failure Reference

| Scenario | Stage | Code(s) | `governance_request` |
|---|---|---|---|
| `agents = []` | `EMPTY_CHAIN` | `EMPTY_AGENT_CHAIN` | `null` |
| Agent ID not in registry | `REGISTRY_RESOLUTION` | `AGENT_NOT_FOUND` | `null` |
| Suspended agent | `STRUCTURAL_VALIDATION` | `AGENT_SUSPENDED` | `null` |
| Duplicate agent IDs | `STRUCTURAL_VALIDATION` | `DUPLICATE_AGENTS` | `null` |
| Risk Evaluator → Text Summarizer | `STRUCTURAL_VALIDATION` | `INVALID_CHAIN` | `null` |
| Workflow Router → Data Formatter | `STRUCTURAL_VALIDATION` | `INVALID_CHAIN` | `null` |
| Multiple violations | `STRUCTURAL_VALIDATION` | multiple codes | `null` |
| Valid chain | — | — | populated |

---

## Contract Guarantees

- `proposal_id` is a deterministic hash of the input — same input, same ID, every time
- All 10 top-level fields are always present — no field omission
- `failure` and `governance_request` are mutually exclusive: exactly one is non-null (except valid chain where `failure: null` and `governance_request` is populated)
- Governance is never contacted when `lifecycle_valid: false`
- No randomness, no side effects — same input → same output

---

## Integration Points (both are stubs)

| Surface | File | Action required |
|---|---|---|
| Live intent router | `frontend/src/layer2/intentRouterMock.js` | Replace with Aditya Sawant's output |
| Live governance engine | `frontend/src/layer2/governanceInterface.js` | Replace when Mandala / RAJYA is ready |

---

## Key Reference Docs

| Doc | Contents |
|---|---|
| `CONTRACT_BOUNDARY.md` | Hard boundary definitions — what each system owns and must not do |
| `SUTRADHARA_VS_CHAYAN.md` | Side-by-side comparison of both systems |
| `REVIEW_PACKET.md` | Full build record, schema, failure cases, test summary |
| `review-packets/phase3.md` | Phase 3 packet — full pipeline flow, sample JSON, test assertions |
| `review-packets/phase3-reflection.md` | What changed in Phase 3, what risks were removed |
