---
title: Golang项目在fork后的注意事项
publishDate: 2026-02-24
description: '如果fork后还被其他项目引用，会产生一系列问题。'
tags:
  - Golang
---


### 问题
Golang项目与其他语言的项目有所不同，golang项目直接将github的用户名直接作为了项目的模块名字，定义在了go.mod中，例如:
```
module github.com/AAA/project
```

当我们fork该项目后，变成了BBB/project，如果该项目还被其他项目依赖，并用
```
go get github.com/BBB/project
```
拉取之后，会报错，因为项目名字BBB/project与该项目中的go.mod定义不一致。

### 方案一
可以直接将原项目go.mod中的module改成BBB/project。

但是项目中可能还引用了本项目的包，因此要把所有import都改成BBB/project。

### 方案二
将依赖这个项目的go.mod加入如下语句
```
replace github.com/AAA/project => github.com/BBB/project main
```

然后使用`go mod tidy`来格式化，go会自动拉取main分支的最新代码，并打成一个版本，自动把上述语句变成
```
replace github.com/AAA/project => github.com/BBB/project v0.0.0-20260223120613-9bece0fc6809
```

这样我们在代码中的import还是用之前的github.com/AAA/project，go会自动将代码映射到我们fork后的github.com/BBB/project。