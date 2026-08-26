## What it does

`report-from-commits` turns a git history range into a copy-pastable, non-technical report grouped by feature, in Chinese. Give it a repo and a date, and it collects every commit since then, groups them into feature areas, and writes the result as audience-safe Markdown ready for email or chat.

You can give it an exact `YYYY-MM-DD`, or a relative expression like "最近一个礼拜", "last week", or "过去3天": it resolves the offset to a concrete date automatically. For a rolling window measured from this moment rather than from midnight, pass `--last-days N` to `collect_git_changes.py`: `--last-days 1` means the last 24 hours, and the window runs on exact timestamps from `now - N days` to `now`. Give it no date at all and it defaults to the last week. The only dates it refuses are the truly anchorless ones: "recently", "a while ago". Those it still asks you to pin down, because the skill runs a hard date range under `git log --since` and a guessed range silently produces the wrong report.

## When to reach for it

Type `/report-from-commits`, or the agent reaches for it automatically when you ask for a client update, a stakeholder recap, a progress report from git history, or a high-level summary of work since a date.

| Your situation | Reach for |
| --- | --- |
| You want a non-technical update from git history for a client, stakeholder, or team | `report-from-commits` |
| You want engineering release notes, a developer changelog, or commit-by-commit detail | Not this skill: write the changelog by hand or use a changelog tool |
| You want a code review of the changes | [code-review](https://aihero.dev/skills-code-review) |
| You have no start date at all, not even a relative range | Use it anyway: the skill defaults to the last week |

## The feature group

The skill's defining idea is **feature-grouped, not commit-by-commit**. A feature spread across eight commits produces one section with two or three bullets, not eight sections. Five unrelated commits touching the same directory are still grouped by what they accomplish, not by where the files live.

It works because the skill inspects before it writes. The first pass runs `collect_git_changes.py`, which excludes merge commits and commits with no changed files, then pulls every remaining commit author, subject, scope, and touched file into one JSON document. Scopes from conventional commits (`feat(checkout):`, `fix(payment):`) and repeated top-level paths are the strongest grouping signals. When those are not enough, the skill inspects a few representative diffs, but only enough to group the work, never a full audit.

The output contract is tight by design:

- One-line date and effective-change commit-count intro in Chinese, followed by every involved author's commit count and percentage
- Short feature headings in Chinese, each including `提交者：<姓名>` in the same heading
- 2-3 outcome-first bullets per section, each one sentence, in Chinese
- No hashes, no filenames, no branch names, no refactor jargon
- Optional "稳定性与基础设施" section for internal work worth mentioning

When there were no meaningful changes in the window, the report says so in one sentence. A padded report is worse than an honest one.

## Common questions

**What if my commits don't use conventional commit scopes?**

The script still works. It extracts scopes where they exist and ignores them where they don't. When no scopes are found, the skill falls back on repeated top-level directories, shared ticket references in commit messages, and the subjects themselves as grouping signals. A repo without a single `feat(…):` prefix still produces a grouped report; it just takes one more inspection pass.

**Can I use a date range instead of an open-ended "since"?**

Yes. Pass `--until YYYY-MM-DD` to `collect_git_changes.py` for bounded windows: monthly reports, sprint reviews, or any fixed-interval recap. The skill asks for the start date first; tell it the end date as well and it uses both.

**What if I want "the last 24 hours" rather than "since a date"?**

Use `--last-days 1`. The `--since` path resolves everything to a calendar date, so "today" starts at midnight. `--last-days N` instead runs a rolling window on exact timestamps from `now - N days` to `now`, which is what "最近24小时" or "last 24 hours" actually means. `--last-days` and `--since` are mutually exclusive: pick the one that matches how the range was phrased.

**Which authors appear in the report?**

The opening line lists every author represented by the collected effective-change commits, with their commit count and percentage of that total. Merge commits and commits with no changed files do not appear in the collected commit list and do not affect the total or author percentages. Percentages are calculated from the filtered report window, not the repository's lifetime history. Names are deduplicated, and email addresses appear only when two distinct identities use the same name. If you filter with `--user`, the list and percentages reflect the filtered commits rather than every contributor in the repository. Each feature section also names its author(s) inside the heading as `章节标题（提交者：姓名）`, drawing from the commits grouped into that section so a reader can see at a glance who did which piece of work.

**Why not just pipe `git log` into an LLM and ask for a summary?**

That is the obvious shortcut, and it fails in two ways. First, raw `git log` output mixed into a prompt with the instruction "write a client update" produces a report that drifts: some bullets are verbatim commit subjects with the jargon still in them, others invent impact the diff doesn't support. Second, the [context window](https://www.aihero.dev/ai-coding-dictionary/context-window) cost is high: a hundred commits with full diffs is a large prompt. `collect_git_changes.py` reduces each commit to its author, subject, scope, date, and touched files, the structured summary the skill needs to group the work, not the full source.

## It's working if

- Relative dates with a clear offset ("最近一个礼拜", "last week") are resolved to `YYYY-MM-DD` automatically. A rolling "from now" window ("最近24小时") uses `--last-days N`, with `--last-days 1` meaning the last 24 hours. A missing date defaults to the last week. Only anchorless dates ("recently") trigger a stop-and-ask.
- The report has 3-8 feature sections, not one section per commit.
- Every bullet is safe to paste into a client or stakeholder email: no hashes, no filenames, no "refactored the middleware pipeline".
- The report is written in Chinese: intro, headings, and all bullets.
- The opening line includes the effective-change commit count and every involved author's commit count and percentage alongside the date range.
- Each feature section names its author(s) inside the heading, matching the commits grouped into that section.
- Merge commits and empty commits are absent from the report and its statistics. CI churn and dependency bumps are either absent or folded into one modest "稳定性与基础设施" section.
- A window with no meaningful changes produces a one-line honest answer, not a padded report.

## Where it fits

`report-from-commits` is a **standalone** skill: reach for it any time you need to turn git history into prose, independent of the build and review chains.

- [code-review](https://aihero.dev/skills-code-review) is the closest neighbour: both inspect git history, but `code-review` checks the code against standards and a [spec](https://www.aihero.dev/ai-coding-dictionary/spec), while `report-from-commits` produces audience-facing prose. One is for engineers; the other is for everyone else.
- [research](https://aihero.dev/skills-research) runs in a background agent and leaves a cited Markdown file, a different kind of report, but the same discipline of inspecting before writing.

[ask-matt](https://aihero.dev/skills-ask-matt) routes across the whole set when you are unsure which skill the situation wants.
