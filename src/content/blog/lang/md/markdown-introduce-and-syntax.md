---
title: Markdown介绍及其语法
publishDate: 2017-07-20
description: MarkDown是目前最流行的文本标记语言
tags:
  - markdown
---

## 简介

官网：<https://daringfireball.net/projects/markdown><br>
Markdown是一种可以使用普通文本编辑器编写的标记语言，通过简单的标记语法，它可以使普通文本内容具有一定的格式。Markdown具有一系列衍生版本，用于扩展Markdown的功能（如表格、脚注、内嵌HTML等等），它们能让Markdown转换成更多的格式，例如LaTeX，Docbook。

## 用途

Markdown的语法简洁明了、学习容易，而且功能比纯文本更强，因此有很多人用它写博客。世界上最流行的博客平台WordPress和大型CMS如Joomla、Drupal都能很好的支持Markdown。完全采用Markdown编辑器的博客平台有Ghost和Typecho。

## 编辑器

- Typora
- VSCode

## 语法

说明：每种语法后都必须添加**空格**才能生效

### 标题

Markdown 支持两种标题的语法，类 Setext 和类 atx 形式。

1. 类 Setext 形式是用底线的形式，利用 = （最高阶标题）和 - （第二阶标题），例如

```
This is an H1
=============
This is an H2
-------------
```

任何数量的 = 和 - 都可以有效果。2. 行首插入1-6个\#，每增加一个\#表示更深入层次的内容，对应到标题的深度由 1-6 阶，其中Header1为首层，字体最大。

```
# 这是 H1 #
## 这是 H2 ##
### 这是 H3 ###
```

### 文本样式

- 加粗：`**Text**` （快捷键：Ctrl+B）<br>
  **Text**
- 斜体：`*Text*` （快捷键：Ctrl+I）<br>
  _Text_
- 删除线：`~~Text~~` （快捷键：Ctrl+ALT+U）<br>
  ~~Text~~
- 换行符 : 一行结束时输入两个回车，也可以使用`<br>`

### 列表

Markdown支持有序列表和无序列表。

- 有序列表：使用数字接着一个英文句点（并有个空格）：

```
1. one is...
2. two is...
```

效果可参考本段内容xD

- 无序列表：使用星号、加号或是减号作为列表标记（任意一个即可）：

```
* i love you
+ i love you very much
- i love you more
```

- i love you

* i love you very much

- i love you more

### 链接

Markdown 支持两种形式的链接语法：行内式和参考式两种形式。

1. 行内式<br>

- 要建立一个行内式的链接，只要在方块括号后面紧接着圆括号并插入网址链接即可，如果你还想要加上链接的 title 文字，只要在网址后面，用双引号把 title 文字包起来即可，例如：

```
[My Blog1](https://icoding.pw/ "This link is my blog.")
[My Blog2](https://icoding.pw/)
```

[My Blog1](https://icoding.pw/ 'This link is my blog.') |
[My Blog2](https://icoding.pw/)
鼠标放在链接上，你就会发现不同。xD<br>

- 如果你是要链接到同样主机的资源，你可以使用相对路径：<br>
  `[这里](/posts/markdown_introduce_and_syntax/)也是这篇文章的地址`<br>
  [这里]也是这篇文章的地址

2. 参考式<br>
   参考式的链接是在链接文字的括号后面再接上另一个方括号，而在第二个方括号里面要填入用以辨识链接的标记：<br>

```
这是[My Blog][1]的链接地址
[1]: https://icoding.pw/  "This link is my blog."
```

这是[My Blog][1]的链接地址

3. 直接链接
   `<https://icoding.pw>是我的博客地址`
   <https://icoding.pw>是我的博客地址

[1]: https://icoding.pw/ 'This link is my blog.'

### 图片

跟行内式链接类似，只需要在最前面添加`!`符号即可，例如：

```
![pic](https://gitee.com/juzzi/res/raw/master/pic/2019/07/test/touxiang.jpg)
```

### 分隔线

你可以在一行中用三个以上的星号、减号、底线来建立一个分隔线，行内不能有其他东西。你也可以在星号或是减号中间插入空格。

```
* * *
***
- - -
---------------------------------------
```

---

### 区块引用

Markdown 标记区块引用是使用类似 email 中用 > 的引用方式，Markdown 也允许你偷懒只在整个段落的第一行最前面加上 > 。

```
> No one can call back yesterday, yesterday will not be called again.No one can call back yesterday, yesterday will not be called again.
```

> No one can call back yesterday, yesterday will not be called again.No one can call back yesterday, yesterday will not be called again.

### 注释

注释分为单行注释与多行注释两种

1. 单行注释：\`单行注释\`<br>
   `单行注释`
2. 多行注释：<br>
   \`\`\`<br>
   多行注释<br>
   \`\`\`

```
多行注释
```

### 表格

```
|表头1  |表头2  |
|----   | ----  |
|单元格 |单元格 |
|单元格 |单元格 |
```

表格的对齐方式：

- -: 居右对齐
- :- 居左对齐
- :-: 居中对齐。
