---
title: Java启动参数
publishDate: 2015-04-21
description: Java常用的启动参数说明
tags:
  - java
---

## 内存配置

### 堆内存

`-Xms、-Xmx、-Xmn`

分别代表堆内存大小（初始、最大、年轻代）

例：`-Xms1M -Xmx2M -Xmn 512K`

### 栈内存

`-Xss`

虚拟机栈内存大小，每个线程的栈大小

例：`-Xss2M`

**默认值**：

- HotSpot: 1MB
- OpenJ9: 256KB

### 新生代配置

**Eden和Survivor比例**

`-XX:SurvivorRatio`

新生代（Young Generation）被划分为：

- **1个 Eden 区**：新对象分配的主要区域
- **2个 Survivor 区**（From 和 To）：存放存活下来的对象

Eden区与Survivor区（单个）的比例

例：`-XX:SurvivorRatio=8`，代表Eden占8/10，每个Survivor占1/10

**Eden区大小**

`-XX:NewRatio`

新生代与老年代的比例

例：`-XX:NewRatio=2`，代表新生代占1/3，老年代占2/3

**最大年轻代大小**

`-XX:MaxNewSize`

限制年轻代最大值

例：`-XX:MaxNewSize=1G`

### 元空间配置

`-XX:MetaspaceSize`：元空间初始大小

`-XX:MaxMetaspaceSize`：元空间最大大小

**警告**：元空间默认无上限，建议设置限制

## 垃圾回收

### G1GC

`-XX:+UseG1GC`

JDK 9以后的默认GC，特点：

- 支持广泛，从JDK7开始就支持
- 停顿时间可控，可通过`-XX:MaxGCPauseMillis`设置目标
- 堆内存在16GB以下有较好表现
- 开销较低，对CPU与内存的影响均不大

**常用调优参数**

```bash
# 设置最大停顿时间目标（毫秒）
-XX:MaxGCPauseMillis=200

# 并发GC线程数（设置为CPU核心数的3/4）
-XX:ConcGCThreads=4

# GC线程数（设置为CPU核心数）
-XX:ParallelGCThreads=4

# 最大Region大小（1MB-32MB）
-XX:G1HeapRegionSize=16m
```

### ZGC

`-XX:+UseZGC`

从JDK15以后开始支持，特点：

- 极短的停顿时间（10ms以下）
- 对堆内存在16GB-16TB支持较好，停顿时间无明显增加
- 对CPU和内存的占用较多，约需要额外10%-15%

**常用调优参数**

```bash
# 启用分代ZGC（JDK 21+）
-XX:+ZGenerational

# 并发标记线程数
-XX:ZMarkingThreads=4

# 并发转储线程数
-XX:ZUncommitThreads=2
```

### **核心机制对比**

| 对比 维度      | G1GC                                                                                                                                                                                                                        | ZGC                                                                                                                                                                                                                                                                |
| -------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **设计目标**   | 在提供**可预测的停顿时间**的同时，兼顾**高吞吐量**。它是一个"大部分并发"的收集器[](https://docs.oracle.com/en/java/javase/21/gctuning/available-collectors.html)。                                                          | 致力于将垃圾回收的**停顿时间控制在极低水平**（官方目标是<1ms，实践中通常<10ms），且该时间**与堆大小无关**[](https://developer.unity.cn/projects/68454cbbedbc2aa181664f2c)[](https://docs.oracle.com/en/java/javase/21/gctuning/available-collectors.html)。        |
| **核心技术**   | **Region（分区）**：将堆内存划分为多个大小相同的Region，每个Region可以动态扮演Eden、Survivor或老年代角色，有效避免了内存碎片[](https://coolshell.cn/articles/1252.html#more-1252)[](https://www.ucloud.cn/yun/77310.html)。 | **着色指针**与**读屏障**：通过在指针中标记状态，并结合读屏障技术，实现了垃圾回收的**几乎所有阶段都能与应用线程并发执行**，从而大幅减少停顿[](https://developer.aliyun.com/article/1684886)[](https://www.ucloud.cn/yun/77310.html)。                               |
| **内存整理**   | 通过**复制算法**（Evacuation）在暂停时进行内存整理，消除碎片[](https://coolshell.cn/articles/1252.html#more-1252)[](https://cloud.tencent.cn/developer/article/2145141)。                                                   | 支持**并发重分配**，能在应用运行的同时整理内存，彻底解决了因内存整理导致的长时间停顿[](https://developer.unity.cn/projects/68454cbbedbc2aa181664f2c)。                                                                                                             |
| **堆内存结构** | 逻辑上分代（年轻代、老年代），但物理上是一系列不连续的Region[](https://coolshell.cn/articles/1252.html#more-1252)[](https://www.ucloud.cn/yun/77310.html)。                                                                 | 从非分代演进到**分代**（JDK 21及以后通过 `-XX:+ZGenerational` 启用），以降低CPU开销并减少对吞吐量的影响[](https://www.conduktor.io/blog/kafka-jvm-tuning-g1gc-vs-zgc-production)[](https://docs.oracle.com/en/java/javase/21/gctuning/available-collectors.html)。 |

### 其他GC选项

**串行GC**

```bash
# 老年代使用串行收集器
-XX:+UseSerialGC

# 年轻代使用串行收集器
-XX:+UseSerialGC
```

**并行GC**

```bash
# 老年代使用并行收集器（吞吐量优先）
-XX:+UseParallelGC

# 年轻代使用并行收集器
-XX:+UseParallelGC
```

**CMS（已废弃）**

```bash
# 老年代使用CMS收集器
-XX:+UseConcMarkSweepGC
```

## 输出和调试

### 类路径

`-classpath` 或 `-cp`

指定类文件和资源的位置

```bash
# 使用通配符
java -cp lib/*:bin com.example.Main

# 指定多个路径
java -cp "lib:/usr/share/java" com.example.Main

# 使用类名
java -cp .:lib/compression.jar com.example.Main
```

### 调试参数

**调试支持**

```bash
# 启用调试模式（JDB）
-javaagent

# 调试端口
-jar

# 调试参数
-jar

# 调试参数示例
# -Xdebug -Xrunjdwp:transport=dt_socket,server=y,suspend=n,address=5005
```

**详细输出**

```bash
# 启用详细GC输出
-verbose:gc

# 启用类加载详细信息
-verbose:class

# 启用JIT编译详细信息
-verbose:jit

# 输出类加载器层次结构
-verbose:class
```

**符号表**

```bash
# 生成符号表
-XX:+PrintGCDetails
-XX:+PrintGCTimeStamps
-XX:+PrintGCApplicationStoppedTime
-XX:+PrintGCApplicationConcurrentTime
```

## 性能优化

### JIT编译器

**自适应策略**

```bash
# 开启自适应字符串去重（JDK 12+）
-XX:+UseStringDeduplication

# 启用编译自适应策略
-XX:+UseAdaptiveSizePolicy

# JIT编译线程数
-XX:CICompilerCount=2
```

**逃逸分析**

```bash
# 启用逃逸分析（JDK 11+）
-XX:+DoEscapeAnalysis

# 启用标量替换
-XX:+EliminateAllocations

# 启用循环展开
-XX:+UseLoopUnswitching
```

### 字符串优化

```bash
# 启用字符串驻留（JDK 6u23+）
-XX:+StringInterning

# 字符串去重（JDK 12+）
-XX:+UseStringDeduplication

# 去重阈值（字节数）
-XX:StringDeduplicationAgeThreshold=3
```

### 并行优化

```bash
# 启用并行类加载
-XX:+UseParallelClassLoading

# 字节码缓存大小
-XX:ReservedCodeCacheSize=256m
```

## 内存追踪

`-XX:NativeMemoryTracking=summary`

参数可选值

| 值          | 说明                                     |
| ----------- | ---------------------------------------- |
| **off**     | 关闭 NMT（默认值）                       |
| **summary** | 只收集摘要级别的内存信息（不包含调用栈） |
| **detail**  | 收集详细信息（包含调用栈，性能开销更大） |

开启后可使用jcmd命令查看内存使用情况

```bash
# 查看当前内存使用
jcmd <pid> VM.native_memory
# 查看基线对比（需要先创建基线）
jcmd <pid> VM.native_memory baseline
jcmd <pid> VM.native_memory summary.diff
# 查看详细信息
jcmd <pid> VM.native_memory detail
```

## 系统属性

### 标准系统属性

```bash
# JVM版本
java -version

# Java家路径
java.home

# 用户目录
user.dir

# 临时目录
java.io.tmpdir

# 文件编码
file.encoding=UTF-8

# 字符集
file.separator=/
```

### 自定义系统属性

```bash
# 设置系统属性
-Dproperty.name=value

# 使用Java配置文件
-Djava.security.auth.login.config=/path/to/login.config

# 调整日志级别
-Djava.util.logging.config.file=/path/to/logging.properties
```

## 安全选项

### 字节码验证

```bash
# 启用字节码验证
-verify

# 启用保守的字节码验证
-verifyremote

# 自定义验证器
-Xverify:all
```

### 内存安全

```bash
# 设置最大堆内存
-Xmx2g

# 设置初始堆内存
-Xms1g

# 禁用压缩指针（JDK 32-bit）
-XX:-UseCompressedOops
```

## 常用启动脚本

### 开发环境

```bash
# 开发环境启动脚本
java -Xms512m -Xmx1g \
  -XX:SurvivorRatio=8 \
  -XX:+UseStringDeduplication \
  -XX:+UseG1GC \
  -XX:MaxGCPauseMillis=200 \
  -Xlog:gc*:file=gc.log \
  -cp "lib/*:bin" \
  com.example.Main
```

### 生产环境

```bash
# 生产环境启动脚本
java -Xms1g -Xmx2g \
  -XX:SurvivorRatio=8 \
  -XX:MaxMetaspaceSize=512m \
  -XX:+UseStringDeduplication \
  -XX:+UseG1GC \
  -XX:MaxGCPauseMillis=200 \
  -XX:ConcGCThreads=4 \
  -XX:ParallelGCThreads=8 \
  -XX:MaxInlineSize=35 \
  -XX:ReservedCodeCacheSize=256m \
  -Dfile.encoding=UTF-8 \
  -Duser.timezone=Asia/Shanghai \
  -XX:+HeapDumpOnOutOfMemoryError \
  -XX:HeapDumpPath=/var/log/heapdump.hprof \
  -Xlog:gc*:file=/var/log/gc.log:time,tags:filecount=10,filesize=100m \
  -cp "lib/*" \
  com.example.Main
```

### 调试环境

```bash
# 调试环境启动脚本
java -agentlib:jdwp=transport=dt_socket,server=y,suspend=n,address=5005 \
  -Xms512m -Xmx1g \
  -Xdebug -Xrunjdwp \
  -Xlog:gc*:file=gc_debug.log:time,tags \
  -XX:+PrintGCDetails \
  -XX:+PrintGCTimeStamps \
  -cp "lib/*:bin" \
  com.example.Main
```

## 常见问题

### 内存溢出

**OOM错误处理**

```bash
# 启用堆转储
-XX:+HeapDumpOnOutOfMemoryError
-XX:HeapDumpPath=/var/log/heapdump.hprof

# 生成堆转储
jmap -dump:format=b,file=heapdump.hprof <pid>

# 分析堆转储
jhat heapdump.hprof
```

### 内存泄漏

**使用MAT分析**

```bash
# 下载MAT工具
# 运行分析
# 加载堆转储文件
# 查看内存泄漏报告
```

### 性能分析

**使用jcmd**

```bash
# 查看JVM线程
jcmd <pid> Thread.print

# 查看类加载信息
jcmd <pid> GC.class_stats

# 查看编译信息
jcmd <pid> Compiler.compilethreads
```

**使用VisualVM**

```bash
# 启动VisualVM
# 监控JVM性能
# 分析内存使用
# 查看线程状态
```

## 最佳实践

### 内存配置原则

1. **堆内存设置**
   - Xms 和 Xmx 设置相同值，避免动态调整
   - 根据应用实际需求调整，留出20-30%余量

2. **GC选择**
   - 单机应用：G1GC
   - 超大内存（>16GB）：ZGC
   - 吞吐量优先：ParallelGC
   - 简单应用：SerialGC

3. **避免过早优化**
   - 先启用默认配置
   - 使用性能分析工具识别瓶颈
   - 针对性优化

### 日志配置

1. **GC日志**
   - 使用-Xlog（JDK 9+）或-verbose:gc
   - 设置合适的日志级别
   - 定期分析GC日志

2. **应用日志**
   - 配置合理的日志级别
   - 使用结构化日志格式
   - 避免日志过多影响性能

## 参考资源

- [Oracle JVM 官方文档](https://docs.oracle.com/en/java/javase/21/gctuning/)
- [OpenJDK 源代码](https://openjdk.org/)
- [Java Performance Tuning](https://www.oracle.com/java/technologies/javase/vmoptions-jsp.html)
- [GCViewer 工具](https://github.com/chewiebug/GCViewer)
