---
title: OpenCode安装与配置
publishDate: 2026-03-21
description: OpenCode 相较于最近比较火的 OpenClaw，更适合编程开发类任务，而相较于 Claude Code，更适合国内的网络环境以及更开放的大模型支持。
tags:
  - opencode
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
1. 安装 Node.js，会附带安装 npm。
2. 使用命令`npm install -g opencode-ai`。

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