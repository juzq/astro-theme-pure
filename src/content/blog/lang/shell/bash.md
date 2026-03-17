---
title: Linux Shell——Bash
publishDate: 2020-06-09
description: Bash是众多Linux发行版中最常用的shell，功能丰富。
tags:
  - shell
---

## 变量

### 定义变量(变量赋值)
```bash
variable="xxx"
```
> 注：= 左右不能有空格

### 取变量值
`echo $variable`

### 取输入变量
* `$@`：所有变量的列表，以空格隔开
* `$#`: 变量个数
* `$1`: 第一个变量，`$2, $3`以此类推
* `$?`：上一个函数调用的返回值

## 数组
### 定义数组
语法：`array=(x1 x2 ...)`，array为变量名，x1、x2为数组元素

### 数组取值
* 取单个值：`${array[index]}`，index从0开始。
* 取所有值：`${array[*]}`或`${array[@]}`

### 数组长度
`${#array[*]}`或`${#array[@]}`

## 条件
语法：`x <con> y`
  
条件判断符<con>与两边对象x, y之间的空格可以省略，即`x<con>y`。

### 数字条件判断
* 等于：`-eq`
* 不等于：`-ne`
* 大于：`-gt`
* 大于等于：`-ge`
* 小于：`-lt`
* 小于等于：`-le`

### 字符串条件判断
* 相等：`=`或`==`
* 不相等：`!=`

注：字符串为变量时，需要用引号引起来，例如：`"$str" == "success"`

### if语句
```bash
if [ <condition> ]; then
    <statement>
fi
```
> 注：
> 1. if和[ ]之间必须要空格。
> 2. [ ]和<condition>之间必须要空格。
> 3. ;和then之间可空格可以省略。

### if-else语句
```bash
if [ <condition> ]; then
    <statement>
else
    <statement>
fi
```

### if-elseif 语句
```bash
if [ <condition> ]; then
    <statement>
elif [ <condition> ]; then
    <statement>
fi
```

## 循环

### for数组循环
```bash
for param in $array; do
    <statement>
done
```

### for条件循环
```bash
for (( i = 0 ; i < <variable> ; i++ )); do
    <statement>
done

```

### while循环
```bash
while :
do
    <statement>
done
```

## 函数

### 定义函数
```bash
name(){
    <statement>
}
```
