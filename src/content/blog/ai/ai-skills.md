### 插件

Claude可以通过安装插件来使用插件附带的skill。

1. 添加marketplace

   ```
   /plugin marketplace add obra/superpowers-marketplace
   ```

2. 安装插件
	1. 使用命令安装

	   ```
	   /plugin install superpowers@superpowers-marketplace
	   ```

	2. 浏览安装
	   - 使用`/plugin`进入插件管理。
	   - 可以选`Discover`进行搜索或者选`Marketplaces`根据市场来选。
	   - 选择市场后，再选择`Browse plugins`来选择市场中的插件。
	   - 按空格勾选插件，再按i即可安装插件。

3. 安装后使用命令`/reload-plugins`重载插件或者重新打开claude即可使用插件。
4. 要使用插件当中的skill，**必须退出claude**，重新进入。

> claude自带了官方的market：claude-plugins-official，无需再添加，可以直接安装其中的插件。

### 配置

也可以将skill放入指定路径即可使用，一般适用于自定义插件。

#### 项目配置

- claude专用：`.claude/skills/<name>/SKILL.md`
- 大部分AI工具通用：`.agents/skills/<name>/SKILL.md`
- opencode专用：`.opencode/skills/<name>/SKILL.md`

#### 全局配置

- claude专用：`~/.config/opencode/skills/<name>/SKILL.md`
- 大部分AI工具通用：`~/.claude/skills/<name>/SKILL.md`
- opencode专用：`~/.agents/skills/<name>/SKILL.md`

注意：`<name>`必须和`SKILL.md`中的`name`*完全一致*。

### 使用skill

在claude code中，使用命令：`/<skill_name>`即可（skill_name为skill的名字）。

例如：`/xlsx @野外补兵细案.xlsx 总结下这个文件内容`
