# OpenClaw InVideo 风格 Agent WebUI 设计方案

目标：把 OpenClaw 的 WebUI 改造成类似 InVideo Copilot 的 Agent 工作台：左侧资源导航，中间对话与任务执行，右侧项目成员、任务状态和上下文。

## 总体结构

```txt
OpenClaw Copilot Workspace
├─ 左侧栏：导航、Agent、模板、工具、设置
├─ 中间区：Agent 对话、任务工作区、文件结果预览
└─ 右侧栏：项目成员、任务状态、上下文、快捷操作
```

## 左侧栏

包含：新建任务、工作台、对话、任务、项目、模板、知识库、工具集、设置、我的 Agents 列表。

左侧栏负责资源入口和全局导航，不放复杂表单，保持窄栏、深色、卡片化。

## 中间对话和任务工作区

顶部显示当前 Agent、任务标题、自动/手动模式、运行状态。

消息区支持用户消息、Agent 消息、工具消息、系统消息。Agent 执行任务时用折叠式任务步骤卡展示进度，例如：需求分析、搜索参考素材、生成方案、执行工具、输出结果。

输入框支持：普通消息、@Agent、@文件、快捷命令、附件上传。

## 右侧栏

右侧栏展示当前项目成员、任务状态、上下文文件、快捷操作。

项目成员包括用户和参与任务的 Agent。任务状态展示当前任务总进度和每一步状态。上下文区展示当前对话引用的文件、图片、视频、文档、链接、工具结果。

## 后台功能映射

需要实现这些接口：

```txt
GET  /api/openclaw/config
PATCH /api/openclaw/config
GET  /api/openclaw/prompts
PUT  /api/openclaw/prompts
POST /api/openclaw/system-event
GET  /api/openclaw/agents
POST /api/openclaw/tasks
GET  /api/openclaw/tasks/:id
POST /api/openclaw/tasks/:id/messages
```

## 模型和 API 配置

设置页提供 Provider、Base URL、密钥、主模型、备用模型配置。

保存规则：密钥由后端保存到本地环境文件，配置文件只保存变量引用；模型和 Provider 写入 OpenClaw 配置，并通过配置更新接口热应用。

## 提示词配置

设置页提供三个编辑器：身份与语气、Agent 行为规则、用户偏好。后端把内容保存为 OpenClaw 工作区内的提示词文档。

## 视觉风格

深色背景，三栏分区，紫蓝主按钮，圆角卡片，任务进度条，Agent 彩色头像，右侧轻量状态面板。

## MVP 范围

第一版实现三栏布局、Agent 列表、对话窗口、任务步骤状态、右侧上下文、设置页中的 API/模型/提示词。

第二版再实现多 Agent 协作、任务模板市场、文件拖拽上下文、工具调用可视化、任务回放 Replay。
