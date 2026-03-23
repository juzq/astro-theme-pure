# 工具页面实现说明

## 完成情况

✅ 已完成工具页面的创建和配置

## 修改内容

### 1. 导航栏配置

**文件**: `src/site-config.ts`

在 header.menu 中添加了 Tools 链接，位于 Blog 和 About 之间：

```typescript
header: {
  menu: [
    { title: 'Blog', link: '/blog' },
    { title: 'Tools', link: '/tools' },
    { title: 'About', link: '/about' }
  ]
}
```

### 2. 工具页面

**文件**: `src/pages/tools/index.astro`

创建了完整的工具页面，包含以下功能：

#### 功能特点

- ✅ 多页签切换系统
- ✅ 字符串格式化工具（JSON、XML、Protobuf）
- ✅ 实时搜索功能（带防抖）
- ✅ 格式化按钮（带错误处理）
- ✅ 清空按钮
- ✅ 响应式设计
- ✅ 美观的 UI 界面

#### 格式化功能

1. **JSON 格式化**
   - 自动检测并解析 JSON
   - 添加缩进和换行
   - 错误提示

2. **XML 格式化**
   - 使用 DOMParser 解析 XML
   - 格式化缩进和换行
   - 保留注释

3. **Protobuf 格式化**
   - 识别消息定义
   - 识别字段定义（required、optional、repeated）
   - 识别枚举定义
   - 识别服务定义和 RPC 方法
   - 保留注释

#### 用户体验

- 深色/浅色主题适配
- 平滑的页签切换动画
- 清晰的错误提示
- 现代化的 UI 设计

### 3. 文档文件

**文件**: `src/pages/tools/README.md`

创建了详细的使用说明文档，包括：

- 当前功能介绍
- 使用方法
- 测试用例
- 未来计划

### 4. 测试数据

**文件**: `src/pages/tools/test-example.txt`

提供了 JSON 测试数据，方便用户测试格式化功能。

## 技术实现

### 前端技术

- **HTML5**: 语义化标签
- **TypeScript**: 类型安全
- **CSS**: UnoCSS 工具类
- **JavaScript**: 原生 JavaScript（无框架依赖）

### 关键实现

1. **页签切换**: 使用 data-tab 属性和 CSS 类控制显示/隐藏
2. **实时搜索**: 使用 debounce 防抖优化性能
3. **格式化算法**: 分别针对 JSON、XML、Protobuf 实现不同的格式化逻辑
4. **错误处理**: Try-catch 包装格式化逻辑，提供友好的错误提示

### 代码结构

```javascript
// 页签切换
tabButtons.forEach((button) => {
  button.addEventListener('click', () => {
    // 切换逻辑
  })
})

// 格式化按钮
formatBtn.addEventListener('click', () => {
  const formatType = getSelectedFormat()
  switch (formatType) {
    case 'json':
      formatJSON()
      break
    case 'xml':
      formatXML()
      break
    case 'protobuf':
      formatProtobuf()
      break
  }
})

// 实时搜索（防抖）
searchInput.addEventListener(
  'input',
  debounce(() => {
    performSearch()
  }, 300)
)
```

## 访问方式

### 开发环境

1. 启动开发服务器：`pnpm dev`
2. 访问：http://localhost:4321/tools

### 生产环境

1. 构建项目：`pnpm build`
2. 预览构建：`pnpm preview`
3. 访问：http://localhost:4321/tools

## 测试步骤

1. 启动开发服务器
2. 访问首页，点击导航栏的 "Tools"
3. 在工具页面：
   - 选择格式类型（JSON/XML/Protobuf）
   - 输入或粘贴测试文本
   - 使用搜索框进行搜索
   - 点击"格式化"按钮
   - 点击"清空"按钮清空内容

## 未来扩展建议

1. **添加更多工具**
   - URL 编码/解码工具
   - Base64 编码/解码工具
   - MD5/SHA 哈希计算工具
   - 日期时间转换工具
   - 正则表达式测试工具

2. **功能增强**
   - 代码复制功能
   - 格式化选项配置（如缩进大小、换行方式等）
   - 批量处理功能
   - 代码导出功能（JSON/XML/TXT）

3. **性能优化**
   - 大文件处理优化
   - 离线支持（PWA）
   - 历史记录功能

## 构建状态

✅ 项目构建成功
✅ 页面生成正确
✅ 导航栏链接正常

## 注意事项

1. 确保 Node.js 版本 >= 20.x
2. 确保使用 pnpm 作为包管理器
3. 首次访问可能需要稍等片刻（生成类型定义）

## 相关文件

- 导航配置: `src/site-config.ts`
- 页面代码: `src/pages/tools/index.astro`
- 使用文档: `src/pages/tools/README.md`
- 测试数据: `src/pages/tools/test-example.txt`

## 总结

工具页面已经成功实现并集成到博客系统中。用户现在可以通过点击导航栏的 "Tools" 链接访问工具页面，使用字符串格式化工具快速格式化 JSON、XML 和 Protobuf 文本。页面功能完整，用户体验良好，代码结构清晰，易于维护和扩展。
