## What it does

`new-raw` captures a requirement, idea, or problem statement **exactly as you type it**, verbatim, with no clarifying questions, no rewording, no scope negotiation. It creates a **GitHub (or GitLab) issue** by default so you can paste images, screenshots, mockups, and diagrams directly into it, or falls back to a local markdown file when no tracker is configured.

It's the intake step. You speak, it writes. Later, `/grill-with-docs` aligns you and the agent on what the request actually means, and `/to-spec` synthesises the aligned understanding into a formal spec.

## When to reach for it

Type `/new-raw <your idea here>`. Use it when:

- You have a rough idea and want to capture it before you forget
- You have a screenshot or mockup you want to attach: the issue is ready for image paste
- You're about to run `/grill-with-docs` and want the raw input pinned as a reference
- You're in a flow and don't want to stop to align: just dump the thought and move on

## Where raw requests live

By default, each raw request becomes a **GitHub issue** (when a GitHub tracker is configured via `/setup-matt-pocock-skills`). The issue gets the `needs-triage` label, signalling it's unprocessed intake. You can paste images directly into the issue body on GitHub.

When no tracker is configured, or you pass `--local`, the skill writes to `raw-requests/YYYY-MM-DD-NNN-<topic>.md`, date-stamped, sequence-numbered, and slugged for findability.

## Relationship to other skills

`new-raw` is the first link in a chain:

1. **`/new-raw`**: capture the raw idea as a GitHub issue (or local file)
2. **`/grill-with-docs`**: align with the agent, build shared language, document decisions in ADRs
3. **`/to-spec`**: synthesise the aligned understanding into a formal spec on the issue tracker
4. **`/to-tickets`**: break the spec into tracer-bullet tickets
5. **`/implement`**: build the work

You can enter the chain at any point. `new-raw` isn't mandatory: you can jump straight to `/grill-with-docs` if you prefer. But when the idea is fresh, or when you have images to attach, capture it first.

## Common questions

**Will it clean up or reinterpret what I wrote?**

No. Verbatim capture is the constraint. Use [grill-with-docs](https://aihero.dev/skills-grill-with-docs) later when you want questions, alignment, and sharper language.

**Do I need a hosted issue tracker?**

No. GitHub and GitLab preserve the best image-pasting workflow, but `--local` writes a date-stamped Markdown file under `raw-requests/`.

## It's working if

- The captured body preserves the original request word for word.
- No clarifying question interrupts capture.
- The request lands either in the configured tracker with `needs-triage`, or in the documented local fallback.

## Where it fits

`new-raw` is an optional intake step before the main engineering flow. It preserves the primary input; [grill-with-docs](https://aihero.dev/skills-grill-with-docs) then aligns it, and [triage](https://aihero.dev/skills-triage) can process incoming tracker items. [ask-matt](https://aihero.dev/skills-ask-matt) maps the complete set.
