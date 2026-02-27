# What Layer-2 Must Never Allow

Layer-2 is not orchestration.
Layer-2 is not UI logic.
Layer-2 is not simulation behavior.

Layer-2 is structural governance.

---

## 1. ❌ Mutation of Immutable Identity

Layer-2 must never allow:

* Changing `id`
* Changing `name`
* Changing `description`
* Changing `authority_scope`

These fields define the agent’s structural identity.
If they change, the agent is no longer the same entity.

Immutability is mandatory.

---

## 2. ❌ Runtime Capability Rewriting

An agent’s `capability_type` is classification — not behavior.

Layer-2 must never allow:

* Dynamic swapping of capability types
* Injecting new capability categories at runtime
* Reclassifying agents based on UI state

Classification belongs to the registry contract — not the session.

---

## 3. ❌ Authority Escalation

An agent must never:

* Expand its `authority_scope` dynamically
* Borrow authority from another agent
* Override structural boundaries

Authority is declared — not negotiated at runtime.

---

## 4. ❌ Hidden Agents

Every registered agent must be explicitly declared.

Layer-2 must never allow:

* Undeclared agents
* Temporary injected agents
* Agents created from UI-side logic

All agents must originate from the formal registry.

---

## 5. ❌ Governance Logic Inside the Registry

Layer-2 defines structure — not decision-making.

It must never contain:

* Refusal simulation
* Policy decisions
* UI state logic
* Session execution logic

Those belong to the sandbox layer.

---

## 6. ❌ Lifecycle Bypass

If an agent is:

* `Deprecated`
* `Suspended`

Layer-2 must never allow it to be treated as `Active`.

Lifecycle state is authoritative.

---

## 7. ❌ Structural Drift

Layer-2 must never allow:

* Partial contracts
* Optional core identity fields
* Schema relaxation for convenience

Strict schema discipline is required.

---

# Core Principle

Layer-2 exists to protect structural integrity.

If it becomes flexible, it becomes meaningless.
If it allows mutation, it becomes orchestration.
If it mixes concerns, it loses authority.

Layer-2 must remain strict, predictable, and immutable.