---
title: 创建https证书
publishDate: 2025-12-28
description: '在Linux上创建证书以用作https访问'
tags:
  - 证书
---

## 解析域名
`ping 域名` 

确保域名解析到了到了正确的ip

## 关闭监听端口
Let's Encrypt 的 Standalone 模式需要占用 80 或 443 端口来验证域名所有权。

停止web服务，例如xray

`systemctl stop xray`

## 申请证书
`certbot certonly --standalone -d 域名`

证书位置： 申请成功后，证书通常存放在 /etc/letsencrypt/live/新域名.com/ 目录下。

fullchain.pem (对应 Xray 的 certificateFile)

privkey.pem (对应 Xray 的 keyFile)

## 修改证书权限

web应用往往不是用root用户来启动的，因此需要修改证书权限，例如xray通常使用nobody用户来启动。

```
# 给 archive 目录递归权限（真正存文件的地方）
chown -R nobody:nogroup /etc/letsencrypt/archive/

# 给 live 目录权限（存放快捷方式的地方）
chown -R nobody:nogroup /etc/letsencrypt/live/
```

## 修改web服务器的证书配置

### xray
修改xray配置`/usr/local/etc/xray/config.json`
```
"tlsSettings": {
    "serverName": "新域名", 
    "certificates": [
        {
            "certificateFile": "/etc/letsencrypt/live/新域名/fullchain.pem",
            "keyFile": "/etc/letsencrypt/live/新域名/privkey.pem"
        }
    ]
}
```
修改完成后，启动xray：`systemctl start xray`

## 自动续期
创建脚本到文件：`/etc/xray/scripts/renew-hook.sh`
```
#!/bin/bash

# 修正证书目录权限，确保 nobody 用户能读取
# 注意：必须同时给 archive 和 live 目录权限，因为 live 下是软链接
chown -R nobody:nogroup /etc/letsencrypt/archive/
chown -R nobody:nogroup /etc/letsencrypt/live/

# 获取当前时间，格式如：2023-10-27 10:30:00
CUR_TIME=$(date "+%Y-%m-%d %H:%M:%S")
LOG_FILE="/var/log/xray-renew.log"

echo "[$CUR_TIME] 证书已成功更新并应用到 Xray" >> $LOG_FILE
```

添加运行权限：`chmod +x /etc/xray/scripts/renew-hook.sh`

执行更新命令
```
certbot renew \
--pre-hook "systemctl stop xray" \
--post-hook "systemctl start xray" \
--deploy-hook "/etc/xray/scripts/renew-hook.sh"
```

* 若机器上有多个证书，可以添加`--cert-name 域名`来指定更新域名。
* 若证书剩余30天以上，不会执行更新操作，也不会运行pre/post的hook，如果要强制运行，可以添加参数`--dry-run`来测试。
* 即使加了`--dry-run`，也不会运行`--deploy-hook`，只有真实更新证书时才会运行，因此建议手动运行一次`renew-hook.sh`来测试。

### 查看自动运行记录

`journalctl -u certbot.service -n 10 --no-page`