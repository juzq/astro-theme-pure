---
title: Skill介绍
publishDate: 2026-04-08
description: skill是目前大多AI工具都支持的功能，可以扩展AI的能力。
tags:
  - AI
  - Skills
---

### 什么是 Skill

Skill（技能）是 Claude Code及常用Agent的扩展能力模块，每个 skill 都是一个独立的功能单元，包含：

- **触发条件**：定义何时可以使用该 skill
- **工作流程**：预定义的处理步骤和检查清单
- **工具指引**：skill 相关的操作指导

Skill 分为以下几种来源：

- **内置 skill**：Claude Code 自带的功能（如 `/help`、`/clear`）
- **插件 skill**：通过插件安装的第三方扩展
- **自定义 skill**：通过拷贝skill文件夹到指定目录

### 使用 Skill

#### 调用方式

在 Claude Code 中，使用斜杠命令调用 skill：

```
/<skill_name> [参数]
```

例如：

- `/xlsx @野外补兵细案.xlsx 总结下这个文件内容`
- `/pdf document.pdf 提取第三章内容`
- `/pptx 创建一个关于AI的演示文稿`

#### Skill 查找

不确定有哪些 skill 可用？输入 `/` 可以看到所有可用 skill 的列表。

### 插件 Skill

Claude 可以通过安装插件来使用更多 skill。

#### 添加 marketplace

```
/plugin marketplace add obra/superpowers-marketplace
```

#### 安装插件

**方式一：命令安装**

```
/plugin install superpowers@superpowers-marketplace
```

**方式二：浏览安装**

1. 使用 `/plugin` 进入插件管理
2. 选择 `Discover` 进行搜索，或选择 `Marketplaces` 根据市场筛选
3. 选择市场后，再选择 `Browse plugins`
4. 按空格勾选插件，再按 `i` 键安装

#### 重载插件

安装后使用命令 `/reload-plugins` 重载，或重新打开 Claude 即可使用插件。

> 注意：要使用插件中的 skill，**必须退出 Claude 并重新进入**。

### 自定义 Skill

也可以将 skill 放入指定路径使用，适用于自定义插件。

注意：`<name>` 必须和 `SKILL.md` 中的 `name` **完全一致**。

#### Claude Code

Claude Code启动时，会读取`~/.claude/skills`和`.claude/skills`目录下的所有skill。安装skill时，默认是安装到`~/.agents/skills`下，为了claude code也能使用，可以创建符号链接。

##### macOS/Linux

```
ln -s ~/.agents/skills ~/.claude/skills
```

##### Windows

```
MSYS=winsymlinks:nativestrict ln -s /c/Users/<name>/.agents/skills /c/Users/<name>/.claude/skills
```

### 常用skill

#### backend-development

后端开发

```
npx skills add https://github.com/mrgoonie/claudekit-skills --skill backend-development
```

#### claude-hud

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

```
npx skills add https://github.com/vercel-labs/skills --skill find-skills
```

#### frontend-design

前端设计

```
npx skills add https://github.com/anthropics/skills --skill frontend-design
```

#### playwright-cli

浏览器自动化操作

```
npx skills add https://github.com/microsoft/playwright-cli --skill playwright-cli
```

#### skill-creator

创造自定义技能

```
npx skills add https://github.com/anthropics/skills --skill skill-creator
```

#### superpowers

全能开发：项目规划、代码编写、code review 等，拆解做产品的开发步骤。

```
/plugin marketplace add obra/superpowers-marketplace
/plugin install superpowers@superpowers-marketplace
```

注意：如果执行`plugin install`报错`Filename too long`可设置git支持长路径解决。
```
git config --global core.longpaths true
```