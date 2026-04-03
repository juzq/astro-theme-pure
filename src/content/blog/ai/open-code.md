---
title: OpenCode安装与配置
publishDate: 2026-03-21
description: OpenCode 相较于最近比较火的 OpenClaw，更适合编程开发类任务，而相较于 Claude Code，更适合国内的网络环境以及更开放的大模型支持。
tags:
  - AI
---

## 安装

### Mac
`curl -fsSL https://opencode.ai/install | bash`

在终端中运行该命令即可
```
Installing opencode version: 1.2.27
■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■ 100%
Successfully added opencode to $PATH in /Users/juzi/.zshrc

                                 ▄     
█▀▀█ █▀▀█ █▀▀█ █▀▀▄ █▀▀▀ █▀▀█ █▀▀█ █▀▀█
█░░█ █░░█ █▀▀▀ █░░█ █░░░ █░░█ █░░█ █▀▀▀
▀▀▀▀ █▀▀▀ ▀▀▀▀ ▀  ▀ ▀▀▀▀ ▀▀▀▀ ▀▀▀▀ ▀▀▀▀


OpenCode includes free models, to start:

cd <project>  # Open directory
opencode      # Run command

For more information visit https://opencode.ai/docs
```
安装完成后会看到已经将 opencode 加入了环境变量，可直接运行（开新的终端）。
### Windows
1. 安装 [Node.js](https://nodejs.org/en/download)，会附带安装 npm。
2. 使用命令`npm install -g opencode-ai`。

注意：如果是在powershell中运行npm，则需要使用`npm.cmd`，因为Powershell默认的执行策略是Restricted，禁止执行脚本文件，可使用如下命令修改。
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```
## 运行

直接在命令行中输入`opencode`即可运行。

可以直接问他：你是什么模型？

他会回答
```
我是由 big-pickle 模型驱动的（模型 ID: opencode/big-pickle）。
```

## 常用命令

- 切换模型：/models
- 新建会话：/new
- 初始化项目：/init

## 与 Claude Code 对比

| | OpenCode | Claude Code |
|---|---|---|
| 网络 | 国内可直接访问 | 可能需要代理 |
| 模型 | 支持多种模型，内置免费模型 | 以 Claude 系列为主 |
| 定位 | 编程开发任务 | 全能型 AI 助手 |
| 配置 | 配置文件，简洁轻量 | 丰富的 settings.json 选项 |
| MCP | 支持 | 支持 |
| 价格 | 有免费模型可用 | 按用量付费 |

### OpenCode 独特优势

**国内友好**
- 无需代理即可直接访问
- 内置免费模型，开箱即用
- 对国内大模型的支持更好（如通义千问、DeepSeek 等）

**轻量简洁**
- 配置简单，学习成本低
- 命令行交互流畅
- 适合快速编程任务

**模型开放**
- 支持多种模型提供商
- 可以自由切换不同的模型
- 便于对比不同模型的效果

### 适用场景

- 网络受限环境（国内直连）
- 需要对比多种模型效果
- 快速简单的编程任务
- 不想配置复杂环境的场景

如果需要更强大的功能（如 hooks、MCP 高级用法、全面深入的代码分析），推荐使用 Claude Code。