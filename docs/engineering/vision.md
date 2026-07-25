Quickstart:

```bash
npx skills add mattpocock/skills --skill=vision
```

```bash
npx skills update vision
```

[Source](https://github.com/mattpocock/skills/tree/main/skills/engineering/vision)

## What it does

`vision` calls a vision-capable model to describe or analyze an image — a screenshot, a UI mockup, a diagram, a chart, or any visual artifact. It bridges the gap for text-only base models (like DeepSeek) that can't see images natively, and it gives multimodal models a cheaper or faster alternate path for vision tasks.

It's a thin Python CLI (`vision.py`) that encodes an image as a base64 data URI, sends it to the provider with your prompt, and prints the model's text response. A PEP 723 dependency block at the top of `vision.py` lets `uv run` auto-install the only dependency (`openai`) into an ephemeral environment — no global install, no `requirements.txt` to manage.

## When to reach for it

The agent reaches for it automatically when a task involves understanding an image's content — especially on text-only base models that have no native vision.

Reach for it proactively before reading code to infer layout problems; the rendered page tells you what code analysis can't. Also use it for visual regression against a design spec, accessibility checks, and any task where "what does this look like?" is the primary question.

## Providers

Four providers built in, all via OpenAI-compatible endpoints:

- **doubao** (豆包 / Volcengine Ark) — `ARK_API_KEY`, uses `doubao-seed-2-1-pro-260628`
- **qwen** (通义千问 / DashScope) — `DASHSCOPE_API_KEY`, uses `qwen-vl-max`
- **openai** (GPT-4o) — `OPENAI_API_KEY`, uses `gpt-4o`
- **siliconflow** (硅基流动) — `SILICONFLOW_API_KEY`, uses `Qwen/Qwen2.5-VL-72B-Instruct`

Any OpenAI-compatible endpoint (Azure, local models, OneAPI, etc.) can be wired in via `*_BASE_URL` env vars. Provider resolution: `--provider` flag → `VISION_PROVIDER` env → first API key found in `~/.env` (by line order) → `doubao`.

## Setup

1. Copy the env template and fill in at least one API key:
   ```bash
   cp "${SKILL_DIR}/.env.example" ~/.env
   ```
2. Have `uv` on the PATH (`pip install uv` or `winget install astral-sh.uv`).
3. Start using it:
   ```bash
   uv run "${SKILL_DIR}/scripts/vision.py" "screenshot.png" "Describe the page layout and any visible UI issues."
   ```

The optional setup script (`scripts/setup.sh` / `scripts/setup.ps1`) can also inject a frontend UI-check flow into your global `~/.claude/CLAUDE.md` so the "screenshot → analyze → aggregate" pattern becomes the default for layout tasks.

## Relationship to other skills

- **[diagnosing-bugs](https://aihero.dev/skills-diagnosing-bugs)** — when a visual artifact shows a bug, vision describes the artifact and diagnosing-bugs drives the fix loop.
- **[code-review](https://aihero.dev/skills-code-review)** — vision can capture "before/after" screenshots as review evidence, but doesn't replace the code-level review itself.
- **[prototype](https://aihero.dev/skills-prototype)** — when exploring what a UI should look like, prototype builds the variations and vision checks them against the design spec.
