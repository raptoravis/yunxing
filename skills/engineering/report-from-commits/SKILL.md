---
name: report-from-commits
description: Turn git commits and diffs since an exact date into a copy-pastable, non-technical report grouped by feature. Use when the user wants a client update, weekly progress, stakeholder recap, high-level git-history summary, or commit-based progress report. Do NOT use when the date is ambiguous or the user wants engineering release notes.
---

# report-from-commits

Turn git history since an explicit date into a copy-pastable, non-technical report grouped by feature.

## 语言 / Language

**报告必须用中文输出。这是硬性要求，不是建议。**

Every line of the final report — intro, section headings, bullets, all of it — must be written in Chinese. Inherently-English technical terms (API, SDK, UI, JSON, CLI) and Git author names or emails may stay as-is, but their surrounding description must be in Chinese. Before delivering the report, do a line-by-line check: if any sentence is in English, rewrite it in Chinese. Do not output the report until it passes this check.

## Decision Tree

What do you know already?

- Exact start date in `YYYY-MM-DD` and the current working directory is the target git repo: continue.
- Exact start date in `YYYY-MM-DD`, but the target repo is elsewhere: use the explicit repo path and continue.
- Relative date such as "最近一个礼拜", "last week", "过去一个月", "最近3天", or "yesterday": resolve it to an exact `YYYY-MM-DD` using the resolution table below. Use today's date from the system context to compute the offset. Do not ask the user to rephrase — just resolve and proceed.
- No start date given at all (the user asked for a report without mentioning a date or `--since`): default to the last week. Resolve to `today - 7 days` using today's date from the system context, and proceed without asking.
- Truly vague date such as "recently", "a while ago", "some time back", or "since the last push": stop and ask `What exact start date or relative range should I use? (e.g. "last week", "过去一个月", "最近3天")`. Do not proceed until the user answers.
- No readable git repo in the current working directory and no repo path was provided: stop and ask for a readable git repository path.
- The user wants engineering release notes, a developer changelog, or a code review: do not use this skill.
- The user specifies a particular author ("只看 raptoravis 的", "only my commits", "--user raptoravis"): pass `--user <name-or-email>` to `collect_git_changes.py`. If no user is specified, all authors are included by default.

### Relative Date Resolution

When the user gives a relative date expression, resolve it to `YYYY-MM-DD` by subtracting from today's date (available in the system context). Use these mappings:

| Expression (EN) | Expression (ZH) | Offset |
| --- | --- | --- |
| today | 今天 | 0 days |
| yesterday | 昨天 | 1 day |
| last N days / past N days | 最近N天 | N days |
| last week / this week / past week | 最近一个礼拜 / 最近一周 / 这周 | 7 days |
| last two weeks / past two weeks | 最近两周 | 14 days |
| last three weeks | 最近三周 | 21 days |
| last month / past month | 最近一个月 / 上月 | 30 days |
| last two months | 最近两个月 | 60 days |
| last three months / last quarter | 最近三个月 / 上季度 | 90 days |
| last six months / past half year | 最近半年 | 180 days |
| last year / past year | 最近一年 | 365 days |

For expressions not listed above (e.g. "last 10 days", "最近45天"), extract the number of days and compute the date directly.

If the expression truly has no time anchor (e.g. "recently", "a while ago"), stop and ask as described above.

## Quick Reference

| Task | Action |
| --- | --- |
| Confirm the repo | Run `git rev-parse --show-toplevel` in the current directory, or `git -C /path/to/repo rev-parse --show-toplevel` when a repo path is provided. |
| Gather commit context | Run `python3 scripts/collect_git_changes.py --repo /path/to/repo --since YYYY-MM-DD`. Add `--user <name-or-email>` to filter by author. If `--since` is omitted, the script defaults to the last week (7 days). |
| Inspect more detail | Read `references/workflow.md` and then inspect targeted commits with `git show <commit>`. |
| Shape the report | Use `templates/report-template.md` and the language rules in `references/output-format.md`. **Write the final report in Chinese — every line.** |
| Handle edge cases | Read `references/gotchas.md`. |

## Operating Rules

1. **输出中文。** 报告的引言、章节标题、所有要点必须用中文撰写。这是不可协商的硬性要求。技术术语（API、SDK、UI 等）以及 Git 作者姓名、邮箱可保留原文，但其周围的描述必须用中文。输出报告前逐行检查：有英文句子就改成中文。
2. Confirm the date before doing anything else. Resolve relative dates (e.g. "最近一个礼拜", "last week") to `YYYY-MM-DD` using the resolution table. When no date is given at all, default to the last week (`today - 7 days`). Only stop and ask when the expression has no time anchor (e.g. "recently").
3. Confirm the repository context. If the current working directory is not a readable git repo, require an explicit repo path.
4. Collect the commit list, author contribution statistics, and touched files first. Use `scripts/collect_git_changes.py` for a fast high-level pass, then inspect specific commits only when the summary is unclear. Pass `--user` when the user asks for a specific author's commits.
5. Group the work by feature, workflow, or product area. Do not group by commit, file, branch, or engineer.
6. Write for a non-technical audience. Remove hashes, filenames, code terms, refactor jargon, and internal tooling names unless they are truly audience-facing.
7. Keep each main accomplishment to a heading plus `2-3` bullets max. Each bullet should be one short sentence.
8. Do not invent business impact. If the value is unclear, use conservative phrasing such as "推进了……工作" or "改进了……的基础".

## Recommended Workflow

1. Resolve the target repo.
2. Resolve the start date. If the user gives a relative expression (e.g. "最近一个礼拜"), resolve it to `YYYY-MM-DD` using the resolution table. If the user gives no date at all, default to the last week (`today - 7 days`). Only ask for clarification if the expression has no time anchor.
3. Run `python3 scripts/collect_git_changes.py --repo /path/to/repo --since YYYY-MM-DD` (add `--user <name-or-email>` if the user wants a specific author only) and review the JSON output. Omit `--since` to default to the last week.
4. Inspect a few representative commits or diffs when the feature grouping is not obvious.
5. Build a feature-based outline first, then write the audience-safe bullets.
6. Write the final report in Chinese using `templates/report-template.md` as the shape. Include the total commit count and every author from the collector's `authors` summary in the opening line. For each author, show their `commit_count` and `commit_percentage` of the included commits. Show author names; when two identities share a name, append their emails to distinguish them. **Before delivering, scan every line: if any sentence is in English, rewrite it in Chinese. Do not skip this check.**

## Report Contract

Use this exact standard:

- **Every sentence of the report must be in Chinese.** This is the first and most important rule. Intro, headings, bullets — all Chinese. Inherently-English technical nouns (API, SDK, JSON, CLI) and Git author names or emails may remain unchanged. Before delivering, verify: no English sentences exist in the output.
- Start with a one-line intro such as `以下是自 2026-04-01 以来共 42 个提交的工作进展高层次更新。涉及提交者：Alice：30 个提交（71.4%）、Bob：12 个提交（28.6%）。` — always include the total commit count and every identity's `commit_count` and `commit_percentage` from the `authors` summary in `collect_git_changes.py` output. List names once; append emails only to distinguish identical names.
- Break the report into feature sections with short audience-friendly headings in Chinese.
- Keep each section to `2-3` bullets max.
- Make every bullet outcome-first and non-technical, written in Chinese.
- Keep the output copy-pastable. Do not wrap it in analysis notes or a developer preamble.
- If there were no meaningful audience-facing changes in the requested window, say so plainly in Chinese instead of padding the report.

## Reading Guide

| Need | Read |
| --- | --- |
| Repo checks, command flow, and git collection steps | `references/workflow.md` |
| Tone, grouping, and bullet-writing rules | `references/output-format.md` |
| Failure modes and what to avoid | `references/gotchas.md` |
| Blank report structure | `templates/report-template.md` |

## Gotchas

1. Truly vague dates (no time anchor) are still a hard stop — "recently", "a while ago". But relative dates with a clear offset ("最近一个礼拜", "last 3 days") should be resolved automatically.
2. A long git log is not a report. Condense by feature and omit low-signal internal churn when it is not useful to the audience.
3. Technical commit subjects are often misleading for a non-technical audience. Inspect the diff or surrounding files before rewriting them as audience-facing bullets.
4. Multiple commits may represent one accomplishment. Merge them into one feature section instead of repeating the same theme.
5. Infrastructure-only changes should not be exaggerated. If they matter, frame them as stability or foundation work (e.g. "稳定性与基础设施") and keep the wording modest.
