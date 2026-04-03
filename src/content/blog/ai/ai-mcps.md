---
title: MCP (Model Context Protocol) 使用指南
publishDate: 2026-03-28
description: 介绍 MCP 的工作原理、配置方法及使用注意事项
tags: [AI, MCP, Claude]
---

### MCP 介绍

MCP（Model Context Protocol）是 Anthropic 推出的开放协议，用于连接 AI 模型与外部数据源和工具。AI 可以通过连接远端 MCP 服务器来调用接口，从而增强 AI 的行为能力，实现 AI 本身无法实现的功能。

#### 工作原理

MCP 采用客户端/服务器架构：

- **MCP Host**（如 Claude Code）：发起请求的 AI 应用
- **MCP Client**：运行在 Host 内的客户端，与 Server 保持 1:1 连接
- **MCP Server**：独立的本地进程，通过 stdio 与 Client 通信，提供资源或工具

#### 核心概念

- **Resources**：MCP Server 暴露的数据资源，AI 可以读取（如文件、API 响应）
- **Tools**：MCP Server 提供的可调用函数，AI 可以执行（如搜索、转换）
- **Prompts**：预定义的提示模板，可快速复用复杂提示

#### 与 Function Calling 的区别

| | MCP | Function Calling |
|---|---|---|
| 协议 | 开放标准 | 厂商特定 |
| 范围 | 跨平台、跨厂商 | 仅限同一 AI 厂商 |
| 部署 | 本地 MCP Server | 云端函数 |
| 扩展性 | 可连接任何支持 MCP 的数据源 | 受限于厂商提供的函数库 |

#### 配置方法

MCP 配置文件使用 JSON 格式：

- **全局 MCP**：`~/.claude/mcp.json` - 所有项目共享
- **项目 MCP**：`.mcp.json` - 仅当前项目生效

配置结构示例：

```json
{
  "mcpServers": {
    "server-name": {
      "command": "uvx",
      "args": ["mcp-server-package"],
      "env": {
        "API_KEY": "sk-xxxx"
      }
    }
  }
}
```

### 使用注意事项

#### 安全

- **API Key 管理**：敏感信息使用环境变量，不要硬编码在配置文件中
- **代码库安全**：项目级 `.mcp.json` 可能会提交到 Git，建议将其加入 `.gitignore`
- **权限控制**：MCP Server 可能拥有数据访问权限，只启用必要的服务

#### 调试

- **检查状态**：运行 `claude mcp list` 查看已配置的 MCP 服务
- **查看日志**：检查 MCP Server 的输出日志排查连接问题
- **逐步排查**：如果 MCP 不工作，先确认配置文件格式正确，再检查 Server 是否正常运行

#### 隔离

- **项目级配置**：`.mcp.json` 仅在所在项目目录及子目录生效
- **全局配置**：`~/.claude/mcp.json` 对所有项目生效
- **优先级**：项目级配置与全局配置会合并，项目级配置优先

#### 兼容性

- **版本要求**：确保 Claude Code 版本支持所用 MCP Server 所需的协议版本
- **依赖检查**：部分 MCP Server 依赖 Node.js、Python 等运行时，需提前安装
- **系统要求**：注意 Server 是否仅支持特定操作系统（如 Linux/macOS）

### MCP 推荐

#### wanyi-watermark

媒体资源提取，抖音/小红书提取无水印视频/图片，视频逐字稿（视频声音转文本）。

1. 安装 uv: `curl -LsSf https://astral.sh/uv/install.sh | sh`
2. 从[阿里云百炼](https://bailian.console.aliyun.com/?spm=a2c4g.11186623.0.0.3eb13ba2yFW3MW&tab=model#/api-key)获取 API Key（*无需*充值付费）。
3. 配置 MCP Server：

```json
{
  "mcpServers": {
    "wanyi-watermark": {
      "command": "uvx",
      "args": ["wanyi-watermark"],
      "env": {
        "DASHSCOPE_API_KEY": "sk-xxxx"
      }
    }
  }
}
```

4. 把 `sk-xxxx` 替换成阿里百炼获取到的 API Key。
