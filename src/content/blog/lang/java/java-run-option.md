---
title: Java启动参数
publishDate: 2015-04-21
description: Java常用的启动参数说明
tags:
  - java
---

## 堆内存

`-Xms、-Xmx、-Xmn`

分别代表堆内存大小（初始、最大、年轻代）

例：-Xms1M -Xmx2M -Xmn 512K

## 栈内存

`-Xss`

虚拟机栈内存大小

例：-Xss2M

## 新生代中Eden和Survivor的比例

`-XX:SurvivorRatio`

**新生代（Young Generation）** 被划分为
- **1个 Eden 区**：新对象分配的主要区域
- **2个 Survivor 区**（From 和 To）：存放存活下来的对象

Eden区与Survivor区（单个）的比例

例：-XX:SurvivorRatio=8，代表Eden占8/10，每个Survivor占1/10

## 垃圾回收

### G1GC
`-XX:+UseG1GC`
JDK 9以后的默认GC，特点：
- 支持广泛，从JDK7开始就支持。
- 停顿时间可控，可通过`-XX:MaxGCPauseMillis` 设置目标。
- 堆内存在16GB以下有较好表现。
- 开销较低，对CPU与内存的影响均不大。
### ZGC
`-XX:+UseZGC`
从JDK15以后开始支持，特点：
- 极短的停顿时间（10ms以下）。
- 对堆内存在16GB-16TB支持较好，停顿时间无明显增加。
- 对CPU和内存的占用较多，约需要额外10%-15%
### **核心机制对比**

| 对比 维度     | G1GC                                                                                                                                                                          | ZGC                                                                                                                                                                                                                             |
| --------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **设计目标**  | 在提供**可预测的停顿时间**的同时，兼顾**高吞吐量**。它是一个“大部分并发”的收集器[](https://docs.oracle.com/en/java/javase/21/gctuning/available-collectors.html)。                                                | 致力于将垃圾回收的**停顿时间控制在极低水平**（官方目标是<1ms，实践中通常<10ms），且该时间**与堆大小无关**[](https://developer.unity.cn/projects/68454cbbedbc2aa181664f2c)[](https://docs.oracle.com/en/java/javase/21/gctuning/available-collectors.html)。                  |
| **核心技术**  | **Region（分区）**：将堆内存划分为多个大小相同的Region，每个Region可以动态扮演Eden、Survivor或老年代角色，有效避免了内存碎片[](https://coolshell.cn/articles/1252.html#more-1252)[](https://www.ucloud.cn/yun/77310.html)。 | **着色指针**与**读屏障**：通过在指针中标记状态，并结合读屏障技术，实现了垃圾回收的**几乎所有阶段都能与应用线程并发执行**，从而大幅减少停顿[](https://developer.aliyun.com/article/1684886)[](https://www.ucloud.cn/yun/77310.html)。                                                            |
| **内存整理**  | 通过**复制算法**（Evacuation）在暂停时进行内存整理，消除碎片[](https://coolshell.cn/articles/1252.html#more-1252)[](https://cloud.tencent.cn/developer/article/2145141)。                             | 支持**并发重分配**，能在应用运行的同时整理内存，彻底解决了因内存整理导致的长时间停顿[](https://developer.unity.cn/projects/68454cbbedbc2aa181664f2c)。                                                                                                                   |
| **堆内存结构** | 逻辑上分代（年轻代、老年代），但物理上是一系列不连续的Region[](https://coolshell.cn/articles/1252.html#more-1252)[](https://www.ucloud.cn/yun/77310.html)。                                               | 从非分代演进到**分代**（JDK 21及以后通过 `-XX:+ZGenerational` 启用），以降低CPU开销并减少对吞吐量的影响[](https://www.conduktor.io/blog/kafka-jvm-tuning-g1gc-vs-zgc-production)[](https://docs.oracle.com/en/java/javase/21/gctuning/available-collectors.html)。 |

## 内存追踪

`-XX:NativeMemoryTracking=summary`

参数可选值

| 值           | 说明                   |
| ----------- | -------------------- |
| **off**     | 关闭 NMT（默认值）          |
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
