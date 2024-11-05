# LaTex_Code-To-Img-API

 将LaTex公式代码转换为图片的API。Translate LaTeX code to image API.
 
 公共API:api.hk.jmstrand.cn

## 环境要求

- Node.js >= 14.x
- npm >= 6.x（推荐）或 yarn >= 1.x
- ImageMagick
- MikTex

## 食用方法

### 安装依赖

```bash
npm install
# 或
cnpm install
# 或
yarn install
```

### 配置config.js

1. port为服务运行的端口，默认为9000。
2. ImageMagick为图片处理库，请根据系统选择合适的命令。一般Windows下为magick，Mac/Linux下为convert。

### 启动服务

```bash
npm run start
# 或
yarn start
```

### 访问API

此链接可访问public下的index.html查看API的使用方法。

```bash
http://localhost:9000
```

传递参数latex_code，值为LaTex公式代码。

```bash
http://localhost:9000/latex_to_image?latex_code=<your_latex_code>
```

例如：

```bash
http://localhost:9000/latex_to_image?latex_code=\frac{1}{2}
```

将会返回一个图片，内容为：

![\frac{1}{2}](https://latex.codecogs.com/png.latex?\frac{1}{2})
