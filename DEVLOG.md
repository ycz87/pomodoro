# 🍉 西瓜时钟 — 开发日志

---

## v0.2.2 — Logo 全站替换（2026-02-08）

### 图标更新
- 从 `logo-source.png`（1024x1024）生成全部尺寸图标
- `scripts/generate-icons.mjs`：一键生成脚本（sharp）
- Favicon：16x16, 32x32, 48x48 PNG + 多尺寸 .ico
- PWA：192x192, 512x512
- Apple touch icon：180x180
- Tauri 桌面端：32, 128, 256, 512 + .ico
- SVG：PNG palette 嵌入，11KB
- index.html 更新 favicon 引用

---

## v0.2.1 — 音效系统 4 项修复（2026-02-08）

### Bug 修复
- **自动开始休息失效**：useTimer interval effect 依赖 `[status]`，auto-start 时 status 不变导致 interval 不重启。加 `generation` 计数器，phase 切换时 bump 强制 interval 重建
- **混音器预览**：Modal 打开时进入 preview mode，实时播放/停止音效；`stopAllAmbience()` 在 preview mode 下变 no-op

### 音效拟真度优化
- 雨声：3 层设计（中频基底 + 高频水花 + 低频屋顶轰鸣）+ 慢速强度调制 + 变密度雨滴
- 雷雨：新增闪电劈裂声（高频噪声爆发）→ 触发雷声滚动；更深沉的雷鸣
- 虫鸣：完全重写 — 3-4 只独立蟋蟀，各自音高/节奏/立体声位置
- 鸟鸣：多音符乐句 + 立体声扩展 + 频率滑动

### 保留原有滴答声
- 4 种时钟滴答声加入混音器，新增「🕐 时钟」分类
- 背景音总数：19 种（原 15 + 4 种时钟）

### 改动统计
8 files changed, 407 insertions(+), 129 deletions(-)

---

## v0.2 — 音效系统大改版：自定义混音器 + 提醒音效升级（2026-02-08）

### 自定义背景音混音器
- 全新 `AmbienceMixerModal` 组件：弹窗式混音面板
- 15 种背景音，全部 Web Audio API 实时合成，零音频文件：
  - 🌧️ 自然类（7 种）：雨声、雷雨、海浪、溪流、鸟鸣、风声、虫鸣
  - 🏠 环境类（4 种）：咖啡厅、壁炉、键盘敲击、图书馆
  - 🎵 噪音类（4 种）：白噪音、粉噪音、棕噪音、双耳节拍
- 每个音效独立开关 + 独立音量滑块
- 支持多音效同时叠加组合
- 总音量由设置面板的"背景音量"控制
- 设置面板显示当前组合预览文字（如"雨声 + 白噪音"）+ 「自定义」按钮
- 组合选择和各音效音量持久化到 localStorage

### 提醒音效升级
- 10 种提醒音效（原 3 种 + 新增 7 种）：
  和弦、铃声、自然、木琴、钢琴、电子、水滴、鸟鸣、马林巴、锣声
- 全部 Web Audio API 合成
- `AlertPickerModal` 组件：弹窗选择 + 点击试听
- "提醒时长"改为"循环次数"（1/2/3/5 次）
- 音效按次数循环播放，每次间隔自动计算

### 音频架构重构
- 新建 `src/audio/` 模块，替代旧 `src/utils/notification.ts`
- `context.ts`：共享 AudioContext 单例 + 主音量控制节点
- `ambience/sounds.ts`：15 个 AmbienceSound 子类，基于 OOP 设计
- `alerts/sounds.ts`：10 个 alert 生成函数
- `mixer.ts`：混音器状态管理（启停、音量、配置应用）
- `index.ts`：统一导出

### 设置迁移
- `migrateSettings()` 函数：自动兼容旧版设置格式
- 旧 `sound` → `alertSound`，旧 `tickVolume` → `ambienceVolume`
- `useLocalStorage` hook 新增 `migrate` 参数

### 多语言
- 所有新增文案同步提供中英文翻译
- i18n `Messages` 接口新增：ambienceNames、alertNames、modalClose/Done 等

### 改动统计
- 新增文件：8 个（audio 模块 5 个 + 组件 2 个 + 类型更新）
- 修改文件：7 个（types、i18n、Settings、App、useLocalStorage 等）
- 删除文件：1 个（旧 notification.ts）
- 构建产物：JS 从 254KB → 278KB（+24KB），零音频文件

---

## v0.01 — MVP（2026-02-08）

### commit: 4c9a06a
- 项目搭建：React 19 + Vite 7 + Tailwind CSS 4 + TypeScript
- 核心计时逻辑：`useTimer` hook（工作/短休息/长休息阶段自动切换）
- 圆形进度环 SVG 计时器
- 任务输入框
- 今日完成统计
- 任务记录列表
- 浏览器通知 + 音效提醒
- localStorage 持久化
- 基础响应式布局

---

## v0.02 — 视觉升级（2026-02-08）

### commit: 121762b
- 全面 UI 重设计：现代、极简、精致风格
- 渐变进度环 + 发光头部圆点
- 内发光效果 + 径向渐变背景

### commit: fdf4171
- 根据反馈修复多项视觉问题

### commit: 2165d57 → 62e6b8d → 52c8d26
- 迭代调整进度环亮度、内发光强度、头部光晕大小
- 最终方案：强视觉效果，暗色背景下清晰可见

---

## v0.03 — 功能完善（2026-02-08）

### commit: 957aaef
- 自定义专注/休息时长（1-120 分钟）
- 长休息机制（每 N 轮触发）
- 3 种提醒音效可选（和弦/铃声/自然）

### commit: 0dc6daa
- 修复 Charles 反馈的 4 个问题

### commit: 09e8332
- Header 布局优化
- 番茄生长阶段系统（🌱→🍅，按专注时长分 5 级）
- 记录管理（编辑/删除）

### commit: 2396fd4
- 轮次进度改为圆点指示器，idle 时隐藏

### commit: b8399f5
- 提醒时长可调（1/3/5/10 秒）
- 5 种专注背景音（经典钟摆/轻柔滴答/机械钟表/木质钟声）
- 修复进度环发光裁切问题

### commit: f37cd9e
- 独立音量控制（提醒音 + 背景音）
- 5 套主题系统（暗色/亮色/森林/海洋/暖橙）
- 新手引导弹窗
- 全面代码注释

### commit: 7dc1315 — 庆祝动画 + 休息视觉差异
- `CelebrationOverlay` 组件：弹跳 emoji + 粒子纸屑 + 进度环脉冲 + 鼓励文字
- ≥25min 庆祝效果更强（更多粒子、更大弹跳、发光）
- 休息阶段视觉差异化：背景偏冷色、进度环/按钮切换 breakAccent 色
- 5 套主题全部更新休息配色
- 修复 RoundProgress/TodayStats 硬编码颜色

### commit: a2827e3 — Bug 修复 + 跳过记录
- **Bug**：暂停后可调时间 → 改为 running + paused 都锁定设置
- **Bug**：小屏幕设置按钮被挤 → Header 响应式优化 + z-index
- **功能**：手动跳过（skip）按实际专注时间记录，计入今日收获

### commit: baa498e — PWA 支持
- `vite-plugin-pwa`：generateSW 策略，预缓存所有静态资源
- Google Fonts 运行时缓存（CacheFirst，1 年）
- Web App Manifest：standalone + portrait
- App 图标：SVG 番茄+时钟 → PNG 192/512/180
- iOS meta 标签：web-app-capable、status-bar-style
- `InstallPrompt` 组件：友好安装横幅，关闭后不再弹

### commit: 142a93f
- **Bug**：PWA 打开自动弹键盘 → 删除 TaskInput 的 autofocus useEffect

### commit: 6042870 — 8 项改进
1. **放弃按钮**：计时中显示"放弃本次"，不计入记录
2. **空状态对比度**：用 theme 色替代硬编码 white/20
3. **删除确认**：inline "确认?" 红色文字，2.5s 自动恢复
4. **自动开始休息**（默认开）/ **自动开始工作**（默认关）
5. **快速调时间**：idle 点击数字弹出 8 档时长选择
6. 记录已是倒序（最新在前）✓
7. 数据结构已完整（completedAt ISO + durationMinutes）✓
8. **导出数据**：JSON 文件含记录+设置

### commit: c8d34d5
- README 全量更新，覆盖所有功能

### commit: 14d07e0 → a7dc324 — 放弃按钮样式迭代
- 从文字链接 → 圆角药丸按钮 + 边框
- 最终：`font-semibold` + `theme.text` 透明度底色/边框 + hover 变红

---

## v0.04 — 品牌升级 + 历史统计（2026-02-08）

### commit: b8e9f63 — 番茄→西瓜品牌升级
- 全局文案替换：番茄时钟→西瓜时钟
- PWA manifest name/short_name/description
- 页面 title、header emoji（🍉）、meta 标签
- 使用说明加入"基于番茄工作法（Pomodoro Technique）"
- CSS 选中色：红→绿
- **自定义 SVG 生长图标**（`GrowthIcon` 组件）：
  - 种子发芽：黑色西瓜籽+绿芽
  - 幼苗：绿苗+叶子+卷须
  - 开花：藤蔓+5 瓣黄花
  - 小西瓜：青绿圆形+条纹
  - 成熟西瓜：切开红瓤+黑籽+绿皮
- 所有引用点替换：TodayStats、TaskList、CelebrationOverlay、Guide
- App 图标重新设计：切开西瓜+时钟指针

### commit: 2cbdce1 — 小西瓜图标优化
- 颜色从深绿改为黄绿（#a3e635），模拟未成熟
- 条纹更浅（60% 透明度），个头更小
- 与成熟西瓜（深绿切开红瓤）形成明显对比

### commit: 47a3682 — 历史记录 + 统计图表 + 连续打卡
- **历史面板**（📅 按钮）：底部滑入面板，两个 Tab
- **月历视图**（`MiniCalendar`）：翻月、选日期、有记录日期圆点标记
- **日期详情**：选中某天显示所有记录
- **柱状图**（`BarChart`）：纯 SVG，7/30 天切换，带入场动画
- **汇总卡片**：本周/本月/累计时长+数量
- **连续打卡**：
  - 全自动：当天 ≥1 条记录 = 已打卡
  - Header 显示 🔥N
  - 统计面板：当前连续 + 历史最长
- **统计工具**（`stats.ts`）：分组、打卡计算、汇总、日期工具
- 无第三方图表库，gzip 增量约 3KB

---

## v0.05 — 多语言支持（2026-02-08）

### commit: daadb79
- 自建轻量 i18n 系统：React Context + `useI18n` hook，零第三方依赖
- `Messages` 类型接口（`src/i18n/types.ts`），编译时保证翻译 key 完整
- 完整中英文翻译字典（`src/i18n/locales/zh.ts` / `en.ts`）
- `detectLocale()` 自动检测浏览器语言，匹配不到默认中文
- 语言选择持久化到 `settings.language`（localStorage）
- Settings 面板新增语言切换入口（中文 / EN）
- 切换语言无需刷新：`I18nProvider` 响应 locale 变化即时更新
- 全部 12 个组件从硬编码中文迁移到 `useI18n()`：
  - App, Timer, TaskInput, TaskList, TodayStats, Settings
  - HistoryPanel, MiniCalendar, BarChart, Guide, CelebrationOverlay, InstallPrompt
- 主题名、音效名、生长阶段名等全部走 i18n
- `stats.ts` 的 `formatMinutes` / `getWeekdayShort` 不再被组件直接调用，改用 `t.formatMinutes` / `t.weekdaysShort`
- 17 files changed, 641 insertions(+), 138 deletions(-)

---

## v0.1 — Tauri 桌面应用 + CI 自动构建（2026-02-08）

### commit: (pending — feature/tauri-v0.1)
- Tauri 2.x 集成：手动搭建 `src-tauri` 项目结构
- `Cargo.toml`：tauri 2.10.2 + tray-icon feature + release 优化（LTO、strip、codegen-units=1）
- `tauri.conf.json`：窗口 420×780、系统托盘、NSIS + WiX (Windows)、deb + AppImage (Linux)
- `src/lib.rs` + `src/main.rs`：最小 Rust 入口，opener 插件
- `capabilities/default.json`：Tauri 2.x 权限系统
- `vite.config.ts` 更新：Tauri dev server 配置（固定端口、HMR、忽略 src-tauri）
- 图标生成：32x32、128x128、256x256、512x512 PNG + .ico (Windows)
- GitHub Actions workflow（`.github/workflows/tauri-build.yml`）：
  - 矩阵构建：ubuntu-22.04 + windows-latest
  - push tag `v*` 或手动触发
  - tauri-action 自动构建 + 发布到 GitHub Releases
  - Rust 缓存加速后续构建
- `.gitignore` 更新：排除 `src-tauri/target/`、`gen/`、`Cargo.lock`
- `package.json` 新增 `tauri` 脚本

