# Workflow

Operating sequence for turning git history into a non-technical report.

**Preconditions:** A start date (exact `YYYY-MM-DD` or a resolvable relative expression like "最近一个礼拜"), a readable git repo, and a report-generation goal.

## 1. Resolve the repo

Run `git rev-parse --show-toplevel` in the current directory, or `git -C <path> rev-parse --show-toplevel` when an explicit path is given.

Stop and ask the user for a readable git repository path if this fails.

## 2. Resolve the date

If the user gives no date at all, default to the last week: `today - 7 days`. Compute it from today's date in the system context and proceed without asking.

If the user gives a relative date with a clear time offset (e.g. "最近一个礼拜", "last week", "过去3天"), resolve it to `YYYY-MM-DD` using the resolution table in the main SKILL.md. Only ask for clarification when the expression has no time anchor (e.g. "recently", "a while ago"):

> What exact start date or relative range should I use? (e.g. "last week", "过去一个月", "最近3天")

Do not proceed until you have a concrete `YYYY-MM-DD`.

## 3. Gather context

Run `python3 scripts/collect_git_changes.py --repo <path> --since <date>` first. Omit `--since` to default to the last week (7 days). Add `--until <date>` for bounded ranges. Add `--user <name-or-email>` to filter by a specific author.

This gives you authors, subjects, scopes, files, and path counts in one pass: a fast high-level overview that lets you decide what needs deeper inspection. Use each entry's `commit_count` and `commit_percentage` in the top-level `authors` summary for the report intro.

## 4. Inspect selectively

Only deep-read specific commits (via `git log --stat` or `git show <commit>`) when the helper output is too vague to group by feature. The goal is a clear report, not a full forensic audit.

## 5. Group by feature

Look for these grouping signals, in priority order:

1. Conventional-commit scopes (`feat(checkout):`, `fix(payment):`)
2. Repeated top-level directories across commits
3. Customer-facing thread subjects
4. Shared ticket or issue references in commit messages

Merge related commits into one accomplishment. A single feature spread across five commits is one section, not five. While grouping, note which author(s) committed each section's commits: you will attribute each section to them with a `提交者` line when writing.

## 6. Write the report

Fill in the template, then check:

- Grouped by feature, not by commit
- Max 2-3 bullets per section
- Intro includes every author represented by the collected commits, plus each author's commit count and percentage of the total
- Each section names its author(s) in a `提交者：<姓名>` line, drawn from the commits grouped into that section
- No hashes, filenames, branches, or internal tooling names
- Plain Markdown, ready for email or chat
