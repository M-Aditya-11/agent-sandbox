
# 🧠 Layer-2 Agent Definition Contract

## Purpose

Layer-2 defines **capability**, not runtime behavior.

The Agent Contract formalizes what an agent *is* inside the system.
It ensures deterministic recognition, structural integrity and governance clarity.

Layer-2 does **not**:

* Execute workflows
* Perform orchestration
* Apply policy
* Simulate runtime state
* Mutate authority

It only defines officially recognized capability.

---

## 📄 AgentContract.js

All agents in the system must be created using the `createAgentContract()` factory.

This guarantees:

* Structural validation
* Lifecycle enforcement
* Authority immutability
* Deterministic registration

---

## 📌 Required Fields

Every agent must include:

| Field                 | Type          | Mutable | Description                            |
| --------------------- | ------------- | ------- | -------------------------------------- |
| `id`                  | number | ❌ No    | Unique identifier                      |
| `name`                | string        | ❌ No    | Official agent name                    |
| `description`         | string        | ❌ No    | Capability summary                     |
| `authority_scope`     | string        | ❌ No    | Explicit boundary of authority         |
| `capability_type`     | string        | ❌ No    | Classification category                |
| `lifecycle_state`     | enum          | ❌ No    | `Active`, `Deprecated` or `Suspended` |
| `load_visibility`     | boolean       | ❌ No    | Whether runtime load may be displayed  |
| `governance_eligible` | boolean       | ❌ No    | Eligible for governance review         |
| `why_exists`          | string        | ❌ No    | Required justification of existence    |

All fields are frozen at creation.

---

## 🔒 Immutability Rules

All agents are frozen using `Object.freeze()`.

This guarantees:

* Authority cannot escalate at runtime
* Capability cannot be redefined by UI
* Lifecycle cannot silently change
* Governance eligibility cannot be toggled dynamically

If mutation were allowed, the system would lose:

* Determinism
* Auditability
* Structural trust
* Layer separation integrity

Layer-2 must be stable and declarative.

---

## 🔁 Lifecycle States

Agents must explicitly declare one of:

* `Active`
* `Deprecated`
* `Suspended`

Lifecycle is declarative metadata.
It does not execute behavior.

---

## 🏛 Registry vs Selection

Layer-2 Registry:

* Canonical list of recognized agents
* Immutable
* Deterministic

UI Selection State:

* Temporary
* Mutable
* Does not modify the registry

Registry defines existence.
Selection defines usage.

They must never be mixed.

---

## 🚫 What Is Not Allowed in Layer-2

The following are prohibited inside the Agent Contract:

* Runtime load values
* Busy/Available state
* Refusal reasons
* Dynamic authority reassignment
* Self-modifying capability
* Orchestration logic
* Policy engines

Those belong to other layers.

Layer-2 defines capability.
It does not invent behavior.

---

## 🧱 Architectural Principle

Layer-1 → Runtime Behavior.

Layer-2 → Capability Definition (this layer).

Layer-3 → Governance Enforcement

Layer-2 must remain:

* Declarative
* Immutable
* Deterministic
* Explicit
* Structurally disciplined

If a change requires runtime mutation, it does not belong here.