# 😊 实时人脸情绪识别

基于 AI 的浏览器端实时多人脸情绪检测系统，使用 face-api.js 和 TensorFlow.js 实现。

## 📖 项目简介

这是一个纯前端的人脸情绪识别应用，可以通过摄像头实时检测画面中的多张人脸，并识别每个人的情绪状态。所有计算在浏览器本地完成，不上传任何数据，完全保护用户隐私。

**应用场景：**
- 情绪分析研究
- 人机交互体验优化
- 教育培训（情绪识别教学）
- 娱乐互动应用

## ✨ 功能特性

- 📹 **实时摄像头捕获** - 自动请求摄像头权限，支持 1280×720 高清分辨率
- 👥 **多人脸同时检测** - 使用 `detectAllFaces` API，可同时识别画面中的多张人脸
- 😊 **7 种情绪识别** - 平静、开心、伤心、愤怒、恐惧、厌恶、惊讶
- 🎨 **彩色可视化标注** - 不同情绪对应不同颜色的边框和标签
- 📊 **情绪概率柱状图** - 每张人脸旁显示所有情绪的实时概率分布
- ⚡ **高性能检测** - 使用 requestAnimationFrame 实现连续检测，帧率可达 15-30 FPS
- 📱 **响应式设计** - 支持桌面和移动端，自适应不同屏幕尺寸
- 🔒 **隐私安全** - 所有计算在浏览器本地完成，不上传任何数据到服务器
- 🌐 **无需安装** - 纯网页应用，打开即用

## 🛠️ 技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| **face-api.js** | 0.22.2 | 人脸检测和情绪识别核心库 |
| **TensorFlow.js** | - | 机器学习推理引擎（face-api.js 依赖） |
| **HTML5** | - | 页面结构 |
| **CSS3** | - | 样式和动画 |
| **JavaScript (ES6+)** | - | 核心业务逻辑 |
| **Canvas API** | - | 绘制人脸边框和标签 |
| **WebRTC (getUserMedia)** | - | 摄像头访问 |

**AI 模型：**
- `tiny_face_detector` - 轻量级人脸检测模型（inputSize: 224）
- `face_expression` - 情绪识别模型（7 种情绪分类）

## 📁 项目结构

```
face-emotion-detector/
├── index.html          # 主页面（HTML 结构）
├── style.css           # 样式文件（深色主题 + 响应式）
├── script.js           # 核心逻辑（人脸检测 + 情绪识别）
├── face-api.min.js     # face-api.js 库（648KB）
└── README.md           # 项目文档（本文件）
```

**文件说明：**
- `index.html` - 包含视频容器、Canvas 叠加层、状态信息栏、错误提示等 UI 元素
- `style.css` - 深蓝色渐变背景、毛玻璃效果卡片、加载动画、响应式布局
- `script.js` - 模型加载、摄像头调用、人脸检测循环、Canvas 绘图、FPS 计算
- `face-api.min.js` - 本地缓存的 face-api.js 库，避免 CDN 加载延迟

## 🚀 快速开始

### 环境要求

- **浏览器**：Chrome 90+、Firefox 88+、Edge 90+（需支持 WebRTC 和 ES6）
- **Python**：3.x（用于启动本地 HTTP 服务器）
- **硬件**：摄像头设备（内置或外接）

> ⚠️ **重要**：由于浏览器安全策略，摄像头访问必须在 HTTP/HTTPS 协议下进行，不能直接双击打开 HTML 文件。

### 安装步骤

1. **下载项目**
   ```bash
   # 如果是 Git 仓库
   git clone https://github.com/yuannuonuo/face-emotion-detector
   cd face-emotion-detector
   
   # 或直接下载 ZIP 并解压到桌面
   ```

2. **确认文件完整**
   ```bash
   ls -lh
   # 应该看到：index.html, style.css, script.js, face-api.min.js, README.md
   ```

### 启动项目

**方法 1：使用 Python 内置服务器（推荐）**

```bash
cd ~/Desktop/face-emotion-detector
python3 -m http.server 8080
```

**方法 2：使用 Node.js http-server**

```bash
npm install -g http-server
cd ~/Desktop/face-emotion-detector
http-server -p 8080
```

**方法 3：使用 PHP 内置服务器**

```bash
cd ~/Desktop/face-emotion-detector
php -S localhost:8080
```

启动成功后，在浏览器中打开：

```
http://localhost:8080
```

### 关闭服务器

**方法 1：终端快捷键**
```bash
# 在运行服务器的终端窗口按：
Ctrl + C
```

**方法 2：命令行终止**
```bash
# 查找并终止占用 8080 端口的进程
lsof -ti:8080 | xargs kill

# 或强制终止
lsof -ti:8080 | xargs kill -9
```

## 📱 使用说明

### 基本流程

1. **打开网页** - 浏览器访问 `http://localhost:8080`
2. **允许权限** - 浏览器会弹出摄像头权限请求，点击"允许"
3. **等待加载** - 页面会显示"正在加载 AI 模型..."（约 2-5 秒）
4. **开始检测** - 模型加载完成后自动启动摄像头并开始实时检测
5. **查看结果** - 画面中的人脸会被彩色边框标注，显示情绪和置信度

### 界面说明

**顶部信息栏：**
- **状态** - 显示当前系统状态（加载模型 / 启动摄像头 / 检测中 / 出错）
- **检测人脸** - 当前画面中检测到的人脸数量
- **帧率** - 实时 FPS（每秒检测帧数）

**视频画面：**
- 摄像头实时画面
- 彩色边框标注每张人脸
- 边框上方显示情绪标签和置信度（如"开心 85%"）
- 人脸右侧显示 7 种情绪的概率柱状图

**底部图例：**
- 展示 7 种情绪及其对应颜色

## 🎨 情绪类型

| 情绪 | 英文 | 颜色 | 色值 | 说明 |
|------|------|------|------|------|
| 平静 | neutral | 青色 | #00BCD4 | 面部表情平和，无明显情绪波动 |
| 开心 | happy | 绿色 | #4CAF50 | 微笑、大笑等积极情绪 |
| 伤心 | sad | 蓝色 | #2196F3 | 悲伤、沮丧等消极情绪 |
| 愤怒 | angry | 红色 | #f44336 | 生气、愤怒等强烈负面情绪 |
| 恐惧 | fearful | 紫色 | #9C27B0 | 害怕、恐惧等情绪 |
| 厌恶 | disgusted | 橙色 | #FF9800 | 厌恶、反感等情绪 |
| 惊讶 | surprised | 黄色 | #FFEB3B | 惊讶、震惊等情绪 |

## ⚙️ 配置说明

### 调整检测参数

编辑 `script.js` 中的配置：

```javascript
// 模型输入尺寸（越小越快，但精度降低）
// 可选值：128, 160, 224, 320, 416, 512, 608
const options = new faceapi.TinyFaceDetectorOptions({ 
  inputSize: 224,        // 默认 224，推荐 224-320
  scoreThreshold: 0.4    // 检测阈值，越低越敏感（0-1）
});

// 摄像头分辨率
const stream = await navigator.mediaDevices.getUserMedia({
  video: {
    width: { ideal: 1280 },   // 理想宽度
    height: { ideal: 720 },   // 理想高度
    facingMode: 'user',       // 'user' 前置 / 'environment' 后置
  },
});
```

### 性能优化建议

| 场景 | inputSize | scoreThreshold | 分辨率 | 预期 FPS |
|------|-----------|----------------|--------|----------|
| 高性能 | 128-160 | 0.5 | 640×480 | 25-30 |
| 平衡 | 224 | 0.4 | 1280×720 | 15-20 |
| 高精度 | 320-416 | 0.3 | 1920×1080 | 8-12 |

## 🐛 常见问题

### 1. 摄像头无法启动

**问题：** 页面显示"摄像头权限被拒绝"或"未检测到摄像头设备"

**解决方案：**
- 检查浏览器地址栏左侧的摄像头图标，确认权限已允许
- 确认摄像头未被其他程序（如 Zoom、Skype）占用
- 在浏览器设置中重置摄像头权限：
  - Chrome: `设置 > 隐私和安全 > 网站设置 > 摄像头`
  - Firefox: `设置 > 隐私与安全 > 权限 > 摄像头`
- 尝试重启浏览器或电脑

### 2. 检测速度慢 / 帧率低

**问题：** FPS 显示低于 10，画面卡顿

**解决方案：**
- 降低 `inputSize` 参数（如改为 160 或 128）
- 降低摄像头分辨率（如改为 640×480）
- 关闭其他占用 CPU/GPU 的程序
- 使用性能更好的浏览器（Chrome 通常比 Firefox 快）
- 检查电脑是否处于省电模式

### 3. 模型加载失败

**问题：** 页面显示"AI 模型加载失败，请检查网络连接"

**解决方案：**
- 检查网络连接是否正常
- 确认可以访问 `cdn.jsdelivr.net`（模型托管在 GitHub + jsDelivr CDN）
- 如果在中国大陆，可能需要使用代理或更换 CDN 地址
- 检查浏览器控制台（F12）查看具体错误信息

### 4. 检测不到人脸

**问题：** 摄像头正常，但画面中的人脸没有被标注

**解决方案：**
- 确保光线充足（避免逆光或过暗）
- 调整人脸角度（正面效果最好，侧脸可能检测不到）
- 降低 `scoreThreshold` 参数（如改为 0.3）
- 确保人脸占画面的合理比例（不要太小或太大）
- 检查是否有遮挡物（口罩、墨镜等会影响检测）

### 5. 情绪识别不准确

**问题：** 检测到人脸，但情绪标签不符合实际

**说明：**
- 情绪识别是基于面部表情的机器学习模型，准确率约 70-85%
- 模型在特定数据集上训练，可能对某些人群或表情不够敏感
- 中性表情（平静）容易被误判为其他情绪
- 夸张的表情识别效果更好

**改进建议：**
- 使用更大的模型（如 `ssd_mobilenetv1` 替代 `tiny_face_detector`）
- 收集数据重新训练模型（需要机器学习知识）

### 6. 浏览器兼容性问题

**问题：** 某些浏览器无法运行

**支持情况：**
- ✅ Chrome 90+ （推荐）
- ✅ Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+（macOS/iOS）
- ❌ IE 11（不支持 ES6 和 WebRTC）

**解决方案：**
- 升级浏览器到最新版本
- 使用 Chrome 或 Edge 浏览器

## 🔒 隐私说明

本项目高度重视用户隐私：

- ✅ **本地计算** - 所有人脸检测和情绪识别在浏览器本地完成
- ✅ **不上传数据** - 摄像头画面不会发送到任何服务器
- ✅ **不存储数据** - 不保存任何图片或视频文件
- ✅ **开源透明** - 所有代码公开，可审计
- ✅ **无需注册** - 不收集任何个人信息

**技术实现：**
- 使用 WebRTC `getUserMedia` API 直接访问摄像头
- AI 模型从 CDN 加载到浏览器内存
- 推理计算使用 TensorFlow.js 在本地执行
- 没有任何网络请求发送用户数据

## 📄 许可证

MIT License

Copyright (c) 2026

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

## 🙏 致谢

本项目基于以下开源项目：

- **[face-api.js](https://github.com/justadudewhohacks/face-api.js)** - Vincent Mühler 开发的 JavaScript 人脸识别库
- **[TensorFlow.js](https://www.tensorflow.org/js)** - Google 开发的浏览器端机器学习框架
- **[jsDelivr](https://www.jsdelivr.com/)** - 免费的 CDN 服务，托管 AI 模型文件

## 📚 扩展阅读

- [face-api.js 官方文档](https://github.com/justadudewhohacks/face-api.js)
- [TensorFlow.js 教程](https://www.tensorflow.org/js/tutorials)
- [WebRTC getUserMedia API](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia)
- [Canvas API 文档](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)

## 🔗 相关链接

- 项目仓库：[GitHub]()
- 在线演示：[Demo]()
- 问题反馈：[Issues]()

---

**如有问题或建议，欢迎提交 Issue 或 Pull Request！**
