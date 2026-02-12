
## v0.9.1 — Toast 位置调整（2026-02-12）

### 优化
- 健康提醒 Toast 移至时钟数字正下方，更醒目清晰

---

## v0.9.0 — 快捷选择器 Toast 提示（2026-02-12）

### 新增
- 主页快捷时间选择器选择 >25 分钟时弹出 Toast 提示
- 新增通用 Toast 组件（淡入淡出动画，3.5 秒自动消失）
- Toast 自动适配 5 套主题配色，支持中英文双语

---

## v0.8.9 — 提示展示策略优化（2026-02-12）

### 提示逻辑调整（P0）
- 移除主页面常驻健康提示，减少计时主界面视觉干扰
- 提示改为仅在设置面板 Focus 时长区域条件显示
- 仅当 workMinutes > 25 时展示 tip，聚焦真正需要提醒的场景

---

# 🍉 西瓜时钟 — 版本更新记录

---

## v0.8.8 — 小瓜和大西瓜图标优化（2026-02-12）

### 图标优化（P1）
- 小瓜（Unripe Melon）：从浅黄绿椭圆替换为带深绿色条纹的完整迷你西瓜 SVG
- 大西瓜（Watermelon）：从切开的西瓜替换为带深绿色条纹的完整大西瓜 SVG（未切开）
- 两个图标风格统一，卡通可爱，深色/浅色背景都适配
- 仓库展示和合成区域自动同步

---

## v0.8.7 — 音量滑块尺寸缩小（2026-02-12）

### Slider 尺寸精简（P1）
- 轨道高度从 8px 缩小到 5px，更纤细精致
- 滑块圆点从 22px 缩小到 16px，不再突兀
- 描边、外发光、阴影等比例缩小，整体协调
- Firefox 同步更新 `::-moz-range-track` / `::-moz-range-progress` / `::-moz-range-thumb`
- 所有主题下样式一致，拖动交互不受影响

---

## v0.8.4 — 设置面板滚动条美化（2026-02-12）

### Settings Scrollbar 优化
- 针对设置面板滚动区域新增 `.settings-scrollbar` 自定义样式
- 滚动条宽度设为 7px（细而清晰）
- 轨道使用半透明深色背景，风格更贴合 Dark 主题
- Thumb 使用西瓜红 accent（`rgba(255,59,92,0.5)`），hover 提升亮度
- Firefox 兼容：`scrollbar-width: thin` + `scrollbar-color`

---

## v0.8.3 — Alert Volume 滑块质感升级（2026-02-12）

### Slider 视觉优化（P1）
- Alert Volume 滑块轨道高度从 5px 提升到 8px，提升暗色主题可见性
- 滑块尺寸从 18px 提升到 22px，增加视觉焦点
- 滑块新增 accent 描边 + 外发光，hover/active 时发光更明显
- Firefox 同步更新 `::-moz-range-track` / `::-moz-range-progress` / `::-moz-range-thumb`

### 未填充轨道对比度增强
- `Settings.tsx` 中 `--range-bg` 固定为 `rgba(255,255,255,0.12)`
- 让未填充部分在深色背景下更清晰可见

---

## v0.8.2 — autoStartBreak UI 联动 + 提示文案位置调整（2026-02-12）

### autoStartBreak 开关联动
- workMinutes > 25 时自动关闭 autoStartBreak 并灰掉开关（不可点击）
- workMinutes 改回 ≤25 时开关恢复可用（不自动开启）
- Toggle 组件新增 disabled 支持

### 提示文案位置调整
- 健康提示从页面底部移到设置面板 Focus 时长下方
- 仅 workMinutes > 25 时显示

---

## v0.8.1 — 阈值调整 + 防挂机机制（2026-02-11）

### 专注阈值调整
- 新阈值：seed 5-15min / sprout 16-25min / bloom 26-45min / green 46-60min / ripe 61-90min
- >90min 封顶给 ripe（不触发金西瓜概率）
- 金西瓜概率触发区间改为 61-90 分钟

### 防挂机机制
- >25 分钟专注进入 overtime 模式（计时器到 0 后开始正计时），需手动点 Done 结束
- >25 分钟时 Auto-start Break 自动禁用
- 实际时间超过设定 2 倍 → 不给收获物、不存瓜棚、不播庆祝动画
- 奖励按设定时间（settings.workMinutes）计算，不按实际经过时间
- 项目模式 overtime 超预估 2 倍同样不给奖励
- 健康提示：>25 分钟时显示"需手动结束，记得适时休息 🧘"

### 技术改动
- `types.ts`：getGrowthStage() 新阈值，金西瓜触发区间 61-90
- `useTimer.ts`：新增 overtime phase + overtimeSeconds 正计时
- `Timer.tsx`：overtime 视为 work 相位（控制按钮 + 颜色）
- `App.tsx`：2x 超时检查 + 庆祝抑制 + overtime 文档标题 + 健康提示
- `i18n`：新增 overtimeNoReward + healthReminder 文案

---

## v0.8.0 — 仓库与合成系统（2026-02-11）

### 专注时长阈值调整
- 新阈值：seed 5-14min / sprout 15-24min / bloom 25-44min / green 45-59min / ripe 60-89min
- <5min 不给收获物
- 新增 legendary（金西瓜）阶段：≥90min 且 10% 概率触发
- 保底机制：连续 20 次 ≥90min 未出金西瓜 → 必出

### 仓库系统
- Header 新增 🎒 仓库入口按钮
- 仓库页面：6 种收获物展示（图标 + 数量），3x2 网格布局
- 金西瓜未获得时显示 🔒 + "???"
- 简单统计：总收获数、最高阶收获物、金西瓜解锁状态
- 数据持久化到 localStorage

### 合成系统
- 4 条合成链路：20 种子→1 幼苗、15 幼苗→1 花、10 花→1 小瓜、5 小瓜→1 大西瓜
- 金西瓜不可合成
- 合成按钮 + "合成全部"，数量不足时置灰
- 合成成功 toast 提示

### 金西瓜
- 新增 legendary GrowthStage + 金色西瓜 SVG 图标（带皇冠）
- 金西瓜庆祝效果：8 秒、全屏金色爆炸、10 层光晕、100+ 金色粒子
- 中英文各 5 条专属庆祝文案

### 技术改动
- `types.ts`：新增 legendary 阶段 + rollLegendary() + Warehouse/SynthesisRecipe 接口
- `GrowthIcon.tsx`：新增金西瓜 SVG
- `CelebrationOverlay.tsx`：新增 legendary 庆祝配置
- `useWarehouse.ts`：仓库数据管理 hook
- `WarehousePage.tsx`：仓库页面组件
- `App.tsx`：接入仓库系统 + 收获物自动存入 + legendary 概率判定
- `i18n`：新增仓库/合成/金西瓜相关文案

---

## v0.7.1 — 庆祝系统升级（2026-02-11）

### 分阶段庆祝效果
- 5 个生长阶段各有独立庆祝效果，递进感清晰
- **seed**：底部暖光聚光灯 + 金色光点缓慢上升 + 2 层金色光晕（2s）
- **sprout**：绿色光柱 + 绿叶飘落 + 金色光点 + 3 层绿金光晕（2.5s）
- **bloom**：双侧暖黄射灯 + 花瓣飘落 + 金色纸屑 + 少量礼花 + 旋转放射光芒（3s）
- **green**：多束射灯交错 + 彩色纸屑大量 + 礼花绽放 + 5 层光晕（3.5s）
- **ripe**：全屏金色闪烁 + 满屏礼花 + 随机特效池（礼花连发/纸屑暴风雨/小西瓜掉落/大西瓜滚入）+ 6 层爆炸光晕（4s）

### 四层视觉结构
1. 背景层：radial-gradient 射灯/灯光效果 + opacity 呼吸动画
2. 中间层：收获物图标放大特写 + 多层金色光晕脉动 + 放射光芒旋转（bloom+）
3. 前景层：多种粒子类型（dot/leaf/petal/confetti/firework）
4. 底部：每阶段 5 条随机鼓励文案（中英文）

### 交互
- 点击任意位置可提前关闭
- 所有动效纯 CSS animation，GPU 加速

### 技术改动
- 重写 `CelebrationOverlay.tsx`（四层结构 + 分阶段配置）
- `index.css` 新增 15+ 个庆祝动画
- `i18n/types.ts` 新增 `celebrateSeed/Sprout/Bloom/Green/Ripe` 文案池
- `zh.ts` / `en.ts` 各新增 25 条阶段文案

---

## v0.7.0 — 品牌视觉升级：西瓜化（2026-02-11）

### Dark 主题深度西瓜化
- **进度环配色**：底圈从暗红 → 深绿色（西瓜皮 #2D5A27），进度条从红色 → 西瓜红（#FF3B5C → #FF6B8A 渐变）
- **主强调色**：按钮、高亮等从番茄红 #f43f5e → 西瓜红 #FF3B5C
- **Focus 标签胶囊**：新增西瓜绿底色（subtle rgba(76,175,80,0.15)）
- **Break 标签**：保持原有暖色调不变

### 鼓励语文案西瓜化
- 中文：替换为西瓜主题文案（"种一颗西瓜，收获专注 🍉"、"你的西瓜正在成长中 🌱" 等）
- 英文：替换为西瓜主题文案（"Grow your watermelon, grow your focus 🍉" 等）
- 保持原有随机轮换 + 根据专注数量变化的机制

### 其他主题适配
- 进度环形态（环宽、动画）和 Dark 保持一致
- 其他主题（Light/Forest/Ocean/Warm）进度环配色跟随自身色系，不强制西瓜绿
- 鼓励语文案全主题共享西瓜主题文案

### 技术改动
- `ThemeColors` 新增 `ringBase`/`ringBaseEnd`/`focusLabel` 可选字段
- `Timer.tsx` 进度环底圈支持显式颜色覆盖（不再只用 accent + opacity）
- Focus 标签胶囊支持 `focusLabel` 自定义背景色

---

## v0.6.2 — 优化最后冲刺视觉效果（2026-02-11）

### 优化：渐进式冲刺紧迫感
- **60s–31s**：进度环轻微呼吸闪烁（1.5s 周期），数字加淡淡 glow（accent 色 textShadow）
- **30s–11s**：呼吸加快（1s 周期），glow 更强
- **10s–0s**：数字大幅脉冲（scale 1.0→1.15，0.5s 周期）+ opacity 闪烁（1.0→0.7），进度环快速闪烁 + brightness 变化
- 不再直接变金色（之前像换主题），改为保持原色 + 渐进 glow/动画
- 三个阶段平滑过渡，用户能感受到越来越紧迫

### 技术改动
- `Timer.tsx`：`isFinalSprint` 拆分为 `isSprintT1`/`isSprintT2`/`isSprintT3` 三级
- `index.css`：新增 `animate-sprint-breathe-slow`/`animate-sprint-breathe-fast`/`animate-sprint-flash`/`animate-sprint-digits` 四个动画
- 数字 glow 用 `textShadow` 实现，三级递增强度

---

## v0.6.1 — 周趋势图 + 专注模式增强（2026-02-10）

### 新功能：周趋势图
- 历史面板顶部新增本周专注柱状图（Mon–Sun）
- 今天的柱子用 accent 色高亮，其他天半透明
- 无数据的天显示极矮底线（不完全空白）
- 点击柱子显示具体时长 tooltip
- 底部显示"本周共 Xh Xm"
- 纯 div/CSS 实现，零图表库
- 中英文 i18n 完整覆盖

### 新功能：最后冲刺提示
- 最后 60 秒：进度环颜色从主题色渐变为金色（#FFD700），数字也变金色
- 最后 10 秒：时钟数字轻微脉冲动画（scale 1.0→1.05→1.0，0.8s 循环）
- 效果微妙不打断专注，仅在 work 阶段 running 状态生效

### 新功能：长按完成/放弃（防冲动操作）
- ✓（Done）和 ✗（Give Up）按钮改为长按 1.5 秒确认
- 长按时按钮有 SVG 环形进度动画（从 0% 到 100% 画一圈）
- 短按显示 toast 提示："长按以提前完成" / "长按以放弃"
- 计时自然结束时不需要长按（正常流转到休息）
- Toast 1.5 秒后自动消失

### 技术实现
- `WeekTrendChart` 组件（`src/components/WeekTrendChart.tsx`）
- `Timer.tsx` 新增 `isFinalSprint`/`isFinalCountdown` 检测 + `startLongPress`/`cancelLongPress` 逻辑
- `index.css` 新增 `animate-final-countdown` 动画
- i18n 新增 `weekTrend`、`weekTotal`、`holdToFinish`、`holdToGiveUp`

---

## v0.6.0 — 智能鼓励文案 + 专注数据增强（2026-02-10）

### 新功能：智能鼓励文案
- 新增 `EncouragementBanner` 组件，替代静态标题文字
- 根据今日完成数量、与昨天对比、连续天数自动选择鼓励文案
- 文案规则（优先级从高到低）：
  - 比昨天多 → "已完成X个，比昨天多了Y个 💪"
  - 和昨天持平 → "已完成X个，和昨天持平"
  - 按完成数量：0个（鼓励开始）、1个、2个、3个、4个+
  - 每种情况 2-3 条随机选一条（基于日期+数量的确定性随机，不闪烁）
- Streak 后缀：2天 → "🔥 连续X天"，3天+ → "习惯正在养成"，7天+ → "了不起的坚持"
- 中英文完整覆盖

### UI 改动
- 番茄钟模式：EncouragementBanner 替代 TodayStats 的 "今日收获" 标题
- 项目模式：同样显示 EncouragementBanner
- TaskList 空状态不再显示独立提示（由 Banner 统一处理）
- 不额外占空间，与原有标题位置一致

### 技术实现
- `EncouragementBanner` 组件（`src/components/EncouragementBanner.tsx`）
- `TodayStats` 新增 `hideTitle` prop
- i18n 新增 11 个鼓励文案相关字段
- 复用现有 `getStreak()` 函数计算连续天数

---

## v0.5.5 — 安卓黑屏深度排查 + 全局错误捕获（2026-02-10）

### 排查：安卓黑屏问题持续（v0.5.4 未完全修复）
- Charles 确认 v0.5.4 仍然黑屏，且 ErrorBoundary 的恢复 UI 未显示
- 说明可能不是 React render 错误，或者 Charles 手机上 PWA 缓存了旧版本

### 修复 & 诊断措施
1. **全局错误捕获** — `window.onerror` + `window.onunhandledrejection`，错误直接渲染到页面底部红色面板（不依赖 React）
2. **ErrorBoundary 增强** — 显示具体错误信息，帮助远程诊断
3. **useTimer 相位切换 try-catch** — 包裹整个 phase completion effect
4. **ambience effect try-catch** — 包裹 applyMixerConfig/stopAllAmbience
5. **版本号角标** — 页面右下角显示 `v0.5.5`，确认 PWA 缓存已更新
6. **请 Charles 清除 PWA 缓存后重试**

---

## v0.5.4 — 修复安卓黑屏 + 错误边界（2026-02-10）

### 修复：安卓 Chrome 专注结束后黑屏（P0）
- **根因：** `new Notification()` 在安卓 Chrome 中会抛出 TypeError（安卓要求通过 ServiceWorker 发送通知）。该错误发生在 `handleTimerComplete` 回调中，未被捕获，导致 React 渲染崩溃，整个组件树卸载，页面只剩深色背景（黑屏）
- **修复：**
  - `sendBrowserNotification` 改为优先使用 `ServiceWorkerRegistration.showNotification()`，桌面端回退到 `new Notification()`，外层加 try-catch
  - `handleTimerComplete` 和 `handleSkipWork` 回调加 try-catch 防护，错误只 console.error 不崩溃
  - 新增 `ErrorBoundary` 组件包裹整个 App，即使未来有未捕获的渲染错误也显示友好的恢复 UI 而非黑屏

### 防御性改进
- 新增 `ErrorBoundary` 组件（`src/components/ErrorBoundary.tsx`）
- 显示 🍉 图标 + "出了点问题" + 刷新按钮，替代空白黑屏
- 所有 timer 完成回调加 try-catch 防护

---

## v0.5.3 — 修复手机端专注结束黑屏（2026-02-10）

### 修复：专注时间结束后页面黑屏（P0）
- **根因：** 根容器使用 `transition-all duration-[1500ms]`，当 work→break 阶段切换时，`linear-gradient` 背景无法被 CSS 平滑插值，导致移动端浏览器在 1.5s 过渡期间渲染异常（黑屏/内容消失）
- **修复：**
  - `transition-all` → `transition-colors`：只过渡颜色属性，避免意外过渡 layout 属性（min-height/flex 等）
  - `linear-gradient` 背景 → 纯 `backgroundColor`：移除不可动画的渐变，改用纯色背景（视觉差异极小，原渐变仅 100%→90% 透明度）
- **影响：** 阶段切换背景色过渡更稳定，移动端不再出现黑屏闪烁

---

## v0.5.2 — PC 鼠标拖拽滚动（2026-02-10）

### 新功能：鼠标拖拽滚动页面
- PC 端按住鼠标左键上下拖动即可滚动页面，体验接近手机触摸滑动
- 松手后有惯性滚动效果（friction 0.95 衰减）
- 拖拽中鼠标显示 `grabbing` 光标
- 智能排除交互元素：button/input/select/textarea/a/label/[role=button]/[role=slider] 及其子元素不触发拖拽
- 支持 `data-no-drag-scroll` 属性手动排除特定区域
- 手机端触摸滑动不受影响

### 技术实现
- 新增 `useDragScroll` hook（`src/hooks/useDragScroll.ts`）
- 全局 window 级 mousedown/mousemove/mouseup 监听，passive 模式
- 速度计算使用指数移动平均（EMA），惯性用 requestAnimationFrame 驱动

---

## v0.5.1 — 隐藏滚动条（2026-02-10）

### 优化：隐藏页面滚动条
- 全局 CSS 隐藏滚动条，保留滚动功能（鼠标滚轮、触摸滑动正常）
- 兼容 Chrome/Safari（`::-webkit-scrollbar`）、Firefox（`scrollbar-width: none`）、IE/Edge（`-ms-overflow-style: none`）

---

## v0.5.0 — 正计时/倒计时切换（2026-02-10）

### 新功能：点击时钟数字切换正计时/倒计时
- 计时进行中（running/paused），点击时钟数字区域可在倒计时和正计时之间切换
  - 倒计时（默认）：显示剩余时间，从设定时间往下走
  - 正计时：显示已经过的时间，从 00:00 往上走
- 只改变显示方式，不影响实际计时进度（切换前后时间加起来等于总时长）
- 切换时数字有轻微缩放动画（scale 0.95→1.0），提供视觉反馈
- 偏好保存到 localStorage（`pomodoro-timer-display-mode`），刷新后保持
- 所有主题、番茄钟模式和项目模式下均可正常切换
- 超时（overtime）状态下不可切换，保持原有 "+MM:SS" 显示
- idle 状态下点击数字仍为快速调时间（原有行为不变）

### 技术实现
- `Timer.tsx` 新增 `TimerDisplayMode` 类型和 `loadDisplayMode()` 读取函数
- 点击区域仅限时钟数字 `<span>`，不与其他点击事件冲突
- 中英文 i18n 新增 `toggleTimerMode` 提示文案

---

## v0.4.9 — Bug 修复（2026-02-10）

### 修复：返回上一个任务再完成不再重复累加记录/奖励/时间
- `ProjectTaskResult` 新增 `previousSeconds` 字段，标记 revisit 场景
- `ProjectState` 新增 `revisitPreviousSeconds` 字段，`goToPreviousTask` 时记录已有秒数
- `recordTaskResult` 完成时携带 `previousSeconds`，完成后清除标记
- `handleProjectTaskComplete`（App 层）根据 `previousSeconds` 判断：
  - 正常完成：创建新 PomodoroRecord
  - Revisit 完成：更新已有记录的 durationMinutes（总时间），不新增

### 修复：休息阶段进度环从正确位置开始
- **根因：** break 阶段 `currentTaskIndex` 已指向下一个任务，但 `totalDuration` 错误地取了下一个任务的 `breakMinutes`，而 `timeLeft` 是用上一个任务的 `breakMinutes` 初始化的
- **修复：** break 阶段 `totalDuration` 改为取 `tasks[currentTaskIndex - 1].breakMinutes`，与 `timeLeft` 一致

---

## v0.4.8 — 多项修复 + 新功能（2026-02-10）

### P0 修复：刷新后拒绝继续仍自动倒计时
- 恢复 `useTimer` countdown interval 的 `status !== 'running'` guard（上一版文档 commit 误删）
- 修复后 idle/paused 状态下 interval 不再运行

### 新功能：Logo 替换 + 品牌文字
- 替换为 Charles 提供的透明背景 PNG logo（640x640 RGBA）
- Header 左上角：更大的 Logo（w-7/w-8）+ 品牌文字（跟随 i18n：西瓜时钟 / Watermelon Clock）
- 移动端响应式：窄屏隐藏文字，只显示 Logo
- 全套 favicon / PWA / Tauri 图标重新生成

### 新功能：提醒音持续循环选项
- 新增 `alertRepeatCount = 0` 表示持续循环直到用户操作
- 设置面板新增「持续」/「Loop」选项按钮
- `playAlertRepeated` 支持 setInterval 循环模式
- 新增 `stopAlert()` 函数，全局 click/keydown 监听自动停止

### 修复：项目模式 3 个逻辑 Bug
- **休息结束无视 autoStartWork**：break 结束时检查设置，未开启则暂停等用户操作
- **退出→重新开始进度虚增**：`restartCurrentTask` 移除 abandoned result，进度不再 +1
- **返回上一个任务超时不累计**：从历史 result 恢复实际 elapsedSeconds，移除旧 result 防重复

### 修复：延迟 abandoned callback 防止重复奖励
- `exitCurrentTask` 不再立即触发 App 层 callback
- callback 延迟到最终确认时刻（goToNextTask / abandonProject）
- 重新开始 / 返回上一个任务路径不触发 callback，避免重复记录

---

## v0.4.7 — Logo 替换 + 品牌文字（2026-02-10）

### 新 Logo（矢量 SVG）
- 基于 Charles 提供的原图手绘矢量 SVG，替换旧的 base64 嵌入式 PNG
- 核心元素：绿色瓜皮外圈、白色过渡环、红色果肉表盘（径向渐变）、6 颗西瓜籽、深绿色时钟指针（10:10）、Kawaii 表情（圆点眼睛 + 微笑弧线）
- 全套图标重新生成：favicon（16/32/48 + .ico）、PWA（192/512）、Apple touch icon（180）、Tauri 桌面端（32/128/256/512 + .ico）

### Header 品牌升级
- Logo 尺寸从 w-5 (20px) 增大到 w-7/w-8 (28-32px)，改用 SVG 源文件（无损缩放）
- 新增品牌文字 `t.appName`：中文显示「西瓜时钟」，英文显示「Watermelon Clock」
- 文字样式：`text-sm font-semibold`，颜色跟随 `theme.text`
- 移动端响应式：窄屏隐藏文字（`hidden sm:inline`），只显示 Logo，避免挤压 ModeSwitch

---

## v0.4.6 — Bug 修复（2026-02-10）

### Bug 1（P2）：项目模式两步退出弹窗文案与动作不一致
- `ProjectExitModal` 新增 `isBreak` prop，break 阶段跳过 step 1（无任务可退出），直接显示选择面板
- 弹窗挂载时 `useEffect` 重置 step 为 'confirm'，避免重复打开时残留旧状态
- 所有按钮加 300ms 互斥锁，防止快速连点导致状态分叉

### Bug 2（P2）：Break 阶段 ✓ 按钮与退出操作状态冲突
- `Timer.tsx` 新增 `guardedAction` 包装 ✓ 和 ✗ 按钮回调，300ms 内互斥
- 使用 `useRef` 锁而非 state 锁，避免额外渲染

### Bug 3（P3）：亮色主题下部分次级文字对比度不足
- Light 主题 `textMuted` 从 `rgba(0,0,0,0.6)` 提升至 `rgba(0,0,0,0.65)`
- Light 主题 `textFaint` 从 `rgba(0,0,0,0.25)` 提升至 `rgba(0,0,0,0.35)`
- Light 主题 `border` 从 `rgba(0,0,0,0.08)` 提升至 `rgba(0,0,0,0.10)`

### Bug 4（P3）：中英文切换后个别标签延迟刷新
- `App.tsx` 主容器 `<div>` 添加 `key={settings.language}`，语言切换时强制重建整个 UI 树，确保所有组件即时获取新翻译

### Bug 5（P2）：移动端窄屏下按钮换行导致点击热区不稳定
- `Timer.tsx` 所有控制按钮添加 `min-w-[44px] min-h-[44px]` / `min-w-[52px] min-h-[52px]`
- `ProjectExitModal` 所有按钮添加 `min-h-[44px]`
- `ConfirmModal` 按钮添加 `min-h-[44px]` + `whitespace-nowrap`

---

## v0.4.5 — Bug 修复（2026-02-10）

### Bug 1（P0）：项目模式退出后选"下一个"跳过任务
- 重构 `currentTaskIndex` 推进时机：进入 break 时立即 +1，break 结束后不再 +1
- 新增 `pausedFrom` 字段记录暂停前的 phase，确保 resume 正确恢复
- 同步修复 recovery 逻辑

### Bug 2（P1）：项目模式 break 阶段进度显示错误
- break 阶段 progressLabel 不再 +1，显示已完成数（如 "1/3"）

### Bug 3（P1）：break 阶段 ✓ 按钮可跳过休息
- `completeCurrentTask` 在 break 阶段跳过休息，直接进入下一个任务

### Bug 4（P1）：番茄钟 skip 后休息不自动开始
- `skip` 现在检查 `autoStartBreak`/`autoStartWork`，为 true 时自动开始

### Bug 5（P2）：项目模式 abandoned 任务不记录到历史
- `handleProjectTaskComplete` 现在记录 abandoned 且 ≥1min 的任务，status 标记为 'abandoned'

---

## v0.4.4 — 全主题对比度修复（2026-02-10）

### 主题颜色 token 调整（WCAG AA 标准）
- Dark: textMuted 0.4→0.55, textFaint 0.15→0.3
- Light: text 0.85→0.87, textMuted 0.45→0.55, textFaint 0.12→0.25, inputBg 0.04→0.06
- Forest: textMuted 0.5→0.65, textFaint 0.15→0.3
- Ocean: textMuted 0.5→0.65, textFaint 0.15→0.3
- Warm: textMuted 0.5→0.65, textFaint 0.15→0.3

### 新增 `border` 颜色 token
- 所有主题新增 `border` token，替代硬编码的 `rgba(255,255,255,0.06)`
- Light 主题使用 `rgba(0,0,0,0.08)`，深色主题使用各自色系的 0.08-0.1

### 亮色主题兼容修复
- ModeSwitch: 硬编码白色背景→theme.inputBg/theme.border
- Timer 数字: 硬编码白色→theme.text
- TaskInput: 硬编码白色边框/背景→theme.border/theme.inputBg
- placeholder 颜色改为 CSS 变量，跟随 theme.textMuted

### 项目模式对比度修复
- ProjectSetup: 任务序号、"min" 单位、休息时间 textFaint→textMuted
- ProjectTaskBar: 进度标签 textFaint→textMuted
- HistoryPanel: 时长、时间等次要信息 textFaint→textMuted

### 分割线统一
- 所有组件的 borderColor 从 theme.textFaint→theme.border

---

## v0.4.3 — UI 打磨第二轮（2026-02-10）

### 播放按钮再克制
- boxShadow 从 `0 2px 16px 40%` → `0 2px 12px 30%`
- 三角图标缩小 2px（20×24 → 18×22）

### 输入框对比度提高
- 边框从 `rgba(255,255,255,0.08)` → `rgba(255,255,255,0.12)`
- placeholder 颜色从 `rgba(255,255,255,0.25)` → `rgba(255,255,255,0.35)`
- 加内阴影 `inset 0 1px 2px rgba(0,0,0,0.2)` 增强凹陷感

### 底部空白优化
- 输入框到统计卡片间距从 24px 缩小到 16px
- 空状态加 🌱 emoji

### 设置页触控目标
- Stepper 按钮（−/+）从 w-7 h-7 → w-8 h-8
- Theme 选择器 padding 从 px-2.5 py-1.5 → px-3 py-2

---

## v0.4.2 — UI 系统性改版（2026-02-09）

### Header 重构
- 去掉 "Watermelon Clock" 文字，只保留 🍉 logo 图标
- Pomodoro / Project 切换改为居中 Segmented Control（iOS 胶囊风格，滑动指示器）
- 去掉 ? 帮助图标（移入设置页底部"使用说明"按钮）
- Header 高度 48px，分割线 `rgba(255,255,255,0.06)`
- 背景改为 surface 80% 透明度 + backdrop-blur(16px)

### 计时数字提权
- 字重 200→300，颜色纯白 `rgba(255,255,255,0.95)`
- 去掉 textShadow，加 `font-variant-numeric: tabular-nums` 防数字跳动

### 播放按钮降权
- 尺寸 56px→52px，boxShadow 从 `0 4px 24px 40%` 降为 `0 2px 16px 25%`

### Phase 标签升级
- 从裸文字改为胶囊标签：accent 12% 背景 + rounded-full + 14px/600

### 输入框增强
- 背景 `rgba(255,255,255,0.06)`，边框 `rgba(255,255,255,0.08)`
- 聚焦时边框 accent 40%，placeholder `rgba(255,255,255,0.25)`
- 圆角 16px→12px

### 空状态优化
- TaskList 无记录时只显示一行浅色小字"今日尚无记录"

### 设置页分组
- 四组分组标题：⏱ 计时 / 🔔 提醒 / 🎨 外观 / ⚙ 通用
- Section Header 12px/600/accent/uppercase/tracking-wider
- Section 间距 24px，Header→首项 12px，项间 16px

### Toggle 开关色
- 激活色从红色 accent→绿色 #34C759（iOS 标准）

### Theme 选择器
- 改为 3 列网格（grid-cols-3），避免孤儿换行

### 背景色微调（dark 主题）
- bg/bgWork/bgBreak/surface 四色微调，整体稍亮

### 分割线统一
- 所有分割线统一为 `rgba(255,255,255,0.06)`

### 间距系统（8pt 网格）
- Header→32px→Phase→16px→进度环→24px→控制按钮→24px→输入框→24px→统计卡片

---

## v0.4.1 — UI 视觉升级 + 版本号显示（2026-02-09）

### 版本号显示
- 设置菜单（齿轮弹窗）最底部显示当前版本号
- 版本号从 package.json 自动读取，Vite define 注入，改一处即可
- package.json version 从 0.0.0 更新为 0.4.0

### 质感提升
- 进度环更精致：环宽 10→8，加外发光效果，底环透明度降低
- 计时数字悬浮感：字重 300→200，加微妙 text-shadow
- ✗/✓ 按钮改为 SVG 图标（交叉线 / 勾号，圆角端点）
- 任务输入框：背景色提升 + 1px 边框 + 聚焦态主题色边框 + placeholder 颜色提升
- Header 毛玻璃效果：backdrop-blur + sticky 定位 + 底部分割线
- 统计区域卡片化：surface 背景 + 圆角 + 微妙边框

### 氛围感
- 背景微妙渐变（顶部→底部稍亮 2-3%）
- 阶段切换过渡放慢至 1.5s
- 西瓜图标 idle 时呼吸动画（3s 循环）

### 品牌感
- Logo 绿色光晕（drop-shadow）
- dark 主题色调整：番茄红→西瓜红（rose-500 #f43f5e）

---

## v0.1 — Tauri 桌面应用（2026-02-08）

### 桌面应用
- 通过 Tauri 2.x 将 Web 应用打包为原生桌面应用
- 支持 Windows（.msi + .exe NSIS 安装包）和 Linux（.deb + .AppImage）
- 体积远小于 Electron（Tauri 使用系统 WebView）
- 窗口默认 420×780，可调整大小，最小 360×600
- 系统托盘支持（托盘图标 + tooltip）
- 桌面端功能与 Web 端完全一致

### 自动构建 & 发布
- GitHub Actions 矩阵构建：Windows + Linux 同时构建
- 推送 `v*` tag 或手动触发自动构建
- 构建产物自动发布到 GitHub Releases
- Rust 编译缓存加速后续构建

### Release 优化
- LTO（Link-Time Optimization）减小二进制体积
- 代码剥离（strip）移除调试符号
- 单 codegen unit 最大化优化效果

---

## v0.4 — 番茄钟与项目模式交互重构（2026-02-09）

### 番茄钟简化
- **去掉长休息/轮次系统**：纯"专注→休息"无限循环
- **去掉轮次指示器**（圆点进度）
- **退出需确认**：弹窗确认后记录标记为未完成
- **任务名称可选**：不输入自动生成"专注 #N"（今天第几个）
- 设置面板精简：删除长休息时长、长休息间隔

### 项目模式退出重构
- **两步退出流程**：确认退出 → 选择下一步
  - 🔄 重新开始本任务
  - ⏭️ 下一个任务（最后一个→结束项目）
  - ⏮️ 返回上一个任务（超时继续）
- **退出整个项目**选项
- 退出的任务标记为"已退出"

### 记录系统增强
- `PomodoroRecord` 新增 `status` 字段（completed/abandoned）
- `ProjectTaskResult` 新增 abandoned/overtime-continued 状态
- 历史记录显示任务名称和状态

---

## v0.3.1 — 项目模式交互优化（2026-02-08）

### 超时行为简化
- **超时默认继续计时**：子任务超时后不再弹出提示，默认继续计时
- 进度环变红 + 数字变红显示 "+MM:SS" 保留，用户可感知超时状态

### 统一按钮布局
- **番茄钟和项目模式完全一致**：✗（左）⏸/▶（中）✓（右）
- ✗ 按钮：番茄钟放弃本次 / 项目跳过子任务
- ✓ 按钮：番茄钟手动完成 / 项目完成子任务
- 休息阶段自动隐藏 ✗/✓，只保留暂停/继续
- 删除底部"放弃本次"文字按钮

### Bug 修复
- **修复完成子任务后白屏**：break 阶段误触 ✓/✗ 导致状态越界崩溃，现已加 phase 保护

---

## v0.3 — 项目计时模式（2026-02-08）

### 新功能：项目模式
- **创建项目**：输入项目名称，添加多个子任务
- **子任务设置**：每个子任务可设定名称、预计时间、休息时间
- **自动推进**：子任务按顺序执行，中间自动插入休息
- **复用番茄钟界面**：计时环节使用相同的进度环、西瓜生长、背景音，上方增加任务信息条
- **超时处理**：超时后默认继续计时，进度环变红 + 数字显示 "+MM:SS"
- **超时视觉反馈**：进度环变红脉冲 + 计时数字变红显示 "+MM:SS"
- **✓/✗ 按钮**：完成或跳过当前子任务，操作更直观
- **中途调整**：执行中可插入新任务、删除未来任务
- **完成总结**：预计 vs 实际时间对比，每个子任务时间条形图
- **中断恢复**：关闭浏览器后重新打开，可恢复未完成项目
- **历史记录**：项目记录保存到历史面板，按日期查看
- **西瓜生长**：子任务完成按实际时长计入西瓜生长系统

### UI
- 首页新增模式切换：🍉 番茄钟 / 📋 项目模式
- 计时中模式切换锁定，防止误操作
- 项目工作阶段播放背景音

---

## v0.2.4 — 背景音即时生效 + 新时钟音效（2026-02-08）

### Bug 修复
- **专注中修改背景音即时生效**：在专注计时过程中打开混音器修改背景音，关闭弹窗后新的背景音立即播放，无需暂停再继续

### 新增 4 种时钟音效（共 8 种）
- 🕰️ 老式座钟 — 低沉有共鸣的深沉滴答
- ⌚ 怀表 — 清脆细腻的快速 tick-tock
- 🎵 电子节拍器 — 干净的电子点击，4 拍重音
- 💧 水滴计时 — 水滴音色 + 涟漪回响

---

## v0.2.3 — 体验修复 + 新背景音（2026-02-08）

### Bug 修复
- Header 显示实际产品 Logo（替换 emoji）
- 设置面板不再因点击弹窗内部而误关闭
- 时钟滴答声音量提升 3-4 倍
- 咖啡厅音效完全重做（更真实的多层环境音）

### 新增 6 种背景音（总计 25 种）
- 🏕️ 篝火 — 温暖的噼啪声 + 偶尔木头爆裂
- 🎹 轻音乐 — 柔和的随机钢琴音符
- 🐱 猫咪呼噜 — 低频呼噜声，有呼吸节奏
- 🌙 夜晚 — 轻风 + 远处蟋蟀 + 偶尔猫头鹰
- 🚂 火车 — 铁轨节奏咔嗒声 + 车轮轰鸣
- 🫧 水下 — 深沉水声 + 气泡上浮

---

## v0.2.2 — Logo 全站替换（2026-02-08）

- 新 logo 替换到所有位置：favicon、PWA、Tauri 桌面端、apple-touch-icon
- 多尺寸 favicon（16/32/48 + .ico）
- SVG 版本
- 图标生成脚本 `scripts/generate-icons.mjs`

---

## v0.2.1 — 音效修复（2026-02-08）

### Bug 修复
- 修复"自动开始休息"失效问题
- 混音器 Modal 支持实时预览（不需要在专注时间才能听到）

### 音效改善
- 雨声更有层次感（3 层混合 + 强度变化）
- 雷雨新增闪电劈裂声 + 深沉雷鸣
- 虫鸣完全重写（多只蟋蟀此起彼伏）
- 鸟鸣优化（多音符乐句 + 立体声）

### 保留原有滴答声
- 经典钟摆、轻柔滴答、机械钟表、木质钟声回归
- 作为混音器「🕐 时钟」分类，可与其他背景音叠加
- 背景音总数：19 种

---

## v0.2 — 音效系统大改版（2026-02-08）

### 自定义背景音混音器
- 全新混音面板：弹窗式 UI，列出所有可用背景音
- **15 种背景音**，全部 Web Audio API 实时合成，零音频文件：
  - 🌧️ 自然类（7 种）：雨声、雷雨、海浪、溪流、鸟鸣、风声、虫鸣
  - 🏠 环境类（4 种）：咖啡厅、壁炉、键盘敲击、图书馆
  - 🎵 噪音类（4 种）：白噪音、粉噪音、棕噪音、双耳节拍
- 每个音效独立开关 + 独立音量滑块
- 支持多音效同时叠加组合（如"雨声 + 壁炉 + 棕噪音"）
- 设置面板显示当前组合预览 + 「自定义」按钮
- 总音量由"背景音量"滑块统一控制
- 组合配置持久化到 localStorage

### 提醒音效升级
- **10 种提醒音效**：和弦、铃声、自然、木琴、钢琴、电子、水滴、鸟鸣、马林巴、锣声
- 全部 Web Audio API 合成，弹窗选择 + 点击试听
- "提醒时长"改为"循环次数"（1/2/3/5 次），音效按次数循环播放

### 技术亮点
- 全新 `src/audio/` 模块化音频引擎，替代旧 `notification.ts`
- OOP 设计：每种背景音一个 AmbienceSound 子类
- 旧版设置自动迁移，向后兼容
- 构建产物仅增加 ~24KB（gzip ~5KB），零音频文件
- 中英文翻译完整覆盖所有新增文案

---

## v0.05 — 多语言支持（2026-02-08）

### 中英文双语
- 支持中文（默认）和英文两种语言
- 自动检测浏览器语言，匹配不到默认中文
- 用户可在设置面板手动切换（中文 / EN）
- 语言选择持久化到 localStorage，切换无需刷新页面

### 全量文案覆盖
- 标题、按钮、设置面板所有选项标签
- 统计面板（连续打卡、趋势图表、汇总卡片）
- 历史记录面板（日期、记录详情）
- 使用说明弹窗、庆祝文字、新手引导
- PWA 安装提示、日历星期/月份、图表标签
- 页面标题（document.title）跟随语言切换

### 技术方案
- 自建轻量 i18n 系统：React Context + `useI18n` hook，零第三方依赖
- `Messages` 类型接口保证编译时翻译完整性
- 支持函数类型翻译（动态参数：时间格式化、连续天数等）
- 扩展新语言只需新建 locale 文件 + 注册

---

## v0.04 — 品牌升级 + 历史统计（2026-02-08）

### 品牌升级：番茄 → 西瓜
- 全部 UI 文案从"番茄"更名为"西瓜"
- PWA 应用名称、页面标题、meta 标签同步更新
- 使用说明注明"基于番茄工作法（Pomodoro Technique）"
- App 图标重新设计为切开的西瓜 + 时钟指针

### 自定义 SVG 西瓜生长图标
替换所有 emoji，改为 5 个手绘 SVG 图标：
- 种子发芽（<10min）— 黑色西瓜籽冒出小绿芽
- 幼苗生长（10-14min）— 绿苗 + 叶子 + 西瓜藤卷须
- 开花期（15-19min）— 藤蔓上开出黄色小花
- 小西瓜（20-24min）— 浅绿/黄绿色未成熟小西瓜
- 成熟西瓜（≥25min）— 切开露出红瓤 + 黑籽

### 历史记录
- 新增 📅 按钮，打开底部滑入面板
- 月历视图：可翻月浏览，有记录的日期显示圆点标记
- 点击任意日期查看当天的完整记录（任务、时长、生长图标、完成时间）

### 统计图表
- 纯 SVG 柱状图：最近 7 天 / 30 天专注时长趋势
- 柱子带入场动画，今天高亮显示
- 汇总卡片：本周时长、本月时长、累计总时长、累计完成数量
- 图表配色跟随当前主题，无第三方图表库

### 连续打卡
- 全自动：当天完成 ≥1 个西瓜钟即视为打卡
- 主页 Header 显示 🔥 当前连续天数
- 统计面板展示当前连续天数 + 历史最长连续天数

---

## v0.03 — 体验完善（2026-02-08）

### 自定义时长 & 长休息
- 专注时长 1-120 分钟可调
- 短休息 1-30 分钟、长休息 1-60 分钟
- 每 2-6 轮触发一次长休息

### 音效系统
- 3 种提醒音效：和弦、铃声、自然
- 5 种专注背景音：经典钟摆、轻柔滴答、机械钟表、木质钟声
- 提醒时长可调（1/3/5/10 秒）
- 提醒音量和背景音量独立控制

### 主题系统
- 5 套主题：经典暗色、纯净亮色、森林绿、海洋蓝、暖橙色
- 工作/休息阶段背景色、进度环、按钮颜色全部跟随主题

### 生长阶段系统
- 根据专注时长显示不同生长阶段（5 级）
- 今日收获区域展示所有完成的生长图标

### 庆祝动画
- 完成西瓜钟时：弹跳图标 + 粒子纸屑 + 进度环脉冲 + 鼓励文字
- ≥25 分钟的庆祝效果更强烈

### 休息视觉差异
- 工作阶段偏暖色调，休息阶段偏冷色调
- 标题、进度环、按钮、背景色全部跟随阶段切换
- 平滑 transition 过渡动画

### PWA 支持
- 可安装到手机/电脑桌面，standalone 模式运行
- Service Worker 离线缓存（静态资源 + Google Fonts）
- iOS Safari "添加到主屏幕"支持
- 友好的安装提示横幅（关闭后不再弹出）

### 操作改进
- 放弃按钮：计时中可放弃本次，不计入记录
- 手动完成：跳过时按实际专注时间记录
- 删除确认：inline "确认?" 提示，防止误删
- 自动开始休息（默认开）/ 自动开始工作（默认关）
- 快速调时间：idle 时点击数字弹出时长选择器
- 导出数据：JSON 文件包含所有记录 + 设置
- 新手引导弹窗

### Bug 修复
- 暂停后可调时间 → running + paused 都锁定设置
- 小屏幕设置按钮被挤 → Header 响应式优化
- PWA 打开自动弹键盘 → 移除 autofocus

---

## v0.02 — 视觉升级（2026-02-08）

### 全面 UI 重设计
- 现代极简风格，深色背景
- 渐变进度环 + 发光头部圆点
- 内发光效果 + 径向渐变
- 经过多轮迭代调整亮度、光晕、对比度

---

## v0.01 — MVP（2026-02-08）

### 核心功能
- 番茄工作法计时：25 分钟专注 + 5 分钟休息
- 圆形进度环 SVG 计时器
- 任务输入框：为每个番茄钟标记任务
- 今日完成统计
- 任务记录列表
- 浏览器通知 + 音效提醒
- localStorage 本地存储
- 响应式布局

### 技术栈
- React 19 + TypeScript
- Vite 7
- Tailwind CSS 4
