# 🍉 西瓜时钟 — 开发日志

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
