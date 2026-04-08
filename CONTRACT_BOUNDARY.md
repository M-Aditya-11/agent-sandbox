# CONTRACT_BOUNDARY.md

## Purpose

Defines the hard boundary between every system in the BHIV Tantra pipeline.
Each system has exactly one responsibility. Crossing a boundary is a contract violation.

Boundaries defined here:
- Chayan → Sūtradhāra
- Sūtradhāra → Mandala (RAJYA)

---

## System Map

```
Intent
  └─→ Chayan          (agent selection)
          └─→ Sūtradhāra    (structural validation + proposal assembly)
                    └─→ Mandala / RAJYA   (governance evaluation)
                                └─→ Sarathi   (enforcement)
```

---

## Boundary 1 — Chayan → Sūtradhāra

### Chayan owns
- Mapping `context.task` to an ordered list of agent IDs
- Producing `agent_selection_output`
- Reporting whether a fallback was used via `selection_metadata`

### Chayan must NOT
- Resolve agent IDs against the registry
- Check `lifecycle_state` of any agent
- Apply ordering constraints
- Make any governance decision
- Know anything about `ActionProposal` schema

### Handoff shape — `agent_selection_output`

```json
{
  "actor": "string",
  "action": "string",
  "agents": ["string"],
  "sequence": ["string"],
  "context": {},
  "selection_metadata": {
    "source": "taskMap",
    "confidence": "deterministic",
    "fallback_used": false
  }
}
```

### Allowed fields

| Field | Type | Required |
|---|---|---|
| `actor` | `string` | yes |
| `action` | `string` | yes |
| `agents` | `string[]` | yes |
| `sequence` | `string[]` | yes |
| `context` | `object` | yes |
| `selection_metadata` | `object` | yes |
| `selection_metadata.source` | `string` | yes |
| `selection_metadata.confidence` | `string` | yes |
| `selection_metadata.fallback_used` | `boolean` | yes |

### Forbidden fields

| Field | Reason |
|---|---|
| `lifecycle_valid` | Lifecycle is Sūtradhāra's concern |
| `approved` | No decision is made in Chayan |
| `governance_request` | Governance is Sūtradhāra's concern |
| Any registry field | Chayan has no registry access |

---

## Boundary 2 — Sūtradhāra → Mandala (RAJYA)

### Sūtradhāra owns
- Resolving agent IDs against the registry
- Running structural validation (lifecycle, duplicates, ordering)
- Assembling the `ActionProposal`
- Forwarding `governance_request` to Mandala when structure is valid
- Producing a structured `failure` object when structure is invalid

### Sūtradhāra must NOT
- Select agents — that is Chayan's job
- Make governance decisions
- Produce `approved`, `reason`, or any verdict field
- Simulate governance internally
- Contact Mandala when `lifecycle_valid` is `false`

### Handoff shape — `ActionProposal`

```json
{
  "proposal_id": "ap-<hash>",
  "timestamp": "ISO-8601",
  "contract_version": "v1.1",
  "actor": "string",
  "action": "string",
  "agents": ["string"],
  "sequence": ["string"],
  "constraints": {
    "lifecycle_valid": true
  },
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

On failure, `failure` is populated and `governance_request` is `null`:

```json
{
  "proposal_id": "ap-<hash>",
  "timestamp": "ISO-8601",
  "contract_version": "v1.1",
  "actor": "string",
  "action": "string",
  "agents": ["string"],
  "sequence": ["string"],
  "constraints": {
    "lifecycle_valid": false
  },
  "context": {},
  "failure": {
    "stage": "STRUCTURAL_VALIDATION",
    "codes": ["AGENT_SUSPENDED"],
    "message": "Suspended agent detected: 4"
  },
  "governance_request": null
}
```

### Allowed fields

| Field | Type | Required |
|---|---|---|
| `proposal_id` | `string` | yes |
| `timestamp` | `string` (ISO-8601) | yes |
| `contract_version` | `string` | yes |
| `actor` | `string` | yes |
| `action` | `string` | yes |
| `agents` | `string[]` | yes |
| `sequence` | `string[]` | yes |
| `constraints` | `object` | yes |
| `constraints.lifecycle_valid` | `boolean` | yes |
| `context` | `object` | yes |
| `failure` | `object \| null` | yes |
| `failure.stage` | `string` | when `lifecycle_valid: false` |
| `failure.codes` | `string[]` | when `lifecycle_valid: false` |
| `failure.message` | `string` | when `lifecycle_valid: false` |
| `governance_request` | `object \| null` | yes |
| `governance_request.actor` | `string` | when non-null |
| `governance_request.action` | `string` | when non-null |
| `governance_request.resource` | `string[]` | when non-null |
| `governance_request.context` | `object` | when non-null |

### Forbidden fields

| Field | Reason |
|---|---|
| `approved` | No verdict is made in Sūtradhāra |
| `reason` | No decision explanation belongs here |
| `governance_request.response` | Governance has not responded yet |
| Any unknown field | Contract is closed — no extensions without version bump |

### Failure stages

| Stage | Trigger |
|---|---|
| `EMPTY_CHAIN` | `agents = []` |
| `REGISTRY_RESOLUTION` | Agent ID not found in registry |
| `STRUCTURAL_VALIDATION` | Suspended agent / duplicate IDs / forbidden chain order |

---

## Responsibility Split

| Concern | Owner |
|---|---|
| Task → agent mapping | Chayan |
| Fallback strategy | Chayan |
| Registry resolution | Sūtradhāra |
| Lifecycle validation | Sūtradhāra |
| Duplicate detection | Sūtradhāra |
| Chain ordering rules | Sūtradhāra |
| Proposal assembly | Sūtradhāra |
| Governance evaluation | Mandala (RAJYA) |
| Enforcement | Sarathi |

---

## Valid Flow Example

```
Intent: { actor: "intent-router", action: "task.route", context: { task: "summarize-and-format" } }

Chayan output:
  agents: ["1", "2"]
  selection_metadata.fallback_used: false

Sūtradhāra output:
  constraints.lifecycle_valid: true
  failure: null
  governance_request: { actor, action, resource: ["1", "2"], context }
```

---

## Invalid Flow Examples

### Suspended agent

```
Intent: { context: { task: "classify-and-format" } }

Chayan output:
  agents: ["4", "2"]   ← agent 4 is Suspended in registry

Sūtradhāra output:
  constraints.lifecycle_valid: false
  failure: {
    stage: "STRUCTURAL_VALIDATION",
    codes: ["AGENT_SUSPENDED"],
    message: "Suspended agent detected: 4"
  }
  governance_request: null   ← Mandala is NOT contacted
```

### Empty chain (unknown task, no fallback configured)

```
Intent: { context: { task: "unknown.task" } }

Chayan output:
  agents: []
  selection_metadata.fallback_used: true

Sūtradhāra output:
  constraints.lifecycle_valid: false
  failure: {
    stage: "EMPTY_CHAIN",
    codes: ["EMPTY_AGENT_CHAIN"],
    message: "No agents provided — an empty chain cannot be executed"
  }
  governance_request: null
```

### Forbidden chain order

```
Chayan output:
  agents: ["3", "1"]   ← Risk Evaluator cannot directly precede Text Summarizer

Sūtradhāra output:
  constraints.lifecycle_valid: false
  failure: {
    stage: "STRUCTURAL_VALIDATION",
    codes: ["INVALID_CHAIN"],
    message: "Invalid chaining: Risk Evaluator cannot precede Text Summarizer"
  }
  governance_request: null
```

---

## Contract Violations

The following are explicit violations. Any system producing these outputs has broken the contract:

| Violation | Produced by | Why it breaks |
|---|---|---|
| `approved: true/false` in ActionProposal | Sūtradhāra | Verdict belongs to Mandala |
| `governance_request.response` in ActionProposal | Sūtradhāra | Governance has not responded |
| `lifecycle_state` check in Chayan | Chayan | Registry access belongs to Sūtradhāra |
| `governance_request` non-null when `lifecycle_valid: false` | Sūtradhāra | Mandala must never receive an invalid chain |
| `failure: null` when `lifecycle_valid: false` | Sūtradhāra | Mandala must know why the chain failed |
| Unknown field in ActionProposal | Sūtradhāra | Contract is closed — no silent extensions |

---

## Enforcement

`validateActionProposal()` in `frontend/src/layer2/validateActionProposal.js` enforces the Sūtradhāra → Mandala contract at runtime.

Returns `{ valid: boolean, errors: { code, field, message }[] }`.

Error codes: `MISSING_FIELD`, `FORBIDDEN_FIELD`, `UNKNOWN_FIELD`, `INVALID_TYPE`, `INVALID_GOVERNANCE_REQUEST`.

---

## Integration Points

| Surface | File | Status |
|---|---|---|
| Live intent router | `agent-sandbox/frontend/src/layer2/intentRouterMock.js` | Stub — replace with Aditya Sawant's output |
| Live governance engine | `agent-sandbox/frontend/src/layer2/governanceInterface.js` | Stub — replace when Mandala / RAJYA is ready |
| Chayan → Sūtradhāra live call | `chayan-agent-selection/src/pipeline.js` | Inline for now — extract when repos are deployed |
