# Engineering

Skills for daily code work.

## User-invoked

Reachable only when you type them (Claude Code: `disable-model-invocation: true`; Codex: `policy.allow_implicit_invocation: false` in `agents/openai.yaml`).

- **[new-raw](./new-raw/SKILL.md)**: Capture a raw requirement exactly as given, with no clarification, alignment, or dialogue. Creates a GitHub or GitLab issue so you can paste images, or a local Markdown file as fallback.
- **[vision](./vision/SKILL.md)**: Send an image to a configured external vision provider when native vision is not available or not sufficient.

## Model-invoked

Model- or user-reachable (rich trigger phrasing so the model can reach for them).

- **[report-from-commits](./report-from-commits/SKILL.md)**: Turn git history since an exact date into a copy-pastable, non-technical report grouped by feature, in Chinese.
- **[playwright-tester](./playwright-tester/SKILL.md)**: Automated UI testing with Playwright's native runner: writes persistent `.spec.ts` files, runs them at zero AI tokens, and fixes failures in an automated loop.