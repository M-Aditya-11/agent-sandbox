# 📜 Contract Philosophy

Contracts define the **rules of eligibility** for agents.

They determine **when an agent is allowed to participate**, not how it executes.

---

## Core Principles

**1. Declarative**
Contracts describe conditions. They do not perform actions.

**2. Deterministic**
Given the same context, a contract must always return the same result.

**3. Pure**
Contracts must not mutate state, trigger side effects or execute logic.

**4. Boundary-Enforcing**
They protect the system from invalid composition and governance violations.

---

## Role in the Architecture

* **Layer-2 (Registry):** Contracts are defined.
* **Layer-3 (Session):** Contracts are evaluated.
* **Governance:** May override mutation, but never alters contracts.

---

## Final Definition

A contract is a pure, deterministic rule that decides:

> Is this agent eligible to participate right now?

Contracts preserve determinism, safety and architectural integrity.
