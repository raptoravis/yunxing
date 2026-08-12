## What it does

`report-from-commits` turns a git history range into a copy-pastable, non-technical report grouped by feature. Give it a repo and an exact start date, and it collects every commit since then, groups them into feature areas, and writes the result as audience-safe Markdown ready for email or chat.

The defining constraint: it refuses to guess dates. If you say "this week" or "recently", it stops and asks for a `YYYY-MM-DD`. This is not pedantry — the skill runs a hard date range under `git log --since`, and a guessed date silently produces the wrong range. The exact-date gate is the one check that keeps the report honest.

## When to reach for it

Type `/report-from-commits`, or the agent reaches for it automatically when you ask for a client update, a stakeholder recap, a progress report from git history, or a high-level summary of work since a date.

| Your situation | Reach for |
| --- | --- |
| You want a non-technical update from git history for a client, stakeholder, or team | `report-from-commits` |
| You want engineering release notes, a developer changelog, or commit-by-commit detail | Not this skill — write the changelog by hand or use a changelog tool |
| You want a code review of the changes | [code-review](https://aihero.dev/skills-code-review) |
| You have no exact start date and need to figure out what happened when | Run `git log --oneline --since=<best-guess>` first to pin the date, then come back |

## The feature group

The skill's defining idea is **feature-grouped, not commit-by-commit**. A feature spread across eight commits produces one section with two or three bullets, not eight sections. Five unrelated commits touching the same directory are still grouped by what they accomplish, not by where the files live.

It works because the skill inspects before it writes. The first pass runs `collect_git_changes.py`, which pulls every commit subject, scope, and touched file into one JSON document. Scopes from conventional commits (`feat(checkout):`, `fix(payment):`) and repeated top-level paths are the strongest grouping signals. When those are not enough, the skill inspects a few representative diffs — but only enough to group the work, never a full audit.

The output contract is tight by design:

- One-line date intro
- Short feature headings
- 2-3 outcome-first bullets per section, each one sentence
- No hashes, no filenames, no branch names, no refactor jargon
- Optional "Stability and Foundations" section for internal work worth mentioning

When there were no meaningful changes in the window, the report says so in one sentence. A padded report is worse than an honest one.

## Common questions

**What if my commits don't use conventional commit scopes?**

The script still works. It extracts scopes where they exist and ignores them where they don't. When no scopes are found, the skill falls back on repeated top-level directories, shared ticket references in commit messages, and the subjects themselves as grouping signals. A repo without a single `feat(…):` prefix still produces a grouped report; it just takes one more inspection pass.

**Can I use a date range instead of an open-ended "since"?**

Yes. Pass `--until YYYY-MM-DD` to `collect_git_changes.py` for bounded windows — monthly reports, sprint reviews, or any fixed-interval recap. The skill asks for the start date first; tell it the end date as well and it uses both.

**Why not just pipe `git log` into an LLM and ask for a summary?**

That is the obvious shortcut, and it fails in two ways. First, raw `git log` output mixed into a prompt with the instruction "write a client update" produces a report that drifts — some bullets are verbatim commit subjects with the jargon still in them, others invent impact the diff doesn't support. Second, the [context window](https://www.aihero.dev/ai-coding-dictionary/context-window) cost is high: a hundred commits with full diffs is a large prompt. `collect_git_changes.py` reduces each commit to its subject, scope, date, and touched files — the structured summary the skill needs to group the work, not the full source.

## It's working if

- It stops on an ambiguous date ("this week", "recently") and asks for `YYYY-MM-DD` before doing anything else.
- The report has 3-8 feature sections, not one section per commit.
- Every bullet is safe to paste into a client or stakeholder email — no hashes, no filenames, no "refactored the middleware pipeline".
- Merge commits, CI churn, and dependency bumps are either absent or folded into one modest "Stability and Foundations" section.
- A window with no meaningful changes produces a one-line honest answer, not a padded report.

## Where it fits

`report-from-commits` is a **standalone** skill — reach for it any time you need to turn git history into prose, independent of the build and review chains.

- [code-review](https://aihero.dev/skills-code-review) is the closest neighbour: both inspect git history, but `code-review` checks the code against standards and a [spec](https://www.aihero.dev/ai-coding-dictionary/spec), while `report-from-commits` produces audience-facing prose. One is for engineers; the other is for everyone else.
- [research](https://aihero.dev/skills-research) runs in a background agent and leaves a cited Markdown file — a different kind of report, but the same discipline of inspecting before writing.

[ask-matt](https://aihero.dev/skills-ask-matt) routes across the whole set when you are unsure which skill the situation wants.
