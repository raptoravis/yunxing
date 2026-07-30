---
name: vision
description: Call a user-selected external vision provider (Doubao/ByteDance Volcengine Ark, Qwen, OpenAI, SiliconFlow, or any OpenAI-compatible endpoint) to analyze images.
disable-model-invocation: true
---

# vision

Multi-provider external vision tool. Feed it a prompt + image path, get back a text description of the image. Use it when the user explicitly invokes `/vision` to select an external vision model or endpoint.

## Invocation boundary

Do not invoke this skill automatically for screenshots, UI layouts, diagrams, charts, mockups, or other images. When the current model can inspect an image directly, use its native vision capability instead. Run the external provider only after the user explicitly invokes this skill.

## Quick start

```bash
uv run "${SKILL_DIR}/scripts/vision.py" [--provider <name>] <image_path> <prompt>
```

`uv run` reads the PEP 723 dependency block at the top of `vision.py` and auto-installs `openai` into an ephemeral environment on first run — **no manual install step, no global pollution**. Prerequisite: have [uv](https://docs.astral.sh/uv/) on the PATH (`pip install uv` or `winget install astral-sh.uv` on Windows).

When `--provider` is omitted, the provider resolves by: `--provider` flag → `VISION_PROVIDER` env → first API key found in `~/.env` (by file line order) → `doubao`.

> The same `uv run` command works in Git Bash and PowerShell on Windows, and on macOS/Linux.
> `${SKILL_DIR}` resolves at runtime. If your harness doesn't set it, use the absolute path to this skill's directory (e.g. `~/.claude/skills/vision` after `scripts/link-skills.sh`).

## First-time setup

A ready-to-edit template ships at `.env.example` (covers every provider, endpoint, model, and tuning var this skill reads). Copy it to `~/.env` and fill in your keys:

```bash
cp "${SKILL_DIR}/.env.example" ~/.env                 # macOS / Linux / Git Bash
copy "${SKILL_DIR}\.env.example" "%USERPROFILE%\.env"  # Windows cmd
```

Then set at least one API key in `~/.env` (zero-config, shared with other tools) — real environment variables still win over the file. Minimal example:

```dotenv
# ~/.env  (i.e. C:\Users\<you>\.env on Windows)
DASHSCOPE_API_KEY=sk-your-qwen-key
# ARK_API_KEY=...           # 字节跳动 / 豆包 (Volcengine Ark 方舟)
# OPENAI_API_KEY=...
# SILICONFLOW_API_KEY=sk-your-siliconflow-key
VISION_PROVIDER=qwen
```

`vision.py` auto-loads `~/.env` on every run (override the path with `VISION_ENV_FILE`). You do not need to edit `settings.json`.

## Optional: one-shot setup script

A cross-platform setup helper lives at `scripts/setup.sh` / `scripts/setup.ps1` (pick the one for the current OS). It does a dependency smoke test by default, and can optionally inject the **external frontend UI-check flow** into your global `~/.claude/CLAUDE.md` for sessions where the user explicitly invokes this skill.

```bash
# macOS / Linux / Git Bash
bash "${SKILL_DIR}/scripts/setup.sh" --merge-claude
```
```powershell
# Windows PowerShell 5.1+
powershell -NoProfile -ExecutionPolicy Bypass -File "${SKILL_DIR}/scripts/setup.ps1" -MergeClaude
```

What it does:

- **Default (no flags):** runs the dependency smoke test (`uv run vision.py --help`, auto-installs `openai` via the PEP 723 block). Warns if `uv` is not on the PATH. Does **not** touch `~/.claude/CLAUDE.md`.
- **`--merge-claude` / `-MergeClaude`:** also merges the UI-check flow into `~/.claude/CLAUDE.md` between idempotent markers (`<!-- === COMPOUND_VISION_START/END === -->`). Safe to re-run — it replaces the marked section, never duplicates. Existing CLAUDE.md content outside the markers is preserved.
- **`--uninstall` / `-Uninstall`:** removes only the marked section. Use when you stop wanting the global rule.
- **`--no-install` / `-NoInstall`:** skip the dependency check (useful when just managing the CLAUDE.md section).

The merged content comes from `scripts/claude-md-fragment.md` (single source — both OS scripts read it, so they cannot drift apart). Override the target home with `VISION_SETUP_HOME` for testing.

## Providers

### doubao (豆包 / 字节跳动 Volcengine Ark)
- API key: `ARK_API_KEY` (方舟平台标准密钥；旧的 `BD_API_KEY` / `DOUBAO_API_KEY` 仍可用作别名)
- Default model: `doubao-seed-2-1-pro-260628` (256K context, text + image + video, deep reasoning)
- Custom endpoint: `DOUBAO_BASE_URL`
- Also available: `doubao-seed-evolving` (持续迭代版, 每月更新), `doubao-seed-2-0-pro-260215` (2.0 Pro 旧版)
- Note: `doubao-seed-2-1-turbo-260628` 仅支持纯文本，不支持视觉

### qwen (通义千问 / DashScope)
- API key: `DASHSCOPE_API_KEY`
- Default model: `qwen-vl-max`
- Custom endpoint: `DASHSCOPE_BASE_URL`
- Available models: `qwen-vl-max`, `qwen-vl-plus`, `qvq-max`

### openai (GPT-4o)
- API key: `OPENAI_API_KEY`
- Default model: `gpt-4o`
- Custom endpoint: `OPENAI_BASE_URL`
- Also works with any OpenAI-compatible endpoint (Azure, local, etc.).

### siliconflow (硅基流动 / SiliconFlow)
- API key: `SILICONFLOW_API_KEY`
- Default model: `Qwen/Qwen2.5-VL-72B-Instruct`
- Custom endpoint: `SILICONFLOW_BASE_URL`
- OpenAI-compatible aggregator. Switch VL models via `SILICONFLOW_VISION_MODEL`, e.g. `Qwen/Qwen2-VL-72B-Instruct`, `deepseek-ai/deepseek-vl2`, `OpenGVLab/InternVL2-Llama3-76B`.

## Configuration

| Env var | Scope | Default |
|---------|-------|---------|
| `VISION_PROVIDER` | Default provider | auto-detect |
| `{PROVIDER}_VISION_MODEL` | Override model (per provider, highest priority) | — |
| `VISION_MODEL` | Override model (all providers, fallback) | provider default |
| `VISION_TEMPERATURE` | Response creativity 0–1 | `0` |
| `VISION_MAX_TOKENS` | Max response tokens | `4096` |
| `VISION_ENV_FILE` | Path to .env file | `~/.env` |

## Examples

```bash
# Auto-detect provider from API keys
uv run "${SKILL_DIR}/scripts/vision.py" "screenshot.png" "Describe the page layout and any visible UI issues."

# Explicit provider
uv run "${SKILL_DIR}/scripts/vision.py" --provider qwen "mockup.png" "List all components, colors, and spacing patterns."

# Custom model
QWEN_VISION_MODEL=qvq-max uv run "${SKILL_DIR}/scripts/vision.py" -p qwen "diagram.png" "Explain the architecture."

# GPT-4o for visual regression against a design spec
uv run "${SKILL_DIR}/scripts/vision.py" -p openai "after.png" "Compare with app design spec, flag differences."
```

## External frontend UI / layout checking flow

Run this flow only after the user explicitly invokes `/vision`. For ordinary frontend layout and UI tasks, use the current model's native vision capability instead.

When using the requested external provider, do not infer layout problems by reading code line by line. Drive the real rendered page and analyze screenshots with this skill:

1. Ensure the dev server is running; obtain the page URL.
2. Capture screenshots covering all content (use `browser-harness`, `agent-browser`, Playwright, or the platform's screenshot tool):
   - Open the page, wait for load, wait ~2s for animation/render.
   - Full-page screenshot.
   - Scroll to 2–3 different positions and capture again.
3. Analyze **each** screenshot with this skill:
   ```bash
   uv run "${SKILL_DIR}/scripts/vision.py" "shot.png" "Analyze layout problems: alignment, spacing, overflow, whitespace, truncation, empty regions, contrast, and responsiveness."
   ```
   Switch models with `--provider qwen` or `--provider openai` if the default underperforms.
4. On Windows, if output shows garbled characters, re-read with GBK: `open(path, 'rb').read().decode('gbk')` — or just rely on `vision.py`'s built-in UTF-8 stdout fix (already applied).
5. Aggregate every screenshot's findings into one complete, deduplicated issue list before reporting.
