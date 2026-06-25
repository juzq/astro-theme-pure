---
title: golang开发环境
publishDate: 2022-05-19
description: golang的开发环境搭建和常用命令，常用工具等
tags:
  - golang
---

### 下载

```
https://golang.google.cn/
```

### 配置环境变量

- 安装目录：GOROOT
- 下载目录（工具和依赖）：GOPATH

### 常用配置

查看当前配置

```
go env
```

#### 开启111module

```
go env -w GO111MODULE=on
```

#### 设置国内代理

```
go env -w GOPROXY=https://goproxy.cn,direct
```

### 拉取依赖

```
go get github.com/<owner>/<reposity>
```

#### 清理依赖缓存

```
go clean -modcache
```

### 安装工具

#### devel

go调试器

```
go install github.com/go-delve/delve/cmd/dlv@latest
```
