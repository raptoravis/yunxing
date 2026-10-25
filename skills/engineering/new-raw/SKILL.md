---
name: new-raw
description: "Capture a raw requirement exactly as given: no clarification, no alignment, no dialogue. Files it as a GitHub or GitLab issue when the matching CLI is available, so images can be pasted in, or writes a local markdown file as fallback."
disable-model-invocation: true
argument-hint: "[raw requirement text to capture as-is]"
slash: true
---

# Capture a Raw Requirement

`new-raw` is the **intake** step. It records a requirement verbatim: the user's own words, untouched. It does not clarify, rephrase, scope, challenge, or plan. It captures and files the text, then points forward.

## Principles

1. **Capture verbatim**: Store the user's exact words. No rewording, summarising, or polishing. Light cleanup only: trim surrounding whitespace, collapse repeated blank lines.
2. **Prefer an issue**: When the repository has a GitHub remote and the `gh` CLI is installed and authenticated, create an **issue** so the user can paste images, screenshots, mockups, and diagrams directly into it. GitLab works the same way through `glab`. An issue is a first-class artifact that other tools can read.
3. **Fall back to local MD**: When no tracker CLI is available, or the user explicitly says `--local`, write to `raw-requests/YYYY-MM-DD-NNN-<slug>.md`.
4. **One request per issue**: If the input contains several distinct requests, create one issue per request.
5. **Fast and non-interactive**: Create the issue, confirm, point forward. Ask for text only when no argument was provided.

## Execution

### 1. Obtain the raw text

Use the argument passed to this skill as the raw text. If none was provided, ask the user once (open-ended) to paste the text to capture.

### 2. Decide where to publish

Check, in order:

1. `git remote get-url origin` points at GitHub and `gh auth status` succeeds. Use a GitHub issue.
2. `git remote get-url origin` points at GitLab and `glab auth status` succeeds. Use a GitLab issue.
3. Otherwise, write a local file.

Do not configure anything first. This check is read-only and runs on every invocation.

**Local-file path:** `raw-requests/YYYY-MM-DD-NNN-<topic>.md`

- `YYYY-MM-DD`: today's date.
- `NNN`: zero-padded sequence number for today, starting at `001`. Check existing files for today, increment.
- `<topic>`: short kebab-case slug from the first few meaningful words (about 5 words, 40 chars). If no usable words, use `untitled`.

### 3a. Create a GitHub issue

```bash
gh issue create \
  --title "<topic>" \
  --body "<the raw text, verbatim>"
```

- `--title`: use the same `<topic>` slug, but in human-readable form (spaces, capitalisation). Derive it from the raw text: take the first phrase that captures the gist.
- `--body`: the raw text exactly as received. Do not add extra formatting, templates, or commentary.

If the repository has a triage label you want applied, add `--label <name>`; if the label does not exist, omit it and do not block.

After creation, note the issue number. The user can now open it on GitHub and paste images, screenshots, or diagrams directly into the issue body.

### 3b. Create a GitLab issue

Same shape, using `glab issue create` with the equivalent flags.

### 3c. Write a local file

```markdown
---
status: raw
created: YYYY-MM-DD
---

# Raw Request

<the raw text, verbatim: preserve language, formatting, and typos>
```

### 4. Confirm and point forward

Tell the user, briefly:

- **Issue tracker:** the issue number and URL. Then: "Paste any images or screenshots directly into the issue. Refine it into a plan whenever you are ready."
- **Local file:** the path written and slug used. Then: "The captured request is ready for refinement whenever you are."

Stop here. Do not start refining.

## Multiple requests

If the input clearly contains several independently valuable requests (numbered or separated by clear delimiters), create one issue (or file) per request. When in doubt, capture as one: splitting is an alignment act.
