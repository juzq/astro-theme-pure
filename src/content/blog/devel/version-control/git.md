---
title: Git常用命令
publishDate: 2020-05-28
description: git是目前最常用的版本管理工具
tags:
  - git
---

## 暂存

### 取消stage

`git restore --staged <file_name>`或`git reset HEAD <file_name>`

### 删除未stage的已修改（删除）的文件

- 单个文件：`git checkout <file_name>`

- 所有文件：`git checkout .`

### 删除未stage的新增的文件

`git clean -df`

---

## 回退

### 修改上次提交信息或作者

`git commit --amend --author="新作者名 <新邮箱@example.com>"`

执行后会自动打开编辑器，你可以顺便修改提交信息，保存退出即可。

### 撤回提交

`git reset HEAD~{n}`

其中n替换为撤回的具体提交的个数，撤回后本地仓库变为未提交状态，需重新提交。若已推送到远程仓库，则必须git push -f来覆盖远程仓库（慎用，可能会将别人的提交覆盖）

### 回退到某个提交

`git reset --hard {commit_id}`

其中commit_id为需要回退到的提交id。若已推送到远程仓库，则必须git push -f来覆盖远程仓库（慎用，可能会将别人的提交覆盖）

### 用远程仓库强行覆盖本地仓库

`git reset --hard origin/master`

---

## 合并

### Merge（分支）

若分支B是在分支A上创建的，想要将分支B上的提交合并到分支A中

1. 检出分支A：`git checkout A`

2. 合并：`git merge B`

注：若A没有进行过其他提交，则可以直接快速合并（实际上只是修改分支A的指针）。如果A进行过其他提交，则会进行三方合并（A、B、分岔起点），中途可能会产生冲突，解决冲突后再stage (git add xx) ，再提交即可。

### Merge（仓库）

若仓库B是由仓库A fork出来的，想要将A中的提交合并到B中

1. 将A添加为远程仓库：`git remote add upstream xxx`

2. 将upstream取回本地：`git fetch upsteam`

3. 合并：`git merge upsteam/master`

注：同样可能产生冲突，若有冲突，解决即可。

### Rebase

- 分支变基

  若分支B是在分支A上创建的，创建后A与B均进行了多次提交，想要直接将B合并到A会产生提交记录分岔，将B变基到A即可避免分岔的问题，步骤：

  1. 检出分支A：`git checkout A`

  2. 将B变基到A：`git rebase A B`

  3. 合并B：`git merge B`

- 解决pull后分岔：`git rebase`

- pull并解决分岔：`git pull --rebase`

- 合并多次提交：`git rebase -i HEAD~{n}`

### Cherry-Pick

使用cherry-pick可以将某个分支的某个提交（而不是整个分支）合并到当前分支

1. 拷贝想要合并的某个提交id

2. 切换到想要合并到的分支

3. 合并：`git cherry-pick xxx`

## 远程仓库

### 设置upstream分支

设置upstream分支，可以在push时省略remote仓库名和分支

`git push --set-upstream xxx xxx`

### 删除远程仓库分支

`git push --delete origin <branch_name>`

### 同步远程仓库已删除的分支

`git remote prune origin`

## 忽略修改

忽略某文件的修改，就好像其没有被修改过一样

- 忽略：`git update-index --assume-unchanged <file>`

- 取消忽略：`git update-index --no-assume-unchanged <file>`
