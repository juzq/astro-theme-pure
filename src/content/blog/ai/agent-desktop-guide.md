---
title: Agent工具使用指南
publishDate: 2026-10-16
description: Claude、ChatGPT（Codex）和 OpenCode 的下载、安装、模型配置、配置文件位置与指令文件加载规则。
tags:
  - AI
  - Agent
---

### Claude

这里区分两个入口：**Claude Desktop** 是桌面应用，代码 Agent 位于其中的 Code 页面；**Claude Code CLI** 是终端里的 `claude` 命令。Code 的项目指令和部分设置可以共用，但桌面端的模型认证、第三方推理设置有独立入口。

#### 下载与安装

**注意**：需要科学上网

##### 桌面端

从 [Claude Code 桌面端官方说明](https://code.claude.com/docs/en/desktop) 中的下载入口选择对应系统，安装后登录，进入 Code 页面并选择项目文件夹。

使用桌面端不需要安装 CLI。

##### Windows PowerShell 安装 CLI

```powershell
irm https://claude.ai/install.ps1 | iex
```

也可以使用 WinGet，二选一即可：

```powershell
winget install Anthropic.ClaudeCode
```

##### macOS / Linux / WSL 安装 CLI

```bash
curl -fsSL https://claude.ai/install.sh | bash
```

安装结束后重新打开终端，检查并启动：

```text
claude --version
claude doctor
```

先进入项目目录，再运行 `claude`。Windows 推荐安装 Git for Windows，以便使用 Git Bash 相关工具。原生安装支持后台更新；WinGet 安装可使用 `winget upgrade Anthropic.ClaudeCode` 更新。[官方安装说明](https://code.claude.com/docs/en/setup)

#### 官方模型配置

##### 使用 Claude 账号

桌面端通过应用登录，使用 Code 页面的模型选择器选择可用 Claude 模型。

CLI 首次运行 `claude` 时按提示完成浏览器登录；已进入会话时可使用 `/login`。登录后通过 `/model` 选择模型，通过 `/status` 确认当前认证方式。账号是否能使用 Code 及具体模型，以套餐和组织权限为准。[认证说明](https://code.claude.com/docs/en/authentication)

##### 使用 Anthropic 官方 API Key（CLI）

从 Claude Console 获取 API Key，在启动 CLI 的终端中设置：

```powershell
# Windows PowerShell，仅当前终端及其启动的程序生效
$env:ANTHROPIC_API_KEY = "<ANTHROPIC_API_KEY>"
claude
```

```bash
# macOS / Linux / WSL
export ANTHROPIC_API_KEY="<ANTHROPIC_API_KEY>"
claude
```

使用官方接口时，不需要配置第三方 `ANTHROPIC_BASE_URL`。交互模式可能要求确认是否采用该 Key。API Key 计费与 Claude 订阅额度属于不同认证路径，可用 `/status` 检查实际采用的凭据。[API Key 认证规则](https://code.claude.com/docs/en/authentication)

#### 第三方模型与网关配置

需要区分两种情况：通过 Bedrock、Vertex 等第三方平台调用 **Claude 模型**，以及通过兼容接口调用 **MiniMax 等非 Claude 模型**。前者按 Anthropic 对应平台的部署说明配置；后者依赖模型厂商的适配，Anthropic 官方不提供对非 Claude 模型的支持。[网关支持范围](https://code.claude.com/docs/en/llm-gateway)

##### Claude Code CLI

提供商必须提供适用于 Claude Code 的 Anthropic 兼容接口。只有 OpenAI Chat Completions 接口的地址，不能直接作为这里的接入地址。

编辑用户级文件 `~/.claude/settings.json`，Windows 对应 `%USERPROFILE%\.claude\settings.json`：

```json
{
  "env": {
    "ANTHROPIC_BASE_URL": "https://gateway.example.com/anthropic",
    "ANTHROPIC_AUTH_TOKEN": "<PROVIDER_API_KEY>",
    "ANTHROPIC_MODEL": "<MODEL_ID>",
    "ANTHROPIC_DEFAULT_SONNET_MODEL": "<MODEL_ID>",
    "ANTHROPIC_DEFAULT_OPUS_MODEL": "<MODEL_ID>",
    "ANTHROPIC_DEFAULT_HAIKU_MODEL": "<MODEL_ID>"
  }
}
```

- `ANTHROPIC_BASE_URL`：提供商给出的 Claude Code 接入基地址，不要自行添加 `/v1/messages`。
- `ANTHROPIC_AUTH_TOKEN`：用于发送 `Authorization: Bearer`；如果提供商要求 `x-api-key`，应按其文档改用 `ANTHROPIC_API_KEY`。
- `ANTHROPIC_MODEL`：默认模型 ID；三个 `ANTHROPIC_DEFAULT_*_MODEL` 用于映射模型档位，避免切换档位时请求提供商没有的 Claude 模型。不同档位也可以指向不同模型。

例如 MiniMax 的接入地址是 `https://api.minimax.io/anthropic`，具体模型 ID、Key 类型和附加设置请查阅 [MiniMax 的 Claude Code 接入说明](https://platform.minimax.io/docs/m-plan/claude-code)。上面的 `<MODEL_ID>` 必须替换后才能使用。

保存后重启 CLI，发送一条简单消息，再执行 `/status` 和 `/model`，检查服务地址、凭据来源和模型。首次配置优先放在用户级文件或启动终端的环境变量中：项目设置可能在首次引导和信任确认之后才加载。无需将手改 `~/.claude.json` 中的内部引导状态作为常规步骤。[网关认证及排查](https://code.claude.com/docs/en/llm-gateway-connect)

##### Claude Desktop

桌面端的第三方推理**不使用上述 `ANTHROPIC_BASE_URL` 或 `settings.json` 来配置路由**：

1. 菜单栏 `Help → Troubleshooting → Enable Developer Mode`，按提示重启应用。
2. 左下角账号 `Inference Configuration`。
3. 按网关文档填入网关地址与认证信息；没有模型自动发现接口时，还需配置模型列表。
4. 保存后新建 Code 会话，检查模型列表并测试请求。

组织下发的配置优先于本地表单，可能使表单只读。官方桌面网关文档面向 Claude 模型；不要仅凭 CLI 中某个非 Claude 模型可用，就推断桌面端也受支持。[桌面端网关入口](https://code.claude.com/docs/en/llm-gateway-connect#desktop-app)、[桌面第三方推理说明](https://claude.com/docs/third-party/claude-desktop/gateway)

##### 切回官方模型

CLI 中移除自己添加的第三方地址、凭据和模型映射；同时检查终端启动配置及项目本地设置是否仍有这些值。使用订阅时还应清除自定义 API Key，再运行 `/login` 和 `/model`。桌面端则在第三方推理入口取消本地网关配置；组织托管的配置由管理员调整。

#### 配置文件位置与优先级

| 文件 | 用途 | 是否适合提交 |
| --- | --- | --- |
| `~/.claude/settings.json` | 所有项目共用的用户设置 | 不属于项目仓库 |
| `<项目>/.claude/settings.json` | 团队共享设置，例如权限、Hooks、插件 | 可以，不放密钥 |
| `<项目>/.claude/settings.local.json` | 当前项目的个人设置 | 不提交；手动创建时添加忽略规则 |
| `~/.claude.json` | 工具维护的状态、信任记录和部分 MCP 配置 | 不提交，通常无需手改 |
| `~/.claude/.credentials.json` | Windows / Linux 上由工具维护的登录凭据 | 不提交；macOS 通常使用钥匙串 |

普通设置通常按“用户设置 → 项目共享设置 → 项目本地设置 → 命令行参数”由低到高覆盖；组织托管设置优先，并有个别字段的特殊合并规则。这是**设置优先级**，不等于 Markdown 指令的加载方式。设置 `CLAUDE_CONFIG_DIR` 可调整用户配置目录。[设置文件规则](https://code.claude.com/docs/en/settings)、[凭据存储规则](https://code.claude.com/docs/en/authentication)

#### 指令文件位置及加载规则

| 位置 | 作用 |
| --- | --- |
| `~/.claude/CLAUDE.md` | 全局个人指令 |
| `<项目>/CLAUDE.md` 或 `<项目>/.claude/CLAUDE.md` | 项目共享指令，选一种位置维护 |
| `<项目>/CLAUDE.local.md` | 项目个人补充指令，加入 `.gitignore` |
| `<子目录>/CLAUDE.md` | 特定目录的补充规范 |
| `<项目>/.claude/rules/*.md`、`~/.claude/rules/*.md` | 拆分的项目规则和个人规则 |

加载时需要注意：

- 启动时读取工作目录及其上级的相关指令；下级目录的指令在读取、修改其中的文件时按需加载。
- 发现的 `CLAUDE.md` 内容会**叠加**；同目录的 `CLAUDE.local.md` 追加在其后，不会使 `CLAUDE.md` 消失。
- 指令可以使用 `@相对路径` 导入其他文件；按路径生效的 `.claude/rules/` 规则可用 YAML `paths` 声明适用文件。
- `/init` 可初始化项目指令；`/memory` 查看和编辑指令位置，`/context` 可检查启动时加载的文件。
- 较新版本支持在没有项目 `CLAUDE.md` / `CLAUDE.local.md` 时回退读取 `AGENTS.md`，具体受版本和 Project instructions 设置影响。跨工具共享时，可在 `CLAUDE.md` 中写 `@AGENTS.md`，显式导入公共规则。

这些是提供给模型的上下文，不是强制权限边界；要限制命令执行或文件访问，应使用权限设置。[指令文件官方说明](https://code.claude.com/docs/en/memory)

### ChatGPT（Codex）

本节介绍本地 Codex Agent：桌面端使用 ChatGPT 应用中的 Codex 入口，命令行使用 `codex`。下面的 `config.toml` 和 `AGENTS.md` 规则用于 Codex 本地工作，不应套用到普通聊天的自定义指令上。[桌面端说明](https://learn.chatgpt.com/docs/app)

#### 下载与安装

**注意**：需要科学上网

##### 桌面端

从 [ChatGPT 桌面端官方页面](https://learn.chatgpt.com/docs/app) 进入对应系统的安装说明，安装后登录，选择 Codex，再打开本地项目并新建会话。

##### CLI

已安装 Node.js / npm 时，可在 Windows、macOS 或 Linux 上运行：

```text
npm install -g @openai/codex
codex --version
```

macOS / Linux 也可使用官方独立安装脚本，无需先安装 npm：

```bash
curl -fsSL https://chatgpt.com/codex/install.sh | sh
```

安装后在项目目录运行 `codex`。npm 安装可用 `npm install -g @openai/codex@latest` 更新。[CLI 官方说明](https://learn.chatgpt.com/docs/cli)、[官方版本与 npm 包信息](https://learn.chatgpt.com/docs/changelog)

#### 官方模型配置

##### 使用 ChatGPT 账号

桌面端按应用提示登录；CLI 执行：

```text
codex login
codex
```

通过浏览器完成认证后，使用会话内的 `/model` 选择当前账号可用的官方模型，使用 `/status` 查看会话配置。可选模型受账号、工作区与客户端版本影响。[官方认证方式](https://learn.chatgpt.com/docs/auth)

##### 使用 OpenAI 官方 API Key

在 [OpenAI Platform](https://platform.openai.com/) 创建 API Key，然后执行：

```powershell
# Windows PowerShell
$env:OPENAI_API_KEY = "<OPENAI_API_KEY>"
$env:OPENAI_API_KEY | codex login --with-api-key
codex
```

```bash
# macOS / Linux / WSL
export OPENAI_API_KEY="<OPENAI_API_KEY>"
printenv OPENAI_API_KEY | codex login --with-api-key
codex
```

API 方式按 OpenAI Platform 账户计费，不使用 ChatGPT 套餐内的 Codex 额度。桌面端也可在未登录页面选择其他登录方式并输入 API Key。[API Key 登录说明](https://learn.chatgpt.com/docs/auth)

如需固定模型，编辑 `~/.codex/config.toml`：

```toml
model_provider = "openai"
model = "gpt-6.1-sol"
```

此处模型名称是核对时的示例，应改成自己的账号可用模型。使用默认选择时可以省略 `model`；直接连接官方服务无需添加自定义 provider。[模型设置](https://learn.chatgpt.com/docs/config-file/config-basic)

#### 第三方模型与网关配置

Codex 通过自定义 provider 指定服务地址和认证方式。第三方服务即使标注“OpenAI 兼容”，也需要确认其支持 Codex 所需的协议、流式响应与工具调用。

编辑**用户级** `~/.codex/config.toml`，Windows 对应 `%USERPROFILE%\.codex\config.toml`：

```toml
# 顶层配置必须放在第一个 [表名] 之前
model_provider = "thirdparty"
model = "<MODEL_ID>"
web_search = "disabled"

[model_providers.thirdparty]
name = "Third-party Gateway"
base_url = "https://gateway.example.com/v1"
wire_api = "responses"
env_key = "CODEX_THIRDPARTY_API_KEY"
requires_openai_auth = false
```

再把提供商的 Key 放入启动进程能读取的环境变量：

```powershell
# Windows PowerShell
$env:CODEX_THIRDPARTY_API_KEY = "<PROVIDER_API_KEY>"
codex
```

```bash
# macOS / Linux / WSL
export CODEX_THIRDPARTY_API_KEY="<PROVIDER_API_KEY>"
codex
```

字段说明：

| 字段 | 含义 |
| --- | --- |
| `model_provider` | 对应下方 `model_providers` 表的 ID，两处必须一致 |
| `model` | 网关实际接受的模型 ID 或别名 |
| `base_url` | 包含 API 前缀的基地址，例如 `/v1`；不填完整 `/responses` 请求路径 |
| `wire_api = "responses"` | 本例使用 Responses API，不能把仅支持 `/chat/completions` 的服务当成相同接口 |
| `env_key` | 保存密钥的**环境变量名称**，不是密钥本身 |
| `requires_openai_auth = false` | 本例使用第三方凭据，不复用 OpenAI 登录 |

替换示例中的地址、Key 和模型 ID 后，重启客户端，发送简单消息并用 `/status` 核对模型与 provider。自定义模型别名可能还需要提供商给出的模型目录元数据：按其说明配置 provider 下的 `model_catalog_url`，或顶层的 `model_catalog_json`，不要引用一个不存在的文件。[网关配置及验证](https://learn.chatgpt.com/docs/enterprise/connect-to-a-gateway)

注意两点：

- 当前版本会忽略项目 `.codex/config.toml` 中重定向认证的 `model_provider`、`model_providers` 等字段；服务商设置应放在用户级配置中。
- `requires_openai_auth = true` 是另一种认证路径，会使 Codex 忽略 `env_key`。不要把它与本例的第三方 Key 方案混用。

本地 Ollama / LM Studio 可另用 `codex --oss --local-provider ollama --model <LOCAL_MODEL_ID>` 等方式，前提是本地服务已运行且模型兼容。[高级配置与本地模型](https://learn.chatgpt.com/docs/config-file/config-advanced)、[provider 认证规则](https://learn.chatgpt.com/docs/auth)

##### 桌面端与切换说明

本地桌面端同样可以读取用户级 provider 配置。终端里临时设置的变量，未必能被从开始菜单或 Dock 启动的应用读取；桌面使用时需通过系统用户环境或组织的凭据分发方式提供 Key，并彻底退出、重开应用。

切回官方服务时，将顶层 `model_provider` 改回 `openai`，将 `model` 改为可用的官方模型，检查是否还有命令行或其他配置覆盖，然后使用 ChatGPT 或 OpenAI API Key 登录。自定义 provider 表可以保留供以后切换，但不要重复定义同一个 TOML 键或表。[桌面端网关配置](https://learn.chatgpt.com/docs/enterprise/connect-to-a-gateway)

#### 配置文件位置与优先级

| 文件 | 用途 | 是否适合提交 |
| --- | --- | --- |
| `~/.codex/config.toml` | 用户级模型、provider、MCP 等设置 | 不属于项目仓库 |
| `<项目>/.codex/config.toml` | 受信任项目的局部设置 | 可以，不放密钥 |
| `~/.codex/auth.json` 或系统凭据存储 | 工具维护的登录凭据，取决于存储设置 | 不提交 |

`CODEX_HOME` 可以替换默认的 `~/.codex` 用户目录，配置、凭据文件和全局指令随之从该目录查找。

常见设置优先级由高到低为：命令行参数、受信任项目配置、选定的 profile、用户配置、云端/系统默认设置、内置默认值。项目配置从根目录向当前工作目录加载，越接近当前目录越优先。组织强制要求还会约束可选值；不受信任的项目不会加载项目配置。[配置层级](https://learn.chatgpt.com/docs/config-file/config-basic)、[凭据存储](https://learn.chatgpt.com/docs/auth)

#### 指令文件位置及加载规则

| 位置 | 作用 |
| --- | --- |
| `~/.codex/AGENTS.md` | 全局个人指令 |
| `~/.codex/AGENTS.override.md` | 同目录全局指令的临时替代文件 |
| `<项目>/AGENTS.md` | 项目共享指令 |
| `<子目录>/AGENTS.md` | 从该目录启动时纳入的局部指令 |
| 任意上述目录的 `AGENTS.override.md` | 替代同目录 `AGENTS.md` |

加载规则：

1. 全局目录先检查 `AGENTS.override.md`，再检查 `AGENTS.md`，选择第一个非空文件。
2. 项目范围从项目根目录走到**当前工作目录**；每层按 `AGENTS.override.md`、`AGENTS.md`、自定义 fallback 文件名依次查找，每个目录最多读取一个。
3. 选出的文件按“全局 → 项目根目录 → 更深目录”合并，越靠近当前目录的指令在冲突时优先。
4. `AGENTS.override.md` 只替代**同目录**的文件，不会清空其他目录已经加载的指令。
5. 默认项目指令总大小上限为 32 KiB，可用 `project_doc_max_bytes` 调整；指令链在启动时建立，修改后应重新启动会话验证。

可以在 CLI 会话内执行 `/init` 生成 `AGENTS.md`。Codex 默认不会把 `CLAUDE.md` 当成标准指令文件；需要时使用 `project_doc_fallback_filenames` 配置后备文件名，但同目录已有 `AGENTS.md` 时后备文件不会叠加加载。[AGENTS.md 官方规则](https://learn.chatgpt.com/docs/agent-configuration/agents-md)

### OpenCode

OpenCode 支持多个模型提供商，可使用桌面端或 CLI。**OpenCode 1 与 2 都使用 `opencode` 命令**，默认不能并排安装；本文以下配置采用 OpenCode 2 原生格式。[版本与迁移说明](https://opencode.ai/v2/docs/migrate-v1/)

#### 下载与安装

**桌面端**：打开 [OpenCode 下载页](https://opencode.ai/download)，按系统和 CPU 架构下载安装包。Windows 选择 x64 或 ARM64，macOS 区分 Apple Silicon 与 Intel，Linux 按发行版选择安装包。

**Windows CLI**：从 [OpenCode 2 官方安装页](https://opencode.ai/v2/docs/) 下载对应架构的独立 CLI，解压后将可执行文件所在目录加入用户 `PATH`，重新打开终端。V2 官方未支持 Windows 专用包管理器安装，不要套用旧版的 Scoop / Chocolatey 命令。

**macOS / Linux / WSL CLI**，选择一种：

```bash
# 官方安装脚本
curl -fsSL https://opencode.ai/v2/install | bash
```

```text
# 已安装 Node.js / npm
npm install -g @opencode/cli
```

```bash
# Homebrew
brew install anomalyco/tap/opencode-v2
```

进入项目后运行 `opencode`。旧教程中的 `npm install -g opencode-ai` 与 `https://opencode.ai/install` 安装的是 1.x；不要与上面的 2.x 安装方式混用。[OpenCode 2 安装说明](https://opencode.ai/v2/docs/)

#### 连接模型

启动后在 TUI 中运行：

```text
/connect
/models
```

先选择提供商并完成认证，再选择模型。官方模型 API 可连接对应的 OpenAI、Anthropic 等提供商；第三方服务使用相应的内置提供商或自定义 provider。可用认证方式以对应提供商入口为准。[提供商说明](https://opencode.ai/v2/docs/providers/)

下面以第三方 **OpenAI 兼容接口**为例，编辑用户级 `~/.config/opencode/opencode.jsonc`：

```json
{
  "$schema": "https://opencode.ai/config.json",
  "model": "thirdparty/coder",
  "providers": {
    "thirdparty": {
      "name": "Third-party Provider",
      "env": ["OPENCODE_THIRDPARTY_API_KEY"],
      "package": "@opencode/ai/providers/openai-compatible",
      "settings": {
        "baseURL": "https://gateway.example.com/v1"
      },
      "models": {
        "coder": {
          "modelID": "<MODEL_ID>",
          "name": "My Coding Model"
        }
      }
    }
  }
}
```

在启动 OpenCode 的环境中设置 `OPENCODE_THIRDPARTY_API_KEY`：

```powershell
$env:OPENCODE_THIRDPARTY_API_KEY = "<PROVIDER_API_KEY>"
opencode
```

其中 `thirdparty/coder` 由 provider ID 和本地模型键组成；`modelID` 才是传给上游的真实模型 ID。V2 使用 `providers`、`package`、`settings`，不要与 V1 的 `provider`、`npm`、`options` 字段混写在同一个 provider 对象里。若服务采用 Anthropic 或 Responses 协议，按提供商文档选择对应 runtime package。[自定义提供商格式](https://opencode.ai/v2/docs/providers/)

如果桌面端连接的是独立 OpenCode 服务，Key 必须在**服务进程**环境中可见，只在前端终端设置变量可能无效。

#### 配置文件位置与优先级

| 位置 | 用途 |
| --- | --- |
| `~/.config/opencode/opencode.json` 或 `opencode.jsonc` | 用户全局配置；Windows 默认对应 `%USERPROFILE%\.config\opencode\` |
| `<项目>/opencode.json` 或 `opencode.jsonc` | 项目配置 |
| `<项目>/.opencode/opencode.json` 或 `opencode.jsonc` | 项目配置的另一种位置 |
| Windows `%ProgramData%\opencode\`、Linux `/etc/opencode/`、macOS `/Library/Application Support/opencode/` | 管理员部署的系统配置目录 |

JSONC 支持注释和尾逗号。配置会合并，不冲突的字段保留；一般项目设置覆盖全局设置，系统托管设置优先。

V2 会先从远到近合并直接放在目录中的 `opencode.json(c)`，再合并 `.opencode/` 中的配置，所以 `.opencode/` 形式可覆盖直接形式。建议在同一目录树内统一选一种存放方式，避免以为仅由目录深度决定优先级。[配置位置与合并规则](https://opencode.ai/v2/docs/config/)

#### 指令文件位置及加载规则

| 位置 | 作用 |
| --- | --- |
| `~/.config/opencode/AGENTS.md` | 全局个人指令 |
| `<项目>/AGENTS.md` | 项目共享指令 |
| 工作目录及其祖先目录中的 `AGENTS.md` | 当前工作区相关规范 |
| 配置中的 `instructions` | 额外指定的文件、通配符或 HTTP(S) URL |

OpenCode 2 会组合全局指令与发现的项目 `AGENTS.md`。项目在用户主目录之外时，向上查找到项目根目录停止。官方示例中的组合顺序是“全局 → 当前工作目录 → 逐级上层目录”；工具不会替用户解决规则冲突，应避免相互矛盾的要求。

**V2 只识别 `AGENTS.md`，不会回退读取 `CLAUDE.md`**，也没有 Codex 的 `AGENTS.override.md` 特殊替代规则。额外公共文档可通过配置加载：

```json
{
  "$schema": "https://opencode.ai/config.json",
  "instructions": ["docs/agent-rules.md"]
}
```

该示例文件需自行创建；`instructions` 会与自动发现的 `AGENTS.md` 一起使用。[V2 指令发现规则](https://opencode.ai/v2/docs/instructions/)、[额外指令配置](https://opencode.ai/v2/docs/config/)

如果仍使用 **OpenCode 1.x**，其项目 `CLAUDE.md` 与全局 `~/.claude/CLAUDE.md` 可以作为后备指令，规则与 V2 不同，详见 [V1 Rules](https://docs.opencode.ai/docs/rules/)。

### 多个工具共用项目指令

可以将项目公共规范统一写在根目录 `AGENTS.md` 中，让 Codex 和 OpenCode 2 直接读取，再通过 Claude 的 `CLAUDE.md` 显式导入：

```markdown
@AGENTS.md
```

公共 `AGENTS.md` 示例：

```markdown
# 项目规则

- 使用中文沟通。
- 新建文件使用 CRLF 换行。
- 直接在 main 分支开发，不创建功能分支。
- 测试产生的脚本、图片等文件放入 tmp，任务结束后删除。
- 结束前停止本次启动的开发服务器。
- 不推送到远程，由用户自行推送。
- 修改后说明改动内容、验证结果和未完成事项。
```

团队共同规范提交到仓库，个人偏好放到各工具的全局指令中。涉及局部目录规则时分别核对各工具的加载顺序，不要假设相同文件名意味着相同优先级。指令来源可参照 [Claude Memory](https://code.claude.com/docs/en/memory)、[Codex AGENTS.md](https://learn.chatgpt.com/docs/agent-configuration/agents-md)、[OpenCode Instructions](https://opencode.ai/v2/docs/instructions/)。

### 常见问题

| 现象 | 检查方法 |
| --- | --- |
| 安装后找不到命令 | 重新打开终端，确认可执行文件所在目录已加入 `PATH`；确认安装与运行是否处于同一个 Windows / WSL 环境 |
| PowerShell 阻止 `npm.ps1` | 可以调用 `npm.cmd` 执行同一 npm 命令，或在 CMD 中运行 |
| 配置文件不存在 | 按本文位置创建目录与文件；并非所有工具都会在安装时生成配置 |
| 第三方配置后仍提示登录 | Claude CLI 检查用户级认证变量；Claude Desktop 使用第三方推理入口；Codex 检查 provider 与 `requires_openai_auth` |
| 提示模型不存在或不支持 | 检查真实模型 ID、模型目录元数据，以及提供商的套餐与接口协议 |
| CLI 可用但桌面端不可用 | 检查桌面应用或后台服务是否能读取 Key；Claude 桌面端还需独立配置推理路由 |
| 修改配置或指令没有生效 | 新建会话或重启客户端，检查启动目录、配置覆盖项、项目信任状态及对应工具版本 |
