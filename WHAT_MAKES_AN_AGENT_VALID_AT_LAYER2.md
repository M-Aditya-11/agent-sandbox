# What Makes an Agent Valid at Layer-2?

## Overview

Layer-2 represents the **Deterministic Agent Registry Layer**.

At this layer, agents are **immutable capability definitions** - not runtime instances, not session artifacts and not dynamically mutated objects.

An agent is considered **valid at Layer-2** only if it satisfies strict structural and governance constraints.

Layer-2 guarantees:

- Determinism
- Immutability
- Contract clarity
- Capability isolation
- Governance compliance

---

## Layer-2 Validity Criteria

## 1. Immutable Definition

An agent must be a static object inside the registry.

It must:

- Not mutate during runtime
- Not store session state
- Not depend on UI state
- Not modify other agents

If an agent changes shape or behavior at runtime -> Invalid at Layer-2.

---

## 2. Capability Declaration

Agents must explicitly declare their capabilities.

Capabilities:

- Must be declarative
- Must not be computed dynamically
- Must not depend on session inputs

Layer-2 defines *what the agent can do.*

---

## 3. No Runtime Load

Layer-2 agents must not contain:

- `isRunning`
- `load`
- `error`
- `progress`
- `selected`
- `position`

If runtime state leaks into registry -> Architectural violation.

---

## 4. Governance Compliance

If Layer-1 governance disables mutation:

- Layer-2 agents remain unchanged
- Registry remains intact
- No structural mutation allowed

Governance may freeze selection - but never alter definitions.

---

## What Makes an Agent Invalid at Layer-2?

An agent is invalid if it:

- Stores mutable state
- Generates dynamic identity
- Mutates registry structure
- Executes logic directly
- Depends on UI components
- Embeds session flags
- Changes capabilities dynamically

---

## Layer-2 Guarantees

When all agents are valid:

- The registry is deterministic
- Chains are reproducible
- Governance can freeze safely
- Session logic remains isolated
- System remains explainable

Layer-2 is the **contract surface of the system**.