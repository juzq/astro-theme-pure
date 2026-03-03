---
title: Clash规则配置
publishDate: 2026-01-03
description: 'Clash是目前常用的跨平台代理工具'
tags:
  - Clash
---

## 配置方法
以Clash Verge为例

<kbd>订阅</kbd>->选择配置->右键-编辑规则-><kbd>高级</kbd>->输入规则-><kbd>保存</kbd>

## 规则说明
* DOMAIN: 精确匹配域名
* DOMAIN-SUFFIX: 匹配域名后缀

## 规则内容
```
# 前置
prepend:
  - 'DOMAIN-SUFFIX,doubleclick.net,REJECT'         # 谷歌的广告展示
  - 'DOMAIN-SUFFIX,googleadservices.com,REJECT'    # 谷歌的广告追踪
  - 'DOMAIN-SUFFIX,google-analytics.com,REJECT'    # 谷歌的数据分析
  - 'DOMAIN-SUFFIX,googletagmanager.com,REJECT'    # 谷歌跟踪标记
  - 'DOMAIN,nexus-websocket-a.intercom.io,REJECT'  # Clash Rerge 一直在连接
  - 'DOMAIN,cdp.cloud.unity3d.com,REJECT'          # Unity的数据分析
  - 'DOMAIN,arc.msn.com,REJECT'                    # 微软壁纸服务
  - 'DOMAIN-SUFFIX,mmstat.com,REJECT'              # 阿里的数据统计
  - 'DOMAIN,dcg.microsoft.com,DIRECT'              # Windows连接到手机的地址
# 后置
append:
  - 'DOMAIN-SUFFIX,google.com,PROXY'               # 谷歌主站
  - 'DOMAIN-SUFFIX,google.com.hk,PROXY'            # 谷歌香港
  - 'DOMAIN-SUFFIX,gstatic.com,PROXY'              # 谷歌静态资源
  - 'DOMAIN-SUFFIX,googleusercontent.com,PROXY'    # 谷歌用户内容
  - 'DOMAIN-SUFFIX,googleapis.com,PROXY'           # 谷歌api
  - 'DOMAIN-SUFFIX,ggpht.com,PROXY'                # 谷歌图片资源
  - 'DOMAIN-SUFFIX,youtube.com,PROXY'              # youtube主站
  - 'DOMAIN-SUFFIX,i.ytimg.com,PROXY'              # youtube静态资源
  - 'DOMAIN-SUFFIX,googlevideo.com,PROXY'          # youtube视频
  - 'DOMAIN-SUFFIX,glasp.co,PROXY'                 # youtube summary
  - 'DOMAIN-SUFFIX,chatgpt.com,PROXY'              # chatgpt主站
  - 'DOMAIN-SUFFIX,openai.com,PROXY'               # chatgpt原地址
  - 'DOMAIN-SUFFIX,oaistatic.com,PROXY'            # chatgpt静态资源
  - 'DOMAIN-SUFFIX,microsoft.com,PROXY'            # 微软主站
  - 'DOMAIN-SUFFIX,static.microsoft,PROXY'         # 微软静态资源
  - 'DOMAIN-SUFFIX,live.com,PROXY'                 # 微软邮箱服务
  - 'DOMAIN-SUFFIX,msecnd.net,PROXY'               # 微软VS Code插件服务
  - 'DOMAIN-SUFFIX,github.com,PROXY'               # Github
  - 'DOMAIN-SUFFIX,github.io,PROXY'                # Github IO
  - 'DOMAIN-SUFFIX,githubassets.com,PROXY'         # Github资产
  - 'DOMAIN-SUFFIX,githubusercontent.com,PROXY'    # Github用户内容
  - 'DOMAIN-SUFFIX,cloudflare.com,PROXY'           # Cloudflare
  - 'DOMAIN-SUFFIX,x.com,PROXY'                    # X
  - 'DOMAIN-SUFFIX,twimg.com,PROXY'                # X静态资源
  - 'DOMAIN-SUFFIX,twitter.com,PROXY'              # X原域名
  - 'DOMAIN-SUFFIX,t.co,PROXY'                     #X短域名
  - 'DOMAIN-SUFFIX,wikipedia.org,PROXY'            # 维基百科
  - 'DOMAIN-SUFFIX,wikimedia.org,PROXY'            # 维基媒体
  - 'DOMAIN-SUFFIX,reddit.com,PROXY'               # reddit
  - 'DOMAIN-SUFFIX,redditstatic.com,PROXY'         # reddit静态资源
  - 'DOMAIN-SUFFIX,redditmedia.com,PROXY'          # reddit媒体
  - 'DOMAIN-SUFFIX,redd.it,PROXY'                  # reddit短域名
  - 'DOMAIN-SUFFIX,instagram.com,PROXY'            # instagram
  - 'DOMAIN-SUFFIX,cdninstagram.com,PROXY'         # instagram
  - 'DOMAIN-SUFFIX,facebook.com,PROXY'             # instagram
  - 'DOMAIN,store.steampowered.com,PROXY'          # steam商店
  - 'DOMAIN-SUFFIX,mega.io,PROXY'                  # mega
  - 'DOMAIN-SUFFIX,mega.nz,PROXY'                  # mega
  - 'DOMAIN-SUFFIX,hostr.co,PROXY'                 # hostr
  - 'DOMAIN-SUFFIX,dropbox.com,PROXY'              # dropbox
  - 'DOMAIN-SUFFIX,vercel.app,PROXY'               # vercel
  - 'DOMAIN,cdn.jsdelivr.net,PROXY'                # jsdelivr
delete: []
```