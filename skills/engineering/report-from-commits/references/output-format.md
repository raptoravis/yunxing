# Output Format

Rules for writing audience-facing reports from git history.

## Audience

- Write for non-technical readers — clients, stakeholders, leadership.
- Cover: what changed, where progress happened, why it matters at a high level.
- Exclude: commit hashes, filenames, internal module names, refactor details, branch/PR mechanics.

## Structure

- One-line intro naming the date range (e.g. "Here is a high-level update for work completed since 2026-04-01.")
- Short feature headings per main accomplishment (e.g. `## Checkout Experience`).
- Max 2-3 bullets per feature section.

## Bullet rules

- Start with the accomplishment, not the implementation detail.
- One short sentence when possible; explain results in plain language.
- Avoid overclaiming what the diff doesn't prove.

## Grouping

- Group by feature or user-facing workflow: onboarding, checkout, reporting, content publishing, admin controls.
- Avoid weak groups like "backend cleanup", "bug fixes", "miscellaneous", or commit-by-commit summaries.

## Conservative language

- State clear benefits plainly.
- If the benefit isn't clear from the diff, use modest phrasing — "advanced the work on", "improved the foundation for", "tightened the workflow around".

## Final pass checklist

- 2-3 bullets max per section
- Every bullet safe for a non-technical audience
- Duplicate themes across commits merged
- Output is paste-ready Markdown for email or chat
