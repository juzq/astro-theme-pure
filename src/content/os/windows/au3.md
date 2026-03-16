---
title: AU3语法
publishDate: 2021-03-22
description: 'Au3脚本是AutoIt3 Windows自动安装脚本语言，AutoIt 是一种自动控制工具。它可以被用来自动完成任何基于 Windows 或 DOS 的简单任务。'
tags:
  - shell

---
  

## 相关链接
  

文档：<https://www.autoitscript.com/autoit3/docs/>

  

函数库：<https://www.autoitscript.com/autoit3/docs/functions/>

  

## 语法

  

### 条件

```

If (<expression>) Then

    <statement>

EndIf

```

  

## 常用函数

  

* MsgBox：对话框

  `MsgBox ( flag, "title", "text" [, timeout = 0 [, hwnd]] )`

  

* FileExists：检查文件是否存在

  

  `FileExists ( "path" )`

  

* FileSelectFolder：选择文件夹

  

  `FileSelectFolder ( "dialog text", "root dir" [, flag = 0 [, "initial dir" [, hwnd]]] )`

  

  注：根目录可参考：<https://www.autoitscript.com/autoit3/docs/appendix/clsid.htm>

  

* _Crypt_HashData：数据串计算哈希

  ```

    #include <Crypt.au3>

    _Crypt_DeriveKey ( $vPassword, $iAlgID [, $iHashPasswordID = $CALG_MD5] )

  ```

  

* _Crypt_HashFile：文件计算哈希

  ```

    #include <Crypt.au3>

    _Crypt_HashFile ( $sFilePath, $iAlgID )

  ```

  

* StringTrimLeft：修剪字符串左边

  `StringTrimLeft（“ string”，count） `

