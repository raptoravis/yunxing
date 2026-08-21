---
name: new-raw
description: "Capture a raw requirement exactly as given: no clarification, no alignment, no dialogue. Creates a GitHub/GitLab issue (so you can paste images) or a local markdown file as fallback. Feeds into /grill-with-docs and /to-spec."
disable-model-invocation: true
argument-hint: "[raw requirement text to capture as-is]"
---

# Capture a Raw Requirement

`new-raw` is the **intake** step. It records a requirement verbatim: the user's own words, untouched. Later, `/grill-with-docs` aligns it into a shared understanding, and `/to-spec` turns the aligned result into an official spec.

- `new-raw` answers: "What did the user just say they want, in their own words?"
- `/grill-with-docs` answers: "What does that actually mean: what should it become?"
- `/to-spec` answers: "What are we going to build, exactly?"

This skill does **not** clarify, rephrase, scope, challenge, or plan. It captures and files the text, then points forward.

## Principles

1. **Capture verbatim**: Store the user's exact words. No rewording, summarising, or polishing. Light cleanup only: trim surrounding whitespace, collapse repeated blank lines.
2. **Prefer the issue tracker**: When a GitHub or GitLab tracker is configured (via `/setup-matt-pocock-skills`), create an **issue** so the user can paste images, screenshots, mockups, and diagrams directly into it. An issue is a first-class artifact that the rest of the pipeline already knows how to read.
3. **Fall back to local MD**: When no tracker is configured, or the user explicitly says `--local`, write to `raw-requests/YYYY-MM-DD-NNN-<slug>.md`.
4. **One request per issue**: If the input contains several distinct requests, create one issue per request.
5. **Fast and non-interactive**: Create the issue, confirm, point forward. Ask for text only when no argument was provided.

## Execution

### 1. Obtain the raw text

Use the argument passed to this skill as the raw text. If none was provided, ask the user once (open-ended) to paste the text to capture.

### 2. Decide where to publish

Read the issue tracker config. If `docs/agents/issue-tracker.md` exists:

- **GitHub** → create an issue via `gh issue create`.
- **GitLab** → create an issue via `glab issue create`.
- **Local markdown** → use the local-file path below.

If `docs/agents/issue-tracker.md` doesn't exist (setup never ran), default to the local-file path.

**Local-file path:** `<root>/raw-requests/YYYY-MM-DD-NNN-<topic>.md`

- `<root>`: if `docs/` exists and is the configured doc root, use `docs/raw-requests/`. Otherwise `raw-requests/` at the repo root.
- `YYYY-MM-DD`: today's date.
- `NNN`: zero-padded sequence number for today, starting at `001`. Check existing files for today, increment.
- `<topic>`: short kebab-case slug from the first few meaningful words (~5 words, ~40 chars). If no usable words, use `untitled`.

### 3a. Create a GitHub issue

```bash
gh issue create \
  --title "<topic>" \
  --body "<the raw text, verbatim>" \
  --label "needs-triage"
```

- `--title`: use the same `<topic>` slug, but in human-readable form (spaces, capitalisation). Derive it from the raw text: take the first phrase that captures the gist.
- `--body`: the raw text exactly as received. Do not add extra formatting, templates, or commentary.
- `--label`: apply `needs-triage` (or the equivalent from `docs/agents/triage-labels.md` if configured differently). If the label doesn't exist on the repo, create it or omit it: don't block on the label.

After creation, note the issue number. The user can now open it on GitHub and paste images, screenshots, or diagrams directly into the issue body.

### 3b. Create a GitLab issue

Same shape, using `glab issue create` with the equivalent flags and the configured triage label.

### 3c. Write a local file

```markdown
---
status: raw
created: YYYY-MM-DD
aligned_spec: null
---

# Raw Request

<the raw text, verbatim: preserve language, formatting, and typos>
```

### 4. Confirm and point forward

Tell the user, briefly:

- **Issue tracker:** the issue number and URL. Then: "_Paste any images or screenshots directly into the issue. When ready, run `/grill-with-docs` and point it at this issue._"
- **Local file:** the path written and slug used. Then: "_Run `/grill-with-docs` to align this into a shared understanding, or `/to-spec` if you already know exactly what to build._"

Do not run `/grill-with-docs` or `/to-spec`. Stop here.

## Multiple requests

If the input clearly contains several independently valuable requests (numbered or separated by clear delimiters), create one issue (or file) per request. When in doubt, capture as one: splitting is an alignment act.
