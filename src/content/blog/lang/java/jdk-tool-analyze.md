---
title: 使用JDK自带工具解决线上Java程序问题
publishDate: 2018-02-26
description: JDK自带了许多工具来对java进程进行分析，从基础工具到进阶工具的完整指南
tags:
  - java
  - 性能分析
  - 调试工具
---

# 问题背景

我们有时会在线上生产环境（正式服务器）遇到测试服很难碰到的问题，例如内存泄漏、GC过于频繁、线程死锁、CPU占用过高等问题。因为该类问题需要一定数量的用户基数或特定条件，因此很难在测试服遇到。

正式服一般没有 debug 日志，也无法打断点，无法像在测试服一样进行常规问题的排查。但 JDK 为我们提供了很多排查该类问题的工具。熟练使用这些工具，能帮助我们快速解决上述问题，同时也是 Java 进阶必备能力。

# 常用JDK自带工具

## jinfo

显示 JVM 的详细信息，可以查看和修改运行时参数

**用法**：

连接到正在运行的进程：`jinfo [option] <pid>`

连接到一个核心文件：`jinfo [option] <executable <core>`

连接到远程调试服务器：`jinfo [option] [server_id@]<remote server IP or hostname>`

**参数介绍**：

```
-flag <name> 打印指定变量名的虚拟机参数
-flag [+|-]<name> 启用或禁用指定变量名的虚拟机参数
-flag <name>=<value> 设置虚拟机的特定参数
-flags 打印虚拟机参数
-sysprops 打印Java系统属性
<无参数> 打印虚拟机参数和Java系统属性
-h | -help 显示帮助
```

**常用示例**：

```bash
# 查看所有 JVM 参数
jinfo <pid>

# 查看特定参数
jinfo -flag MaxHeapSize <pid>

# 启用特定参数
jinfo -flag +PrintGCDetails <pid>

# 设置特定参数
jinfo -flag:MaxPermSize=512m <pid>
```

## jmap

获得运行中的 JVM 的堆的快照，从而可以离线分析堆，以检查内存泄漏，检查一些严重影响性能的大对象的创建，检查系统中什么对象最多，各种对象所占内存的大小等等

**用法**：

连接到正在运行的进程：`jmap [option] <pid>`

连接到一个核心文件：`jmap [option] <executable <core>`

连接到远程调试服务器：`jmap [option] [server_id@]<remote server IP or hostname>`

**参数介绍**：

```
<无参数> 打印与Solaris pmap相同的信息
-heap 打印Java堆的汇总信息
-histo[:live] 打印java堆对象的柱状图；如果有"live"子选项，类加载统计只打印指定数量的活跃对象
-clstats 打印类加载统计
-finalizerinfo 打印等待终止的对象
-dump:<dump-options> 生成hprof二进制格式的java堆快照，栗子：jmap -dump:live,format=b,file=heap.bin <pid>
	快照选项：
	live 只快照活跃对象，如果该参数没有被指定，堆中所有对象都会被快照
	format=b 二进制格式
-F 强制执行，与-dump或-histo一起使用，来强制执行，当进程未响应的时候。此时"live"子选项无效。
-h | -help 显示帮助
-J<flag> 传递参数给运行时系统
```

**常用示例**：

```bash
# 查看堆内存使用情况
jmap -heap <pid>

# 查看对象统计（只统计活跃对象）
jmap -histo:live <pid>

# 查看所有对象统计
jmap -histo <pid>

# 导出堆转储文件
jmap -dump:live,format=b,file=heap.bin <pid>
```

## jps

jps (Java Virtual Machine Process Status Tool) 是 JDK 1.5 提供的一个显示当前所有 java 进程 pid 的命令，可以显示主机中运行的 java 进程，与 bash 命令 `ps -ef | grep java` 很类似

**用法**：

`jps [-q] [-mlvV] [<hostid>]`

**参数介绍**：

```
-q 安静模式，只显示进程id
-m 输出传递给main方法的参数
-l 输出启动类的完整类名
-v 输出传递给JVM的参数
-V 输出通过flag文件传递给JVM的参数
```

**常用示例**：

```bash
# 显示所有 Java 进程
jps

# 显示完整类名和参数
jps -lv

# 只显示进程ID
jps -q
```

## jstack

输出指定 Java 进程的线程堆栈信息

**用法**：

连接到正在运行的进程：`jstack [-l] <pid>`

连接到被挂起的进程：`jstack -F [-m] [-l] <pid>`

连接到一个核心文件：`jstack [-m] [-l] <executable> <core>`

连接到远程调试服务器：`jstack [-m] [-l] [server_id@]<remote server IP or hostname>`

**参数介绍**：

```
-l 输出同步锁信息
-m 检测死锁并输出线程的栈信息
```

**常用示例**：

```bash
# 查看线程堆栈
jstack <pid>

# 查看线程堆栈（包含锁信息）
jstack -l <pid>

# 查看线程堆栈（包含本地方法）
jstack -m <pid>

# 查看线程堆栈（本地方法 + 锁信息）
jstack -m -l <pid>

# 强制转储（进程无响应时）
jstack -F <pid>
```

## jstat

对 java 进程的资源和性能进行实时的监控，包括了对该进程的 classloader、compiler、gc 情况。也可以监视虚拟机内存内的堆和非堆的大小及其内存使用量，以及加载类的数量

**用法**：

`jstat -<option> [-t] [-h<lines>] <vmid> [<interval> [<count>]]`

**参数介绍**：

```
<option> 选项，使用jstat --options可以查看可用的选项列表，如下：
	class：统计classloader的行为
	compiler：统计hotspot just-in-time编译器的行为
	gc：统计gc行为
	gccapacity：统计堆中代的容量、空间
	gccause：垃圾收集统计，包括最近引用垃圾收集的事件，基本同gcutil，比gcutil多了两列
	gcnew：统计新生代的行为
	gcnewcapacity：统计新生代的大小和空间
	gcold：统计旧生代的行为
	gcoldcapacity：统计旧生代的大小和空间
	gcpermcapacity：统计永久代的大小和空间
	gcutil：垃圾收集统计
	printcompilation：hotspot编译方法统计
-t 额外显示时间戳
<vmid> 虚拟机id
-h<lines> 每n次采样，显示标题一次
<interval> 采样间隔，以"ms"结尾代表毫秒，以"s"结尾代表秒，默认为毫秒
<count> 统计次数次数
```

**常用示例**：

```bash
# 每 1 秒统计一次 GC 信息
jstat -gc <pid> 1000

# 显示时间戳
jstat -t -gc <pid> 1000

# 查看原因
jstat -gccause <pid> 1000

# 查看新生代统计
jstat -gcnew <pid> 1000

# 查看堆容量
jstat -gccapacity <pid> 1000
```

# 进阶 JDK 工具

## jcmd

jcmd 是 JDK 8 引入的通用诊断命令行工具，集成了 jps、jstat、jmap、jstack 等工具的功能。通过 jcmd 可以执行多种诊断操作，是 Java 8+ 推荐的诊断工具

**用法**：

`jcmd [pid|mainclass] [command] [args...]`

**常用命令**：

### 1. 查看 JVM 信息

```bash
# 查看所有支持的命令
jcmd <pid> help

# 查看 JVM 堆信息
jcmd <pid> GC.heap_info

# 查看系统属性
jcmd <pid> VM.system_properties

# 查看虚拟机参数
jcmd <pid> VM.flags

# 查看编译统计
jcmd <pid> Compiler.code_heap_info
```

### 2. GC 相关命令

```bash
# 打印堆统计信息
jcmd <pid> GC.heap_info

# 执行一次 Full GC
jcmd <pid> GC.run

# 打印类加载统计
jcmd <pid> GC.classloader

# 查看垃圾收集器统计
jcmd <pid> GC.gc_info
```

### 3. 线程相关命令

```bash
# 打印线程堆栈
jcmd <pid> Thread.print

# 打印线程堆栈（详细）
jcmd <pid> Thread.print -l

# 生成线程 dump
jcmd <pid> Thread.dump_to_file -format=json -dir /tmp /tmp/thread-dump.json
```

### 4. JFR 相关命令

```bash
# 列出 JFR 录制
jcmd <pid> JFR.request

# 开始录制
jcmd <pid> JFR.start name=recording duration=60s filename=/tmp/recording.jfr

# 停止录制
jcmd <pid> JFR.stop name=recording

# 查看录制文件
jcmd <pid> JFR.print name=recording filename=/tmp/recording.jfr
```

**jcmd 优势**：

- 统一的命令行接口
- 支持交互式命令
- 功能丰富，覆盖多种诊断场景
- 比 jstack 等工具更强大和灵活

## VisualVM

VisualVM 是 Oracle 推出的免费性能监控和故障诊断工具，集成了多种 JDK 监控功能。它提供直观的图形界面，支持堆转储分析、线程分析、性能监控等

**功能特性**：

### 1. 实时监控

- 内存使用情况（堆内存、非堆内存）
- GC 行为和统计
- 线程状态和活动
- 类加载情况
- CPU 使用率

### 2. 堆转储分析

- 可视化堆对象分布
- 找出占用内存最多的对象
- 分析对象引用关系
- 识别内存泄漏

### 3. 线程分析

- 查看所有线程
- 分析线程阻塞情况
- 查看死锁
- 线程堆栈查看

### 4. 插件系统

VisualVM 支持多种插件扩展功能：

- **BTrace**：运行时字节码修改和监控
- **VisualGC**：详细的 GC 信息可视化
- **JFR Viewer**：Java Flight Recorder 文件查看

**使用流程**：

```bash
# 启动 VisualVM
visualvm

# 或通过命令行连接
visualvm --openpid <pid>
```

**常用操作**：

1. **堆转储分析**
   - 在 "Snapshot" 节点右键 -> "Heap Dump" -> "Dump Heap"
   - 打开 dump 文件进行分析

2. **线程分析**
   - 在 "Threads" 节点查看所有线程
   - 点击 "Thread Dump" 生成线程转储
   - 查找死锁和阻塞

3. **性能监控**
   - 在 "Overview" 视图查看实时指标
   - 设置阈值告警
   - 导出监控数据

## jconsole

jconsole 是 JDK 自带的图形化监控工具，可以监控本地和远程 JVM 的性能指标

**功能特性**：

### 1. 内存监控

- 堆内存使用情况
- 非堆内存使用情况
- 内存池详细信息
- 对象内存统计

### 2. 线程监控

- 当前线程数
- 活跃线程数
- 线程堆栈
- 死锁检测

### 3. 类加载监控

- 已加载类数量
- 卸载类数量
- 类加载器统计

### 4. MBeans 监控

- Java 管理扩展（JMX）
- 自定义 MBean 监控

**使用方法**：

```bash
# 启动 jconsole
jconsole

# 连接到远程 JVM
jconsole localhost:5005
```

**常用场景**：

- 实时监控 JVM 性能指标
- 查看线程状态和堆栈
- 监控内存使用情况
- 检查类加载情况

## Java Flight Recorder (JFR)

JFR 是 JDK 9 引入的低开销性能分析工具，能够在不显著影响应用性能的情况下收集详细的性能数据

**特点**：

- **低开销**：对应用性能影响小于 1%
- **事件驱动**：可自定义事件收集
- **长时间运行**：支持长时间的记录和分析
- **数据丰富**：包含 GC、类加载、线程、编译等详细信息

**使用方法**：

### 1. 启动 JVM 时启用 JFR

```bash
java -XX:StartFlightRecording=duration=60s,filename=recording.jfr,settings=profile MyApplication
```

### 2. 动态开始录制

```bash
# 开始录制
jcmd <pid> JFR.start name=recording duration=60s filename=/tmp/recording.jfr

# 停止录制
jcmd <pid> JFR.stop name=recording

# 列出录制
jcmd <pid> JFR.request
```

### 3. 使用 JDK Mission Control 分析

```bash
# 启动 JMC
jmc

# 打开 JFR 文件
# File -> Open File -> 选择 recording.jfr
```

**常用配置**：

```bash
# 基础录制
-XX:StartFlightRecording=duration=10s,filename=recording.jfr

# 详细事件
-XX:StartFlightRecording=duration=60s,filename=recording.jfr,settings=profiling

# 记录到文件系统
-XX:StartFlightRecording=duration=60s,filename=/var/log/recording.jfr

# 自定义事件
-XX:StartFlightRecording=duration=60s,filename=recording.jfr,settings=default,jfr.settings=mysettings

# 排除特定事件
-XX:StartFlightRecording=duration=60s,filename=recording.jfr,settings=profile,jfr.event.exclude=gc
```

**JFR vs 其他工具对比**：

| 特性       | JFR        | VisualVM | jstat  |
| ---------- | ---------- | -------- | ------ |
| 开销       | 极低 (<1%) | 较高     | 低     |
| 分析精度   | 高         | 中       | 低     |
| 长时间运行 | 支持       | 不支持   | 不支持 |
| 实时监控   | 不支持     | 支持     | 支持   |
| 事件追溯   | 支持       | 不支持   | 不支持 |

# 线上常见问题的定位与思路

## 频繁GC或内存溢出

**问题特征**：

- 应用响应变慢
- OOM 错误
- GC 日志频繁出现

**分析步骤**：

1. **监控 GC 情况**

   ```bash
   # 查看详细 GC 日志
   jstat -gc <pid> 1000

   # 查看原因
   jstat -gccause <pid> 1000

   # 监控堆内存增长
   jstat -gcutil <pid> 1000
   ```

2. **生成堆转储**

   ```bash
   # 生成堆转储（只包含活跃对象）
   jmap -dump:live,format=b,file=heap.bin <pid>

   # 导出为文件
   jmap -dump:format=b,file=/tmp/heap.hprof <pid>
   ```

3. **分析堆转储**
   - 使用 Eclipse Memory Analyzer (MAT)
   - 使用 VisualVM 的 Heap Dump 分析
   - 使用 jhat

4. **定位问题**
   - 查找大对象
   - 检查对象引用关系
   - 找出内存泄漏点

**示例分析流程**：

```bash
# 1. 持续监控
while true; do jstat -gcutil <pid> 1000; sleep 1; done

# 2. 发现内存持续增长
# 3. 生成堆转储
jmap -dump:live,format=b,file=/tmp/heap.bin <pid>

# 4. 使用 MAT 分析
mat /tmp/heap.bin

# 5. 查看 Dominator Tree
# 找到占用内存最多的对象

# 6. 检查对象引用
# 分析对象的引用关系

# 7. 定位代码问题
# 检查代码中创建大量对象的地方
```

## 线程死锁问题

**问题特征**：

- 应用卡住
- 响应缓慢
- 线程状态分析显示线程阻塞

**分析步骤**：

1. **检查线程状态**

   ```bash
   # 查看线程堆栈
   jstack <pid> > thread_dump.txt

   # 查看线程堆栈（包含锁信息）
   jstack -l <pid> > thread_dump_with_locks.txt
   ```

2. **分析线程转储**
   - 查找 `BLOCKED` 状态的线程
   - 查找等待锁的线程
   - 分析锁的持有和等待关系

3. **检测死锁**
   ```bash
   # 使用 -m 参数自动检测死锁
   jstack -m <pid>
   ```

**死锁示例**：

```
"Thread-1" #10 prio=5 os_prio=0 tid=0x00007f8c8c0a5100 nid=0x4b03 runnable [0x000070000e2ff000]
   java.lang.Thread.State: RUNNABLE
	at com.example.ResourceA.methodA(ResourceA.java:15)
	- waiting to lock <0x0000000768c233a8> (a java.lang.Object)
	- locked <0x0000000768c23368> (a java.lang.Object)

"Thread-2" #11 prio=5 os_prio=0 tid=0x00007f8c8c0a5000 nid=0x4b02 waiting on condition [0x000070000e3ff000]
   java.lang.Thread.State: WAITING (on object monitor)
	at java.lang.Object.wait(Native Method)
	- waiting on <0x0000000768c233a8> (a java.lang.Object)
	at com.example.ResourceB.methodB(ResourceB.java:20)
	- locked <0x0000000768c233a8> (a java.lang.Object)

Found one Java-level deadlock:
---------------------
Java stack information for the threads listed above:
---------------------
"Thread-1":
        waiting to lock <0x0000000768c233a8> (a java.lang.Object)
        which is held by "Thread-2"
"Thread-2":
        waiting to lock <0x0000000768c23368> (a java.lang.Object)
        which is held by "Thread-1"
```

**解决方案**：

- 优化锁的获取顺序
- 使用锁超时机制
- 使用可中断锁
- 使用更细粒度的锁

## CPU 占用过高

**问题特征**：

- CPU 使用率异常高
- 应用响应缓慢
- 某些方法执行时间过长

**分析步骤**：

1. **查看 CPU 使用率**

   ```bash
   # 查看进程 CPU 使用率
   top -p <pid>

   # 查看线程 CPU 使用率
   top -H -p <pid>

   # 查看特定时间段的 CPU 使用率
   sar -p <pid>
   ```

2. **分析线程状态**

   ```bash
   # 查看线程堆栈
   jstack <pid> > thread_dump.txt

   # 查看包含锁信息的堆栈
   jstack -l <pid> > thread_dump_with_locks.txt
   ```

3. **识别问题线程**
   - 找到占用 CPU 的线程
   - 查看线程堆栈
   - 定位热点方法

4. **生成 CPU profile**

   ```bash
   # 使用 jstack 生成线程转储
   jstack <pid> > thread_dump.txt

   # 使用 BTrace 定位热点
   # （需要配置 BTrace 插件）
   ```

**分析方法**：

```bash
# 1. 找到 CPU 使用率最高的线程
top -H -p <pid>

# 2. 转换线程 ID 为十六进制
printf "%x\n" <thread_id>

# 3. 在线程转储中查找对应线程
grep -A 30 "0x<hex_thread_id>" thread_dump.txt

# 4. 定位热点方法
# 分析线程堆栈中的方法调用

# 5. 优化代码
# 修改热点方法
```

**常见原因**：

- 无限循环
- 复杂算法
- 网络超时等待
- 锁竞争
- 不必要的计算

## 内存泄漏

**问题特征**：

- 内存使用持续增长
- OOM 错误
- 堆转储分析发现对象未被释放

**分析步骤**：

1. **监控内存增长**

   ```bash
   # 持续监控 GC 统计
   while true; do jstat -gc <pid> 1000; sleep 1; done

   # 查看内存池统计
   jstat -gcutil <pid> 1000

   # 查看对象分布
   jmap -histo:live <pid>
   ```

2. **对比堆转储**

   ```bash
   # 生成初始堆转储
   jmap -dump:live,format=b,file=heap_initial.bin <pid>

   # 运行一段时间后再次生成
   sleep 300  # 5分钟
   jmap -dump:live,format=b,file=heap_after.bin <pid>

   # 对比分析
   mat heap_initial.bin heap_after.bin
   ```

3. **分析泄漏点**
   - 查找不再使用的对象
   - 检查对象引用关系
   - 找出生命周期长的对象

**常见泄漏原因**：

1. **静态集合类泄漏**

   ```java
   // 问题代码
   private static final Map<String, Object> cache = new HashMap<>();
   // 集合中存储的对象永远不会被清理
   ```

2. **监听器和回调未移除**

   ```java
   // 问题代码
   eventListener.addListener(new MyListener());
   // MyListener 永远不会被移除
   ```

3. **ThreadLocal 泄漏**

   ```java
   // 问题代码
   ThreadLocal<Object> local = new ThreadLocal<>();
   local.set(new Object());
   // 如果线程复用，对象不会被回收
   ```

4. **数据库连接未关闭**
   ```java
   // 问题代码
   Connection conn = dataSource.getConnection();
   // 如果出现异常，连接可能不会被关闭
   ```

**解决方案**：

- 使用弱引用和软引用
- 及时移除监听器
- 正确管理 ThreadLocal
- 使用连接池
- 定期清理静态集合

## 响应时间过长

**问题特征**：

- 请求响应变慢
- 接口超时
- 系统吞吐量下降

**分析步骤**：

1. **监控性能指标**

   ```bash
   # 监控 GC
   jstat -gcutil <pid> 1000

   # 监控线程
   jstack <pid> > thread_dump.txt

   # 监控系统资源
   top -p <pid>
   iostat
   vmstat
   ```

2. **分析线程状态**

   ```bash
   # 查看线程堆栈
   jstack <pid> > thread_dump.txt

   # 统计线程状态
   grep "java.lang.Thread.State:" thread_dump.txt | sort | uniq -c
   ```

3. **分析网络延迟**

   ```bash
   # 查看 TCP 连接
   netstat -anp | grep <pid>

   # 查看 HTTP 请求
   # 检查应用日志
   ```

4. **分析数据库查询**
   ```bash
   # 查看数据库连接
   # 检查慢查询日志
   # 使用数据库监控工具
   ```

**分析方法**：

```bash
# 1. 生成线程转储
jstack <pid> > thread_dump.txt

# 2. 统计线程状态分布
grep "java.lang.Thread.State:" thread_dump.txt | sort | uniq -c | sort -rn

# 3. 查找长时间运行的线程
grep -A 30 "RUNNABLE" thread_dump.txt | grep -v "^$"

# 4. 查找阻塞的线程
grep "BLOCKED" thread_dump.txt

# 5. 检查线程池使用情况
# 查看是否有线程池满的情况

# 6. 分析热点方法
# 使用方法执行时间分析
```

**常见原因**：

1. **线程池配置不当**
   - 线程池大小不合理
   - 队列大小设置过小
   - 线程被阻塞

2. **数据库问题**
   - 慢查询
   - 连接池满
   - 索引不足

3. **网络问题**
   - 超时设置不合理
   - 网络延迟
   - 资源竞争

4. **GC 问题**
   - Full GC 频繁
   - 停顿时间长
   - 内存不足

**解决方案**：

- 优化线程池配置
- 优化数据库查询
- 添加监控和告警
- 使用异步处理
- 优化 GC 配置
- 使用缓存

# 性能分析最佳实践

## 问题识别流程

### 1. 采集数据

**监控指标**：

- CPU 使用率
- 内存使用情况
- GC 统计信息
- 线程状态
- 系统资源

**采集频率**：

- 实时监控：1秒间隔
- 堆转储：问题发生时
- 线程转储：定期或触发时

### 2. 数据分析

**工具选择**：

- `jstat`：快速查看 GC 情况
- `jmap`：生成堆转储分析
- `jstack`：查看线程状态
- `jcmd`：执行诊断命令
- `VisualVM`：可视化分析
- `MAT`：深度堆分析
- `JFR`：长时间性能分析

### 3. 定位问题

**分析方法**：

- 热点分析：找出 CPU 消耗高的方法
- 内存分析：找出占用内存多的对象
- 线程分析：找出阻塞或死锁的线程
- 系统分析：找出系统资源的瓶颈

### 4. 解决问题

**优化策略**：

- 代码优化：优化算法和逻辑
- 配置优化：调整 JVM 参数和系统配置
- 架构优化：改进系统架构
- 监控优化：增强监控和告警

## 数据采集策略

### 1. 问题发生前

**预防性监控**：

- 启用 GC 日志
- 设置内存监控
- 记录性能基线
- 建立告警规则

### 2. 问题发生时

**紧急采集**：

- 生成堆转储
- 生成线程转储
- 记录时间戳
- 记录环境信息

### 3. 问题解决后

**验证和优化**：

- 验证问题已解决
- 重新采集性能数据
- 对比优化前后的数据
- 更新监控配置

## 工具选择指南

| 问题类型       | 推荐工具             | 优先级 |
| -------------- | -------------------- | ------ |
| **内存泄漏**   | jmap + MAT, VisualVM | 高     |
| **频繁 GC**    | jstat, jcmd          | 高     |
| **线程死锁**   | jstack, jcmd         | 高     |
| **CPU 高**     | jstack, jstack -l    | 高     |
| **性能瓶颈**   | VisualVM, JFR        | 中     |
| **长时间运行** | JFR                  | 高     |

## 自动化分析脚本

### 1. GC 分析脚本

```bash
#!/bin/bash
# gc_analysis.sh - GC 问题快速分析脚本

PID=$1
INTERVAL=${2:-1000}

echo "开始监控 PID: $PID, 间隔: ${INTERVAL}ms"

while true; do
    clear
    echo "=== GC 监控 ==="
    echo "时间: $(date)"
    echo ""
    jstat -gcutil $PID $INTERVAL | tail -1
    echo ""
    echo "最近 GC 原因:"
    jstat -gccause $PID $INTERVAL | tail -1
    echo ""
    echo "按 Ctrl+C 停止"
    sleep 1
done
```

### 2. 堆转储分析脚本

```bash
#!/bin/bash
# heap_dump.sh - 堆转储生成和分析脚本

PID=$1
OUTPUT_DIR="/tmp/heap_dumps"
OUTPUT_FILE="$OUTPUT_DIR/heap_$(date +%Y%m%d_%H%M%S).hprof"

# 创建输出目录
mkdir -p $OUTPUT_DIR

echo "生成堆转储: $OUTPUT_FILE"
jmap -dump:format=b,file=$OUTPUT_FILE $PID

if [ $? -eq 0 ]; then
    echo "堆转储生成成功"
    echo "使用以下命令分析:"
    echo "  jhat $OUTPUT_FILE"
    echo "  或使用 VisualVM: visualvm --open $OUTPUT_FILE"
else
    echo "堆转储生成失败"
fi
```

### 3. 线程分析脚本

```bash
#!/bin/bash
# thread_analysis.sh - 线程转储生成和分析脚本

PID=$1
OUTPUT_DIR="/tmp/thread_dumps"
OUTPUT_FILE="$OUTPUT_DIR/thread_$(date +%Y%m%d_%H%M%S).txt"

# 创建输出目录
mkdir -p $OUTPUT_DIR

echo "生成线程转储: $OUTPUT_FILE"
jstack -l $PID > $OUTPUT_FILE

if [ $? -eq 0 ]; then
    echo "线程转储生成成功"
    echo "统计线程状态:"
    grep "java.lang.Thread.State:" $OUTPUT_FILE | sort | uniq -c | sort -rn
    echo ""
    echo "按 Ctrl+C 停止"
    read -p "按 Enter 键生成下一次转储..."

    # 清屏并继续
    clear
else
    echo "线程转储生成失败"
fi
```

### 4. 系统监控脚本

```bash
#!/bin/bash
# system_monitor.sh - 系统资源监控脚本

PID=$1
INTERVAL=${2:-1}

echo "监控 PID: $PID"
echo "按 Ctrl+C 停止"

while true; do
    clear
    echo "=== 系统监控 ==="
    echo "时间: $(date)"
    echo ""

    # CPU 使用率
    CPU=$(top -p $PID -n 1 -b | grep $PID | awk '{print $9}')
    echo "CPU 使用率: ${CPU}%"

    # 内存使用
    MEM=$(top -p $PID -n 1 -b | grep $PID | awk '{print $6}')
    echo "内存使用: ${MEM} KB"

    # 线程数
    THREADS=$(jstack $PID | grep -c "^")
    echo "线程数: $THREADS"

    # 堆内存
    HEAP=$(jstat -gcutil $PID 1000 | tail -1 | awk '{print $4}')
    echo "堆内存使用: ${HEAP}%"

    echo ""
    echo "按 Ctrl+C 停止"
    sleep $INTERVAL
done
```

### 5. 一键诊断脚本

```bash
#!/bin/bash
# diagnose.sh - 一键问题诊断脚本

PID=$1

if [ -z "$PID" ]; then
    echo "用法: $0 <pid>"
    echo "示例: $0 12345"
    exit 1
fi

# 检查进程是否存在
if ! ps -p $PID > /dev/null; then
    echo "进程 $PID 不存在"
    exit 1
fi

echo "开始诊断 PID: $PID"
echo "时间: $(date)"
echo ""

# 1. 基本信息检查
echo "=== 基本信息检查 ==="
jps -l $PID
echo ""

# 2. 系统资源监控
echo "=== 系统资源监控 ==="
top -p $PID -n 1 | grep $PID
echo ""

# 3. JVM 参数
echo "=== JVM 参数 ==="
jinfo -flags $PID | grep -E "MaxHeapSize|MaxMetaspaceSize|GC"
echo ""

# 4. GC 统计
echo "=== GC 统计 ==="
jstat -gcutil $PID 1 10
echo ""

# 5. GC 原因
echo "=== GC 原因 ==="
jstat -gccause $PID 1 5
echo ""

# 6. 线程状态统计
echo "=== 线程状态统计 ==="
jstack $PID | grep "java.lang.Thread.State:" | sort | uniq -c | sort -rn | head -10
echo ""

# 7. 对象分布（仅活跃对象）
echo "=== 对象分布（前10） ==="
jmap -histo:live $PID | head -11
echo ""

# 8. 堆内存信息
echo "=== 堆内存信息 ==="
jmap -heap $PID
echo ""

# 9. 类加载统计
echo "=== 类加载统计 ==="
jcmd $PID GC.classloader
echo ""

echo "诊断完成"
echo "建议操作:"
echo "  - 如果 CPU 高，查看 jstack 输出"
echo "  - 如果内存高，生成堆转储: jmap -dump:live,format=b,file=heap.bin $PID"
echo "  - 如果 GC 频繁，调整 JVM 参数"
echo "  - 如果有死锁，查看 jstack -m 输出"
```

# 常见问题速查表

## 工具速查

| 问题                 | 命令                                           | 说明              |
| -------------------- | ---------------------------------------------- | ----------------- |
| 查看 JVM 参数        | `jinfo <pid>`                                  | 查看所有 JVM 参数 |
| 查看 GC 情况         | `jstat -gcutil <pid>`                          | 查看 GC 统计      |
| 查看 GC 原因         | `jstat -gccause <pid>`                         | 查看 GC 原因      |
| 生成堆转储           | `jmap -dump:live,format=b,file=heap.bin <pid>` | 生成二进制堆转储  |
| 查看对象分布         | `jmap -histo:live <pid>`                       | 查看对象统计      |
| 查看线程堆栈         | `jstack <pid>`                                 | 生成线程转储      |
| 查看线程堆栈（详细） | `jstack -l <pid>`                              | 包含锁信息        |
| 查看线程状态         | `jcmd <pid> Thread.print`                      | 详细线程信息      |
| 查看 GC 堆信息       | `jcmd <pid> GC.heap_info`                      | 堆统计信息        |
| 启动 JFR             | `jcmd <pid> JFR.start name=recording`          | 开始性能记录      |

## 性能指标

### 健康指标

- **CPU**: < 70%
- **堆内存**: < 80%
- **GC 频率**: Full GC < 1次/小时
- **停顿时间**: < 200ms

### 警告指标

- **CPU**: > 70%
- **堆内存**: > 80%
- **Full GC**: > 1次/小时
- **停顿时间**: > 200ms

### 危险指标

- **CPU**: > 90%
- **堆内存**: > 90%
- **Full GC**: > 3次/小时
- **停顿时间**: > 500ms
- **OOM**: 发生内存溢出

## 参考资源

- [Oracle JDK 官方文档](https://docs.oracle.com/en/java/javase/21/tech-notes/guides/troubleshoot/)
- [VisualVM 官方文档](https://visualvm.github.io/)
- [Java Flight Recorder 指南](https://docs.oracle.com/en/java/javase/21/gctuning/jfr-monitoring.html)
- [Java 性能调优指南](https://www.oracle.com/java/technologies/javase/vmoptions-jsp.html)
- [JDK 诊断工具文档](https://docs.oracle.com/en/java/javase/21/tools/java.html)
