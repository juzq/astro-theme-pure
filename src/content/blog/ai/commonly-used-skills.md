---
title: 常用Skill推荐
publishDate: 2026-06-17
description: 将一些好用的skills分类整理
tags:
  - AI
---

### 必装

#### claude-hud

作者：jarrodwatts

在命令行显示模型、上下文、步骤、token等信息

```
/plugin marketplace add jarrodwatts/claude-hud
```

- Minimax用量查询：

  ```
  curl --location 'https://www.minimaxi.com/v1/token_plan/remains' \
  --header 'Authorization: Bearer <API Key>' \
  --header 'Content-Type: application/json'
  ```

#### find-skills

从[skills.sh](https://skills.sh/)中查找skill并自动安装。

作者：vercel

```
npx skills add https://github.com/vercel-labs/skills --skill find-skills
```

#### superpowers

作者：obra

全能开发：项目规划、代码编写、code review 等，拆解做产品的开发步骤。

```
/plugin marketplace add obra/superpowers-marketplace
/plugin install superpowers@superpowers-marketplace
```

注意：如果执行`plugin install`报错`Filename too long`可设置git支持长路径解决。

```
git config --global core.longpaths true
```

### 项目管理

#### mcp-builder

作者：jezweb

根据所需的工具描述，构建一个可运行的 MCP 服务器。使用 FastMCP 技术，生成可部署的 Python 服务器。

```
npx skills add https://github.com/jezweb/claude-skills --skill mcp-builder
```

#### skill-creator

作者：anthropic

创造自定义技能

```
npx skills add https://github.com/anthropics/skills --skill skill-creator
```

### 前端开发

#### frontend-design

作者：anthropic

具有独特风格的生产级前端界面，通过有针对性的设计选择来摒弃那种通用的 AI 美学风格。

```
npx skills add https://github.com/anthropics/skills --skill frontend-design
```

#### playwright-cli

作者：microsoft

浏览器自动化功能，拥有超过 40 种命令，可用于导航、交互、填写表单以及网页测试。

```
npx skills add https://github.com/microsoft/playwright-cli --skill playwright-cli
```

#### ui-ux-pro-max

作者：kimny1143

着陆页面设计，仪表盘用户界面，SaaS 产品，移动应用（响应式设计）。

```
npx skills add https://github.com/kimny1143/claude-code-template --skill ui-ux-pro-max
```

### 后端开发

#### backend-development

作者：mrgoonie

采用现代技术、最佳实践以及经过验证的模式，进行可投产的后端开发工作。

```
npx skills add https://github.com/mrgoonie/claudekit-skills --skill backend-development
```

#### code-review-excellence

作者：wshobson

系统化的代码审查流程，旨在获得建设性的反馈、发现漏洞以及促进团队之间的知识共享。

```
npx skills add https://github.com/wshobson/agents --skill code-review-excellence
```

#### code-simplifier

作者：simonwong

注重编写易于理解的、明确的代码，而非过于紧凑的解决方案。

```
npx skills add https://github.com/simonwong/agent-skills --skill code-simplifier
```

### 办公

#### humanizer-zh

作者：op7418

识别和去除 AI 生成文本的痕迹，使文字听起来更自然、更有人味。

```
npx skills add https://github.com/op7418/humanizer-zh --skill humanizer-zh
```

#### pdf

作者：openai

读取、创建、编辑、校验pdf。

```
npx skills add https://github.com/openai/skills --skill pdf
```

#### pptx

作者：anthropics

创建、编辑、阅读以及操作 PowerPoint 演示文稿。同时，会获得设计指导和质量保证流程方面的指导。

```
npx skills add https://github.com/anthropics/skills --skill pptx
```
