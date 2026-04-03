---
title: Akka节点退出分析
publishDate: 2022-08-13
description: 内网测试环境发现服务器崩溃，查询日志发现集群节点基本都退出了，针对这种情况展开分析...
tags:
  - akka
---

### 日志查询

#### 退出日志

```
10:47:20,076|DEBUG| - Performing phase [cluster-exiting-done] with [1] tasks.
10:47:20,076|DEBUG| - Performing task [exiting-completed] in CoordinatedShutdown phase [cluster-exiting-done]
10:47:20,076|DEBUG| - Performing phase [cluster-shutdown] with [1] tasks.
10:47:20,076|DEBUG| - Performing task [wait-shutdown] in CoordinatedShutdown phase [cluster-shutdown]
10:47:20,076|DEBUG| - Performing phase [before-actor-system-terminate] with [2] tasks.
10:47:20,076|DEBUG| - Performing task [stop-global-components] in CoordinatedShutdown phase [before-actor-system-terminate]
10:47:20,076|DEBUG| - Performing task [enter-stopped-state] in CoordinatedShutdown phase [before-actor-system-terminate]
10:47:20,076|INFO| - Stopping global components...
10:47:20,076|INFO| - Change state STOPPING -> STOPPED, reason=default
10:47:20,076|INFO| - Global components all stopped.
10:47:20,076|DEBUG| - Performing phase [actor-system-terminate] with [1] tasks.
10:47:20,076|DEBUG| - Performing task [terminate-system] in CoordinatedShutdown phase [actor-system-terminate]
10:47:20,106|INFO| - Actor[akka://mc-Game/user/duidWorkerPool/$a#-1404896902] stopped.
10:47:20,107|INFO| - Actor[akka://mc-Game/user/duidWorkerPool/$b#-741633102] stopped.
10:47:20,118|INFO| - Actor[akka://mc-Game/user/scriptDaemon#1885699308] stopped.
10:47:20,119|INFO| - Shutting down remote daemon.
10:47:20,121|INFO| - Remote daemon shut down; proceeding with flushing remote transports.
10:47:20,136|INFO| - Remoting shut down.
```

有点类似于关服日志。

#### 关闭原因日志

```
10:46:50,930|WARN| - Cluster Node [akka://mc-Game@172.26.101.181:2562] - Scheduled sending of heartbeat was delayed. Previous heartbeat was sent [21309] ms ago, expected interval is [3000] ms. This may cause failure detection to mark members as unreachable. The reason can be thread starvation, CPU overload, or GC.
10:46:52,051|INFO| - Cluster Node [akka://mc-Game@172.26.101.181:2562] - event ReachabilityChanged(akka://mc-Game@172.26.101.181:2552 -> akka://mc-Game@172.26.101.181:2564: Unreachable [Unreachable] (1), akka://mc-Game@172.26.101.181:2553 -> akka://mc-Game@172.26.101.181:2564: Unreachable [Unreachable] (1), akka://mc-Game@172.26.101.181:2556 -> akka://mc-Game@172.26.101.181:2552: Unreachable [Unreachable] (2), akka://mc-Game@172.26.101.181:2556 -> akka://mc-Game@172.26.101.181:2559: Unreachable [Unreachable] (3), akka://mc-Game@172.26.101.181:2556 -> akka://mc-Game@172.26.101.181:2562: Reachable [Reachable] (4))
10:46:52,491|INFO| - Self downed, stopping
10:46:52,491|INFO| - Singleton manager stopping singleton actor [akka://mc-Game/system/sharding/chatCoordinator/singleton]
10:46:52,538|WARN| - Other node [akka://mc-Game@172.26.101.181:2558#5251986850917086146] quarantined this node.
10:46:52,539|WARN| - SBR took decision DownSelfQuarantinedByRemote and is downing [akka://mc-Game@172.26.101.181:2562] including myself,, [11] unreachable of [1] members, all members in DC [Member(akka://mc-Game@172.26.101.181:2551, Down), Member(akka://mc-Game@172.26.101.181:2552, Down), Member(akka://mc-Game@172.26.101.181:2553, Down), Member(akka://mc-Game@172.26.101.181:2554, Down), Member(akka://mc-Game@172.26.101.181:2555, Down), Member(akka://mc-Game@172.26.101.181:2556, Down), Member(akka://mc-Game@172.26.101.181:2557, Down), Member(akka://mc-Game@172.26.101.181:2558, Down), Member(akka://mc-Game@172.26.101.181:2559, Down), Member(akka://mc-Game@172.26.101.181:2560, Down), Member(akka://mc-Game@172.26.101.181:2562, Up), Member(akka://mc-Game@172.26.101.181:2563, Down), Member(akka://mc-Game@172.26.101.181:2564, Down)], full reachability status: [akka://mc-Game@172.26.101.181:2552 -> akka://mc-Game@172.26.101.181:2564: Unreachable [Unreachable] (1), akka://mc-Game@172.26.101.181:2553 -> akka://mc-Game@172.26.101.181:2564: Unreachable [Unreachable] (1), akka://mc-Game@172.26.101.181:2556 -> akka://mc-Game@172.26.101.181:2552: Unreachable [Unreachable] (2), akka://mc-Game@172.26.101.181:2556 -> akka://mc-Game@172.26.101.181:2559: Unreachable [Unreachable] (3)]
10:46:55,012|INFO| - Change state STARTED -> STOPPING, reason=ClusterDowningReason$
10:46:55,014|DEBUG| - Performing phase [service-unbind] with [0] tasks
10:46:55,014|DEBUG| - Performing phase [service-requests-done] with [0] tasks
10:46:55,014|DEBUG| - Performing phase [service-stop] with [0] tasks
10:46:55,014|DEBUG| - Performing phase [before-cluster-shutdown] with [0] tasks
10:46:55,014|DEBUG| - Performing phase [before-cluster-sharding-shutdown-region] with [1] tasks.
10:46:55,014|DEBUG| - Performing task [delay-by-shard-name] in CoordinatedShutdown phase [before-cluster-sharding-shutdown-region]
```

关闭原因为节点之间连接超时，本节点已经被隔离，SBR决定DownSelfQuarantinedByRemote，然后就把本节点关闭了。

### 核心故障原因：心跳延迟（关键线索）

日志中有一条极其关键的 **WARN** 信息：

> `Scheduled sending of heartbeat was delayed. Previous heartbeat was sent [7854] ms ago, expected interval is [3000] ms.`

- **分析**：Akka 期望每 3 秒发一次心跳，结果这次延迟到了 **7.8 秒**。
- **诊断**：这是典型的 **JVM 停顿**。原因通常有三类：
    - **GC 停顿 (Stop-The-World)**：JVM 正在进行全量垃圾回收。
    - **CPU 爆满**：系统负载过高，OS 没给 Akka 线程分配时间片。
    - **线程饥饿**：Akka 的调度器（Dispatcher）被耗时操作（如阻塞 I/O）占满。

### 节点状态演变过程

#### 第一阶段：发现异常

- 节点 `2553` 发现集群中的 `2564` 变得不可达（Unreachable）。
- 此时系统还在尝试运行业务逻辑（看到 `MoveUnitProcess` 还在处理怪物攻击路径更新），但网络状态已经开始恶化。

#### 第二阶段：收到“判决书”

- `Received gossip where this member has been downed, from [...:2552]`
- **解读**：节点 `2552` 作为当时的 Leader，通过 Gossip 协议通知节点 `2553`：“你已经被集群踢出了（Downed）。”

#### 第三阶段：自我拆解与关闭

- 一旦确认自己被 Down，该节点开始关闭所有的集群服务：
    - **ShardRegion 停止**：`activity`, `chat`, `world`, `alliance` 等分片代理全部关闭。
    - **Singleton 停止**：`worldCoordinator` 单例也随之关闭。
    - **角色变更**：所有的 `RoleLeaderChanged` 全部变为 `None`，意味着该节点不再承担任何集群角色。

#### 第四阶段：彻底瘫痪

- 节点标记集群中所有其他节点（2551, 2552, 2558...）全部为 `Down`。这通常是因为它自己已经脱离了集群联系，处于“弥留之际”。

### 业务影响

- **游戏逻辑中断**：`world` 分片（ShardRegion）停止，意味着该节点上承载的游戏地图、玩家数据处理全部中断。
- **单例失效**：`worldCoordinator` 停止，如果它是集群中唯一的协调者，整个集群的资源分配会陷入混乱，直到其他节点选出新的 Leader。

### 改进建议

1. **资源隔离**：在同一台机器上跑了至少 13 个 Akka 节点（从 2551 到 2564）。这会造成极严重的 **CPU 争抢**。减少单机节点数量，或者大幅增加宿主机的 CPU 核心数。
2. **排查阻塞代码**：搜索代码中是否存在 `Thread.sleep`、阻塞式数据库查询或文件 IO，且这些操作运行在 Akka 的默认调度器上。
3. **调整故障检测器**：如果网络或 CPU 环境确实较差，可以调大阈值：`akka.cluster.failure-detector.threshold = 12.0  # 默认 8.0，调大可提高容灾性但降低灵敏度`
4. **监控 GC**：务必检查该时段的 `gc.log`。7.8 秒的延迟极大概率是 Full GC 导致的。

**一句话总结：这台机器撑不住这么多节点同时跑，CPU 或内存（GC）在高负载下崩了。**
