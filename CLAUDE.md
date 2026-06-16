# CLAUDE.md

本文件为 Claude Code (claude.ai/code) 在本仓库工作时提供指导说明。

## 项目概览

这是一个基于 [Astro](https://astro.build/) 构建的个人博客，使用 `astro-theme-pure` 主题。站点包含博客文章、文档页面和关于页面。顶部菜单中的 "Tools" 项是外部链接，指向 `https://utils.qzz.io/`（在 `src/site.config.ts` 中配置），不是本地页面。

## 常用命令

```shell
# 安装依赖（按照 packageManager 字段使用 pnpm）
pnpm install

# 启动开发服务器（带热更新）
pnpm dev

# 类型检查
pnpm check

# 构建生产版本
pnpm build

# 预览生产构建
pnpm preview

# 格式化代码（prettier）
pnpm format

# 代码检查（eslint）
pnpm lint

# 同步内容集合
pnpm sync
```

## 架构

### 内容结构

- **`src/content/blog/`** - Markdown/MDX 格式的博客文章
- **`src/content/docs/`** - 文档页面
- **`src/content.config.ts`** - 内容集合 schema（blog 和 docs）
- **`src/site.config.ts`** - 主题配置（主题、集成、页头、页脚）

### 关键目录

- **`src/pages/`** - Astro 页面（404、about、archives 等）
- **`src/layouts/`** - 页面布局（BaseLayout、BlogPost、ContentLayout）
- **`src/components/`** - Astro 组件（home、links、projects、waline、about）
- **`src/plugins/`** - 自定义 Shiki 转换器和 rehype 插件
- **`packages/pure/`** - 可复用主题组件和工具，以 `astro-pure` 发布到 npm。`Header.astro` 会自动检测 `header.menu` 中的绝对 URL，并通过 `isAbsoluteUrl` 用 `target="_blank"` + `rel="noopener noreferrer"` 打开。
- **`preset/`** - 预设配置（头像缓存脚本）

### 配置文件

- **`astro.config.ts`** - Astro 配置，包括 Shiki 代码高亮、markdown 插件（remark-math、rehype-katex）以及集成
- **`uno.config.ts`** - UnoCSS 配置
- **`src/site.config.ts`** - 主题相关设置（页头、页脚、Waline 评论、Pagefind 搜索）

### 依赖

- **Astro 5.x** - 使用内容集合
- **Shiki** - 代码高亮（带有 diff/highlight 标记的自定义转换器）
- **Waline** - 评论系统
- **UnoCSS** - 原子化 CSS
- **Pagefind** - 全文搜索
- **KaTeX** - 数学公式渲染（通过 remark-math/rehype-katex）

### 测试产物

测试脚本和验证截图放在 **`tmp/`** 目录（已在 git 忽略中）。测试完成后删除这些文件 —— 不要在项目中留下垃圾。

## 工作约定

### 沟通语言

始终使用中文与用户沟通（回复、说明、提问、确认等）。

### 文件换行符

新建文件时根据当前操作系统选择换行符编码：

- **Windows** → `CRLF`（`\r\n`）
- **Linux / macOS** → `LF`（`\n`）

不要使用 Bash 的 `echo` 重定向等隐式方式创建文件（这会引入与系统不匹配的换行符），优先使用 `Write` 工具创建新文件。修改已有文件时保持其原有换行符风格不变。
