/*
 * 实时人脸情绪识别 - 核心逻辑
 * 
 * 功能模块：
 * 1. 配置和常量定义 - MODEL_URL, EMOTION_MAP
 * 2. DOM 元素获取 - video, canvas, 状态元素
 * 3. FPS 计算 - updateFPS()
 * 4. 错误处理 - showError(), setStatus()
 * 5. 情绪分析 - getDominantEmotion()
 * 6. Canvas 绘图 - drawDetections(), roundRect(), drawEmotionBars()
 * 7. 人脸检测循环 - startDetection() -> detect()
 * 8. 主流程控制 - main()
 * 
 * 函数调用关系：
 * main() 
 *   ├─> 加载模型 (faceapi.nets.*.loadFromUri)
 *   ├─> 启动摄像头 (getUserMedia)
 *   └─> startDetection()
 *         └─> detect() (递归调用 requestAnimationFrame)
 *               ├─> faceapi.detectAllFaces() - 检测所有人脸
 *               ├─> drawDetections() - 绘制检测结果
 *               │     ├─> getDominantEmotion() - 获取主要情绪
 *               │     ├─> roundRect() - 绘制圆角矩形
 *               │     └─> drawEmotionBars() - 绘制情绪柱状图
 *               └─> updateFPS() - 更新帧率显示
 */

// ===== 配置常量 =====

/**
 * AI 模型文件的 CDN 地址
 * 包含三个模型：
 * - tiny_face_detector: 轻量级人脸检测模型
 * - face_landmark_68: 68 个面部特征点检测（本项目未使用）
 * - face_expression: 情绪识别模型（7 种情绪）
 */
const MODEL_URL = 'https://cdn.jsdelivr.net/gh/justadudewhohacks/face-api.js@master/weights';

/**
 * 检测间隔（毫秒）- 已废弃
 * 当前使用 requestAnimationFrame 实现连续检测，此常量保留用于参考
 */
const DETECTION_INTERVAL = 150;

// ===== 情绪映射表 =====

/**
 * 情绪中英文映射和颜色配置
 * face-api.js 返回的情绪是英文，这里映射为中文并指定显示颜色
 * 
 * 7 种情绪：
 * - neutral: 平静（青色）
 * - happy: 开心（绿色）
 * - sad: 伤心（蓝色）
 * - angry: 愤怒（红色）
 * - fearful: 恐惧（紫色）
 * - disgusted: 厌恶（橙色）
 * - surprised: 惊讶（黄色）
 */
const EMOTION_MAP = {
  neutral:   { label: '平静', color: '#00BCD4' }, // 青色
  happy:     { label: '开心', color: '#4CAF50' }, // 绿色
  sad:       { label: '伤心', color: '#2196F3' }, // 蓝色
  angry:     { label: '愤怒', color: '#f44336' }, // 红色
  fearful:   { label: '恐惧', color: '#9C27B0' }, // 紫色
  disgusted: { label: '厌恶', color: '#FF9800' }, // 橙色
  surprised: { label: '惊讶', color: '#FFEB3B' }, // 黄色
};

// ===== DOM 元素 =====
const video = document.getElementById('video');
const overlay = document.getElementById('overlay');
const statusOverlay = document.getElementById('statusOverlay');
const statusText = document.getElementById('statusText');
const statusValue = document.getElementById('statusValue');
const faceCountEl = document.getElementById('faceCount');
const fpsValueEl = document.getElementById('fpsValue');
const errorContainer = document.getElementById('errorContainer');
const errorText = document.getElementById('errorText');

// ===== FPS 计算 =====
let lastTime = performance.now();
let frameCount = 0;
let fps = 0;

function updateFPS() {
  frameCount++;
  const now = performance.now();
  if (now - lastTime >= 1000) {
    fps = frameCount;
    frameCount = 0;
    lastTime = now;
    fpsValueEl.textContent = fps;
  }
}

// ===== 显示错误 =====
function showError(message) {
  statusOverlay.classList.add('hidden');
  errorContainer.style.display = 'block';
  errorText.textContent = message;
  statusValue.textContent = '出错';
  statusValue.style.color = '#f44336';
}

// ===== 更新状态 =====
function setStatus(text) {
  statusText.textContent = text;
}

// ===== 获取主要情绪 =====
function getDominantEmotion(expressions) {
  let maxScore = 0;
  let dominant = 'neutral';
  for (const [emotion, score] of Object.entries(expressions)) {
    if (score > maxScore) {
      maxScore = score;
      dominant = emotion;
    }
  }
  return { emotion: dominant, score: maxScore };
}

// ===== 绘制检测结果 =====
function drawDetections(detections, displaySize) {
  const ctx = overlay.getContext('2d');
  ctx.clearRect(0, 0, overlay.width, overlay.height);

  const resized = faceapi.resizeResults(detections, displaySize);

  resized.forEach((detection) => {
    const { x, y, width, height } = detection.detection.box;
    const expressions = detection.expressions;
    const { emotion, score } = getDominantEmotion(expressions);
    const emotionInfo = EMOTION_MAP[emotion] || EMOTION_MAP.neutral;

    // 画人脸边框
    ctx.strokeStyle = emotionInfo.color;
    ctx.lineWidth = 3;
    ctx.shadowColor = emotionInfo.color;
    ctx.shadowBlur = 8;
    ctx.strokeRect(x, y, width, height);
    ctx.shadowBlur = 0;

    // 画标签背景
    const labelText = `${emotionInfo.label} ${Math.round(score * 100)}%`;
    ctx.font = 'bold 14px -apple-system, "PingFang SC", "Microsoft YaHei", sans-serif';
    const textWidth = ctx.measureText(labelText).width;
    const labelHeight = 24;
    const labelY = y - labelHeight - 4;

    ctx.fillStyle = emotionInfo.color;
    roundRect(ctx, x, labelY, textWidth + 16, labelHeight, 6);
    ctx.fill();

    // 画标签文字
    ctx.fillStyle = emotion === 'surprised' ? '#333' : '#fff';
    ctx.fillText(labelText, x + 8, labelY + 17);

    // 画情绪柱状图（人脸右侧）
    drawEmotionBars(ctx, expressions, x + width + 8, y, height);
  });
}

// ===== 画圆角矩形 =====
function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

// ===== 画情绪概率条 =====
function drawEmotionBars(ctx, expressions, startX, startY, faceHeight) {
  const barMaxWidth = 60;
  const barHeight = 10;
  const gap = 4;
  const emotions = Object.keys(EMOTION_MAP);
  const totalHeight = emotions.length * (barHeight + gap);

  // 如果柱状图会超出画面，就不画
  if (startX + barMaxWidth + 50 > overlay.width) return;

  const offsetY = startY + (faceHeight - totalHeight) / 2;

  emotions.forEach((emotion, i) => {
    const info = EMOTION_MAP[emotion];
    const value = expressions[emotion] || 0;
    const y = offsetY + i * (barHeight + gap);

    // 标签
    ctx.font = '10px -apple-system, "PingFang SC", sans-serif';
    ctx.fillStyle = '#ccc';
    ctx.fillText(info.label, startX, y + barHeight - 1);

    const barX = startX + 28;

    // 背景条
    ctx.fillStyle = 'rgba(255,255,255,0.1)';
    roundRect(ctx, barX, y, barMaxWidth, barHeight, 3);
    ctx.fill();

    // 前景条
    ctx.fillStyle = info.color;
    const w = Math.max(2, value * barMaxWidth);
    roundRect(ctx, barX, y, w, barHeight, 3);
    ctx.fill();
  });
}

// ===== 启动检测循环 =====
function startDetection() {
  const displaySize = {
    width: video.videoWidth,
    height: video.videoHeight,
  };

  overlay.width = video.videoWidth;
  overlay.height = video.videoHeight;
  faceapi.matchDimensions(overlay, displaySize);

  const options = new faceapi.TinyFaceDetectorOptions({ inputSize: 224, scoreThreshold: 0.4 });
  let detecting = false;

  async function detect() {
    if (!detecting) {
      detecting = true;
      try {
        const detections = await faceapi
          .detectAllFaces(video, options)
          .withFaceExpressions();

        drawDetections(detections, displaySize);
        faceCountEl.textContent = detections.length;
        updateFPS();
      } catch (err) {
        console.error('检测出错:', err);
      }
      detecting = false;
    }
    requestAnimationFrame(detect);
  }

  requestAnimationFrame(detect);
}

// ===== 主流程 =====
async function main() {
  // 检查浏览器支持
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    showError('您的浏览器不支持摄像头功能，请使用最新版 Chrome、Firefox 或 Edge。');
    return;
  }

  // 1. 加载模型
  try {
    setStatus('正在加载 AI 模型...');
    statusValue.textContent = '加载模型';

    await Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
      faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
      faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
    ]);
  } catch (err) {
    console.error('模型加载失败:', err);
    showError('AI 模型加载失败，请检查网络连接后重试。');
    return;
  }

  // 2. 启动摄像头
  try {
    setStatus('正在启动摄像头...');
    statusValue.textContent = '启动摄像头';

    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        width: { ideal: 1280 },
        height: { ideal: 720 },
        facingMode: 'user',
      },
    });

    video.srcObject = stream;
  } catch (err) {
    console.error('摄像头启动失败:', err);
    if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
      showError('摄像头权限被拒绝。请在浏览器设置中允许摄像头访问，然后刷新页面。');
    } else if (err.name === 'NotFoundError') {
      showError('未检测到摄像头设备，请确认摄像头已连接。');
    } else {
      showError(`摄像头启动失败: ${err.message}`);
    }
    return;
  }

  // 3. 视频就绪后开始检测
  video.addEventListener('playing', () => {
    statusOverlay.classList.add('hidden');
    statusValue.textContent = '检测中';
    statusValue.style.color = '#4CAF50';
    startDetection();
  });
}

// 启动
main();
