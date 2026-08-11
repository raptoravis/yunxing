## What it does

`vision` sends an image and prompt to a configured external vision provider: Doubao, Qwen, OpenAI, SiliconFlow, or another OpenAI-compatible endpoint.

It is an explicit external-model escape hatch, not the default path for understanding images. The agent uses its native vision capability unless you deliberately invoke this skill.

## When to reach for it

You invoke this by typing `/vision` — the agent won't reach for it on its own.

Reach for it when you specifically want an external provider or endpoint: to compare another model's interpretation, use provider-specific capabilities, or give a text-only harness access to a vision model. For ordinary screenshots, UI layouts, diagrams, charts, and mockups in a multimodal harness, use the model's native vision instead.

## Prerequisites

Install `uv`, then configure at least one supported provider API key in `~/.env`. The skill accepts `ARK_API_KEY`, `DASHSCOPE_API_KEY`, `OPENAI_API_KEY`, and `SILICONFLOW_API_KEY`, with optional provider and model overrides.

## External means deliberate

Invoking the skill makes a network request to the configured provider and may incur provider cost. Its leading idea is **external**: choosing `/vision` is choosing a separate model endpoint rather than asking the current model to inspect the image directly.

The provider resolves from an explicit command flag, `VISION_PROVIDER`, or the first supported API key found in `~/.env`.

## Common questions

**Should I use this for every screenshot or diagram?**

No. Use the current model's native vision whenever it can inspect the image. This skill exists for a deliberate external-provider choice or a text-only harness.

**Can invoking it send image data outside the current provider?**

Yes. `/vision` makes a network request to the configured external endpoint, so choose it only when that transfer and any provider cost are acceptable.

## It's working if

- Ordinary image tasks use the current model's native vision without loading or running this skill.
- `/vision` sends the image only to the configured external provider.
- No dependency installation or provider request happens merely because a prompt contains a screenshot.

## Where it fits

`vision` is a reach-for-it-anytime standalone for deliberate external image analysis. Pair it with [diagnosing-bugs](https://aihero.dev/skills-diagnosing-bugs) when an external visual interpretation provides evidence for a bug, or [prototype](https://aihero.dev/skills-prototype) when you want an external model to compare UI variations. See [ask-matt](https://aihero.dev/skills-ask-matt) for the complete skill map.
