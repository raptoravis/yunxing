# Output Format

Rules for writing audience-facing reports from git history.

## Language

**报告必须使用中文。这是硬性要求，没有例外。**

Every line you output — the intro, every heading, every bullet — must be in Chinese. Inherently-English technical nouns like API, SDK, UI, JSON, CLI and Git author names or emails may stay as-is, but their surrounding description MUST be in Chinese.

Before delivering the report, do a line-by-line scan. If any sentence is in English, rewrite it in Chinese. Do not skip this check. Do not deliver an English report.

## Audience

- Write for non-technical readers — clients, stakeholders, leadership.
- Cover: what changed, where progress happened, why it matters at a high level.
- Exclude: commit hashes, filenames, internal module names, refactor details, branch/PR mechanics.

## Structure

- One-line intro naming the date range, total commit count, and every included commit author's count and share of the total (e.g. "以下是自 2026-04-01 以来共 42 个提交的工作进展高层次更新。涉及提交者：Alice：30 个提交（71.4%）、Bob：12 个提交（28.6%）。") Use `commit_count` and `commit_percentage` from each entry in the collector's `authors` summary. When two identities share a name, append their emails to distinguish them.
- Short feature headings per main accomplishment (e.g. `## 结账体验`)。
- A `提交者：<姓名>` line directly under each feature heading, naming who committed the work in that section. Draw names from the commit entries' `author.name`. When a section merges commits from multiple authors, list them all joined by `、`; when two identities share a name, append their emails.
- Max 2-3 bullets per feature section.

## Bullet rules

- Start with the accomplishment, not the implementation detail.
- One short sentence when possible; explain results in plain language.
- Avoid overclaiming what the diff doesn't prove.

## Grouping

- Group by feature or user-facing workflow: 用户引导、结账流程、报表功能、内容发布、管理控制。
- Avoid weak groups like "后端清理", "Bug 修复", "杂项", or commit-by-commit summaries.

## Conservative language

- State clear benefits plainly.
- If the benefit isn't clear from the diff, use modest phrasing — "推进了……工作", "改进了……的基础", "优化了……的流程".

## Final pass checklist

- 2-3 bullets max per section
- Every bullet safe for a non-technical audience
- Duplicate themes across commits merged
- Every included commit author appears in the intro with their commit count and percentage, with no uninvolved author added
- Every feature section names its author(s) in a `提交者` line, and the names match the commits actually grouped into that section
- Output is paste-ready Markdown for email or chat
- **全文使用中文**
