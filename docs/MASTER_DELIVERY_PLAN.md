# CatWish Master Delivery Plan

## 1. 当前仓库现实概况

### 1.1 审计范围

本计划基于对主线 git 仓库 `CatWishExpo` 的实际审计，而不是基于外层目录中的文档声明。

已验证的主线仓库现实：

- 主线 git 仓库位于 `CatWishExpo/`，当前分支为 `main`，相对 `origin/main` 处于 `ahead 17`
- 仓库远端为 `origin https://github.com/Yuxin-Shan/catwish-app.git`
- 当前仓库是一个 Expo React Native 应用，尚无真正的后端服务目录
- 仓库外层存在 `.github/` 和大量规划文档，但它们不属于 `CatWishExpo` 这个主线 git 仓库

### 1.2 当前技术现实

#### 应用层

- 运行时：Expo SDK 50 + React Native 0.73 + TypeScript
- 导航：React Navigation Native Stack + Bottom Tabs
- 状态管理：局部 state + 一个未接入主入口的 `AppContext`
- 数据存储：`AsyncStorage`
- AI 调用：客户端内置 provider 模式，支持 `kimi` / `claude` / `gpt4v` / `mock`
- 图片能力：`expo-camera`、`expo-image-picker`、`react-native-view-shot`、`@react-native-camera-roll/camera-roll`

#### 交付层

- `package.json` 已包含 `lint`、`typecheck`、`build:web`、`test`
- `lint` 已可执行，但当前仍有 23 条 warning，属于已文档化的增量清理项
- `typecheck` 已通过
- `build:web` 已通过
- 仓库内已具备 `.github/workflows/ci.yml`
- 当前 CI 已覆盖 frontend、backend、contracts quality gates
- 有 `eas.json`，但当前为未纳管文件，且引用了并不存在的 `scripts/pre-build.sh` / `scripts/post-build.sh`

#### 后端层

- 当前已新增 `backend/` skeleton，使用 Hono + Node server
- 当前 backend 已具备：
  - `/v1/health`
  - `/v1/version`
  - `/v1/auth/register`
  - `/v1/auth/login`
  - `/v1/auth/refresh`
  - `/v1/auth/logout`
  - `/v1/auth/logout-all`
  - `/v1/analysis`
  - `/v1/analysis/:analysisId`
  - env schema
  - request id middleware
  - unified response envelope
  - basic structured logger
- 当前数据库基础已具备：
  - Drizzle config
  - PostgreSQL schema
  - migration generation path
- 当前 shared contracts 基础已具备：
  - `packages/contracts`
  - health/auth/analysis 第一版契约
- 当前仍缺少真实数据库环境、完整业务 API 和移动端 API 接线

### 1.3 真实质量状态

#### 已验证命令

- `npm run lint`
  - 结果：通过
  - 当前结果：`0 errors`，`23 warnings`
  - 说明：
    - 已具备可执行 lint gate
    - 当前 warning 主要为 unused imports / missing deps 等增量治理项
    - lint toolchain 是本轮 Phase A 新补齐的，不再只是脚本占位

- `npm test -- --runInBand`
  - 结果：通过
  - 当前结果：`10/10 suites`，`198/198 tests`，`27 snapshots`
  - 当前状态：
    - 关键测试告警已清理
    - 结果可作为 CI gate 的本地基线

- `npx tsc --noEmit`
  - 结果：通过
  - 已修复：
    - 测试文件 Jest globals typing
    - `src/utils/performance.ts` 的 React typing 问题
    - 多处 navigation / style / duplicate key / async typing 问题

- `npx expo export --platform web`
  - 结果：通过
  - 已修复：
    - `src/services/MemeGenerator.ts` 的平台不兼容导入
  - 当前注意事项：
    - Expo 仍会在本地检测并加载未跟踪的 `.env`
    - 这符合本地开发预期，但需要在 CI 中显式控制环境注入

#### 结论

当前仓库已经完成一轮 Phase A 基线收敛，但仍未满足“可发布工程基线”。它现在更接近：

- 具备稳定本地质量门禁的多模块应用仓库
- 已具备可执行 CI 文件与 backend/contracts 基础
- 但仍缺少真实数据库环境、远端 CI 首轮验证与正式发布链路

### 1.4 功能现实分层

#### 已有但偏本地/前端实现

- 页面导航流程
- 结果页展示
- 本地历史记录 CRUD
- 表情包预览和截图式生成

#### 部分实现

- AI 分析
  - `KimiProvider` 具备真实 HTTP 调用
  - 失败时会自动降级到 Mock
  - `ClaudeProvider` / `GPT4VProvider` 仍存在占位式实现
  - backend 已具备 server-side analysis orchestration skeleton，当前默认 provider 为 mock

- 表情包能力
  - Native 场景有保存/分享能力
  - Web 构建已通过，但仍未接入服务端元数据流转

#### 明确仍为 Mock

- 拍照
- 相册选择
- 裁剪
- Profile 菜单动作

#### 完全缺失

- 用户系统
- 完整后端 API
- 数据库
- 云端同步
- 统一事件分析
- 日志/监控/告警
- CI 工作流
- 验收与发布闸口

### 1.5 与仓库文档声明不一致之处

仓库现有 README 和阶段文档倾向于宣称：

- “Phase 4 已完成”
- “Phase 5 发布准备进行中”
- “类型安全已强化完成”
- “EAS Build 已配置”

但审计现实显示：

- 类型检查当前并不通过
- Web 构建当前失败
- 主线仓库没有可执行 CI
- EAS 配置未纳管，且引用缺失脚本
- 仓库中已跟踪 `.env` 与硬编码 API key，安全基线不合格

### 1.6 当前最高风险

#### P0 风险

- 生产密钥暴露：`src/config/api.ts` 中存在明文 API key，且该文件已纳入版本控制
- `.env` 已被 git 跟踪，环境隔离失效
- 客户端直连第三方 AI，无法隐藏密钥、无法审计、无法做配额与风控
- 无用户系统、无完整后端能力、无真实数据库环境，无法支撑生产数据闭环

#### P1 风险

- lint warning 尚未清零，意味着代码规范债务已经可见但未完全治理
- 新增 lint toolchain 后暴露出 20 个依赖漏洞，需要后续分级处理
- 交付配置与仓库现实不一致，容易产生“文档已完成、流水线不可执行”的假象

## 2. 目标状态定义

目标不是继续维护“可演示原型”，而是演进为可持续交付的应用项目。

### 2.1 目标能力

- 一条清晰的开发 -> 测试 -> 验收 -> 发布链路
- 可执行的 CI/CD 基线
- 明确的环境隔离：`dev / test / staging / prod`
- 真正可用的后端基础：
  - 用户注册 / 登录 / 登出
  - 业务 API
  - 数据库与 migrations
  - 事件分析
  - 日志、监控、错误追踪
- 仓库内长期维护的计划、ADR、backlog、进展记录

### 2.2 平台化补充目标

为更贴近平台工程与 Harness 风格的中心思想，项目不只要“有计划”，还要具备以下平台化能力：

- 将交付能力作为内部平台产品运营
- 提供被验证的 golden paths
- 用工程记分板量化 DevEx、交付和稳定性
- 同时覆盖 Day 1 与 Day 2

对应文档：

- `PLATFORM_OPERATING_MODEL.md`
- `GOLDEN_PATHS.md`
- `ENGINEERING_SCORECARD.md`
- `DATABASE_RUNBOOK.md`

## 3. 目标架构总览

### 3.1 推荐演进路线

推荐采用“单仓库、增量式多模块演进”：

- 当前阶段不立即搬迁 Expo 应用目录，避免大范围移动代码
- 在当前仓库中新增：
  - `backend/`：业务 API 服务
  - `packages/contracts/`：接口契约与共享类型
  - `docs/`：交付与架构治理文档
- 中后期再视需要将移动端迁移到 `apps/mobile/`

### 3.2 前端目标架构

- `src/features/*` 按业务能力拆分：camera、analysis、history、meme、profile、auth
- `src/shared/*` 放 UI、hooks、utils、config、services
- 区分：
  - `mock`
  - `real`
  - `deferred`
- 客户端只调用自有 backend API，不再直接持有第三方 AI 秘钥
- 使用 `expo-secure-store` 保存 refresh token / session material

### 3.3 后端目标架构

推荐方案：

- 运行时：TypeScript + Hono
- 目录分层：
  - `routes/`
  - `controllers/`
  - `services/`
  - `repositories/`
  - `middlewares/`
  - `lib/`
  - `db/`
- API 负责：
  - auth
  - user profile
  - image analysis orchestration
  - analysis history persistence
  - meme metadata
  - event ingestion

合理替代：

- Fastify
- NestJS
- Supabase Edge Functions

权衡：

- Hono 更轻、迁移成本低、适合当前团队体量
- NestJS 架构更重，不适合作为当前阶段的第一步
- 仅靠 Supabase 直连会削弱业务 API 边界和策略控制能力

### 3.4 认证架构

推荐方案：

- 后端签发短期 access token + 轮换 refresh token
- refresh token 存储为数据库中的哈希值
- 客户端通过 `expo-secure-store` 保存 token
- 后端负责：
  - 注册
  - 登录
  - 登出
  - 刷新令牌
  - 会话撤销

合理替代：

- Supabase Auth 托管认证
- 服务端 session + cookie

权衡：

- JWT + refresh token 更适合移动端、多端扩展与未来 API 网关化
- Cookie session 更适合 web-first BFF，不适合作为当前 Expo 移动端主路径
- Supabase Auth 可降低实现成本，但会让业务鉴权策略与账号体系耦合到外部服务

### 3.5 数据与持久化架构

推荐方案：

- PostgreSQL
- ORM / schema：Drizzle ORM
- migrations：Drizzle migrations

首批核心表：

- `users`
- `auth_refresh_tokens`
- `pet_profiles`
- `analysis_requests`
- `analysis_results`
- `meme_assets`
- `user_events`
- `app_releases`

合理替代：

- Prisma
- Supabase Postgres

权衡：

- Drizzle 更贴近 SQL，适合明确控制 schema 与迁移
- PostgreSQL 是后续分析、审计、事件查询的稳定基础

### 3.6 测试架构

推荐分层：

- Frontend unit：组件、hooks、utils
- Frontend integration：screen + navigation + mocked API
- Backend unit：service / repository
- Backend integration：API + DB test container 或本地测试库
- E2E：
  - 移动端关键 happy path
  - 登录
  - 上传 / 分析
  - 历史记录

### 3.7 CI/CD 架构

推荐闸口：

#### CI

- install
- lint
- typecheck
- test
- mobile build smoke
- backend build / test
- secret scanning

#### CD

- `main` -> staging build
- 手工批准 -> production release
- App release notes / changelog
- backend deploy 与 mobile build 分离

### 3.8 可观测性架构

推荐组合：

- Error tracking：Sentry
- Product analytics：PostHog
- Structured logging：backend JSON logs
- Core metrics：
  - 注册转化率
  - 登录成功率
  - 分析请求成功率
  - AI 回退到 Mock 的比例
  - 分析耗时
  - 表情包生成成功率
  - 历史记录同步成功率

## 4. 差距分析

### 4.1 已存在

- Expo 移动端基础
- 页面与主要交互流程
- 初步测试集
- 本地存储层
- 可插拔 AI provider 雏形

### 4.2 缺失

- 后端
- 用户体系
- 数据库
- 云端数据模型
- API 契约
- CI/CD 工作流
- 统一环境管理
- 安全基线
- 可观测性
- 版本化发布流程

### 4.3 快速可修复项

- 增加 `lint` / `typecheck` / `build:web` 脚本
- 修复 TypeScript 基线
- 修复 web 构建失败
- 停止跟踪 `coverage/`
- 建立仓库内 `.github/workflows`
- 将架构与交付文档纳管

### 4.4 中等改造项

- 抽离 API 客户端层
- 去除客户端第三方 AI 直连
- 引入统一 env/config 模式
- 建立 backend skeleton
- 引入 DB schema / migrations

### 4.5 大型结构改造项

- 登录认证闭环
- 历史记录从本地单机存储升级为云端同步
- 分析流程切换为后端编排
- 构建 staging / production 环境链路

### 4.6 应延后项

- 复杂推荐系统
- 多宠物协同
- 社交分享后台
- 大规模运营分析看板

## 5. 分阶段路线图

### Phase A - 基线清理与发布阻塞项移除

目标：

- 建立可信工程基线

范围：

- secrets 治理
- `.gitignore` 整理
- lint/typecheck/build/test 脚本补齐
- 修复 typecheck
- 修复 web build 或明确平台支持边界

验收标准：

- `npm run lint` 通过
- `npm run typecheck` 通过
- `npm test` 通过且告警被清理
- 构建 smoke check 可执行

### Phase B - 工程标准与 CI 基线

目标：

- 建立主线自动闸口

范围：

- GitHub Actions 入仓
- PR 质量门禁
- 版本化质量说明
- 发布前 checklist

验收标准：

- PR 自动跑质量检查
- main 合并受 CI 保护

### Phase C - Backend Skeleton 与数据库基础

目标：

- 建立真实服务端基础

范围：

- `backend/` 初始化
- config、logger、error model
- health endpoint
- DB 连接与第一批 migrations
- API contract 草案

验收标准：

- backend 本地可运行
- health endpoint 可访问
- migrations 可执行

### Phase D - 用户系统与认证

目标：

- 完成注册 / 登录 / 登出 / token refresh

范围：

- 用户表
- refresh token 表
- auth API
- secure storage 客户端接入
- 会话边界

验收标准：

- 真正的用户会话闭环
- 未登录用户受限访问规则明确

### Phase E - 业务 API 与去 Mock 化

目标：

- 将核心业务流从本地/Mock 转为服务端编排

范围：

- `/v1/analysis`
- `/v1/history`
- `/v1/me`
- AI provider server-side orchestration
- 历史记录云端存储

验收标准：

- 关键业务链路不再依赖客户端明文密钥
- 历史数据可跨设备持久化

### Phase F - Analytics / Logging / Monitoring

目标：

- 可观察、可定位、可度量

范围：

- Sentry
- PostHog
- backend structured logging
- 核心事件字典

验收标准：

- 崩溃、API 错误、关键转化可追踪

### Phase G - 测试加固与验收闭环

目标：

- 发布前质量证明可重复

范围：

- integration tests
- e2e smoke
- acceptance checklist
- release notes 模板

验收标准：

- staging 验收流程可执行
- 回滚说明可执行

### Phase H - 生产发布与发布后观测

目标：

- 生产可控发布

范围：

- staging -> production promotion
- phased rollout
- 发布监控
- 发布后复盘

验收标准：

- 生产可发布
- 发布后观测指标可读取

## 6. 当前优先级

### P0

- 完成秘钥轮换与历史治理协同
- 在 GitHub 远端完成 CI 首轮执行验证
- 建立真实 PostgreSQL 环境或明确远程 dev DB 接入方案
- 推进 analysis / auth 到可支撑首个 alpha tag 的端到端闭环

### P1

- lint warning 清理与规则分层
- dependency vulnerability 分级与处置计划
- 移动端切换到 backend auth / analysis API
- acceptance / release / rollback 流程

### P2

- analytics / observability
- acceptance / release / rollback 流程

## 7. 风险登记册

| ID | 风险 | 级别 | 当前状态 | 缓解动作 |
|---|---|---|---|---|
| R-001 | API key 已暴露且入库 | Critical | Partially Mitigated | 当前代码路径已移除明文配置，但仍需立即轮换密钥并治理历史 |
| R-002 | 后端与数据基础不足导致无法生产化 | Critical | Partially Mitigated | backend skeleton、schema、migration path 已就位，继续补真实 DB 环境 + auth + business APIs |
| R-003 | typecheck 失败 | High | Mitigated | 已修复 Jest typings 与相关 TS 基线问题 |
| R-004 | web build 失败 | High | Mitigated | 已修复平台兼容问题并通过 `build:web` |
| R-005 | 无 CI | High | Partially Mitigated | workflow 已入仓，需在 GitHub 远端完成首轮执行验证 |
| R-006 | `coverage/` 被跟踪 | Medium | Mitigated | 已停止跟踪并补齐 ignore 策略 |
| R-007 | 文档状态过度乐观 | Medium | Open | 以审计文档为唯一交付真相源 |
| R-008 | lint toolchain 缺失或不可执行 | High | Mitigated | 已补齐 ESLint toolchain 与基础配置 |
| R-009 | 依赖漏洞未分级治理 | High | Open | 记录 `npm audit` 结果并分阶段清理 |
| R-010 | 本地 `.env` 自动加载与 CI 环境注入边界不清 | Medium | Open | 在 CI/CD 与安全基线中显式定义环境注入策略 |

## 8. 当前阻塞项

- 主线仓库缺少真实 CI
- 缺少真实数据库环境与远端 CI 首轮验证
- 移动端仍未切换到 backend auth / analysis API
- 敏感密钥历史治理仍未完成
- 已迁入 CI workflow，但尚未在 GitHub 远端完成首轮执行验证

## 9. 最近决策摘要

- 决定以 `CatWishExpo` 作为主线转型仓库
- 决定优先“稳定基线”而不是直接扩展后端功能
- 决定采用单仓库增量演进，而不是立即拆多仓
- 决定将所有计划、ADR、backlog、进展日志纳入主线仓库 `docs/`
- 决定补充平台运营模型、golden paths 和工程记分板，避免计划停留在静态架构层
- 决定将 toolchain/bootstrap contract 纳入 `GOLDEN_PATHS.md`
- 决定先迁入最小可执行 GitHub Actions CI，再逐步扩展到 release / deploy workflow
- 决定在 CI 首轮激活前，先将 backend skeleton 纳入主线并接入 backend quality gates
- 决定在 auth 之前先建立 Drizzle schema 与 migration generation 基线
- 决定先以 server-side mock provider 形成 analysis 编排闭环，再接入真实第三方 provider

## 10. 下一执行周期建议

下一周期应继续朝首个 alpha tag 收敛，优先补齐运行链路：

- 在 GitHub 远端触发并观察首轮 CI
- 根据首轮结果调整 warning 策略与 CI fail 条件
- 与仓库管理员协同完成密钥轮换与历史治理
- 明确真实数据库 provisioning / 远程 dev DB 方案
- 开始让移动端逐步切到 backend auth / analysis API
