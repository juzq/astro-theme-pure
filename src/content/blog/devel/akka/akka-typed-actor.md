---
title: Akka类型化Actor与传统Actor对比
publishDate: 2021-12-20
description: 类型化Actor已经是akka官方默认推荐使用的actor，本文详细对比了Typed Actor与Classic Actor的区别和优缺点。
tags:
  - akka
---

从akka 2.6开始，[Typed Actor](https://doc.akka.io/docs/akka/current/typed/actors.html)（类型化的Actor）已经成为默认的Actor，原有的Actor被命名为为[Classic Actor](https://doc.akka.io/docs/akka/current/actors.html)（经典的Actor）。akka推荐新项目直接使用typed actor，因为其提升了类型安全，并且将Java API和Scala API分离，对开发者更加友好。

## 迁移指南
官网上从经典的Actor迁移到类型化的Actor文档

<https://doc.akka.io/docs/akka/current/typed/from-classic.html>

## 核心对比

### 1. Actor继承与泛型

**Classic Actor**
```java
public class ClassicEchoActor extends AbstractActor {
    @Override
    public Receive createReceive() {
        return receiveBuilder()
            .match(String.class, msg -> getSender().tell(msg, getSelf()))
            .build();
    }
}
```

**Typed Actor**
```java
public class TypedEchoBehavior extends AbstractBehavior<String> {
    @Override
    public Receive<String> createReceive() {
        return newReceiveBuilder()
            .onMessage(String.class, msg -> {
                getContext().getLog().info("Received: {}", msg);
                return Behaviors.same();
            })
            .build();
    }
}
```

**对比要点**：
- Typed Actor 使用泛型 `Behavior<String>` 明确指定能处理的消息类型
- 类型安全：编译期就能发现消息类型错误
- API 分离：Java 和 Scala 各自有独立的 API

### 2. Actor 创建与生命周期

**Classic Actor**
```java
// 从 ActorSystem 创建
ActorRef<String> actorRef = system.actorOf(Props.create(ClassicEchoActor.class), "echo");

// 从 ActorContext 创建
ActorRef<String> childRef = context.actorOf(Props.create(ClassicEchoActor.class), "child");
```

**Typed Actor**
```java
// 从 ActorContext 创建
Behavior<String> behavior = TypedEchoBehavior.create();
ActorRef<String> actorRef = context.spawn(behavior, "echo");

// 根 Actor 必须通过守护 Actor 创建
Behavior<Void> rootBehavior = Behaviors.setup(context -> {
    ActorRef<String> childRef = context.spawn(TypedEchoBehavior.create(), "child");
    return Behaviors.receiveMessage(msg -> {
        // 处理消息
        return Behaviors.same();
    });
});
```

**对比要点**：
- Typed Actor 只能从 ActorContext 创建，不能直接从 ActorSystem 创建
- 根 Actor 必须通过守护 Actor 创建，保证层级结构
- 所有 Actor 必须由另一个 Actor 创建，符合 Actor 模型的本质

### 3. 消息处理机制

**Classic Actor**
```java
@Override
public Receive createReceive() {
    return receiveBuilder()
        .match(String.class, msg -> {
            // 处理消息
            getSender().tell("Echo: " + msg, getSelf());
        })
        .build();
}
```

**Typed Actor**
```java
@Override
public Receive<String> createReceive() {
    return newReceiveBuilder()
        .onMessage(String.class, msg -> {
            getContext().getLog().info("Received: {}", msg);
            return Behaviors.same(); // 返回相同的行为
        })
        .build();
}
```

**对比要点**：
- Typed Actor 必须返回 Behavior，明确指定下一个状态
- 支持 `Behaviors.same()` 保持当前状态
- 支持 `Behaviors.setup()` 初始化逻辑
- 支持 `Behaviors.unhandled()` 明确标记未处理的消息

### 4. 发送者与父 Actor

**Classic Actor**
```java
// 直接访问 sender
context.sender().tell("Hello", getSelf());

// 直接访问 parent
context.parent()
```

**Typed Actor**
```java
// 不再支持 sender 和 parent API
// 必须通过消息传递
context.getSpawnSupervisorStrategy() // 获取父 Actor 的策略

// 将 ActorRef 包含在消息中
record WithSender(String message, ActorRef<String> sender) {}
```

**对比要点**：
- Typed Actor 移除了 `sender()` 和 `parent()` 方法
- 减少歧义，明确消息传递语义
- 需要显式传递 ActorRef

### 5. 消息类型

**Classic Actor**
```java
// 可以接受任何类型
.receiveBuilder()
    .match(Integer.class, i -> {...})
    .match(String.class, s -> {...})
    .matchAny(msg -> {...}) // 捕获未匹配的消息
    .build()
```

**Typed Actor**
```java
// 强类型，编译期检查
.onMessage(Integer.class, i -> {...})
.onMessage(String.class, s -> {...})
// 未匹配的消息不会进入处理流程
```

**对比要点**：
- Typed Actor 提供编译期类型安全
- Classic Actor 在运行时才发现类型错误
- Typed Actor 明确区分处理和未处理的消息

### 6. 状态管理

**Classic Actor 使用 become/unbecome**
```java
private enum State { WORKING, PAUSED }

@Override
public Receive createReceive() {
    return receiveBuilder()
        .matchEquals(State.WORKING, s -> {
            getContext().become(workHandler);
        })
        .matchEquals(State.PAUSED, s -> {
            getContext().unbecome();
        })
        .build();
}

private Receive workHandler() {
    return receiveBuilder()
        .match(String.class, msg -> {
            // 处理工作消息
        })
        .build();
}
```

**Typed Actor 使用状态模式**
```java
public interface AppState {
}

public class WorkingState implements AppState {
    @Override
    public Receive<String> createReceive() {
        return newReceiveBuilder()
            .onMessage(PauseCommand.class, cmd -> PausedState.create())
            .build();
    }
}

public class PausedState implements AppState {
    @Override
    public Receive<String> createReceive() {
        return newReceiveBuilder()
            .onMessage(ResumeCommand.class, cmd -> WorkingState.create())
            .build();
    }
}

// 在 Behavior 中切换状态
public class EchoBehavior extends AbstractBehavior<String> {
    private AppState state = WorkingState.create();

    @Override
    public Receive<String> createReceive() {
        return newReceiveBuilder()
            .onMessage(String.class, msg -> {
                // 切换状态
                if (shouldPause(msg)) {
                    state = PausedState.create();
                } else {
                    state = WorkingState.create();
                }
                return state.createReceive();
            })
            .build();
    }
}
```

**对比要点**：
- Typed Actor 鼓励使用显式的状态模式
- 更易于测试和维护
- 经典 Actor 使用 become/unbecome 可能导致状态不可追踪

### 7. 错误处理

**Classic Actor**
```java
@Override
public void preRestart(Throwable reason, Optional<Object> message) {
    // 自定义错误处理
}

@Override
public void postRestart(Throwable reason) {
    // 重启后逻辑
}
```

**Typed Actor**
```java
public class TypedEchoBehavior extends AbstractBehavior<String> {
    @Override
    public Behavior<String> onMessage(String msg) throws Exception {
        if (shouldFail(msg)) {
            throw new IllegalArgumentException("Invalid message");
        }
        // 处理消息
    }

    @Override
    public Behavior<String> onFailure(Throwable cause) {
        // 错误处理
        return Behaviors.restart(StartTimeout.of(1, TimeUnit.SECONDS), this);
    }
}
```

**对比要点**：
- Typed Actor 在消息处理函数中抛出异常
- 支持 `onFailure` 回调处理错误
- 可以配置重启策略和超时

### 8. 测试

**Classic Actor 测试**
```java
public class ClassicEchoActorTest extends TestKit {
    @Test
    public void testEcho() {
        TestProbe<String> probe = new TestProbe<String>(system);
        actorOf(Props.create(ClassicEchoActor.class)).tell("Hello", probe.ref());
        assertEquals("Hello", probe.receiveOne(Duration.ofSeconds(1)));
    }
}
```

**Typed Actor 测试**
```java
public class TypedEchoBehaviorTest extends TestKit {
    @Test
    public void testEcho() {
        TestProbe<String> probe = new TestProbe<String>(system);
        ActorRef<String> actor = spawn(TypedEchoBehavior.create());
        actor.tell("Hello", probe.ref());
        assertEquals("Hello", probe.receiveOne(Duration.ofSeconds(1)));
    }
}
```

**对比要点**：
- 两种方式测试 API 相似
- Typed Actor 可以更精确地验证行为
- 支持 `Behaviors.ignore()` 用于测试中忽略消息

## 完整示例对比

### Classic Actor 实现
```java
public class ClassicCounterActor extends AbstractActor {
    private int count = 0;

    @Override
    public Receive createReceive() {
        return receiveBuilder()
            .match("increment", msg -> {
                count++;
                System.out.println("Count: " + count);
            })
            .match("decrement", msg -> {
                if (count > 0) count--;
                System.out.println("Count: " + count);
            })
            .matchEquals("reset", msg -> {
                count = 0;
                System.out.println("Count reset");
            })
            .matchAny(msg -> {
                System.out.println("Unknown message: " + msg);
            })
            .build();
    }
}
```

### Typed Actor 实现
```java
public class TypedCounterBehavior extends AbstractBehavior<String> {
    private int count = 0;

    private TypedCounterBehavior(ActorContext<String> context) {
        super(context);
    }

    public static Behavior<String> create() {
        return Behaviors.setup(TypedCounterBehavior::new);
    }

    @Override
    public Receive<String> createReceive() {
        return newReceiveBuilder()
            .onMessageEquals("increment", msg -> {
                count++;
                getContext().getLog().info("Count: {}", count);
                return this;
            })
            .onMessageEquals("decrement", msg -> {
                if (count > 0) count--;
                getContext().getLog().info("Count: {}", count);
                return this;
            })
            .onMessageEquals("reset", msg -> {
                count = 0;
                getContext().getLog().info("Count reset");
                return this;
            })
            .build();
    }
}
```

## 优缺点对比

### Typed Actor 优点
1. **类型安全**：编译期就能发现类型错误
2. **API 清晰**：Java 和 Scala 各自有独立的 API
3. **更好的组织**：鼓励状态模式，代码更易维护
4. **错误处理**：更明确的错误处理机制
5. **测试友好**：更易于编写测试用例
6. **减少歧义**：移除了容易混淆的 sender/parent API

### Typed Actor 缺点
1. **学习曲线**：需要适应新的状态管理模式
2. **更多代码**：状态管理需要显式定义
3. **API 改变**：需要适应新的消息处理方式

### Classic Actor 优点
1. **熟悉**：API 简单直观，易于上手
2. **灵活**：运行时才能发现类型错误
3. **兼容性**：与现有系统集成更方便

### Classic Actor 缺点
1. **类型不安全**：运行时才能发现类型错误
2. **API 混乱**：容易混淆 sender/parent API
3. **测试困难**：状态管理不明确

## 实际项目影响

### Gate 节点架构

问题：类型化的Actor无法直接由ActorSystem创建，需要通过守护Actor层级创建。在微服务架构中，gate节点创建的channel actor无法被root actor直接访问。

解决方案：创建Gate Actor作为Gate节点的根Actor，负责创建和管理所有channel actor。

```kotlin
class GateActor(context: ActorContext<ChannelHandlerContext>) : AbstractBehavior<ChannelHandlerContext>(context) {

    companion object {
        fun create(): Behavior<ChannelHandlerContext> = Behaviors.setup { GateActor(it) }
    }

    override fun createReceive(): Receive<ChannelHandlerContext> {
        return newReceiveBuilder()
            .onMessage(ChannelHandlerContext::class.java) { createChannelActor(it) }
            .build()
    }

    private fun createChannelActor(ctx: ChannelHandlerContext): Behavior<ChannelHandlerContext> {
        val ref = context.spawn(ChannelActor.create(ctx), "channel")
        ctx.channel().attr(CHANNEL_ACTOR_KEY).set(ref)
        return this
    }
}

// Channel Actor 实现
class ChannelActor(context: ActorContext<ChannelMessage>) : AbstractBehavior<ChannelMessage>(context) {

    companion object {
        fun create(ctx: ChannelHandlerContext): Behavior<ChannelMessage> = Behaviors.setup { ChannelActor(it, ctx) }
    }

    private val channelHandlerContext: ChannelHandlerContext

    private constructor(context: ActorContext<ChannelMessage>, ctx: ChannelHandlerContext) : super(context) {
        this.channelHandlerContext = ctx
    }

    override fun createReceive(): Receive<ChannelMessage> {
        return newReceiveBuilder()
            .onMessage(ClientMessage::class.java) { msg -> handleClientMessage(msg) }
            .onMessage(ServerMessage::class.java) { msg -> handleServerMessage(msg) }
            .build()
    }

    private fun handleClientMessage(msg: ClientMessage): Behavior<ChannelMessage> {
        // 处理客户端消息
        return this
    }

    private fun handleServerMessage(msg: ServerMessage): Behavior<ChannelMessage> {
        // 处理服务器消息
        return this
    }
}
```

### Root Actor 架构

```kotlin
fun main() {
    val system = ActorSystem(GateActor.create(), "GatewaySystem")

    // 通过守护 Actor 创建根 Actor
    system.become(
        Behaviors.setup { context ->
            val gateActor = context.spawn(GateActor.create(), "gate")
            Behaviors.receiveMessage<Void> { null }
                .then { Behaviors.stopped() }
        }
    )
}
```

## 总结

从 Classic Actor 迁移到 Typed Actor 是一次重要的升级，主要收益包括：

1. **提升代码质量**：类型安全带来更好的代码质量
2. **更好的开发体验**：清晰的 API 和错误处理
3. **更好的可维护性**：状态模式使代码更易维护
4. **未来兼容性**：akka 官方推荐使用 Typed Actor

对于新项目，强烈建议直接使用 Typed Actor。对于现有项目，可以根据实际情况逐步迁移，akka 提供了完整的迁移指南。