---
title: Claude Code 安装与配置
publishDate: 2026-03-25
description: Claude Code 是 Anthropic 官方推出的终端AI编程助手，直接集成在命令行环境中。比网页版更深入代码本身，能真正帮你完成开发任务，而非仅仅回答问题。适合日常开发中的代码生成、调试、重构等场景。
tags:
  - AI
---

### 安装

前置条件：安装 [Node.js](https://nodejs.org/en/download)

```
npm install -g @anthropic-ai/claude-code
```

注意：如无国外网络，macOS或Linux不能使用`curl -fsSL https://claude.ai/install.sh | bash`来安装。

验证安装
```
claude --version
```

### 配置模型
如使用官方模型（需要梯子），首次运行claude时会提示登录，也可以使用`/login`命令来登录

#### 接入第三方模型

创建文件：`~/.claude/settings.json`，内容为：
```
{
  "env": {
    "ANTHROPIC_AUTH_TOKEN": "<api_key>",
    "ANTHROPIC_BASE_URL": "<url>",
    "API_TIMEOUT_MS": "3000000",
    "CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC": 1
  }
}
```
- 将`<api_key>`替换为实际的api key
- 将`<url>`替换为实际的api地址

创建文件：`~/.claude.json`，内容为：
```
{
  "hasCompletedOnboarding": true
}
```

##### 智谱
[智谱AI开放平台](https://bigmodel.cn/)

修改`~/.claude/settings.json`，设置模型：
```
{
  "env": {
    "ANTHROPIC_DEFAULT_HAIKU_MODEL": "GLM-4.7",
    "ANTHROPIC_DEFAULT_SONNET_MODEL": "GLM-4.7",
    "ANTHROPIC_DEFAULT_OPUS_MODEL": "GLM-4.5-Air"
  }
}
```

如果不修改，以上模型就是默认值。