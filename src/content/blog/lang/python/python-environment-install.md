---
title: Python环境安装
publishDate: 2016-05-20
description: 安装方法及注意事项
tags:
  - python
---

## 直接安装Python
* Ubuntu
  1. 安装python3：`sudo apt install python3`
  2. 安装pip3：`sudo apt install python3-pip`

* Linux源码安装（CentOS）
  
  由于Python3.7+要求openssl 1.0.2+，而centos 6的openssl的版本是1.0.1，因此最高能安装的Python版本为3.6，否则就只能升级openssl版本。
  1. 下载源码：<https://www.python.org/downloads/source/>
  2. 解压：`tar zxvf xxx.tgz`
  3. 编译：`make`
  4. 安装：`make install`
  
  安装完成后，python3会出现在/usr/local/bin/python3

* Windows
  1. 下载安装包：<https://www.python.org/downloads/windows/>
  2. 根据安装向导指示安装
  3. 安装pip：`python -m ensurepip`

## 在Conda中安装Python

### 安装Conda
* Linux
  1. 下载安装脚本：`wget https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-x86_64.sh`
  2. 执行脚本：`sh Miniconda3-latest-Linux-x86_64.sh`
  3. 当提示`Do you wish the installer to initialize Miniconda3 by running conda init?`时输入`yes`，该步会将conda初始化脚本加入到`~/.bashrc`
  4. 登陆时调用bashrc：`vi ~/.bash_profile`，在末尾加入以下内容：

```bash
if [ -f ~/.bashrc ]; then
. ~/.bashrc
fi
```

* Windows
  1. 下载安装包：`https://repo.anaconda.com/miniconda/Miniconda3-latest-Windows-x86_64.exe`
  2. 根据安装向导指示安装
  3. 将conda目录`C:\Users\%User%\miniconda3\condabin`加入到环境变量，将%User%替换为实际用户名。
  4. 如果要在powershell中使用conda，需要执行命令：`conda init powershell`
  5. 如果powshell报错：`无法加载文件xxx，因为在此系统上禁止运行脚本`，则需要用管理员身份运行命令：`set-executionpolicy remotesigned`

安装完成后，conda会在控制台开启时自动激活conda环境，如果想要不自动激活，可以执行命令：`conda config --set auto_activate_base false`

### 创建Python环境
语法：`conda create -n <env_name> python=<python_version>`

例：`conda create -n py382 python=3.8.2 -y`

### Conda常用命令
* 查看env列表：`conda env list`
* 切换env：`conda activate py38`

## Pip相关命令

* 更新pip：`python -m pip install --upgrade pip`

* 安装python模块：`pip install <module_name>`

* 安装模块时指定版本：`pip install <module_name>==<version>`

* 安装模块时指定源：`pip install <module_name> -i <source_url>`

* 设置默认源：`pip config set global.index-url <source_url>`

### 常用pip源

* 阿里：`https://mirrors.aliyun.com/pypi/simple/`

* 腾讯：`https://mirrors.cloud.tencent.com/pypi/simple/`

* 清华：`https://pypi.tuna.tsinghua.edu.cn/simple`

* 中科大：`https://pypi.mirrors.ustc.edu.cn/simple/`

## Jupyter Notebook

* 启动：`jupyter notebook --ip=0.0.0.0 --port=<port> --no-browser`

* 后台运行：`nohup jupyter notebook --ip=0.0.0.0 --port=<port> --no-browser &`

* 查看：`jupyter notebook list`

* 关闭：`jupyter notebook stop`（关闭当前用户启动的notebook）

* 设置访问密码：`jupyter notebook password`

* 安装扩展
  ```
  pip install jupyter_nbextensions_configurator jupyter_contrib_nbextensions

  jupyter contrib nbextension install --user

  jupyter nbextensions_configurator enable --user
  ```

### 常用扩展
Edit-nbextensions config
* Codefolding：代码折叠
* Comment/Uncomment Hotkey：注释快捷键
* ExecuteTime: 执行时间
* Highlight selected word：已选文字高亮
* Hinterland：代码自动补全
  
  注：Hinterland只与ipython7.20+兼容，若不满足会有如下报错
  ```python
[IPKernelApp] ERROR | Exception in message handler:
Traceback (most recent call last):
  File "/home/ljx/miniconda3/envs/py382/lib/python3.8/site-packages/ipykernel/kernelbase.py", line 265, in dispatch_shell
    yield gen.maybe_future(handler(stream, idents, msg))
  File "/home/ljx/miniconda3/envs/py382/lib/python3.8/site-packages/tornado/gen.py", line 762, in run
    value = future.result()
  File "/home/ljx/miniconda3/envs/py382/lib/python3.8/site-packages/tornado/gen.py", line 234, in wrapper
    yielded = ctx_run(next, result)
  File "/home/ljx/miniconda3/envs/py382/lib/python3.8/site-packages/ipykernel/kernelbase.py", line 580, in complete_request
    matches = yield gen.maybe_future(self.do_complete(code, cursor_pos))
  File "/home/ljx/miniconda3/envs/py382/lib/python3.8/site-packages/ipykernel/ipkernel.py", line 356, in do_complete
    return self._experimental_do_complete(code, cursor_pos)
  File "/home/ljx/miniconda3/envs/py382/lib/python3.8/site-packages/ipykernel/ipkernel.py", line 381, in _experimental_do_complete
    completions = list(_rectify_completions(code, raw_completions))
  File "/home/ljx/miniconda3/envs/py382/lib/python3.8/site-packages/IPython/core/completer.py", line 484, in rectify_completions
    completions = list(completions)
  File "/home/ljx/miniconda3/envs/py382/lib/python3.8/site-packages/IPython/core/completer.py", line 1818, in completions
    for c in self._completions(text, offset, _timeout=self.jedi_compute_type_timeout/1000):
  File "/home/ljx/miniconda3/envs/py382/lib/python3.8/site-packages/IPython/core/completer.py", line 1861, in _completions
    matched_text, matches, matches_origin, jedi_matches = self._complete(
  File "/home/ljx/miniconda3/envs/py382/lib/python3.8/site-packages/IPython/core/completer.py", line 2029, in _complete
    completions = self._jedi_matches(
  File "/home/ljx/miniconda3/envs/py382/lib/python3.8/site-packages/IPython/core/completer.py", line 1373, in _jedi_matches
    interpreter = jedi.Interpreter(
  File "/home/ljx/miniconda3/envs/py382/lib/python3.8/site-packages/jedi/api/__init__.py", line 725, in __init__
    super().__init__(code, environment=environment,
TypeError: __init__() got an unexpected keyword argument 'column'
  ```
* isort formatter：isort格式化imports
* Live Markdown Preview：动态Markdown预览
* Snippets Menu：代码片段菜单
* Toggle all line numbers：切换行号显示
* Variable Inspector：变量监视 （**慎用，可能会影响性能**）
