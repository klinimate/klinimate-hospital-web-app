# Klinimate Development Rules

Version: 1.0

Status: Active

Owner: Dr. Avdhut Kulkarni (Founder & Director)

---

# Purpose

This document defines the mandatory software development standards for the Klinimate Platform.

All developers, contributors, AI coding assistants, and automation tools must follow these rules.

The Product Foundation (98-PRODUCT-FOUNDATION.md) and Architecture (99-ARCHITECTURE.md) are frozen. Development must extend the platform without changing its core architecture.

---

# Rule 1 — Product Foundation is Frozen

Never redesign the Klinimate product foundation.

Never introduce a new architecture unless explicitly approved.

Always extend existing modules before creating new ones.

---

# Rule 2 — Follow the Architecture

Every new feature must belong to one of the four architecture layers:

1. Platform
2. Knowledge Base
3. Klinimate Intelligence
4. Virtual Specialist Network

Do not create parallel systems.

---

# Rule 3 — Mobile First

Every screen must be designed for mobile before desktop.

Large touch targets.

Minimal scrolling.

Fast loading.

One-hand operation.

---

# Rule 4 — Click More • Type Less

Prefer:

- Search
- Smart suggestions
- Auto-complete
- Quick actions
- Intelligent defaults

Avoid unnecessary typing.

---

# Rule 5 — One Patient • One Clinical Record • One Timeline

All clinical information must belong to a single patient record.

Never create duplicate patient records or disconnected workflows.

---

# Rule 6 — AI Assists • Clinicians Decide

AI may:

- Summarize
- Organize
- Prioritize
- Suggest
- Explain

AI must never:

- Replace clinician judgement
- Make autonomous clinical decisions
- Conceal uncertainty

---

# Rule 7 — Explainable AI

Every AI recommendation should be explainable.

Whenever possible, display:

- Why the recommendation was made
- Missing information
- Confidence level

---

# Rule 8 — Modular Development

Build reusable modules.

Avoid duplicate code.

Separate:

- UI
- Business Logic
- Database
- AI
- API

---

# Rule 9 — Component Reuse

Before creating a new component:

Check whether an existing component can be reused.

Avoid unnecessary duplication.

---

# Rule 10 — Simple User Experience

Every screen should have one primary purpose.

Every screen should have one primary action.

Avoid clutter.

Avoid unnecessary popups.

---

# Rule 11 — Performance

Prioritize:

- Fast loading
- Responsive UI
- Minimal API calls
- Efficient database queries

---

# Rule 12 — Security by Default

All clinical data must be:

- Authenticated
- Authorized
- Encrypted
- Auditable

Never expose protected health information.

---

# Rule 13 — Auditability

Every clinical action must record:

- User
- Date & Time
- Action
- Organization

Clinical records should never be silently modified.

---

# Rule 14 — Documentation

Every major feature must include:

- Documentation
- API updates (if applicable)
- Database updates (if applicable)
- Tests (where applicable)

---

# Rule 15 — Coding Standards

Use:

- TypeScript (strict mode)
- SOLID principles
- Clean Architecture
- Meaningful naming
- Small reusable functions

Avoid hard-coded values.

Avoid duplicated logic.

---

# Rule 16 — AI Coding Assistants

Before generating code:

1. Read Product Foundation.
2. Read Architecture.
3. Read relevant module documentation.
4. Reuse existing components.
5. Generate production-quality code.

Do not invent new architecture.

---

# Rule 17 — Version Control

Every meaningful architectural change requires:

- Version History update
- Documentation update
- Approval before implementation

---

# Rule 18 — Clinical Safety

Clinical safety has priority over convenience.

When uncertain:

- Request clinician review.
- Escalate appropriately.
- Never suppress important clinical information.

---

# Rule 19 — Scalability

Every feature should support:

- Multiple organizations
- Multiple healthcare settings
- Multiple specialties
- International expansion

---

# Rule 20 — Guiding Principle

Klinimate is not simply a Hospital Information System.

It is an AI-powered Clinical Intelligence Platform.

Every line of code should contribute to making healthcare simpler, safer, faster, and more intelligent while preserving clinician autonomy and improving patient care.

---


# Golden Rule

Whenever implementing a new feature, ask:

1. Does it make clinicians' work easier?
2. Does it improve patient care?
3. Does it reduce clicks?
4. Does it fit the existing architecture?
5. Can it scale to thousands of healthcare organizations?

If the answer to any question is "No", redesign the feature before implementation.
