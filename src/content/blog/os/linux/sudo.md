---
title: 普通用户使用sudo获取部分root权限
publishDate: 2020-09-15
description: 使用sudo可以让普通用户像root一样执行部分高权限操作。
tags:
  - linux
---

## 编辑sudo配置

`visudo -f /etc/sudoers.d/juzi`
其中，juzi为用户名

## sudo语法

who host=(run_as) TAG:command

- who：运行者用户名
- host：主机
- run_as：以目标身份运行
- TAG：标签（PASSWD/NOPASSWD）
- command：命令

例：`juzi ALL=(root) PASSWD:/usr/sbin/useradd`

表示用户juzi可以在任何主机用root身份在需要输入密码的情况下使用useradd命令。

## 常用条目

- 系统消息

```
juzi ALL=(root) NOPASSWD:/bin/tail -* /var/log/*
```

- 软件安装

```
juzi ALL=(root) PASSWD:SOFTWARE
```

注：需要取消/etc/sudoers中的`Cmnd_Alias SOFTWARE = ...`的注释。

- 编辑/etc下的文件

```
juzi ALL=(root) NOPASSWD:/usr/bin/vi /etc/*
```

- make install源码安装

```
juzi ALL=(root) PASSWD:/usr/bin/make install
```
