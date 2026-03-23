---
title: Python语法
publishDate: 2016-07-02
description: 基础语法规则
tags:
  - python
---

## 条件

```
if <condition1>:
    <statement1>
elif condition2:
    <statement2>
else:
    <statement3>
```

条件语句中可以没有elif，也可以没有else，但必须要有if。

> 注：Python没有switch-case，可用dict结构来实现类似switch-case的功能。

## 循环

### 条件循环

```
while <condition>:
    <statement>
```

## 遍历

### 集合遍历

```
for <variable> in <collection>:
    <statement>
```

### 步长遍历

```python
for i in range(x, y):
    ...
```

i包含x，不包含y

## 集合

### list

- 定义List：`my_list = []`

- list求和：`sum(my_list)`

- 统计值为value的下标：`[i for i, x in enumerate(a) if x == value]`（下标从0开始）

### dict

- 定义dict：`variable = {}`

- 遍历dict的key和value

  ```
  for (k, v) in a.items():
      <statement>
  ```

- 反转key和value：`{v: k for k, v in <collection>.items()}`（原来重复的value会被过滤掉）

## 异常

### 常见异常

- 文件不存在异常：FileNotFoundError

- 中断信号异常（Ctrl-C）：KeyboardInterrupt（继承于BaseException）

### 捕获异常

```
try:
    <statement1>
except <exception_type> as e:
    <statement2>
finally:
    <statement3>
```

### 打印堆栈

`traceback.print_exc()`

> 必须要有异常才能用traceback.print_exc()打印出来，否则要用traceback.print_stack()打印。

## 文件

### 读文件

```
with open(<file_path>, 'rb') as f:
    <statement>
```

执行完成后会自动释放文件。

### 写文件

```
with open(<file_path>, 'wb') as f:
    <statement>
```

执行完成后会自动释放文件。

### 常用文件方法

- 检查文件是否存在：`os.path.exists(<file_path>)`

- 创建文件夹：`os.mkdir(<dir_path>)`

- 创建多层文件夹：`os.makedirs(<dir_path>)`

- 删除文件：`os.remove(<file_path>)`

- 删除文件夹（必须为空）：`os.rmdir(<dir_path>)`

## 进程

### 子进程

```
# 创建子进程
p = multiprocessing.Process(target=<task_function>, args=(<arg1>, <arg2>...))
# 启动子进程
p.start()
# 等待子进程执行完毕
p.join()
```

若不执行p.join，则主进程会立即返回，不会等待子进程执行。

### 进程池

```
# 创建进程池
pool = multiprocessing.Pool(<process_num>)
# 分配任务
result = pool.map(<task_function>, <task_datas>)
pool.close()
# 等待进程池中的进程全部执行完毕
pool.join()
```

> 若进程池任务有涉及随机数，需要设置不同的随机种子，否则所有进程会使用相同的随机种子（启动时间）

## 时间

需要先导入时间模块：`import time`

### 时间戳

- 秒：`time.time()`
- 毫秒：`round(time.time() * 1000)`

### 时间字符串

```python
local_time = time.localtime()
time.strftime("%Y-%m-%d %H:%M:%S", local_time)
```

默认只能获取到秒，若需要毫秒，需要做以下转换：

```python
def get_time():
    timestamp = time.time()
    timestamp_str = str(timestamp)
    milli_second_index = timestamp_str.index(".")
    milli_second = timestamp_str[
        milli_second_index + 1 : milli_second_index + 4  # noqa: E203
    ]
    local_time = time.localtime(timestamp)
    time_str = time.strftime("%Y-%m-%d %H:%M:%S", local_time)
    return f"{time_str}.{milli_second}"
```

## 随机

- 随机浮点数[0, 1)：`random.random()`

- 随机浮点数[a, b]：`random.uniform(a, b)`

- 随机整数[a, b]：`random.randint(a, b)`

- 从序列中随机：`random.choice(<sequence>)`

- 随机打乱列表顺序

  ```
  test_list = ["abc", "bcd"]
  random.shuffle(test_list)
  ```

## Numpy

### 构造矩阵（numpy.ndarray）

- 用list构造：`np.array(<list>)`

- 起止范围构造：`np.arange(<start>, <stop>[, <step>])`，包括start，不包括stop，step默认为1
