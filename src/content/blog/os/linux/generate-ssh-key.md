---
title: 生成SSH密钥
publishDate: 2020-05-20
description: 包含多个系统的生成方法
tags:
  - SSH
---

## 安装ssh-keygen

- Mac或者Linux：一般都自带了SSH Client，所以也自带了ssh-keygen，因此无需额外安装。

- Windows：最简单的方法就是下载[Windows版的Git客户端](https://git-scm.com/download/win)，因为它自带了**ssh-keygen**。

> 所以如果你正在用Windows，而又没有安装Git，最快的办法就是找一台Linux服务器去上面生成一下再Download下来。

## 步骤

1. 打开命令行
2. 输入命令：

```bash
ssh-keygen -t ed25519 -C "your_email@example.com"
```

其中ed25519可替换rsa，例如：

```bash
ssh-keygen -t rsa -b 4096 -C "your_email@example.com"
```

`-C`选项代表指定注释内容，一般使用邮件作为注释，该注释会记录在公钥中，方便在服务器上进行识别。若不加`-C "your_email@example.com`，也会自动以`用户名@主机名`的格式生成注释。

> Github从2022年3月15日起停止支持了dsa类型的密钥访问，如果你要用该密钥来访问Github，就不要生成dsa类型的。3. 根据提示，输入生成位置

```
Generating public/private ed25519 key pair.
Enter file in which to save the key (/c/Users/user/.ssh/id_ed25519):
```

如果不做修改（直接按*Enter*），默认会生成到用户目录下的**.ssh**文件夹下的id_xxx文件，xxx代表密钥类型。4. 根据提示，输入密码

```
> Enter passphrase (empty for no passphrase):
> Enter same passphrase again:
```

> 设置密码后，每次使用密钥时都需要输入密码后才能使用，如果不设置密码，直接按两次*Enter*即可。5. 找到生成的密钥文件
> 文件会出现在第3步中指定的位置，xxx.pub为公钥，存放在服务器上；xxx为私钥，存放在自己电脑上，可以连接有对应公钥的服务器。
