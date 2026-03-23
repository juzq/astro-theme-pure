# 工具集

本页面包含多种实用工具，方便开发时快速使用。

## 当前功能

### 1. 字符串格式化

支持以下格式的格式化和美化：

- **JSON**: 格式化 JSON 文本，自动添加缩进和换行
- **XML**: 格式化 XML 文本，自动添加缩进和换行
- **Protobuf**: 格式化 Protobuf日志，只保留日志中的消息内容

### 使用方法

1. 在顶部选择要格式化的文本类型
2. 在搜索框中输入关键词（可选），将高亮显示匹配的文本，显示匹配序号，回车跳转到下一处
3. 在文本框中粘贴或输入要格式化的文本
4. 点击"格式化"按钮进行格式化
5. 点击"清空"按钮清空所有内容

### 字符串格式化详解

#### JSON 格式化

- 自动检测并解析 JSON
- 添加缩进和换行
- 错误提示

#### XML 格式化

- 使用 DOMParser 解析 XML
- 自动添加缩进和换行
- 保留注释和结构

#### Protobuf日志 格式化

- 正确处理缩进
- 移除额外日志内容

### 搜索功能

- 在搜索框输入文字
- 自动高亮所有匹配项
- 显示当前匹配项序号（如 "3 / 10"）
- 输入回车键跳转到下一个匹配项
- 循环匹配（最后一个匹配项后回到第一个）
- 匹配时不区分大小写

### 测试用例

#### JSON 测试

```json
{ "name": "test", "value": 123, "items": ["a", "b", "c"] }
```

#### XML 测试

```xml
<root><child><name>test</name><value>123</value></child></root>
```

#### Protobuf日志 测试

```
16:21:59.252 DEBUG PUSH: Player-36028930895301130 SCAssetUpdate -> award { asset { sid: 2 num: 2 } asset { sid: 3 num: 2 } asset { sid: 1 num: 2 } } reason: "ItemReason(desc=内城资源产出, paramList=[])" source: AS_CITY_BUILDING_OUTPUT buildingResourceUpdate { infos { buildingSid: 70001 resourceSid: 1 resourceNum: 3244 } infos { buildingSid: 70001 resourceSid: 2 resourceNum: 3244 } infos { buildingSid: 70001 resourceSid: 3 resourceNum: 3844 } } | message_logger.$anonfun$applyOrElse$4(Slf4jLogger.scala:103)[mc-Nebula-akka.actor.logger-dispatcher-775]
```

**格式化后结果：**

```protobuf
award {
    asset {
        sid: 2
        num: 2
    }
    asset {
        sid: 3
        num: 2
    }
    asset {
        sid: 1
        num: 2
    }
}
reason: "ItemReason(desc=内城资源产出, paramList=[])
source: AS_CITY_BUILDING_OUTPUT
buildingResourceUpdate {
    infos {
        buildingSid: 70001
        resourceSid: 1
        resourceNum: 3244
    }
    infos {
        buildingSid: 70001
        resourceSid: 2
        resourceNum: 3244
    }
    infos {
        buildingSid: 70001
        resourceSid: 3
        resourceNum: 3844
    }
}
```

注意：->之前的内容和 | 之后的内容被自动过滤掉了。

## 未来计划

- URL 编码/解码工具
- Base64 编码/解码工具
- MD5/SHA 哈希计算工具
- 日期时间转换工具
