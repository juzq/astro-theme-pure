---
title: 用LaTeX书写数学公式
publishDate: 2019-02-23
description: '为了更方便的书写数学公式，有多种语法支持，主要有TeX/LaTeX, MathML和AsciiMath，目前使用最多的是LaTeX'
tags:
  - other
---

## 公式渲染

虽然写好了LaTeX语法的数学公式，但是还需要渲染支持，才能将LaTeX语法渲染为公式，目前主流的渲染引擎为[MathJax](https://www.mathjax.org/)。Github默认是不支持渲染LaTeX的（Gitee支持），为了让Github支持渲染，还需要安装chrome浏览器插件[MathJax 3 Plugin for Github](https://chrome.google.com/webstore/detail/mathjax-3-plugin-for-gith/peoghobgdhejhcmgoppjpjcidngdfkod)。（FireFox暂时没有找到插件支持）

## LaTeX语法

### 界定符

公式分为陈列式（displayed mathematics）和行内式（in-line mathematics），有不同的界定符。

- 陈列式：`$$ ... $$`或`\[ ... \]`

  例：

  $$ y = ax_1 + bx_2 $$

- 行内式：`$ ... $`或`\( ... \)`

  例：

  $ y = ax_1 + bx_2 $

**注：**

1. MathJax默认不渲染`$ ... $`类型，防止干扰文章中正常的`$`符号显示，[这里](https://docs.mathjax.org/en/latest/input/tex/delimiters.html#tex-delimiters)有详细解释。
2. 在MarkDown中由于`\`需要转义，因此需要写成`$ ... $`和`\\[ ... \\]`

### 常用数学符号

#### 修饰符

| 符号名 | 符号                 | 语法               | 备注                    |
| :----- | :------------------- | :----------------- | ----------------------- |
| 上标   | $ x^2 $              | `x^2`              |                         |
| 下标   | $ x_1 $              | `x_1`              |                         |
| 方括号 | $ \left [ \right ] $ | `\left [ \right ]` | 方括号中的内容从`[`开始 |
| 分式   | $ \frac{1}{x} $      | `\frac{1}{x}`      |                         |
| 平均数 | $ \overline{x} $     | `\overline{x}`     |                         |

#### 运算符

| 符号名  | 符号                       | 语法                    | 备注                       |
| :------ | :------------------------- | :---------------------- | -------------------------- |
| 叉乘    | $ \times $                 | `\times`                |                            |
| 点乘    | $ \cdot $                  | `\cdot`                 |                            |
| 星乘    | $ \ast $                   | `\ast`                  |                            |
| 除号    | $ \div $                   | `\div`                  |                            |
| 约等于  | $ \approx $                | `\approx`               |                            |
| 平方根  | $ \sqrt{x} $               | `\sqrt{x}`              |                            |
| n次方根 | $ \sqrt[n]{x} $            | `\sqrt[n]{x}`           | [n]省略时为平方根          |
| 对数    | $ \log(x) $                | `\log(x)`               |                            |
| 累加    | $ \sum\_{0}^{\infty}{x} $  | `\sum_{0}^{\infty}{x}`  | 起始值为下标，终止值为上标 |
| 累乘    | $ \prod\_{1}^{\infty}{x} $ | `\prod_{1}^{\infty}{x}` | 起始值为下标，终止值为上标 |

#### 微积分

| 符号名 | 符号                                  | 语法                                | 备注                       |
| :----- | :------------------------------------ | :---------------------------------- | -------------------------- |
| 极限   | $ \lim^{}\_{x \to 0}{x} $             | `\lim^{}_{x \to 0}{x}`              | 优先用下标                 |
| 积分   | $ \int^{\infty}\_{0}{xdx} $           | `\int^{\infty}_{0}{xdx}`            | 起始值为下标，终止值为上标 |
| 偏导   | $ \frac{\partial (x+1)}{\partial x} $ | `\frac{\partial (x+1)}{\partial x}` |                            |
| 梯度   | $ \nabla $                            | `\nabla`                            |                            |

#### 集合

| 符号名 | 符号       | 语法     | 备注 |
| :----- | :--------- | :------- | ---- |
| 属于   | $ \in $    | `\in`    |      |
| 不属于 | $ \notin $ | `\notin` |      |

注：当符号的对象为表达式时，需要用`{}`括起来，例如$ x*{t+1} $需要写成`x*{t+1}`

### 希腊字符

| 字符（大） |    语法    | \|  | 字符（小） |    语法    |
| :--------: | :--------: | --- | :--------: | :--------: |
|     A      |    `A`     | \|  |  $\alpha$  |  `\alpha`  |
|     B      |    `B`     | \|  |  $\beta$   |  `\beta`   |
|  $\Gamma$  |  `\Gamma`  | \|  |  $\gamma$  |  `\gamma`  |
|  $\Delta$  |  `\Delta`  | \|  |  $\delta$  |  `\delta`  |
|     E      |    `E`     | \|  | $\epsilon$ | `\epsilon` |
|     Z      |    `Z`     | \|  |  $\zeta$   |  `\zeta`   |
|     H      |    `H`     | \|  |   $\eta$   |   `\eta`   |
|  $\Theta$  |  `\Theta`  | \|  |  $\theta$  |  `\theta`  |
|     I      |    `I`     | \|  |  $\iota$   |  `\iota`   |
|     K      |    `K`     | \|  |  $\kappa$  |  `\kappa`  |
| $\Lambda$  | `\Lambda`  | \|  | $\lambda$  | `\lambda`  |
|     N      |    `N`     | \|  |   $\nu$    |   `\nu`    |
|   $\Xi$    |   `\Xi`    | \|  |   $\xi$    |   `\xi`    |
|     O      |    `O`     | \|  | $\omicron$ | `\omicron` |
|   $\Pi$    |   `\Pi`    | \|  |   $\pi$    |   `\pi`    |
|     P      |     P      | \|  |   $\rho$   |   `\rho`   |
|  $\Sigma$  |  `\Sigma`  | \|  |  $\sigma$  |  `\sigma`  |
|     T      |     T      | \|  |   $\tau$   |   `\tau`   |
| $\Upsilon$ | `\upsilon` | \|  | $\upsilon$ | `\upsilon` |
|   $\phi$   |   `\phi`   | \|  |   $\phi$   |   `\phi`   |
|     X      |     X      | \|  |   $\chi$   |   `\chi`   |
|   $\Psi$   |   `\Psi`   | \|  |   $\psi$   |   `\psi`   |
|  $\Omega$  |  `\Omega`  | \|  |  $\omega$  |  `\omega`  |
