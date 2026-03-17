---
title: SSH密钥登陆Linux服务器
publishDate: 2020-05-28
description: '服务器配置方法'
tags:
  - Linux
  - SSH
---

使用前需要先用[[blog/os/linux/generate-ssh-key|generate-ssh-key]]创建ssh-key
## 连接Linux服务器
### 步骤
1. 进入用户目录：`cd`或`cd /home/xxx`
2. 创建.ssh文件夹：`mkdir .ssh`
3. **修改.ssh文件夹权限为700**：`chmod 700 .ssh`
4. 进入.ssh文件夹：`cd .ssh`
5. 创建或编辑authorized_keys文件：`vi authorized_keys`，将公钥添加到文件末尾。
6. **修改authorized_keys权限为600**：`chmod 600 authorized_keys`
7. 修改sshd服务配置文件，允许公钥登陆：`sudo vi /etc/ssh/sshd_config`
```
# 允许私钥登陆
PubkeyAuthentication yes
# 指定私钥文件
AuthorizedKeysFile .ssh/authorized_keys
```
8. 重启sshd服务：`systemctl restart sshd.service`

> 若进行了以上操作仍然提示失败，则可使用命令`ssh -Tv $server_ip`进行调试。

> 如果是CentOS6.x的系统，还需要关闭SeLinux才能正常登录。

### sshd_config配置说明

<https://www.freebsd.org/cgi/man.cgi?sshd_config(5)>

### 服务器host key变化导致连接失败
若服务器重装了系统，或者有硬件变化，则可能会导致host key变化，此时客户端通过ssh连接时会出现如下报错：
```
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@       WARNING: POSSIBLE DNS SPOOFING DETECTED!          @
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
The RSA host key for [xxx.com]:57522 has changed,
and the key for the corresponding IP address [172.26.101.72]:57522
is unknown. This could either mean that
DNS SPOOFING is happening or the IP address for the host
and its host key have changed at the same time.
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@    WARNING: REMOTE HOST IDENTIFICATION HAS CHANGED!     @
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
IT IS POSSIBLE THAT SOMEONE IS DOING SOMETHING NASTY!
Someone could be eavesdropping on you right now (man-in-the-middle attack)!
It is also possible that a host key has just been changed.
The fingerprint for the RSA key sent by the remote host is
SHA256:du3fKBQRb+udLRzrYt3tVISqL9reYPC2jd4F6klP9Tc.
Please contact your system administrator.
Add correct host key in C:\\Users\\xxx/.ssh/known_hosts to get rid of this message.
Offending ECDSA key in C:\\Users\\xxx/.ssh/known_hosts:2
RSA host key for [xxx.com]:57522 has changed and you have requested strict checking.
Host key verification failed.
```
解决方法：去.ssh/known_hosts下删除服务器对应的host key或者执行如下命令：
`ssh-keygen -R [xxx.com]:57522`

## 连接GitHub
1. 登录[GitHub](https://github.com/)。
2. 点右上角的头像，选择`Settings`。
3. 点左侧`Access`栏里的`SSH and GPG keys`。
4. 点右侧<kbd>New SSH key</kbd>。
5. Title填写该密钥的名字（通过该名字来区分密钥，因为添加后是看不到公钥内容的）。
6. Key type保持默认的`Authentication Key`就好。
7. Key填写公钥的内容，即xxx.pub里面的。
8. 最后点<kbd>Add SSH key</kbd>即可。

> 参考：<https://docs.github.com/zh/authentication/connecting-to-github-with-ssh/adding-a-new-ssh-key-to-your-github-account>

## 连接GitLab
1. 登录GitLab。
2. 点右上角的头像，选择`编辑个人资料`。
3. 点左侧`SSH密钥`。
4. 密钥填写公钥的内容，即xxx.pub里面的。
5. 标题填写该密钥的名字（通过该名字来区分密钥，因为添加后是看不到公钥内容的）。
6. 到期时间如果不选，则会一直有效。
7. 最后点<kbd>添加密钥</kbd>即可。

> 参考：<https://docs.gitlab.com/ee/user/ssh.html#add-an-ssh-key-to-your-gitlab-account>
