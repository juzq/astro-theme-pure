---
title: Skill介绍
publishDate: 2026-04-08
description: skill是目前大多AI工具都支持的功能，可以扩展AI的能力。
tags:
  - AI
  - Skills
---

## 什么是 Skill

Skill（技能）是 Claude Code 的扩展能力模块，每个 skill 都是一个独立的功能单元，包含：

- **触发条件**：定义何时可以使用该 skill
- **工作流程**：预定义的处理步骤和检查清单
- **工具指引**：skill 相关的操作指导

Skill 分为以下几种来源：

- **内置 skill**：Claude Code 自带的功能（如 `/help`、`/clear`）
- **插件 skill**：通过插件安装的第三方扩展
- **自定义 skill**：通过拷贝skill文件夹到指定目录

## 使用 Skill

### 调用方式

在 Claude Code 中，使用斜杠命令调用 skill：

```
/<skill_name> [参数]
```

例如：

- `/xlsx @野外补兵细案.xlsx 总结下这个文件内容`
- `/pdf document.pdf 提取第三章内容`
- `/pptx 创建一个关于AI的演示文稿`

### Skill 查找

不确定有哪些 skill 可用？输入 `/` 可以看到所有可用 skill 的列表。

## 插件

Claude 可以通过安装插件来使用更多 skill。

### 1. 添加 marketplace

```
/plugin marketplace add obra/superpowers-marketplace
```

### 2. 安装插件

**方式一：命令安装**

```
/plugin install superpowers@superpowers-marketplace
```

**方式二：浏览安装**

1. 使用 `/plugin` 进入插件管理
2. 选择 `Discover` 进行搜索，或选择 `Marketplaces` 根据市场筛选
3. 选择市场后，再选择 `Browse plugins`
4. 按空格勾选插件，再按 `i` 键安装

### 3. 重载插件

安装后使用命令 `/reload-plugins` 重载，或重新打开 Claude 即可使用插件。

> 注意：要使用插件中的 skill，**必须退出 Claude 并重新进入**。

> Claude 自带了官方的 marketplace：`claude-plugins-official`，无需再添加，可以直接安装其中的插件。

## 自定义 Skill 配置

也可以将 skill 放入指定路径使用，适用于自定义插件。

### 项目级配置

| 工具 | 路径 |
|------|------|
| Claude 专用 | `.claude/skills/<name>/SKILL.md` |
| 大部分 AI 工具通用 | `.agents/skills/<name>/SKILL.md` |
| Opencode 专用 | `.opencode/skills/<name>/SKILL.md` |

### 全局配置

| 工具 | 路径 |
|------|------|
| Claude 专用 | `~/.config/opencode/skills/<name>/SKILL.md` |
| 大部分 AI 工具通用 | `~/.claude/skills/<name>/SKILL.md` |
| Opencode 专用 | `~/.agents/skills/<name>/SKILL.md` |

注意：`<name>` 必须和 `SKILL.md` 中的 `name` **完全一致**。

## 常用 Skills 推荐

以下是一些常用的高价值 skill：

| Skill | 用途 |
|-------|------|
| `/pdf` | 读取、编辑、合并 PDF 文件 |
| `/xlsx` | 读取和编辑 Excel 电子表格 |
| `/pptx` | 创建和编辑 PowerPoint 演示文稿 |
| `/docx` | 创建和编辑 Word 文档 |
| `/web-artifacts` | 生成精美的 HTML 页面和组件 |
| `/canvas-design` | 创建海报、艺术图形和 PDF 文档 |
| `/slack-gif-creator` | 制作 Slack 优化的动画 GIF |
