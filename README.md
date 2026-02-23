# Agent Sandbox

A frontend-only sandbox prototype that visualizes what a governed “Agent Bucket” system could look like.

This project focuses on clarity, visibility, and explicit capability modeling — not intelligence or backend orchestration.

---

# What This Simulates

This application simulates the **visual and mental model** of a governed multi-agent system.

Specifically, it simulates:

### 1️⃣ Agent Registry

* A list of mock agents (hardcoded JSON)
* Clear capability descriptions
* Declared authority scope
* Status indicators (Available / Busy / Disabled)
* Load indicators
* UI-based status constraints

---

### 2️⃣ Agent Selection Bucket

* Adding agents to a visual bucket
* Removing agents
* Reordering agents

This represents sequencing intent — not execution.

---

### 3️⃣ Chain Preview

A simple UI representation of agent order:

```
Text Summarizer → Risk Evaluator → Workflow Router
```

This is sequencing visualization only.

---

### 4️⃣ Governance Refusal Simulation

A toggle that simulates:

> “Governance Refused This Agent”

When activated:

* The agent card visibly shows refusal state
* Displays:
  `Not eligible in current context`
* Blocks selection

This models how governance might appear to a user — without implementing governance logic.

---

### 5️⃣ Transparency Layer

Each agent contains a collapsible:

> “Why this agent exists” section

This makes:

* Capability explicit
* Authority understandable
* Boundaries visible
* System behavior less “magical”

---

# What This Does NOT Simulate

This project does **not** simulate:

* AI reasoning
* Model execution
* Real orchestration
* Backend systems
* Policy engines
* Governance enforcement
* Authentication
* API communication
* Context evaluation
* Sarathi logic

There is:

* No execution engine
* No decision-making engine
* No workflow runtime
* No real chaining

All behavior is UI state simulation only.

If the system appears intelligent, it is only structured UI logic.

---

# What Layer-2 Actually Is

In this context, **Layer-2 is not AI.**

Layer-2 represents:

> The governance + visibility layer that sits between capability and execution.

It is the layer that:

* Declares what an agent is allowed to do
* Exposes authority scope
* Surfaces status constraints
* Communicates refusal clearly
* Makes sequencing visible
* Prevents invisible orchestration

Layer-2 is about:

* Interface clarity
* System transparency
* User trust
* Explicit boundaries

It is not:

* Model intelligence
* Backend infrastructure
* Distributed execution
* Policy computation

It is the **interpretability and governance experience layer**.

---

# Lessons Learned

### 1️⃣ Visibility Reduces Magic

When capability is declared explicitly (authority, purpose and explanation) the system feels controlled rather than mysterious.

---

### 2️⃣ Refusal Must Be Designed

A refusal state is not an error.
It is a governance expression.
Clear refusal messaging builds trust.

---

### 3️⃣ Status Is Behavioral UX

Even without backend logic, UI states (Available / Busy / Disabled) meaningfully shape user interaction.

---


### 4️⃣ Transparency Is a Design Choice

Adding “Why this agent exists” changes how users perceive the system.
It shifts from:

> “The AI decided”

to

> “This component exists for this declared purpose”

---

### 5️⃣ Governance Is an Experience Layer

Even when simulated, governance alters behavior, expectation, and trust.
That experience can be prototyped without building infrastructure.

---

# Final Thought

This project demonstrates how to:

* Make invisible capability visible
* Represent governance without implementing it
* Model sequencing without execution
* Create clarity without backend complexity

It is a sandbox for understanding how governed agent systems might feel — not how they function internally.