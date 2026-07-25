Quickstart:

```bash
npx skills add mattpocock/skills --skill=new-raw
```

```bash
npx skills update new-raw
```

[Source](https://github.com/mattpocock/skills/tree/main/skills/engineering/new-raw)

## What it does

`new-raw` captures a requirement, idea, or problem statement **exactly as you type it** — verbatim, with no clarifying questions, no rewording, no scope negotiation. It creates a **GitHub (or GitLab) issue** by default so you can paste images, screenshots, mockups, and diagrams directly into it, or falls back to a local markdown file when no tracker is configured.

It's the intake step. You speak, it writes. Later, `/grill-with-docs` aligns you and the agent on what the request actually means, and `/to-spec` synthesises the aligned understanding into a formal spec.

## When to reach for it

Type `/new-raw <your idea here>`. Use it when:

- You have a rough idea and want to capture it before you forget
- You have a screenshot or mockup you want to attach — the issue is ready for image paste
- You're about to run `/grill-with-docs` and want the raw input pinned as a reference
- You're in a flow and don't want to stop to align — just dump the thought and move on

## Where raw requests live

By default, each raw request becomes a **GitHub issue** (when a GitHub tracker is configured via `/setup-matt-pocock-skills`). The issue gets the `needs-triage` label, signalling it's unprocessed intake. You can paste images directly into the issue body on GitHub.

When no tracker is configured, or you pass `--local`, the skill writes to `raw-requests/YYYY-MM-DD-NNN-<topic>.md` — date-stamped, sequence-numbered, and slugged for findability.

## Relationship to other skills

`new-raw` is the first link in a chain:

1. **`/new-raw`** — capture the raw idea as a GitHub issue (or local file)
2. **`/grill-with-docs`** — align with the agent, build shared language, document decisions in ADRs
3. **`/to-spec`** — synthesise the aligned understanding into a formal spec on the issue tracker
4. **`/to-tickets`** — break the spec into tracer-bullet tickets
5. **`/implement`** — build the work

You can enter the chain at any point. `new-raw` isn't mandatory — you can jump straight to `/grill-with-docs` if you prefer. But when the idea is fresh, or when you have images to attach, capture it first.
