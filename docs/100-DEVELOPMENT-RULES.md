# Klinimate Development Rules

Version: 2.0

Status: Active

Owner: Dr. Avdhut Kulkarni (Founder & Director)

---

# Purpose

This document defines the official software engineering standards for the Klinimate Platform.

Every developer, contributor, AI coding assistant, automation tool, and future engineering team must follow these rules.

The Klinimate Product Foundation is frozen.

Development should extend the platform without changing its core architecture.

---

# Rule 1 — Respect the Product Foundation

The following documents are the constitutional documents of Klinimate:

- Vision
- Product Requirements Document (PRD)
- Clinical Workflow
- Database Design
- Clinical Design System
- Data Architecture
- Architecture
- Development Rules

Do not redesign or replace these documents without Founder approval.

---

# Rule 2 — Follow the Architecture

Every feature must belong to an existing platform module.

Never create duplicate workflows.

Never create parallel architectures.

Always extend existing modules before creating new ones.

---

# Rule 3 — One Platform

Klinimate is one integrated platform.

Never build disconnected applications.

Every feature should integrate with:

- Patient
- Episode
- Timeline
- Patient Intelligence
- Organization
- Klinimate Intelligence

---

# Rule 4 — Mobile First

Every feature must be designed for mobile before desktop.

Requirements:

- One-hand operation
- Large touch targets
- Fast loading
- Minimal scrolling
- Responsive layout

---

# Rule 5 — Click More • Type Less

Always prefer:

- Smart Search
- Auto-complete
- Quick Selection
- Intelligent Defaults
- Auto-generated Summaries

Avoid unnecessary typing.

---

# Rule 6 — One Patient • One Clinical Record • One Timeline • One Patient Intelligence

Never duplicate patient information.

Everything belongs to:

Patient

↓

Episode

↓

Timeline

↓

Patient Intelligence

---

# Rule 7 — AI Assists • Clinicians Decide

AI may:

- Summarize
- Organize
- Prioritize
- Recommend
- Explain

AI must never:

- Replace clinician judgement
- Make autonomous clinical decisions
- Hide uncertainty
- Automatically finalize clinical documents

Every AI-generated summary must be reviewable and editable by clinicians before finalization.

---

# Rule 8 — Patient Intelligence First

Patient Intelligence is the primary clinical overview.

Every patient-related module should contribute to Patient Intelligence.

Never create independent clinical summaries outside Patient Intelligence.

---

# Rule 9 — Keep the Interface Simple

Every screen should have:

- One primary purpose
- One primary action

Avoid:

- Complex menus
- Unnecessary dialogs
- Deep navigation
- Information overload

Display the most important information first.

Allow deeper information through drill-down pages.

---

# Rule 10 — Component Reuse

Before creating a component:

- Search existing components.
- Reuse whenever possible.

Avoid duplicated UI.

Maintain consistent design patterns.

---

# Rule 11 — Modular Architecture

Separate:

- UI
- Business Logic
- API
- Database
- AI
- Authentication

Every module should remain independently maintainable.

---

# Rule 12 — Security by Default

All clinical information must be:

- Authenticated
- Authorized
- Encrypted in transit
- Encrypted at rest
- Fully auditable

Never expose patient information.

---

# Rule 13 — Auditability

Every clinical action must record:

- Organization
- User Account
- Selected User Profile
- Date & Time
- Device
- Action

Clinical information should never be silently modified.

---

# Rule 14 — Performance

Prioritize:

- Fast loading
- Efficient database queries
- Optimized API calls
- Lazy loading
- Minimal network requests

Clinical workflows should remain responsive even under heavy load.

---

# Rule 15 — Database Standards

Never duplicate clinical data.

Every clinical event must belong to:

- Organization
- Patient
- Episode
- Timeline

Documents should be stored in cloud object storage.

Database stores structured information and secure file references only.

---

# Rule 16 — Documentation

Every major feature must include:

- Updated documentation
- Database changes
- API documentation
- Test cases
- Version updates (where applicable)

Documentation is part of the product.

---

# Rule 17 — Coding Standards

Use:

- TypeScript (Strict Mode)
- React
- FastAPI
- PostgreSQL
- Clean Architecture
- SOLID Principles

Prefer:

- Small reusable components
- Meaningful names
- Strong typing
- Readable code

Avoid:

- Hard-coded values
- Duplicate logic
- Unnecessary complexity

---

# Rule 18 — AI Coding Assistants

Before generating code:

1. Read the Vision.
2. Read the PRD.
3. Read Architecture.
4. Read the relevant module documentation.
5. Reuse existing components.
6. Generate production-quality code.

AI assistants must never invent new workflows or architecture.

---

# Rule 19 — Clinical Safety

Clinical safety always overrides convenience.

If uncertainty exists:

- Request clinician review.
- Escalate appropriately.
- Preserve complete auditability.

Never suppress clinically significant information.

---

# Rule 20 — Scalability

Every feature must support:

- Multiple Organizations
- Multiple Episodes of Care
- Multiple Healthcare Settings
- Multiple Specialties
- Millions of Patients
- International Expansion

Never design features for a single organization only.

---

# Rule 21 — Data Ownership

Healthcare organizations own their clinical data.

Klinimate provides:

- Secure storage
- Clinical Intelligence
- Data portability

Organizations must always be able to export their own data.

---

# Rule 22 — Patient Intelligence Summary

Patient Intelligence Summary is the single source for generating:

- Discharge Summary
- Referral Summary
- Insurance Support Summary
- Billing Support Summary
- Home Care Summary
- Rehabilitation Summary

Do not build separate documentation workflows when the same information already exists within Patient Intelligence.

---

# Rule 23 — Version Control

Major architectural changes require:

- Documentation updates
- Version updates
- Founder approval

Minor feature additions should extend the existing architecture.

---

# Guiding Principle

Klinimate is an AI-Powered Clinical Intelligence Platform.

Every line of code should simplify healthcare, reduce documentation burden, improve patient safety, and enhance clinical decision-making while ensuring clinicians remain in complete control.

---

# Golden Rules

Before implementing any feature, ask:

1. Does it simplify clinical workflows?
2. Does it reduce documentation burden?
3. Does it improve patient care?
4. Does it reduce clicks?
5. Does it align with the Product Foundation?
6. Does it strengthen Patient Intelligence?
7. Can it scale to thousands of healthcare organizations?
8. Is it mobile-first?
9. Is it clinically safe?
10. Can a first-time clinician use it without training?

If the answer to any question is **No**, redesign the feature before implementation.

---

# Final Engineering Principle

**Build once. Reuse everywhere.**

Every feature should contribute to one unified Klinimate Platform rather than creating isolated workflows or duplicate functionality.
**Build once. Reuse everywhere.**

Every feature should contribute to one unified Klinimate Platform rather than creating isolated workflows or duplicate functionality.
