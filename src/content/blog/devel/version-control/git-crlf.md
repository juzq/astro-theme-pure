---
title: Git换行符处理
publishDate: 2022-03-17
description: 本地文件换行符与Git仓库不一致的处理。
tags:
  - git
---

在Windows系统下，经常遇到打开某个仓库后Git会提示文件有修改，但是一对比发现文件内容完全一样，有的编辑器还会提示文件除换行符外没有差别。

这是因为Windows的换行符为`CRLF`，而Linux/Mac(Unix)的换行符为`LF`，因此会导致该差异，怎么解决呢？

其实Git早已内置了换行符的自动转换功能，即`core.autocrlf`属性。

## 配置CRLF属性

### Windows

```bash
git config --global core.autocrlf true
```

这条命令的意思是：提交时，把 `CRLF` 转成 `LF` 存进仓库；检出文件到你的 Windows 工作目录时，再自动把 `LF` 转回 `CRLF`。这样，仓库里永远是干净的 `LF`，而你本地用于编辑的文件则符合 Windows 的 `CRLF` 规范。

### Linux/MacOS

```bash
git config --global core.autocrlf input
```

这条命令的意思是：提交时，把 `CRLF` 转成 `LF` 存进仓库；检出到本地时，**不做任何转换**，保持文件的 `LF` 格式。因为 macOS/Linux 系统原生支持 `LF`。

## 生效配置

由于刚刚设置的属性只有在提交时才能效，因此要Git重新再处理一遍。

```bash
# 删除 Git 的索引（暂存区），但保留工作目录的文件
git rm --cached -r .
# 重新添加所有文件，Git 会按新配置自动转换行尾
git add --all
# 提交这次清理（如果仍然有文件变化）
git commit -m "chore: 规范化文件的换行符"
```
