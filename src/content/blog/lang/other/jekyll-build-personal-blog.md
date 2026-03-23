---
title: Jekyll搭建个人博客
publishDate: 2017-07-19
description: '0成本搭建博客'
tags:
  - other
---

## Ruby环境安装

Jekyll是用Ruby语言实现的，要使用Jekyll我们首先就需要先安装Ruby。

### Linux系统

由于jekyll依赖ruby开发环境，并且要求ruby版本>=2.1，因此无法使用centos yum安装。根据[RVM官网](https://rvm.io/)的指引，使用RVM安装Ruby环境的步骤如下:

1. 安装RVM

- 下载签名
  `gpg --keyserver hkp://keys.gnupg.net --recv-keys 409B6B1796C275462A1703113804BB82D39DC0E3 7D2BAF1CF37B13E2069D6956105BD0E739499BDB`
- 下载文件<br>
  `\curl -sSL https://get.rvm.io | bash -s stable`
- 执行文件<br>
  `source /home/ljx/.rvm/scripts/rvm`

2. 查看可安装的ruby版本<br>
   `rvm list known|grep ruby`

3. 安装指定的ruby版本<br>
   `rvm install 2.5`

4. 测试<br>
   `ruby -v`

5. 更新ruby源<br>
   `gem sources --add https://gems.ruby-china.com/ --remove https://rubygems.org/`

6. 查看当前ruby源<br>
   `gem sources -l`

### Windows系统

下载[RubyInstaller](https://rubyinstaller.org/)，版本需要选带Devkit的版本，例如：[Ruby+Devkit 2.5.5](https://github.com/oneclick/rubyinstaller2/releases/download/RubyInstaller-2.5.5-1/rubyinstaller-devkit-2.5.5-1-x64.exe)，因为安装完以后，使用bundle安装gem使需要Devkit带的编译环境才行。安装过程直接按照默认的设置，直接点下一步即可，这里不再赘述。

### Mac环境

虽然Mac系统自带了ruby环境，但是不建议使用，详情可以参考[这篇文章](https://www.moncefbelyamani.com/why-you-shouldn-t-use-the-system-ruby-to-install-gems-on-a-mac/)。

1. 安装HomeBrew（已安装可以跳过）

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

2. 安装chruby和ruby-install

```bash
brew install chruby ruby-install xz
```

3. 安装ruby
   选择适合你的ruby版本，并使用命令：

```bash
ruby-install ruby 3.1.3
```

4. 添加到环境变量

```bash
echo "source $(brew --prefix)/opt/chruby/share/chruby/chruby.sh" >> ~/.zshrc
echo "source $(brew --prefix)/opt/chruby/share/chruby/auto.sh" >> ~/.zshrc
echo "chruby ruby-3.1.3" >> ~/.zshrc # run 'chruby' to see actual version
```

> 参考：<https://jekyllrb.com/docs/installation/macos/>

## jekyll安装

`gem install jekyll bundler`

测试是否安装成功：

```
C:\Users\Administrator>jekyll -v
jekyll 3.8.6
```

若打印出了jekyll的版本，则代表jekyll已经安装成功了。

若遇到报错：`Could not find public_suffix-4.0.6 in any of the sources...`，则执行：

```
gem update
bundler install
bundler update
```

这样我们的jekyll就安装完毕，就可以选择一个模板开始写博客了，最后再上传到github就搞定了。
