# 103- Contributing to Klinimate

Thank you for contributing to the Klinimate Platform.

Klinimate is an AI-powered Clinical Intelligence Platform for healthcare organizations.

Because the platform manages clinical information, every contribution must prioritize patient safety, clinical consistency, and software quality.

---

# Before You Start

Before writing any code, read the following documents in order:

1. `98-PRODUCT-FOUNDATION.md`
2. `99-ARCHITECTURE.md`
3. `100-DEVELOPMENT-RULES.md`

These documents are the single source of truth.

Do not implement features without understanding them.

---

# Product Foundation

The Klinimate Product Foundation Version **2.0** is frozen.

Do not:

- Redesign workflows
- Rename core modules
- Introduce parallel architectures
- Duplicate existing functionality

Always extend the existing platform.

---

# Core Philosophy

Every contribution must support:

- One Patient
- One Clinical Record
- One Timeline
- One Patient Intelligence

Patient Intelligence is the primary clinical workspace of the platform.

Every feature should either:

- Improve Patient Intelligence
- Enrich Patient Intelligence
- Simplify Patient Intelligence
- Support the Patient Timeline

---

# Development Principles

Every feature should:

- Reduce clinician workload
- Reduce documentation burden
- Improve patient safety
- Improve communication
- Be mobile-first
- Be clinician-friendly
- Be scalable
- Be secure
- Be fully auditable

---

# Technology Stack

Frontend

- React
- Next.js
- TypeScript
- Tailwind CSS
- shadcn/ui

Backend

- FastAPI
- Python

Database

- PostgreSQL

AI

- Klinimate Intelligence
- OpenAI Models

---

# Coding Standards

Use:

- TypeScript (strict mode)
- SOLID Principles
- Clean Architecture
- DRY
- Reusable Components

Avoid:

- Hard-coded values
- Duplicate code
- Business logic inside UI components

---

# User Experience

Every screen should be:

- Mobile-first
- Fast
- Simple
- Minimal
- Easy to learn

Follow:

- Click More • Type Less
- Search • Select • Save

Patient information always takes priority over branding.

---

# Clinical Safety

AI may:

- Summarize
- Organize
- Prioritize
- Suggest
- Explain

AI must never:

- Replace clinician judgement
- Make autonomous clinical decisions
- Invent clinical information
- Hide uncertainty

Clinical safety always takes priority over convenience.

---

# Pull Requests

Before submitting a Pull Request, verify:

- Product Foundation followed
- Architecture followed
- Development Rules followed
- Mobile-first design maintained
- Documentation updated (if required)
- No duplicate functionality introduced

---

# Commit Message Format

Examples:

feat: add patient registration workflow

feat: implement medication administration

fix: correct patient timeline sorting

docs: update clinical protocol library

refactor: simplify patient dashboard component

---

# Documentation

Update documentation whenever changes affect:

- Product behaviour
- APIs
- Database schema
- Clinical workflow
- Architecture

---

# Questions Before Every Feature

Ask yourself:

1. Does this improve clinician workflow?
2. Does this improve Patient Intelligence?
3. Does this reduce clicks?
4. Does this follow the architecture?
5. Is it mobile-first?
6. Is it clinically safe?
7. Can it scale globally?

If the answer to any question is **No**, redesign before implementation.

---

# Guiding Principle

Every contribution should make healthcare simpler, safer, faster, and more intelligent.

Every line of code should strengthen Patient Intelligence while preserving clinician autonomy, one unified clinical record, and one continuous patient timeline.
