
## 要求

使用PC端最新版Chrome或Edge浏览器。

访问地址：

<https://douyigkg.github.io/log-lottery/>

## 抽奖算法说明

本次活动抽奖系统采用浏览器原生加密安全随机算法（CSPRNG），确保每一位参与者都有平等的中奖机会。另外我们通过加权随机算法精准匹配每位用户的投票贡献，保障结果公平公正。

### 具体流程如下：
1. 随机数生成  
   使用浏览器提供的 crypto.getRandomValues() 接口生成 32位无符号整型随机数，该接口符合 Web Crypto API 标准，具备加密安全性，适用于高可信场景。
2. 映射为浮点随机值 [0, 1)  
   将原始整型随机值除以 4294967296（即 2^32），转换为一个 [0, 1) 区间的浮点数，确保每个用户被选中的概率完全相等。
3. 加权随机  
   按照票数权重分配中奖机会。

### 关于crypto.getRandomValues()
● crypto.getRandomValues() 使用的是 CSPRNG（Cryptographically Secure PseudoRandom Number Generator），CSPRNG 虽然本质上也是伪随机数生成器，但它：

    ○ 使用高质量的熵作为内部种子（由操作系统管理）
    ○ 种子不可预测、不可控、也不对外暴露
    ○ 输出结果无法被反推

● crypto.getRandomValues() 使用的是操作系统级的 熵源（entropy source），这些熵来自硬件或系统层面的真实随机性来源（如键盘输入时间、鼠标移动、CPU 噪声等）


## 技术

- vue3
- threejs
- indexdb
- pinia
- daisyui

## 开发

安装依赖

```bash
pnpm i
or
npm install
```

开发运行

```bash
pnpm dev
or
npm run dev
```

打包

```bash
pnpm build
or
npm run build
```

预览

```bash
pnpm preview
or
npm run preview
```

若想直接以打开html文件的方式运行，请执行以下命令进行打包。打包完成后在dist目录中直接打开index.html即可。

```bash
pnpm build:file
or
npm run build:file
```
