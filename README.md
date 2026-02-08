# 🍉 西瓜时钟

简洁优雅的专注计时器，基于番茄工作法（Pomodoro Technique）。

**在线体验：** [pomodoro-puce-seven-98.vercel.app](https://pomodoro-puce-seven-98.vercel.app/)

## 功能

### 核心
- **番茄工作法** — 专注 → 短休息 → 重复 N 轮 → 长休息，自动循环
- **灵活时长** — 专注 1-120 分钟，休息 1-60 分钟，轮次 2-6 可调
- **快速调时间** — idle 时点击计时器数字，快速切换常用时长（5/10/15/20/25/30/45/60min）
- **任务标记** — 为每个西瓜钟标记正在做的事，完成后可编辑
- **手动完成** — 跳过时按实际专注时间记录，给予对应生长阶段奖励
- **放弃本次** — 计时中可放弃，不计入记录

### 西瓜生长系统
自定义 SVG 图标，根据专注时长显示不同生长阶段：
- 🌱 种子发芽（<10min）→ 🌿 幼苗生长（10-14min）→ 🌼 开花期（15-19min）→ 🍈 小西瓜（20-24min）→ 🍉 成熟西瓜（≥25min）

### 庆祝动画
- 西瓜钟完成时弹跳生长图标 + 粒子纸屑 + 进度环脉冲 + 鼓励文字
- 成熟西瓜（≥25min）庆祝效果更强烈

### 休息视觉差异
- 工作偏暖色调，休息偏冷色调（蓝/靛/紫）
- 进度环、按钮、标题、背景色全部跟随阶段切换
- 平滑 transition 过渡

### 自动化
- **自动开始休息**（默认开启）— 工作结束后自动进入休息倒计时
- **自动开始工作**（默认关闭）— 休息结束后自动开始下一个西瓜钟

### 音效
- 3 种提醒音效（和弦 / 铃声 / 自然）
- 5 种专注背景音（经典钟摆 / 轻柔滴答 / 机械钟表 / 木质钟声）
- 独立音量控制 + 提醒时长可调

### 主题
5 套主题，全局适配：
- 🌑 经典暗色 · ☀️ 纯净亮色 · 🌲 森林绿 · 🌊 海洋蓝 · 🔥 暖橙色

### 数据
- **今日统计** — 完成数量 + 总专注时长
- **任务列表** — 可编辑、可删除（inline 确认，不误删）
- **导出数据** — 设置面板一键导出 JSON（记录 + 设置）
- **本地存储** — 数据保存在浏览器 localStorage，无需注册

### PWA
- 📱 可安装到手机/电脑桌面，standalone 模式运行
- 📶 离线可用（Service Worker 预缓存所有静态资源 + Google Fonts）
- 🍎 iOS Safari "添加到主屏幕"支持
- 友好的安装提示横幅（关闭后不再弹出）

### 其他
- 浏览器通知提醒
- 页面标题实时显示倒计时
- 新手引导弹窗
- 响应式布局，移动端友好

## 技术栈

- [React](https://react.dev/) 19 + [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vite.dev/) 7
- [Tailwind CSS](https://tailwindcss.com/) 4
- [vite-plugin-pwa](https://vite-pwa-org.netlify.app/) — Service Worker + Web App Manifest
- [Vercel](https://vercel.com/) — 部署

## 本地运行

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览生产版本
npm run preview
```

## 项目结构

```
src/
├── components/
│   ├── Timer.tsx              # 核心计时器（圆形进度环 + 控制按钮）
│   ├── CelebrationOverlay.tsx # 完成庆祝动画（粒子 + 弹跳图标）
│   ├── GrowthIcon.tsx         # 西瓜生长阶段 SVG 图标（5 阶段）
│   ├── TaskInput.tsx          # 任务输入框
│   ├── TodayStats.tsx         # 今日完成统计
│   ├── TaskList.tsx           # 完成任务列表（编辑/删除）
│   ├── RoundProgress.tsx      # 轮次进度指示器
│   ├── Settings.tsx           # 设置面板（时长/音效/主题/导出）
│   ├── InstallPrompt.tsx      # PWA 安装提示横幅
│   └── Guide.tsx              # 新手引导弹窗
├── hooks/
│   ├── useTimer.ts            # 计时逻辑（阶段切换/自动开始/庆祝）
│   ├── useLocalStorage.ts     # localStorage 封装
│   └── useTheme.ts            # 主题上下文
├── utils/
│   ├── notification.ts        # 音效 + 浏览器通知
│   └── time.ts                # 时间格式化
├── types.ts                   # 类型定义 + 主题配色 + 生长阶段
├── App.tsx                    # 主应用
├── index.css                  # 全局样式 + 动画
└── main.tsx                   # 入口
```

## License

MIT
