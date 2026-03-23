---
title: Profile分析Python代码性能
publishDate: 2021-03-08
description: 几乎每种语言都有分析代码性能的工具，Python也不例外，其自带的profile模块，就提供了该功能。
tags:
  - python
---

## 用法

### API方式

API方式允许我们以代码的方式来运行性能测试，API接口为：

```
import profile
profile.run(<function_name>, <file_name>, <sort>)
```

首先需要导入profile模块，然后调用run函数。若未指定文件名，则会将分析结果打印出来。例：

```py
import profile

# 计算x1到x2的阶乘
def cal_factorial(x1, x2):
    r = 1
    for i in range(x1, x2 + 1):
        r *= i
    return r

def functionA():
    cal_factorial(1, 10000)

def functionB():
    cal_factorial(1, 100000)

def test_code():
    functionA()
    functionB()

# 打印结果，不排序
profile.run("test_code()")
# 打印结果，以累计时间排序
# profile.run("test_code()", None, "cumulative")
# 结果保存到文件：profile
# profile.run("test_code()", "profile")
```

### 命令行

相比于API方式，使用命令行则会更加方便的分析我们已经写好的代码。语法：

不保存文件：`python -m cProfile <code_file_name>.py`

保存分析结果到文件：`python -m cProfile -o <save_file_name> <code_file_name>.py`

## 解析保存的文件

在上一步中生成的文件并非文本文件，无法直接打开查看结果，需要先将文件解析出来。

解析需要用到pstats模块，一般直接在命令行中执行python脚本即可。

`python -c "import pstats; p=pstats.Stats('<file_name>'); p.sort_stats('<sort>').print_stats()"`

其中，sort_stats支持以下参数排序：

- calls/ncalls：调用次数
- cumtime/cumulative：累计时间
- filename/module：文件名
- line：行号
- name：函数名
- nfl：函数名，文件名，行号（name/file/line）
- pcalls：~~原始调用次数~~
- stdname：~~标准函数名~~
- time/tottime：时间（不包括子函数时间）

参考：在pstats.py中找到如下定义

```
The sort_stats() method now processes some additional options (i.e., in
    addition to the old -1, 0, 1, or 2 that are respectively interpreted as
    'stdname', 'calls', 'time', and 'cumulative').  It takes either an
    arbitrary number of quoted strings or SortKey enum to select the sort
    order.

    For example sort_stats('time', 'name') or sort_stats(SortKey.TIME,
    SortKey.NAME) sorts on the major key of 'internal function time', and on
    the minor key of 'the name of the function'.  Look at the two tables in
    sort_stats() and get_sort_arg_defs(self) for more examples.

class SortKey(str, Enum):
    CALLS = 'calls', 'ncalls'
    CUMULATIVE = 'cumulative', 'cumtime'
    FILENAME = 'filename', 'module'
    LINE = 'line'
    NAME = 'name'
    NFL = 'nfl'
    PCALLS = 'pcalls'
    STDNAME = 'stdname'
    TIME = 'time', 'tottime'

sort_arg_dict_default = {
            "calls"     : (((1,-1),              ), "call count"),
            "ncalls"    : (((1,-1),              ), "call count"),
            "cumtime"   : (((3,-1),              ), "cumulative time"),
            "cumulative": (((3,-1),              ), "cumulative time"),
            "filename"  : (((4, 1),              ), "file name"),
            "line"      : (((5, 1),              ), "line number"),
            "module"    : (((4, 1),              ), "file name"),
            "name"      : (((6, 1),              ), "function name"),
            "nfl"       : (((6, 1),(4, 1),(5, 1),), "name/file/line"),
            "pcalls"    : (((0,-1),              ), "primitive call count"),
            "stdname"   : (((7, 1),              ), "standard name"),
            "time"      : (((2,-1),              ), "internal time"),
            "tottime"   : (((2,-1),              ), "internal time"),
            }
```

## 分析结果

```
         9 function calls in 2.361 seconds

   Ordered by: cumulative time

   ncalls  tottime  percall  cumtime  percall filename:lineno(function)
       1    0.000    0.000    2.361    2.361 profile:0(test_code())
       1    0.000    0.000    2.361    2.361 :0(exec)
       1    0.000    0.000    2.361    2.361 <string>:1(<module>)
       1    0.000    0.000    2.361    2.361 <ipython-input-11-a4480b4512b3>:16(test_code)
       2    2.361    1.181    2.361    1.181 <ipython-input-11-a4480b4512b3>:4(cal_factorial)
       1    0.000    0.000    2.328    2.328 <ipython-input-11-a4480b4512b3>:13(functionB)
       1    0.000    0.000    0.033    0.033 <ipython-input-11-a4480b4512b3>:10(functionA)
       1    0.000    0.000    0.000    0.000 :0(setprofile)
       0    0.000             0.000          profile:0(profiler)
```

各字段含义：

- ncalls：调用次数
- tottime：总时间（不包括子函数时间）
- cumtime：累计时间（包括子函数时间）
- percall：每次调用时间=总时间/调用次数
- filename：文件名
- lineno：行号
- function：函数名

从分析结果中可以看出，本次运行test_code一共用了2.361秒，functionA用了0.033秒，functionB用了2.328秒，但他们函数本身都未消耗时间，时间都消耗在调用子函数：cal_factorial上。
