# Klinimate Product Constitution

Version: 1.0

Status: Active

Owner: Dr. Avdhut Kulkarni (Founder & Director)

Product: Klinimate – AI-Powered Clinical Command Centre

This document defines the vision, philosophy, design principles, clinical principles, and product standards of Klinimate. It serves as the single source of truth for all product, engineering, AI, and user experience decisions.

Every feature, workflow, interface, AI recommendation, and future implementation must align with this document.

## 1. Product Vision

Klinimate exists to build the simplest hospital operating system for everyday clinical care.

Our mission is to create an AI-assisted clinical workflow that is:
- mobile-first
- fast enough for bedside use
- designed for secondary and rural hospitals
- simple enough for one clinician to complete most tasks within seconds

Klinimate should reduce friction in hospitals where time, staffing, and infrastructure are limited.

---

## 2. Core Philosophy

Klinimate should feel like the WhatsApp of Healthcare.

That means:
- extremely simple
- minimal clicks
- minimal scrolling
- no unnecessary screens
- one-hand mobile operation
- intuitive without training
- usable even by first-time users

The product should feel calm, direct, and dependable in high-pressure clinical environments.

---

## 3. UI Principles

Klinimate must be designed around speed, clarity, and trust.

### Core UI rules
- Mobile first
- Thumb friendly
- Large touch targets
- Bottom navigation for core actions
- One primary action per screen
- Maximum two taps for common tasks
- Large readable fonts
- Minimal typing
- Smart defaults
- Auto-save
- Editable AI suggestions
- Consistent buttons
- Clean white interface
- Calm medical color palette

### Interaction expectations
- Interfaces should feel lightweight and fast.
- Screens should avoid clutter and unnecessary detail.
- Important actions must be obvious without explanation.
- Users should never need to learn a complex workflow to perform common tasks.

---

## 4. Clinical Design Principles

Klinimate is a clinical product first, and technology second.

### Clinical workflow rules
- Clinical workflow must match real hospital workflow.
- Never force doctors to calculate scores.
- Prefer clinical red flags instead of complex scoring systems whenever possible.
- AI should simplify medicine—not complicate it.
- Every recommendation must explain WHY.
- Recommendations remain editable.
- The doctor always has final authority.

### Clinical safety principles
- The system must support the treating physician, not replace them.
- Every feature must preserve speed and clarity during busy ward rounds or ICU review.
- Clinical information should be easy to review, update, and act upon.

---

## 5. AI Principles

Klinimate AI Clinical Assessment is a clinical decision support layer, not an autonomous authority.

### AI must
- assist clinicians
- never replace clinical judgement
- explain reasoning in plain language
- detect red flags
- suggest investigations
- suggest management options
- prioritize patient safety
- escalate uncertainty when appropriate
- learn from structured clinical data

### AI output rules
- AI recommendations must be editable at all times.
- AI suggestions should be transparent and understandable.
- AI should reduce cognitive load, not add confusion.
- Every AI suggestion should help the clinician make a better decision more quickly.

---

## 6. Navigation Principles

Navigation should be frictionless.

### Navigation rules
- Maximum two taps for common tasks
- Minimal scrolling
- Never open unnecessary pages
- Keep workflows step-by-step
- Allow quick editing
- Allow quick return to dashboard

The product should avoid breaking the clinician’s flow with excessive navigation or hidden actions.

---

## 7. Forms

Forms should be designed for speed and minimal effort.

### Form rules
- Use checkboxes where possible
- Use large buttons for primary actions
- Use dropdowns for controlled options
- Use radio buttons for short clinical choices
- Minimize free typing
- Support voice input ready for the future
- Support camera input ready for the future

Forms should prioritize fast selection over long entry.

---

## 8. Daily Progress Round

The Daily Progress Round is a core clinical workflow for Ward and ICU use.

It should be:
- a one-screen experience
- composed of collapsible cards
- editable throughout
- AI generated summary supported
- manual notes after every section
- supported by an overall manual impression
- quick to save
- quick to submit

This workflow must support busy ward rounds and ICU rounds without slowing clinical review.

---

## 9. Triage Principles

Klinimate triage must remain simple and clinically useful.

### Standard triage levels
- Green
- Yellow
- Red
- Black

### Triage rules
- Use simple red flag based logic
- Prioritize urgent recognition of deterioration
- Never expose qSOFA or NEWS2 to general users unless advanced mode is enabled

Triage should support early escalation without overwhelming the user with complex scoring systems.

---

## 10. Performance Goals

Klinimate must feel instant and reliable.

### Performance targets
- Application should load in under 2 seconds
- Common actions should complete in under 5 seconds
- Offline friendly where possible
- Fast on slow internet

Performance is part of safety. Slow systems create delay, fatigue, and avoidable errors.

---

## 11. Future Scalability

Klinimate must be built as a platform, not as a one-off feature set.

### Scalability rules
- Every module must reuse components
- Reusable cards
- Reusable forms
- Reusable AI widgets
- Reusable alert engine

New features must fit into the same system language and interaction model.

---

## 12. Development Rules

Developers must always:
- reuse components
- avoid duplicate code
- maintain consistent UI
- follow this document before implementing any feature

No feature should be implemented in isolation from the product constitution.

---

## 13. Klinimate Golden Rule

Every feature must answer one question:

“Does this make the clinician’s job faster, easier, and safer?”

If the answer is no, the feature should be redesigned or removed.

---

## 14. Governance

- If any future implementation conflicts with this document, this document takes precedence.
- Any deviation from these principles must be intentional, documented, and approved before implementation.
- Every new feature should improve simplicity, speed, clinical safety, user experience, or scalability.
- Otherwise, redesign or remove the feature.
