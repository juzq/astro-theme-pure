---
title: Claude Code 安装与配置
publishDate: 2026-03-25
description: Claude Code 是 Anthropic 官方推出的终端AI编程助手，直接集成在命令行环境中。比网页版更深入代码本身，能真正帮你完成开发任务，而非仅仅回答问题。适合日常开发中的代码生成、调试、重构等场景。
tags:
  - AI
  - Claude
---

### 安装

#### Node方式安装

前置条件：安装 [Node.js](https://nodejs.org/en/download)

```
npm install -g @anthropic-ai/claude-code
```

注意：Windows下安装后npm是以npm.cmd的形式存在的，Powershell中无法直接运行，在CMD中运行即可。

验证安装

```
claude --version
```

### 配置模型

#### 官方模型

必须要梯子，首次运行claude时会提示登录，也可以使用`/login`命令来登录。

#### 第三方模型

创建文件：`~/.claude/settings.json`，内容为：

```
{
  "env": {
    "ANTHROPIC_AUTH_TOKEN": "<api_key>",
    "ANTHROPIC_BASE_URL": "<url>",
    "ANTHROPIC_MODEL": "<model>"
  }
}
```

- 将`<api_key>`替换为实际的api key，从模型提供商那里获取。
- 将`<url>`替换为实际的api地址，从模型提供商那里获取。
- 将`<model>`替换为实际的模型名字，例如MiniMax M2.7。

创建文件：`~/.claude.json`，内容为：

```
{
  "hasCompletedOnboarding": true
}
```

注意：如果不设置该属性，启动claude就会提示你登录，无法使用第三方模型。

### 基本使用

#### 常用配置

`~/.claude/settings.json`

##### 关闭自动更新

```
"DISABLE_AUTOUPDATER": "1"
```

#### 启动对话

```
claude                                # 启动默认对话
claude <prompt>                       # 直接执行命令
claude --model <model>                # 指定模型名字
claude --r <session>                  # 恢复之前的会话，不填会话名会打开菜单供选择
claude --dangerously-skip-permissions # 跳过危险权限确认
```

#### 核心命令

```
/help      # 显示帮助信息
/compact   # 压缩当前会话上下文
/clear     # 清空上下文
/rewind    # 恢复代码和对话到上一个检查点
/model     # 切换模型
/exit      # 退出会话
```

#### 指定文件

```
@文件名 要做的操作
```

可以直接告诉 AI 要操作哪个文件，更加高效。

