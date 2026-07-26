# Domain Docs

How the engineering skills should consume this repo's domain documentation.

## Before exploring, read these

- `CONTEXT.md` at the repo root.
- `CONTEXT-MAP.md` if it exists.
- Relevant ADRs under `docs/adr/`.

If any are absent, proceed silently. Domain-modeling workflows create them lazily when needed.

## File structure

This is a single-context repo:

/
├── CONTEXT.md
├── docs/adr/
└── src/

## Use the glossary's vocabulary

Use terms as defined in `CONTEXT.md`. Avoid synonyms the glossary explicitly rejects.

## Flag ADR conflicts

Explicitly surface output that contradicts an existing ADR instead of silently overriding it.
