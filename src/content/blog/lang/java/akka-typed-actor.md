---
title: Akka类型化的Actor
publishDate: 2021-12-20
description: 类型化Actor已经是akka官方默认推荐使用的actor。
tags:
  - akka
---

从akka 2.6开始，[Typed Actor](https://doc.akka.io/docs/akka/current/typed/actors.html)（类型化的Actor）已经成为默认的Actor，原有的Actor被命名为为[Classic Actor](https://doc.akka.io/docs/akka/current/actors.html)（经典的Actor）。akka推荐新项目直接使用typed actor，因为其提升了类型安全，并且将Java API和Scala API分离，对开发者更加友好。

## 迁移指南
官网的从经典的Actor迁移到类型化的Actor文档

<https://doc.akka.io/docs/akka/current/typed/from-classic.html>

## 主要区别

### Actor继承
* 经典的actor继承自`akka.actor.AbstractActor`， 实现`public Receive createReceive()`即可。

* 类型化的actor继承自`akka.actor.typed.javadsl.AbstractBehavior<T>`，有泛型，需要实现`public Receive<T> createReceive()`，泛型代表该actor能处理哪种类型的消息，让代码更加清晰，Actor能处理哪种消息一目了然。

### Actor创建
* 经典的actor可以由`akka.actor.ActorSystem`或者`akka.actor.ActorContext`的`actorOf`方法来创建，属性可以由`akka.actor.Props`传入。

* 类型化的actor由`akka.actor.typed.javadsl.ActorContext`的`spawn`方法来创建，属性同样可以由`akka.actor.typed.Props`传入。`akka.actor.typed.ActorSystem`不再有`spawn`方法来创建根actor，但在启动ActorSystem时，一个用户级守护Behavior会定义一个单独的根actor，其他的actor都会作为该守护actor的子actor。

  akka解释了这一改动的原因是为了保证一致性，即除了根actor以外，所有的actor都必须由actor来创建。因为actor的行为都是由消息驱动，所以要创建子actor，必须向其父actor发送消息来创建。

### 消息处理
经典的actor在处理完消息后，无需返回。类型化的actor在处理完消息后，需要返回`akka.actor.typed.Behavior`对象，用于指定下个消息由哪个actor来处理，一般直接返回this。

该改动也是类型化actor的核心，我理解的是akka推荐将同种类型的actor再按照状态来单独定义，当处理完某条消息导致actor的状态改变后，返回下一个状态的actor，让其接着处理消息。当然，在经典的actor中也有类似的方式，就是`ActorContext`的`become`方法。

### sender/parent
经典的actor可以直接获取到sender和parent，而在类型化的actor中删除了这两个api。原因是为了更加明确，减少歧义，如果有需要，可以在消息中将sender和parent传过去。

## 对项目的影响

### Gate
上面有提到，类型化的Actor无法直接由ActorSystem直接创建，只能由根Actor及其子Actor来创建。而Actor只能通过接收消息来处理逻辑，因此想要在Gate节点中创建Channel Actor，就必须发送消息给根Actor。由于创建Actor时，要指定待创建的`Behavior<T>`，即
```
context.spawn(ChannelActor.create(), "channel")
```
而ChannelActor是写在gate模块中，而根Actor是写在shared模块中，没有办法找到Channel Actor，该怎么办呢？

解决办法就是Gate节点启动，创建根Actor时，再创建一个Gate Actor，负责Gate节点下所有Channel Actor的创建，即
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
```

以上为Gate Actor的代码，即在netty连接建立时将`ChannelHandlerContext`作为消息发送给GateActor，Gate Actor接收到后则创建Channel Actor作为其子Actor，之后该Channel Actor即负责接收客户端消息，并将消息转发给指定服务器节点；接收服务器节点消息并转发给客户端。