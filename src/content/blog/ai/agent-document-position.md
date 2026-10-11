---
title: Agent工具文档位置说明
publishDate: 2026-10-11
description: 常用的Agent工具都有其默认的用户配置目录，其中往往包含指令文档和配置文件。
tags:
  - AI
---

### Claude Code

#### 全局用户配置 

位置：`~/.claude/`

所有项目共享的配置。

- 指令文档：`~/.claude/CLAUDE.md` 用于定义在所有项目中生效的通用规则。
- 设置文件：`~/.claude/settings.json` 用于存储认证信息、模型配置、偏好设置和插件等。

#### 项目级配置

位于项目根目录下

- 指令文档：`CLAUDE.md` 专门用于当前项目的指令，通常会被提交到代码仓库中供团队共享。
- **追加**指令文档：`CLAUDE.local.md` 用于个人规则的指令文档，会追加在CLAUDE.md之后，常常会被加入`.gitignore`不提交到仓库。
- 设置设置：`.claude/settings.local.json` 用于存放仅限本地、不适合提交的个人配置。

### Codex

#### 全局用户配置

位置：`~/.codex/` 或 环境变量`CODEX_HOME`指向的目录，环境变量优先。

- 指令文档：`~/.codex/AGENTS.md` 应用于你机器上的每一个项目。
- **覆盖**指令文档：`~/.codex/AGENTS.override.md` 用于临时覆盖掉AGENTS.md文档中的内容，使AGENTS.md不再生效。
- 设置文件：`~/.codex/config.toml` 存储所有项目的默认设置。

#### 项目级配置

位于项目根目录下

- 指令文档：`AGENTS.md`，专门用于当前项目的指令，用于定义针对该项目的特定行为指令。
- **覆盖**指令文档`AGENTS.override.md` 用于临时覆盖掉AGENTS.md文档中的内容，使AGENTS.md不再生效。
- 设置文件：.codex/config.toml，用于覆盖全局配置，仅在项目被标记为“受信任”时加载。

#### 特别注意

- AGENTS.override.md会覆盖掉同目录下的AGENTS.md，使其不再加载。
- 全局指令文档会和项目指令文档组合在一起生效。
