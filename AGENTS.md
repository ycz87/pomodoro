# AGENTS.md — Codex 项目指南

> 本文件供 Codex CLI 自动加载，描述项目结构和编码约定。

## 技术栈

| 层 | 技术 | 版本 |
|---|------|------|
| 框架 | React | 19 |
| 构建 | Vite | 7 |
| 样式 | Tailwind CSS（@tailwindcss/vite 插件） | 4 |
| 语言 | TypeScript（strict） | 5.9 |
| PWA | vite-plugin-pwa（Workbox generateSW） | 1.2 |
| 移动端 | Capacitor（Android） | 8 |
| Lint | ESLint + typescript-eslint + react-hooks + react-refresh | 9 |

无后端代码在本仓库。API（Cloudflare Workers）和 Auth 服务在独立仓库。

## 目录结构

```
cosmelon/
├── src/
│   ├── App.tsx              # 根组件，编排所有模块
│   ├── main.tsx             # 入口
│   ├── index.css            # Tailwind 入口 + 全局样式
│   ├── types.ts             # 核心类型（PomodoroRecord, Settings, Theme 等）
│   ├── vite-env.d.ts
│   ├── components/          # UI 组件（每个文件一个组件，PascalCase.tsx）
│   ├── hooks/               # 自定义 hooks（useXxx.ts）
│   │   ├── useTimer.ts      # 番茄钟状态机
│   │   ├── useProjectTimer.ts # 项目模式状态机
│   │   ├── useTheme.ts      # 主题 Context
│   │   ├── useAuth.ts       # 登录认证
│   │   ├── useSync.ts       # 云端同步
│   │   ├── useWarehouse.ts  # 仓库（收获物）
│   │   ├── useShedStorage.ts # 瓜棚（种子+道具）
│   │   ├── useFarmStorage.ts # 农场存储
│   │   ├── useAchievements.ts # 成就检测
│   │   └── ...
│   ├── i18n/                # 国际化
│   │   ├── types.ts         # Messages 接口（所有 key 的类型定义）
│   │   ├── index.ts         # Context + useI18n hook + locale 注册
│   │   └── locales/         # 8 种语言：zh/en/ja/ko/de/fr/es/pt
│   ├── achievements/        # 成就系统（定义、检测、徽章映射）
│   ├── farm/                # 农场引擎（生长计算、品种随机）
│   ├── slicing/             # 切瓜系统（逻辑引擎 + Web Audio 音效）
│   ├── audio/               # 音效系统（提醒音 + 背景音 + mixer）
│   ├── types/               # 子系统类型（farm.ts, project.ts, slicing.ts）
│   └── utils/               # 工具函数（stats.ts, time.ts）
├── public/                  # 静态资源
│   ├── badges/              # 44 张成就徽章 PNG
│   └── *.png/ico/svg        # App 图标
├── android/                 # Capacitor Android 工程（自动生成）
├── docs/                    # 设计文档（只读参考）
├── .github/workflows/       # CI/CD（deploy + android + tauri）
├── vite.config.ts
├── tsconfig.json / tsconfig.app.json / tsconfig.node.json
├── eslint.config.js
├── capacitor.config.ts
└── package.json
```

## 代码风格

### 组件
- 函数组件 + hooks，不用 class 组件
- 每个文件导出一个组件，文件名 = 组件名（PascalCase.tsx）
- 组件顶部写 JSDoc 注释，说明用途和关键行为
- Props 用 interface 定义，放在组件文件内

### 样式
- Tailwind CSS utility classes 为主
- 主题色通过 `useTheme()` 获取，用 `style={{ color: theme.text }}` 内联
- 不写自定义 CSS class（除非 Tailwind 无法实现，如 keyframes 动画）
- 项目有 5 套主题，所有颜色必须走 theme 对象，禁止硬编码颜色值
  - 例外：特定语义色（如金西瓜 `#fbbf24`、史诗紫 `#a78bfa`）可以硬编码

### TypeScript
- strict mode，不允许 `any`（用 `unknown` + 类型守卫）
- 类型定义集中在 `src/types.ts` 或 `src/types/*.ts`
- 组件 Props interface 放在组件文件内

### 命名
- 组件：PascalCase（`WarehousePage`）
- 函数/变量：camelCase（`handleSlice`）
- 常量/枚举值：UPPER_SNAKE_CASE（`DISPLAY_ORDER`）
- Hook：`use` 前缀（`useTimer`）
- i18n key：camelCase，模块前缀（`warehouseTitle`、`farmGoFarm`、`shedSliceSection`）

### i18n
- 所有用户可见文本必须走 `useI18n()` hook，禁止硬编码
- 新增 key 步骤：
  1. `src/i18n/types.ts` 的 `Messages` 接口加字段
  2. 8 个 locale 文件全部补上翻译（zh/en/ja/ko/de/fr/es/pt）
- 支持函数类型 key：`(param: string) => string`
- 中文是基准语言，其他语言翻译要自然

### 状态管理
- 无状态管理库，全部用 React useState/useReducer + Context
- 持久化用 localStorage，hook 封装（`useLocalStorage`）
- 云端同步通过 `useSync` hook，本地优先策略

## 构建与验证

```bash
# 类型检查（必须零错误）
npx tsc --noEmit

# 构建（必须成功，chunk size warning 可忽略）
npm run build

# Lint
npm run lint
```

每次改动完成后必须运行 `npm run build` 确认无报错。

## 禁止修改的文件/目录

| 路径 | 原因 |
|------|------|
| `.github/workflows/` | CI/CD 配置，改动需要单独审批 |
| `android/` | Capacitor 自动生成，不要手动改 |
| `wrangler.toml` | Cloudflare 部署配置 |
| `capacitor.config.ts` | 移动端配置 |
| `public/badges/*.png` | 设计资产，不要替换或删除 |
| `docs/` | 设计文档，只读参考 |
| `.env*` | 环境变量/密钥 |

## 注意事项

- `package.json` 的 `version` 字段按任务要求更新
- 不要引入新的 npm 依赖，除非任务明确要求
- 不要删除现有文件，只新增或修改
- 音效用 Web Audio API 合成（见 `src/slicing/audio.ts`），不依赖外部音频文件
- `__APP_VERSION__` 全局变量由 vite.config.ts 注入，来自 package.json
