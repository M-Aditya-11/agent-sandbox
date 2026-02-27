# 🧠 Registry vs Session

## Overview

The system is intentionally divided into two distinct architectural layers:

* **Registry (Layer-2)** → Defines what agents *are*
* **Session (Layer-3)** → Defines what agents are *doing right now*

This separation guarantees determinism, clarity, and governance safety.

---

# 🏗 Layer-2: Registry (Deterministic Definitions)

The Registry contains **immutable agent definitions**.

It answers:

> What capabilities exist in the system?

## Characteristics

* Static
* Deterministic
* Immutable
* Capability-focused
* Free of runtime state

## Example

```js
{
  id: 1,
    name: "Text Summarizer",
    description: "Condenses long text into concise summaries.",
    authority_scope: "Authorized to process text inputs only.",
    capability_type: "Text Processing",
    lifecycle_state: LIFECYCLE_STATES.ACTIVE,
    load_visibility: true,
    governance_eligible: true,
    why_exists:
      "Reduces cognitive load by transforming long-form text into concise summaries without altering meaning.",
}
```

## What Registry Does NOT Contain

* Selection state
* Execution state
* Load / progress
* UI flags
* Reordering logic
* Runtime errors

Registry defines **possibility**, not activity.

---

# ⚙️ Layer-3: Session (Runtime State)

The Session manages **user interaction and active composition**.

It answers:

> Which agents are selected right now?

## Characteristics

* Mutable
* Context-dependent
* User-driven
* Runtime-scoped


## Session Responsibilities

* Selection / deselection
* Reordering
* Runtime tracking
* Temporary state
* Governance freeze enforcement

Session defines **activity**, not capability.

---

# 🔍 Core Differences

| Registry                 | Session               |
| ------------------------ | --------------------- |
| Immutable                | Mutable               |
| Defines capabilities     | Manages state         |
| Deterministic            | Contextual            |
| No runtime data          | Contains runtime data |
| Cannot change at runtime | Changes constantly    |

---

# 🧩 Why This Separation Matters

Without separation:

* Agents could mutate unpredictably
* Runtime state could corrupt definitions
* Governance freezes would break structure
* Determinism would collapse

By separating them:

* The system remains explainable
* Chains are reproducible
* Governance can safely freeze mutation
* Architecture stays clean

---

# 🏁 Final Mental Model

Registry defines what is possible.
Session defines what is happening.

Keeping them separate protects architectural integrity.
