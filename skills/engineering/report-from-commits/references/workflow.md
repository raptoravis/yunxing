# Workflow

Operating sequence for turning git history into a non-technical report.

**Preconditions:** An exact `YYYY-MM-DD` start date, a readable git repo, and a report-generation goal.

## 1. Resolve the repo

Run `git rev-parse --show-toplevel` in the current directory, or `git -C <path> rev-parse --show-toplevel` when an explicit path is given.

Stop and ask the user for a readable git repository path if this fails.

## 2. Refuse ambiguous dates

Never translate phrases like "this week", "recently", "since launch", or "a few days ago" into a date yourself. Ask:

> What exact start date should I use? Please reply in YYYY-MM-DD.

Do not proceed until the user answers with an exact date.

## 3. Gather context

Run `python3 scripts/collect_git_changes.py --repo <path> --since <date>` first. Add `--until <date>` for bounded ranges.

This gives you subjects, scopes, files, and path counts in one pass — a fast high-level overview that lets you decide what needs deeper inspection.

## 4. Inspect selectively

Only deep-read specific commits (via `git log --stat` or `git show <commit>`) when the helper output is too vague to group by feature. The goal is a clear report, not a full forensic audit.

## 5. Group by feature

Look for these grouping signals, in priority order:

1. Conventional-commit scopes (`feat(checkout):`, `fix(payment):`)
2. Repeated top-level directories across commits
3. Customer-facing thread subjects
4. Shared ticket or issue references in commit messages

Merge related commits into one accomplishment. A single feature spread across five commits is one section, not five.

## 6. Write the report

Fill in the template, then check:

- Grouped by feature, not by commit
- Max 2-3 bullets per section
- No hashes, filenames, branches, or internal tooling names
- Plain Markdown, ready for email or chat
