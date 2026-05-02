# OpenClaw WebUI Redesign Workspace

这个仓库用于承载 OpenClaw 的 InVideo 风格 WebUI 改造方案：三栏布局、Agent 任务模式、配置 API、提示词编辑、任务状态与上下文面板。

## 当前内容

- `docs/openclaw-invideo-agent-webui-design.md`：完整产品设计与功能映射
- `design/openclaw-invideo-layout.svg`：可直接预览的界面设计图
- `implementation/openclaw-webui-scaffold.md`：落地实现说明
- `src/server/openclaw-settings-api.ts`：后端 API 草案，负责配置 OpenClaw API、模型、提示词
- `src/webui/OpenClawCopilotLayout.tsx`：前端三栏布局组件草案
- `src/webui/openclaw-copilot.css`：暗色界面样式
- `.github/workflows/import-openclaw.yml`：手动导入 openclaw/openclaw 到 `upstream-openclaw/` 目录的工作流

## 如何导入 OpenClaw 源码

进入 GitHub 仓库页面：

`Actions` → `Import OpenClaw upstream` → `Run workflow`

执行后会把官方 `openclaw/openclaw` 克隆到：

```txt
upstream-openclaw/
```

这样可以保留本仓库的设计文档和实现草案，同时拥有一份可修改的 OpenClaw 源码副本。

## 下一步

导入成功后，把 `src/webui` 和 `src/server` 的设计迁移到 `upstream-openclaw` 的实际前端/后端目录里，再提交 PR 或直接在你的仓库继续开发。
