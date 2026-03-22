# 代理开发指南

## 构建和测试命令

### 基础命令

- `pnpm dev` - 启动开发服务器
- `pnpm build` - 构建生产版本
- `pnpm preview` - 预览构建后的网站
- `pnpm check` - 类型检查
- `pnpm clean` - 清理构建缓存和输出

### 代码质量检查

- `pnpm lint` - 运行 ESLint 并自动修复
- `pnpm format` - 使用 Prettier 格式化所有代码

### 特定测试命令

目前项目未配置测试框架。如需添加测试，建议使用 Vitest：

```bash
pnpm vitest
pnpm vitest run
pnpm vitest watch
```

### 单文件测试（如添加测试框架）

```bash
# 运行单个测试文件
pnpm vitest run 文件路径

# 运行匹配模式的测试
pnpm vitest run tests/**/*.test.ts
```

## 代码风格规范

### 基础配置

- **包管理器**: pnpm
- **运行时**: Node.js 20.x
- **类型系统**: TypeScript (严格模式)
- **构建工具**: Astro 5.x

### 导入规范

- 使用 TypeScript 类型导入：`import type { ... } from ...`
- 使用相对导入和别名路径导入
- 导入顺序：
  1. Astro 内置模块
  2. Astro 依赖 (@astrojs/\*)
  3. 第三方库
  4. 项目内部依赖
  5. 项目内部组件和工具函数

### 代码格式化 (Prettier)

- **行长**: 100 字符
- **单引号**: 所有 JS/TS 代码使用单引号
- **分号**: 不使用分号
- **括号**: `always` (函数参数和对象属性)
- **缩进**: 2 个空格
- **尾逗号**: 不使用尾逗号
- **换行**: 使用 LF (Unix 风格)
- **引号属性**: `as-needed` (仅在需要时使用引号)

### ESLint 配置

- 使用 Astro 官方推荐的 ESLint 配置
- 自动修复功能：`pnpm lint` 会自动修复大部分问题
- 特殊忽略文件：`public/scripts/*`、`scripts/*`、`.astro/`、`src/env.d.ts`

### TypeScript 规范

- **严格模式**: 启用所有严格检查
- **严格空值检查**: `strictNullChecks: true`
- **模块语法**: `verbatimModuleSyntax: true`
- **类型导入**: 明确区分类型导入和值导入
- **路径别名**:
  - `@/assets/*` → `src/assets/*`
  - `@/components/*` → `src/components/*`
  - `@/layouts/*` → `src/layouts/*`
  - `@/utils/*` → `src/utils/*`
  - `@/plugins/*` → `src/plugins/*`
  - `@/pages/*` → `src/pages/*`
  - `@/types/*` → `src/types/*`
  - `@/site-config` → `src/site-config.ts`

### 命名规范

#### 文件命名

- 使用 kebab-case: `base-layout.astro`, `comment-widget.ts`
- 组件文件：大写开头驼峰或 kebab-case（推荐）
- 工具文件：小写 kebab-case 或 camelCase

#### 变量和函数命名

- 使用 camelCase
- 类名使用 PascalCase
- 常量使用 UPPER_SNAKE_CASE
- 布尔值使用 is/has/can 前缀：`isLoading`, `hasError`, `canRender`

#### 组件命名

- Astro 组件文件名使用 kebab-case
- 组件内部导出使用 PascalCase：`<Comment />`, `<Tabs />`
- 避免使用 React/Next.js 风格的 `use` 前缀

### 错误处理

- 使用 try-catch 处理可能的错误
- 对外部 API 调用进行错误处理
- 避免使用 `@ts-expect-error`，优先修复类型问题
- 使用可选链操作符和空值合并运算符处理可能为 null/undefined 的值

### Astro 特定规范

- 组件使用 `<script setup lang="ts">` 语法
- 样式使用 CSS-in-JS 或 UnoCSS 工具类
- 静态站点生成：使用 `output: 'static'`
- 图片优化：使用 Astro 的 `@astrojs/image` 或 Sharp

### Markdown 文件

- 使用 Front Matter 定义元数据
- 使用 Kramdown 格式
- 数学公式使用 LaTeX 语法（已配置 KaTeX）
- 代码块使用 Shiki 高亮（GitHub Light/Dark 主题）

### 组件开发

```astro
---
// 导入
import type { Component } from 'astro'

import SomeComponent from './SomeComponent.astro'

// 组件定义
interface Props {
  title: string
  count?: number
}

const props: Props = Astro.props

// 响应式数据
const loading = false
const data = await fetchData()
---

<!-- HTML 结构 -->
<div class='container'>
  <h1>{props.title}</h1>
  {loading ? <p>Loading...</p> : <div>{data}</div>}
</div>

<style>
  .container {
    display: flex;
  }
</style>
```

### 工具函数开发

```typescript
// src/utils/example.ts
import type { SomeType } from '@/types/example'

/**
 * 函数描述
 * @param param - 参数描述
 * @returns 返回值描述
 */
export function exampleFunction(param: SomeType): ReturnType {
  return param
}
```

### 审查检查清单

- [ ] 代码通过 `pnpm lint` 检查
- [ ] 代码通过 `pnpm format` 格式化
- [ ] 无 `@ts-expect-error` 注释
- [ ] 所有导入使用类型导入（如需要）
- [ ] 变量和函数命名符合规范
- [ ] 错误处理完善
- [ ] 组件有适当的文档注释
- [ ] 类型定义完整

## 工作流程建议

1. **开发前**: 运行 `pnpm dev` 启动开发服务器
2. **编写代码**: 遵循本指南中的代码规范
3. **格式化代码**: 运行 `pnpm format` 格式化所有文件
4. **运行检查**: 运行 `pnpm lint` 和 `pnpm check`
5. **提交前**: 确保所有检查通过，更新 CHANGELOG（如适用）

## 注意事项
- 请勿执行 git commit 命令，所有代码修改需经我确认后再手动提交

## 常见问题

### 如何运行单个测试？

目前项目未配置测试框架。添加测试框架后，可以使用以下命令：

```bash
pnpm vitest run 文件路径
```

### 如何查看类型错误？

```bash
pnpm check
```

### 如何格式化单个文件？

```bash
pnpm prettier --write 文件路径
```

### 如何修复 ESLint 错误？

```bash
pnpm lint
```

## 额外资源

- [Astro 官方文档](https://docs.astro.build/)
- [UnoCSS 文档](https://unocss.dev/)
- [TypeScript 手册](https://www.typescriptlang.org/docs/)
- [ESLint 配置](./eslint.config.mjs)
- [Prettier 配置](./prettier.config.mjs)
- [项目 README](./README.md)
