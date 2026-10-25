## What it does

`new-raw` captures a requirement, idea, or problem statement **exactly as you type it**, verbatim, with no clarifying questions, no rewording, and no scope negotiation. When the repository has a GitHub or GitLab remote and the matching CLI is installed and authenticated, it files the text as an issue so you can paste images, screenshots, mockups, and diagrams directly into it. Otherwise it writes a dated Markdown file under `raw-requests/`.

It is the intake step. You speak, it writes. It does not align, plan, or challenge the request.

## When to reach for it

Type `/new-raw <your idea here>`. Use it when:

- You have a rough idea and want to capture it before you forget
- You have a screenshot or mockup you want to attach to the record
- You want the raw input pinned as a reference before refining it
- You are in a flow and do not want to stop to align: just dump the thought and move on

## Common questions

**Will it clean up or reinterpret what I wrote?**

No. Verbatim capture is the constraint. Refine the request later, in whatever planning flow you use.

**Do I need a hosted issue tracker?**

No. A GitHub or GitLab remote with its CLI gives the best image-pasting workflow, but with neither, the skill writes a date-stamped Markdown file under `raw-requests/`.

**Does it need configuration?**

No. It checks the origin remote and `gh auth status` or `glab auth status` on every run, and falls back to a local file. Pass `--local` to force the local path.

## It's working if

- The captured body preserves the original request word for word.
- No clarifying question interrupts capture.
- The request lands either as an issue on the configured tracker or in the documented local fallback.
