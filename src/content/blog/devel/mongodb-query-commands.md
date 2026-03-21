---
title: MongoDB 常用查询语句
publishDate: 2025-03-21
description: 系统梳理 MongoDB 的 CRUD 操作和高级查询技巧
tags:
  - mongodb
---

## 概述

MongoDB 是一种流行的 NoSQL 数据库，以其灵活的文档存储方式和强大的查询功能而著称。本文将系统介绍 MongoDB 的常用查询语句，帮助开发者快速掌握数据库操作。

## 插入数据

### 插入单条文档

```javascript
db.collection.insertOne({
  name: "张三",
  age: 28,
  email: "zhangsan@example.com"
})
```

### 插入多条文档

```javascript
db.collection.insertMany([
  { name: "李四", age: 32, department: "技术部" },
  { name: "王五", age: 25, department: "市场部" },
  { name: "赵六", age: 30, department: "产品部" }
])
```

## 查询数据

### 基础查询

```javascript
// 查询所有文档
db.users.find()

// 查询指定字段
db.users.find({}, { name: 1, email: 1 })

// 查询指定文档
db.users.findOne({ _id: ObjectId("507f1f77bcf86cd799439011") })

// 等于查询
db.users.find({ age: 28 })

// 不等于查询
db.users.find({ age: { $ne: 30 } })

// 大于、小于
db.users.find({ age: { $gt: 25, $lt: 35 } })
```

### 逻辑运算符

```javascript
// AND 条件
db.users.find({
  age: { $gte: 25 },
  department: "技术部"
})

// OR 条件
db.users.find({
  $or: [
    { age: { $gt: 30 } },
    { department: "市场部" }
  ]
})

// NOT 条件
db.users.find({
  age: { $not: { $lt: 18 } }
})
```

### 元素查询

```javascript
// 存在字段
db.users.find({ email: { $exists: true } })

// 字段不为空
db.users.find({ age: { $exists: true, $ne: null } })

// 数组包含元素
db.users.find({ hobbies: "编程" })

// 数组长度
db.users.find({ hobbies: { $size: 3 } })
```

### 正则表达式

```javascript
// 模糊查询
db.users.find({ name: /张/ })

// 忽略大小写
db.users.find({ name: { $regex: /zhang/i } })

// 复杂正则
db.users.find({ email: { $regex: /^user.*@example\.com$/i } })
```

## 更新数据

### 更新单条文档

```javascript
// 更新指定字段
db.users.updateOne(
  { name: "张三" },
  { $set: { age: 29 } }
)

// 增加字段
db.users.updateOne(
  { name: "张三" },
  { $set: { lastLogin: new Date() } }
)

// 删除字段
db.users.updateOne(
  { name: "张三" },
  { $unset: { temporary: "" } }
)
```

### 更新多条文档

```javascript
// 批量更新
db.users.updateMany(
  { department: "市场部" },
  { $set: { status: "active" } }
)

// 累加字段
db.users.updateMany(
  { name: "张三" },
  { $inc: { visitCount: 1 } }
)

// 数组操作
db.users.updateOne(
  { name: "张三" },
  { $push: { loginHistory: "2025-03-21" } }
)

// 数组移除元素
db.users.updateOne(
  { name: "张三" },
  { $pull: { tags: "deprecated" } }
)
```

### 替换文档

```javascript
db.users.updateOne(
  { _id: ObjectId("507f1f77bcf86cd799439011") },
  { $set: { name: "张三", age: 29, email: "newemail@example.com" } }
)
```

## 删除数据

### 删除单条文档

```javascript
// 根据条件删除
db.users.deleteOne({ _id: ObjectId("507f1f77bcf86cd799439011") })

// 删除第一条匹配文档
db.users.deleteOne({ status: "inactive" })
```

### 删除多条文档

```javascript
// 删除所有匹配文档
db.users.deleteMany({ status: "inactive" })

// 删除整个集合
db.users.deleteMany({})
```

## 排序和分页

### 排序查询

```javascript
// 按字段升序
db.users.find({}).sort({ age: 1 })

// 按字段降序
db.users.find({}).sort({ age: -1 })

// 多字段排序
db.users.find({}).sort({ department: 1, age: -1 })

// 随机排序
db.users.find({}).sort({ $natural: -1 })
```

### 分页查询

```javascript
// 限制返回数量
db.users.find({}).limit(10)

// 跳过指定数量
db.users.find({}).skip(20)

// 组合使用
db.users.find({}).limit(10).skip(20)

// 常用分页
const page = 1;
const pageSize = 10;
db.users.find({}).skip((page - 1) * pageSize).limit(pageSize)
```

## 聚合查询

### 基础聚合

```javascript
// 统计文档数量
db.users.countDocuments({ age: { $gte: 18 } })

// 去重
db.users.distinct("department")

// 字段求和
db.users.aggregate([
  { $match: { age: { $gte: 25 } } },
  { $group: { _id: "$department", count: { $sum: 1 } } }
])
```

### 复杂聚合

```javascript
// 分组统计
db.users.aggregate([
  { $group: {
    _id: "$department",
    avgAge: { $avg: "$age" },
    maxAge: { $max: "$age" },
    minAge: { $min: "$age" },
    total: { $sum: 1 }
  }}
])

// 排序分组结果
db.users.aggregate([
  { $group: {
    _id: "$department",
    total: { $sum: 1 }
  }},
  { $sort: { total: -1 } }
])

// 条件聚合
db.users.aggregate([
  { $match: { age: { $gte: 25 } } },
  { $group: {
    _id: "$department",
    activeUsers: { $sum: 1 }
  }},
  { $match: { activeUsers: { $gt: 0 } } }
])
```

### 数组操作

```javascript
// 展开数组
db.orders.aggregate([
  { $unwind: "$items" }
])

// 数组分组
db.users.aggregate([
  { $group: {
    _id: null,
    allHobbies: { $push: "$hobbies" }
  }}
])

// 数组去重
db.users.aggregate([
  { $unwind: "$hobbies" },
  { $group: {
    _id: null,
    uniqueHobbies: { $addToSet: "$hobbies" }
  }}
])
```

## 优化建议

### 索引使用

```javascript
// 创建单字段索引
db.users.createIndex({ name: 1 })

// 创建复合索引
db.users.createIndex({ department: 1, age: -1 })

// 创建唯一索引
db.users.createIndex({ email: 1 }, { unique: true })

// 创建多键索引（数组字段）
db.users.createIndex({ tags: 1 })

// 查看索引
db.users.getIndexes()

// 删除索引
db.users.dropIndex("name_1")

// 删除所有索引
db.users.dropIndexes()
```

### 查询优化技巧

```javascript
// 1. 使用投影减少数据传输
db.users.find({}, { name: 1, email: 1 })

// 2. 避免全表扫描
db.users.find({ status: "active" })  // 而不是 db.users.find({})

// 3. 合理使用索引
db.users.createIndex({ name: 1, email: 1 })

// 4. 使用 explain 查看查询计划
db.users.find({ name: "张三" }).explain("executionStats")

// 5. 分页避免深度分页
db.users.find({}).limit(10).skip(100000)  // 性能差
db.users.find({}).sort({ _id: 1 }).limit(10).skip(100000)  // 性能好
```

## 常见问题

### 性能问题

```javascript
// 1. 使用 countDocuments 代替 count()
db.users.countDocuments({})  // 推荐
db.users.count({})  // 已废弃

// 2. 避免使用 $or 查询
db.users.find({ $or: [...] })  // 性能较差

// 3. 使用 explain 分析查询
db.users.find({}).explain()
```

### 数据类型问题

```javascript
// 字符串转 ObjectId
const objectId = ObjectId("507f1f77bcf86cd799439011")

// Date 类型处理
db.users.updateOne(
  { _id: objectId },
  { $set: { createdAt: new Date() } }
)

// 数字类型
db.users.find({ age: NumberInt("28") })
```

### 批量操作优化

```javascript
// 使用批量插入
db.users.insertMany([
  // 1000+ 条数据
])

// 使用事务（MongoDB 4.0+）
const session = db.startSession();
try {
  session.startTransaction();
  db.users.insertOne({...}, { session });
  db.users.updateOne({...}, { session });
  session.commitTransaction();
} catch (error) {
  session.abortTransaction();
} finally {
  session.endSession();
}
```

## 参考资源

- [MongoDB 官方文档](https://docs.mongodb.com/)
- [MongoDB 中文社区](https://mongodb.cn/)
- [MongoDB Aggregation Pipeline](https://docs.mongodb.com/manual/core/aggregation-pipeline/)

## 更新日志

- 2025-03-21: 初始版本，包含基础 CRUD 操作和聚合查询
