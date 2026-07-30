## 外部前端 UI 视觉检查流程（vision skill）

默认使用当前模型的原生视觉能力分析截图。只有用户明确调用 `/vision`、要求使用已配置的外部视觉模型时，才执行以下流程：

1. 确保 dev server 已启动，获取页面 URL。
2. 截图覆盖全部内容（用 browser-harness / agent-browser / Playwright 或平台截图工具）：打开页面 → 等待加载 → 等约 2s 渲染 → 全页截图 → 滚动到 2-3 个不同位置各再截一张。
3. 每张截图用用户指定的外部 `vision` provider 分析：
   ```bash
   uv run "${CLAUDE_SKILL_DIR}/scripts/vision.py" "shot.png" "分析布局问题：对齐、间距、溢出、留白、截断、空白区域、对比度、响应式"
   ```
   可用 `--provider doubao|qwen|openai` 切换模型；未指定时按 `VISION_PROVIDER` / `~/.env` 中先出现的 key 自动选。
4. 汇总所有截图的分析结果，列出完整、去重的问题清单后再报告。

key 与 provider 配置见 `~/.env`（`ARK_API_KEY` / `DASHSCOPE_API_KEY` / `OPENAI_API_KEY` / `SILICONFLOW_API_KEY` 等，旧名 `BD_API_KEY` / `DOUBAO_API_KEY` 亦可），`vision.py` 每次运行自动加载。
